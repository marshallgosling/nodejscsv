

const AWS = require('aws-sdk');
const csv = require('@fast-csv/parse');
AWS.config.update({
    accessKeyId: '{AWS_KEY}',
    secretAccessKey: '{AWS_SECRET}',
    region: '{SNS_REGION}'
});
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();
const table = "CSVDATA";

const sns = new AWS.SNS();
const topicARN = "topicARN";
/*
Sample lambda event json
{
  "Records":[
    {
      "eventVersion":"2.0",
      "eventSource":"aws:s3",
      "awsRegion":"us-west-2",
      "eventTime":"1970-01-01T00:00:00.000Z",
      "eventName":"ObjectCreated:Put",
      "userIdentity":{"principalId":"AIDAJDPLRKLG7UEXAMPLE"
      },
      "requestParameters":{

      },
      "responseElements":{
      },
      "s3":{
        "s3SchemaVersion":"1.0",
        "configurationId":"testConfigRule",
        "bucket":{
          "name":"sourcebucket",
          "ownerIdentity":{
            "principalId":"xxxxx"
          },
          "arn":"arn:aws:s3:::sourcebucket"
        },
        "object":{
          "key":"Sample.csv",
          "size":1024,
          "eTag":"d41d8cd98f00b204e9800998ecf8427e",
          "versionId":"096fKKXTRTtl3on89fVO.nfljtsv6qko"
        }
      }
    }
  ]
}

 */


exports.handler = async (event, context, callback) => {

    // Read options from the event parameter.
    const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    // 获取S3对象
    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey
        };
        var csvFileStream = s3.getObject(params).createReadStream();

    } catch (error) {
        console.log(error);

        sns.publish({TopicArn: topicARN, Message:`s3 error:${JSON.stringify(error, null, 2)}`});

        return;
    }

    // 解析CSV文件
    csv.parseStream(csvFileStream)
        .on('error', (error) => {
            console.error(error);
            sns.publish({TopicArn: topicARN, Message:`parseCSV error:${JSON.stringify(error, null, 2)}`});
        })
        .on('data', (row) => {
            console.log(`ROW=${JSON.stringify(row)}`)

            var params = {
                TableName:table,
                Item:row
            };

            // 按行方式插入DynamoDB，可以考虑批量插入
            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    sns.publish({TopicArn: topicARN, Message:`dynamoDB error:${JSON.stringify(err, null, 2)}`});
                } else {
                    //console.log("Added item:", JSON.stringify(data, null, 2));
                }
            });

        })
        .on('end', (rowCount) => {
            //console.log(`Parsed ${rowCount} rows`);

        });

}
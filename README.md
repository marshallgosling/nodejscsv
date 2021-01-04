NodeJS 测试题
----

功能实现要求
----
* 接受S3 Put Event
* 判断该 Event中的文件是否是指定的CSV格式（格式附后）
* 如果是指定的文件格式，将文件解析后存储到DynamoDB
* 如果不是，设计一个错误，并将错误输出到一个SNS Topic中。
* 从CloudFormation或serverless， terraform任何一种部署方式，并给出具体实现。

> Node版本需求：node14  npm

环境配置
-----
```
#aws-sdk
npm install aws-sdk 

#fast-csv
npm i -S fast-csv

#@fast-csv/parse
npm i -S @fast-csv/parse
```

CSV Sample
-----
```
latitude,longitude,address
-43.58299805,146.89373497,"840 COCKLE CREEK RD, RECHERCHE TAS 7109"
-43.58259635,146.89402117,"833 COCKLE CREEK RD, RECHERCHE TAS 7109"
-43.58169878,146.89824631,"870 COCKLE CREEK RD, RECHERCHE TAS 7109"
-43.58095637,146.88651178,"810 COCKLE CREEK RD, RECHERCHE TAS 7109"
-43.58079479,146.88701991,"812 COCKLE CREEK RD, RECHERCHE TAS 7109"
-43.58074011,146.88635117,"808 COCKLE CREEK RD, RECHERCHE TAS 7109"
-43.58056905,146.88637626,"806 COCKLE CREEK RD, RECHERCHE TAS 7109"
```

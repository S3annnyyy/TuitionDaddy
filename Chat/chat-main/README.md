# tuitiondaddy-chat

## Prerequisites

### AWS Items
> Make sure to have an IAM user created with S3FullAccess Created (In IAM console)

> Copy the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and place into the .env later

> Create a AWS Bucket too that allows ACL for PUBLIC and public access for the bucket

### Install Bun locally (Without Kubernetes)
```bash
npm i -g bun
```
### Make a .env file for environment variables needed in src folder
```bash
# Place the values below in your env file. Make sure to change all values that have <>

AWS_ACCESS_KEY_ID=<YOUR_AWS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_KEY>
AWS_BUCKET_NAME=<YOUR_AWS_BUCKET_NAME>

MONGO_URL=mongodb://localhost:27017
AMQP_URL=amqp://localhost
DB_NAME=<DESIRED_DB_NAME>
WEB_SOCKET_PORT=<DESIRED_WEB_SOCKET_PORT>
EXPRESS_PORT=<DESIRED_EXPRESS_PORT>
```

## To install dependencies:

```bash
cd src
bun install
```

## To run:

```bash
bun run index.ts
```

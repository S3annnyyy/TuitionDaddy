# tuitiondaddy-chat

## Prerequisites

### AWS Items
> Make sure to have an IAM user created with S3FullAccess Created (In IAM console)

> Copy the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and place into the .env later

> Create a AWS Bucket too that allows ACL for PUBLIC and public access for the bucket

## Kubernetes run and installation
### Install Kubernetes
Follow the guide according to your system: https://kubernetes.io/docs/tasks/tools/

### Installing kind and kubectl
```bash
# With MAC: 
brew install kind

# With Windows (Install chocolatey) then:
choco install kind
```

### Create cluster and deploy containers in it
```bash
# Create a kind cluster
kind create cluster --name tuitiondaddychat

# Crate docker secrets for access
kubectl create secret docker-registry docker-secret --docker-username=<YOUR_USERNAME> --docker-password=<YOUR_PASSWORD> --docker-email=<YOUR_EMAIL>
# Note if you are using Google login, you would instead use a docker access token that replaces it: https://hub.docker.com/settings/security

# Navigate to the k8s folder
cd k8s

# Create a base64 of your AWS access and secret keys
## ON MAC
echo -n '<YOUR_ACCESS_KEY>' | base64 
echo -n '<YOUR_SECRET_ACCESS_KEY>' | base64
## ON WINDOWS
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("<YOUR_ACCESS_KEY>"))
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("<YOUR_SECRET_ACCESS_KEY>"))

# Create a secret.yaml in the k8s folder and replace the values from above
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
type: Opaque
data:
  AWS_ACCESS_KEY_ID: <base64-encoded-access-key>
  AWS_SECRET_ACCESS_KEY: <base64-encoded-secret-key>

# Now navigate backwards and apply all the yaml files
cd ../
kubectl apply -f /k8s
```
### Port forwarding your needed services
```bash
kubectl port-forward service/chat-app 30000:3000 # For app (compulsory)
kubectl port-forward service/chat-app 30001:3001 # For fileupload app (compulsory)
kubectl port-forward service/mongodb 27017:27017 # For local mongodb management (optional)
kubectl port-forward service/rabbitmq 5672:5672 # For RabbitMQ local access (optional)
kubectl port-forward service/rabbitmq 15672:15672 # For RabbitMQ management console (optional)
```

### Access app
Access app through http://localhost:30000 and http://localhost:30001 for fileupload
Others the same ports above

## Running locally (NO kubernetes) (NOTE YOU need to setup MongoDB and RabbitMQ yourself)

### Install Bun in your global npm
```bash
npm i -g bun
```

### To install dependencies:

```bash
cd src
bun install
```

### Make a .env file for environment variables needed in src folder
```bash
# Place the values below in your env file. Make sure to change all values that have <>

AWS_ACCESS_KEY_ID=<YOUR_AWS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_KEY>
AWS_BUCKET_NAME=<YOUR_AWS_BUCKET_NAME>
AWS_DEFAULT_REGION=ap-southeast-1

MONGO_URL=mongodb://localhost:27017
AMQP_URL=amqp://localhost
DB_NAME=<DESIRED_DB_NAME>
WEB_SOCKET_PORT=<DESIRED_WEB_SOCKET_PORT>
EXPRESS_PORT=<DESIRED_EXPRESS_PORT>
```

### To run:
```bash
bun run server.ts
```
### Access app
App should be running on http://localhost:3000 and http://localhost:3001 for file upload

## Miscellaneous

### Pushing to your own private Docker repository account
```bash
# Make sure you have logged in 
docker build -t <DOCKER_USERNAME>/tuitiondaddychat ./

docker push <DOCKER_USERNAME>/tuitiondaddychat:latest
```

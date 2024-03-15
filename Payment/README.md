# Payment API For TuitionDaddy

## Prerequisites

### Creating Stripe Accounts and connecting accounts
```
Get MAIN ACCOUNT, with a stripe key through creating your stripe account

Go to https://dashboard.stripe.com/test/apikeys and find your API key

Copy your publishable key and secret key, they will need to replace parts at the code

At the makePayment.html:
Replace <YOUR_STRIPE_PUBLISHABLE_KEY> with the copied key

Create SELLER ACCOUNT which is another Stripe account to act as the seller

On your MAIN Stripe account:
Go to https://dashboard.stripe.com/test/connect/accounts/overview and select "Create" on the top left

Select "Account type": Standard # If you are unable to do so, follow the error and enable auth
Click "Create" and open the link on another browser
You will be prompted to link the email for the seller account

After done you can go back to the main account and find the connecting ACCOUNTID prefixed : acct_XXXXXX
Copy that which will be used for <LINKED_ACCOUNT_ID> in makePayment.html
```

### Creating Supabase account and DB connection string
```
Make an account and project in Supabase for your Postgresql database https://supabase.com/
> After creating, locate to the project and click on the green button "Connect"
> Select "Golang" under connection string and copy it
> The value would be your DB .env variable value
```

### Install go packages for project
```
go get -u -v -f all
```
### Setting up .env values
```
# Create a .env file in the root of payment folder and place these values
STRIPE_KEY=<YOUR_STRIPE_KEY>
PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>
DB=<YOUR_SUPABASE_DB_CONNECTION>
```

## Running Application

### Running application (Docker mode)
```
The file has been created into a docker image so you would just need to build it

docker build -t payment-image:1.0 ./

docker run -d -p 8080:8080 -e STRIPE_KEY=<YOUR_SECRET_KEY> payment-image:1.0
```

### Running application (CompileDaemon mode)
```
go mod install
CompileDaemon -command="./payment.exe"
```

## Accessing Swagger Documentation
```
# Run the application and access http://localhost:8080/swagger/index.html
```

## Regenerating Documentation (Swagger)
```
swag init
# Paste swagger.yaml content to https://swagger-markdown-ui.netlify.app/
```

## Controller Method Routes
### /payment

#### POST
##### Summary:

Card Payment

##### Description:

Make a card Payment in Stripe

Note: For PaymentMethodID value you must retrieve first to the Stripe api before making this request.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Body | body | Parameters | Yes | [models.PaymentBody](#models.PaymentBody) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | A successful response. | [models.PaymentResponse](#models.PaymentResponse) |
| 400 | Failed to read body. | [models.PaymentError](#models.PaymentError) |
| 500 | Failed to save payment information. | [models.PaymentError](#models.PaymentError) |

### /refund/{payment_intent_id}

#### PATCH
##### Summary:

Refund Payment

##### Description:

Refunds a payment made through Stripe

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| payment_intent_id | path | Payment Intent ID | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Refund processed and recorded successfully. | [models.RefundResponse](#models.RefundResponse) |
| 400 | Payment has already been refunded. | [models.PaymentError](#models.PaymentError) |
| 404 | Payment record not found. | [models.PaymentError](#models.PaymentError) |
| 500 | Failed to update payment record as refunded. | [models.PaymentError](#models.PaymentError) |

### Models


#### models.PaymentBody

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Description | string |  | Yes |
| PaymentMethodID | string |  | Yes |
| Price | number |  | Yes |
| SellerID | string |  | Yes |
| StripeAccountID | string |  | Yes |
| UserID | string |  | Yes |

#### models.PaymentError

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| error | string |  | No |

#### models.PaymentResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| PaymentIntentID | string |  | No |

#### models.RefundResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | No |
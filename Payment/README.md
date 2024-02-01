# Payment API For TuitionDaddy

## Prerequisites
```
Get a stripe key through creating your stripe account

Go to https://dashboard.stripe.com/test/apikeys and find your API key

Copy your publishable key and secret key, they will need to replace parts at the code

At the index.html:
Replace <YOUR_STRIPE_PUBLISHABLE_KEY> with the copied key
```

## Running application
```
The file has been created into a docker image so you would just need to build it

docker build -t payment-image:1.0 ./

docker run -p 8080:8080 -e STRIPE_KEY=<YOUR_SECRET_KEY>

```

## For Paynow payment
```
Route: /paynow
Body: {
    "Amount": anyDoubleVal
}

*** NOTE: You would need to use this function with confirmPayNowPayment on the frontend and the stripe script. 
data.clientSecret is retrieving the response.

stripe.confirmPayNowPayment(
    data.clientSecret,
).then((res) => {
    handleSuccess(res);
});
<script src="https://js.stripe.com/v3/"></script>

Response: {
    "clientSecret": stringVal
}
```
## For Card/Googlepay payments
```
Route: /payment
Body: {
    "Amount": anyDoubleVal
}

*** NOTE: It will return a URL which on the frontend needs to redirect for the payment
Response: {
    "url": stringVal
}

```
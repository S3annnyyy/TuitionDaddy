# TuitionDaddy
Group project component of SMU IS213 Enterprise Solution Development module 

## Frontend Installation
Make sure you have `nodejs v21.7.1` or higher and `pnpm` installed. Install dependencies with:
```
pnpm install
```
Once it's done start up a local server with:
```
pnpm run dev
```
To create a production build:
```
pnpm run build
```

## Microservices installation
Ensure you have Docker Desktop installed and all `.env` files configured for each microservice. Once that done, spin up microservices with: 
```
docker compose up --build
```

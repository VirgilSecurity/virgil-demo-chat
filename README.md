# Virgil Demo Chat

In this guide we’ll create a basic chat application using **Virgil** technologies stack for end-to-end encryption.

## Publish

There are only few steps required to setup Virgil History service :)

```
$ git clone https://github.com/VirgilSecurity/virgil-demo-chat.git
$ cd ./virgil-demo-chat/dynamodb

$ npm install
$ npm start
```

Use url [http://localhost:8090](http://localhost:8090) to open your Demo Chat

## Configuration

```
$ cp ./server/.env.example ./server/.env
```
Set Virgil & AWS environment variables declared in `.env` file.

### Gather Virgil App information

The first thing we need to do is grab all the necessary information from our Virgil Dev [account](https://developer.virgilsecurity.com/dashboard/):


| Variable Name                     | Description                    |
|-----------------------------------|--------------------------------|
| VIRGIL_APP_ID                            | The APP_ID uniquely identifies your application in our services, it is also used to identify the Public key generated in a pair with ``appKey`` |
| VIRGIL_APP_KEY_PATH               | The path to your Private key (*.virgilkey) file, you generated for your application  |
| VIRGIL_APP_KEY_PASSWORD   | The application's Private key password.  |
| VIRGIL_APP_ACCESS_TOKEN               | The access token is a unique string value that provides an authenticated secure access to the Virgil services and is passed with each API call. The accessToken also allows the API to associate your requests with your application and Virgil developer’s account.. |






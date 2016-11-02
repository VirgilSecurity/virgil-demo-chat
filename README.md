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

The first thing we need to do is grab all the necessary information from our Virgil Dev [account](https://developer.virgilsecurity.com/dashboard/):


| Variable Name                     | Description                    |
|-----------------------------------|--------------------------------|
| APP_ID                            | The APP_ID uniquely identifies your application in our services, it is also used to identify the Public key generated in a pair with ``appKey`` |
| APP_KEY_PATH               | The path to your Private Key(*.virgilkey) file, you generated for your application  |
| APP_KEY_PASSWORD   | The application's Private Key password.  |
| ACCESS_TOKEN               | The access token provides authenticated secure access to Virgil Keys Services and is passed with each API call. The access token also allows the API to associate your app’s requests with your Virgil developer's account. |






# Virgil Demo Chat

In this guide we’ll create a basic chat application using **Virgil** technologies stack for end-to-end encryption.

## Gather account information

The first thing we need to do is grab all the necessary information from our Virgil Dev [account](#https://developer.virgilsecurity.com/dashboard/). To initialize our *Virgil SDK* Client, we will need four values from our account:


| Variable Name                     | Description                    |
|-----------------------------------|--------------------------------|
| APP_ID                            | The APP_ID uniquely identifies your application in our services, it is also used to identify the Public key generated in a pair with ``appKey`` |
| APP_KEY_PATH               | The path to your Private Key(*.virgilkey) file, you generated for your application  |
| APP_KEY_PASSWORD   | The application's Private Key password.  |
| ACCESS_TOKEN               | The access token provides authenticated secure access to Virgil Keys Services and is passed with each API call. The access token also allows the API to associate your app’s requests with your Virgil Security developer's account. |






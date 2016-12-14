# Virgil Demo Chat

In this guide we’ll create a basic chat application using **Virgil** technologies stack for end-to-end encryption.

## Gather account information

The first thing we need to do is grab all the necessary information from our Virgil Dev [account](https://developer.virgilsecurity.com/dashboard/):


| Variable Name                     | Description                    |
|-----------------------------------|--------------------------------|
| AWS_ACCESS_KEY_ID                 | AWS access key ID. [Read here](http://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html) for more information|
| AWS_SECRET_ACCESS_KEY             | Key to make requests to AWS |
| VIRGIL_APP_CARD_ID                            | The APP_ID uniquely identifies your application in our services, it is also used to identify the Public key generated in a pair with `appKey` |
| VRIGIL_APP_PRIVATE_KEY               | Base64 encoding of Private Key(*.virgilkey), you generated while creating your application  |
| VIRGIL_APP_PRIVATE_KEY_PWD   | The application's Private Key password.  |
| VIRGIL_ACCESS_TOKEN               | The access token provides authenticated secure access to Virgil Keys Services and is passed with each API call. |
| JWT_SECRET          | Secret string used to sign JWTs |

## Setup Aamzon DynamoDB tables

> TODO

## Local development

To run the server locally clone the repository switch to repository root directory and run the following commands:

```shell
npm install
```

```shell
npm start
```

The server should now be listening on http://localhost:8090

## API Usage

## Authentication

Authentication is done with JSON Web Token using Bearer schema. To get a token either register a new user account or
log in with existing one. After that set the `Authorization` header for every outgoing request with the value of `Bearer <token>`.

### Register user

Register new user by creating a Virgil Card for her.
Go through the steps necessary to generate and `CreateCardRequest`, sign it with just the owner key then export and send.
Virgil Card's identity will become the username.
You'll get back a JWT that must be sent along with further requests that require authentication

#### Request
```
POST /users/register
```

```json
{
  "card_request": "fgtgP57rKRIcFh+1ZluNwRFO8uPBZzXAdQFoZ8wyue1434dPi1CzEWQtsh8545358I00XxWSrrHB88l5TcJmBb9W/QRIeK5yJSd7pYR9cMBapskU1s3g62vIdYBgRO5NPZgh+w2IPRcyswNIylqbIn6Sn450QpLsu0skqudYCsk="
}
```

#### Response
```json
{
  "token": "ebJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aXJnaWxDYXJkSWQiOiIzNDQzNDY0OTlhZjM5ZTlmNjRkMDkxNTM1Y2EzOTZkZTMxOTUzNTI5MTFhMzg4ZmY1OWNjZTk2ZWJhN2IwNTQ2IiwidXNlcm5hbWUiOiJ2YWRtaW4iLCJpZCI6IjUzZGNlZTYxLTVlZjItNGU2Mi04Yjk5LWJjODJjZWY4MjZkOCIsImRhdGFDcmVhdGVkIjoxNDc5ODk2MjEwMTkyLCJpc09ubGluZSI6ZmFsc2UsImlhdCI6MTQ3OTk4MTMzN30.MlfjPN6lSq9ZOxgRpRiqHjNBI0t6ApzqkteczALjY1o"
}
```

### Login

Login with existing user account.
Returns a JWT that must be sent along with further requests that require authentication

#### Request
```
POST /users/login
```

```json
{
  "username": "alice"
}
```

#### Response
```json
{
  "token": "ebJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aXJnaWxDYXJkSWQiOiIzNDQzNDY0OTlhZjM5ZTlmNjRkMDkxNTM1Y2EzOTZkZTMxOTUzNTI5MTFhMzg4ZmY1OWNjZTk2ZWJhN2IwNTQ2IiwidXNlcm5hbWUiOiJ2YWRtaW4iLCJpZCI6IjUzZGNlZTYxLTVlZjItNGU2Mi04Yjk5LWJjODJjZWY4MjZkOCIsImRhdGFDcmVhdGVkIjoxNDc5ODk2MjEwMTkyLCJpc09ubGluZSI6ZmFsc2UsImlhdCI6MTQ3OTk4MTMzN30.MlfjPN6lSq9ZOxgRpRiqHjNBI0t6ApzqkteczALjY1o"
}
```

## Working with Channels

### Get list of channels available for current user (requires authentication)

Get the list of channels where current user is one of the members.
A user is a member of a channel if she has created said channel or has been explicitly added to the channel by another member


#### Request
```
GET /channels
```

#### Response
```json
[
  {
    "id": "aac9d92b-6a38-4785-b57f-b6ab46cf9108",
    "name": "random",
    "dateCreated": 1479906682979,
    "members": ["5048e5d3-cea3-4f1e-bbc0-b66c74c4f37d","53dcee61-5ef2-4e62-8b99-bc82cef826d8"],
    "ownerId": "53dcee61-5ef2-4e62-8b99-bc82cef826d8",
    "ownerName": "vadmin",
    "virgilCardId": "c61f40635b47a8ed05a4d2386084d37d9f48cf44422e8e834e7265cb0ecc1517",
    "publicKey": "MCowBQYDK2VwAyEAqjMRGdW6XqzjreMdA6xDvLExKtzDH2ANB8XQBAlwjBg=",
  }
]
```
- `dateCreated` - Unix timestamp

### Get channel by ID (requires authentication)

#### Request
```
GET /channels/:channel_id
```

#### Response
```json
{
  "id": "aac9d92b-6a38-4785-b57f-b6ab46cf9108",
  "name": "random",
  "dateCreated": 1479906682979,
  "members": ["5048e5d3-cea3-4f1e-bbc0-b66c74c4f37d","53dcee61-5ef2-4e62-8b99-bc82cef826d8"],
  "ownerId": "53dcee61-5ef2-4e62-8b99-bc82cef826d8",
  "ownerName": "vadmin",
  "virgilCardId": "c61f40635b47a8ed05a4d2386084d37d9f48cf44422e8e834e7265cb0ecc1517",
  "publicKey": "MCowBQYDK2VwAyEAqjMRGdW6XqzjreMdA6xDvLExKtzDH2ANB8XQBAlwjBg="
}
```
- `dateCreated` - Unix timestamp

### Create new channel (requires authentication)

Create a new channel by creating a Virgil Card for it.
Go through the steps necessary to generate and `CreateCardRequest`, sign it with just the owner key then export and send.
Virgil Card's identity will become the channel's name.

#### Request
```
POST /channels
```

```json
{
  "card_request": "fgtgP57rKRIcFh+1ZluNwRFO8uPBZzXAdQFoZ8wyue1434dPi1CzEWQtsh8545358I00XxWSrrHB88l5TcJmBb9W/QRIeK5yJSd7pYR9cMBapskU1s3g62vIdYBgRO5NPZgh+w2IPRcyswNIylqbIn6Sn450QpLsu0skqudYCsk="
}
```

#### Response
```json
{
  "id": "aac9d92b-6a38-4785-b57f-b6ab46cf9108",
  "name": "random",
  "dateCreated": 1479906682979,
  "members": ["5048e5d3-cea3-4f1e-bbc0-b66c74c4f37d","53dcee61-5ef2-4e62-8b99-bc82cef826d8"],
  "ownerId": "53dcee61-5ef2-4e62-8b99-bc82cef826d8",
  "ownerName": "vadmin",
  "virgilCardId": "c61f40635b47a8ed05a4d2386084d37d9f48cf44422e8e834e7265cb0ecc1517",
  "publicKey": "MCowBQYDK2VwAyEAqjMRGdW6XqzjreMdA6xDvLExKtzDH2ANB8XQBAlwjBg="
}
```
- `dateCreated` - Unix timestamp

## Working with Messages

### Get messages from particular channel (requires authentication)

> Currently only last 50 messages will be returned

#### Request
```
GET /channels/:channel_id/messages
```

#### Response
```json
[
  {
    "id": "744958df-4460-40a6-83f5-340ae67fc9e1",
    "author": "username",
    "body": "Uar6bQNzJT87vToBXHOlQWamBpkYDbtV651pW/9rLAmsjPy4e0ZG4vIcakXUVFk0y4MkmXYZ/B6jdTkKJWryWQ==",
    "dateCreated": 1479919943234,
    "channelId": "aab5d92b-6a38-4785-b57f-b6ab46cf9108"
  }
]
```

- `dateCreated` - Unix timestamp
- `body` - Base64 encoding of encrypted message body

## Working with Users

### Search (requires authentication)

Search for users who are currently *online* by username

#### Request
```
GET /users/search?query=va
```

#### Response
```json
[
  {
    "id": "53dcee61-5ef2-4e62-8b99-bc82cef826d8",
    "username": "valkilmer",
    "virgilCardId": "c61f40635b47a8ed05a4d2386084d37d9f48cf44422e8e834e7265cb0ecc1517"
  }
]
```

## Chat

> It is assumed you're using [socket.io](http://socket.io) for socket communication.
> All code examples in this section are written in JavaScript

### Authentication

Incoming socket connections must be authenticated with JWT obtained after login/registration.

```javascript
var socket = io.connect();
socket.on('connect', function () {
  socket
    .emit('authenticate', {token: jwt}) //send the jwt
    .on('authenticated', function () {
      //do other things
    })
    .on('unauthorized', function(msg) {
      console.log("unauthorized: " + JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    })
});
```

After receiving `authenticated` message you can safely start chatting.

### Using channels

#### Join

In order to send\receive messages to\from a channel you have to explicitly `join` it.

```javascript
socket.emit('join channel', { channelId: channelId });
```

#### Leave

You can also leave the channel you've joined to stop receiving messages from it.

```javascript
socket.emit('leave channel', { channelId: channelId });
```

#### Add new members

You can add users as members to the channel.

```javascript
socket.emit('add members', {
  channelId: currentChannelId,
  channelKey: channel_private_key_encrypted_with_public_keys_of_members_being_added.toString('base64'),
  memberIds: [ userId1, userId2 ]
});
```

#### Sending messages

```javascript
socket.emit('post message', {
  channelId: currentChannelId,
  body: message_body_encrypted_with_channel_public_key.toString('base64')
});
```

### Server events

#### authenticated

The user has been authenticated.

Payload: none.

#### unauthorized

Token sent by client is invalid.

Payload:

```json
{
  "data": {
      "type": "UnauthorizedError",
      "code": "invalid_token"
  }
}
```

#### member connected

New member has connected to the chat server.

Payload:

```json
{
  "member": {
    "id": "53dcee61-5ef2-4e62-8b99-bc82cef826d8",
    "username": "memeber",
    "virgilCardId": "c61f40635b47a8ed05a4d2386084d37d9f48cf44422e8e834e7265cb0ecc1517"
  }
}
```

#### member disconnected

New member has disconnected the chat server.

Payload:

```json
{
  "member": {
    "id": "53dcee61-5ef2-4e62-8b99-bc82cef826d8",
    "username": "memeber",
    "virgilCardId": "c61f40635b47a8ed05a4d2386084d37d9f48cf44422e8e834e7265cb0ecc1517"
  }
}
```

#### message posted

New message has been posted to channel. Note you only receive this after joining a particular channel

Payload:

```json
{
  "id": "53dcee61-5ef2-4e62-8b99-bc82cef826d9",
  "channelId": "676cfeab-5ef2-4e62-8b99-bc82cef826d8",
  "author": "author_username",
  "body": "X04+PC3Vde40YVr7dEgASee7wrSWOvYeXoAFYFghf/4o7yNA2QC5VRKild0LWNfpJgPKPjQGCS9wQ98xbvLclLku/ISPkr/D4Obnn4XFmfvjLWd74ABozrfpPaD+1oOwme/dnvWTPvnfOzsjsRbwiByOieWAMLGHWJ0JKlEfRts="
}
```

#### added to channel

Received only by user who has been added to a channel by another user.

Payload:

```json
{
  "channelId": "676cfeab-5ef2-4e62-8b99-bc82cef826d8",
  "channelName": "random",
  "channelKey": "tUfPoMVFv/yMGlq5ZFIgdeTSNW6cxQ3H5KI3RvY/Y78gojCFcEH/gm6oZL5za9pkcknEY4/jmzXNES4F7oi8tA==",
  "addedBy": "username"
}
```

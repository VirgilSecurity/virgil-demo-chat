package com.virgilsecurity.dynamodbdemo.client;

import android.util.Log;

import com.google.gson.JsonObject;
import com.virgilsecurity.dynamodbdemo.ApplicationConstants;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatAutorizationListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatChannelListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatLoginListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatMemberListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatMessageListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatRegistrationListener;
import com.virgilsecurity.dynamodbdemo.client.model.Channel;
import com.virgilsecurity.dynamodbdemo.client.model.Member;
import com.virgilsecurity.dynamodbdemo.client.model.Message;
import com.virgilsecurity.dynamodbdemo.client.model.dto.ChatChannel;
import com.virgilsecurity.dynamodbdemo.client.model.dto.ChatMember;
import com.virgilsecurity.dynamodbdemo.client.model.dto.Error;
import com.virgilsecurity.dynamodbdemo.client.model.dto.RestChannel;
import com.virgilsecurity.dynamodbdemo.client.model.dto.Token;
import com.virgilsecurity.dynamodbdemo.client.model.utils.Converter;
import com.virgilsecurity.dynamodbdemo.exception.ServiceException;
import com.virgilsecurity.sdk.client.RequestSigner;
import com.virgilsecurity.sdk.client.requests.CreateCardRequest;
import com.virgilsecurity.sdk.client.utils.ConvertionUtils;
import com.virgilsecurity.sdk.crypto.Crypto;
import com.virgilsecurity.sdk.crypto.PrivateKey;
import com.virgilsecurity.sdk.crypto.PublicKey;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

import javax.net.ssl.HttpsURLConnection;

import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by Andrii Iakovenko.
 */

public class ChatClient {

    private static final String TAG = "ChatClient";
    private Crypto mCrypto;
    private Socket mSocket;
    private String mBaseUrl;
    private String mToken;

    private Set<ChatListener> mListeners;

    public ChatClient(Crypto crypto, String baseUrl) {
        this.mCrypto = crypto;
        this.mBaseUrl = baseUrl;

        mListeners = new HashSet<>();
    }

    public void login(String nickname) {
        final JsonObject json = new JsonObject();
        json.addProperty("username", nickname);
        Log.d(TAG, json.toString());

        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String body = doPost("/users/login", json.toString());
                    mToken = ConvertionUtils.getGson().fromJson(body, Token.class).getToken();

                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatLoginListener) {
                            ((ChatLoginListener) listener).onLogin(mToken);
                        }
                    }
                } catch (ServiceException e) {
                    String message = e.getMessage();
                    Log.e(TAG, message);
                    handleError(message, ChatLoginListener.class);
                }
            }
        });
        background.start();
    }

    public void register(String nickname, PublicKey publicKey, PrivateKey privateKey) {
        CreateCardRequest request = new CreateCardRequest(nickname, ApplicationConstants.IDENTITY_TYPE, mCrypto.exportPublicKey(publicKey));
        RequestSigner requestSigner = new RequestSigner(mCrypto);
        requestSigner.selfSign(request, privateKey);

        final JsonObject json = new JsonObject();
        String exportedRequest = request.exportRequest();

        json.addProperty("card_request", exportedRequest);
        Log.d(TAG, json.toString());

        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String body = doPost("/users/register", json.toString());
                    mToken = ConvertionUtils.getGson().fromJson(body, Token.class).getToken();

                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatRegistrationListener) {
                            ((ChatRegistrationListener) listener).onRegister(mToken);
                        }
                    }
                } catch (ServiceException e) {
                    String message = e.getMessage();
                    Log.e(TAG, message);
                    handleError(message, ChatRegistrationListener.class);
                }
            }
        });
        background.start();
    }

    public void getChannels() {
        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String body = doGet("/channels");

                    RestChannel[] restChannels = ConvertionUtils.getGson().fromJson(body, RestChannel[].class);
                    List<Channel> channels = new ArrayList<>(restChannels.length);
                    for (RestChannel rest : restChannels) {
                        channels.add(Converter.fromRestChannel(rest));
                    }

                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatChannelListener) {
                            ((ChatChannelListener) listener).onChannelsRetrieved(channels);
                        }
                    }
                } catch (ServiceException e) {
                    String message = e.getMessage();
                    Log.e(TAG, message);
                    handleError(message, ChatChannelListener.class);
                }
            }
        });
        background.start();
    }

    public void getChannel(final String channelId) {
        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String body = doGet("/channels/" + URLEncoder.encode(channelId, "UTF-8"));
                    Channel channel = ConvertionUtils.getGson().fromJson(body, Channel.class);

                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatChannelListener) {
                            ((ChatChannelListener) listener).onChannelRetrieved(channel);
                        }
                    }
                } catch (Exception e) {
                    String message = e.getMessage();
                    Log.e(TAG, message);
                    handleError(message, ChatChannelListener.class);
                }
            }
        });
        background.start();
    }

    public void createChannel(String channelName, PublicKey publicKey, final PrivateKey privateKey) {
        CreateCardRequest request = new CreateCardRequest(channelName, ApplicationConstants.IDENTITY_TYPE, mCrypto.exportPublicKey(publicKey));
        RequestSigner requestSigner = new RequestSigner(mCrypto);
        requestSigner.selfSign(request, privateKey);

        final JsonObject json = new JsonObject();
        json.addProperty("card_request", request.exportRequest());
        Log.d(TAG, json.toString());

        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String body = doPost("/channels", json.toString());
                    RestChannel restChannel = ConvertionUtils.getGson().fromJson(body, RestChannel.class);
                    Channel channel = Converter.fromRestChannel(restChannel);
                    channel.setPrivateKey(privateKey);

                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatChannelListener) {
                            ((ChatChannelListener) listener).onChannelCreated(channel);
                        }
                    }
                } catch (Exception e) {
                    String message = e.getMessage();
                    Log.e(TAG, message);
                    handleError(message, ChatChannelListener.class);
                }
            }
        });
        background.start();
    }

    public void joinChannel(String channelId) {
        Log.d(TAG, "Join channel " + channelId);
        JSONObject json = new JSONObject();
        try {
            json.put("channelId", channelId);
        } catch (JSONException e) {
        }
        mSocket.emit("join channel", json);
    }

    public void getMessages(final String channelId) {
        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String body = doGet("/channels/" + URLEncoder.encode(channelId, "UTF-8") + "/messages");
                    Message[] messages = ConvertionUtils.getGson().fromJson(body, Message[].class);

                    for (int i = messages.length - 1; i >= 0; i--) {
                        Message message = messages[i];
                        for (ChatListener listener : mListeners) {
                            if (listener instanceof ChatMessageListener) {
                                ((ChatMessageListener) listener).onNewMessage(message);
                            }
                        }
                    }
                } catch (Exception e) {
                    String message = e.getMessage();
                    Log.e(TAG, message);
                    handleError(message, ChatMessageListener.class);
                }
            }
        });
        background.start();
    }

    public void postMessage(String channelId, String message) {
        Log.d(TAG, "Post message to channel: " + channelId);
        JSONObject json = new JSONObject();
        try {
            json.put("channelId", channelId);
            json.put("body", message);
        } catch (JSONException e) {
            Log.e(TAG, "Can't build post message request", e);
        }
        mSocket.emit("post message", json);
    }

    public void findUser(final String name) {
        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String body = doGet("/users/search?query=" + URLEncoder.encode(name, "UTF-8"));
                    Member[] users = ConvertionUtils.getGson().fromJson(body, Member[].class);
                    List<Member> members = Arrays.asList(users);

                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatMemberListener) {
                            ((ChatMemberListener) listener).onMembersFound(members);
                        }
                    }
                } catch (Exception e) {
                    String message = e.getMessage();
                    Log.e(TAG, message);
                    handleError(message, ChatMemberListener.class);
                }
            }
        });
        background.start();
    }

    public List<Member> findUserSync(final String name) {
        String body = null;
        try {
            body = doGet("/users/search?query=" + URLEncoder.encode(name, "UTF-8"));
        } catch (Exception e) {
            Log.e(TAG, "Find users synchronous", e);
        }
        Member[] users = ConvertionUtils.getGson().fromJson(body, Member[].class);
        if (users == null) {
            return Collections.emptyList();
        }
        List<Member> members = Arrays.asList(users);
        return members;
    }

    public void addMembers(String channelId, String channelKey, List<String> memberIds) {
        JSONObject json = new JSONObject();
        try {
            json.put("channelId", channelId);
            json.put("channelKey", channelKey);

            JSONArray memberIdsArray = new JSONArray();
            json.put("memberIds", memberIdsArray);
            for (String member : memberIds) {
                memberIdsArray.put(member);
            }
            Log.d(TAG, "Add members: " + json.toString());
        } catch (JSONException e) {
            Log.e(TAG, "addMemeber", e);
        }
        mSocket.emit("add members", json);
    }

    public void leaveChannel(String channelId) {
        Log.d(TAG, "Leave channel " + channelId);
        JSONObject json = new JSONObject();
        try {
            json.put("channelId", channelId);
        } catch (JSONException e) {
        }
        mSocket.emit("leave channel", new Object[]{json}, new Ack() {
            @Override
            public void call(Object... args) {
                Log.d(TAG, "Leave channel ACK " + args[0].toString());
            }
        });
    }

    public void connect() {
        Log.d(TAG, "Connect to chat");
        if (mSocket != null && mSocket.connected()) {
            mSocket.disconnect();
        }

        try {
            mSocket = IO.socket(mBaseUrl);
            mSocket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    Log.d(TAG, "Connected to websocket");
                    JSONObject token = new JSONObject();
                    try {
                        token.put("token", mToken);
                    } catch (JSONException e) {
                    }
                    Log.d(TAG, "Trying to authorize: " + token);
                    mSocket.emit("authenticate", token)
                            .on("authenticated", new Emitter.Listener() {
                                @Override
                                public void call(Object... args) {
                                    Log.d(TAG, "Authenticated");
                                    for (ChatListener listener : mListeners) {
                                        if (listener instanceof ChatAutorizationListener) {
                                            ((ChatAutorizationListener) listener).onAuthenticated();
                                        }
                                    }
                                }
                            })
                            .on("unauthorized", new Emitter.Listener() {
                                @Override
                                public void call(Object... args) {
                                    Log.d(TAG, "Unauthorized");
                                    for (ChatListener listener : mListeners) {
                                        if (listener instanceof ChatAutorizationListener) {

                                            String type = "unknown";
                                            String code = "unknown";
                                            if (args.length > 0) {
                                                String str = String.valueOf(args[0]);
                                                Error error = ConvertionUtils.getGson().fromJson(str, Error.class);

                                                if (error.getData() != null) {
                                                    type = error.getData().getType();
                                                    code = error.getData().getCode();
                                                }
                                            }
                                            ((ChatAutorizationListener) listener).onUnauthorized(type, code);
                                        }
                                    }
                                }
                            });
                }
            });
            mSocket.on("member connected", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    Log.d(TAG, "Member connected: " + args[0]);
                    ChatMember chatMember = ConvertionUtils.getGson().fromJson(String.valueOf(args[0]), ChatMember.class);
                    if (chatMember.getMember() != null) {
                        for (ChatListener listener : mListeners) {
                            if (listener instanceof ChatMemberListener) {
                                ((ChatMemberListener) listener).onMemberConnected(chatMember.getMember());
                            }
                        }
                    } else {
                        handleError("Invalid member connected", ChatMemberListener.class);
                    }
                }
            });
            mSocket.on("message posted", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    Log.d(TAG, "Message posted: " + args);
                    Message message = ConvertionUtils.getGson().fromJson(String.valueOf(args[0]), Message.class);
                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatMessageListener) {
                            ((ChatMessageListener) listener).onPostMessage(message);
                        }
                    }
                }
            });
            mSocket.on("added to channel", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    Log.d(TAG, "Added to channel: " + args[0]);
                    ChatChannel channel = ConvertionUtils.getGson().fromJson(String.valueOf(args[0]), ChatChannel.class);
                    for (ChatListener listener : mListeners) {
                        if (listener instanceof ChatChannelListener) {
                            ((ChatChannelListener) listener).onAddedToChannel(channel);
                        }
                    }
                }
            });
            mSocket.on("member disconnected", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    Log.d(TAG, "Member disconnected: " + args[0]);
                    ChatMember chatMember = ConvertionUtils.getGson().fromJson(String.valueOf(args[0]), ChatMember.class);
                    if (chatMember.getMember() != null) {
                        for (ChatListener listener : mListeners) {
                            if (listener instanceof ChatMemberListener) {
                                ((ChatMemberListener) listener).onMemberDisconnected(chatMember.getMember());
                            }
                        }
                    } else {
                        handleError("Invalid member disconnected", ChatMemberListener.class);
                    }
                }
            });
            mSocket.connect();
        } catch (URISyntaxException e) {
            Log.d(TAG, e.toString());
        }
    }

    public String getToken() {
        return mToken;
    }

    public void setToken(String token) {
        this.mToken = token;
    }

    public Set<ChatListener> getListeners() {
        return mListeners;
    }

    public void addListener(ChatListener listener) {
        this.mListeners.add(listener);
    }

    public void removeListener(ChatListener listener) {
        this.mListeners.remove(listener);
    }

    private void handleError(String message, Class clazz) {
        for (ChatListener listener : mListeners) {
            if (clazz.isAssignableFrom(listener.getClass())) {
                listener.onError(message);
            }
        }
    }

    private String doGet(String path) throws ServiceException {
        try {
            URL url = new URL(mBaseUrl + path);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            try {
                if (this.mToken != null) {
                    urlConnection.setRequestProperty("Authorization", "Bearer " + mToken);
                }

                InputStream in = new BufferedInputStream(urlConnection.getInputStream());
                Scanner s = new Scanner(in).useDelimiter("\\A");
                String result = s.hasNext() ? s.next() : "";
                Log.d(TAG, result);

                return result;
            } finally {
                urlConnection.disconnect();
            }
        } catch (Exception e) {
            throw new ServiceException(e);
        }
    }

    private String doPost(String path, String body) throws ServiceException {
        try {
            URL url = new URL(mBaseUrl + path);
            HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();

            try {
                urlConnection.setDoOutput(true);
                urlConnection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                if (this.mToken != null) {
                    urlConnection.setRequestProperty("Authorization", "Bearer " + mToken);
                }

                OutputStream out = new BufferedOutputStream(urlConnection.getOutputStream());
                try {
                    byte[] bytes = ConvertionUtils.toBytes(body);
                    out.write(bytes);
                } finally {
                    out.close();
                }

                if (urlConnection.getResponseCode() >= 400) {
                    Scanner s = new Scanner(urlConnection.getErrorStream()).useDelimiter("\\A");
                    throw new ServiceException(s.hasNext() ? s.next() : "");
                }

                InputStream in = new BufferedInputStream(urlConnection.getInputStream());
                Scanner s = new Scanner(in).useDelimiter("\\A");
                String result = s.hasNext() ? s.next() : "";
                Log.d(TAG, result);

                return result;
            } finally {
                urlConnection.disconnect();
            }
        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ServiceException(e);
        }
    }
}

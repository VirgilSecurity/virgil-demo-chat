package com.virgilsecurity.dynamodbdemo.client;

import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.virgilsecurity.dynamodbdemo.ApplicationConstants;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatChannelListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatLoginListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatMessageListener;
import com.virgilsecurity.dynamodbdemo.client.listener.ChatRegistrationListener;
import com.virgilsecurity.dynamodbdemo.client.model.Channel;
import com.virgilsecurity.dynamodbdemo.client.model.Member;
import com.virgilsecurity.dynamodbdemo.client.model.Message;
import com.virgilsecurity.dynamodbdemo.client.model.dto.ChatChannel;
import com.virgilsecurity.dynamodbdemo.client.model.utils.Converter;
import com.virgilsecurity.dynamodbdemo.utils.MessageStorage;
import com.virgilsecurity.dynamodbdemo.utils.PrefsUtils;
import com.virgilsecurity.sdk.client.VirgilClient;
import com.virgilsecurity.sdk.client.model.Card;
import com.virgilsecurity.sdk.client.model.dto.SearchCriteria;
import com.virgilsecurity.sdk.client.utils.ConvertionUtils;
import com.virgilsecurity.sdk.client.utils.StringUtils;
import com.virgilsecurity.sdk.crypto.Crypto;
import com.virgilsecurity.sdk.crypto.KeyPair;
import com.virgilsecurity.sdk.crypto.PrivateKey;
import com.virgilsecurity.sdk.crypto.PublicKey;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.ADD_MESSAGE_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.CHANGE_ACTIVE_CHANNEL_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.CHANNEL_ID;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.CHANNEL_NAME;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.DECRYPTED_MESSAGE;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.LEAVE_CHANNEL_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.LOGIN_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.LOGIN_FAILED_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.MESSAGE;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.REGISTER_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.REGISTRATION_FAILED_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.TOKEN;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.UPDATE_CHANNELS_EVENT;

/**
 * Created by Andrii Iakovenko.
 */

public class ChatService {

    private static final String TAG = "ChatService";

    private Crypto mCrypto;
    private VirgilClient mVirgilClient;
    private PrivateKey mPrivateKey;

    private ChatClient mChatClient;
    private Handler handler;
    private Channel mActiveChannel;
    private List<Channel> mChanelsList;
    private Map<String, Channel> mChannels;
    private Map<String, MessageStorage> mMessages;

    public ChatService(Crypto crypto) {
        this(crypto, null);
    }

    public ChatService(Crypto crypto, String token) {
        this.mCrypto = crypto;
        this.mVirgilClient = new VirgilClient(PrefsUtils.getInstance().getString(ApplicationConstants.Prefs.VIRGIL_TOKEN));

        mChanelsList = new ArrayList<>();
        mChannels = new HashMap<>();
        mMessages = new HashMap<>();

        String baseUrl = PrefsUtils.getInstance().getString(ApplicationConstants.Prefs.BASE_URL);

        mChatClient = new ChatClient(mCrypto, baseUrl);
        mChatClient.addListener(new ChatLoginListener() {
            @Override
            public void onLogin(String token) {
                Log.d(TAG, "Logged in with token " + token);
                Bundle b = new Bundle();
                b.putString(TOKEN, token);
                sendMessageToHandler(LOGIN_EVENT, b);
            }

            @Override
            public void onError(String message) {
                Log.e(TAG, "Login failed " + message);
                Bundle b = new Bundle();
                b.putString(MESSAGE, message);
                sendMessageToHandler(LOGIN_FAILED_EVENT, b);
            }
        });
        mChatClient.addListener(new ChatRegistrationListener() {
            @Override
            public void onRegister(String token) {
                Log.d(TAG, "Registered with token " + token);
                Bundle b = new Bundle();
                b.putString(TOKEN, token);
                sendMessageToHandler(REGISTER_EVENT, b);
            }

            @Override
            public void onError(String message) {
                Log.e(TAG, "Registration failed " + message);
                Bundle b = new Bundle();
                b.putString(MESSAGE, message);
                sendMessageToHandler(REGISTRATION_FAILED_EVENT, b);
            }
        });
        mChatClient.addListener(new ChatChannelListener() {
            @Override
            public void onChannelCreated(Channel channel) {
                Log.d(TAG, "Channel created " + channel);

                PrefsUtils.getInstance().putString(ApplicationConstants.Prefs.PUBLIC_KEY + channel.getId(), ConvertionUtils.toBase64String(mCrypto.exportPublicKey(channel.getPublicKey())));
                PrefsUtils.getInstance().putString(ApplicationConstants.Prefs.PRIVATE_KEY + channel.getId(), ConvertionUtils.toBase64String(mCrypto.exportPrivateKey(channel.getPrivateKey())));

                updateChannels();
            }

            @Override
            public void onChannelRetrieved(Channel channel) {
                Log.d(TAG, "Channel retrieved " + channel);

            }

            @Override
            public void onChannelsRetrieved(List<Channel> channels) {
                Log.d(TAG, "onChannelsRetrieved: " + channels.size() + " channels");
                mergeChannels(channels);
                actualizeActiveChannel();
                Bundle b = new Bundle();
                sendMessageToHandler(UPDATE_CHANNELS_EVENT, b);
            }

            @Override
            public void onJoinChannel(Channel channel) {
                Log.d(TAG, "Join channel " + channel);
            }

            @Override
            public void onLeaveChannel(String channelId) {
                Log.d(TAG, "Leave channel " + channelId);

                Bundle b = new Bundle();
                Channel leavedChannel = mChannels.get(channelId);
                if (leavedChannel != null) {
                    b.putString(CHANNEL_ID, leavedChannel.getId());
                    b.putString(CHANNEL_NAME, leavedChannel.getName());
                }
                sendMessageToHandler(LEAVE_CHANNEL_EVENT, b);
                updateChannels();
            }

            @Override
            public void onAddedToChannel(ChatChannel chatChannel) {
                Log.d(TAG, "Added to channel " + chatChannel);
                Channel channel = Converter.fromChatChannel(chatChannel, mPrivateKey);
                PrefsUtils.getInstance().putString(ApplicationConstants.Prefs.PUBLIC_KEY + channel.getId(), ConvertionUtils.toBase64String(mCrypto.exportPublicKey(channel.getPublicKey())));
                PrefsUtils.getInstance().putString(ApplicationConstants.Prefs.PRIVATE_KEY + channel.getId(), ConvertionUtils.toBase64String(mCrypto.exportPrivateKey(channel.getPrivateKey())));

                updateChannels();
            }

            @Override
            public void onError(String message) {
                Log.e(TAG, "Channel error " + message);

            }
        });
        mChatClient.addListener(new ChatMessageListener() {
            @Override
            public void onPostMessage(Message message) {
                Log.d(TAG, "Message posted " + message);

                // Decrypt message
                String decryptedBody = decryptMessage(message.getChannelId(), message.getBody());
                message.setBody(decryptedBody);

                Bundle b = new Bundle();
                b.putString(DECRYPTED_MESSAGE, ConvertionUtils.getGson().toJson(message));
                sendMessageToHandler(ADD_MESSAGE_EVENT, b);
            }

            @Override
            public void onNewMessage(Message message) {
                Log.d(TAG, "New message " + message);

                // Decrypt message
                String decryptedBody = decryptMessage(message.getChannelId(), message.getBody());
                message.setBody(decryptedBody);

                Bundle b = new Bundle();
                b.putString(DECRYPTED_MESSAGE, ConvertionUtils.getGson().toJson(message));
                sendMessageToHandler(ADD_MESSAGE_EVENT, b);
            }

            @Override
            public void onError(String message) {
                Log.d(TAG, "Message error " + message);
            }
        });
        if (token != null) {
            mChatClient.setToken(token);
            mChatClient.connect();
        }
    }

    public void createChannel(final String channelName) {
        KeyPair keyPair = mCrypto.generateKeys();
        mChatClient.createChannel(channelName, keyPair.getPublicKey(), keyPair.getPrivateKey());
    }

    public void updateChannels() {
        mChatClient.getChannels();
    }

    public void changeActiveChannel(String channelId) {
        Channel channel = mChannels.get(channelId);
        if (channel == null) {
            channel = actualizeActiveChannel();
        }
        if (channel != null) {
            mActiveChannel = channel;
            joinChannel(channel.getId());

            Bundle b = new Bundle();
            sendMessageToHandler(CHANGE_ACTIVE_CHANNEL_EVENT, b);
        }
    }

    private synchronized Channel actualizeActiveChannel() {
        if (mActiveChannel == null || !mChannels.containsKey(mActiveChannel.getId())) {
            // Find first available public channel
            if (!mChannels.isEmpty()) {
                for (Channel channel : mChannels.values()) {
                    if (channel.isPublic()) {
                        mActiveChannel =  channel;
                        break;
                    }
                }
                // No public chats, select first available channel
                if (mActiveChannel == null) {
                    mActiveChannel = mChannels.values().iterator().next();
                }
            }
        }
        return mActiveChannel;
    }

    public String getActiveChannelId() {
        Channel channel = actualizeActiveChannel();
        if (channel != null) {
            return channel.getId();
        }
        return null;
    }

    public String getActiveChannelName() {
        return actualizeActiveChannel().getName();
    }

    public MessageStorage getActiveMessageStorage() {
        MessageStorage storage = null;
        String channelId = getActiveChannelId();
        if (channelId != null) {
            storage = mMessages.get(channelId);
        }
        if (storage == null) {
            storage = new MessageStorage();
        }
        return storage;
    }

    public List<Channel> getChannels() {
        return mChanelsList;
    }

    public void joinChannel(final String channelId) {
        Log.d(TAG, "Joining Channel: " + channelId);
        mChatClient.joinChannel(channelId);
        mChatClient.getMessages(channelId);
    }

    public void sendMessage(String message) {
        Log.d(TAG, "Send message");
        if (mActiveChannel == null) {
            return;
        }
        String channelId = getActiveChannelId();
        mChatClient.postMessage(channelId, encryptMessage(channelId, message));
    }

    public void leaveChannel(String channelId) {
        mChatClient.leaveChannel(channelId);
    }

    public void findMembers(String query) {
        mChatClient.findUser(query);
    }

    public void addMembers(final String channelId, final List<? extends Member> members) {
        Log.d(TAG, "Invite " + members.size() + " members to channel " + channelId);
        Thread background = new Thread(new Runnable() {
            @Override
            public void run() {
                Channel channel = mChannels.get(channelId);
                if (channel.isPublic()) {
                    Log.d(TAG, "No needs to invite user into public chat");
                    // No needs to invite user into public chat
                    return;
                }
                byte[] data = mCrypto.exportPrivateKey(channel.getPrivateKey());

                // Find members
                List<String> memberIds = new ArrayList<>();
                List<String> memberNames = new ArrayList<>();
                for (Member member : members) {
                    memberIds.add(member.getId());
                    memberNames.add(member.getUsername());
                }
                SearchCriteria criteria = SearchCriteria.byIdentities(memberNames);
                List<Card> cards = mVirgilClient.searchCards(criteria);

                List<PublicKey> recipients = new ArrayList<>();
                for (Card card : cards) {
                    recipients.add(mCrypto.importPublicKey(card.getPublicKey()));
                }
                byte[] encryptedKey = mCrypto.encrypt(data, recipients.toArray(new PublicKey[0]));

                mChatClient.addMembers(channelId, ConvertionUtils.toBase64String(encryptedKey), memberIds);
            }
        });
        background.start();
    }

    public void retieveActiveChannelMessages() {
        if (mActiveChannel == null) {
            return;
        }
//        Thread background = new Thread(new Runnable() {
//            @Override
//            public void run() {
//                try {
//                    // Get last messages from chat
//                    List<Message> messages = getMessages(mActiveChannel.getId());
//
//                    // Decode messages
//                    for (Message message : messages) {
//                        Bundle b = new Bundle();
//                        b.putString(DECRYPTED_MESSAGE, ConvertionUtils.getGson().toJson(message));
//                        sendMessageToHandler(ADD_MESSAGE_EVENT, b);
//                    }
//                } catch (ServiceException e) {
//                    Log.e(TAG, e.getMessage());
//                }
//            }
//        });
//        background.start();
    }

    public void login(String nickname) {
        mChatClient.login(nickname);
    }

    public void register(String nickname, PublicKey publicKey, PrivateKey privateKey) {
        mChatClient.register(nickname, publicKey, privateKey);
    }

    public void setToken(String token) {
        mChatClient.setToken(token);
        mChatClient.connect();
    }

    public void setHandler(Handler handler) {
        this.handler = handler;
    }

    private void mergeChannels(List<Channel> channels) {
        Set<String> channelsToRemove = mChannels.keySet();
        for (Channel channel : channels) {
            channelsToRemove.remove(channel.getId());
            if (!mChannels.containsKey(channel.getId())) {
                mChannels.put(channel.getId(), channel);
                mMessages.put(channel.getId(), new MessageStorage());
            }
        }
        // Update keys for channels
        for (Channel channel : mChannels.values()) {
            if (channel.getPrivateKey() == null) {
                // Load privateKey key
                byte[] data = ConvertionUtils.base64ToArray(PrefsUtils.getInstance().getString(ApplicationConstants.Prefs.PRIVATE_KEY + channel.getId()));
                if (data != null && data.length > 0) {
                    PrivateKey privateKey = mCrypto.importPrivateKey(data);
                    channel.setPrivateKey(privateKey);
                }
                if (channel.getPublicKey() == null && channel.getPrivateKey() != null) {
                    channel.setPublicKey(mCrypto.extractPublicKey(channel.getPrivateKey()));
                }
            }
        }

        mChanelsList.clear();
        if (mChannels != null && !mChannels.isEmpty()) {
            mChanelsList.addAll(mChannels.values());
        }
        Collections.sort(mChanelsList, new Comparator<Channel>() {
            @Override
            public int compare(Channel channel, Channel t1) {
                return channel.getName().compareTo(t1.getName());
            }
        });
//        for (String id : channelsToRemove) {
//            mChannels.remove(id);
//            mMessages.remove(id);
//        }
    }

    private void sendMessageToHandler(String event, String channelName) {
        Bundle b = new Bundle();
        if (!StringUtils.isBlank(channelName)) {
            b.putString(CHANNEL_NAME, channelName);
        }
        sendMessageToHandler(event, b);
    }

    private void sendMessageToHandler(String event, Bundle bundle) {
        if (handler != null) {
            android.os.Message msgObj = handler.obtainMessage();
            bundle.putString(EVENT, event);
            msgObj.setData(bundle);
            handler.sendMessage(msgObj);
        }
    }

    private String encryptMessage(String channelId, String message) {
        // Encrypt message with channel public key
        Channel channel = mChannels.get(channelId);
        if (channel == null) {
            Log.e(TAG, "No channel to encrypt with: " + channelId);
            return "";
        }
        if (channel.isPublic()) {
            // No encryption for public channel
            return ConvertionUtils.toBase64String(message);
        }
        byte[] encryptedData = mCrypto.encrypt(ConvertionUtils.toBytes(message), channel.getPublicKey());
        return ConvertionUtils.toBase64String(encryptedData);
    }

    private String decryptMessage(String channelId, String message) {
        // Decrypt message with channel public key
        Channel channel = mChannels.get(channelId);
        if (channel == null) {
            Log.e(TAG, "No channel to decrypt with: " + channelId);
            return "This message can't be decrypted";
        }
        if (channel.isPublic()) {
            // No encryption for public channel
            return ConvertionUtils.base64ToString(message);
        }
        byte[] decryptedData = mCrypto.decrypt(ConvertionUtils.base64ToArray(message), channel.getPrivateKey());
        return ConvertionUtils.toString(decryptedData);
    }

    public void setPrivateKey(PrivateKey privateKey) {
        this.mPrivateKey = privateKey;
    }
}

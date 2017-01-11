package com.virgilsecurity.dynamodbdemo;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.virgilsecurity.dynamodbdemo.adapter.MessagesAdapter;
import com.virgilsecurity.dynamodbdemo.adapter.data.MemberItem;
import com.virgilsecurity.dynamodbdemo.client.ChatService;
import com.virgilsecurity.dynamodbdemo.client.model.Channel;
import com.virgilsecurity.dynamodbdemo.client.model.Message;
import com.virgilsecurity.dynamodbdemo.exception.ChannelNotFoundException;
import com.virgilsecurity.dynamodbdemo.utils.MessageStorage;
import com.virgilsecurity.dynamodbdemo.utils.PrefsUtils;
import com.virgilsecurity.sdk.client.utils.ConvertionUtils;
import com.virgilsecurity.sdk.client.utils.StringUtils;
import com.virgilsecurity.sdk.crypto.Crypto;
import com.virgilsecurity.sdk.crypto.PrivateKey;
import com.virgilsecurity.sdk.crypto.VirgilCrypto;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.INVITE_MEMBERS;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.CHANGE_ACTIVE_CHANNEL_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.UPDATE_CHANNELS_EVENT;

public class MainActivity extends AppCompatActivity {

    final static String TAG = "MainActivity";

    private RecyclerView mMessagesRecyclerView;
    private MessagesAdapter mMessagesAdapter;
    private ArrayAdapter<Channel> mChannelsAdapter;

    private Toolbar mToolbar;
    private EditText mWriteMessageEditText;
    private ImageButton mSendChatMessageButton;
    private NavigationView mNavigationView;

    private ChatService chatService;
    private String mIdentity;
    private Crypto crypto;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
        setTitle(R.string.loading);

        crypto = new VirgilCrypto();

        // Load current user card preferences
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);

        mIdentity = prefs.getString(ApplicationConstants.Prefs.IDENTITY, "");
        PrivateKey privateKey = crypto.importPrivateKey(ConvertionUtils.base64ToArray(PrefsUtils.getInstance().getString(ApplicationConstants.Prefs.PRIVATE_KEY)));

        // Initialize chat
        String token = PrefsUtils.getInstance().getString(ApplicationConstants.Prefs.TOKEN);
        if (chatService == null) {
            chatService = new ChatService(crypto, token);
            chatService.setPrivateKey(privateKey);
        }
        chatService.setHandler(handler);

        // Configure UI
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(mToolbar);

        if (savedInstanceState != null) {
            chatService = (ChatService) getLastCustomNonConfigurationInstance();

            showActiveChannel(chatService.getActiveChannelName());
        }

        // Configure messages view
        mMessagesAdapter = new MessagesAdapter(chatService.getActiveMessageStorage());

        mMessagesRecyclerView = (RecyclerView) findViewById(R.id.messagesRecyclerView);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);

        // for a chat app, show latest at the bottom
        layoutManager.setStackFromEnd(true);
        mMessagesRecyclerView.setLayoutManager(layoutManager);
        mMessagesRecyclerView.setAdapter(mMessagesAdapter);

        mWriteMessageEditText = (EditText) findViewById(R.id.writeMessageEditText);
        mSendChatMessageButton = (ImageButton) findViewById(R.id.sendChatMessageButton);
        mSendChatMessageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String messageBody = mWriteMessageEditText.getText().toString();
                mWriteMessageEditText.setText("");

                // Hide keyboard
                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);

                sendMessage(messageBody);
            }
        });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, mToolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        mNavigationView = (NavigationView) findViewById(R.id.nav_view);

        TextView nicknameTV = (TextView) mNavigationView.findViewById(R.id.nickname);
        nicknameTV.setText(mIdentity);

        // channels list
        mChannelsAdapter = new ArrayAdapter<Channel>(this, android.R.layout.simple_list_item_1, chatService.getChannels());
        ListView channelsList = (ListView) mNavigationView.findViewById(R.id.channels_list);
        channelsList.setAdapter(mChannelsAdapter);
        channelsList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                try {
                    // Change active channel
                    chatService.changeActiveChannel(mChannelsAdapter.getItem(position).getId());
                } catch (ChannelNotFoundException e) {
                    Toast.makeText(MainActivity.this, R.string.error_channel_not_found, Toast.LENGTH_LONG).show();
                }

                DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
                drawer.closeDrawer(GravityCompat.START);
            }
        });
        chatService.updateChannels();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
    }

    @Override
    public Object onRetainCustomNonConfigurationInstance() {
        return chatService;
    }

    private void sendMessage(String messageBody) {
        if (!StringUtils.isBlank(messageBody)) {
            // Build message
            Message message = new Message();
            message.setBody(messageBody);
            message.setAuthor(mIdentity);
            message.setDateCreated(new Date().getTime());
            message.setId(UUID.randomUUID().toString());

            showMessageAtChat(message);

            // Sent message with Twilio
            chatService.sendMessage(messageBody);
        }
    }

    private void showMessageAtChat(Message message) {
        Log.d(TAG, "Show message at chat");
        MessageStorage storage = chatService.getActiveMessageStorage();

        storage.addOrUpdate(message);
        mMessagesAdapter.notifyDataSetChanged();
        mMessagesRecyclerView.scrollToPosition(storage.size() - 1);
    }

    private void showActiveChannel(String channelName) {
        mToolbar.setTitle(channelName);
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_leave_channel) {
            // Open leave channel dialog
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle(R.string.dialog_leave_channel)
                    .setMessage(R.string.dialog_leave_channel_message)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            chatService.leaveChannel(chatService.getActiveChannelId());
                        }
                    })
                    .setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            // User cancelled the dialog
                        }
                    });
            builder.create().show();
        } else if (id == R.id.action_create_channel) {
            // Open create channel dialog
            final EditText input = new EditText(this);
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle(R.string.dialog_create_channel)
                    .setView(input)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            String channelName = input.getText().toString();
                            chatService.createChannel(channelName);
                        }
                    })
                    .setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            // User cancelled the dialog
                        }
                    });
            builder.create().show();
        } else if (id == R.id.action_add_member) {
            Intent intent = new Intent(getBaseContext(), MembersActivity.class);
            startActivityForResult(intent, INVITE_MEMBERS);
        } else if (id == R.id.action_close) {
            close();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        switch (requestCode) {
            case INVITE_MEMBERS:
                if (resultCode == RESULT_OK) {
                    Log.d(TAG, "New members will be invited to the channel");
                    MemberItem[] members = (MemberItem[]) data.getSerializableExtra(ApplicationConstants.Extra.MEMBERS);
                    if (members.length > 0) {
                        chatService.addMembers(chatService.getActiveChannelId(), Arrays.asList(members));
                    } else {
                        Log.d(TAG, "No members selected");
                    }
                }
                break;
        }
    }

    private void logout() {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        prefs.edit().putBoolean(ApplicationConstants.Prefs.LOGGED_IN, false)
                .commit();
    }

    private void close() {
        logout();
        finish();
    }

    private Handler handler = new Handler() {

        @Override
        public void handleMessage(android.os.Message msg) {
            String event = msg.getData().getString(ApplicationConstants.Messages.EVENT);
            switch (event) {
                case ApplicationConstants.Messages.NEW_CHANNEL_EVENT:
                    mChannelsAdapter.notifyDataSetChanged();
                    break;
                case ApplicationConstants.Messages.JOIN_CHANNEL_EVENT:
                    mChannelsAdapter.notifyDataSetChanged();
                    chatService.retieveActiveChannelMessages();
                    break;
                case CHANGE_ACTIVE_CHANNEL_EVENT:
                    showActiveChannel(chatService.getActiveChannelName());
                    mChannelsAdapter.notifyDataSetChanged();
                    mMessagesAdapter.setMessageStorage(chatService.getActiveMessageStorage());
                    mMessagesAdapter.notifyDataSetChanged();
                    break;
                case UPDATE_CHANNELS_EVENT:
                    mChannelsAdapter.notifyDataSetChanged();
                    chatService.changeActiveChannel(null);
                    break;
                case ApplicationConstants.Messages.LEAVE_CHANNEL_EVENT:
                    String channelId = msg.getData().getString(ApplicationConstants.Messages.CHANNEL_ID);
                    mChannelsAdapter.notifyDataSetChanged();
                    chatService.changeActiveChannel(channelId);
                    break;
                case ApplicationConstants.Messages.ADD_MESSAGE_EVENT:
                    String gson = msg.getData().getString(ApplicationConstants.Messages.DECRYPTED_MESSAGE);
                    Message channelMessage = ConvertionUtils.getGson().fromJson(gson, Message.class);
                    if (channelMessage != null) {
                        showMessageAtChat(channelMessage);
                    } else {
                        Log.e(TAG, "Bad message received: " + gson);
                    }
                    break;
            }
        }
    };

}

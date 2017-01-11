package com.virgilsecurity.dynamodbdemo;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ListView;
import android.widget.SearchView;

import com.virgilsecurity.dynamodbdemo.adapter.MembersListAdapter;
import com.virgilsecurity.dynamodbdemo.adapter.data.MemberItem;
import com.virgilsecurity.dynamodbdemo.client.ChatClient;
import com.virgilsecurity.dynamodbdemo.client.model.Member;
import com.virgilsecurity.dynamodbdemo.utils.PrefsUtils;
import com.virgilsecurity.sdk.crypto.Crypto;
import com.virgilsecurity.sdk.crypto.VirgilCrypto;

import java.util.ArrayList;
import java.util.List;

public class MembersActivity extends AppCompatActivity {

    private static final String TAG = "MembersActivity";

    private SearchView searchView;
    private ListView membersList;
    private MembersListAdapter membersListAdapter;

    private List<MemberItem> memberItems;

    private Crypto crypto;
    private ChatClient chatClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_members);

        crypto = new VirgilCrypto();
        chatClient = new ChatClient(crypto, PrefsUtils.getInstance().getString(ApplicationConstants.Prefs.BASE_URL));
        chatClient.setToken(PrefsUtils.getInstance().getString(ApplicationConstants.Prefs.TOKEN));

        searchView = (SearchView) findViewById(R.id.search);
        membersList = (ListView) findViewById(R.id.members_list);

        memberItems = new ArrayList<>();
        membersListAdapter = new MembersListAdapter(this, memberItems);
        membersList.setAdapter(membersListAdapter);

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String s) {
                final String query = searchView.getQuery().toString();
                Log.d(TAG, "Search users: " + query);
                new Thread() {
                    public void run() {
                        List<Member> members = chatClient.findUserSync(query);
                        memberItems.clear();
                        for (Member member : members) {
                            memberItems.add(new MemberItem(member));
                        }
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                membersListAdapter.notifyDataSetChanged();
                            }
                        });
                    }
                }.start();
                return false;
            }

            @Override
            public boolean onQueryTextChange(String s) {
                return false;
            }
        });
    }

    public void inviteMembers(View view) {
        Intent intent = getIntent();
        List<MemberItem> selectedMembers = new ArrayList<>();
        for (MemberItem member : memberItems) {
            if (member.isChecked()) {
                selectedMembers.add(member);
            }
        }
        intent.putExtra(ApplicationConstants.Extra.MEMBERS, selectedMembers.toArray(new MemberItem[0]));
        setResult(RESULT_OK, intent);
        finish();
    }
}

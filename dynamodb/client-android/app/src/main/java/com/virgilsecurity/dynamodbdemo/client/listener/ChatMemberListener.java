package com.virgilsecurity.dynamodbdemo.client.listener;

import com.virgilsecurity.dynamodbdemo.client.model.Member;

import java.util.List;

/**
 * Created by Andrii Iakovenko.
 */

public interface ChatMemberListener extends ChatListener {

    void onAddMembers();

    void onMembersFound(List<Member> members);

    void onMemberConnected(Member member);

    void onMemberDisconnected(Member member);

}

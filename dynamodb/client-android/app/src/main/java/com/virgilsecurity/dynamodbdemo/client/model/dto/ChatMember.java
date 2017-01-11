package com.virgilsecurity.dynamodbdemo.client.model.dto;

import com.google.gson.annotations.SerializedName;
import com.virgilsecurity.dynamodbdemo.client.model.Member;

/**
 * Created by Andrii Iakovenko.
 */

public class ChatMember {

    @SerializedName("member")
    private Member member;

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }
}

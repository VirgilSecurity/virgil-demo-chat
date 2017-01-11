package com.virgilsecurity.dynamodbdemo.adapter.data;

import com.virgilsecurity.dynamodbdemo.client.model.Member;

import java.io.Serializable;

/**
 * Created by Andrii Iakovenko.
 */

public class MemberItem extends Member implements Serializable {
    private boolean checked;

    public MemberItem(Member member) {
        this.setId(member.getId());
        this.setUsername(member.getUsername());
        this.setVirgilCardId(member.getVirgilCardId());
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }
}

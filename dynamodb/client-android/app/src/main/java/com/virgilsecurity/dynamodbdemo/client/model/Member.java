package com.virgilsecurity.dynamodbdemo.client.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by Andrii Iakovenko.
 */

public class Member implements Serializable {

    @SerializedName("id")
    private String id;

    @SerializedName("username")
    private String username;

    @SerializedName("virgilCardId")
    private String virgilCardId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getVirgilCardId() {
        return virgilCardId;
    }

    public void setVirgilCardId(String virgilCardId) {
        this.virgilCardId = virgilCardId;
    }

    @Override
    public String toString() {
        return username;
    }
}

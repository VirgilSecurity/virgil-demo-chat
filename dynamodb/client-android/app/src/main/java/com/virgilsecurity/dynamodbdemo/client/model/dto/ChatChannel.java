package com.virgilsecurity.dynamodbdemo.client.model.dto;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Andrii Iakovenko.
 */

public class ChatChannel {

    @SerializedName("channelId")
    private String id;

    @SerializedName("channelName")
    private String name;

    @SerializedName("channelKey")
    private String privateKey;

    @SerializedName("addedBy")
    private String addedBy;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public String getAddedBy() {
        return addedBy;
    }

    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }

    @Override
    public String toString() {
        return id;
    }
}

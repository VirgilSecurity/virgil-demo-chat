package com.virgilsecurity.dynamodbdemo.client.model;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Andrii Iakovenko.
 */

public class Message {

    @SerializedName("id")
    private String id;

    @SerializedName("author")
    private String author;

    @SerializedName("body")
    private String body;

    @SerializedName("dateCreated")
    private Long dateCreated;

    @SerializedName("channelId")
    private String channelId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Long getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Long dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    @Override
    public String toString() {
        return id;
    }
}

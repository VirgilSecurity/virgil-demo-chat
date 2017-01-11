package com.virgilsecurity.dynamodbdemo.client.model.dto;

import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by Andrii Iakovenko.
 */

public class RestChannel {

    @SerializedName("id")
    private String id;

    @SerializedName("name")
    private String name;

    @SerializedName("dateCreated")
    private Long dateCreated;

    @SerializedName("ownerId")
    private String ownerId;

    @SerializedName("ownerName")
    private String ownerName;

    @SerializedName("virgilCardId")
    private String virgilCardId;

    @SerializedName("publicKey")
    private String publicKey;

    @SerializedName("members")
    private List<String> members;

    @SerializedName("isPublic")
    private boolean publicChat;

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

    public Long getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Long dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getVirgilCardId() {
        return virgilCardId;
    }

    public void setVirgilCardId(String virgilCardId) {
        this.virgilCardId = virgilCardId;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public boolean isPublic() {
        return publicChat;
    }

    public void setPublic(boolean publicChat) {
        this.publicChat = publicChat;
    }
}

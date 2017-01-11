package com.virgilsecurity.dynamodbdemo.client.model;

import com.virgilsecurity.sdk.crypto.PrivateKey;
import com.virgilsecurity.sdk.crypto.PublicKey;

import java.util.Date;
import java.util.List;

/**
 * Created by Andrii Iakovenko.
 */

public class Channel {

    private String id;

    private String name;

    private Date dateCreated;

    private String ownerId;

    private String ownerName;

    private String virgilCardId;

    private List<String> members;

    /* Name of user who added current user to channel. */
    private String addedBy;

    private PublicKey publicKey;

    private PrivateKey privateKey;

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

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
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

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public String getAddedBy() {
        return addedBy;
    }

    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(PublicKey publicKey) {
        this.publicKey = publicKey;
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(PrivateKey privateKey) {
        this.privateKey = privateKey;
    }

    public boolean isPublic() {
        return publicChat;
    }

    public void setPublic(boolean publicChat) {
        this.publicChat = publicChat;
    }

    @Override
    public String toString() {
        return name;
    }
}

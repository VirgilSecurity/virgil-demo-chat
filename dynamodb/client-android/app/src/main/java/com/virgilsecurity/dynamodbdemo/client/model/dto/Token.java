package com.virgilsecurity.dynamodbdemo.client.model.dto;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Andrii Iakovenko.
 */

public class Token {

    @SerializedName("token")
    private String token;

    public Token() {
    }

    public Token(String token) {
        this.token = token;
    }

    public String getToken() {
        if (token != null) {
            return token.trim();
        }
        return null;
    }
}

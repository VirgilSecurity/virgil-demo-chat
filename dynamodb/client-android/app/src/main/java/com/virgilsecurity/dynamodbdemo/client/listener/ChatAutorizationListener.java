package com.virgilsecurity.dynamodbdemo.client.listener;

/**
 * Created by Andrii Iakovenko.
 */

public interface ChatAutorizationListener extends ChatListener {

    void onAuthenticated();

    void onUnauthorized(String type, String code);

}

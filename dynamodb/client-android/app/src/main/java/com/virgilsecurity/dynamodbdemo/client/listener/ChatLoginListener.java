package com.virgilsecurity.dynamodbdemo.client.listener;

/**
 * Created by Andrii Iakovenko.
 */

public interface ChatLoginListener extends ChatListener {

    void onLogin(String token);
}

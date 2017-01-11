package com.virgilsecurity.dynamodbdemo.client.listener;

/**
 * Created by Andrii Iakovenko.
 */

public interface ChatRegistrationListener extends ChatListener {

    void onRegister(String token);
}

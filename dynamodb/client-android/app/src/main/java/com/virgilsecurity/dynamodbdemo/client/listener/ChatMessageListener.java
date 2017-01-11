package com.virgilsecurity.dynamodbdemo.client.listener;

import com.virgilsecurity.dynamodbdemo.client.model.Message;

/**
 * Created by Andrii Iakovenko.
 */

public interface ChatMessageListener extends ChatListener {
    
    void onPostMessage(Message message);

    void onNewMessage(Message message);

}

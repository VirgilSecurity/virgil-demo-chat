package com.virgilsecurity.dynamodbdemo.client.message;

import com.virgilsecurity.dynamodbdemo.client.model.Message;
import com.virgilsecurity.sdk.client.utils.StringUtils;

import java.util.ArrayList;

public class ChannelMessageStorage extends ArrayList<Message> {

    public Message getById(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        for (Message message : this) {
            if (id.equals(message.getId())) {
                return message;
            }
        }
        return null;
    }

    public void addOrUpdate(Message message) {
        if (!StringUtils.isBlank(message.getId())) {
            for (Message msg : this) {
                if (message.getId().equals(msg.getId())){

                    msg.setDateCreated(message.getDateCreated());
                    msg.setAuthor(message.getAuthor());
                    msg.setBody(message.getBody());

                    return;
                }
            }
        }
        add(message);
    }
}

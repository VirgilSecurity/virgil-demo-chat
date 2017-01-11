package com.virgilsecurity.dynamodbdemo.client.listener;

import com.virgilsecurity.dynamodbdemo.client.model.Channel;
import com.virgilsecurity.dynamodbdemo.client.model.dto.ChatChannel;

import java.util.List;

/**
 * Created by Andrii Iakovenko.
 */

public interface ChatChannelListener extends ChatListener {

    void onChannelCreated(Channel channel);

    void onChannelRetrieved(Channel channels);

    void onChannelsRetrieved(List<Channel> channels);

    void onJoinChannel(Channel channel);

    void onLeaveChannel(String channelId);

    void onAddedToChannel(ChatChannel channel);
}

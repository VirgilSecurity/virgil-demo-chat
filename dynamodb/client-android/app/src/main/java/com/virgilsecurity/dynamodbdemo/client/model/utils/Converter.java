package com.virgilsecurity.dynamodbdemo.client.model.utils;

import com.virgilsecurity.dynamodbdemo.client.model.Channel;
import com.virgilsecurity.dynamodbdemo.client.model.dto.ChatChannel;
import com.virgilsecurity.dynamodbdemo.client.model.dto.RestChannel;
import com.virgilsecurity.sdk.client.utils.ConvertionUtils;
import com.virgilsecurity.sdk.client.utils.StringUtils;
import com.virgilsecurity.sdk.crypto.Crypto;
import com.virgilsecurity.sdk.crypto.PrivateKey;
import com.virgilsecurity.sdk.crypto.VirgilCrypto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Andrii Iakovenko.
 */

public class Converter {

    private static Crypto crypto;

    public static RestChannel toRestChannel(Channel channel) {
        RestChannel result = new RestChannel();

        if (channel != null) {
            result.setId(channel.getId());
            result.setName(channel.getName());

            if (channel.getDateCreated() != null) {
                result.setDateCreated(channel.getDateCreated().getTime());
            }

            result.setOwnerId(channel.getOwnerId());
            result.setOwnerName(channel.getOwnerName());
            result.setPublic(channel.isPublic());
            result.setVirgilCardId(channel.getVirgilCardId());

            if (channel.getPublicKey() != null) {
                byte[] data = getCrypto().exportPublicKey(channel.getPublicKey());
                result.setPublicKey(ConvertionUtils.toBase64String(data));
            }

            List<String> members = new ArrayList<>();
            if (channel.getMembers() != null) {
                members.addAll(channel.getMembers());
            }
            result.setMembers(members);
        }

        return result;
    }

    public static Channel fromRestChannel(RestChannel channel) {
        Channel result = new Channel();

        if (channel != null) {
            result.setId(channel.getId());
            result.setName(channel.getName());

            if (channel.getDateCreated() != null && channel.getDateCreated() > 0) {
                result.setDateCreated(new Date(channel.getDateCreated()));
            }

            result.setOwnerId(channel.getOwnerId());
            result.setOwnerName(channel.getOwnerName());
            result.setPublic(channel.isPublic());
            result.setVirgilCardId(channel.getVirgilCardId());

            if (!StringUtils.isBlank(channel.getPublicKey())) {
                byte[] data = ConvertionUtils.base64ToArray(channel.getPublicKey());
                result.setPublicKey(getCrypto().importPublicKey(data));
            }

            List<String> members = new ArrayList<>();
            if (channel.getMembers() != null) {
                members.addAll(channel.getMembers());
            }
            result.setMembers(members);
        }

        return result;
    }

    public static Channel fromChatChannel(ChatChannel channel, PrivateKey privateKey) {
        Channel result = new Channel();

        if (channel != null) {
            result.setId(channel.getId());
            result.setName(channel.getName());

            if (!StringUtils.isBlank(channel.getPrivateKey())) {
                byte[] encryptedKey = ConvertionUtils.base64ToArray(channel.getPrivateKey());
                byte[] decryptedKey = getCrypto().decrypt(encryptedKey, privateKey);
                result.setPrivateKey(getCrypto().importPrivateKey(decryptedKey));
                result.setPublicKey(getCrypto().extractPublicKey(result.getPrivateKey()));
            }

            result.setAddedBy(channel.getAddedBy());
        }

        return result;
    }

    private static Crypto getCrypto() {
        if (crypto == null) {
            crypto = new VirgilCrypto();
        }
        return crypto;
    }
}

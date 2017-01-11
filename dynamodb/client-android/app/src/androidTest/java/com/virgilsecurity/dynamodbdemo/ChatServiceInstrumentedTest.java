package com.virgilsecurity.dynamodbdemo;

import android.support.test.runner.AndroidJUnit4;

import com.virgilsecurity.dynamodbdemo.exception.ServiceException;
import com.virgilsecurity.dynamodbdemo.client.ChatService;
import com.virgilsecurity.sdk.crypto.Crypto;
import com.virgilsecurity.sdk.crypto.KeyPair;
import com.virgilsecurity.sdk.crypto.VirgilCrypto;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

/**
 * Created by Andrii Iakovenko.
 */
@RunWith(AndroidJUnit4.class)
public class ChatServiceInstrumentedTest {

    private ChatService service;
    private Crypto crypto;

    @Before
    public void setUp() {
        crypto = new VirgilCrypto();
        service = new ChatService(crypto);
    }

    @Test
    public void generateKeyPair() {
        KeyPair keyPair = crypto.generateKeys();
    }

}

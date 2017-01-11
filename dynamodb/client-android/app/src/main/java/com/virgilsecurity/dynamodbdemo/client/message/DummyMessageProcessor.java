package com.virgilsecurity.dynamodbdemo.client.message;

import java.util.Set;

public class DummyMessageProcessor implements MessageProcessor {
    @Override
    public void encodeMessage(final String message, Set<String> recipients, final MessageProcessingListener listener) {
        Thread background = new Thread(new Runnable() {

            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                listener.onSuccess(message);
            }
        });
        background.start();
    }

    @Override
    public void decodeMessage(final String message, final MessageProcessingListener listener) {
        Thread background = new Thread(new Runnable() {

            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                listener.onSuccess(message);
            }
        });
        background.start();
    }
}

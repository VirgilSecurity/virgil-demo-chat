package com.virgilsecurity.dynamodbdemo.exception;

/**
 * Created by Andrii Iakovenko.
 */

public class ServiceException extends Exception {

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(Throwable throwable) {
        super(throwable);
    }
}

package com.virgilsecurity.dynamodbdemo;

public interface ApplicationConstants {

    interface Prefs {
        String BASE_URL = "base_url";
        String IDENTITY = "nickname";
        String TOKEN = "token";
        String CARD_ID = "card_id";
        String PUBLIC_KEY = "public_key";
        String PRIVATE_KEY = "private_key";
        String VIRGIL_TOKEN = "virgil_token";
        String VIRGIL_APP_ID = "virgil_app_id";
        String VIRGIL_APP_PRIVATE_KEY = "virgil_app_private_key";
        String VIRGIL_APP_PRIVATE_KEY_PASSWORD = "virgil_app_private_key_password";

        String LOGGED_IN = "logged_in";
    }

    interface Messages {
        String EVENT = "event";
        String LOGIN_EVENT = "login";
        String LOGIN_FAILED_EVENT = "login_failed";
        String REGISTER_EVENT = "register";
        String REGISTRATION_FAILED_EVENT = "registration_failed";

        String NEW_CHANNEL_EVENT = "new_channel";
        String JOIN_CHANNEL_EVENT = "join_channel";
        String LEAVE_CHANNEL_EVENT = "leave_channel";
        String CHANGE_ACTIVE_CHANNEL_EVENT = "change_active_channel";
        String UPDATE_CHANNELS_EVENT = "update_channels";
        String ADD_MESSAGE_EVENT = "add_message";

        String TOKEN = "token";
        String MESSAGE = "message";
        String CHANNEL_ID = "channel_id";
        String CHANNEL_NAME = "channel_name";
        String CHANNEL_NAMES = "channel_names";
        String DECRYPTED_MESSAGE = "decrypted_message";
    }

    interface Extra {
        String MEMBERS = "members";
    }

    String IDENTITY_TYPE = "chat_member";

    int INVITE_MEMBERS = 1;
}
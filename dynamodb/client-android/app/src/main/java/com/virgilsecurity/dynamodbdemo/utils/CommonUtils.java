package com.virgilsecurity.dynamodbdemo.utils;

import com.virgilsecurity.sdk.client.utils.StringUtils;

public class CommonUtils {

    public static boolean isNicknameValid(String nickname) {
        return !StringUtils.isBlank(nickname);
    }
}

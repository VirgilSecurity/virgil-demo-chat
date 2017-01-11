package com.virgilsecurity.dynamodbdemo;

import android.app.Application;
import android.preference.PreferenceManager;

import com.virgilsecurity.dynamodbdemo.utils.PrefsUtils;

/**
 * Created by Andrii Iakovenko.
 */

public class DynamoDBApplication extends Application {

    private static DynamoDBApplication instance;

    public DynamoDBApplication() {
        this.instance = this;
    }

    public static DynamoDBApplication getInstance() {
        return instance;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        PrefsUtils.getInstance().putStringCommit(ApplicationConstants.Prefs.BASE_URL, "https://virgil-demo-chat.herokuapp.com");
        PreferenceManager.setDefaultValues(this, R.xml.prefs, false);
    }
}

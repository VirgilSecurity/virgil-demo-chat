package com.virgilsecurity.dynamodbdemo.utils;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.virgilsecurity.dynamodbdemo.DynamoDBApplication;

/**
 * Created by Andrii Iakovenko.
 */

public class PrefsUtils {

    private static PrefsUtils sInstance = new PrefsUtils();

    private SharedPreferences mSharedPreferences;

    private PrefsUtils() {
        mSharedPreferences = PreferenceManager.getDefaultSharedPreferences(DynamoDBApplication.getInstance());
    }

    public static PrefsUtils getInstance() {
        return sInstance;
    }

    public void putString(String key, String value) {
        SharedPreferences.Editor editor = mSharedPreferences.edit();
        editor.putString(key, value);
        editor.apply();
    }

    public void putStringCommit(String key, String value) {
        SharedPreferences.Editor editor = mSharedPreferences.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public void clearAll() {
        SharedPreferences.Editor editor = mSharedPreferences.edit();
        editor.clear();
        editor.apply();
    }

    public void clearValue(String key) {
        SharedPreferences.Editor editor = mSharedPreferences.edit();
        editor.remove(key);
        editor.apply();
    }

    public String getString(String key) {
        String value = mSharedPreferences.getString(key, "");
        return value;
    }
}

package com.virgilsecurity.dynamodbdemo.client.model.dto;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Andrii Iakovenko.
 */

public class Error {

    @SerializedName("data")
    private Data data;

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {

        @SerializedName("type")
        private String type;

        @SerializedName("code")
        private String code;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }
}

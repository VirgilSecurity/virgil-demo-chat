package com.virgilsecurity.dynamodbdemo;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

import com.virgilsecurity.dynamodbdemo.client.ChatService;
import com.virgilsecurity.dynamodbdemo.utils.CommonUtils;
import com.virgilsecurity.dynamodbdemo.utils.PrefsUtils;
import com.virgilsecurity.sdk.client.VirgilClient;
import com.virgilsecurity.sdk.client.utils.ConvertionUtils;
import com.virgilsecurity.sdk.crypto.Crypto;
import com.virgilsecurity.sdk.crypto.KeyPair;
import com.virgilsecurity.sdk.crypto.PrivateKey;
import com.virgilsecurity.sdk.crypto.PublicKey;
import com.virgilsecurity.sdk.crypto.VirgilCrypto;

import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.LOGIN_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.LOGIN_FAILED_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.REGISTER_EVENT;
import static com.virgilsecurity.dynamodbdemo.ApplicationConstants.Messages.REGISTRATION_FAILED_EVENT;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity {

    private static final String TAG = "LoginActivity";

    // UI references.
    private EditText mNicknameView;
    private View mProgressView;
    private View mLoginFormView;

    private String mSavedIdentity = null;
    private String nickname;
    private PublicKey publicKey;
    private PrivateKey privateKey;

    Crypto crypto;
    private ChatService chatService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        PreferenceManager.setDefaultValues(this, R.xml.prefs, false);
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);

        mSavedIdentity = prefs.getString(ApplicationConstants.Prefs.IDENTITY, "");

        // Set up the login form.
        mNicknameView = (EditText) findViewById(R.id.nickname);
        mNicknameView.setText(mSavedIdentity);

        Button mNicknameSignInButton = (Button) findViewById(R.id.sign_in_button);
        mNicknameSignInButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptLogin();
            }
        });

        mLoginFormView = findViewById(R.id.login_form);
        mProgressView = findViewById(R.id.login_progress);

        crypto = new VirgilCrypto();
        chatService = new ChatService(crypto);
        chatService.setHandler(handler);
    }

    private void openMainActivity() {
        Intent intent = new Intent(getBaseContext(), MainActivity.class);
        startActivity(intent);
        finish();
    }

    /**
     * Attempts to sign in or register the account specified by the login form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual login attempt is made.
     */
    private void attemptLogin() {
        // Reset errors.
        mNicknameView.setError(null);
        // Store values at the time of the login attempt.
        String email = mNicknameView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid email address.
        if (TextUtils.isEmpty(email)) {
            mNicknameView.setError(getString(R.string.error_field_required));
            focusView = mNicknameView;
            cancel = true;
        } else if (!CommonUtils.isNicknameValid(email)) {
            mNicknameView.setError(getString(R.string.error_invalid_nickname));
            focusView = mNicknameView;
            cancel = true;
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the first
            // form field with an error.
            focusView.requestFocus();
        } else {
            // Show a progress spinner, and kick off a background task to
            // perform the user login attempt.
            showProgress(true);
            if (mSavedIdentity.equals(email)) {
                // User already registered. Do login
                login(email);
            } else {
                // Register new user
                register(email);
            }
        }
    }

    private void login(String nickname) {
        chatService.login(nickname);
    }

    private void register(String nickname) {
        try {
            KeyPair keyPair = crypto.generateKeys();
            this.nickname = nickname;
            publicKey = keyPair.getPublicKey();
            privateKey = keyPair.getPrivateKey();

            // Register chat member
            chatService.register(nickname, publicKey, privateKey);
        } catch (Exception e) {
            Log.e(TAG, "Registration failed", e);
            mNicknameView.setError(e.getMessage());
            mNicknameView.requestFocus();
        }
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mLoginFormView.animate().setDuration(shortAnimTime).alpha(
                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
                }
            });

            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProgressView.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }

    private Handler handler = new Handler() {

        @Override
        public void handleMessage(android.os.Message msg) {
            showProgress(false);

            String event = msg.getData().getString(ApplicationConstants.Messages.EVENT);
            switch (event) {
                case REGISTER_EVENT:
                    PrefsUtils.getInstance().putString(ApplicationConstants.Prefs.IDENTITY, nickname);
//                prefs.putString(ApplicationConstants.Prefs.CARD_ID, card.getId());
                    PrefsUtils.getInstance().putString(ApplicationConstants.Prefs.PUBLIC_KEY, ConvertionUtils.toBase64String(crypto.exportPublicKey(publicKey)));
                    PrefsUtils.getInstance().putString(ApplicationConstants.Prefs.PRIVATE_KEY, ConvertionUtils.toBase64String(crypto.exportPrivateKey(privateKey)));
                case LOGIN_EVENT:
                    String token = msg.getData().getString(ApplicationConstants.Messages.TOKEN);
                    PrefsUtils.getInstance().putStringCommit(ApplicationConstants.Prefs.TOKEN, token);
                    openMainActivity();
                    break;
                case LOGIN_FAILED_EVENT:
                case REGISTRATION_FAILED_EVENT:
                    String message = msg.getData().getString(ApplicationConstants.Messages.MESSAGE);
                    mNicknameView.setError(message);
                    mNicknameView.requestFocus();
                    break;
            }
        }
    };
}


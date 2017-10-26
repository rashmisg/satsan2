package com.jda.isl;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.NodeApi;
import com.google.android.gms.wearable.Wearable;

public class NewTaskNotificationActivity extends Activity implements
        GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {

    public static final String EXTRA_TITLE = "title";

    private TextView mTextView;
    private Button mButton;

    private GoogleApiClient mGoogleApiClient;
    private BroadcastReceiver messageReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_new_task_notification);

        mTextView = (TextView)findViewById(R.id.text);
        mButton = (Button)findViewById(R.id.button);

        // Build a new GoogleApiClient
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addApi(Wearable.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();

        mGoogleApiClient.connect();

        messageReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, final Intent intent) {
                logMessage(intent.getStringExtra("message"));
            }
        };
        registerReceiver(messageReceiver, new IntentFilter("MessageReceived"));

        mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                (new Thread(new MessageRunnable())).start();
                logMessage("Message sent to ISL");
            }
        });
    }

    private void logMessage(final String message) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mTextView.append(message);
                mTextView.append("\n");
            }
        });
    }

    @Override
    public void onConnected(Bundle bundle) {
        logMessage("Connected to play services");
    }

    @Override
    public void onConnectionSuspended(int i) {
        logMessage("Play services connection suspended");
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        logMessage("Play services connection failed");
    }

    private class MessageRunnable implements Runnable {

        @Override
        public void run() {
            NodeApi.GetConnectedNodesResult nodes = Wearable.NodeApi
                    .getConnectedNodes(mGoogleApiClient).await();
            for (Node node : nodes.getNodes()) {
                Wearable.MessageApi.sendMessage(mGoogleApiClient, node.getId(),
                        Constants.PATH_NOTIFICATION, "Hello from ISL Wear".getBytes())
                        .await();
            }
        }
    }

    @Override
    protected void onDestroy() {
        unregisterReceiver(messageReceiver);
        mGoogleApiClient.disconnect();

        super.onDestroy();
    }
}

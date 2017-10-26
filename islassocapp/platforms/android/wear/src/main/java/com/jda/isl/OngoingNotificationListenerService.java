package com.jda.isl;

/**
 * Created by renjith on 04/03/16.
 */

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.support.v4.app.NotificationManagerCompat;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.data.FreezableUtils;
import com.google.android.gms.wearable.DataEvent;
import com.google.android.gms.wearable.DataEventBuffer;
import com.google.android.gms.wearable.DataMapItem;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;
import com.google.android.gms.wearable.WearableListenerService;

import java.util.List;
import java.util.concurrent.TimeUnit;


public class OngoingNotificationListenerService extends WearableListenerService  {

    private static final String TAG = OngoingNotificationListenerService.class.getSimpleName();
    private static final int NOTIFICATION_ID = 100;

    private GoogleApiClient mGoogleApiClient;

    @Override
    public void onCreate() {
        super.onCreate();
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addApi(Wearable.API)
                .build();
        mGoogleApiClient.connect();
    }

    @Override
    public void onDataChanged(DataEventBuffer dataEvents) {
        final List<DataEvent> events = FreezableUtils.freezeIterable(dataEvents);
        dataEvents.close();

        if (!mGoogleApiClient.isConnected()) {
            ConnectionResult connectionResult = mGoogleApiClient
                    .blockingConnect(30, TimeUnit.SECONDS);
            if (!connectionResult.isSuccess()) {
                Log.e(TAG, "Service failed to connect to GoogleApiClient.");
                return;
            }
        }

        for (DataEvent event : events) {
            if (event.getType() == DataEvent.TYPE_CHANGED) {
                String path = event.getDataItem().getUri().getPath();
                if (Constants.PATH_NOTIFICATION.equals(path)) {
                    // Get the data out of the event
                    DataMapItem dataMapItem = DataMapItem.fromDataItem(event.getDataItem());
                    final String title = dataMapItem.getDataMap().getString(Constants.KEY_TITLE);

                    // Build the intent to display our custom notification
                    Intent notificationIntent = new Intent(this, NewTaskNotificationActivity.class);
                    notificationIntent.putExtra(NewTaskNotificationActivity.EXTRA_TITLE, title);
                    PendingIntent notificationPendingIntent = PendingIntent.getActivity(
                            this,
                            0,
                            notificationIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT);

                    // Create the ongoing notification

                    // Use this for multipage notifications
//                    Notification secondPageNotification =
//                            new Notification.Builder(this)
//                                    .extend(new Notification.WearableExtender()
//                                            .setDisplayIntent(notificationPendingIntent))
//                                    .build();

                    Notification.Builder notificationBuilder =
                            new Notification.Builder(this)
                                    .setSmallIcon(R.drawable.generic_confirmation)
                                    .extend(new Notification.WearableExtender()
                                                    .setDisplayIntent(notificationPendingIntent)
//                                            .addPage(secondPageNotification)
                                    );

                    ((NotificationManager) getSystemService(NOTIFICATION_SERVICE))
                            .notify(NOTIFICATION_ID, notificationBuilder.build());
                } else {
                    Log.d(TAG, "Unrecognized path: " + path);
                }
            }
        }
    }

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        Log.d(TAG, "onMessageReceived");

        if(messageEvent.getPath().equals(Constants.PATH_NOTIFICATION)) {
            final String message = new String(messageEvent.getData());
            // handle
            Intent intent = new Intent("MessageReceived");
            intent.putExtra("message", message);
            sendBroadcast(intent);
        } else {
            super.onMessageReceived(messageEvent);
        }
    }

    @Override
    public void onPeerConnected (Node peer) {
        super.onPeerConnected(peer);

        Log.d(TAG, "onPeerConnected");
    }
}

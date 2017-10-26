#!/bin/sh

# Check Necessary Environment Items
if [[ -z $REFSDIR ]]; then
    echo "REFSDIR is not set"
    exit 1
fi

if [[ -z $CMTDIR ]]; then
    echo "CMTDIR is not set"
    exit 1
fi

if [[ -z $ANDROID_HOME ]]; then
    echo "ANDROID_HOME is not set"
    exit 1
fi

if [[ -z $BUILD_NUMBER ]]; then
    echo "BUILD_NUMBER is not set, using 1"
    BUILD_NUMBER=1
fi

# App Store Items
APP_STORE_NAME=ISLAssocAppAndroid
APP_STORE_UPLOAD_URL=https://noirmacserver.dev.corp.local/jdastore/artifacts/builder_update/$APP_STORE_NAME/$BUILD_NUMBER

# Get the app code situated
ant clean embedAppCode

cd platforms/android

# Build the Android App
./gradlew clean build

# Publish to the enterprise app store
curl -k -X POST -F packedApp=@"build/outputs/apk/android-release.apk" $APP_STORE_UPLOAD_URL

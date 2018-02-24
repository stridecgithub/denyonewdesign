### Denyo App V2
Login API Implementation star....

Plugin Installed...
*****************************************
For Http Post and Get API Calls Plugin
*****************************************
Date:17-11-2017
Time:19:00
Author:Kannan.N
Documentation URL:-http://ionicframework.com/docs/native/http/
>ionic cordova plugin add cordova-plugin-advanced-http
>npm install --save @ionic-native/http

New Page Created for notification list such as alarm,messages,events etc
>ionic g page notification


*****************************************
For Push Notification
*****************************************
Date:24-11-2017
Time:10:05
Author:Kannan.N

1 ) Documentation URL:-http://ionicframework.com/docs/native/push/
>ionic cordova plugin add phonegap-plugin-push
>npm install --save phonegap-plugin-push

2 ) Documentation URL:-http://ionicframework.com/docs/native/local-notifications/
>ionic cordova plugin add de.appplant.cordova.plugin.local-notification
>npm install --save @ionic-native/local-notifications

3) Need to Download/copy the content save file name as google-services.json the below file from server path:
http://denyoappv2.stridecdev.com/api/google-services.json add platforms\android\ folder

New Page Created for push notification checking sample (Testing Purpose)
>ionic g page notify

New Page Created for message compose to new development branch
>ionic g page compose


For Calendar Module added the following npm installed

>npm install ng2-dragula --save
>npm install moment --save
>npm install shortid --save

For Calendar Add Form the following plugin installed

>ionic cordova plugin add cordova-plugin-datepicker
>npm install --save @ionic-native/date-picker


For Image Upload for when Compose Form the following plugin need to be installed
1)
>ionic cordova plugin add cordova-plugin-camera
>npm install --save @ionic-native/camera
2)
>ionic cordova plugin add cordova-plugin-filechooser
>npm install --save @ionic-native/file-chooser
3)
>ionic cordova plugin add cordova-plugin-file
>npm install --save @ionic-native/file
4)
>ionic cordova plugin add cordova-plugin-file-transfer
>npm install --save @ionic-native/file-transfer

5) Geg GPS 
>ionic cordova plugin add cordova-plugin-nativegeocoder
>npm install --save @ionic-native/native-geocoder


>ionic cordova plugin add cordova-plugin-photo-library --variable PHOTO_LIBRARY_USAGE_DESCRIPTION="To choose photos"
>npm install --save @ionic-native/photo-library

>ionic cordova plugin add cordova-plugin-badge
>npm install --save @ionic-native/badge

>ionic cordova plugin add cordova-plugin-nativestorage
>npm install --save @ionic-native/native-storage


>npm install moment-timezone


>ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="To locate you"
>npm install --save @ionic-native/geolocation


>ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="AIzaSyDJkfkelF4cA9Umz1ISCz2OL4SqW0OSXrQ" --variable API_KEY_FOR_IOS="YOUR_IOS_API_KEY_IS_HERE"
>npm install --save @ionic-native/google-maps

>ionic cordova plugin add cordova-plugin-document-viewer
>npm install --save @ionic-native/document-viewer

>ionic cordova plugin add cordova-plugin-file-opener2
>npm install --save @ionic-native/file-opener

>ionic cordova plugin add cordova-plugin-network-information
>npm install --save @ionic-native/network

CSV 
--------
https://devdactic.com/csv-data-ionic/
npm install papaparse --save
npm install @types/papaparse --save


>ionic cordova plugin add ionic-plugin-deeplinks --variable URL_SCHEME=denyoapp --variable DEEPLINK_SCHEME=https --variable DEEPLINK_HOST=http://www.denyoappv2.stridecdev.com --variable ANDROID_PATH_PREFIX=/
>npm install --save @ionic-native/deeplinks




Step 1:
          First, we want to remove the Cordova plugin in an ionic project. It automatically recreates the plugin while creating the signed APK.
 Please type the following command in the command prompt.
                        $ ionic cordova plugin rm cordova-plugin-console
Step 2:
        Next, we want to generate a release build for Android, we can use the following Cordova CLI command:
                       $ ionic cordova build --release android
Step 3:
      Next, we can find our unsigned APK file in platforms/android/build/outputs/apk and we want to copy the APK and paste it in your project folder.
      Next, we want to set the path for keytool. By this only we can create the signed apk. Please type the following command in the command prompt. ( if keytool is not recognized as an internal or external command.)
                          set PATH="C:\Program Files\Java\jdk1.8.0_151\bin"
    After we set path in command prompt please type keytool.so we can check whether keytool is present.
Step 4:
      Let’s generate our private key using the keytool command that comes with the JDK and type following command.
$ keytool -genkey -v -keystore “app-name”.keystore -alias “alias-name” -keyalg RSA -keysize 2048 -validity 10000
After pressing enter it asking to generate a password and fill out small information what they ask.

Step 5:
    After generating the keytool and to generate the jar signer. To sign the unsigned APK, run the jar signer tool which is also included in the JDK. Please type the following command in command prompt.
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore HelloWorld-release-“app-name”.apk “alias-name”

NOTE: Here app-name and alias name are taken from the keystore what you are mention in while creating the keytool.
 Step 6:
     Finally, we need to run the zip align tool to optimize the APK. The zip-align tool can be found in /path/to/Android/sdk/build-tools/VERSION/zipalign. For example, on OS X with Android Studio installed, zipalign is in ~/Library/Android/sdk/build-tools/VERSION/zipalign
                 $ zipalign -v 4 “app-name”.apk ”renamed app-name”.apk

Note: if zip align is not recognized as an internal or external command then run the following CLI command
                                 set PATH="C:\Android\sdk\build-tools\24.0.3"


                                 denyov2

                                 kannan nagarathinam



                                 C:\ionic\denyonewdesign>
C:\ionic\denyonewdesign>keytool -genkey -v -keystore appname.keystore -alias appnamekey -keyalg RSA -keysize 2048 -validity 10000
Picked up _JAVA_OPTIONS: -Xmx512M
Enter keystore password:
Keystore password is too short - must be at least 6 characters
Enter keystore password:
Re-enter new password:
What is your first and last name?
  [Unknown]:  kannan nagarathinam
What is the name of your organizational unit?
  [Unknown]:  webneo
What is the name of your organization?
  [Unknown]:  stridec
What is the name of your City or Locality?
  [Unknown]:  madurai
What is the name of your State or Province?
  [Unknown]:  tamilnadu
What is the two-letter country code for this unit?
  [Unknown]:  91
Is CN=kannan nagarathinam, OU=webneo, O=stridec, L=madurai, ST=tamilnadu, C=91 correct?
  [no]:  y

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
        for: CN=kannan nagarathinam, OU=webneo, O=stridec, L=madurai, ST=tamilnadu, C=91
Enter key password for <appnamekey>
        (RETURN if same as keystore password):
Re-enter new password:
[Storing appname.keystore]

Warning:
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore appname.keystore -destkeystore appname.keystore -deststoretype pkcs12".



https://forum.ionicframework.com/t/ionic-toturial-for-building-a-release-apk/15758


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
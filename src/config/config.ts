import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
@Injectable()
export class Config {
    constructor(public loadingCtrl: LoadingController,
        public toastCtrl: ToastController) {
    }
    apiBaseURL() { // Base URL configuration
        return 'http://denyoappv2.stridecdev.com';
        // return 'http://localhost/denyov2/public';
    }
    rolePermissionMsg() { // Authorization message set from property configuration file
        return "Permission Denied.";
    }
    serverErrMsg() {
        // return "Server Error:Service not available";
        return "";
    }
    networkErrMsg() {
        return "Connection Error:Internet connection not available";
    }
    popoverThemeJSIonic() {
        return 0;
    }

    presentLoading(parm) {

        let loader;
        loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 300
        });
        if (parm > 0) {
            loader.present();
        } else {
            loader.dismiss();
        }
    }

    sendNotificationTimer(message): void {
        let notification = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        notification.present();
    }


    sendNotification(message): void {
        let notification = this.toastCtrl.create({
            message: message,
            duration: 3000/*,
            dismissOnPageChange: true*/
        });
        notification.present();

        /*
     notification.onDidDismiss(() => {
         console.log('Dismissed toast');
          notification.dismiss();
     });   */
    }
    /*
        sendNotification(message): void {
            let notification = this.toastCtrl.create({
                message: message,
                // duration: 3000,
                //closeButtonText:"X"
                showCloseButton: true,
                closeButtonText: "X",
                dismissOnPageChange: true
            });
            notification.present();
         
        }
        */


    timeConverter(unixtime) {
        var u = new Date(unixtime * 1000);
        return u.getUTCFullYear() +
            '-' + ('0' + u.getUTCMonth()).slice(-2) +
            '-' + ('0' + u.getUTCDate()).slice(-2) +
            ' ' + ('0' + u.getUTCHours()).slice(-2) +
            ':' + ('0' + u.getUTCMinutes()).slice(-2) +
            ':' + ('0' + u.getUTCSeconds()).slice(-2) +
            '.' + (u.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
    }

    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }
    showfooter(){
        return '<div class="custom-tab"><a class="" href="#" aria-selected="true"><ion-icon class="icon icon-md ion-md-help"></ion-icon><span class="">Dashboard</span></a><a class="" href="#"><ion-icon class="icon icon-md ion-md-help"></ion-icon><span class="">Units</span></a><a class="" href="#"><ion-icon class="icon icon-md ion-md-help"></ion-icon><span class="">Calendar</span></a><a class="" href="#"><ion-icon class="icon icon-md ion-md-help"></ion-icon><span class="">Message</span></a><a class="" href="#"><ion-icon class="icon icon-md ion-md-help"></ion-icon><span class="">Org Chart</span></a></div>';
    }

}
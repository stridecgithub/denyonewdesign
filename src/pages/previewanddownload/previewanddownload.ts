import { Component } from '@angular/core';
import {  NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { ServicingDetailsPage } from '../servicing-details/servicing-details';
import { MessagedetailPage } from '../messagedetail/messagedetail';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Config } from '../../config/config';
import { CalendarPage } from "../calendar/calendar";

import { CommentdetailsPage } from "../commentdetails/commentdetails";
/**
 * Generated class for the PreviewanddownloadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-previewanddownload',
  templateUrl: 'previewanddownload.html',
  providers: [FileTransfer, File, Config]
})
export class PreviewanddownloadPage {
  imagepath;
  imagename;
  frompage;
  uploadsuccess;
  storageDirectory: string = '';
  isjpg = 0;
  private apiServiceURL: string = "";
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public platform: Platform, private conf: Config, public navParams: NavParams, private transfer: FileTransfer, private file: File) {
    this.apiServiceURL = conf.apiBaseURL();
  }

  ionViewDidLoad() {
    this.uploadsuccess = 0;

    this.imagename = this.navParams.get("imagedata").fileName;
    console.log("Image Data" + JSON.stringify(this.navParams.get("imagedata")));
    console.log("Service Unit Data" + JSON.stringify(this.navParams.get("record")));
    console.log('ionViewDidLoad PreviewanddownloadPage');
    this.frompage = this.navParams.get("frompage");
    //http://denyoappv2.stridecdev.com/attachments/
    if (this.frompage == 'MessagedetailPage') {
      console.log("File Name:" + this.navParams.get("imagedata").fileName.split(".")[0]);
      console.log("Extension Name:" + this.navParams.get("imagedata").fileName.split(".")[1]);
      if (this.navParams.get("imagedata").fileName.split(".")[1] == 'jpg') {
        this.isjpg = 1;
      } else {
        this.isjpg = 0;
      }
      console.log(this.isjpg);
      this.imagepath = this.apiServiceURL + "/attachments/" + this.navParams.get("imagedata").fileName;
    } else {
      this.isjpg = 1;
      this.imagepath = this.navParams.get("imagedata").imgSrc;
    }
  }
  previous(frompage) {
    console.log("From page for previous:" + frompage);
    // if (this.navParams.get("record") == undefined) {
    //   this.navCtrl.setRoot(CalendarPage, {});
    //   return false;
    // }
    if (frompage == 'ServicingDetailsPage') {
      this.navCtrl.setRoot(ServicingDetailsPage, {
        record: this.navParams.get("record")
      });
    } else if (frompage == 'CommentdetailsPage') {
      this.navCtrl.setRoot(CommentdetailsPage, {
        event_id: this.navParams.get("event_id"),
        from: 'commentinfo'
      });
    } else if (frompage == 'MessagedetailPage') {
      console.log("this.navParams.get('messageid')"+this.navParams.get("messageid"));
      this.navCtrl.setRoot(MessagedetailPage, {
        item: this.navParams.get("record"),
        from: this.navParams.get("from"),
        favstatus: this.navParams.get("favstatus"),
        message_readstatus: this.navParams.get("message_readstatus"),
        event_id: this.navParams.get("messageid")
      });
    }
  }

  download(url) {
    //url='denyoappv2.stridecdev.com';
    const fileTransfer: FileTransferObject = this.transfer.create();

    let file = this.imagename;
    console.log("URL:-" + url);
    console.log("Data Directory:-" + this.file.dataDirectory)
    console.log("File:-" + file)
    fileTransfer.download(url, this.file.dataDirectory + file).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.conf.sendNotification('download complete: ' + entry.toURL());
      this.uploadsuccess = 0;
    }, (error) => {
      // handle error
      this.conf.sendNotification(error);
    });
  }

  retrieveImage(image) {
    this.uploadsuccess = 0;
    this.file.checkFile(this.file.dataDirectory, image)
      .then(() => {

        const alertSuccess = this.alertCtrl.create({
          title: `File retrieval Succeeded!`,
          subTitle: `${image} was successfully retrieved from: ${this.file.dataDirectory}`,
          buttons: ['Ok']
        });

        return alertSuccess.present();

      })
      .catch((err) => {

        const alertFailure = this.alertCtrl.create({
          title: `File retrieval Failed!`,
          subTitle: `${image} was not successfully retrieved. Error Code: ${err.code}`,
          buttons: ['Ok']
        });

        return alertFailure.present();

      });
  }
}



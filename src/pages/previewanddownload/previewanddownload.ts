import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, App } from 'ionic-angular';
import { ServicingDetailsPage } from '../servicing-details/servicing-details';
import { MessagedetailPage } from '../messagedetail/messagedetail';

import { Http, Headers, RequestOptions } from '@angular/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Config } from '../../config/config';
//import { CalendarPage } from "../calendar/calendar";

import { CommentdetailsPage } from "../commentdetails/commentdetails";
import { EventDetailsServicePage } from '../event-details-service/event-details-service';
/**
 * Generated class for the PreviewanddownloadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-previewanddownload',
  templateUrl: 'previewanddownload.html'
})
export class PreviewanddownloadPage {
  imagepath;
  imagename;
  frompage;
  uploadsuccess;
  storageDirectory: string = '';
  ispreview = 0;
  private apiServiceURL: string = "";

  eventTitle;
  event_addedby_name;
  event_remark;
  evenDate;
  event_time;
  labels;
  unitname;
  projectname;
  location;
  service_dot_color;
  item;
  description;
  service_scheduled_time;
  service_resources;
  service_remark;
  is_request;
  is_denyo_support;
  serviced_by;
  public addedImgListsDetails = [];
  next_service_date_mobileview;
  next_service_date_selected;
  //tabBarElement: any;
  eventitem;
  timezoneoffset;

  constructor(public app: App, public NP: NavParams, public navCtrl: NavController, public alertCtrl: AlertController, public platform: Platform, private conf: Config, public navParams: NavParams, private transfer: FileTransfer, private file: File, public http: Http) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.frompage = this.navParams.get("frompage");    
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }

        if (this.frompage == 'ServicingDetailsPage') {
          this.navCtrl.setRoot(ServicingDetailsPage, {
            record: this.navParams.get("record")
          });
        } else if (this.frompage == 'CommentdetailsPage') {
          this.navCtrl.setRoot(CommentdetailsPage, {
            event_id: this.navParams.get("event_id"),
            from: 'commentinfo'
          });
        } else if (this.frompage == 'MessagedetailPage') {

          this.navCtrl.setRoot(MessagedetailPage, {
            item: this.navParams.get("record"),
            from: this.navParams.get("from"),
            favstatus: this.navParams.get("favstatus"),
            message_readstatus: this.navParams.get("message_readstatus"),
            event_id: this.navParams.get("messageid")
          });
        }
      });
    });

  }

  ionViewDidLoad() {
    this.uploadsuccess = 0;

    this.imagename = this.navParams.get("imagedata").fileName;

    this.frompage = this.navParams.get("frompage");

    if (this.frompage == 'MessagedetailPage') {

      if (this.navParams.get("imagedata").fileName.split(".")[1] == 'jpg') {
        this.ispreview = 1;
      } else if (this.navParams.get("imagedata").fileName.split(".")[1] == 'png') {
        this.ispreview = 1;
      } else {
        this.ispreview = 0;
      }

      this.imagepath = this.apiServiceURL + "/attachments/" + this.navParams.get("imagedata").fileName;

    } else {
      this.ispreview = 1;
      this.imagepath = this.navParams.get("imagedata").imgSrc;
    }
    if (this.frompage == 'NotificationPage') {
    if (this.NP.get("record")) {

      let urlstr;
      if (this.conf.isUTC() > 0) {
        urlstr = "serviceid=" + this.navParams.get("record").table_id + "&timezoneoffset=" + Math.abs(this.timezoneoffset);

      } else {
        urlstr = "serviceid=" + this.navParams.get("record").table_id;
      }


      let body: string = urlstr,
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/servicebyid";

      this.http.post(url1, body, options1)
        .subscribe((data) => {
          this.item = data.json().servicedetail[0];
          if (this.item != '') {
            this.eventTitle = data.json().servicedetail[0].service_subject;
            this.eventitem = data.json().servicedetail[0];
            this.projectname = data.json().servicedetail[0].projectname;
            this.unitname = data.json().servicedetail[0].unitname;
            this.evenDate = data.json().servicedetail[0].service_formatted_date;
            this.location = data.json().servicedetail[0].location;
            this.service_remark = data.json().servicedetail[0].service_remark;


            this.service_remark = data.json().servicedetail[0].service_remark;

            if (this.service_remark == null) {
              this.service_remark = '';
            }
            if (this.service_remark == 'null') {
              this.service_remark = '';
            }


            this.description = data.json().servicedetail[0].description;

            if (this.description == null) {
              this.description = '';
            }
            if (this.description == 'null') {
              this.description = '';
            }
            this.next_service_date_mobileview = data.json().servicedetail[0].next_service_date_mobileview;
            this.service_scheduled_time = data.json().servicedetail[0].service_scheduled_time;
            this.service_dot_color = data.json().servicedetail[0].service_dot_color;
            this.next_service_date_selected = data.json().servicedetail[0].next_service_date_selected;

            this.is_request = data.json().servicedetail[0].is_request;
            this.is_denyo_support = data.json().servicedetail[0].is_denyo_support;
            this.serviced_by = data.json().servicedetail[0].serviced_by;


            this.service_resources = data.json().servicedetail[0].service_resources;
            if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {

              let hashhypenhash = this.service_resources.split("#-#");

              for (let i = 0; i < hashhypenhash.length; i++) {
                let imgDataArr = hashhypenhash[i].split("|");

                let imgSrc;
                imgSrc = this.apiServiceURL + "/serviceimages" + '/' + imgDataArr[1];
                this.addedImgListsDetails.push({
                  imgSrc: imgSrc,
                  imgDateTime: new Date(),
                  fileName: imgDataArr[1],
                  resouce_id: imgDataArr[0]
                });
              }

            }


          }
        }, error => {

        });
    }
  }
  }
  previous(frompage) {
    if (frompage == 'ServicingDetailsPage') {
     
      this.navCtrl.setRoot(ServicingDetailsPage, {
        record: this.navParams.get("record"),
        frompage:frompage
      });
    }else if (frompage == 'NotificationPage') {     
      this.navCtrl.setRoot(EventDetailsServicePage, {
        //record: this.navParams.get("record")
        event_id: this.navParams.get("record").table_id,
        event_type: 'S',
        eventdata: this.item,
        from:'notification'
      });
    }else if (frompage == 'CalendarPage') {
      
      this.navCtrl.setRoot(EventDetailsServicePage, {
        //record: this.navParams.get("record")
        event_id: this.navParams.get("record").event_id,
        event_type: this.navParams.get("record").event_type,
        eventdata: this.navParams.get("record"),
      });
    } else if (frompage == 'CommentdetailsPage') {
      this.navCtrl.setRoot(CommentdetailsPage, {
        event_id: this.navParams.get("event_id"),
        from: 'commentinfo'
      });
    } else if (frompage == 'MessagedetailPage') {

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

    const fileTransfer: FileTransferObject = this.transfer.create();

    let file = this.imagename;

    fileTransfer.download(url, this.file.dataDirectory + file).then((entry) => {

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



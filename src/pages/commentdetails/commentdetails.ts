import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
//import { AddalarmlistPage } from '../../pages/addalarmlist/addalarmlist';
import { ServicedetailsPage } from "../servicedetails/servicedetails";
import { CalendarPage } from "../calendar/calendar";
//import { AddcalendarPage } from "../addcalendar/addcalendar";
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { AddcommentsinfoPage } from '../addcommentsinfo/addcommentsinfo';
import { NotificationPage } from '../notification/notification';
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
/**
 * Generated class for the CalendardetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-commentdetails',
  templateUrl: 'commentdetails.html',
  providers: [Config]
})
export class CommentdetailsPage {

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
  comment_resources;
  private apiServiceURL: string = "";
  public addedImgListsDetails = [];
  comment_by_name_hastag;
  comment_by_name;
  //tabBarElement: any;
  eventitem;
  user_photo;
  timezoneoffset;
  constructor(public platform: Platform, public alertCtrl: AlertController, private conf: Config, public navCtrl: NavController, public navParams: NavParams, public NP: NavParams, public http: Http) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    if (this.NP.get("from") != 'Push') {
      //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    }

  }

  ionViewWillLeave() {
    if (this.NP.get("from") != 'Push') {
      //this.tabBarElement.style.display = 'flex';
    }
  }
  ionViewDidLoad() {
    if (this.NP.get("from") != 'Push') {
      //this.tabBarElement.style.display = 'none';
    }
    if (this.NP.get("event_id")) {
      // let eventType = this.NP.get("event_type");


      let urlstr;
      if (this.conf.isUTC() > 0) {
        urlstr = "commentid=" + this.NP.get("event_id") + "&timezoneoffset=" + Math.abs(this.timezoneoffset);
      } else {
        urlstr = "commentid=" + this.NP.get("event_id");
      }
      let body: string = urlstr,
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/getcommentdetails";
      console.log("Comment detail url:" + url1+"?"+body);
      this.http.post(url1, body, options1)
        .subscribe((data) => {

          this.item = data.json().comments[0];
          this.eventTitle = data.json().comments[0].comment_subject;
          this.eventitem = data.json().comments[0];
          this.projectname = data.json().comments[0].projectname;
          this.unitname = data.json().comments[0].unitname;
          this.evenDate = data.json().comments[0].comment_date;
          this.location = data.json().comments[0].location;
          this.description = data.json().comments[0].comment_remark;
          this.comment_by_name_hastag = data.json().comments[0].comment_by_name_hastag;
          this.comment_by_name = data.json().comments[0].comment_by_name;


          this.user_photo = data.json().comments[0].user_photo;

          this.service_scheduled_time = data.json().comments[0].service_scheduled_time;
          this.service_dot_color = data.json().comments[0].service_dot_color;


          this.comment_resources = data.json().comments[0].comment_resources;
          if (this.comment_resources != undefined && this.comment_resources != 'undefined' && this.comment_resources != '') {

            let hashhypenhash = this.comment_resources.split("#-#");

            for (let i = 0; i < hashhypenhash.length; i++) {
              let imgDataArr = hashhypenhash[i].split("|");

              let imgSrc;
              imgSrc = this.apiServiceURL + "/commentimages" + '/' + imgDataArr[1];
              this.addedImgListsDetails.push({
                imgSrc: imgSrc,
                imgDateTime: new Date(),
                fileName: imgDataArr[1],
                resouce_id: imgDataArr[0]
              });
            }
          }


        }, error => {

        });
    }

  }
  doEdit(item, act) {
    this.navCtrl.setRoot(ServicedetailsPage, {
      record: item,
      act: 'Edit',
      from: 'service'
    });
  }

  doConfirmUpcoming(id, item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this service schedule?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntryHistory(id);
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();


  }

  deleteEntryHistory(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.navCtrl.setRoot(CalendarPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      });
  }
  previous() {
    if (this.NP.get("from") == 'commentinfo') {
      this.navCtrl.setRoot(CommentsinfoPage, {
        record: this.item
      });
    } else if (this.NP.get("from") == 'notification') {
      this.navCtrl.setRoot(NotificationPage);
    } else if (this.NP.get("from") == 'Push') {
      this.navCtrl.setRoot(CommentsinfoPage, {
        record: this.item
      });
    } else {
      this.navCtrl.setRoot(CalendarPage);
    }
  }
  addCalendar(item) {

    //if (this.NP.get("from") != 'Push') {
    // this.tabBarElement.style.display = 'none';
    //}
    this.navCtrl.setRoot(AddcommentsinfoPage,
      {
        record: item,
        type: 'comment'
      });

  }
  doEventDelete(item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.comment_id);
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }

  deleteEntry(recordID) {
    let delactionurl;
    delactionurl = "/comments/" + recordID + "/1/delete";
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + delactionurl;
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`Comment was successfully deleted`);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.navCtrl.setRoot(CommentsinfoPage, {
            record: this.item
          });
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });
  }

  preview(imagedata, from) {
    this.navCtrl.setRoot(PreviewanddownloadPage, {
      imagedata: imagedata,
      event_id: this.NP.get("event_id"),
      frompage: from
    });
  }

}


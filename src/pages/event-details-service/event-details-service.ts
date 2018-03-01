import { Component } from '@angular/core';
import { Platform,  NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { AddalarmlistPage } from '../../pages/addalarmlist/addalarmlist';
import { ServicedetailsPage } from "../servicedetails/servicedetails";
import { CalendarPage } from "../calendar/calendar";
import { AddcalendarPage } from "../addcalendar/addcalendar";
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { NotificationPage } from '../notification/notification';
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
/**
 * Generated class for the CalendardetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-event-details-service',
  templateUrl: 'event-details-service.html',
  providers: [Config]
})
export class EventDetailsServicePage {

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
  private apiServiceURL: string = "";
  next_service_date_mobileview;
  next_service_date_selected;
  //tabBarElement: any;
  eventitem;
  frompage;
  constructor(public platform: Platform, public alertCtrl: AlertController, private conf: Config, public navCtrl: NavController, public navParams: NavParams, public NP: NavParams, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();
    if (this.NP.get("from") != 'Push') {
      //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    }
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
  }

  ionViewWillLeave() {
    if (this.NP.get("from") != 'Push') {
     // this.tabBarElement.style.display = 'flex';
    }
  }
  ionViewDidLoad() {
    if (this.NP.get("from") != 'Push') {
      //this.tabBarElement.style.display = 'none';
    }

    this.frompage = this.NP.get("from");
    if (this.NP.get("event_id")) {
      let eventType = this.NP.get("event_type");
      console.log("Event Type:" + eventType);


      let body: string = "serviceid=" + this.NP.get("event_id"),
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/servicebyid";
      console.log(url1 + "?" + body);
      this.http.post(url1, body, options1)
        .subscribe((data) => {
          console.log(JSON.stringify(data.json()))
          this.item = data.json().servicedetail[0];
          if (this.item != '') {
            console.log("JSON for service detail" + JSON.stringify(data.json().servicedetail[0]));
            this.eventTitle = data.json().servicedetail[0].service_subject;
            this.eventitem = data.json().servicedetail[0];
            this.projectname = data.json().servicedetail[0].projectname;
            this.unitname = data.json().servicedetail[0].unitname;
            this.evenDate = data.json().servicedetail[0].service_formatted_date;
            this.location = data.json().servicedetail[0].location;
            this.service_remark = data.json().servicedetail[0].service_remark
            this.description = data.json().servicedetail[0].description;
            this.next_service_date_mobileview = data.json().servicedetail[0].next_service_date_mobileview;
            this.service_scheduled_time = data.json().servicedetail[0].service_scheduled_time;
            this.service_dot_color = data.json().servicedetail[0].service_dot_color;
            this.next_service_date_selected = data.json().servicedetail[0].next_service_date_selected;
            console.log(JSON.stringify(this.item));
            this.is_request = data.json().servicedetail[0].is_request;
            this.is_denyo_support = data.json().servicedetail[0].is_denyo_support;
            this.serviced_by = data.json().servicedetail[0].serviced_by;


            this.service_resources = data.json().servicedetail[0].service_resources;
            if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {
              console.log('service reource calling....')
              let hashhypenhash = this.service_resources.split("#-#");
              console.log("#-#" + hashhypenhash);
              for (let i = 0; i < hashhypenhash.length; i++) {
                let imgDataArr = hashhypenhash[i].split("|");
                console.log("imgDataArr" + imgDataArr[i])
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
            console.log("Image Lists:-" + JSON.stringify(this.addedImgListsDetails));

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

    console.log("Deleted Id" + id);
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
        record: this.item,
        from: 'service'
      });
    } else if (this.NP.get("from") == 'notification') {
      this.navCtrl.setRoot(NotificationPage);
    } else {
      this.navCtrl.setRoot(CalendarPage);
    }
  }
  addCalendar(item) {

    if (this.NP.get("from") == 'commentinfo') {
      this.navCtrl.setRoot(ServicedetailsPage,
        {
          record: item,
          type: 'service'
        });
    } else if (this.NP.get("from") == 'push') {
      this.navCtrl.setRoot(ServicedetailsPage,
        {
          record: item,
          type: 'service'
        });
    } else {
      this.navCtrl.setRoot(AddcalendarPage,
        {
          from: 'event-detail-service',
          item: item,
          // item: this.NP.get("eventdata"),
          type: 'service'
        });
    }
  }
  doEventDelete(item) {
    console.log("Deleted Id" + item.service_id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.service_id);
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
    delactionurl = "/calendar/" + recordID + "/1/deleteservice";
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + delactionurl;
    console.log("Event Deleted API Url:" + url);
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
         // this.conf.sendNotification(`Service was successfully deleted`);
         this.conf.sendNotification(data.json().msg[0]['result']);
          if (this.NP.get("from") == 'commentinfo') {
            this.navCtrl.setRoot(CommentsinfoPage, {
              record: this.item,
              from: 'service'
            });
          } else {
            this.navCtrl.setRoot(CalendarPage);
          }
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
      record: this.navParams.get("record"),
      frompage: from
    });
  }
}


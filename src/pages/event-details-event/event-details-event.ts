import { Component } from '@angular/core';
import { Platform,  NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { AddalarmlistPage } from '../../pages/addalarmlist/addalarmlist';
import { ServicedetailsPage } from "../servicedetails/servicedetails";
import { CalendarPage } from "../calendar/calendar";
import { AddcalendarPage } from "../addcalendar/addcalendar";
import { NotificationPage } from '../notification/notification';

/**
 * Generated class for the CalendardetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-details-event',
  templateUrl: 'event-details-event.html',
  providers: [Config]
})
export class EventDetailsEventPage {

  eventTitle;
  event_addedby_name;
  event_remark;
  evenDate;
  event_time;
  event_end_time
  labels;
  unitname;
  projectname;
  location;
  event_dot_color;
  item;
  service_remark;
 // tabBarElement: any;
  eventitem;
  private apiServiceURL: string = "";
  constructor(public platform: Platform, public alertCtrl: AlertController, private conf: Config, public navCtrl: NavController, public navParams: NavParams, public NP: NavParams, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();
    if (this.NP.get("from") != 'Push') {
     /// this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
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
     // this.tabBarElement.style.display = 'none';
    }
    if (this.NP.get("event_id")) {
      let eventType = this.NP.get("event_type");
      console.log("Event Type:" + eventType);



      let body: string = "eventid=" + this.NP.get("event_id"),
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/eventdetailbyid";
      console.log(url1);
      this.http.post(url1, body, options1)
        .subscribe((data) => {
          console.log("eventdetailbyid Response Success:" + JSON.stringify(data.json()));
          console.log("Event Details:" + data.json().eventslist[0]);
          this.eventitem = data.json().eventslist[0];
          this.eventTitle = data.json().eventslist[0].event_title;
          this.event_dot_color = data.json().eventslist[0].event_dot_color;
          this.evenDate = data.json().eventslist[0].formatted_event_date;
          this.location = data.json().eventslist[0].event_location;
          this.event_remark = data.json().eventslist[0].event_remark;
          let event_alldayevent = data.json().eventslist[0].event_alldayevent;
          if (event_alldayevent == 0) {
            this.event_time = data.json().eventslist[0].event_time;
          } else {
            this.event_time =  "- " + data.json().eventslist[0].formatted_event_end_date;
          }
          console.log("A:" + data.json().eventslist[0].event_end_time);


          let evttime;
          if (data.json().eventslist[0].event_end_time == null) {
            evttime = '';
          }
          if (data.json().eventslist[0].event_end_time == null) {
            evttime = '';
          }
          if (event_alldayevent == 0) {
            if (evttime != '') {
              this.event_end_time = "-" + data.json().eventslist[0].formatted_event_end_date + " " + data.json().eventslist[0].event_end_time;
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
    if (this.NP.get("from") == 'notification') {
      this.navCtrl.setRoot(NotificationPage);
    } else {
      this.navCtrl.setRoot(CalendarPage);
    }
  }
  addCalendar(item) {
    this.navCtrl.setRoot(AddcalendarPage,
      {
        from: 'event-detail-event',
        item: item,
        //item: this.NP.get("eventdata"),
        type: 'event'

      });

  }
  doEventDelete(item) {
    console.log("Deleted Id" + item.event_id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.event_id);
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
    delactionurl = "/calendar/" + recordID + "/1/deleteevent";

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
          //this.conf.sendNotification(`Event was successfully deleted`);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.navCtrl.setRoot(CalendarPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });
  }
}



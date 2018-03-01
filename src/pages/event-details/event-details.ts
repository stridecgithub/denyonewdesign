import { Component } from '@angular/core';
import { Platform,  NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { AddalarmPage } from '../../pages/addalarm/addalarm';
import { CalendarPage } from "../calendar/calendar";
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { NotificationPage } from '../notification/notification';

/**
 * Generated class for the CalendardetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
  providers: [Config]
})
export class EventDetailsPage {

  eventTitle;
  event_addedby_name;
  event_remark;
  evenDate;
  event_time;
  labels;
  unitname;
  projectname;
  location;
  alarm_color_code;
  item;
  alarm_priority;
 // tabBarElement: any;
  frompage;
  private apiServiceURL: string = "";
  constructor(private platform: Platform, private conf: Config, public navCtrl: NavController, public navParams: NavParams, public NP: NavParams, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();

    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
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
    console.log("From Page:"+this.frompage);
    this.frompage = this.NP.get("from");
    if (this.NP.get("event_id")) {
      let body: string = "alarmid=" + this.NP.get("event_id"),
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/getalarmdetails";
      console.log(url1);
      this.http.post(url1, body, options1)
        .subscribe((data) => {
          console.log("Alarm event  details:-" + JSON.stringify(data.json()))
          this.eventTitle = data.json().alarms[0].alarm_name;
          this.evenDate = data.json().alarms[0].alarm_received_formatted_date;
          this.labels = data.json().alarms[0].labels;
          this.unitname = data.json().alarms[0].unitname;
          this.projectname = data.json().alarms[0].projectname;
          this.location = data.json().alarms[0].location;
          this.alarm_color_code = data.json().alarms[0].alarm_color_code;
          console.log(this.alarm_color_code);
          this.alarm_priority = data.json().alarms[0].alarm_priority;
          this.item = data.json().alarms[0];
          console.log(JSON.stringify(this.item));
        }, error => {

        });

    }

  }
  doEditAlarm(item, act) {
    let unitid = this.NP.get("record");
    console.log(item.alarm_assginedby_name);
    if (item.alarm_assginedby_name == '') {
      if (act == 'edit') {
        this.navCtrl.setRoot(AddalarmPage, {
          record: item,
          act: act,
          from: 'alarm',
          unitid: item.alarm_unit_id
        });
      }
    }
    else {
      this.conf.sendNotification("Alarm already assigned");
    }
  }
  previous() {
    if (this.NP.get("from") == 'commentinfo') {
      this.navCtrl.setRoot(CommentsinfoPage, {
        record: this.item,
        from: 'alarm'
      });
    } else if (this.NP.get("from") == 'notification') {
      this.navCtrl.setRoot(NotificationPage);
    } else {
      this.navCtrl.setRoot(CalendarPage);
    }
  }
}

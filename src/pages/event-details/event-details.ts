import { Component } from '@angular/core';
import { Platform, NavController, NavParams, App } from 'ionic-angular';
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
  templateUrl: 'event-details.html'
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
  timezoneoffset;
  constructor(public app: App, private platform: Platform, private conf: Config, public navCtrl: NavController, public navParams: NavParams, public NP: NavParams, public http: Http) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
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
      });
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

    this.frompage = this.NP.get("from");
    if (this.NP.get("event_id")) {

      let urlstr;
      if (this.conf.isUTC() > 0) {
        urlstr = "alarmid=" + this.NP.get("event_id") + "&timezoneoffset=" + Math.abs(this.timezoneoffset);
      } else {
        urlstr = "alarmid=" + this.NP.get("event_id");
      }

      let body: string = urlstr,
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/getalarmdetails";
      this.http.post(url1, body, options1)
        .subscribe((data) => {

          this.eventTitle = data.json().alarms[0].alarm_name;
          this.evenDate = data.json().alarms[0].alarm_received_formatted_date;
          this.labels = data.json().alarms[0].labels;
          this.unitname = data.json().alarms[0].unitname;
          this.projectname = data.json().alarms[0].projectname;
          this.location = data.json().alarms[0].location;
          this.alarm_color_code = data.json().alarms[0].alarm_color_code;

          this.alarm_priority = data.json().alarms[0].alarm_priority;
          this.item = data.json().alarms[0];



          let fls = this.eventTitle.includes('Fls');
          let wrn = this.eventTitle.includes('Wrn');
          this.alarm_priority = data.json().alarms[0].alarm_priority;

          if (fls > 0) {
            this.alarm_priority = 3;
            this.alarm_color_code = '#c4c4c4';
          }
          if (wrn > 0) {
            this.alarm_priority = 2;
          }


        }, error => {

        });

    }

  }
  doEditAlarm(item, act) {

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

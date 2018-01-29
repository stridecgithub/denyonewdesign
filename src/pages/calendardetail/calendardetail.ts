import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
/**
 * Generated class for the CalendardetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendardetail',
  templateUrl: 'calendardetail.html',
  providers: [Config]
})
export class CalendardetailPage {

  event_title;
  event_addedby_name;
  event_remark;
  event_date;
  event_time;
  private apiServiceURL: string = "";
  constructor(private conf: Config, public navCtrl: NavController, public navParams: NavParams, public NP: NavParams, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();
  }

  ionViewDidLoad() {

    console.log(this.NP.get("event_type"));
    if (this.NP.get("event_id")) {
      console.log('Push');
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
          this.selectEntry(data.json().eventslist[0]);
        }, error => {

        });
    }

  }
  selectEntry(item) {
    localStorage.setItem("unitId", item.alarm_unit_id);
    this.event_title = item.event_title;
    this.event_addedby_name = item.event_addedby_name;
    this.event_remark = item.event_remark;
    this.event_date = item.event_date;
    this.event_time = item.event_time;
  }

}

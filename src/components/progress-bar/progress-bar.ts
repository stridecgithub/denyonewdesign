import { Component, Input, ViewChild } from '@angular/core';
import { OrgchartPage } from '../../pages/orgchart/orgchart';
import { CalendarPage } from '../../pages/calendar/calendar';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { MessagesPage } from '../../pages/messages/messages';
import { UnitsPage } from '../../pages/units/units';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {
  userId;
  msgcount;
  @Input('progress') progress;
  dashboardhighlight: any;
  unitshighlight: any;
  calendarhighlight: any;
  messagehighlight: any;
  orgcharthighlight: any;
  notcount;
  private apiServiceURL: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private conf: Config, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    this.dashboardhighlight = 0;
    this.unitshighlight = 0;
    this.calendarhighlight = 0;
    this.messagehighlight = 0;
    this.orgcharthighlight = 0;
    this.doNotifiyCount();

  }
  doNotifiyCount() {
    // Notification count
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        console.log("Message Count:" + this.msgcount);
        if (this.msgcount == 0) { this.msgcount = ''; }
        this.notcount = data.json().notifycount;
      }, error => {
        console.log(error);
      });
    // Notiifcation count
  } 
  goto(page) {
    console.log(page);
    if (page == 'DashboardPage') {
      this.dashboardhighlight = 1;
      this.navCtrl.setRoot(DashboardPage, { dashboardselected: this.dashboardhighlight });
      return false;
    }
    if (page == 'UnitsPage') {
      this.unitshighlight = 1;

      this.navCtrl.setRoot(UnitsPage, { dashboardselected: this.dashboardhighlight });
    }
    if (page == 'CalendarPage') {
      this.calendarhighlight = 1;

      this.navCtrl.setRoot(CalendarPage), { dashboardselected: this.dashboardhighlight };
    }
    if (page == 'MessagePage') {
      this.messagehighlight = 1;
      this.navCtrl.setRoot(MessagesPage, { dashboardselected: this.dashboardhighlight });
    }
    if (page == 'OrgchartPage') {
      this.orgcharthighlight = 1;
      this.navCtrl.setRoot(OrgchartPage, { dashboardselected: this.dashboardhighlight });
    }
    console.log(this.dashboardhighlight);
    console.log(this.unitshighlight);
    console.log(this.calendarhighlight);
    console.log(this.messagehighlight);
    console.log(this.orgcharthighlight);
    console.log('dashboardselected' + this.navParams.get('dashboardselected'));
    this.dashboardhighlight = this.navParams.get('dashboardselected');

  }


}
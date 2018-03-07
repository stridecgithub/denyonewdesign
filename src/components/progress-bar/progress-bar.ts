import { Component, Input } from '@angular/core';
import { OrgchartPage } from '../../pages/orgchart/orgchart';
import { CalendarPage } from '../../pages/calendar/calendar';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { MessagesPage } from '../../pages/messages/messages';
import { UnitsPage } from '../../pages/units/units';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { PermissionPage } from '../../pages/permission/permission';
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {
  userId;
  msgcount;
  countDown: number = 0;
  @Input('progress') progress;
  dashboardhighlight: any;
  unitshighlight: any;
  calendarhighlight: any;
  messagehighlight: any;
  orgcharthighlight: any;
  tabIndexVal: any;
  notcount;
  page;
  private apiServiceURL: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private conf: Config, public http: Http, public events: Events) {
    this.apiServiceURL = this.conf.apiBaseURL();
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
        this.page = this.navCtrl.getActive().name;
        console.log(this.page);
      }, error => {
        console.log(error);
      });
    // Notiifcation count
  }
  goto(page) {
    let footeraccessstorage = localStorage.getItem("footermenu");
    let footeraccessparams = this.navParams.get('footermenu');
    let footermenuacc;
    if (footeraccessparams != undefined) {
      footermenuacc = footeraccessparams;
    } else {
      footermenuacc = footeraccessstorage;
    }

    console.log("Footer Menu Access" + footermenuacc);
    // this.footerBar="0,"+footermenuacc;

    let footermenusplitcomma = footermenuacc.split(",");
    let dashboardAccess = footermenusplitcomma[0];
    let unitAccess = footermenusplitcomma[1];
    let calendarAccess = footermenusplitcomma[2];
    let messageAccess = footermenusplitcomma[3];
    let orgchartAccess = footermenusplitcomma[4];

    console.log("Footer Menu Access for Dashboard" + dashboardAccess);
    console.log("Footer Menu Access for Dashboard" + unitAccess);
    console.log("Footer Menu Access for Calendar" + calendarAccess);
    console.log("Footer Menu Access for Messagees" + messageAccess);
    console.log("Footer Menu Access for Org Chart" + orgchartAccess);
    if (dashboardAccess == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
      return false;
    } else if (unitAccess == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
      return false;
    } else if (calendarAccess == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
      return false;
    } else if (messageAccess == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
      return false;
    } else if (orgchartAccess == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
      return false;
    } else {
      if (page == 'DashboardPage') {
        this.dashboardhighlight = 1;
        this.events.publish('menu:created', 'dashboard', Date.now());
        this.tabSelection(0);
        this.navCtrl.setRoot(DashboardPage, { dashboardselected: this.dashboardhighlight });
        return false;
      }
      if (page == 'UnitsPage') {
        this.unitshighlight = 1;
        this.events.publish('menu:created', 'units', Date.now());
        this.tabSelection(1);
        this.navCtrl.setRoot(UnitsPage, { dashboardselected: this.dashboardhighlight });
      }
      if (page == 'CalendarPage') {
        this.calendarhighlight = 1;
        this.tabSelection(2);
        this.events.publish('menu:created', 'calendar', Date.now());
        this.navCtrl.setRoot(CalendarPage), { dashboardselected: this.dashboardhighlight };
      }
      if (page == 'MessagePage') {
        this.tabSelection(3);
        this.events.publish('menu:created', 'message', Date.now());
        this.messagehighlight = 1;
        this.navCtrl.setRoot(MessagesPage, { dashboardselected: this.dashboardhighlight });
      }
      if (page == 'OrgchartPage') {
        this.tabSelection(4);
        this.events.publish('menu:created', 'orgchart', Date.now());
        this.orgcharthighlight = 1;
        this.navCtrl.setRoot(OrgchartPage, { dashboardselected: this.dashboardhighlight });
      }
      console.log(this.dashboardhighlight);
      console.log(this.unitshighlight);
      console.log(this.calendarhighlight);
      console.log(this.messagehighlight);
      console.log(this.orgcharthighlight);
      console.log('dashboardselected' + this.navParams.get('dashboardselected'));

      this.events.subscribe('menu:created', (menu, time) => {
        console.log(menu);
        if (menu == 'dashboard') {
          console.log('A');
          this.dashboardhighlight = 1;

        }
        if (menu == 'units') {
          console.log('B');
          this.unitshighlight = 1;
          localStorage.setItem("tabIndex", "1");
        }
        if (menu == 'calendar') {
          console.log('C');
          this.calendarhighlight = 1;
          localStorage.setItem("tabIndex", "2");
        }
        if (menu == 'message') {
          console.log('D');
          this.messagehighlight = 1;
          localStorage.setItem("tabIndex", "3");
        }
        if (menu == 'orgchart') {
          console.log('E');
          this.orgcharthighlight = 1;
          localStorage.setItem("tabIndex", "4");
        }
      });


    }
  }
  tabSelection(val) {
    this.tabIndexVal = localStorage.getItem("tabIndex");
    // setInterval(() => {
    //   this.countDown++;

    //   if (this.countDown == 5) {
    //     console.log('Progress bar view loaded');
    //     this.tabIndexVal = localStorage.getItem("tabIndex");
    //     console.log("Tab Index is:"+this.tabIndexVal);
    //     this.countDown=0;
    //   }

    // }, 50);

  }

}
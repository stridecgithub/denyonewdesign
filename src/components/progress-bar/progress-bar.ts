import { Component, Input } from '@angular/core';
import { OrgchartPage } from '../../pages/orgchart/orgchart';
import { CalendarPage } from '../../pages/calendar/calendar';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { MessagesPage } from '../../pages/messages/messages';
import { UnitsPage } from '../../pages/units/units';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { PermissionPage } from '../../pages/permission/permission';
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
        if (this.msgcount == 0) { this.msgcount = ''; }
        this.notcount = data.json().notifycount;
        this.page = this.navCtrl.getActive().name;
        
      }, error => {
        
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
      

      this.events.subscribe('menu:created', (menu, time) => {
       
        if (menu == 'dashboard') {
         
          this.dashboardhighlight = 1;

        }
        if (menu == 'units') {
         
          this.unitshighlight = 1;
          localStorage.setItem("tabIndex", "1");
        }
        if (menu == 'calendar') {
         
          this.calendarhighlight = 1;
          localStorage.setItem("tabIndex", "2");
        }
        if (menu == 'message') {
         
          this.messagehighlight = 1;
          localStorage.setItem("tabIndex", "3");
        }
        if (menu == 'orgchart') {
          
          this.orgcharthighlight = 1;
          localStorage.setItem("tabIndex", "4");
        }
      });


   // }
  }
  tabSelection(val) {
    this.tabIndexVal = localStorage.getItem("tabIndex");
    

  }

}
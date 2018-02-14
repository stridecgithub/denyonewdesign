import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DashboardPage } from "../dashboard/dashboard";
import { UnitsPage } from "../units/units";
import { CalendarPage } from "../calendar/calendar";
import { MessagesPage } from "../messages/messages";
import { OrgchartPage } from "../orgchart/orgchart";
import { LoginPage } from "../login/login";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MessageDetailViewPage } from '../message-detail-view/message-detail-view';
import { EventDetailsPage } from '../event-details/event-details';
import { EventDetailsEventPage } from '../event-details-event/event-details-event';
import { EventDetailsServicePage } from '../event-details-service/event-details-service';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  providers: [Push, LocalNotifications, Config]//,Storage
})
export class TabsPage {

  DashboardPage = DashboardPage;
  UnitsPage = UnitsPage;
  CalendarPage = CalendarPage;
  MessagePage = MessagesPage;
  OrgchartPage = OrgchartPage;
  userId;
  public msgcount: any;
  public notcount: any;
  public pushnotifycount: any;
  public tabIndex: Number = 0;
  private apiServiceURL: string = "";
  
  constructor(platform: Platform, public events: Events, public navCtrl: NavController, private push: Push, private localNotifications: LocalNotifications, public navParams: NavParams, public http: Http, private conf: Config) {
    this.apiServiceURL = conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    let tabIndex = this.navParams.get('tabIndex');
    if (tabIndex) {
      this.tabIndex = tabIndex;
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('android')) {
        console.log("Devices Running...");
        if (this.userId > 0) {
          this.initPushNotification();
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
    console.log("Page Name" + this.navCtrl.getActive().name);
    this.events.subscribe('menu:created', (menu, time) => {
      console.log(menu);
    });
    this.userId = localStorage.getItem("userInfoId");
    console.log("login.ts userid:" + this.userId);
    if (this.userId == 'undefined') {
      this.userId = 0;
      console.log("login.ts  A");
    }
    if (this.userId == 'null') {
      this.userId = 0;
      console.log("login.ts B");
    }
    if (this.userId == null) {
      this.userId = 0;
      console.log("login.ts C");
    }
    if (this.userId == undefined) {
      this.userId = 0;
      console.log("login.ts D");
    }

    if (this.userId == '') {
      this.userId = 0;
      console.log("login.ts D");
    }

    console.log("Finally" + this.userId);
    if (this.userId == 0) {

      console.log("login.ts  User id logged out action from dashboard.ts");
      this.navCtrl.setRoot(LoginPage, {});
    }
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
  goToPage(page) {
    /*console.log(page);
    if (page == 'calendar') {
      this.navCtrl.setRoot(TabsPage, { tabIndex: 2 });
    }
    if (page == 'dashboard') {
      this.navCtrl.setRoot(TabsPage, { tabIndex: 0 });
    }
    if (page == 'units') {
      this.navCtrl.setRoot(TabsPage, { tabIndex: 1 });
    }
    if (page == 'message') {
      this.navCtrl.setRoot(TabsPage, { tabIndex: 3 });
    }*/


  }
  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // to initialize push notifications

    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };


    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a new notification in tab page', notification);
      console.log(notification.additionalData.arrayval.type);
      this.pushnotifycount = 0;
      if (notification.additionalData.arrayval.type == 'M') {
        console.log("A:" + this.pushnotifycount);
        this.pushnotifycount = this.pushnotifycount + 1;
        console.log("B:" + this.pushnotifycount);
        //this.msgcount = this.msgcount + this.pushnotifycount;
        console.log("C:" + this.msgcount);
      }

      this.schedule(notification, this.msgcount);
    }
    );

    pushObject.on('registration').subscribe((registration: any) => {

      console.log('Device registered', registration);
      console.log('Device Json registered', JSON.stringify(registration));
      localStorage.setItem("deviceTokenForPushNotification", registration.registrationId);
    }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));


  }
  public schedule(notification, cnt) {
    if (this.userId > 0) {
      //this.msgcount = cnt;
      console.log("D:" + JSON.stringify(notification));
      this.localNotifications.schedule({
        title: notification.title,
        text: notification.message,
        at: new Date(new Date()),
        sound: null
      });

      localStorage.setItem("navtype", notification.additionalData.arrayval.type);
      localStorage.setItem("navtid", notification.additionalData.arrayval.id);

      this.localNotifications.on("click", (notification, state) => {
        console.log("Local notification clicked...");
        console.log("1" + notification);
        console.log("2" + state);
        console.log("3" + JSON.stringify(notification));
        console.log("4" + JSON.stringify(state));
        let navids = localStorage.getItem("navtid");
        let navtypes = localStorage.getItem("navtype");
        console.log(navids);
        console.log(navtypes);

        if (navtypes == 'M') {
          this.navCtrl.setRoot(MessageDetailViewPage, {
            event_id: navids,
            from: 'push'
          });
        }
        else if (navtypes == 'OA') {
          this.navCtrl.setRoot(EventDetailsPage, {
            event_id: navids,
            from: 'Push'
          });
        } else if (navtypes == 'A') {
          this.navCtrl.setRoot(EventDetailsPage, {
            event_id: navids,
            from: 'Push'
          });
          localStorage.setItem("fromModule", "AlarmdetailsPage");
        } else if (navtypes == 'C') {
          this.navCtrl.setRoot(CommentdetailsPage, {
            event_id: navids,
            from: 'Push'
          });
          localStorage.setItem("fromModule", "CommentdetailsPage");
        } else if (navtypes == 'E') {
          this.navCtrl.setRoot(EventDetailsEventPage, {
            event_id: navids,
            from: 'Push',
          });
          localStorage.setItem("fromModule", "CalendardetailPage");
        } else if (navtypes == 'S') {
          this.navCtrl.setRoot(EventDetailsServicePage, {
            event_id: navids,
            from: 'Push'
          });
          localStorage.setItem("fromModule", "ServicedetailsPage");
        }

      });

    }
  }

  
  
}

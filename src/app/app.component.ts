import { Component, ViewChild, Output, EventEmitter, Input, HostListener, ElementRef, } from '@angular/core';
import { Platform, NavController, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from "../pages/login/login";
/* For Notification */
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { LocalNotifications } from '@ionic-native/local-notifications';
//import { TabsPage } from "../pages/tabs/tabs";
import { Config } from '../config/config';


/* For Notification */
import { Http, Headers, RequestOptions } from '@angular/http';
//import {Storage} from '@ionic/storage';
import { MyaccountPage } from "../pages/myaccount/myaccount";
import { Keyboard } from '@ionic-native/keyboard';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { CompanygroupPage } from '../pages/companygroup/companygroup';
import { UnitgroupPage } from '../pages/unitgroup/unitgroup';
import { UserPage } from '../pages/user/user';
import { RolePage } from '../pages/role/role';
import { ReporttemplatePage } from '../pages/reporttemplate/reporttemplate';
import { OrgchartPage } from '../pages/orgchart/orgchart';
import { CalendarPage } from '../pages/calendar/calendar';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { MessagesPage } from '../pages/messages/messages';
import { ReportsPage } from '../pages/reports/reports';
import { UnitsPage } from '../pages/units/units';
import { EnginedetailPage } from '../pages/enginedetail/enginedetail';
import { AddorgchartonePage } from '../pages/addorgchartone/addorgchartone';
import { EventsandcommentsPage } from '../pages/eventsandcomments/eventsandcomments';
import { Network } from '@ionic-native/network';

//import { Push, PushObject, PushOptions } from '@ionic-native/push';
@Component({
  templateUrl: 'app.html',
  providers: [Config, Keyboard, DataServiceProvider]//,Storage
})
export class MyApp {
  @Output() input: EventEmitter<string> = new EventEmitter<string>();
  @Input('br-data-dependency') nextIonInputId: any = null;
  rootPage: any = LoginPage;
  firstname;
  lastname;
  companyId;
  companyGroupName;
  userId;
  menuActive;
  parentMenue = [];
  childMenu = [];
  profilePhoto = '../assets/imgs/user-pic.jpg';
  private apiServiceURL: string = "";
  menuSelection;
  @ViewChild('content') navCtrl: NavController;
  showLevel1 = null;
  showLevel2 = null;
  pages: Array<{ title: string, component: any, icon: string, color: any, background: any }>;

  constructor(private network: Network, private push: Push, private keyboard: Keyboard, public dataService: DataServiceProvider, platform: Platform, public elementRef: ElementRef, public http: Http, private conf: Config, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl: MenuController, public events: Events) {
    this.apiServiceURL = conf.apiBaseURL();
    this.menuActive = 'menuactive-dashboard';
    let leftmenu = localStorage.getItem("leftmenu");

    console.log("Left Menu Access1:" + leftmenu);
    this.dataService.getMenus()
      .subscribe((response) => {
        console.log("Menu Loading......");
        this.menuOpened();
        //this.pages = response;

        let leftmenu = localStorage.getItem("leftmenu");
        console.log("Left Menu Access1:" + leftmenu);
        this.pages = JSON.parse(localStorage.getItem("leftmenu"));

        console.log("Menu JSON" + JSON.stringify(this.pages));
      });

    /*
    [{"title":"Dashboard","icon":"dashboard","color":"gray"},{"title":"Units","icon":"units","color":"gray","subs":[{"title":"Unit Listing","component":"UnitsPage"},{"title":"Unit Group","component":"UnitgroupPage"},{"title":"Engine Model","component":"EnginedetailPage"}]},{"title":"Calendar","icon":"calendar","color":"gray"},{"title":"Message","icon":"messages","color":"gray"},{"title":"Reports","icon":"reports","color":"gray"},{"title":"Settings","icon":"settings","color":"gray","subs":[{"title":"My Account","component":"MyaccountPage"},{"title":"User List","component":"UserPage"},{"title":"Company Group","component":"CompanygroupPage"},{"title":"User Role","component":"RolePage"},{"title":"Report Template","component":"ReporttemplatePage"},{"title":"Org Chart","component":"OrgchartPage"}]},{"title":"Logout","icon":"logout","color":"gray"}]
    */

    /*
        this.nativeStorage.getItem('menuItem')
          .then(
          data => {
            console.log("Native Storage Data:" + JSON.stringify(data));
            this.profilePhoto = this.apiServiceURL + "/staffphotos/" + data.profilePhoto;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.companyGroupName = data.companyGroupName;
          },
          error => console.error(error)
          );
    */
    platform.ready().then(() => {
      this.initPushNotification();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('android')) {
        console.log("Devices Running...");
        //this.initPushNotification();
      }
      statusBar.styleDefault();
      splashScreen.hide();

      this.parentMenue = ['units', 'dashboard'];
      this.childMenu = ["units-enginemodelmanagement", "units-unit"]
      //   this.menuAccessData = this.menuAccessData({
      //     parentmenu: 'units',
      //     dashboard
      // });
      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");
      console.log("User Id:" + this.userId);
      if (this.userId != undefined) {
        this.firstname = localStorage.getItem("userInfoName");
        this.lastname = localStorage.getItem("userInfoLastName");
        this.companyGroupName = localStorage.getItem("userInfoCompanyGroupName");
        this.profilePhoto = localStorage.getItem("userInfoPhoto");
        if (this.profilePhoto == '' || this.profilePhoto == 'null') {
          this.profilePhoto = this.apiServiceURL + "/images/default.png";
        } else {
          this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
        }
      } else {
        this.events.subscribe('user:created', (user, time) => {
          // user and time are the same arguments passed in `events.publish(user, time)`
          console.log('Welcome', user, 'at', time);
          console.log("First Name:" + user.firstname);
          this.firstname = user.firstname;
          this.lastname = user.lastname;
          console.log("User info from event created" + JSON.stringify(user));
          this.companyGroupName = user.companygroup_name;
          this.profilePhoto = user.photo;
          if (this.profilePhoto == '' || this.profilePhoto == 'null') {
            this.profilePhoto = this.apiServiceURL + "/images/default.png";
          } else {
            this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
          }
        });
      }

      statusBar.styleDefault();
      setTimeout(() => {
        splashScreen.hide();
      }, 100);


      keyboard.disableScroll(true);
      keyboard.hideKeyboardAccessoryBar(true);



      // Connection checking
      // watch network for a disconnect
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        this.conf.sendNotification('network was disconnected :-(')
      });

      // stop disconnect watch
      disconnectSubscription.unsubscribe();


      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        this.conf.sendNotification('network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!');

            this.conf.sendNotification('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });

      // stop connect watch
      connectSubscription.unsubscribe();
      // Connection Checking
    });
    this.events.publish('menu:created', 'dashboard', Date.now());
    // this.pages = [
    //   { title: 'Dashboard', component: '', icon: 'dashboard', color: 'gray', background: 'gray' },
    //   { title: 'Company Group', component: CompanygroupPage, icon: 'dashboard', color: 'gray', background: 'gray' },
    //   { title: 'Users', component: UserPage, icon: 'dashboard', color: 'gray', background: 'gray' },
    //   { title: 'Units', component: '', icon: 'units', color: 'gray', background: 'gray' },
    //   { title: 'Unit Group', component: UnitgroupPage, icon: 'dashboard', color: 'gray', background: 'gray' },
    //   { title: 'Engine Details', component: EnginedetailPage, icon: 'dashboard', color: 'gray', background: 'gray' },
    //   { title: 'Role', component: RolePage, icon: 'units', color: 'gray', background: 'gray' },
    //   { title: 'My Account', component: MyaccountPage, icon: 'units', color: 'gray', background: 'gray' },
    //   { title: 'Report Template', component: ReporttemplatePage, icon: 'units', color: 'gray', background: 'gray' },
    //   { title: 'Org Chart', component: OrgchartPage, icon: 'units', color: 'gray', background: 'gray' },
    //   { title: 'Calendar', component: CalendarPage, icon: 'calendar', color: 'gray', background: 'gray' },
    //   { title: 'Message', component: '', icon: 'messages', color: 'gray', background: 'gray' },
    //   { title: 'Reports', component: '', icon: 'reports', color: 'gray', background: 'gray' },
    //   { title: 'Settings', component: '', icon: 'settings', color: 'gray', background: 'gray' },
    //   { title: 'Events and Comments', component: EventsandcommentsPage, icon: 'settings', color: 'gray', background: 'gray' },
    //   { title: 'Logout', component: '', icon: 'logout', color: 'gray', background: 'gray' }
    // ];
    events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      //this.firstname=user[0].firstname;
      //this.lastname=user[0].firstname;
    });

  }
  openPage(page) {
    if (page.component == 'UnitslistingPage') {
      this.menuActive = 'menuactive-units';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'units', Date.now());
      this.navCtrl.setRoot(UnitsPage, { tabIndex: 1 });
    } else if (page.component == 'UnitgroupPage') {
      this.navCtrl.setRoot(UnitgroupPage, { tabIndex: 1 });
    } else if (page.component == 'MyaccountPage') {
      this.navCtrl.setRoot(MyaccountPage);
    } else if (page.component == 'UserlistPage') {
      this.navCtrl.setRoot(UserPage);
    } else if (page.component == 'CompanygroupPage') {
      this.navCtrl.setRoot(CompanygroupPage, { tabIndex: 1 });
    } else if (page.component == 'UserrolePage') {
      this.navCtrl.setRoot(RolePage);
    } else if (page.component == 'ReporttemplatePage') {
      this.navCtrl.setRoot(ReporttemplatePage);
    } else if (page.component == 'OrgchartPage') {
      this.navCtrl.setRoot(OrgchartPage, { tabIndex: 4 });
    } else if (page.component == 'EventsandcommentsPage') {
      this.navCtrl.setRoot(EventsandcommentsPage);
    } else if (page.title == 'Messages') {
      this.menuActive = 'menuactive-messages';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'messages', Date.now());
      this.navCtrl.setRoot(MessagesPage, { tabIndex: 3 });
    } else if (page.title == 'Logout') {
      this.menuActive = 'menuactive-logout';
      this.events.publish('menu:created', 'logout', Date.now());
      this.logout();// Service api moblogout/1
    } else if (page.title == 'Dashboard') {
      // this.menuCtrl.close();
      // this.navCtrl.setRoot(DashboardPage);

      this.menuActive = 'menuactive-dashboard';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'dashboard', Date.now());
      this.navCtrl.setRoot(DashboardPage, { tabIndex: 0 });

    } else if (page.title == 'Reports') {
      this.menuActive = 'menuactive-reports';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'reports', Date.now());
      this.navCtrl.setRoot(ReportsPage);
    } else if (page.title == 'Calendar') {
      this.menuActive = 'menuactive-calendar';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'calendar', Date.now());
      this.navCtrl.setRoot(CalendarPage, { tabIndex: 2 });
    } else if (page.title == 'Reports') {
      this.menuCtrl.close();
      this.navCtrl.setRoot(ReportsPage);
    } else if (page.title == 'Alarm') {
      this.menuCtrl.close();
      //this.navCtrl.setRoot(AlarmPage);
    }
    else if (page.component == 'MapdemoPage') {
      //this.navCtrl.setRoot(MapdemoPage);
    } else if (page.component == 'GeneratormodelmanagementPage') {
      this.navCtrl.setRoot(EnginedetailPage);
    } else if (page.title == 'Settings') {
      /* this.menuActive = 'menuactive-settings';
       this.menuCtrl.close();
       this.events.publish('menu:created', 'settings', Date.now());
       this.navCtrl.setRoot(MyaccountPage);*/
      //this.navCtrlCtrl.setRoot(AttentionPage);
    } else if (page.component == 'AddorgchartonePage') {
      /* this.menuActive = 'menuactive-settings';
       this.menuCtrl.close();
       this.events.publish('menu:created', 'settings', Date.now());
       this.navCtrl.setRoot(MyaccountPage);*/
      this.navCtrl.setRoot(AddorgchartonePage);
    }



  }

  logout() {
    localStorage.setItem("personalhashtag", "");
    localStorage.setItem("fromModule", "");
    localStorage.setItem("userInfo", "");
    localStorage.setItem("userInfoId", "");
    localStorage.setItem("userInfoName", "");
    localStorage.setItem("userInfoLastName", "");
    localStorage.setItem("userInfoEmail", "");
    localStorage.setItem("userInfoCompanyId", "");
    localStorage.setItem("atMentionedStorage", "");
    localStorage.setItem("userInfoCompanyGroupName", "");
    localStorage.setItem("userInfoPhoto", "");
    localStorage.setItem("leftmenu", "");
    localStorage.setItem("footermenu", '');

    localStorage.setItem("DASHBOARD_MAP_VIEW", '');


    localStorage.setItem("DASHBOARD_UNITS_VIEW", '');
    localStorage.setItem("DASHBOARD_UNITS_EDIT", '');
    localStorage.setItem("DASHBOARD_UNITS_HIDE", '');

    this.events.unsubscribe('user:created', null);

    /*this.storage.clear().then(()=>{
        console.log('all keys are cleared');
          });*/
    let
      typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headersunit: any = new Headers({ 'Content-Type': typeunit }),
      optionsunit: any = new RequestOptions({ headers: headersunit }),
      urlunit: any = this.apiServiceURL + "/moblogout/" + this.userId;
    console.log("Logout URL" + urlunit);
    this.http.get(urlunit, optionsunit)
      .subscribe((data) => {					// If the request was successful notify the user
        if (data.status === 200) {
          console.log(JSON.stringify(data.json()));
        }

      }, error => {

      });


    //this.events.publish('user:created', user, Date.now());

    this.navCtrl.setRoot(LoginPage);
  }
  @HostListener('keydown', ['$event'])
  keyEvent(event) {
    console.log(JSON.stringify(event));
    console.log(event.srcElement.tagName)
    if (event.srcElement.tagName !== "INPUT") {
      return;
    }

    var code = event.keyCode || event.which;
    if (code === TAB_KEY_CODE) {
      event.preventDefault();
      this.onNext();
      let previousIonElementValue = this.elementRef.nativeElement.children[0].value;
      this.input.emit(previousIonElementValue)
    } else if (code === ENTER_KEY_CODE) {
      event.preventDefault();
      this.onEnter();
      let previousIonElementValue = this.elementRef.nativeElement.children[0].value;
      this.input.emit(previousIonElementValue)
    }
  }

  onEnter() {
    console.log("onEnter()-kannan appcomponent ts");
    this.keyboard.close();
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

    //to initialize push notifications

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
    pushObject.on('registration').subscribe((registration: any) => {

      console.log('Device registered', registration);
      console.log('Device Json registered', JSON.stringify(registration));
      localStorage.setItem("deviceTokenForPushNotification", registration.registrationId);
    }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));


  }
  onNext() {
    console.log("onNext()");
    this.keyboard.close();/*
    if (!this.nextIonInputId) {
      return;
    }
    let nextInputElement = document.getElementById(this.nextIonInputId);
    // On enter, go to next input field
    if (nextInputElement && nextInputElement.children[0]) {
      let element: any = nextInputElement.children[0];
      if (element.tagName === "INPUT") {
        element.focus();
      }
    }*/
  }


  menuClosed() {

    this.events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      console.log("First Name:" + user.firstname);
      this.firstname = user.firstname;
      this.lastname = user.lastname;
      console.log("User info from event created" + JSON.stringify(user));
      this.companyGroupName = user.companygroup_name;
      this.profilePhoto = user.photo;
      if (this.profilePhoto == '' || this.profilePhoto == 'null') {
        this.profilePhoto = this.apiServiceURL + "/images/default.png";
      } else {
        this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
      }
    });

    console.log("Dashboard- Menu Opened");
    this.events.publish('menu:closed', '');
    this.firstname = localStorage.getItem("userInfoName");
    this.lastname = localStorage.getItem("userInfoLastName");
    this.companyGroupName = localStorage.getItem("userInfoCompanyGroupName");
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
  }

  menuOpened() {

    this.events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      console.log("First Name:" + user.firstname);
      this.firstname = user.firstname;
      this.lastname = user.lastname;
      console.log("User info from event created" + JSON.stringify(user));
      this.companyGroupName = user.companygroup_name;
      this.profilePhoto = user.photo;
      if (this.profilePhoto == '' || this.profilePhoto == 'null') {
        this.profilePhoto = this.apiServiceURL + "/images/default.png";
      } else {
        this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
      }

      let leftmenu = localStorage.getItem("leftmenu");
      console.log("Left Menu Access1:" + leftmenu);
      this.pages = JSON.parse(localStorage.getItem("leftmenu"));
    });

    console.log("Dashboard- Menu Opened");

    this.firstname = localStorage.getItem("userInfoName");
    this.lastname = localStorage.getItem("userInfoLastName");
    this.companyGroupName = localStorage.getItem("userInfoCompanyGroupName");
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }

    this.events.publish('menu:opened', '');

    let leftmenu = localStorage.getItem("leftmenu");
    console.log("Left Menu Access1:" + leftmenu);
    this.pages = JSON.parse(localStorage.getItem("leftmenu"));
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };
}
const TAB_KEY_CODE = 9;
const ENTER_KEY_CODE = 13;
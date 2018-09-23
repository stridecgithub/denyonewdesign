import { Component, ViewChild, Output, EventEmitter, Input, HostListener, ElementRef, } from '@angular/core';
import { Platform, NavController, MenuController, Events, AlertController } from 'ionic-angular';
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
import { PaginatePage } from '../pages/paginate/paginate';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
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

  constructor(public alertCtrl: AlertController, private network: Network, private keyboard: Keyboard, public dataService: DataServiceProvider, platform: Platform, public elementRef: ElementRef, public http: Http, private conf: Config, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl: MenuController, public events: Events, private push: Push,
    public networkProvider: NetworkProvider) {//
    this.apiServiceURL = this.conf.apiBaseURL();
    this.menuActive = 'menuactive-dashboard';



    this.dataService.getMenus()
      .subscribe((response) => {

        this.menuOpened();
        this.pages = response;
      });


    platform.ready().then(() => {

      localStorage.setItem("isNet", 'online');
      this.network.onConnect().subscribe(data => {
        localStorage.setItem("isNet", data.type);
      }, error => console.error(error));

      this.network.onDisconnect().subscribe(data => {
        localStorage.setItem("isNet", data.type);
      }, error => console.error(error));
      this.networkProvider.initializeNetworkEvents();
      // Offline event
      this.events.subscribe('network:offline', () => {
        localStorage.setItem("isNet", 'offline');
        this.conf.sendNotification('Network not available');
      });
      // Online event
      this.events.subscribe('network:online', () => {
        localStorage.setItem("isNet", 'online');
        this.conf.sendNotification('Net connected');
      });

      this.initPushNotification();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('android')) {

      }
      statusBar.styleDefault();
      splashScreen.hide();

      this.parentMenue = ['units', 'dashboard'];
      this.childMenu = ["units-enginemodelmanagement", "units-unit"]

      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");

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

          this.firstname = user.firstname;
          this.lastname = user.lastname;

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

        this.conf.sendNotification('network was disconnected :-(')
      });

      // stop disconnect watch
      disconnectSubscription.unsubscribe();


      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {

        this.conf.sendNotification('network connected!');
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (this.network.type === 'wifi') {


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
    } else if (page.component == 'EnginemodelPage') {
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
  showAlert(titl, msg) {
    let alert = this.alertCtrl.create({
      title: titl,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
  logout() {

    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    this.events.unsubscribe('user:created', null);
    let devicetoken = localStorage.getItem("deviceTokenForPushNotification");

    let
      typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headersunit: any = new Headers({ 'Content-Type': typeunit }),
      optionsunit: any = new RequestOptions({ headers: headersunit }),
      urlunit: any = this.apiServiceURL + "/moblogoutnew/" + this.userId + "/" + devicetoken;



    //this.showAlert('Logout Url', urlunit);
    this.http.get(urlunit, optionsunit)
      .subscribe((data) => {					// If the request was successful notify the user
        if (data.status === 200) {

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
          let roleData = localStorage.getItem("roleactionpermissiondata");
          let roleparseData = JSON.parse(roleData);
          for (let rle = 0; rle < roleparseData.length; rle++) {
            let splitvalue = roleparseData[rle].toString().split(",");
            let firstvaluesplit = splitvalue[0].split(":");
            let secondvaluesplit = splitvalue[1].split(":");
            let thirdvaluesplit = splitvalue[2].split(":");
            let fourthvaluesplit = splitvalue[3].split(":");
            let fivthvaluesplit = splitvalue[4].split(":");


            let firstvaluename = firstvaluesplit[0];
            //let firstvaluedata = firstvaluesplit[1];
            localStorage.setItem(firstvaluename.toUpperCase(), "");


            let secondvaluename = secondvaluesplit[0];
            //let secondvaluedata = secondvaluesplit[1];
            localStorage.setItem(secondvaluename.toUpperCase(), "");


            let thirdvaluename = thirdvaluesplit[0];
            // let thirdvaluedata = thirdvaluesplit[1];
            localStorage.setItem(thirdvaluename.toUpperCase(), "");


            let fourthvaluename = fourthvaluesplit[0];
            //let fourthvaluedata = fourthvaluesplit[1];
            localStorage.setItem(fourthvaluename.toUpperCase(), "");


            let fivthvaluename = fivthvaluesplit[0];
            //  let fivthvaluedata = fivthvaluesplit[1];
            localStorage.setItem(fivthvaluename.toUpperCase(), "");
          }
          this.navCtrl.setRoot(LoginPage);
        }

      }, error => {

      });


    //this.events.publish('user:created', user, Date.now());


  }
  @HostListener('keydown', ['$event'])
  keyEvent(event) {
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
    this.keyboard.close();
  }

  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
        } else {
        }

      });

    //to initialize push notifications


    const options: PushOptions = {
      android: {
        senderID: '7125886423',
        forceShow: false,
        vibrate: true,
        sound: 'true'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };




    const pushObject: PushObject = this.push.init(options);
    pushObject.on('registration').subscribe((registration: any) => {


      localStorage.setItem("deviceTokenForPushNotification", registration.registrationId);
    }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));


  }

  onNext() {

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

      this.firstname = user.firstname;
      this.lastname = user.lastname;

      this.companyGroupName = user.companygroup_name;
      this.profilePhoto = user.photo;
      if (this.profilePhoto == '' || this.profilePhoto == 'null') {
        this.profilePhoto = this.apiServiceURL + "/images/default.png";
      } else {
        this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
      }
    });


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

      this.firstname = user.firstname;
      this.lastname = user.lastname;
      this.companyGroupName = user.companygroup_name;
      this.profilePhoto = user.photo;
      if (this.profilePhoto == '' || this.profilePhoto == 'null') {
        this.profilePhoto = this.apiServiceURL + "/images/default.png";
      } else {
        this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
      }


    });

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

  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
      return false;
    }
  }
}
const TAB_KEY_CODE = 9;
const ENTER_KEY_CODE = 13;
import { Component, ViewChild, Output, EventEmitter, Input, HostListener, ElementRef, } from '@angular/core';
import { Platform, NavController, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from "../pages/login/login";
/* For Notification */
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import { LocalNotifications } from '@ionic-native/local-notifications';
import { TabsPage } from "../pages/tabs/tabs";
import { Config } from '../config/config';

import { AttentionPage } from "../pages/attention/attention";
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
@Component({
  templateUrl: 'app.html',
  providers: [Config, Keyboard, DataServiceProvider]//,Storage
})
export class MyApp {
  @Output() input: EventEmitter<string> = new EventEmitter<string>();
  @Input('br-data-dependency') nextIonInputId: any = null;
  rootPage: any = TabsPage;
  firstname;
  lastname;
  companyId;
  companyGroupName;
  userId;
  menuActive;
  profilePhoto = '../assets/imgs/user-pic.jpg';
  private apiServiceURL: string = "";
  menuSelection;
  @ViewChild('content') navCtrl: NavController;
  showLevel1 = null;
  showLevel2 = null;
  pages: Array<{ title: string, component: any, icon: string, color: any, background: any }>;

  constructor(private keyboard: Keyboard, public dataService: DataServiceProvider, platform: Platform, public elementRef: ElementRef, public http: Http, private conf: Config, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl: MenuController, public events: Events) {
    this.apiServiceURL = conf.apiBaseURL();
    this.menuActive = 'menuactive-dashboard';

    this.dataService.getMenus()
      .subscribe((response) => {

        this.pages = response;
      });

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
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('android')) {
        console.log("Devices Running...");
        //this.initPushNotification();
      }
      statusBar.styleDefault();
      splashScreen.hide();
      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");
      console.log("User Id:" + this.userId);
      if (this.userId != undefined) {
        this.firstname = localStorage.getItem("userInfoName");
        this.lastname = localStorage.getItem("userInfoLastName");
        this.companyGroupName = localStorage.getItem("userInfoCompanyGroupName");
        this.profilePhoto = localStorage.getItem("userInfoPhoto");
        this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
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
          this.profilePhoto = this.apiServiceURL + "/staffphotos/" + user.photo;
        });
      }

      statusBar.styleDefault();
      setTimeout(() => {
        splashScreen.hide();
      }, 100);


      this.getGuageData();
      keyboard.disableScroll(true);
      keyboard.hideKeyboardAccessoryBar(true);
    });
    this.events.publish('menu:created', 'dashboard', Date.now());
    this.pages = [
      { title: 'Dashboard', component: '', icon: 'dashboard', color: 'gray', background: 'gray' },
      { title: 'Company Group', component: CompanygroupPage, icon: 'dashboard', color: 'gray', background: 'gray' },
      { title: 'Users', component: UserPage, icon: 'dashboard', color: 'gray', background: 'gray' },
      { title: 'Units', component: '', icon: 'units', color: 'gray', background: 'gray' },
      { title: 'Unit Group', component: UnitgroupPage, icon: 'dashboard', color: 'gray', background: 'gray' },
      { title: 'Engine Details', component: EnginedetailPage , icon: 'dashboard', color: 'gray', background: 'gray'},
      { title: 'Role', component: RolePage, icon: 'units', color: 'gray', background: 'gray' },
      { title: 'My Account', component: MyaccountPage, icon: 'units', color: 'gray', background: 'gray' },
      { title: 'Report Template', component: ReporttemplatePage, icon: 'units', color: 'gray', background: 'gray' },
      { title: 'Org Chart', component: OrgchartPage, icon: 'units', color: 'gray', background: 'gray' },
      { title: 'Calendar', component: CalendarPage, icon: 'calendar', color: 'gray', background: 'gray' },
      { title: 'Message', component: '', icon: 'messages', color: 'gray', background: 'gray' },
      { title: 'Reports', component: '', icon: 'reports', color: 'gray', background: 'gray' },
      { title: 'Settings', component: '', icon: 'settings', color: 'gray', background: 'gray' },
      { title: 'Logout', component: '', icon: 'logout', color: 'gray', background: 'gray' }
    ];
    events.subscribe('user:created', (user, time) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', user, 'at', time);
      //this.firstname=user[0].firstname;
      //this.lastname=user[0].firstname;
    });
  }

  getGuageData() {
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/gaugedetails";
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Gauge Data calling....");
          console.log(JSON.stringify(data.json()));
          if (data.json().setpoints[0].code == 'VOLT1') {
            let voltagelabelsplitcomma = data.json().setpoints[0].labels.split(",");
            let voltagecolorsplitcomma = data.json().setpoints[0].colors.split(",");
            let outvoltagelabel = '';
            let outvoltagecolor = '';
            for (let lbl = 0; lbl < voltagelabelsplitcomma.length; lbl++) {
              let voltagelabelsplitcolon = voltagelabelsplitcomma[lbl].split(':');
              let label = voltagelabelsplitcolon[0];
              let labelvlu = voltagelabelsplitcolon[1];
              outvoltagelabel += label + ":'" + labelvlu + "'" + ",";
              //localStorage.setItem("voltagelabel_" + lbl, labelvlu);
            }
            for (let clr = 0; clr < voltagecolorsplitcomma.length; clr++) {
              let voltagecolorsplitcolon = voltagecolorsplitcomma[clr].split(':');
              let color = voltagecolorsplitcolon[0];
              let colorvlu = voltagecolorsplitcolon[1];
              outvoltagecolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("voltagecolor_" + clr, colorvlu);
            }
          }

          if (data.json().setpoints[1].code == 'CURRENT1') {
            let currentlabelsplitcomma = data.json().setpoints[1].labels.split(",");
            let currentcolorsplitcomma = data.json().setpoints[1].colors.split(",");
            let outcurrentlabel = '';
            let outcurrentcolor = '';
            for (let lbl = 0; lbl < currentlabelsplitcomma.length; lbl++) {
              let currentlabelsplitcolon = currentlabelsplitcomma[lbl].split(':');
              let label = currentlabelsplitcolon[0];
              let labelvlu = currentlabelsplitcolon[1];
              outcurrentlabel += label + ":'" + labelvlu + "'" + ",";
              // localStorage.setItem("currentlabel_" + lbl, labelvlu);
            }
            for (let clr = 0; clr < currentcolorsplitcomma.length; clr++) {
              let currentcolorsplitcolon = currentcolorsplitcomma[clr].split(':');
              let color = currentcolorsplitcolon[0];
              let colorvlu = currentcolorsplitcolon[1];
              outcurrentcolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("currentcolor_" + clr, colorvlu);
            }
          }


          if (data.json().setpoints[2].code == 'FREQ') {
            let freqlabelsplitcomma = data.json().setpoints[2].labels.split(",");
            let freqcolorsplitcomma = data.json().setpoints[2].colors.split(",");
            let outfreqlabel = '';
            let outfreqcolor = '';
            for (let lbl = 0; lbl < freqlabelsplitcomma.length; lbl++) {
              let freqlabelsplitcolon = freqlabelsplitcomma[lbl].split(':');
              let label = freqlabelsplitcolon[0];
              let labelvlu = freqlabelsplitcolon[1];
              outfreqlabel += label + ":'" + labelvlu + "'" + ",";
              //localStorage.setItem("freqlabel_" + lbl, labelvlu);
            }
            for (let clr = 0; clr < freqcolorsplitcomma.length; clr++) {
              let freqcolorsplitcolon = freqcolorsplitcomma[clr].split(':');
              let color = freqcolorsplitcolon[0];
              let colorvlu = freqcolorsplitcolon[1];
              outfreqcolor += color + ":'" + colorvlu + "'" + ",";
              // localStorage.setItem("freqcolor_" + clr, colorvlu);
            }
          }

          if (data.json().setpoints[3].code == 'ENGINESPEED') {
            let enginespeedlabelsplitcomma = data.json().setpoints[3].labels.split(",");
            let enginespeedcolorsplitcomma = data.json().setpoints[3].colors.split(",");
            let outenginespeedlabel = '';
            let outenginespeedcolor = '';
            for (let lbl = 0; lbl < enginespeedlabelsplitcomma.length; lbl++) {
              let enginespeedlabelsplitcolon = enginespeedlabelsplitcomma[lbl].split(':');
              let label = enginespeedlabelsplitcolon[0];
              let labelvlu = enginespeedlabelsplitcolon[1];
              outenginespeedlabel += label + ":'" + labelvlu + "'" + ",";
              // localStorage.setItem("enginespeedlabel_" + lbl, labelvlu);
            }
            for (let clr = 0; clr < enginespeedcolorsplitcomma.length; clr++) {
              let enginespeedcolorsplitcolon = enginespeedcolorsplitcomma[clr].split(':');
              let color = enginespeedcolorsplitcolon[0];
              let colorvlu = enginespeedcolorsplitcolon[1];
              outenginespeedcolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("enginespeedcolor_" + clr, colorvlu);
            }
          }

          if (data.json().setpoints[4].code == 'FUELLEVEL') {
            let fuellevellabelsplitcomma = data.json().setpoints[4].labels.split(",");
            let fuellevelcolorsplitcomma = data.json().setpoints[4].colors.split(",");
            let outfuellevellabel = '';
            let outfuellevelcolor = '';
            for (let lbl = 0; lbl < fuellevellabelsplitcomma.length; lbl++) {
              let fuellevellabelsplitcolon = fuellevellabelsplitcomma[lbl].split(':');
              let label = fuellevellabelsplitcolon[0];
              let labelvlu = fuellevellabelsplitcolon[1];
              outfuellevellabel += label + ":'" + labelvlu + "'" + ",";
              //localStorage.setItem("fuellevellabel_" + lbl, labelvlu);
            }
            for (let clr = 0; clr < fuellevelcolorsplitcomma.length; clr++) {
              let fuellevelcolorsplitcolon = fuellevelcolorsplitcomma[clr].split(':');
              let color = fuellevelcolorsplitcolon[0];
              let colorvlu = fuellevelcolorsplitcolon[1];
              outfuellevelcolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("fuellevelcolor_" + clr, colorvlu);
            }
          }

          if (data.json().setpoints[5].code == 'LOADPOWER') {
            let loadfactorlabelsplitcomma = data.json().setpoints[5].labels.split(",");
            let loadfactorcolorsplitcomma = data.json().setpoints[5].colors.split(",");
            let outloadfactorlabel = '';
            let outloadfactorcolor = '';
            for (let lbl = 0; lbl < loadfactorlabelsplitcomma.length; lbl++) {
              let loadfactorlabelsplitcolon = loadfactorlabelsplitcomma[lbl].split(':');
              let label = loadfactorlabelsplitcolon[0];
              let labelvlu = loadfactorlabelsplitcolon[1];
              outloadfactorlabel += label + ":'" + labelvlu + "'" + ",";
              //localStorage.setItem("loadfactorlabel_" + lbl, labelvlu);
            }
            for (let clr = 0; clr < loadfactorcolorsplitcomma.length; clr++) {
              let loadfactorcolorsplitcolon = loadfactorcolorsplitcomma[clr].split(':');
              let color = loadfactorcolorsplitcolon[0];
              let colorvlu = loadfactorcolorsplitcolon[1];
              outloadfactorcolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("loadfactorcolor_" + clr, colorvlu);
            }
          }


          if (data.json().setpoints[6].code == 'COLLANTTEMP') {
            console.log("Coolant Temp color:" + data.json().setpoints[6].code);
            console.log("Label:" + data.json().setpoints[6].labels);
            let coolanttemplabelsplitcomma = data.json().setpoints[6].labels.split(",");
            let coolanttempcolorsplitcomma = data.json().setpoints[6].colors.split(",");
            let outcoolanttemplabel = '';
            let outcoolanttempcolor = '';
            for (let lbl = 0; lbl < coolanttemplabelsplitcomma.length; lbl++) {
              let label = coolanttemplabelsplitcomma[lbl];
              outcoolanttemplabel += label + ",";
              //localStorage.setItem("coolanttemplabel_" + lbl, label);
            }
            for (let clr = 0; clr < coolanttempcolorsplitcomma.length; clr++) {
              let coolanttempcolorsplitcolon = coolanttempcolorsplitcomma[clr].split(':');
              let color = coolanttempcolorsplitcolon[0];
              let colorvlu = coolanttempcolorsplitcolon[1];
              outcoolanttempcolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("coolanttempcolor_" + clr, colorvlu);
            }
          }


          if (data.json().setpoints[7].code == 'OILPRESSURE') {
            let oilpressurelabelsplitcomma = data.json().setpoints[7].labels.split(",");
            let oilpressurecolorsplitcomma = data.json().setpoints[7].colors.split(",");
            let outoilpressurelabel = '';
            let outoilpressurecolor = '';
            for (let lbl = 0; lbl < oilpressurelabelsplitcomma.length; lbl++) {
              let label = oilpressurelabelsplitcomma[lbl];
              outoilpressurelabel += label + ",";
              //localStorage.setItem("oilpressurelabel_" + lbl, label);
            }
            for (let clr = 0; clr < oilpressurecolorsplitcomma.length; clr++) {
              let oilpressurecolorsplitcolon = oilpressurecolorsplitcomma[clr].split(':');
              let color = oilpressurecolorsplitcolon[0];
              let colorvlu = oilpressurecolorsplitcolon[1];
              outoilpressurecolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("oilpressurecolor_" + clr, colorvlu);
            }
          }


          if (data.json().setpoints[8].code == 'LOADPOWERFACTOR') {
            let loadpowerfactorlabelsplitcomma = data.json().setpoints[8].labels.split(",");
            let loadpowerfactorcolorsplitcomma = data.json().setpoints[8].colors.split(",");
            let outloadpowerfactorlabel = '';
            let outloadpowerfactorcolor = '';
            for (let lbl = 0; lbl < loadpowerfactorlabelsplitcomma.length; lbl++) {
              let label = loadpowerfactorlabelsplitcomma[lbl];
              outloadpowerfactorlabel += label + ",";
              // localStorage.setItem("loadpowerfactorlabel_" + lbl, label);
            }
            for (let clr = 0; clr < loadpowerfactorcolorsplitcomma.length; clr++) {
              let loadpowerfactorcolorsplitcolon = loadpowerfactorcolorsplitcomma[clr].split(':');
              let color = loadpowerfactorcolorsplitcolon[0];
              let colorvlu = loadpowerfactorcolorsplitcolon[1];
              outloadpowerfactorcolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("loadpowerfactorcolor_" + clr, colorvlu);
            }
          }



          if (data.json().setpoints[9].code == 'BATTERYVOLTAGE') {
            let batteryvoltagelabelsplitcomma = data.json().setpoints[9].labels.split(",");
            let batteryvoltagecolorsplitcomma = data.json().setpoints[9].colors.split(",");
            let outbatteryvoltagelabel = '';
            let outbatteryvoltagecolor = '';
            for (let lbl = 0; lbl < batteryvoltagelabelsplitcomma.length; lbl++) {
              let label = batteryvoltagelabelsplitcomma[lbl];
              outbatteryvoltagelabel += label + ",";
              //localStorage.setItem("batteryvoltagelabel_" + lbl, label);
            }
            for (let clr = 0; clr < batteryvoltagecolorsplitcomma.length; clr++) {
              let batteryvoltagecolorsplitcolon = batteryvoltagecolorsplitcomma[clr].split(':');
              let color = batteryvoltagecolorsplitcolon[0];
              let colorvlu = batteryvoltagecolorsplitcolon[1];
              outbatteryvoltagecolor += color + ":'" + colorvlu + "'" + ",";
              //localStorage.setItem("batteryvoltagecolor_" + clr, colorvlu);
            }
          }



        }
        // Otherwise let 'em know anyway
        else {
          console.log("Something went wrong!");
        }
      }, error => {

      });

  }
  openPage(page) {
    /*
    // page.color = 'danger';

    for (let p of this.pages) {
      console.log(p.title);
      console.log(page.title);
      if (p.title == page.title && p.title != 'Logout' && page.title != 'Logout') {
        console.log("A");
        p.color = 'light';//danger
      } else {
        console.log("B");
        p.color = 'light';
      }
    }
    if (page.title == 'Logout') {
      this.menuActive = 'menuactive-logout';
      this.events.publish('menu:created', 'logout', Date.now());
      this.logout();// Service api moblogout/1

    }
    else if (page.title == 'Message') {
      this.menuActive = 'menuactive-messages';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'messages', Date.now());
      this.navCtrlCtrl.setRoot(TabsPage, { tabIndex: 3 });
    }
    else if (page.title == 'Calendar') {
      this.menuActive = 'menuactive-calendar';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'calendar', Date.now());
      this.navCtrlCtrl.setRoot(TabsPage, { tabIndex: 2 });
    } else if (page.title == 'Dashboard') {
      this.menuActive = 'menuactive-dashboard';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'dashboard', Date.now());
      this.navCtrlCtrl.setRoot(TabsPage, { tabIndex: 0 });
    } else if (page.title == 'Units') {
      this.menuActive = 'menuactive-units';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'units', Date.now());
      this.navCtrlCtrl.setRoot(TabsPage, { tabIndex: 1 });
    } else if (page.title == 'Settings') {
      this.menuActive = 'menuactive-settings';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'settings', Date.now());
      this.navCtrlCtrl.setRoot(MyaccountPage);
      //this.navCtrlCtrl.setRoot(AttentionPage);
    } else if (page.title == 'Reports') {
      this.menuActive = 'menuactive-reports';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'reports', Date.now());
      this.navCtrlCtrl.setRoot(AttentionPage);
    } else if (page.component == 'UnitgroupPage') {
      this.navCtrlCtrl.setRoot(UnitgroupPage);
    }
    this.events.subscribe('menu:created', (menu, time) => {
      this.menuSelection = menu;
    });
    */



    if (page.component == 'UnitsPage') {
      this.menuActive = 'menuactive-units';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'units', Date.now());
      this.navCtrl.setRoot(TabsPage, { tabIndex: 1 });
    } else if (page.component == 'UnitgroupPage') {
      this.navCtrl.setRoot(UnitgroupPage);
    } else if (page.component == 'MyaccountPage') {
      this.navCtrl.setRoot(MyaccountPage);
    } else if (page.component == 'UserPage') {
      this.navCtrl.setRoot(UserPage);
    } else if (page.component == 'CompanygroupPage') {
      this.navCtrl.setRoot(CompanygroupPage);
    } else if (page.component == 'RolePage') {
      this.navCtrl.setRoot(RolePage);
    } else if (page.component == 'ReporttemplatePage') {
      this.navCtrl.setRoot(ReporttemplatePage);
    } else if (page.component == 'OrgchartPage') {
      this.navCtrl.setRoot(OrgchartPage);
    } else if (page.title == 'Message') {
      this.menuActive = 'menuactive-messages';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'messages', Date.now());
      this.navCtrl.setRoot(TabsPage, { tabIndex: 3 });
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
      this.navCtrl.setRoot(TabsPage, { tabIndex: 0 });

    }else if (page.title == 'Reports') {
      this.menuActive = 'menuactive-reports';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'reports', Date.now());
      this.navCtrl.setRoot(AttentionPage);
    } else if (page.title == 'Calendar') {
      this.menuActive = 'menuactive-calendar';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'calendar', Date.now());
      this.navCtrl.setRoot(TabsPage, { tabIndex: 2 });
    } else if (page.title == 'Reports') {
      this.menuCtrl.close();
      this.navCtrl.setRoot(ReportsPage);
    }
    else if (page.title == 'Alarm') {
      this.menuCtrl.close();
      //this.navCtrl.setRoot(AlarmPage);
    }
    else if (page.component == 'MapdemoPage') {
      //this.navCtrl.setRoot(MapdemoPage);
    }else if (page.component == 'EnginedetailPage') {
      this.navCtrl.setRoot(EnginedetailPage);
    } else if (page.title == 'Settings') {
      this.menuActive = 'menuactive-settings';
      this.menuCtrl.close();
      this.events.publish('menu:created', 'settings', Date.now());
      this.navCtrl.setRoot(MyaccountPage);
      //this.navCtrlCtrl.setRoot(AttentionPage);
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
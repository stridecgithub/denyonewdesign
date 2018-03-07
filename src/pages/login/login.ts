import { Component } from '@angular/core';
import { Platform, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { DashboardPage } from "../dashboard/dashboard";
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { Keyboard } from '@ionic-native/keyboard';
declare var jQuery: any;
/*declare var triggeredAutocomplete: any;*/
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Config]
})
export class LoginPage {
  private apiServiceURL: string = '';
  userId;
  public atmentioneddata = [];
  public companyId: any;
  constructor(private keyboard: Keyboard, platform: Platform, private nativeStorage: NativeStorage, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, private conf: Config, private http: Http, public events: Events) {
    this.apiServiceURL = conf.apiBaseURL();
    this.menuCtrl.swipeEnable(false);
    //  platform.ready().then(() => {
    //    this.keyboard.disableScroll(true);
    //  });
  }

  ionViewDidEnter() {
    //to disable menu, or
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // to enable menu.
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {


    // Atmentioned API Calls
    /* let
       //body: string = "key=delete&recordID=" + recordID,
       type: string = "application/x-www-form-urlencoded; charset=UTF-8",
       headers: any = new Headers({ 'Content-Type': type }),
       options: any = new RequestOptions({ headers: headers }),
       url: any = this.apiServiceURL + "/api/atmentionednew.php?method=atmention&act=message&companyId=1&userId=1";
     console.log(url);
     this.http.get(url, options)
       .subscribe(data => {
         // If the request was successful notify the user
         if (data.status === 200) {
           this.atmentioneddata = data.json();
           console.log(this.atmentioneddata);
           jQuery('#inputbox').triggeredAutocomplete({
             hidden: '#hidden_inputbox',
             source: this.atmentioneddata
           });
         }
         // Otherwise let 'em know anyway
         else {
           this.conf.sendNotification('Something went wrong!');
         }
       }, error => {
 
       })
       */
    // Atmentioned API Calls





    console.log('ionViewDidLoad LoginPage');

    this.userId = localStorage.getItem("userInfoId");
    console.log("login.ts userid:" + this.userId);
    if (this.userId == 'undefined') {
      this.userId = '';
      console.log("login.ts  A");
    }
    if (this.userId == 'null') {
      this.userId = '';
      console.log("login.ts B");
    }
    if (this.userId == null) {
      this.userId = '';
      console.log("login.ts C");
    }
    if (this.userId == undefined) {
      this.userId = '';
      console.log("login.ts D");
    }
    console.log("Finally" + this.userId);
    if (this.userId > 0) {
      console.log("login.ts E");
      console.log("login.ts  User id logged out action from dashboard.ts");
      this.events.publish('menu:created', 'dashboard', Date.now());
      this.navCtrl.setRoot(DashboardPage, { selectedindex: 0 });
    }

  }

  // Goto dashboard
  gotoDashboard(username, password) {
    let device_token = localStorage.getItem("deviceTokenForPushNotification");
    let res;
    console.log("dev token:" + device_token)
    if (device_token == 'null') {
      console.log("A" + device_token)
      device_token = '';
    }
    if (device_token == null) {
      console.log("B" + device_token)
      device_token = '';
    }
    let body: string = "username=" + username +
      "&password=" + password +
      "&device_token=" + device_token +
      "&isapp=1",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/checklogin";
    console.log(url + '?' + body);
    this.http.post(url, body, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        if (res.msg[0]['Error'] > 0) {
          this.conf.sendNotification(res.msg[0]['result']);
          return false;
        } else {
          res = data.json();
          localStorage.setItem("userInfo", res['staffdetails'][0]);
          localStorage.setItem("userInfoId", res['staffdetails'][0].staff_id);
          localStorage.setItem("userInfoName", res['staffdetails'][0].firstname);
          localStorage.setItem("userInfoLastName", res['staffdetails'][0].lastname);
          localStorage.setItem("userInfoEmail", res['staffdetails'][0].email);
          localStorage.setItem("userInfoCompanyId", res['staffdetails'][0].company_id);
          localStorage.setItem("userInfoCompanyGroupName", res['staffdetails'][0].companygroup_name);
          localStorage.setItem("userInfoPhoto", res['staffdetails'][0].photo);
          localStorage.setItem("userInfoRoleId", res['staffdetails'][0].role_id);
          localStorage.setItem("personalhashtag", res['staffdetails'][0].personalhashtag);
          localStorage.setItem("leftmenu", JSON.stringify(res['leftmenu']));
          localStorage.setItem("footermenu", res['footermenu']);
          console.log(JSON.stringify(res['roledata']));
          localStorage.setItem("RolePermissionData", JSON.stringify(res['roledata']));
          localStorage.setItem("roleactionpermissiondata", JSON.stringify(res['roleactionpermissiondata']));

          let roleData = localStorage.getItem("RolePermissionData");
          let roleparseData = JSON.parse(roleData);

          console.log("Loop Length is:" + res['roleactionpermissiondata'].length);
          for (let rle = 0; rle < res['roleactionpermissiondata'].length; rle++) {
            let splitvalue = res['roleactionpermissiondata'][rle].toString().split(",");
            console.log(splitvalue[0] + "-" + splitvalue[1] + "-" + splitvalue[2] + "-" + splitvalue[3] + "-" + splitvalue[4]);
            let firstvaluesplit = splitvalue[0].split(":");
            let secondvaluesplit = splitvalue[1].split(":");
            let thirdvaluesplit = splitvalue[2].split(":");
            let fourthvaluesplit = splitvalue[3].split(":");
            let fivthvaluesplit = splitvalue[4].split(":");


            let firstvaluename = firstvaluesplit[0];
            let firstvaluedata = firstvaluesplit[1];
            console.log("Name 1:" + firstvaluename.toUpperCase() + " " + "Value 1:" + firstvaluedata);
            localStorage.setItem(firstvaluename.toUpperCase(), firstvaluedata);


            let secondvaluename = secondvaluesplit[0];
            let secondvaluedata = secondvaluesplit[1];
            console.log("Name: 2" + secondvaluename.toUpperCase() + " " + "Value 2:" + secondvaluedata);
            localStorage.setItem(secondvaluename.toUpperCase(), secondvaluedata);


            let thirdvaluename = thirdvaluesplit[0];
            let thirdvaluedata = thirdvaluesplit[1];
            console.log("Name: 3" + thirdvaluename.toUpperCase() + " " + "Value 3:" + thirdvaluedata);
            localStorage.setItem(thirdvaluename.toUpperCase(), thirdvaluedata);


            let fourthvaluename = fourthvaluesplit[0];
            let fourthvaluedata = fourthvaluesplit[1];
            console.log("Name: 4" + fourthvaluename.toUpperCase() + " " + "Value 4:" + fourthvaluedata);
            localStorage.setItem(fourthvaluename.toUpperCase(), fourthvaluedata);


            let fivthvaluename = fivthvaluesplit[0];
            let fivthvaluedata = fivthvaluesplit[1];
            console.log("Name: 5" + fivthvaluename.toUpperCase() + " " + "Value 5:" + fivthvaluedata);
            localStorage.setItem(fivthvaluename.toUpperCase(), fivthvaluedata);
          }
          /*
          for (let rle = 0; rle < roleparseData.length; rle++) {                    // 8 - Child Module Map
            if (res['staffdetails'][0].staff_id == '1') {
              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '8' && roleparseData[rle]['module_name'] == '1') {
                localStorage.setItem("DASHBOARD_MAP_VIEW", '1');

              }

              // 12 - Child Module Unit
              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '12' && roleparseData[rle]['module_name'] == '1') {
                localStorage.setItem("DASHBOARD_UNITS_VIEW", '1');
                localStorage.setItem("DASHBOARD_UNITS_EDIT", '1');
                localStorage.setItem("DASHBOARD_UNITS_HIDE", '1');
              }

              // 1 - Child Module My Account
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '1' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_MYACCOUNT_VIEW", '1');
                localStorage.setItem("SETTINGS_MYACCOUNT_CREATE", '1');
                localStorage.setItem("SETTINGS_MYACCOUNT_EDIT", '1');
                localStorage.setItem("SETTINGS_MYACCOUNT_DELETE", '1');
              }


              // 2 - Child Module User List
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '2' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERLIST_VIEW", '1');
                localStorage.setItem("SETTINGS_USERLIST_CREATE", '1');
                localStorage.setItem("SETTINGS_USERLIST_EDIT", '1');
                localStorage.setItem("SETTINGS_USERLIST_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '3' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_COMPANYGROUP_VIEW", '1');
                localStorage.setItem("SETTINGS_COMPANYGROUP_CREATE", '1');
                localStorage.setItem("SETTINGS_COMPANYGROUP_EDIT", '1');
                localStorage.setItem("SETTINGS_COMPANYGROUP_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '4' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERROLE_VIEW", '1');
                localStorage.setItem("SETTINGS_USERROLE_CREATE", '1');
                localStorage.setItem("SETTINGS_USERROLE_EDIT", '1');
                localStorage.setItem("SETTINGS_USERROLE_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '5' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_VIEW", '1');
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_CREATE", '1');
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_EDIT", '1');
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '6' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_ORGCHART_VIEW", '1');
                localStorage.setItem("SETTINGS_ORGCHART_CREATE", '1');
                localStorage.setItem("SETTINGS_ORGCHART_EDIT", '1');
                localStorage.setItem("SETTINGS_ORGCHART_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '7' && roleparseData[rle]['module_name'] == '2') {
                localStorage.setItem("CALENDAR_EVENTS_VIEW", '1');
                localStorage.setItem("CALENDAR_EVENTS_CREATE", '1');
                localStorage.setItem("CALENDAR_EVENTS_EDIT", '1');
                localStorage.setItem("CALENDAR_EVENTS_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '9' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_LISTING_VIEW", '1');
                localStorage.setItem("UNITS_LISTING_CREATE", '1');
                localStorage.setItem("UNITS_LISTING_EDIT", '1');
                localStorage.setItem("UNITS_LISTING_DELETE", '1');  // Implementation Done by Kannan.N
              }
              if (roleparseData[rle]['page_name'] == '13' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_ALARM_VIEW", '1');
                localStorage.setItem("UNITS_ALARM_CREATE", '1');
                localStorage.setItem("UNITS_ALARM_EDIT", '1');
                localStorage.setItem("UNITS_ALARM_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '14' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_SERVICINGINFO_VIEW", '1');
                localStorage.setItem("UNITS_SERVICINGINFO_CREATE", '1');
                localStorage.setItem("UNITS_SERVICINGINFO_EDIT", '1');
                localStorage.setItem("UNITS_SERVICINGINFO_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '15' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_COMMENTS_VIEW", '1');
                localStorage.setItem("UNITS_COMMENTS_CREATE", '1');
                localStorage.setItem("UNITS_COMMENTS_EDIT", '1');
                localStorage.setItem("UNITS_COMMENTS_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '16' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_UNITGROUP_VIEW", '1');
                localStorage.setItem("UNITS_UNITGROUP_CREATE", '1');
                localStorage.setItem("UNITS_UNITGROUP_EDIT", '1');
                localStorage.setItem("UNITS_UNITGROUP_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '10' && roleparseData[rle]['module_name'] == '4') {
                localStorage.setItem("REPORTS_VIEW", '1');
                localStorage.setItem("REPORTS_CREATE", '1');
              }
              if (roleparseData[rle]['page_name'] == '11' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_INBOX_VIEW", '1');
                localStorage.setItem("MESSAGE_INBOX_CREATE", '1');
                localStorage.setItem("MESSAGE_INBOX_EDIT", '1');
                localStorage.setItem("MESSAGE_INBOX_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '17' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_SENT_VIEW", '1');
                localStorage.setItem("MESSAGE_SENT_CREATE", '1');
                localStorage.setItem("MESSAGE_SENT_EDIT", '1');
                localStorage.setItem("MESSAGE_SENT_DELETE", '1');

              }
            } else {


              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '8' && roleparseData[rle]['module_name'] == '1') {
                console.log('Kannan for roles');
                localStorage.setItem("DASHBOARD_MAP_VIEW", roleparseData[rle]['view_action']);
              }

              // 12 - Child Module Unit
              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '12' && roleparseData[rle]['module_name'] == '1') {
                localStorage.setItem("DASHBOARD_UNITS_VIEW", roleparseData[rle]['view_action']);
                 localStorage.setItem("DASHBOARD_UNITS_EDIT", roleparseData[rle]['edit_action']);
                 localStorage.setItem("DASHBOARD_UNITS_HIDE", roleparseData[rle]['hide_action']);
              }

              // 1 - Child Module My Account
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '1' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_MYACCOUNT_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_MYACCOUNT_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_MYACCOUNT_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_MYACCOUNT_DELETE", roleparseData[rle]['delete_action']);
              }


              // 2 - Child Module User List
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '2' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERLIST_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_USERLIST_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_USERLIST_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_USERLIST_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '3' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_COMPANYGROUP_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_COMPANYGROUP_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_COMPANYGROUP_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_COMPANYGROUP_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '4' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERROLE_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_USERROLE_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_USERROLE_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_USERROLE_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '5' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '6' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_ORGCHART_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_ORGCHART_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_ORGCHART_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_ORGCHART_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '7' && roleparseData[rle]['module_name'] == '2') {
                localStorage.setItem("CALENDAR_EVENTS_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("CALENDAR_EVENTS_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("CALENDAR_EVENTS_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("CALENDAR_EVENTS_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '9' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_LISTING_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_LISTING_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_LISTING_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_LISTING_DELETE", roleparseData[rle]['delete_action']);  // Implementation Done by Kannan.N
              }
              if (roleparseData[rle]['page_name'] == '13' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_ALARM_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_ALARM_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_ALARM_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_ALARM_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '14' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_SERVICINGINFO_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_SERVICINGINFO_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_SERVICINGINFO_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_SERVICINGINFO_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '15' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_COMMENTS_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_COMMENTS_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_COMMENTS_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_COMMENTS_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '16' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_UNITGROUP_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_UNITGROUP_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_UNITGROUP_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_UNITGROUP_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '10' && roleparseData[rle]['module_name'] == '4') {
                localStorage.setItem("REPORTS_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("REPORTS_CREATE", roleparseData[rle]['create_action']);
              }
              if (roleparseData[rle]['page_name'] == '11' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_INBOX_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("MESSAGE_INBOX_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("MESSAGE_INBOX_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("MESSAGE_INBOX_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '17' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_SENT_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("MESSAGE_SENT_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("MESSAGE_SENT_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("MESSAGE_SENT_DELETE", roleparseData[rle]['delete_action']);

              }
            }
          }*/
          this.createUser(res['staffdetails'][0]);
          this.nativeStorage.setItem('menuItem', { profilePhoto: res['staffdetails'][0].photo, firstname: res['staffdetails'][0].firstname, lastname: res['staffdetails'][0].lastname, companyGroupName: res['staffdetails'][0].companygroup_name })
            .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
            );
          this.events.publish('menu:created', 'dashboard', Date.now());
          this.navCtrl.setRoot(DashboardPage, {
            companyId: res['staffdetails'][0].company_id,
            userId: res['staffdetails'][0].staff_id,
            footermenu: res['footermenu'],
          });
        }

      },
      error => {
        console.log("\n" + error);
      });
  }
  createUser(user) {
    console.log('User created!' + console.log(user))
    this.events.publish('user:created', user, Date.now());
  }

  doMove() {
    this.navCtrl.push(ForgotpasswordPage);
  }


}

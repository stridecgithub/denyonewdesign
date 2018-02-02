import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
//import { DashboardPage } from "../dashboard/dashboard";
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { TabsPage } from "../tabs/tabs";
import { NativeStorage } from '@ionic-native/native-storage';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { TimerProgress } from '../timerprogress/timerprogress';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Config]
})
export class LoginPage {
  private apiServiceURL: string = '';
  userId;
  constructor(private nativeStorage: NativeStorage, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, private conf: Config, private http: Http, public events: Events) {
    this.apiServiceURL = conf.apiBaseURL();
    this.menuCtrl.swipeEnable(false);
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
      this.navCtrl.setRoot(TabsPage, { selectedindex: 0 });
    }

  }

  // Goto dashboard
  gotoDashboard(username, password) {
    let device_token = localStorage.getItem("deviceTokenForPushNotification");
    let res;
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

          console.log("Company Id:" + res['staffdetails'][0].company_id);
          console.log("User Id:" + res['staffdetails'][0].staff_id);
          this.createUser(res['staffdetails'][0]);


          this.nativeStorage.setItem('menuItem', { profilePhoto: res['staffdetails'][0].photo, firstname: res['staffdetails'][0].firstname, lastname: res['staffdetails'][0].lastname,companyGroupName:res['staffdetails'][0].companygroup_name })
            .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
            );

          this.navCtrl.setRoot(TabsPage, {
            companyId: res['staffdetails'][0].company_id,
            userId: res['staffdetails'][0].staff_id,
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
  doProgress() {
    this.navCtrl.push(TimerProgress);
  }
  
}

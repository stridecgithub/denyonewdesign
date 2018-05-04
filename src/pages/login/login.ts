import { Component } from '@angular/core';
import { Platform, NavController, NavParams, Events, MenuController, AlertController } from 'ionic-angular';
import { DashboardPage } from "../dashboard/dashboard";
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
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
  public form: FormGroup;
  public isSubmitted: boolean = false;
  alert: any;
  utc;
  timezone;
  dateconvert;
  utctimestring;
  constructor(public platform: Platform, public alertCtrl: AlertController, private nativeStorage: NativeStorage, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, private conf: Config, private http: Http, public events: Events,
    public fb: FormBuilder) {
    console.log("Moment UTC:-" + moment.utc());
    this.utc = moment.utc();
    this.utctimestring = new Date(this.utc);
    console.log("Local Time:" + this.utctimestring);
    this.timezone = new Date().getTimezoneOffset();
    console.log("Time Zone:" + this.timezone);
    this.apiServiceURL = this.conf.apiBaseURL();
    this.menuCtrl.swipeEnable(false);
    console.log(moment().utcOffset(this.timezone).format());
    console.log(moment().utcOffset("+05:30").format());
    this.dateconvert = moment().utcOffset(this.timezone).format();
    this.form = fb.group({
      "username": ["", Validators.required],
      "password": ['', Validators.required]

    });
    this.platform.ready().then(() => {

      this.platform.registerBackButtonAction(() => {
        if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        } else {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlertExist();
          }
        }
      });

    });
  }


  showAlertExist() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }
  ionViewDidEnter() {
    //to disable menu, or
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // to enable menu.
    this.menuCtrl.enable(true);
  }
  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
      return false;
    }
  }

  ionViewDidLoad() {
    this.userId = localStorage.getItem("userInfoId");
    if (this.userId == 'undefined') {
      this.userId = '';
    }
    if (this.userId == 'null') {
      this.userId = '';
    }
    if (this.userId == null) {
      this.userId = '';
    }
    if (this.userId == undefined) {
      this.userId = '';
    }
    if (this.userId > 0) {
      this.events.publish('menu:created', 'dashboard', Date.now());
      this.navCtrl.setRoot(DashboardPage, { selectedindex: 0 });
    }

  }

  // Goto dashboard
  saveEntry() {
    let username: string = this.form.controls["username"].value,
      password: string = this.form.controls["password"].value;
    this.isSubmitted = true;
    let device_token = localStorage.getItem("deviceTokenForPushNotification");
    let res;
    if (device_token == 'null') {
      device_token = '';
    }
    if (device_token == null) {
      device_token = '';
    }
    let body: string = "username=" + username +
      "&password=" + password +
      "&device_token=" + device_token +
      "&utc=" + this.utc +
      "&utcdate=" + JSON.stringify(this.utc) +
      "&utcdatestring=" + this.timezone +
      "&isapp=1",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/checklogin";
    console.log(url + "?" + body);
    this.http.post(url, body, options)
      .subscribe(data => {
        res = data.json();

        if (res.msg[0]['Error'] > 0) {
          this.isSubmitted = false;
          this.conf.sendNotification(res.msg[0]['result']);
          return false;
        } else {
          this.isSubmitted = true;
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

          localStorage.setItem("RolePermissionData", JSON.stringify(res['roledata']));
          localStorage.setItem("roleactionpermissiondata", JSON.stringify(res['roleactionpermissiondata']));

          for (let rle = 0; rle < res['roleactionpermissiondata'].length; rle++) {
            let splitvalue = res['roleactionpermissiondata'][rle].toString().split(",");
            let firstvaluesplit = splitvalue[0].split(":");
            let secondvaluesplit = splitvalue[1].split(":");
            let thirdvaluesplit = splitvalue[2].split(":");
            let fourthvaluesplit = splitvalue[3].split(":");
            let fivthvaluesplit = splitvalue[4].split(":");


            let firstvaluename = firstvaluesplit[0];
            let firstvaluedata = firstvaluesplit[1];
            localStorage.setItem(firstvaluename.toUpperCase(), firstvaluedata);


            let secondvaluename = secondvaluesplit[0];
            let secondvaluedata = secondvaluesplit[1];
            localStorage.setItem(secondvaluename.toUpperCase(), secondvaluedata);


            let thirdvaluename = thirdvaluesplit[0];
            let thirdvaluedata = thirdvaluesplit[1];
            localStorage.setItem(thirdvaluename.toUpperCase(), thirdvaluedata);


            let fourthvaluename = fourthvaluesplit[0];
            let fourthvaluedata = fourthvaluesplit[1];
            localStorage.setItem(fourthvaluename.toUpperCase(), fourthvaluedata);


            let fivthvaluename = fivthvaluesplit[0];
            let fivthvaluedata = fivthvaluesplit[1];
            localStorage.setItem(fivthvaluename.toUpperCase(), fivthvaluedata);
          }
          this.createUser(res['staffdetails'][0]);
          this.nativeStorage.setItem('menuItem', { profilePhoto: res['staffdetails'][0].photo, firstname: res['staffdetails'][0].firstname, lastname: res['staffdetails'][0].lastname, companyGroupName: res['staffdetails'][0].companygroup_name })
            .then(
            () => { },
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

      });
  }
  createUser(user) {

    this.events.publish('user:created', user, Date.now());
  }

  doMove() {
    this.navCtrl.setRoot(ForgotpasswordPage);
  }


}

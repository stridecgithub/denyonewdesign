import { Component } from '@angular/core';
import { Platform, NavController, NavParams, Events, MenuController,AlertController } from 'ionic-angular';
import { DashboardPage } from "../dashboard/dashboard";
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
  constructor( public platform: Platform, public alertCtrl: AlertController, private nativeStorage: NativeStorage, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, private conf: Config, private http: Http, public events: Events,
    public fb: FormBuilder) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.menuCtrl.swipeEnable(false);
   

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
    console.log("isNet" + isNet);
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
      return false;
    }
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

          //let roleData = localStorage.getItem("RolePermissionData");
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
    this.navCtrl.setRoot(ForgotpasswordPage);
  }


}

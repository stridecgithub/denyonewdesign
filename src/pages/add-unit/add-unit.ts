import { Component } from '@angular/core';
import {  NavController, NavParams, Platform } from 'ionic-angular';
import { NotificationSettingsPage } from "../notification-settings/notification-settings";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { PiclocationPage } from "../piclocation/piclocation";
import { UnitsPage } from "../units/units";
import { DashboardPage } from '../dashboard/dashboard';
//import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the AddUnitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-add-unit',
  templateUrl: 'add-unit.html',
  providers: [NativeGeocoder, Config]
})
export class AddUnitPage {
  public form: FormGroup;
  private apiServiceURL: string = "";
  public companys_id: any;
  public companyId: any;
  public userId: any;
  public userInfo = [];
  public responseResultCompany: any;
  public responseResultUnitGroup: any;
  public responseResultModel: any;
  public location: any;
  public lat: any;
  public lang: any;
  public isEdited: any;
  public neaplateno;
  public projectname;
  public models_id;
  public controllerid;
  public unitgroups_id;
  public unitname;
  public serial_number;
  contacts;
  pageTitle;
  public locationedit: boolean = false;
  //tabBarElement: any;
  constructor(private nativeGeocoder: NativeGeocoder, public platform: Platform, public http: Http, private conf: Config, public navCtrl: NavController, public navParams: NavParams,
    public fb: FormBuilder) {
    this.form = fb.group({
      "location": ["", Validators.required],
      "unitname": ["", Validators.compose([Validators.required])],
      "projectname": ["", Validators.compose([Validators.required])],
      "models_id": ["", Validators.required],
      "neaplateno": ["", Validators.required],
      'controllerid': ['', Validators.required],
      'serial_number': ['', Validators.required],
      "unitgroups_id": [""],
      "companys_id": ["", Validators.required]
    });


    this.apiServiceURL = conf.apiBaseURL();
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    this.getCompanyListData();
    this.getUnitGroupListData();
    this.getJsonModelListData();
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
  }

  ionViewWillLeave() {
    // this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad AddUnitPage');
    console.log("Navigation data from back notification settings" + JSON.stringify(this.navParams.get("accountsInfo")));
    if (this.navParams.get("accountsInfo") == undefined) {
      console.log("accountsInfo undefined section calling...");

    } else {
      console.log("accountsInfo value calling...");
      console.log("accountsInfo value project name:" + this.navParams.get("accountsInfo")[0].projectname);


      this.unitname = this.navParams.get("accountsInfo")[0].unitname;
      this.projectname = this.navParams.get("accountsInfo")[0].projectname;
      this.controllerid = this.navParams.get("accountsInfo")[0].controllerid;
      this.models_id = this.navParams.get("accountsInfo")[0].models_id;
      this.neaplateno = this.navParams.get("accountsInfo")[0].neaplateno;
      this.location = this.navParams.get("accountsInfo")[0].location;
      this.unitgroups_id = this.navParams.get("accountsInfo")[0].unitgroups_id;
      this.companys_id = this.navParams.get("accountsInfo")[0].companys_id;
      this.serial_number = this.navParams.get("accountsInfo")[0].serial_number;
      this.contacts = this.navParams.get("accountsInfo")[0].contacts;
    }
    let previousData = localStorage.getItem("addUnitFormOneValue");
    if (this.navParams.get("unitId")) {
      this.isEdited = true;
      this.geninfo(this.navParams.get("record"));
      this.pageTitle = 'Update';
    } else {
      this.isEdited = false
      this.pageTitle = 'Add';
    }
  }
  editDeployedLocation() {
    console.log('1');
    this.locationedit = false;
    console.log('2');
  }
  geninfo(item) {
    this.projectname = item.projectname;
    this.neaplateno = item.neaplateno;
    this.models_id = item.models_id;
    this.controllerid = item.controllerid;
    this.unitgroups_id = item.unitgroups_id;
    this.location = item.location;
    this.lat = item.lat;
    this.lang = item.lng;
    if (this.lat != '') {
      this.locationedit = true;
    }
    this.unitname = item.unitname;
    this.companys_id = item.companys_id;
    this.serial_number = item.serial_number;
    //this.contactpersonal= item.contactpersonal;
    //this.contactnumber= item.contactnumber;
    this.contacts = item.contacts;
  }
  // Goto Notification Settings
  NotificationSettings() {
    let unitname: string = this.form.controls["unitname"].value,
      projectname: string = this.form.controls["projectname"].value,
      controllerid: string = this.form.controls["controllerid"].value,
      models_id: string = this.form.controls["models_id"].value,
      neaplateno: string = this.form.controls["neaplateno"].value,
      unitgroups_id: string = this.form.controls["unitgroups_id"].value,
      companys_id: string = this.form.controls["companys_id"].value,
      location: string = this.form.controls["location"].value,
      serial_number: string = this.form.controls["serial_number"].value;


    let urlparam;
    if (this.navParams.get("unitId") != '') {
      urlparam = "unit_id=" + this.navParams.get("unitId") + "&controllerid=" + controllerid;
    } else {
      urlparam = "unit_id=0&controllerid=" + controllerid;
    }

    let
      body: string = urlparam,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/checkcontrollerid";
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log(JSON.stringify(data.json()));

          if (res.msg[0].Error == '1') {
            this.conf.sendNotification(res.msg[0].result);
          }
          else {
            this.userInfo.push({
              unitname: unitname,
              projectname: projectname,
              controllerid: controllerid,
              models_id: models_id,
              neaplateno: neaplateno,
              location: location,
              unitgroups_id: unitgroups_id,
              companys_id: companys_id,
              lang: this.lang,
              lat: this.lat,
              serial_number: serial_number,
              contacts: this.contacts
            });
            localStorage.setItem("addUnitFormOneValue", JSON.stringify(this.userInfo));
            this.navCtrl.setRoot(NotificationSettingsPage, {
              accountInfo: this.userInfo,
              record: this.navParams.get("record"),
              from: this.navParams.get("from"),
              isEdited: this.isEdited
            });
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      });
    // If Controller Id Check Unique
    //this.navCtrl.setRoot(NotificationSettingsPage);
  }
  previous() {

    if (this.navParams.get("from") == 'dashboard') {
      this.navCtrl.setRoot(DashboardPage, { tabIndex: 0, tabs: 'listView' });
    } else {
      this.navCtrl.setRoot(UnitsPage, {

      });
    }

  }
  getCompanyListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId+"&pagename=";
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        this.responseResultCompany = res.companies;
      }, error => {

      });

  }


  getJsonModelListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getmodels";
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultModel = res.models;
      }, error => {

      });

  }
  getUnitGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getunitgroups?loginid=" + this.userId + "&company_id=" + this.companyId;
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        this.responseResultUnitGroup = res.unitgroups;
      }, error => {
      });

  }

  getGps() {
    let locationSplit = this.location.split(",");
    for (let i = 0; i < locationSplit.length; i++) {
      if (i == 0) {
        console.log(locationSplit[i]);
        this.nativeGeocoder.forwardGeocode(locationSplit[i])
          .then((coordinates: NativeGeocoderForwardResult) => {
            console.log('The coordinates are latitude=' + coordinates.latitude + ' and longitude=' + coordinates.longitude)
            this.lat = coordinates.latitude;
            this.lat = this.lat.substring(0, 10);
            this.lang = coordinates.longitude;
            this.lang = this.lang.substring(0, 10);
          }
          )
          .catch((error: any) => console.log(error));
      }
    }
  }

  getmaplocation() {
    this.navCtrl.setRoot(PiclocationPage, {
    });
  }
}

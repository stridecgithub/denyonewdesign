import { Component } from '@angular/core';
import {  NavController, NavParams,Platform } from 'ionic-angular';
import { AlarmlogPage } from '../alarmlog/alarmlog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
/**
 * Generated class for the AlarmlogdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-alarmlogdetails',
  templateUrl: 'alarmlogdetails.html',
  providers: [Config]
})
export class AlarmlogdetailsPage {
  alarm_name;
  alarm_assginedto_name;
  alarm_priority;
  alarm_received_date;
  alarm_assigned_date_mobileview;
  alarm_received_date_mobileview;
  alarm_received_time;
  alarm_remark;
  alarm_assigned_date;
  public form: FormGroup;
  private apiServiceURL: string = "";
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public userId: any;
  //tabBarElement: any;
  alarm_assginedby_hashtag;
  alarm_assginedto_hashtag
  constructor(private platform:Platform,private conf: Config, public navCtrl: NavController, public navParams: NavParams,
    public fb: FormBuilder, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    this.form = fb.group({
      "alarm_assginedto_name": ["", Validators.required],
      "alarm_remark": ["", Validators.required],
      "alarm_received_date": ["", Validators.required]

    });
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
     this.platform.registerBackButtonAction(() => {
      this.previous();
    });
  }
  //{"alarm_id":"1","alarm_name":"Emergency Stop","alarm_assginedby_name":"Guest 1 Demo","alarm_assginedto_name":"Chun Hsin Ler","alarm_priority":"1","alarm_received_date":"05 Dec 2017 03:43PM","alarm_received_time":"03:43 PM","alarm_remark":"please check what is the problem. Thank."}
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
  // this.tabBarElement.style.display = 'none';
    let record = this.navParams.get("record");
    console.log(JSON.stringify(record));

    this.alarm_name = this.navParams.get("record").alarm_name;
    this.alarm_assginedto_name = this.navParams.get("record").alarm_assginedto_name;
    this.alarm_priority = this.navParams.get("record").alarm_priority;
    this.alarm_received_date = this.navParams.get("record").alarm_received_date.substr(0,12);
    this.alarm_received_date_mobileview=this.navParams.get("record").alarm_received_date_mobileview;
    this.alarm_received_time = this.navParams.get("record").alarm_received_time;
    this.alarm_remark = this.navParams.get("record").alarm_remark;
    this.alarm_assigned_date = this.navParams.get("record").alarm_assigned_date;
    this.alarm_assigned_date_mobileview = this.navParams.get("record").alarm_assigned_date_mobileview;
    this.alarm_assginedby_hashtag= this.navParams.get("record").alarm_assginedby_hashtag;
    this.alarm_assginedto_hashtag= this.navParams.get("record").alarm_assginedto_hashtag;
    // UnitDetails Api Call		
    let unit_id = this.navParams.get("record").alarm_unit_id;
    let
      typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headersunit: any = new Headers({ 'Content-Type': typeunit }),
      optionsunit: any = new RequestOptions({ headers: headersunit }),
      urlunit: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
        "&unitid=" + unit_id;
    console.log(urlunit);
    this.http.get(urlunit, optionsunit)
      .subscribe((data) => {					// If the request was successful notify the user
        if (data.status === 200) {
          this.unitDetailData.unitname = data.json().units[0].unitname;
          this.unitDetailData.projectname = data.json().units[0].projectname;
          this.unitDetailData.location = data.json().units[0].location;
          this.unitDetailData.colorcodeindications = data.json().units[0].colorcode;
          this.unitDetailData.gen_status = data.json().units[0].genstatus;
          this.unitDetailData.nextservicedate = data.json().units[0].nextservicedate;
          this.unitDetailData.companygroup_name = data.json().units[0].companygroup_name;
          this.unitDetailData.runninghr = data.json().units[0].runninghr;

          this.unitDetailData.alarmnotificationto = data.json().units[0].nextservicedate;
          if (data.json().units[0].lat == undefined) {
            this.unitDetailData.lat = '';
          } else {
            this.unitDetailData.lat = data.json().units[0].lat;
          }

          if (data.json().units[0].lat == 'undefined') {
            this.unitDetailData.lat = '';
          } else {
            this.unitDetailData.lat = data.json().units[0].lat;
          }


          if (data.json().units[0].lng == undefined) {
            this.unitDetailData.lng = '';
          } else {
            this.unitDetailData.lng = data.json().units[0].lng;
          }

          if (data.json().units[0].lng == 'undefined') {
            this.unitDetailData.lng = '';
          } else {
            this.unitDetailData.lng = data.json().units[0].lng;
          }

          this.unitDetailData.favoriteindication = data.json().units[0].favorite;
          console.log("Favorite Indication is" + this.unitDetailData.favoriteindication);

        }
      }, error => {

      });
    // Unit Details API Call

  }
  previous() {
    this.navCtrl.setRoot(AlarmlogPage, {
      record: this.navParams.get("record"),
      from: 'addalarm',
    });
  }
}

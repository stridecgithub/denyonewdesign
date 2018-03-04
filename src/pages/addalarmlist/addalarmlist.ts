import { Component } from '@angular/core';
import { NavController, NavParams, Platform,ModalController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlarmPage } from '../alarm/alarm';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { Config } from '../../config/config';
import { ModalPage } from '../modal/modal';
/**
 * Generated class for the AddalarmlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-addalarmlist',
  templateUrl: 'addalarmlist.html',
  providers: [Config]
})
export class AddalarmlistPage {
  public msgcount: any;
  public notcount: any;
  public loginas: any;
  public companyid: any;
  public form: FormGroup;
  public assigned_to: any;
  public remark: any;
  public userdata = [];
  public subject: any;
  public uname: any;
  public assignedby: any;
  micro_timestamp: any;
  public userId: any;
  public isSubmitted: boolean = false;
  public responseResultCountry: any;
  public responseResultReportTo: any;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public unitDetailData: any = {
    hashtag: ''
  }

  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // public isUploadedProcessing: boolean = false;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "";
  public networkType: string;

  constructor(public modalCtrl: ModalController,private conf: Config, public platform: Platform, public navCtrl: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "assigned_to": ["", Validators.required],
      "remark": ["", Validators.required],
      "subject": [""],
      "assignedby": [""],
      "alarm_assigned_date": ["", Validators.required]
    });
    let already = localStorage.getItem("microtime");
    if (already != undefined && already != 'undefined' && already != '') {
      this.micro_timestamp = already;
    } else {
      let dateStr = new Date();
      let yearstr = dateStr.getFullYear();
      let monthstr = dateStr.getMonth();
      let datestr = dateStr.getDate();
      let hrstr = dateStr.getHours();
      let mnstr = dateStr.getMinutes();
      let secstr = dateStr.getSeconds();
      this.micro_timestamp = yearstr + "" + monthstr + "" + datestr + "" + hrstr + "" + mnstr + "" + secstr;

    }
    localStorage.setItem("microtime", this.micro_timestamp);
    this.uname = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");

    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddalarmlistPage');
    localStorage.setItem("fromModule", "AddalarmlistPage");
    let unit_id = this.NP.get("unitid");
    console.log("addfdfsdfssdf" + JSON.stringify(unit_id));
    // UnitDetails Api Call		
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
        "&unitid=" + unit_id.unit_id;
    console.log(url);
    this.http.get(url, options)
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
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    // Unit Details API Call
  }
  
  ionViewWillEnter() {
    this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    this.unitDetailData.location = localStorage.getItem("unitlocation");
    this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    console.log("Unit Details Color Code:" + this.unitDetailData.colorcodeindications);
    this.unitDetailData.lat = localStorage.getItem("unitlat");
    this.unitDetailData.lng = localStorage.getItem("unitlng");
    this.unitDetailData.rh = localStorage.getItem("runninghr");
    this.unitDetailData.ns = localStorage.getItem("nsd");
    this.getUserListData();

    if (this.NP.get("record")) {
      console.log(this.NP.get("act"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      // this.pageTitle = 'Edit Company Group';
      this.readOnly = false;
      this.hideActionButton = true;
    }
    else {
      this.isEdited = false;
      //this.pageTitle = 'New  Org Chart';
    }

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  selectEntry(item) {
    this.subject = item.alarm_name;
    this.assignedby = this.uname;
    this.assigned_to = item.assigned_to;
    this.recordID = item.alarm_id;


  }
  getUserListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getstaffs?loginid=" + this.userId + "&company_id=" + this.companyid;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        // console.log(data.json);
        this.responseResultReportTo = res.staffslist;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  presentModal(unit) {
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  saveEntry() {
    /*let dateStr = new Date();
    let yearstr = dateStr.getFullYear();
    let monthstr = dateStr.getMonth();
    let datestr = dateStr.getDate();
    let alarm_assigned_date = yearstr + "-" + monthstr + "-" + datestr;
    */
    
    let isNet = localStorage.getItem("isNet");
    let alarm_assigned_date: string = this.form.controls["alarm_assigned_date"].value;
    this.remark = this.form.controls["remark"].value;
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      this.networkType = '';
      this.isSubmitted = true;
      let body: string = "is_mobile=1&alarmid=" + this.recordID +
        "&alarm_assigned_by=" + this.userId +
        "&alarm_assigned_to=" + this.assigned_to +
        "&alarm_remark=" + this.remark +
        "&alarm_assigned_date=" + alarm_assigned_date,//this.micro_timestamp

        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/alarms/assignalarm";
      console.log(url);
      console.log(body);

      this.http.post(url, body, options)
        .subscribe((data) => {
          //console.log("Response Success:" + JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            this.hideForm = true;
            console.log("Alarm Assinged Reponse:"+JSON.stringify(data));
            //this.conf.sendNotification(`Successfully assigned`);
            this.conf.sendNotification(data.json().msg[0].result);
            localStorage.setItem("userPhotoFile", "");
            
            if (this.NP.get("record") == 'alarm') {
             this.navCtrl.setRoot(AlarmPage,
                {
                  record: this.NP.get("record")
                });
            }
            else {
             this.navCtrl.setRoot(CommentsinfoPage);
            }
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }
  }

  previous() {
 
  }
  notification() {
   this.navCtrl.setRoot(NotificationPage);
  }
  
}

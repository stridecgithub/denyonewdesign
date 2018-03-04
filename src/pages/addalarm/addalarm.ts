import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlarmlogPage } from '../alarmlog/alarmlog';
import { AlarmPage } from '../alarm/alarm';
import { Config } from '../../config/config';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { TrendlinePage } from '../trendline/trendline';
import * as moment from 'moment';
declare var jQuery: any;
declare var mention: any;
/**
 * Generated class for the AddalarmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addalarm',
  templateUrl: 'addalarm.html',
  providers: [Config]
})
export class AddalarmPage {
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
  alarm_received_time;
  public assignedby: any;
  micro_timestamp: any;
  alarm_priority;
  public unitDetailData: any = {
    hashtag: ''
  }
  public userId: any;
  public isSubmitted: boolean = false;
  public responseResultCountry: any;
  public responseResultReportTo: any;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;

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
  item;
  //tabBarElement: any;
  alarm_assigned_date: any;
  mindate;
  alarm_assgined_to;
  alarm_remark;
  
  public atmentioneddata = [];
  constructor(public modalCtrl: ModalController, private conf: Config, public platform: Platform, public navCtrl: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {

    this.alarm_assigned_date = moment().format();
    this.mindate = moment().format();
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "assigned_to": ["", Validators.required],
      "remark": ["", Validators.required],     
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
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
  }


  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';

    console.log('ionViewDidLoad AddalarmPage');
    localStorage.setItem("fromModule", "AddalarmPage");
    let unit_id = this.NP.get("record").alarm_unit_id;
    console.log("addfdfsdfssdf" + unit_id);
    // UnitDetails Api Call		
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
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    // Unit Details API Call




    if (this.NP.get("record")) {
      console.log(this.NP.get("act"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.item = this.NP.get("record");
      this.readOnly = false;
      this.hideActionButton = true;
    }
    else {
      this.isEdited = false;
    }
    this.getUserListData();
    let
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


    // Atmentioned API Calls
    // let
    //   //body: string = "key=delete&recordID=" + recordID,
    //   type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
    //   headers1: any = new Headers({ 'Content-Type': type }),
    //   options1: any = new RequestOptions({ headers: headers }),
    //   url1: any = this.apiServiceURL + "/api/atmentionednew.php?method=atmention&act=event&companyId=" + this.companyid + "&userId=" + this.userId;
    // console.log(url);
    // this.http.get(url1, options1)
    //   .subscribe(data => {
    //     // If the request was successful notify the user
    //     if (data.status === 200) {
    //       this.atmentioneddata = data.json();
    //       console.log(this.atmentioneddata);

    //       // jQuery('#assigned_to').tagEditor({
    //       //   autocomplete: {
    //       //     delay: 0,
    //       //     position: { collision: 'flip' },
    //       //     source: this.atmentioneddata,
    //       //     delimiter: ',;'
    //       //   },
    //       //   forceLowercase: false
    //       // });
    //     }
    //     // Otherwise let 'em know anyway
    //     else {
    //       this.conf.sendNotification('Something went wrong!');
    //     }
    //   }, error => {

    //   })


    let body1: string = '',
    //body: string = "key=delete&recordID=" + recordID,
    type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
    headers1: any = new Headers({ 'Content-Type': type }),
    options1: any = new RequestOptions({ headers: headers }),
    url1: any = this.apiServiceURL + "/hashtags?companyid=" + this.companyid + "&login=" + this.unitDetailData.userId;
  console.log(url1);
  this.http.get(url1, options1)

  // let body: string = param,

  //   type: string = "application/x-www-form-urlencoded; charset=UTF-8",
  //   headers: any = new Headers({ 'Content-Type': type }),
  //   options: any = new RequestOptions({ headers: headers }),
  //   url: any = urlstring;
  console.log("Message sending API" + url1+ "?" + body1);

  this.http.post(url1, body1, options1)

    .subscribe(data => {
      let res;
      // If the request was successful notify the user
      if (data.status === 200) {
       // this.atmentioneddata = data.json();
        res = data.json();
        console.log(data.json().staffs);

        if (res.staffs.length > 0) {
          for (let staff in res.staffs) {
            this.atmentioneddata.push({
              username: res.staffs[staff].username,
              name: res.staffs[staff].name,
            });
          }
        }
        // Otherwise let 'em know anyway
      } else {
        this.conf.sendNotification('Something went wrong!');
      }
    }, error => {

    })
  console.log(JSON.stringify("Array Result:" + this.atmentioneddata));
  jQuery(".remark").mention({
    users: this.atmentioneddata
  });

    // Atmentioned API Calls
  }

  ionViewWillEnter() {
    // this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    // this.unitDetailData.location = localStorage.getItem("unitlocation");
    // this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    // this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    // console.log("Unit Details Color Code:" + this.unitDetailData.colorcodeindications);
    // this.unitDetailData.lat = localStorage.getItem("unitlat");
    // this.unitDetailData.lng = localStorage.getItem("unitlng");
    // this.unitDetailData.rh = localStorage.getItem("runninghr");
    // this.unitDetailData.ns = localStorage.getItem("nsd");
    // this.unitDetailData.favoriteindication = localStorage.getItem("unitfav");

  }
  selectEntry(item) {
    console.log("Select entry list" + JSON.stringify(item));
    this.subject = item.alarm_name;
    this.assignedby = this.uname;
    this.alarm_assgined_to = item.alarm_assgined_to;
    this.assigned_to = item.alarm_assgined_to;
    this.recordID = item.alarm_id;
    this.alarm_priority = item.alarm_priority
    this.alarm_remark = item.alarm_remark;
    this.remark = item.alarm_remark
    this.alarm_received_time = item.alarm_received_time;


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
        this.responseResultReportTo = res.staffslist;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  saveEntry() {

    let isNet = localStorage.getItem("isNet");
    let alarm_assigned_date: string = this.form.controls["alarm_assigned_date"].value,
      assigned_to: string = this.form.controls["assigned_to"].value;
    //this.remark = this.form.controls["remark"].value;
    this.remark = jQuery(".remark").val();
    alarm_assigned_date = alarm_assigned_date.split("T")[0]
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      this.networkType = '';


      this.isSubmitted = true;
      let body: string = "is_mobile=1&alarmid=" + this.recordID +
        "&alarm_assigned_by=" + this.userId +
        "&alarm_assigned_to=" + assigned_to +
        "&alarm_remark=" + this.remark +
        "&alarm_assigned_date=" + alarm_assigned_date,

        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/alarms/assignalarm";
      console.log(url);
      console.log(body);

      this.http.post(url, body, options)
        .subscribe((data) => {
          if (data.status === 200) {
            this.hideForm = true;
            console.log("Alarm Assinged Reponse:" + JSON.stringify(data));
            //this.conf.sendNotification(`Successfully assigned`);
            this.conf.sendNotification(data.json().msg[0].result);
            localStorage.setItem("userPhotoFile", "");
           // localStorage.setItem("atMentionResult", '');
            if (this.NP.get("from") == 'alarm') {
              this.navCtrl.setRoot(AlarmPage);
            } else {
              this.navCtrl.setRoot(AlarmlogPage);
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

  address1get(hashtag) {
    console.log(hashtag);
    this.unitDetailData.hashtag = hashtag;
  }
  tapEvent(hashtag) {
    console.log("tapEvent function calling also:" + hashtag.target.value);
    this.unitDetailData.hashtag = hashtag.target.value;
  }
  previous() {
    console.log("From is:" + this.NP.get("from"));
    if (this.NP.get("from") == 'alarm') {
      this.navCtrl.setRoot(AlarmPage,
        {
          record: this.NP.get("record")
        });
    }
    else if (this.NP.get("from") == 'alarmlog') {
      this.navCtrl.setRoot(AlarmlogPage,
        {
          record: this.NP.get("record")
        });
    } else if (this.NP.get("from") == 'comment') {
      this.navCtrl.setRoot(CommentsinfoPage);
    } else if (this.NP.get("from") == 'commentinfo') {
      this.navCtrl.setRoot(CommentsinfoPage);
    } else {

    }
    console.log(this.navCtrl.getActive().name);
    /* this.navCtrl.setRoot(AlarmPage, {
       record: this.NP.get("record"),
       from: 'addalarm',
     });*/
  }

  trendlineInfo(alarmid, item) {
    this.navCtrl.setRoot(TrendlinePage, {
      alarmid: alarmid,
      record: item,
      from: this.NP.get("from")
    });


    // let modal = this.modalCtrl.create(TrendlinePage, {
    //   alarmid: alarmid,
    //   record: item,
    //   from: this.NP.get("from")
    // });
    // modal.present();

  }

}

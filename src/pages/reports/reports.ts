import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { RolePage } from '../role/role';
import { DashboardPage } from '../dashboard/dashboard';
//import { UnitsPage } from '../units/units';
//import { NotificationPage } from '../notification/notification';
//import { CalendarPage } from '../calendar/calendar';
import { DatePicker } from '@ionic-native/date-picker';
import { ReportviewtablePage } from '../reportviewtable/reportviewtable';
//import { OrgchartPage } from '../orgchart/orgchart';
import { RequestdenyoPage } from '../requestdenyo/requestdenyo';
import { ReportviewPage } from '../reportview/reportview';

import { Config } from '../../config/config';

import * as moment from 'moment';
import { PermissionPage } from '../../pages/permission/permission';
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
  providers: [DatePicker]
})
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
  providers: [DatePicker]
})
export class ReportsPage {
  //@ViewChild('mapContainer') mapContainer: ElementRef;
  //map: any;
  public footerBar = [];
  public loginas: any;
  public form: FormGroup;
  public userid: any;
  public companyid: any;
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public from: any;
  public to: any;
  public isSubmitted: boolean = false;
  public responseTemplate: any;
  public responseUnit: any;
  public companyId: any;
  public userInfo: any;
  mindate;
  public exportto: any;
  public action: any;
  public seltype: any;
  public button1: any;
  public button2: any;
  public datevalidaton: any;
  public start_date = 'Start Date';
  public end_date = 'End Date';
  profilePhoto;
  val;
  selunit;
  seltimeframe;
  seltemplate;
  public tableradiochk: boolean = true;
  public graphradiochk: boolean = false;
  public CREATEACCESS;

  public VIEWACCESS: any;
  /* public start_date = '2017-08-02';
  public end_date = '2017-08-02';
*/
  public responseResultTimeFrame = [];
  private apiServiceURL: string = "";
  constructor(public app: App, private conf: Config, private datePicker: DatePicker, public alertCtrl: AlertController, public NP: NavParams,
    public fb: FormBuilder, public http: Http, public navCtrl: NavController, public nav: NavController, public platform: Platform) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage);
      });
    });


    this.pageTitle = 'Reports';
    this.mindate = moment().format();
    this.loginas = localStorage.getItem("userInfoName");
    this.userid = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
    // Create form builder validation rules
    this.form = fb.group({
      "selunit": ["", Validators.required],
      "seltemplate": ["", Validators.required],
      "seltimeframe": ["", Validators.required],
      "start_date": ["", Validators.required],
      "end_date": ["", Validators.required],
    });
    this.responseResultTimeFrame = [];
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }


    this.CREATEACCESS = localStorage.getItem("REPORTS_REPORTS_CREATE");

    this.VIEWACCESS = localStorage.getItem("REPORTS_REPORTS_VIEW");
    if (this.VIEWACCESS == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
    }
  }
  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Request Granted',

      message: 'Request successfully sent.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {

          }
        }
      ],
      cssClass: 'alertDanger'
    });
    confirm.present();
  }
  ionViewWillEnter() {
    if (this.NP.get("reqsuccess") > 0) {
      this.showConfirm()
    }
    this.responseResultTimeFrame = [];
    this.datevalidaton = 0;
    this.getFormat('table');
    this.getDropDownDataTemplate();
    this.getDropDownDataUnits();
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userid;



    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });

    this.responseResultTimeFrame.push({
      id: '1time',
      time_name: '1 Time/Day',
    }, {
        id: 'continues',
        time_name: 'Continues'
      });
  }

  getNextDate(val) {
    //let date;
    this.datePicker.show({
      date: new Date(), mode: 'date',
      doneButtonColor: '#F2F3F4',
      cancelButtonColor: '#000000',
      allowFutureDates: true,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        let monthstr = date.getMonth() + parseInt("1");
        if (val == '1') {
          this.from = date.getFullYear() + "-" + monthstr + "-" + date.getDate();

          this.start_date = this.from;
        }
        if (val == '2') {
          this.to = date.getFullYear() + "-" + monthstr + "-" + date.getDate();

          this.end_date = this.to;
        }
      },
      err => { }
      );


  }


  saveEntry(val, from, to) {
    this.from = from;
    this.to = to;

    let selunit: string = this.form.controls["selunit"].value,
      seltemplate: string = this.form.controls["seltemplate"].value,
      seltimeframe: string = this.form.controls["seltimeframe"].value;
    // this.createEntry(selunit, seltemplate, seltimeframe);
    //this.from = "2017-08-09";
    //this.to = "2017-08-09";

    //this.exportto = 'table';
    //this.seltype = 0; // 0 for TABLE 1 for PDF


    // Statically
    /*selunit = '1';
    seltimeframe = 'continues';
    seltemplate = '1';
    this.from = "2017-08-12";
    this.to = "2017-08-12";
    this.action = 'view';
    this.exportto = 'table';
    this.seltype = 0;*/
    // Statically
    if (this.from == undefined) {
      this.from = '';
    }
    if (this.from == 'undefined') {
      this.from = '';
    }
    if (this.from == '') {
      this.from = '';
    }

    if (this.to == undefined) {
      this.to = '';
    }
    if (this.to == 'undefined') {
      this.to = '';
    }
    if (this.to == '') {
      this.to = '';
    }
    if (this.from == '' && this.to == '') {
      this.datevalidaton = 1;
      return false;
    } else {
      this.datevalidaton = 0;
    }


    this.nav.setRoot(ReportviewtablePage, {
      selunit: selunit,
      seltemplate: seltemplate,
      seltimeframe: seltimeframe,
      from: this.from,
      to: this.to,
      exportto: this.exportto,
      val: val
    });



  }





  getTemplate(templateId) {

  }

  getFormat(format) {

    this.isSubmitted = false;
    if (format == 'graph') {
      this.isSubmitted = true;
    }
    this.exportto = format;
  }

  getDropDownDataUnits() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/reports?is_mobile=1&companyid=" + this.companyid + "&loginid=" + this.userid;
    let res;

    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseUnit = res.units;
      });
  }

  getDropDownDataTemplate() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=0&results=300&sort=unit_id&dir=asc&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = this.apiServiceURL + "/reports?is_mobile=1&companyid=" + this.companyid + "&loginid=" + this.userid;
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseTemplate = res.templates;

      });

  }


  ionViewDidLoad() {
    if (this.NP.get("selunit") > 0) {
      this.val = this.NP.get("val");
      this.exportto = this.NP.get("exportto");
      this.selunit = this.NP.get("selunit");
      this.start_date = this.NP.get("from");
      this.end_date = this.NP.get("to");
      this.seltemplate = this.NP.get("seltemplate")
      this.seltimeframe = this.NP.get("seltimeframe")
      if (this.exportto == 'graph') {
        this.tableradiochk = false;
        this.graphradiochk = true;
      }

      if (this.exportto == 'table') {
        this.tableradiochk = true;
        this.graphradiochk = false;
      }



    }

  }

  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }

  viewreport() {
    this.navCtrl.setRoot(RequestdenyoPage);
  }

  viewreportpage() {
    this.navCtrl.setRoot(ReportviewPage);
  }




  filToDate(start_date) {
  }


}




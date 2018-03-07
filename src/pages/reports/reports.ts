import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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

import { EventsandcommentsPage } from '../eventsandcomments/eventsandcomments';

import * as moment from 'moment';
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
  public footerBar  = [];
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

  /* public start_date = '2017-08-02';
  public end_date = '2017-08-02';
*/
  public responseResultTimeFrame = [];
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  constructor(private datePicker: DatePicker, public alertCtrl: AlertController, public NP: NavParams,
    public fb: FormBuilder, public http: Http, public navCtrl: NavController, public nav: NavController) {
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

    this.apiServiceURL = this.apiServiceURL;
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }

    // Footer Menu Access - Start
    let footeraccessstorage = localStorage.getItem("footermenu");
    let footeraccessparams = this.NP.get('footermenu');
    let footermenuacc;
    if (footeraccessparams != undefined) {
      footermenuacc = footeraccessparams;
    } else {
      footermenuacc = footeraccessstorage;
    }

    
    // this.footerBar="0,"+footermenuacc;

    let footermenusplitcomma = footermenuacc.split(",");
    let dashboardAccess = footermenusplitcomma[0];
    let unitAccess = footermenusplitcomma[1];
    let calendarAccess = footermenusplitcomma[2];
    let messageAccess = footermenusplitcomma[3];
    let orgchartAccess = footermenusplitcomma[4];

    
    
    
   
    
    let dashboarddisplay;
    if (dashboardAccess == 1) {
      dashboarddisplay = '';
    } else {
      dashboarddisplay = 'none';
    }
    this.footerBar.push({
      title: 'Dashboard',
      active: true,
      colorcode: "#488aff",
      footerdisplay: dashboarddisplay,
      pageComponent: 'DashboardPage'
    });
    let unitdisplay;
    if (unitAccess == 1) {
      unitdisplay = '';
    } else {
      unitdisplay = 'none';
    }
    this.footerBar.push({
      title: 'Units',
      active: false,
      colorcode: "rgba(60, 60, 60, 0.7)",
      footerdisplay: unitdisplay,
      pageComponent: 'UnitsPage'
    });
    let calendardisplay;
    if (calendarAccess == 1) {
      calendardisplay = '';
    } else {
      calendardisplay = 'none';
    }

    this.footerBar.push({
      title: 'Calendar',
      active: false,
      colorcode: "rgba(60, 60, 60, 0.7)",
      footerdisplay: calendardisplay,
      pageComponent: 'CalendarPage'
    });
    let messagedisplay;
    if (messageAccess == 1) {
      messagedisplay = '';
    } else {
      messagedisplay = 'none';
    }
    this.footerBar.push({
      title: 'Message',
      active: false,
      colorcode: "rgba(60, 60, 60, 0.7)",
      footerdisplay: messagedisplay,
      pageComponent: 'MessagePage'
    });
    let orgchartdisplay;
    if (orgchartAccess == 1) {
      orgchartdisplay = '';
    } else {
      orgchartdisplay = 'none';
    }
    this.footerBar.push({
      title: 'Org Chart',
      active: false,
      footerdisplay: orgchartdisplay,
      colorcode: "rgba(60, 60, 60, 0.7)",
      pageComponent: 'OrgchartPage'
    });

    
    //this.footerBar = "0";
    //let footerBar=this.footerBar.split(",");
    

    // Footer Menu Access - End
   
    this.CREATEACCESS = localStorage.getItem("REPORTS_REPORTS_CREATE");
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


    console.log("Req Success" + this.NP.get("reqsuccess"));
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
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
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
          console.log('From date: ', this.from);
          this.start_date = this.from;
        }
        if (val == '2') {
          this.to = date.getFullYear() + "-" + monthstr + "-" + date.getDate();
          console.log('To date: ', this.to);
          this.end_date = this.to;
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );

    /*if (val == '1') {
      this.from = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
      console.log("From date from choosen calendar:" + this.from);
    }

    if (val == '2') {
      this.to = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
      console.log("From date from choosen calendar:" + this.to);
    }*/
  }


  saveEntry(val, from, to) {
    this.from = from;
    this.to = to;
    console.log("Button 1:" + this.button1);
    console.log("Button 2:" + this.button2);
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





  //http://denyoappv2.stridecdev.com/reports/viewreport?is_mobile=1&selunit=1&seltimeframe=continues&seltemplate=1&from=2017-08-12&to=2017-08-12&action=view&exportto=table&seltype=0
  getTemplate(templateId) {
    console.log(templateId);
  }

  getFormat(format) {
    console.log(format);
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
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=0&results=300&sort=unit_id&dir=asc&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = this.apiServiceURL + "/reports?is_mobile=1&companyid=" + this.companyid + "&loginid=" + this.userid;
    let res;
    console.log("URL" + url);
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
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseTemplate = res.templates;

      });

  }


  ionViewDidLoad() {
    console.log(JSON.stringify(this.NP));
    if (this.NP.get("selunit") > 0) {
      this.val = this.NP.get("val");
      this.exportto = this.NP.get("exportto");
      this.selunit = this.NP.get("selunit");
      this.start_date = this.NP.get("from");
      this.end_date = this.NP.get("to");
      this.seltemplate = this.NP.get("seltemplate")
      this.seltimeframe = this.NP.get("seltimeframe")
      if (this.exportto == 'graph') {
        this.tableradiochk=false;
        this.graphradiochk=true;
      }

      if (this.exportto == 'table') {
        this.tableradiochk=true;
        this.graphradiochk=false;
      }



    }
    console.log('ionViewDidLoad ReportsPage');
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


  evecomments() {
    this.navCtrl.setRoot(EventsandcommentsPage);
  }

  filToDate(start_date) {
    console.log("Start Date:" + start_date);
    //this.end_date = start_date.split("T")[0];
  }


}




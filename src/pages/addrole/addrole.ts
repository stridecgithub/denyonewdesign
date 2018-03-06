import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { RolePage } from '../role/role';
import 'rxjs/add/operator/map';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
//import { OrgchartPage} from '../orgchart/orgchart';
/**
 * Generated class for the AddRolePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addrole',
  templateUrl: 'addrole.html',
})
export class AddrolePage {
  // Define FormBuilder /model properties
  public loginas: any;
  public footerBar = [];
  public form: FormGroup;
  public role_name: any;
  public userId: any;
  public msgcount: any;
  public notcount: any;
   public isSubmitted: boolean = false;
  public roleperMissionData = [];
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  //public dashboardviewmap: boolean = false;
  public rolepermissionData: any =
  {
    dashboardviewmap: false,
    dashboardcreatemap: false,
    dashboardeditmap: false,
    dashboarddeletemap: false,
    dashboardhidemap: false,
    //Dashboard Units
    dashboardviewunits: false,
    dashboardcreateunits: false,
    dashboardeditunits: false,
    dashboarddeleteunits: false,
    dashboardhideunits: false,
    // Calendar Events
    calviewevents: false,
    calcreateevents: false,
    caleditevents: false,
    caldeleteevents: false,
    // Calendar Services
    calviewservices: false,
    calcreateservices: false,
    caleditservices: false,
    caldeleteservices: false,
    // Calendar Alarm
    calviewalarm: false,
    calcreatealarm: false,
    caleditalarm: false,
    caldeletealarm: false,
    // Units Unit List
    univiewlist: false,
    unicreatelist: false,
    unieditlist: false,
    unideletelist: false,
    // Units Alaram
    univiewalarm: false,
    unicreatealarm: false,
    unieditalarm: false,
    unideletealarm: false,
    // Units Services Info
    univiewservices: false,
    unicreateservices: false,
    unieditservices: false,
    unideleteservices: false,
    // Units Comments
    univiewcomm: false,
    unicreatecomm: false,
    unieditcomm: false,
    unideletecomm: false,
    // Units Unit Group
    univiewgroup: false,
    unicreategroup: false,
    unieditgroup: false,
    unideletegroup: false,
    // Units Generator Model Managment
    univiewgmm: false,
    unicreategmm: false,
    unieditgmm: false,
    unideletegmm: false,

    // Reports
    viewreports: false,
    createreports: false,
    editreports: false,
    deletereports: false,


    // Message Inbox
    msgviewinbox: false,
    msgcreateinbox: false,
    msgeditinbox: false,
    msgdeleteinbox: false,
    // Message Sent
    msgviewsent: false,
    msgcreatesent: false,
    msgeditsent: false,
    msgdeletesent: false,

    // Settings My Account
    setviewmyacc: false,
    setcreatemyacc: false,
    seteditmyacc: false,
    setdeletemyacc: false,
    // Settings User List
    setviewuselst: false,
    setcreateuselst: false,
    setedituselst: false,
    setdeleteuselst: false,
    // Settings User Group
    setviewusegru: false,
    setcreateusegru: false,
    seteditusegru: false,
    setdeleteusegru: false,
    // Settings User Role
    setviewuserle: false,
    setcreateuserle: false,
    setedituserle: false,
    setdeleteuserle: false,
    // Settings Report Template
    setviewtmp: false,
    setcreatetmp: false,
    setedittmp: false,
    setdeletetmp: false,
    // Settings Org Chart
    setvieworg: false,
    setcreateorg: false,
    seteditorg: false,
    setdeleteorg: false

  }
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com/";
  constructor(public navCtrl: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "role_name": ["", Validators.required],
      //Dashboard Map
      "dashboardviewmap": [""],
      "dashboardcreatemap": [""],
      "dashboardeditmap": [""],
      "dashboarddeletemap": [""],
      "dashboardhidemap": [""],
      //Dashboard Units
      "dashboardviewunits": [""],
      "dashboardcreateunits": [""],
      "dashboardeditunits": [""],
      "dashboarddeleteunits": [""],
      "dashboardhideunits": [""],
      // Calendar Events
      "calviewevents": [""],
      "calcreateevents": [""],
      "caleditevents": [""],
      "caldeleteevents": [""],
      // Calendar Services
      "calviewservices": [""],
      "calcreateservices": [""],
      "caleditservices": [""],
      "caldeleteservices": [""],
      // Calendar Alarm
      "calviewalarm": [""],
      "calcreatealarm": [""],
      "caleditalarm": [""],
      "caldeletealarm": [""],
      // Units Unit List
      "univiewlist": [""],
      "unicreatelist": [""],
      "unieditlist": [""],
      "unideletelist": [""],
      // Units Alaram
      "univiewalarm": [""],
      "unicreatealarm": [""],
      "unieditalarm": [""],
      "unideletealarm": [""],
      // Units Services Info
      "univiewservices": [""],
      "unicreateservices": [""],
      "unieditservices": [""],
      "unideleteservices": [""],
      // Units Comments
      "univiewcomm": [""],
      "unicreatecomm": [""],
      "unieditcomm": [""],
      "unideletecomm": [""],
      // Units Unit Group
      "univiewgroup": [""],
      "unicreategroup": [""],
      "unieditgroup": [""],
      "unideletegroup": [""],
      // Units Generator Model Managment
      "univiewgmm": [""],
      "unicreategmm": [""],
      "unieditgmm": [""],
      "unideletegmm": [""],
      // Reports
      "viewreports": [""],
      "createreports": [""],
      "editreports": [""],
      "deletereports": [""],
      // Message Inbox
      "msgviewinbox": [""],
      "msgcreateinbox": [""],
      "msgeditinbox": [""],
      "msgdeleteinbox": [""],
      // Message Sent
      "msgviewsent": [""],
      "msgcreatesent": [""],
      "msgeditsent": [""],
      "msgdeletesent": [""],

      // Settings My Account
      "setviewmyacc": [""],
      "setcreatemyacc": [""],
      "seteditmyacc": [""],
      "setdeletemyacc": [""],
      // Settings User List
      "setviewuselst": [""],
      "setcreateuselst": [""],
      "setedituselst": [""],
      "setdeleteuselst": [""],
      // Settings User Group
      "setviewusegru": [""],
      "setcreateusegru": [""],
      "seteditusegru": [""],
      "setdeleteusegru": [""],
      // Settings User Role
      "setviewuserle": [""],
      "setcreateuserle": [""],
      "setedituserle": [""],
      "setdeleteuserle": [""],
      // Settings Report Template
      "setviewtmp": [""],
      "setcreatetmp": [""],
      "setedittmp": [""],
      "setdeletetmp": [""],
      // Settings Org Chart
      "setvieworg": [""],
      "setcreateorg": [""],
      "seteditorg": [""],
      "setdeleteorg": [""]
    });

    this.userId = localStorage.getItem("userInfoId");

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

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRolePage');
  }

  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    this.resetFields();
    if (this.NP.get("record")) {
      console.log(this.NP.get("act"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit Role';
      this.readOnly = false;
      this.hideActionButton = true;
    }
    else {
      this.isEdited = false;
      this.pageTitle = 'Add New Role';
    }
  }



  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    this.role_name = item.role_name;
    this.recordID = item.role_id;
    // let body: string = "key=permissiondata&role_id=" + this.recordID,
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "editrole?is_mobile=1&role_id=" + this.recordID;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();

        // Dashboard Mapif()
        if (res.roledata[0].view_action == 1) {
          this.rolepermissionData.dashboardviewmap = true;
        }
        else {

          this.rolepermissionData.dashboardviewmap = false;

        }
        if (res.roledata[0].create_action == 1) {
          this.rolepermissionData.dashboardcreatemap = true;
        }
        else {
          this.rolepermissionData.dashboardcreatemap = false;
        }
        if (res.roledata[0].edit_action == 1) {
          this.rolepermissionData.dashboardeditmap = true;
        }
        else {

          this.rolepermissionData.dashboardeditmap = false;

        }
        if (res.roledata[0].delete_action == 1) {
          this.rolepermissionData.dashboarddeletemap = true;
        }
        else {
          this.rolepermissionData.dashboarddeletemap = false;
        }
        if (res.roledata[0].hide_action == 1) {
          this.rolepermissionData.dashboardhidemap = true;
        }
        else {
          this.rolepermissionData.dashboardhidemap = false;
        }
        //this.rolepermissionData.dashboardviewmap = res[0].dashboardviewmap;
        //this.rolepermissionData.dashboardcreatemap = res[0].dashboardcreatemap;
        //this.rolepermissionData.dashboardeditmap = res[0].dashboardeditmap;
        //this.rolepermissionData.dashboarddeletemap = res[0].dashboarddeletemap;
        // this.rolepermissionData.dashboardhidemap = res[0].dashboardhidemap;

        // Dashboard Units
        if (res.roledata[1].view_action == 1) {
          this.rolepermissionData.dashboardviewunits = true;
        }
        else {

          this.rolepermissionData.dashboardviewunits = false;

        }
        if (res.roledata[1].create_action == 1) {
          this.rolepermissionData.dashboardcreateunits = true;
        }
        else {
          this.rolepermissionData.dashboardcreateunits = false;
        }
        if (res.roledata[1].edit_action == 1) {
          this.rolepermissionData.dashboardeditunits = true;
        }
        else {

          this.rolepermissionData.dashboardeditunits = false;

        }
        if (res.roledata[1].delete_action == 1) {
          this.rolepermissionData.dashboarddeleteunits = true;
        }
        else {
          this.rolepermissionData.dashboarddeleteunits = false;
        }
        if (res.roledata[1].hide_action == 1) {
          this.rolepermissionData.dashboardhideunits = true;
        }
        else {
          this.rolepermissionData.dashboardhideunits = false;
        }
        //this.rolepermissionData.dashboardviewunits = res[1].dashboardviewunits;
        //this.rolepermissionData.dashboardcreateunits = res[1].dashboardcreateunits;
        //this.rolepermissionData.dashboardeditunits = res[1].dashboardeditunits;
        //this.rolepermissionData.dashboarddeleteunits = res[1].dashboarddeleteunits;
        //this.rolepermissionData.dashboardhideunits = res[1].dashboardhideunits;


        // Calendar Events    
        if (res.roledata[2].view_action == 1) {
          this.rolepermissionData.calviewevents = true;
        }
        else {

          this.rolepermissionData.calviewevents = false;

        }
        if (res.roledata[2].create_action == 1) {
          this.rolepermissionData.calcreateevents = true;
        }
        else {
          this.rolepermissionData.calcreateevents = false;
        }
        if (res.roledata[2].edit_action == 1) {
          this.rolepermissionData.caleditevents = true;
        }
        else {

          this.rolepermissionData.caleditevents = false;

        }
        if (res.roledata[2].delete_action == 1) {
          this.rolepermissionData.caldeleteevents = true;
        }
        else {
          this.rolepermissionData.caldeleteevents = false;
        }
        // this.rolepermissionData.calviewevents = res[2].calviewevents;
        //  this.rolepermissionData.calcreateevents = res[2].calcreateevents;
        // this.rolepermissionData.caleditevents = res[2].caleditevents;
        //this.rolepermissionData.caldeleteevents = res[2].caldeleteevents;


        // Calendar Services
        if (res.roledata[3].view_action == 1) {
          this.rolepermissionData.calviewservices = true;
        }
        else {

          this.rolepermissionData.calviewservices = false;

        }
        if (res.roledata[3].create_action == 1) {
          this.rolepermissionData.calcreateservices = true;
        }
        else {
          this.rolepermissionData.calcreateservices = false;
        }
        if (res.roledata[3].edit_action == 1) {
          this.rolepermissionData.caleditservices = true;
        }
        else {

          this.rolepermissionData.caleditservices = false;

        }
        if (res.roledata[3].delete_action == 1) {
          this.rolepermissionData.caldeleteservices = true;
        }
        else {
          this.rolepermissionData.caldeleteservices = false;
        }
        // this.rolepermissionData.calviewservices = res[3].calviewservices;
        // this.rolepermissionData.calcreateservices = res[3].calcreateservices;
        // this.rolepermissionData.caleditservices = res[3].caleditservices;
        // this.rolepermissionData.caldeleteservices = res[3].caldeleteservices;

        // Calendar Alarm 
        if (res.roledata[4].view_action == 1) {
          this.rolepermissionData.calviewalarm = true;
        }
        else {

          this.rolepermissionData.calviewalarm = false;

        }
        if (res.roledata[4].create_action == 1) {
          this.rolepermissionData.calcreatealarm = true;
        }
        else {
          this.rolepermissionData.calcreatealarm = false;
        }
        if (res.roledata[4].edit_action == 1) {
          this.rolepermissionData.caleditalarm = true;
        }
        else {

          this.rolepermissionData.caleditalarm = false;

        }
        if (res.roledata[4].delete_action == 1) {
          this.rolepermissionData.caldeletealarm = true;
        }
        else {
          this.rolepermissionData.caldeletealarm = false;
        }
        // this.rolepermissionData.calviewalarm = res[4].calviewalarm;
        // this.rolepermissionData.calcreatealarm = res[4].calcreatealarm;
        // this.rolepermissionData.caleditalarm = res[4].caleditalarm;
        // this.rolepermissionData.caldeletealarm = res[4].caldeletealarm;


        // Units Unit List
        if (res.roledata[5].view_action == 1) {
          this.rolepermissionData.univiewlist = true;
        }
        else {

          this.rolepermissionData.univiewlist = false;

        }
        if (res.roledata[5].create_action == 1) {
          this.rolepermissionData.unicreatelist = true;
        }
        else {
          this.rolepermissionData.unicreatelist = false;
        }
        if (res.roledata[5].edit_action == 1) {
          this.rolepermissionData.unieditlist = true;
        }
        else {

          this.rolepermissionData.unieditlist = false;

        }
        if (res.roledata[5].delete_action == 1) {
          this.rolepermissionData.unideletelist = true;
        }
        else {
          this.rolepermissionData.unideletelist = false;
        }

        //this.rolepermissionData.univiewlist = res[5].univiewlist;
        //this.rolepermissionData.unicreatelist = res[5].unicreatelist;
        //this.rolepermissionData.unieditlist = res[5].unieditlist;
        // this.rolepermissionData.unideletelist = res[5].unideletelist;
        // Units Alaram
        if (res.roledata[6].view_action == 1) {
          this.rolepermissionData.univiewalarm = true;
        }
        else {

          this.rolepermissionData.univiewalarm = false;

        }
        if (res.roledata[6].create_action == 1) {
          this.rolepermissionData.unicreatealarm = true;
        }
        else {
          this.rolepermissionData.unicreatealarm = false;
        }
        if (res.roledata[6].edit_action == 1) {
          this.rolepermissionData.unieditalarm = true;
        }
        else {

          this.rolepermissionData.unieditalarm = false;

        }
        if (res.roledata[6].delete_action == 1) {
          this.rolepermissionData.unideletealarm = true;
        }
        else {
          this.rolepermissionData.unideletealarm = false;
        }
        // this.rolepermissionData.univiewalarm = res[6].univiewalarm;
        // this.rolepermissionData.unicreatealarm = res[6].unicreatealarm;
        // this.rolepermissionData.unieditalarm = res[6].unieditalarm;
        // this.rolepermissionData.unideletealarm = res[6].unideletealarm;
        // Units Services Info
        if (res.roledata[7].view_action == 1) {
          this.rolepermissionData.univiewservices = true;
        }
        else {

          this.rolepermissionData.univiewservices = false;

        }
        if (res.roledata[7].create_action == 1) {
          this.rolepermissionData.unicreateservices = true;
        }
        else {
          this.rolepermissionData.unicreateservices = false;
        }
        if (res.roledata[7].edit_action == 1) {
          this.rolepermissionData.unieditservices = true;
        }
        else {

          this.rolepermissionData.unieditservices = false;

        }
        if (res.roledata[7].delete_action == 1) {
          this.rolepermissionData.unideleteservices = true;
        }
        else {
          this.rolepermissionData.unideleteservices = false;
        }
        // this.rolepermissionData.univiewservices = res[7].univiewservices;
        // this.rolepermissionData.unicreateservices = res[7].unicreateservices;
        // this.rolepermissionData.unieditservices = res[7].unieditservices;
        // this.rolepermissionData.unideleteservices = res[7].unideleteservices;
        // Units Comments
        if (res.roledata[8].view_action == 1) {
          this.rolepermissionData.univiewcomm = true;
        }
        else {

          this.rolepermissionData.univiewcomm = false;

        }
        if (res.roledata[8].create_action == 1) {
          this.rolepermissionData.unicreatecomm = true;
        }
        else {
          this.rolepermissionData.unicreatecomm = false;
        }
        if (res.roledata[8].edit_action == 1) {
          this.rolepermissionData.unieditcomm = true;
        }
        else {

          this.rolepermissionData.unieditcomm = false;

        }
        if (res.roledata[8].delete_action == 1) {
          this.rolepermissionData.unideletecomm = true;
        }
        else {
          this.rolepermissionData.unideletecomm = false;
        }

        // this.rolepermissionData.univiewcomm = res[8].univiewcomm;
        // this.rolepermissionData.unicreatecomm = res[8].unicreatecomm;
        // this.rolepermissionData.unieditcomm = res[8].unieditcomm;
        // this.rolepermissionData.unideletecomm = res[8].unideletecomm;
        // Units Unit Group
        if (res.roledata[9].view_action == 1) {
          this.rolepermissionData.univiewgroup = true;
        }
        else {

          this.rolepermissionData.univiewgroup = false;

        }
        if (res.roledata[9].create_action == 1) {
          this.rolepermissionData.unicreategroup = true;
        }
        else {
          this.rolepermissionData.unicreategroup = false;
        }
        if (res.roledata[9].edit_action == 1) {
          this.rolepermissionData.unieditgroup = true;
        }
        else {

          this.rolepermissionData.unieditgroup = false;

        }
        if (res.roledata[9].delete_action == 1) {
          this.rolepermissionData.unideletegroup = true;
        }
        else {
          this.rolepermissionData.unideletegroup = false;
        }
        // this.rolepermissionData.univiewgroup = res[9].univiewgroup;
        // this.rolepermissionData.unicreategroup = res[9].unicreategroup;
        // this.rolepermissionData.unieditgroup = res[9].unieditgroup;
        // this.rolepermissionData.unideletegroup = res[9].unideletegroup;

        // Units Generator Model Managment
        if (res.roledata[10].view_action == 1) {
          this.rolepermissionData.univiewgmm = true;
        }
        else {

          this.rolepermissionData.univiewgmm = false;

        }
        if (res.roledata[10].create_action == 1) {
          this.rolepermissionData.unicreategmm = true;
        }
        else {
          this.rolepermissionData.unicreategmm = false;
        }
        if (res.roledata[10].edit_action == 1) {
          this.rolepermissionData.unieditgmm = true;
        }
        else {

          this.rolepermissionData.unieditgmm = false;

        }
        if (res.roledata[10].delete_action == 1) {
          this.rolepermissionData.unideletegmm = true;
        }
        else {
          this.rolepermissionData.unideletegmm = false;
        }

        // this.rolepermissionData.univiewgmm = res[10].univiewgmm;
        // this.rolepermissionData.unicreategmm = res[10].unicreategmm;
        // this.rolepermissionData.unieditgmm = res[10].unieditgmm;
        // this.rolepermissionData.unideletegmm = res[10].unideletegmm;
        // Reports
        if (res.roledata[11].view_action == 1) {
          this.rolepermissionData.viewreports = true;
        }
        else {

          this.rolepermissionData.viewreports = false;

        }
        if (res.roledata[11].create_action == 1) {
          this.rolepermissionData.createreports = true;
        }
        else {
          this.rolepermissionData.createreports = false;
        }
        if (res.roledata[11].edit_action == 1) {
          this.rolepermissionData.editreports = true;
        }
        else {

          this.rolepermissionData.editreports = false;

        }
        if (res.roledata[11].delete_action == 1) {
          this.rolepermissionData.deletereports = true;
        }
        else {
          this.rolepermissionData.deletereports = false;
        }
        // this.rolepermissionData.viewreports = res[11].viewreports;
        // this.rolepermissionData.createreports = res[11].createreports;
        // this.rolepermissionData.editreports = res[11].editreports;
        // this.rolepermissionData.deletereports = res[11].deletereports;

        // Message Inbox
        if (res.roledata[12].view_action == 1) {
          this.rolepermissionData.msgviewinbox = true;
        }
        else {

          this.rolepermissionData.msgviewinbox = false;

        }
        if (res.roledata[12].create_action == 1) {
          this.rolepermissionData.msgcreateinbox = true;
        }
        else {
          this.rolepermissionData.msgcreateinbox = false;
        }
        if (res.roledata[12].edit_action == 1) {
          this.rolepermissionData.msgeditinbox = true;
        }
        else {

          this.rolepermissionData.msgeditinbox = false;

        }
        if (res.roledata[12].delete_action == 1) {
          this.rolepermissionData.msgdeleteinbox = true;
        }
        else {
          this.rolepermissionData.msgdeleteinbox = false;
        }

        // this.rolepermissionData.msgviewinbox = res[12].msgviewinbox;
        // this.rolepermissionData.msgcreateinbox = res[12].msgcreateinbox;
        // this.rolepermissionData.msgeditinbox = res[12].msgeditinbox;
        // this.rolepermissionData.msgdeleteinbox = res[12].msgdeleteinbox;
        // Message Sent
        if (res.roledata[13].view_action == 1) {
          this.rolepermissionData.msgviewsent = true;
        }
        else {

          this.rolepermissionData.msgviewsent = false;

        }
        if (res.roledata[13].create_action == 1) {
          this.rolepermissionData.msgcreatesent = true;
        }
        else {
          this.rolepermissionData.msgcreatesent = false;
        }
        if (res.roledata[13].edit_action == 1) {
          this.rolepermissionData.msgeditsent = true;
        }
        else {

          this.rolepermissionData.msgeditsent = false;

        }
        if (res.roledata[13].delete_action == 1) {
          this.rolepermissionData.msgdeletesent = true;
        }
        else {
          this.rolepermissionData.msgdeletesent = false;
        }

        // this.rolepermissionData.msgviewsent = res[13].msgviewsent;
        // this.rolepermissionData.msgcreatesent = res[13].msgcreatesent;
        // this.rolepermissionData.msgeditsent = res[13].msgeditsent;
        // this.rolepermissionData.msgdeletesent = res[13].msgdeletesent;

        // Settings My Account   
        if (res.roledata[14].view_action == 1) {
          this.rolepermissionData.setviewmyacc = true;
        }
        else {

          this.rolepermissionData.setviewmyacc = false;

        }
        if (res.roledata[14].create_action == 1) {
          this.rolepermissionData.setcreatemyacc = true;
        }
        else {
          this.rolepermissionData.setcreatemyacc = false;
        }
        if (res.roledata[14].edit_action == 1) {
          this.rolepermissionData.seteditmyacc = true;
        }
        else {

          this.rolepermissionData.seteditmyacc = false;

        }
        if (res.roledata[14].delete_action == 1) {
          this.rolepermissionData.setdeletemyacc = true;
        }
        else {
          this.rolepermissionData.setdeletemyacc = false;
        }

        // this.rolepermissionData.setviewmyacc = res[14].setviewmyacc;
        // this.rolepermissionData.setcreatemyacc = res[14].setcreatemyacc;
        // this.rolepermissionData.seteditmyacc = res[14].seteditmyacc;
        // this.rolepermissionData.setdeletemyacc = res[14].setdeletemyacc;
        // Settings User List
        if (res.roledata[15].view_action == 1) {
          this.rolepermissionData.setviewuselst = true;
        }
        else {

          this.rolepermissionData.setviewuselst = false;

        }
        if (res.roledata[15].create_action == 1) {
          this.rolepermissionData.setcreateuselst = true;
        }
        else {
          this.rolepermissionData.setcreateuselst = false;
        }
        if (res.roledata[15].edit_action == 1) {
          this.rolepermissionData.setedituselst = true;
        }
        else {

          this.rolepermissionData.setedituselst = false;

        }
        if (res.roledata[15].delete_action == 1) {
          this.rolepermissionData.setdeleteuselst = true;
        }
        else {
          this.rolepermissionData.setdeleteuselst = false;
        }

        // this.rolepermissionData.setviewuselst = res[15].setviewuselst;
        // this.rolepermissionData.setcreateuselst = res[15].setcreateuselst;
        // this.rolepermissionData.setedituselst = res[15].setedituselst;
        // this.rolepermissionData.setdeleteuselst = res[15].setdeleteuselst;
        // Settings User Group
        if (res.roledata[16].view_action == 1) {
          this.rolepermissionData.setviewusegru = true;
        }
        else {

          this.rolepermissionData.setviewusegru = false;

        }
        if (res.roledata[16].create_action == 1) {
          this.rolepermissionData.setcreateusegru = true;
        }
        else {
          this.rolepermissionData.setcreateusegru = false;
        }
        if (res.roledata[16].edit_action == 1) {
          this.rolepermissionData.seteditusegru = true;
        }
        else {

          this.rolepermissionData.seteditusegru = false;

        }
        if (res.roledata[16].delete_action == 1) {
          this.rolepermissionData.setdeleteusegru = true;
        }
        else {
          this.rolepermissionData.setdeleteusegru = false;
        }

        // this.rolepermissionData.setviewusegru = res[16].setviewusegru;
        // this.rolepermissionData.setcreateusegru = res[16].setcreateusegru;
        // this.rolepermissionData.seteditusegru = res[16].seteditusegru;
        // this.rolepermissionData.setdeleteusegru = res[16].setdeleteusegru;
        // Settings User Role
        if (res.roledata[17].view_action == 1) {
          this.rolepermissionData.setviewuserle = true;
        }
        else {

          this.rolepermissionData.setviewuserle = false;

        }
        if (res.roledata[17].create_action == 1) {
          this.rolepermissionData.setcreateuserle = true;
        }
        else {
          this.rolepermissionData.setcreateuserle = false;
        }
        if (res.roledata[17].edit_action == 1) {
          this.rolepermissionData.setedituserle = true;
        }
        else {

          this.rolepermissionData.setedituserle = false;

        }
        if (res.roledata[17].delete_action == 1) {
          this.rolepermissionData.setdeleteuserle = true;
        }
        else {
          this.rolepermissionData.setdeleteuserle = false;
        }
        // this.rolepermissionData.setviewuserle = res[17].setviewuserle;
        // this.rolepermissionData.setcreateuserle = res[17].setcreateuserle;
        // this.rolepermissionData.setedituserle = res[17].setedituserle;
        // this.rolepermissionData.setdeleteuserle = res[17].setdeleteuserle;
        // Settings Report Template
        if (res.roledata[18].view_action == 1) {
          this.rolepermissionData.setviewtmp = true;
        }
        else {

          this.rolepermissionData.setviewtmp = false;

        }
        if (res.roledata[18].create_action == 1) {
          this.rolepermissionData.setcreatetmp = true;
        }
        else {
          this.rolepermissionData.setcreatetmp = false;
        }
        if (res.roledata[18].edit_action == 1) {
          this.rolepermissionData.setedittmp = true;
        }
        else {

          this.rolepermissionData.setedittmp = false;

        }
        if (res.roledata[18].delete_action == 1) {
          this.rolepermissionData.setdeletetmp = true;
        }
        else {
          this.rolepermissionData.setdeletetmp = false;
        }

        // this.rolepermissionData.setviewtmp = res[18].setviewtmp;
        // this.rolepermissionData.setcreatetmp = res[18].setcreatetmp;
        // this.rolepermissionData.setedittmp = res[18].setedittmp;
        // this.rolepermissionData.setdeletetmp = res[18].setdeletetmp;
        // Settings Org Chart
        if (res.roledata[19].view_action == 1) {
          this.rolepermissionData.setvieworg = true;
        }
        else {

          this.rolepermissionData.setvieworg = false;

        }
        if (res.roledata[19].create_action == 1) {
          this.rolepermissionData.setcreateorg = true;
        }
        else {
          this.rolepermissionData.setcreateorg = false;
        }
        if (res.roledata[19].edit_action == 1) {
          this.rolepermissionData.seteditorg = true;
        }
        else {

          this.rolepermissionData.seteditorg = false;

        }
        if (res.roledata[19].delete_action == 1) {
          this.rolepermissionData.setdeleteorg = true;
        }
        else {
          this.rolepermissionData.setdeleteorg = false;
        }
        // this.rolepermissionData.setvieworg = res[19].setvieworg;
        // this.rolepermissionData.setcreateorg = res[19].setcreateorg;
        // this.rolepermissionData.seteditorg = res[19].seteditorg;
        // this.rolepermissionData.setdeleteorg = res[19].setdeleteorg;


        //  console.log("dashboardviewmap:" + res[1].dashboardviewunits);

        console.log("Role Permission Data Response:" + JSON.stringify(data.json()));

      });
  }



  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(role_name, roleperMissionData, createdby) {
    this.isSubmitted=true;
    let body: string = "is_mobile=1&role_name=" + role_name + "&module=" + JSON.stringify(roleperMissionData) + "&createdby=" + createdby,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "role/store";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          console.log(data.json().Error);
          if (data.json().Error > 0) {
            this.roleperMissionData = [];
            this.sendNotification(data.json().message);
          } else {
            //this.sendNotification(data.json().message);
            this.sendNotification(`Role  was successfully added`);
            this.navCtrl.setRoot(RolePage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(role_name, roleperMissionData, createdby) {
    this.isSubmitted=true;
    let body: string = "is_mobile=1&role_name=" + role_name + "&module=" + JSON.stringify(roleperMissionData) + "&createdby=" + createdby+"&role_id="+this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "role/update";
    console.log(url+"?"+body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          if (data.json().Error > 0) {
            this.sendNotification(data.json().message);
          } else {
            //this.sendNotification(data.json().message);
            this.sendNotification(`Role  was successfully updated`);
            this.navCtrl.setRoot(RolePage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }



  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry() {
    let role_name: string = this.form.controls["role_name"].value,
      body: string = "is_mobile=1&role_name=" + role_name + "&module=" + JSON.stringify(this.roleperMissionData) + "&updatedby=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "role/store";
    console.log(body);

    this.http.post(url, body, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          this.sendNotification(`Role: ${role_name} was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }



  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {
    // console.log("Controll Form is:"+JSON.stringify(this.form.controls));
    this.roleperMissionData = [];
    let role_name: string = this.form.controls["role_name"].value;


    let dashboardviewmap: string = this.form.controls["dashboardviewmap"].value,
      dashboardcreatemap: string = this.form.controls["dashboardcreatemap"].value,
      dashboardeditmap: string = this.form.controls["dashboardeditmap"].value,
      dashboarddeletemap: string = this.form.controls["dashboarddeletemap"].value,
      dashboardhidemap: string = this.form.controls["dashboardhidemap"].value,

      dashboardviewunits: string = this.form.controls["dashboardviewunits"].value,
      dashboardcreateunits: string = this.form.controls["dashboardcreateunits"].value,
      dashboardeditunits: string = this.form.controls["dashboardeditunits"].value,
      dashboarddeleteunits: string = this.form.controls["dashboarddeleteunits"].value,
      dashboardhideunits: string = this.form.controls["dashboardhideunits"].value,

      calviewevents: string = this.form.controls["calviewevents"].value,
      calcreateevents: string = this.form.controls["calcreateevents"].value,
      caleditevents: string = this.form.controls["caleditevents"].value,
      caldeleteevents: string = this.form.controls["caldeleteevents"].value,

      calviewservices: string = this.form.controls["calviewservices"].value,
      calcreateservices: string = this.form.controls["calcreateservices"].value,
      caleditservices: string = this.form.controls["caleditservices"].value,
      caldeleteservices: string = this.form.controls["caldeleteservices"].value,

      calviewalarm: string = this.form.controls["calviewalarm"].value,
      calcreatealarm: string = this.form.controls["calcreatealarm"].value,
      caleditalarm: string = this.form.controls["caleditalarm"].value,
      caldeletealarm: string = this.form.controls["caldeletealarm"].value,
      // Units Unit List      
      univiewlist: string = this.form.controls["univiewlist"].value,
      unicreatelist: string = this.form.controls["unicreatelist"].value,
      unieditlist: string = this.form.controls["unieditlist"].value,
      unideletelist: string = this.form.controls["unideletelist"].value,
      // Units Alaram
      univiewalarm: string = this.form.controls["univiewalarm"].value,
      unicreatealarm: string = this.form.controls["unicreatealarm"].value,
      unieditalarm: string = this.form.controls["unieditalarm"].value,
      unideletealarm: string = this.form.controls["unideletealarm"].value,
      // Units Services Info
      univiewservices: string = this.form.controls["univiewservices"].value,
      unicreateservices: string = this.form.controls["unicreateservices"].value,
      unieditservices: string = this.form.controls["unieditservices"].value,
      unideleteservices: string = this.form.controls["unideleteservices"].value,
      // Units Comments
      univiewcomm: string = this.form.controls["univiewcomm"].value,
      unicreatecomm: string = this.form.controls["unicreatecomm"].value,
      unieditcomm: string = this.form.controls["unieditcomm"].value,
      unideletecomm: string = this.form.controls["unideletecomm"].value,
      // Units Unit Group
      univiewgroup: string = this.form.controls["univiewgroup"].value,
      unicreategroup: string = this.form.controls["unicreategroup"].value,
      unieditgroup: string = this.form.controls["unieditgroup"].value,
      unideletegroup: string = this.form.controls["unideletegroup"].value,
      // Units Generator Model Managment
      univiewgmm: string = this.form.controls["univiewgmm"].value,
      unicreategmm: string = this.form.controls["unicreategmm"].value,
      unieditgmm: string = this.form.controls["unieditgmm"].value,
      unideletegmm: string = this.form.controls["unideletegmm"].value,

      // Units Generator Model Managment
      viewreports: string = this.form.controls["viewreports"].value,
      createreports: string = this.form.controls["createreports"].value,
      editreports: string = this.form.controls["editreports"].value,
      deletereports: string = this.form.controls["deletereports"].value,

      // Message Inbox
      msgviewinbox: string = this.form.controls["msgviewinbox"].value,
      msgcreateinbox: string = this.form.controls["msgcreateinbox"].value,
      msgeditinbox: string = this.form.controls["msgeditinbox"].value,
      msgdeleteinbox: string = this.form.controls["msgdeleteinbox"].value,
      // Message Sent
      msgviewsent: string = this.form.controls["msgviewsent"].value,
      msgcreatesent: string = this.form.controls["msgcreatesent"].value,
      msgeditsent: string = this.form.controls["msgeditsent"].value,
      msgdeletesent: string = this.form.controls["msgdeletesent"].value,


      // Settings My Account
      setviewmyacc: string = this.form.controls["setviewmyacc"].value,
      setcreatemyacc: string = this.form.controls["setcreatemyacc"].value,
      seteditmyacc: string = this.form.controls["seteditmyacc"].value,
      setdeletemyacc: string = this.form.controls["setdeletemyacc"].value,
      // Settings User List
      setviewuselst: string = this.form.controls["setviewuselst"].value,
      setcreateuselst: string = this.form.controls["setcreateuselst"].value,
      setedituselst: string = this.form.controls["setedituselst"].value,
      setdeleteuselst: string = this.form.controls["setdeleteuselst"].value,
      // Settings User Group
      setviewusegru: string = this.form.controls["setviewusegru"].value,
      setcreateusegru: string = this.form.controls["setcreateusegru"].value,
      seteditusegru: string = this.form.controls["seteditusegru"].value,
      setdeleteusegru: string = this.form.controls["setdeleteusegru"].value,
      // Settings User Role
      setviewuserle: string = this.form.controls["setviewuserle"].value,
      setcreateuserle: string = this.form.controls["setcreateuserle"].value,
      setedituserle: string = this.form.controls["setedituserle"].value,
      setdeleteuserle: string = this.form.controls["setdeleteuserle"].value,
      // Settings Report Template
      setviewtmp: string = this.form.controls["setviewtmp"].value,
      setcreatetmp: string = this.form.controls["setcreatetmp"].value,
      setedittmp: string = this.form.controls["setedittmp"].value,
      setdeletetmp: string = this.form.controls["setdeletetmp"].value,
      // Settings Org Chart
      setvieworg: string = this.form.controls["setvieworg"].value,
      setcreateorg: string = this.form.controls["setcreateorg"].value,
      seteditorg: string = this.form.controls["seteditorg"].value,
      setdeleteorg: string = this.form.controls["setdeleteorg"].value
      ;
    this.roleperMissionData.push({
      "module_1": {
        "page_8": {
          "action_1": dashboardviewmap,
          "action_2": dashboardcreatemap,
          "action_3": dashboardeditmap,
          "action_4": dashboarddeletemap,
          "action_5": dashboardhidemap
        },
        "page_12": {
          "action_1": dashboardviewunits,
          "action_2": dashboardcreateunits,
          "action_3": dashboardeditunits,
          "action_4": dashboarddeleteunits,
          "action_5": dashboardhideunits
        }
      },
      "module_2": {
        // Calendar Events
        "page_7": {
          "action_1": calviewevents,
          "action_2": calcreateevents,
          "action_3": caleditevents,
          "action_4": caldeleteevents
        },

        // Calendar Services
        "page_18": {
          "action_1": calviewservices,
          "action_2": calcreateservices,
          "action_3": caleditservices,
          "action_4": caldeleteservices
        },
        // Calendar Alarm
        "page_19": {
          "action_1": calviewalarm,
          "action_2": calcreatealarm,
          "action_3": caleditalarm,
          "action_4": caldeletealarm
        }
      },
      "module_3": {
        // Units Unit List
        "page_9": {
          "action_1": univiewlist,
          "action_2": unicreatelist,
          "action_3": unieditlist,
          "action_4": unideletelist
        },
        // Units Alaram
        "page_13": {
          "action_1": univiewalarm,
          "action_2": unicreatealarm,
          "action_3": unieditalarm,
          "action_4": unideletealarm
        },
        // Units Services Info
        "page_14": {
          "action_1": univiewservices,
          "action_2": unicreateservices,
          "action_3": unieditservices,
          "action_4": unideleteservices
        },
        // Units Comments
        "page_15": {
          "action_1": univiewcomm,
          "action_2": unicreatecomm,
          "action_3": unieditcomm,
          "action_4": unideletecomm
        },
        // Units Unit Group
        "page_16": {
          "action_1": univiewgroup,
          "action_2": unicreategroup,
          "action_3": unieditgroup,
          "action_4": unideletegroup
        },
        // Units Generator Model Managment
        "page_20": {
          "action_1": univiewgmm,
          "action_2": unicreategmm,
          "action_3": unieditgmm,
          "action_4": unideletegmm
        }
      },
      "module_4": {
        "page_10": {
          "action_1": viewreports,
          "action_2": createreports,
          "action_3": editreports,
          "action_4": deletereports
        }
      },
      "module_5": {
        // Message Inbox
        "page_11": {
          "action_1": msgviewinbox,
          "action_2": msgcreateinbox,
          "action_3": msgeditinbox,
          "action_4": msgdeleteinbox
        },
        // Message Sent
        "page_17": {
          "action_1": msgviewsent,
          "action_2": msgcreatesent,
          "action_3": msgeditsent,
          "action_4": msgdeletesent
        }
      },
      "module_6": {
        // Settings My Account
        "page_1": {
          "action_1": setviewmyacc,
          "action_2": setcreatemyacc,
          "action_3": seteditmyacc,
          "action_4": setdeletemyacc
        },
        // Settings User List
        "page_2": {
          "action_1": setviewuselst,
          "action_2": setcreateuselst,
          "action_3": setedituselst,
          "action_4": setdeleteuselst
        },
        // Settings User Group
        "page_3": {
          "action_1": setviewusegru,
          "action_2": setcreateusegru,
          "action_3": seteditusegru,
          "action_4": setdeleteusegru
        },
        // Settings User Role
        "page_4": {
          "action_1": setviewuserle,
          "action_2": setcreateuserle,
          "action_3": setedituserle,
          "action_4": setdeleteuserle
        },
        // Settings Report Template
        "page_5": {
          "action_1": setviewtmp,
          "action_2": setcreatetmp,
          "action_3": setedittmp,
          "action_4": setdeletetmp
        },
        // Settings Org Chart
        "page_6": {
          "action_1": setvieworg,
          "action_2": setcreateorg,
          "action_3": seteditorg,
          "action_4": setdeleteorg
        }
      }
    });



    console.log("1" + this.roleperMissionData);
    console.log("2" + JSON.stringify(this.roleperMissionData));
    if (this.isEdited) {
      this.updateEntry(role_name, this.roleperMissionData, this.userId);
    }
    else {
      this.createEntry(role_name, this.roleperMissionData, this.userId);
    }
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.role_name = "";
  }



  // Manage notifying the user of the outcome
  // of remote operations
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
  previous() {
    this.navCtrl.setRoot(RolePage);
  }


  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
 

}


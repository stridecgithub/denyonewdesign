import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { UserPage } from '../user/user';
import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { RolePage } from '../role/role';
import 'rxjs/add/operator/map';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
//import { OrgchartPage } from '../orgchart/orgchart';
import { PopovercolorcodePage } from '../popovercolorcode/popovercolorcode';
import { PopoverchoosecolorPage } from '../popoverchoosecolor/popoverchoosecolor';
/**
 * Generated class for the AddunitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addunitgroup',
  templateUrl: 'addunitgroup.html',
})
export class AddunitgroupPage {
  public loginas: any;
  public companyid: any;
  public form: FormGroup;
  public cname: any;
  public isSubmitted: boolean = false;
  public remark: any;
  public ccode: any;
  public nccode: any;
  public userId: any;
  public responseResultCountry: any;
  public footerBar = [];
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
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  colorcode;
  constructor(public nav: NavController, public popoverCtrl: PopoverController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "cname": ["", Validators.required],
      "remark": ["", Validators.required]
    });

    this.userId = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
   // Footer Menu Access - Start
  let footeraccessstorage = localStorage.getItem("footermenu");
  let footeraccessparams = this.NP.get('footermenu');
  let footermenuacc;
  if (footeraccessparams != undefined) {
    footermenuacc = footeraccessparams;
  } else {
    footermenuacc = footeraccessstorage;
  }

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
    colorcode: "rgba(60, 60, 60, 0.7)",
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
    colorcode: "#488aff",
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

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad AddunitgroupPage');
  // }

  colorcodePopover() {
    let popover = this.popoverCtrl.create(PopovercolorcodePage, { item: '' });
    popover.present({
      ev: '',
    });
    popover.onWillDismiss(data => {
      console.log(JSON.stringify(data));

    });
  }
  ionViewDidLoad() {


    if (this.NP.get("record")) {
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit Unit Group';
      this.readOnly = false;
      this.hideActionButton = true;
    }
    else {
      this.resetFields();
      // document.getElementById("FBE983").classList.add("border-need");
      // console.log("Hi");
      //this.ccode = "FBE983";
      this.isEdited = false;
      this.pageTitle = 'Add Unit Group';
      this.colorcode = '9013fe';
      this.ccode = '9013fe';
    }
  }
  selectEntry(item) {
    this.cname = item.unitgroup_name;
    this.remark = item.remark;
    this.ccode = item.colorcode;
    this.colorcode = item.colorcode;
    this.nccode = this.ccode;
    // console.log(JSON.stringify(this.NP.get("record")));
    // if (this.ccode == "DAADFE") {
    //   document.getElementById("DAADFE").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "DAADFE";
    // }
    // if (this.ccode == "FBE983") {
    //   document.getElementById("FBE983").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "FBE983";
    // }
    // if (this.ccode == "5584EE") {
    //   document.getElementById("5584EE").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "5584EE";
    // }
    // if (this.ccode == "A4BDFD") {
    //   document.getElementById("A4BDFD").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "A4BDFD";
    // }
    // if (this.ccode == "47D6DC") {
    //   document.getElementById("47D6DC").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "47D6DC";
    // }
    // if (this.ccode == "7AE7BE") {
    //   document.getElementById("7AE7BE").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "7AE7BE";
    // }
    // if (this.ccode == "FBD75C") {
    //   document.getElementById("FBD75C").classList.add("border-need");
    //   this.ccode = "FBD75C";
    //   // console.log("Hi");
    // }
    // if (this.ccode == "FFB878") {
    //   document.getElementById("FFB878").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "FFB878";
    // }
    // if (this.ccode == "FF877C") {
    //   document.getElementById("FF877C").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "FF877C";
    // }
    // if (this.ccode == "DC2128") {
    //   document.getElementById("DC2128").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "DC2128";
    // }
    // if (this.ccode == "E1E1E1") {
    //   document.getElementById("E1E1E1").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "E1E1E1";
    // }
    // if (this.ccode == "51B749") {
    //   document.getElementById("51B749").classList.add("border-need");
    //   // console.log("Hi");
    //   this.ccode = "51B749";
    // }
    this.recordID = item.unitgroup_id;
  }
  saveEntry() {
    let cname: string = this.form.controls["cname"].value,
      remark: string = this.form.controls["remark"].value;
    console.log(cname, remark);
    if (cname.toLowerCase() == 'denyo' || cname.toLowerCase() == 'dum' || cname.toLowerCase() == 'dsg' || cname.toLowerCase() == 'denyo singapore') {
      this.sendNotification("Given Unit Group Name Not Acceptable....");
    }
    else {

      if (this.isEdited) {

        this.updateEntry(cname, this.ccode, remark, this.userId, this.companyid);
      }
      else {
        this.createEntry(cname, this.ccode, remark, this.userId, this.companyid);
      }
    }

  }
  updateEntry(cname, ccode, remark, userid, companyid) {
    console.log(cname, ccode, remark, userid, companyid);
    this.isSubmitted = true;
    let body: string = "is_mobile=1&unitgroup_name=" + cname + "&colorcode=" + this.ccode + "&remark=" + remark + "&createdby=" + userid + "&updatedby=" + userid + "&company_id=" + companyid + "&unitgroup_id=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroup/update";
    console.log(url);
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();
        console.log(data.json());
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            this.sendNotification(res.msg[0].result);
            return false;
          } else {
            this.sendNotification(res.msg[0].result);
            this.nav.setRoot(UnitgroupPage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }
  createEntry(cname, ccode, remark, createdby, companyid) {
    this.isSubmitted = true;
    // this.isUploadedProcessing = true;
    let updatedby = createdby;
    console.log(cname, ccode, remark, companyid);
    let body: string = "is_mobile=1&unitgroup_name=" + cname + "&colorcode=" + ccode + "&remark=" + remark + "&createdby=" + createdby + "&updatedby=" + updatedby + "&company_id=" + companyid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroup/store";
    this.http.post(url, body, options)
      .subscribe((data) => {
        let res = data.json();
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            console.log('1');
            this.sendNotification(res.msg[0].result);
            return false;
          } else {
            console.log('2');
            this.sendNotification(res.msg[0].result);
            this.nav.setRoot(UnitgroupPage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.cname = "";
    this.remark = "";

  }
  sendNotification(message): void {
    // this.isUploadedProcessing = false;
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }


  getColor(colorCodeValue) {
    document.getElementById('FBE983').classList.remove("border-need");
    document.getElementById('5584EE').classList.remove("border-need");
    document.getElementById('A4BDFD').classList.remove("border-need");
    document.getElementById('47D6DC').classList.remove("border-need");
    document.getElementById('7AE7BE').classList.remove("border-need");
    document.getElementById('51B749').classList.remove("border-need");
    document.getElementById('FBD75C').classList.remove("border-need");
    document.getElementById('FFB878').classList.remove("border-need");
    document.getElementById('FF877C').classList.remove("border-need");
    document.getElementById('DC2128').classList.remove("border-need");
    document.getElementById('DAADFE').classList.remove("border-need");
    document.getElementById('E1E1E1').classList.remove("border-need");
    document.getElementById(colorCodeValue).classList.add("border-need");

    //if (this.isEdited == true) {
    // if (this.ccode != colorCodeValue) {
    //   console.log(this.ccode);
    //   document.getElementById(this.ccode).classList.remove("border-need");
    // }
    // }



    console.log(colorCodeValue);
    this.ccode = colorCodeValue;
  }




  chooseColor() {
    /* Vinoth i have commented some line for error. pleae before code push without incomplete
    let confirm = this.alertCtrl.create({
      title: 'Select Color',
      message: 'Please note that additional charges may apply, if requesting for Denyo Service Support.',
      buttons: [
	  {
          text: 'Select',
          handler: () => {
            this.is_request = true;
            console.log('Confirm clicked');
          }
        }
        
      ],
      cssClass: 'alertDanger adhoc-alert'
    });
    confirm.present();*/
  }




  previous() {
    this.nav.setRoot(UnitgroupPage);
  }

  notification() {
    this.nav.setRoot(NotificationPage);
  }


  openPopover(myEvent,colorcode) {
    let popover = this.popoverCtrl.create(PopoverchoosecolorPage, {'colorcode':colorcode}, { cssClass: 'contact-popover' });
    popover.present({
      ev: myEvent
    });
    popover.onWillDismiss(data => {
      console.log(JSON.stringify(data));
      if (data != null) {
        console.log(data);
        this.colorcode = data
        this.ccode = data;
        if (data.length == 1) {
          // this.doDelete(data);
        } else {
          // this.doEdit(data, 'edit');
        }
      }
    });
  }



}




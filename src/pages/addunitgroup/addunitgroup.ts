import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, PopoverController, Platform, App } from 'ionic-angular';
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
import { Config } from '../../config/config';
//declare var jQuery: any;
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

  footerBar: number = 1;
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
  colorcode;
  constructor(public app: App, private conf: Config, public nav: NavController, public popoverCtrl: PopoverController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController, public platform: Platform) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.nav.setRoot(UnitgroupPage);
      });
    });

    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "cname": ["", Validators.required],
      "remark": ["", Validators.required]
    });

    this.userId = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");

  }

  colorcodePopover() {
    let popover = this.popoverCtrl.create(PopovercolorcodePage, { item: '' });
    popover.present({
      ev: '',
    });
    popover.onWillDismiss(data => {
     

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
      this.resetFields()
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
    this.recordID = item.unitgroup_id;
  }
  saveEntry() {
    let cname: string = this.form.controls["cname"].value,
      remark: string = this.form.controls["remark"].value;
    
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
    
    this.isSubmitted = true;
    let body: string = "is_mobile=1&unitgroup_name=" + cname + "&colorcode=" + this.ccode + "&remark=" + remark + "&createdby=" + userid + "&updatedby=" + userid + "&company_id=" + companyid + "&unitgroup_id=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroup/update";
    
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();
        
        // If the request was successful notify the user
        if (data.status === 200) {
        
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
    
    let body: string = "is_mobile=1&unitgroup_name=" + cname + "&colorcode=" + ccode + "&remark=" + remark + "&createdby=" + createdby + "&updatedby=" + updatedby + "&company_id=" + companyid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroup/store";
    this.http.post(url, body, options)
      .subscribe((data) => {
        let res = data.json();
        
        // If the request was successful notify the user
        if (data.status === 200) {
          
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

    



    
    this.ccode = colorCodeValue;
  }




  chooseColor() {
   
  }




  previous() {
    this.nav.setRoot(UnitgroupPage);
  }

  notification() {
    this.nav.setRoot(NotificationPage);
  }


  openPopover(myEvent, colorcode) {
    let popover = this.popoverCtrl.create(PopoverchoosecolorPage, { 'colorcode': colorcode }, { cssClass: 'contact-popover' });
    popover.present({
      ev: myEvent
    });
    popover.onWillDismiss(data => {
    
      if (data != null) {
       
        this.colorcode = data
        this.ccode = data;
        
      }
    });
  }



}




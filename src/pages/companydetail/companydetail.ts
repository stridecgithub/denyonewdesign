import { Component } from '@angular/core';
import {  NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddcompanygroupPage } from '../addcompanygroup/addcompanygroup';
import { LoadingController } from 'ionic-angular';
//import { UserPage } from '../user/user';
import { NotificationPage } from '../notification/notification';

import { CompanygroupPage } from '../companygroup/companygroup';
/**
 * Generated class for the Companydetail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-companydetail',
  templateUrl: 'companydetail.html',
})
export class CompanydetailPage {
   public footerBar = [];
   public pageTitle: string;
  public loginas: any;
  public Role;
  public totalunit;
    public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public loadingMoreDataContent:string;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  public totalCount;
   public companyId:any;
  pet: string = "ALL";
  public sortby = 2;
  public vendorsort = "asc";
  public ascending = true;
   public msgcount:any;
  public notcount:any;
  public name:any;
  public contact:any;
  public address:any;
  public totaluser:any;
  public reportData: any =
  {
    status: '',
    sort: 'companygroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public reportAllLists = [];
  public reportAllLists1 = [];
  

    constructor(public http: Http, public nav: NavController,public NP: NavParams,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    
    this.loadingMoreDataContent='Loading More Data';
    this.loginas = localStorage.getItem("userInfoName");
     this.companyId = localStorage.getItem("userInfoCompanyId");
      this.Role = localStorage.getItem("userInfoRoleId");
  // Footer Menu Access - Start
  let footeraccessstorage = localStorage.getItem("footermenu");
  let footeraccessparams = this.navParams.get('footermenu');
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
    console.log('ionViewDidLoad Companydetail');
  }
ionViewWillEnter() {
  let comid=this.NP.get("record");
   let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/companydetails/" + comid.companygroup_id;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.companydetails.length);
        console.log("2" + res.companydetails);
        if (res.companydetails.length > 0) {
          this.name = res.companydetails[0].companygroup_name;
          console.log("2" + this.name);
           this.address =res.companydetails[0].address;
          this.contact = res.companydetails[0].contact;
         
          this.totaluser = res.companydetails[0].totaluser;
          this.totalunit = res.companydetails[0].totalunit;
       
            this.reportAllLists=  res.users;
            this.reportAllLists1=  res.unitdetail;
             

          
         
         
        }
        // [{ "userid": "1", "userdetailsid": "1", "username": "denyov2", "password": "e3b81d385ca4c26109dfbda28c563e2b", "firstname": "Super Admin", "lastname": "Denyo", "email": "balamurugan@webneo.in", "contact_number": "9597645985", "country_id": "99", "photo": "1496647262537.jpg", "job_position": "Country Manager", "report_to": "0", "company_id": "1", "companygroup_name": "Denyo" }]



      });
}
edit()
{
let comid=this.NP.get("record");
 this.nav.setRoot(AddcompanygroupPage, {
        record:comid
      
      });
}
delete()
{
  let comid=this.NP.get("record");
 if(comid.totalunits == 0 || comid.totalusers == 0)
    {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this company group?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(comid.companygroup_id);
        
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
  
  
    confirm.present();
  }
  else
  {
    {
    let confirm = this.alertCtrl.create({
      message: 'There are some user and units under this Company Group.If delete Company Group,all users and units will be deleted.Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(comid.companygroup_id);
       
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
  
  
    confirm.present();
    }
  }
}
 deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/companygroup/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {


this.sendNotification(`Congratulations the company group name was successfully deleted`);
this.nav.setRoot(CompanygroupPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }
 sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
 previous() {
    this.nav.setRoot(CompanygroupPage);
  }
  notification() {
    this.nav.setRoot(NotificationPage);
  }
 
}

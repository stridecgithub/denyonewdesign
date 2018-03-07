import { Component } from '@angular/core';
import {  NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddcompanygroupPage } from '../addcompanygroup/addcompanygroup';
import { LoadingController } from 'ionic-angular';
import { MyaccountPage } from '../myaccount/myaccount';
import { NotificationPage } from '../notification/notification';
import { CompanydetailPage } from '../companydetail/companydetail';

import { Config } from '../../config/config';
/**
 * Generated class for the CompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-companygroup',
  templateUrl: 'companygroup.html',
  providers: [Config]
})
export class CompanygroupPage {
  public footerBar = [];
  public pageTitle: string;
  public loginas: any;
  public Role;
   
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public loadingMoreDataContent:string;
  private apiServiceURL: string = "";
  public totalCount;
   public companyId:any;
  pet: string = "ALL";  
  public sortby = 2;
  public vendorsort = "asc";
  public ascending = true;
   public msgcount:any;
  public notcount:any;
  public sortLblTxt: string = 'Group Name';
  public reportData: any =
  {
    status: '',
    sort: 'companygroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 50
  }
  public companygroupAllLists = [];
  profilePhoto;
  constructor(public http: Http, private conf: Config, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Company Group';
    this.loadingMoreDataContent='Loading More Data';
    this.loginas = localStorage.getItem("userInfoName");
     this.companyId = localStorage.getItem("userInfoCompanyId");
      this.Role = localStorage.getItem("userInfoRoleId");
     
    this.CREATEACCESS = localStorage.getItem("SETTINGS_COMPANYGROUP_CREATE");   
    this.EDITACCESS = localStorage.getItem("SETTINGS_COMPANYGROUP_EDIT");    
    this.DELETEACCESS = localStorage.getItem("SETTINGS_COMPANYGROUP_DELETE");   
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if(this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL +"/images/default.png";
    } else {
     this.profilePhoto = this.apiServiceURL +"/staffphotos/" + this.profilePhoto;
    }

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
    console.log('ionViewDidLoad CompanygroupPage');
  }

  /*******************/
  /* Pull to Refresh */
  /*******************/
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.companygroupAllLists = [];
    this.doCompanyGroup();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  /****************************/
  /*@doCompanyGroup calling on report */
  /****************************/
  doCompanyGroup() {
    this.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "companygroup_name";
    }
    //http://denyoappv2.stridecdev.com/companygroup?is_mobile=1
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/companygroup?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc+"&companyid="+this.companyId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.companygroups.length);
        console.log("2" + res.companygroups);
        if (res.companygroups.length > 0) {
          this.companygroupAllLists = res.companygroups;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
          this.loadingMoreDataContent='Loading More Data';
        } else {
          this.totalCount = 0;
          this.loadingMoreDataContent='No More Data';
        }
        console.log("Total Record:" + this.totalCount);

      });
    this.presentLoading(0);
  }


  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.companygroupAllLists = [];
    this.doCompanyGroup();
  }
  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doCompanyGroup();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  ionViewWillEnter() {
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
    console.log(url);
   // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
       this.msgcount=data.json().msgcount;
        this.notcount=data.json().notifycount;
      });
    this.reportData.startindex = 0;
    this.reportData.sort = "companygroup_name";
    this.doCompanyGroup();
  }

  doAdd() {
    this.nav.setRoot(AddcompanygroupPage);
  }
  detail(item)
  {
     this.nav.setRoot(CompanydetailPage, {
       record: item       
      });
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.nav.setRoot(AddcompanygroupPage, {
        record: item,
        act: act
      });
    } 
  }




  /******************************************/
  /* @doConfirm called for alert dialog box **/
  /******************************************/
  doConfirm(id, item) {
    console.log("Deleted Id" + id);
    if(item.totalunits == 0 || item.totalusers == 0)
    {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this company group?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.companygroupAllLists.length; q++) {
            if (this.companygroupAllLists[q] == item) {
              this.companygroupAllLists.splice(q, 1);
            }
          }
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
          this.deleteEntry(id);
          for (let q: number = 0; q < this.companygroupAllLists.length; q++) {
            if (this.companygroupAllLists[q] == item) {
              this.companygroupAllLists.splice(q, 1);
            }
          }
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

  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
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

          this.sendNotification(`Company group name was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
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


  /********************/
  /* Sorting function */
  /********************/
  // doSort(val) {
  //   console.log('1');
  //   this.companygroupAllLists = [];
  //   this.reportData.startindex = 0;
  //   console.log('2');
  //   this.sortby = 1;
  //   if (this.vendorsort == "asc") {
  //     this.reportData.sortascdesc = "desc";
  //     this.vendorsort = "desc";
  //     this.ascending = false;
  //     console.log('3');
  //   }
  //   else {
  //     console.log('4');
  //     this.reportData.sortascdesc = "asc";
  //     this.vendorsort = "asc";
  //     this.ascending = true;
  //   }
  //   console.log('5');
  //   this.reportData.sort = val;
  //   this.doCompanyGroup();
  //   console.log('6');
  // }

  presentLoading(parm) {
    let loader;
    loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    if (parm > 0) {
      loader.present();
    } else {
      loader.dismiss();
    }
  }

 
  previous() {
    this.nav.setRoot(MyaccountPage);
  }
  notification() {
    this.nav.setRoot(NotificationPage);
  }
  doSort() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        
        {
          type: 'radio',
          label: 'Group Name',
          value: 'companygroup_name',
        },
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            console.log(data);
            console.log('Asc clicked');
            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'asc';
             if (data == 'companygroup_name') {
                this.sortLblTxt = 'Group Name';
              }
              this.reportData.startindex = 0;
              this.companygroupAllLists = [];
              this.doCompanyGroup();
            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            console.log(data);
            if (data != undefined) {
              console.log('Desc clicked');
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'desc';
             if (data == 'companygroup_name') {
                this.sortLblTxt = 'Group Name';
              }
              this.reportData.startindex = 0;
              this.companygroupAllLists = [];
              this.doCompanyGroup();
            }
          }
        }
      ]
    });
    prompt.present();
  }
}

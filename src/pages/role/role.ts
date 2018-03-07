import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddrolePage } from '../addrole/addrole';
import { LoadingController } from 'ionic-angular';
//import { UserPage } from '../user/user';
import { MyaccountPage } from '../myaccount/myaccount';
//import { DashboardPage } from '../dashboard/dashboard';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { UnitsPage } from '../units/units';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
//import { OrgchartPage } from '../orgchart/orgchart';
import { Config } from '../../config/config';
/**
 * Generated class for the AddrolePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
  providers: [Config]
})
export class RolePage {
  public footerBar  = [];
  public pageTitle: string;
  public loginas: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  private apiServiceURL: string = "";
  public totalCount;
  pet: string = "ALL";
  public sortby = 2;
  public vendorsort = "asc";
  public ascending = true;
  public reportData: any =
    {
      status: '',
      sort: 'asc',
      sortascdesc: '',
      startindex: 0,
      results: 8
    }
  public roleAllLists = [];
  profilePhoto;
  constructor(public http: Http, private conf: Config,
    public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Roles';
    this.loginas = localStorage.getItem("userInfoName");
    
    this.CREATEACCESS = localStorage.getItem("SETTINGS_USERROLE_CREATE");
    this.EDITACCESS = localStorage.getItem("SETTINGS_USERROLE_EDIT");
    this.DELETEACCESS = localStorage.getItem("SETTINGS_USERROLE_DELETE");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
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
    console.log('ionViewDidLoad RolePage');

    this.reportData.startindex = 0;
    this.reportData.sort = "createdon";

    this.doRole();

  }

  /*******************/
  /* Pull to Refresh */
  /*******************/
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.roleAllLists = [];
    this.doRole();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  /****************************/
  /*@doRole calling on report */
  /****************************/
  doRole() {
    this.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    //console.log("key=run&startIndex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&statusName=" + this.reportData.status + "&pagination=true");
    let //body: string = "key=run&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&statusName=" + this.reportData.status + "&pagination=true",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/role?is_mobile=1&role_name=" + this.reportData.sort;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        if (res.roles.length > 0) {
          this.roleAllLists = res.roles;
          // this.totalCount = res[0].totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          //this.totalCount = 0;
        }


      });
    this.presentLoading(0);
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
      this.doRole();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }


  doAdd() {
    this.nav.setRoot(AddrolePage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.nav.setRoot(AddrolePage, {
        record: item,
        act: act
      });
    }
  }

  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[1];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.roleAllLists = [];
    this.doRole();
  }


  /******************************************/
  /* @doConfirm called for alert dialog box **/
  /******************************************/
  doConfirm(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this role?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.roleAllLists.length; q++) {
            if (this.roleAllLists[q] == item) {
              this.roleAllLists.splice(q, 1);
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

  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry(recordID) {
    let
      // body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/role/" + recordID + "/1/delete";
    console.log(url);

    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.sendNotification(`role name was successfully deleted`);
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
  doSort(val) {
    console.log('1');
    this.roleAllLists = [];
    this.reportData.startindex = 0;
    console.log('2');
    this.sortby = 1;
    if (this.vendorsort == "asc") {
      this.reportData.sortascdesc = "desc";
      this.vendorsort = "desc";
      this.ascending = false;
      console.log('3');
    }
    else {
      console.log('4');
      this.reportData.sortascdesc = "asc";
      this.vendorsort = "asc";
      this.ascending = true;
    }
    console.log('5');
    this.reportData.sort = val;
    this.doRole();
    console.log('6');
  }

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
  notification() {
    this.nav.setRoot(NotificationPage);
  }
  previous() {
    this.nav.setRoot(MyaccountPage);
  }

}


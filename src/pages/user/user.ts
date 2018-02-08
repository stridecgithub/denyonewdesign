import { Component } from '@angular/core';
import {  NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AdduserPage } from '../adduser/adduser';
import { ViewcompanygroupPage } from '../viewcompanygroup/viewcompanygroup';
import { LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { CompanygroupPage } from '../companygroup/companygroup';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { RolePage } from '../role/role';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { OrgchartPage} from '../orgchart/orgchart';
import { Config } from '../../config/config';

/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [Config]
})

export class UserPage {
  public loginas: any;
  public pageTitle: string;
  private apiServiceURL: string = "";
  public totalCount;
  pet: string = "ALL";
   private permissionMessage: string = "Permission denied for access this page. Please contact your administrator";
   public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public sortby = 2;
  public vendorsort = "asc";
  public ascending = true;
  public companyId:any;
  public msgcount:any;
  public notcount:any;
  profilePhoto;
  public sortLblTxt: string = 'Name';
  public reportData: any =
  {
    status: '',
    
    sort: 'firstname',
    sortascdesc: 'asc',
    startindex: 0,
    results: 50
  }
  public userAllLists = [];
  constructor(public http: Http, private conf: Config, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Users';
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.loginas = localStorage.getItem("userInfoName");
    this.VIEWACCESS = localStorage.getItem("SETTINGS_USERLIST_VIEW");
    console.log("Role Authority for Unit Listing View:"+this.VIEWACCESS );
    this.CREATEACCESS = localStorage.getItem("SETTINGS_USERLIST_CREATE");
    console.log("Role Authority for Unit Listing Create:"+this.CREATEACCESS );
    this.EDITACCESS = localStorage.getItem("SETTINGS_USERLIST_EDIT");
    console.log("Role Authority for Unit Listing Edit:"+this.EDITACCESS )
    this.DELETEACCESS = localStorage.getItem("SETTINGS_USERLIST_DELETE");
    console.log("Role Authority for Unit Listing Delete:"+this.DELETEACCESS )

    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
  }

  /*******************/
  /* Pull to Refresh */
  /*******************/
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.userAllLists = [];
    this.doUser();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  /****************************/
  /*@doUser calling on report */
  /****************************/
  doUser() {
    this.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/staff?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc+"&companyid="+this.companyId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.staff.length);
        console.log("2" + res.staff);
        if (res.staff.length > 0) {
          this.userAllLists = res.staff;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        console.log("Total Record:" + this.totalCount);

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
      this.doUser();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }

  

  ionViewDidLoad() {
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
    this.reportData.sort = "staff_id";
    this.doUser();
   
  }

  doAdd() {
    this.nav.setRoot(AdduserPage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.nav.setRoot(AdduserPage, {
        record: item,
        act: act
      });
    } else {
      this.nav.setRoot(ViewcompanygroupPage, {
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
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this user?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.userAllLists.length; q++) {
            if (this.userAllLists[q] == item) {
              this.userAllLists.splice(q, 1);
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
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/staff/" + recordID + "/1/delete";

    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.sendNotification(`User was successfully deleted`);
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



  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.userAllLists = [];
    this.doUser();
  }

  /********************/
  /* Sorting function */
  /********************/
  // doSort(val) {
  //   console.log('1');
  //   this.userAllLists = [];
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
  //   this.doUser();
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
          label: 'Name',
          value: 'firstname',
        },{
          type: 'radio',
          label: 'Group',
          value: 'companygroup_name'
        }
       ,
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
                this.sortLblTxt = 'Group';
              } else if (data == 'firstname') {
                this.sortLblTxt = 'Name';
              }
              this.reportData.startindex = 0;
              this.userAllLists = [];
              this.doUser();
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
                this.sortLblTxt = 'Group';
              } else if (data == 'firstname') {
                this.sortLblTxt = 'Name';
              }
              this.reportData.startindex = 0;
              this.userAllLists = [];
              this.doUser();
            }
          }
        }
      ]
    });
    prompt.present();
  }
}

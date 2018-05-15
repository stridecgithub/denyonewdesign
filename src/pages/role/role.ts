import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddrolePage } from '../addrole/addrole';
import { LoadingController } from 'ionic-angular';
//import { UserPage } from '../user/user';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { DashboardPage } from '../dashboard/dashboard';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { UnitsPage } from '../units/units';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
//import { OrgchartPage } from '../orgchart/orgchart';
import { Config } from '../../config/config';
import { DashboardPage } from '../dashboard/dashboard';
import { PermissionPage } from '../../pages/permission/permission';
import { MockProvider } from '../../providers/pagination/pagination';
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
  public footerBar = [];
  public pageTitle: string;
  public loginas: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public VIEWACCESS: any;
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
      results: 200000
    }
  public roleAllLists = [];
  profilePhoto;
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  constructor(private mockProvider: MockProvider, public app: App, public platform: Platform, public http: Http, private conf: Config,
    public navCtrl: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Roles';
    this.isInfiniteHide = true;
    this.loginas = localStorage.getItem("userInfoName");
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage);
      });
    });
    this.CREATEACCESS = localStorage.getItem("SETTINGS_USERROLE_CREATE");
    this.EDITACCESS = localStorage.getItem("SETTINGS_USERROLE_EDIT");
    this.DELETEACCESS = localStorage.getItem("SETTINGS_USERROLE_DELETE");
    this.VIEWACCESS = localStorage.getItem("SETTINGS_USERROLE_VIEW");
    if (this.VIEWACCESS == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
    }
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }


  }

  ionViewDidLoad() {

    this.reportData.startindex = 0;
    this.reportData.sort = "createdon";

    this.doRole();

  }

  /*******************/
  /* Pull to Refresh */
  /*******************/
  doRefresh(refresher) {
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
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/role?is_mobile=1&sort=" + this.reportData.sort;
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        if (res.roles.length > 0) {
          this.roleAllLists = res.roles;
          this.items = this.mockProvider.getData(this.roleAllLists, 0, this.pageperrecord);
          // this.totalCount = res[0].totalCount;
          this.reportData.startindex += this.reportData.results;
          this.totalCount = res.roles.length;
        } else {
          this.totalCount = 0;
        }


      });
    this.presentLoading(0);
  }




  doAdd() {
    this.navCtrl.setRoot(AddrolePage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.navCtrl.setRoot(AddrolePage, {
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

          this.reportData.startindex = 0;
          this.roleAllLists = [];
          this.doRole();
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
    this.isInfiniteHide = true;
    let
      // body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/role/" + recordID + "/1/delete";


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
    this.roleAllLists = [];
    this.reportData.startindex = 0;
    this.sortby = 1;
    if (this.vendorsort == "asc") {
      this.reportData.sortascdesc = "desc";
      this.vendorsort = "desc";
      this.ascending = false;
    }
    else {
      this.reportData.sortascdesc = "asc";
      this.vendorsort = "asc";
      this.ascending = true;
    }
    this.reportData.sort = val;
    this.doRole();
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
    this.navCtrl.setRoot(NotificationPage);
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.roleAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }
      infiniteScroll.complete();
      if (this.items.length >= this.totalCount) {
        this.isInfiniteHide = false
      }
    });
  }
}


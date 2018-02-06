import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddrolePage } from '../addrole/addrole';
import { LoadingController } from 'ionic-angular';
import { UserPage } from '../user/user';
import { MyaccountPage } from '../myaccount/myaccount';
import { DashboardPage } from '../dashboard/dashboard';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { UnitsPage } from '../units/units';
import { CompanygroupPage } from '../companygroup/companygroup';
import { NotificationPage } from '../notification/notification';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { OrgchartPage} from '../orgchart/orgchart';
/**
 * Generated class for the AddrolePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
})
export class RolePage {
  public pageTitle: string;
  public loginas: any;
  private permissionMessage: string = "Permission denied for access this page. Please contact your administrator";
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com/";
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
  public reportAllLists = [];
  constructor(public http: Http, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Roles';
    this.loginas = localStorage.getItem("userInfoName");
    this.VIEWACCESS = localStorage.getItem("SETTINGS_USERROLE_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("SETTINGS_USERROLE_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);
    this.EDITACCESS = localStorage.getItem("SETTINGS_USERROLE_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS);
    this.DELETEACCESS = localStorage.getItem("SETTINGS_USERROLE_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolePage');
  }

  /*******************/
  /* Pull to Refresh */
  /*******************/
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
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
      url: any = this.apiServiceURL + "role?is_mobile=1&role_name=" + this.reportData.sort;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        if (res.roles.length > 0) {
          this.reportAllLists = res.roles;
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
  ionViewWillEnter() {
    this.reportData.startindex = 0;
    this.reportData.sort = "createdon";
    if (this.VIEWACCESS > 0) {
      this.doRole();
    }
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
    this.reportAllLists = [];
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
          for (let q: number = 0; q < this.reportAllLists.length; q++) {
            if (this.reportAllLists[q] == item) {
              this.reportAllLists.splice(q, 1);
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
      url: any = this.apiServiceURL + "role/" + recordID + "/1/delete";
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
    this.reportAllLists = [];
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


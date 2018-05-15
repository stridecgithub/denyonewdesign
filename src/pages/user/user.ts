import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AdduserPage } from '../adduser/adduser';
import { LoadingController } from 'ionic-angular';
//import { MyaccountPage } from '../myaccount/myaccount';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
import { DashboardPage } from '../dashboard/dashboard';
import { PermissionPage } from '../../pages/permission/permission';
import { MockProvider } from '../../providers/pagination/pagination';
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
  footerBar: number = 0;
  public loginas: any;
  public pageTitle: string;
  private apiServiceURL: string = "";
  public totalCount;
  pet: string = "ALL";
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public VIEWACCESS: any;
  public sortby = 2;
  public vendorsort = "asc";
  public ascending = true;
  public companyId: any;
  public msgcount: any;
  public notcount: any;
  profilePhoto;
  public sortLblTxt: string = 'Name';
  public reportData: any =
    {
      status: '',

      sort: 'user_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 200000
    }
  public userAllLists = [];
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  constructor(private mockProvider: MockProvider, public app: App, public platform: Platform, public http: Http, private conf: Config, public navCtrl: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Users';
    this.isInfiniteHide = true;
    this.companyId = localStorage.getItem("userInfoCompanyId");
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
    this.CREATEACCESS = localStorage.getItem("SETTINGS_USERLIST_CREATE");
    this.EDITACCESS = localStorage.getItem("SETTINGS_USERLIST_EDIT");
    this.DELETEACCESS = localStorage.getItem("SETTINGS_USERLIST_DELETE");

    this.VIEWACCESS = localStorage.getItem("SETTINGS_USERLIST_VIEW");
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

  /*******************/
  /* Pull to Refresh */
  /*******************/
  doRefresh(refresher) {
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
      url: any = this.apiServiceURL + "/staff?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&companyid=" + this.companyId;
    let res;

    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        if (res.staff.length > 0) {
          this.userAllLists = res.staff;
          this.items = this.mockProvider.getData(this.userAllLists, 0, this.pageperrecord);
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }

      });
    this.presentLoading(0);
  }

  /**********************/
  /* Infinite scrolling */
  /**********************/
  /*doInfinite(infiniteScroll) {
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {

      this.doUser();
    }

    setTimeout(() => {

      infiniteScroll.complete();
    }, 500);

  }*/



  ionViewDidLoad() {
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");



    this.http.get(url, options)
      .subscribe((data) => {

        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });


    this.reportData.startindex = 0;
    this.reportData.sort = "staff_id";
    this.doUser();

  }

  doAdd() {
    localStorage.setItem("photofromgallery", "");
    this.navCtrl.setRoot(AdduserPage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      localStorage.setItem("photofromgallery", "");
      this.navCtrl.setRoot(AdduserPage, {
        record: item,
        act: act
      });
    }
  }




  /******************************************/
  /* @doConfirm called for alert dialog box **/
  /******************************************/
  doConfirm(id, item) {

    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this user?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.items.length; q++) {
            if (this.items[q] == item) {
              this.items.splice(q, 1);
            }
          }

          this.reportData.startindex = 0;
          this.userAllLists = [];
          this.doUser();
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
    this.navCtrl.setRoot(DashboardPage);
  }
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  doSort() {
    this.isInfiniteHide = true;
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Name',
          value: 'firstname',
        }, {
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

            if (data != undefined) {

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

  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.userAllLists, this.items.length, this.pageperrecord).then((newData) => {
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

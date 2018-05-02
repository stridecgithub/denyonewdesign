import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddcompanygroupPage } from '../addcompanygroup/addcompanygroup';
import { LoadingController } from 'ionic-angular';
//import { MyaccountPage } from '../myaccount/myaccount';
import { NotificationPage } from '../notification/notification';
import { CompanydetailPage } from '../companydetail/companydetail';
import { PermissionPage } from '../../pages/permission/permission';
import { Config } from '../../config/config';
import { DashboardPage } from '../dashboard/dashboard';
import { MockProvider } from '../../providers/pagination/pagination';
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
  footerBar: number = 0;
  public pageTitle: string;
  public loginas: any;
  public Role;

  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public VIEWACCESS: any;
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  public totalCount;
  public companyId: any;
  pet: string = "ALL";
  public sortby = 2;
  public vendorsort = "asc";
  public ascending = true;
  public msgcount: any;
  public notcount: any;
  public sortLblTxt: string = 'Group Name';
  public reportData: any =
    {
      status: '',
      sort: 'companygroup_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 200000
    }
  public companygroupAllLists = [];
  profilePhoto;
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  loadingmoretext;
  constructor(private mockProvider: MockProvider, private app: App, public platform: Platform, public http: Http, private conf: Config, public navCtrl: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Company Group';
    this.isInfiniteHide = true;
    this.pageperrecord = this.conf.pagePerRecord();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage);
      });
    });


    this.loadingMoreDataContent = 'Loading More Data';
    this.loginas = localStorage.getItem("userInfoName");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.Role = localStorage.getItem("userInfoRoleId");

    this.CREATEACCESS = localStorage.getItem("SETTINGS_COMPANYGROUP_CREATE");
    this.EDITACCESS = localStorage.getItem("SETTINGS_COMPANYGROUP_EDIT");
    this.DELETEACCESS = localStorage.getItem("SETTINGS_COMPANYGROUP_DELETE");
    this.VIEWACCESS = localStorage.getItem("SETTINGS_COMPANYGROUP_VIEW");
    if (this.VIEWACCESS == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
    }
    this.apiServiceURL = this.conf.apiBaseURL();
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

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/companygroup?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&companyid=" + this.companyId;
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        if (res.companygroups.length > 0) {
          this.companygroupAllLists = res.companygroups;
          this.items = this.mockProvider.getData(this.companygroupAllLists, 0, this.pageperrecord);
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
          this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCount = 0;
          this.loadingMoreDataContent = 'No More Data';
        }

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

  ionViewWillEnter() {
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
    this.reportData.sort = "companygroup_name";
    this.doCompanyGroup();
  }

  doAdd() {
    this.navCtrl.setRoot(AddcompanygroupPage);
  }
  detail(item) {
    this.navCtrl.setRoot(CompanydetailPage, {
      record: item
    });
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.navCtrl.setRoot(AddcompanygroupPage, {
        record: item,
        act: act
      });
    }
  }




  /******************************************/
  /* @doConfirm called for alert dialog box **/
  /******************************************/
  doConfirm(id, item) {

    if (item.totalunits == 0 || item.totalusers == 0) {
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
    else {
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
  doSort() {
    this.isInfiniteHide = true;
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

            if (data != undefined) {

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

  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.companygroupAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }
      infiniteScroll.complete();     
      if (this.items.length >= this.totalCount) {
        this.isInfiniteHide = false
        this.loadingmoretext = 'No more data.';
      } else {
        this.loadingmoretext = 'Loading more data...';
      }
    });
  }


}

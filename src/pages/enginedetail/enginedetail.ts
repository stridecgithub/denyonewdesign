import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { AddenginedetailPage } from '../addenginedetail/addenginedetail';
import { EngineviewPage } from '../engineview/engineview';

import { NotificationPage } from '../notification/notification';


import { DashboardPage } from '../dashboard/dashboard';
import { Config } from '../../config/config';
import { PermissionPage } from '../../pages/permission/permission';

import { MockProvider } from '../../providers/pagination/pagination';
/**
 * Generated class for the EnginedetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-enginedetail',
  templateUrl: 'enginedetail.html'
})
export class EnginedetailPage {
  public pageTitle: string;
  footerBar: number = 1;
  public loginas: any;
  private apiServiceURL: string = "";
  public totalCount;
  public msgcount: any;
  public notcount: any;
  pet: string = "ALL";
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public VIEWACCESS: any;
  public reportData: any =
    {
      status: '',
      sort: 'model_id',
      sortascdesc: 'desc',
    }

  public enginedetailAllLists = [];
  public colorListArr: any;
  public userId: any;
  public companyId;
  public profilePhoto;
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  constructor(private mockProvider: MockProvider, private app: App, public platform: Platform, public http: Http, private conf: Config, public navCtrl: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public NP: NavParams, public loadingCtrl: LoadingController) {
    this.isInfiniteHide = true;
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage);
      });
    });

    this.apiServiceURL = this.conf.apiBaseURL();
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();
    //this.pageperrecord = 6;
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }


  }

  ionViewDidLoad() {
   
    this.CREATEACCESS = localStorage.getItem("UNITS_ENGINEMODEL_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_ENGINEMODEL_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_ENGINEMODEL_DELETE");

    this.VIEWACCESS = localStorage.getItem("UNITS_ENGINEMODEL_VIEW");
    if (this.VIEWACCESS == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
    }
     this.doengine();
  }
  ionViewWillEnter() {
    this.CREATEACCESS = localStorage.getItem("UNITS_ENGINEMODEL_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_ENGINEMODEL_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_ENGINEMODEL_DELETE");
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;



    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });


    this.doengine();
  }
  doengine() {
    this.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "unitgroup_id";
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/enginemodel?is_mobile=1";
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();      
        if (res.modeldata.length > 0) {
          this.enginedetailAllLists = res.modeldata;
          this.items = this.mockProvider.getData(this.enginedetailAllLists, 0, this.pageperrecord);
          this.totalCount = res.totalCount;
        } else {
          this.totalCount = 0;
        }

      });
    this.presentLoading(0);
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
  doAdd() {
    this.navCtrl.setRoot(AddenginedetailPage);
  }
  // doInfinite(infiniteScroll) {

  //   if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {

  //     this.doengine();
  //   }

  //   setTimeout(() => {

  //     infiniteScroll.complete();
  //   }, 500);

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
  doConfirm(id, item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this generator model?',
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
          this.enginedetailAllLists = [];
          this.doengine();

        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }
  deleteEntry(recordID) {
    this.isInfiniteHide = true;
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/enginemodel/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.sendNotification(`Engine Model deleted successfully`);
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
  doEdit(item, act) {
    if (act == 'edit') {
      this.navCtrl.setRoot(AddenginedetailPage, {
        record: item,
        act: act
      });
    }
  }
  doView(item, act) {
    if (act == 'detail') {
      this.navCtrl.setRoot(EngineviewPage, {
        record: item
      });
      return false;
    }
  }

  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.enginedetailAllLists, this.items.length, this.pageperrecord).then((newData) => {
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

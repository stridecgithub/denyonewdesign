import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddreporttemplatePage } from '../addreporttemplate/addreporttemplate';
import { LoadingController } from 'ionic-angular';
//import { MyaccountPage } from '../myaccount/myaccount';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
import { ReporttemplatedetailPage } from '../reporttemplatedetail/reporttemplatedetail';
import { DashboardPage } from '../dashboard/dashboard';
import { PermissionPage } from '../../pages/permission/permission';
import { MockProvider } from '../../providers/pagination/pagination';
//import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the UnitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-reporttemplate',
  templateUrl: 'reporttemplate.html'
})
export class ReporttemplatePage {
  public pageTitle: string;
  public loginas: any;
  public userId: any;
  private apiServiceURL: string = "";
  public templatenamehash;
  public templatenamecomm;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public VIEWACCESS: any;
  public totalCount;
  public reporttemplate;
  public msgcount: any;
  public notcount: any;
  footerBar: number = 0;
  pet: string = "ALL";
  companyId;

  public reportData: any =
    {
      status: '',
      sort: 'unitgroup_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 200000
    }
  public reporttemplateAllLists = [];
  profilePhoto;
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  loadingmoretext;
  constructor(private mockProvider: MockProvider, public app: App, public platform: Platform, public http: Http, private conf: Config, public navCtrl: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.isInfiniteHide = true;
    this.loadingmoretext = "Loading more data...";
    this.companyId = localStorage.getItem("userInfoCompanyId");
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

    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.CREATEACCESS = localStorage.getItem("SETTINGS_REPORTTEMPLATE_CREATE");
    this.EDITACCESS = localStorage.getItem("SETTINGS_REPORTTEMPLATE_EDIT");
    this.DELETEACCESS = localStorage.getItem("SETTINGS_REPORTTEMPLATE_DELETE");
    this.VIEWACCESS = localStorage.getItem("SETTINGS_REPORTTEMPLATE_VIEW");
    if (this.VIEWACCESS == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
    }
    this.pageTitle = 'Report Template';
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }


  }



  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.reporttemplateAllLists = [];
    this.doReportReportTemplate();
  }

  ionViewDidLoad() {

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

    this.doReportReportTemplate();

  }

  doRefresh(refresher) {

    this.reportData.startindex = 0;
    this.reporttemplateAllLists = [];
    this.doReportReportTemplate();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doReportReportTemplate() {
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
      // url: any = this.apiServiceURL + "/reporttemplate?is_mobile=1";
      url: any = this.apiServiceURL + "/reporttemplate?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&companyid=" + this.companyId;
    let res;

    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        if (res.availabletemp.length > 0) {
          for (let availabletemps in res.availabletemp) {
            this.reporttemplateAllLists.push({
              id: res.availabletemp[availabletemps].id,
              templatename: res.availabletemp[availabletemps].templatename,
              availableheading: res.availabletemp[availabletemps].availableheading.split("#")
            });
          }
          this.totalCount = res.availabletemp.length;
          this.reportData.startindex += this.reportData.results;
          this.items = this.mockProvider.getData(this.reporttemplateAllLists, 0, this.pageperrecord);
        } else {
          this.totalCount = 0;
        }
      });
    this.presentLoading(0);
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
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
  doAdd(availableheading) {
    this.navCtrl.setRoot(AddreporttemplatePage, {
      availableheading: availableheading
    });
  }
  doConfirm(id, item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this report template?',
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
          this.reporttemplateAllLists = [];
          this.doReportReportTemplate();
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
      url: any = this.apiServiceURL + "/reporttemplate/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.sendNotification(`Report Template was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }
  doEdit(item, act, availableheading) {
    if (act == 'edit') {
      this.navCtrl.setRoot(AddreporttemplatePage, {
        record: item,
        act: act,
        availableheading: availableheading
      });
    }
  }


  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }

  reportdetail(templatename, templatedata) {
    this.navCtrl.setRoot(ReporttemplatedetailPage, { templatename: templatename, templatedata: templatedata });
  }

  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.reporttemplateAllLists, this.items.length, this.pageperrecord).then((newData) => {
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


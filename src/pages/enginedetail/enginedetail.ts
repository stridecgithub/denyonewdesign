import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { AddenginedetailPage } from '../addenginedetail/addenginedetail';
import { EngineviewPage } from '../engineview/engineview';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { OrgchartPage } from '../orgchart/orgchart';
import { DashboardPage } from '../dashboard/dashboard';
import { Config } from '../../config/config';
/**
 * Generated class for the EnginedetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-enginedetail',
  templateUrl: 'enginedetail.html',
  providers: [Config]
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
  public reportData: any =
    {
      status: '',
      sort: 'unitgroup_id',
      sortascdesc: 'asc',
      startindex: 0,
      results: 8
    }

  public enginedetailAllLists = [];
  public colorListArr: any;
  public userId: any;
  public companyId;
  public profilePhoto;
  constructor(public http: Http, private conf: Config, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public NP: NavParams, public loadingCtrl: LoadingController) {
    this.apiServiceURL = conf.apiBaseURL();
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if(this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL +"/images/default.png";
    } else {
     this.profilePhoto = this.apiServiceURL +"/staffphotos/" + this.profilePhoto;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnginedetailPage');
  }
  ionViewWillEnter() {

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });

    this.reportData.startindex = 0;
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
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));

        if (res.modeldata.length > 0) {

          for (let modeldatas in res.modeldata) {


            this.enginedetailAllLists.push({
              model: res.modeldata[modeldatas].model,
              rawhtml: res.modeldata[modeldatas].rawhtml,
              model_id: res.modeldata[modeldatas].model_id



            });
          }
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        console.log("Total Record:2" + this.totalCount);

      });
    this.presentLoading(0);
  }
  previous() {
    this.nav.setRoot(DashboardPage);
  }
  doAdd() {
    this.nav.setRoot(AddenginedetailPage);
  }
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doengine();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
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
  doConfirm(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this generator model?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.enginedetailAllLists.length; q++) {
            if (this.enginedetailAllLists[q] == item) {
              this.enginedetailAllLists.splice(q, 1);
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
  deleteEntry(recordID) {
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
      this.nav.setRoot(AddenginedetailPage, {
        record: item,
        act: act
      });
    }
  }
  doView(item, act) {
    if (act == 'detail') {
      this.nav.setRoot(EngineviewPage, {
        record: item
      });
      return false;
    }
  }

  notification() {
    this.nav.setRoot(NotificationPage);
  }

}

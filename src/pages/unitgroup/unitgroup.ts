import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddunitgroupPage } from '../addunitgroup/addunitgroup';
import { LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
//import { UserPage } from '../user/user';
//import { CompanygroupPage } from '../companygroup/companygroup';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitsPage } from '../units/units';
//import { RolePage } from '../role/role';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
import { Unitgrouplist } from '../unitgrouplist/unitgrouplist';
//import { OrgchartPage } from '../orgchart/orgchart';
import { Config } from '../../config/config';
import { PermissionPage } from '../../pages/permission/permission';
import { MockProvider } from '../../providers/pagination/pagination';
//declare var jQuery: any;
/**
 * Generated class for the UnitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-unitgroup',
  templateUrl: 'unitgroup.html',
  providers: [Config]
})
export class UnitgroupPage {
  footerBar: number = 1;
  public pageTitle: string;
  public loginas: any;
  public msgcount: any;
  public notcount: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public VIEWACCESS: any;
  private apiServiceURL: string = "";
  public totalCount;
  pet: string = "ALL";
  public sortLblTxt: string = 'Date';
  public reportData: any =
    {
      status: '',
      sort: 'unitgroup_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 200000
    }
  public unitgroupAllLists = [];
  public colorListArr: any;
  public userId: any;
  public companyId;
  public profilePhoto;
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  loadingmoretext;
  constructor(private mockProvider: MockProvider, public app: App, public platform: Platform, public http: Http, private conf: Config, public navCtrl: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.isInfiniteHide = true;
    this.pageperrecord = this.conf.pagePerRecord();
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage);
      });
    });
  }


  doRefresh(refresher) {
    this.reportData.startindex = 0;
    this.unitgroupAllLists = [];
    this.dounitGroup();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }



  ionViewDidLoad() {
    this.CREATEACCESS = localStorage.getItem("UNITS_UNITGROUP_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_UNITGROUP_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_UNITGROUP_DELETE");
    this.VIEWACCESS = localStorage.getItem("UNITS_UNITGROUP_VIEW");
    if (this.VIEWACCESS == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
    }
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;



    this.http.get(url, options)
      .subscribe((data) => {

        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    this.pageTitle = "Unit Group";
    this.reportData.startindex = 0;
    this.reportData.sort = "unitgroup_id";

    this.dounitGroup();
  }
  dounitGroup() {
    this.colorListArr = [
      "FBE983",
      "5584EE",
      "A4BDFD",
      "47D6DC",
      "7AE7BE",
      "51B749",
      "FBD75C",
      "FFB878",
      "FF877C",
      "DC2128",
      "DAADFE",
      "E1E1E1"
    ];

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
      url: any = this.apiServiceURL + "/unitgroup?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId;
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        this.presentLoading(0);
        res = data.json();
        if (res.unitgroups.length > 0) {

          for (let unitgroup in res.unitgroups) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.unitgroups[unitgroup].colorcode); // 1

            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;

            if (res.unitgroups[unitgroup].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }

            let cname = res.unitgroups[unitgroup].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }


            this.unitgroupAllLists.push({
              unitgroup_id: res.unitgroups[unitgroup].unitgroup_id,
              unitgroup_name: res.unitgroups[unitgroup].unitgroup_name,
              remark: res.unitgroups[unitgroup].remark,
              favorite: res.unitgroups[unitgroup].favorite,
              totalunits: res.unitgroups[unitgroup].totalunits,
              colorcode: res.unitgroups[unitgroup].colorcode,
              colorcodeindication: colorcode,
              favoriteindication: favorite,
              cname: cname,
              createdOn: res.unitgroups[unitgroup].createdOn,
            });

            this.items = this.mockProvider.getData(this.unitgroupAllLists, 0, this.pageperrecord);
          }

          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }


      });

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
  doAdd() {
    this.navCtrl.setRoot(AddunitgroupPage);
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.navCtrl.setRoot(AddunitgroupPage, {
        record: item,
        act: act
      });
    }
  }
  doConfirm(id, item) {
    if (item.totalunits == 0) {

      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this unit group?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            this.deleteEntry(id);
            for (let q: number = 0; q < this.unitgroupAllLists.length; q++) {
              if (this.unitgroupAllLists[q] == item) {
                this.unitgroupAllLists.splice(q, 1);
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

      let confirm = this.alertCtrl.create({
        message: 'There are some units under this Unit Group.If delete this Unit Group,all units will be deleted.Are you sure you want to delete this unit group?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            this.deleteEntry(id);
            for (let q: number = 0; q < this.unitgroupAllLists.length; q++) {
              if (this.unitgroupAllLists[q] == item) {
                this.unitgroupAllLists.splice(q, 1);
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
  deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroup/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.sendNotification(`unit group was successfully deleted`);
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
  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.unitgroupAllLists = [];
    this.dounitGroup();
  }

  favorite(unit_id) {
    this.reportData.startindex = 0;
    this.unitgroupAllLists = [];
    let body: string = "unitgroupid=" + unit_id +
      "&staffs_id=" + this.userId +
      "&is_mobile=1" + "&company_id=" + this.companyId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitgroupfavorite";
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();
        if (data.status === 200) {
          this.sendNotification(res.msg[0].result);
          this.dounitGroup();
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }



      });

  }

  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  view(id, colorcode, cname, favoriteindication, unitgroup_name, totalunits, remark, createdOn) {
    //  localStorage.setItem("uid", id);
    this.navCtrl.setRoot(Unitgrouplist, { unitid: id, 'colorcode': colorcode, 'cname': cname, 'favoriteindication': favoriteindication, 'unitgroup_name': unitgroup_name, 'totalunits': totalunits, 'remark': remark, 'createdOn': createdOn });
  }

  doSort() {
    this.isInfiniteHide = true;
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [

        {
          type: 'radio',
          label: 'Date',
          value: 'date'
        },

        {
          type: 'radio',
          label: 'Favourites',
          value: 'favorite'
        },
        {
          type: 'radio',
          label: 'Unit Group',
          value: 'unitgroup_name',
        },
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {

            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'asc';
              if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup_name') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'date') {
                this.sortLblTxt = 'Date';
              }
              this.reportData.startindex = 0;
              this.unitgroupAllLists = [];
              this.dounitGroup();
            }
          }
        },
        {
          text: 'Desc',
          handler: data => {

            if (data != undefined) {

              this.reportData.sort = data;
              this.reportData.sortascdesc = 'desc';
              if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup_name') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'date') {
                this.sortLblTxt = 'Date';
              }
              this.reportData.startindex = 0;
              this.unitgroupAllLists = [];
              this.dounitGroup();
            }
          }
        }
      ]
    });
    prompt.present();
  }
  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.unitgroupAllLists, this.items.length, this.pageperrecord).then((newData) => {
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

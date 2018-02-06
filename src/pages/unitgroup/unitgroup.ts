import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddunitgroupPage } from '../addunitgroup/addunitgroup';
import { LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { UserPage } from '../user/user';
import { CompanygroupPage } from '../companygroup/companygroup';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { RolePage } from '../role/role';
import { NotificationPage } from '../notification/notification';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { Unitgrouplist } from '../unitgrouplist/unitgrouplist';
import { OrgchartPage } from '../orgchart/orgchart';
/**
 * Generated class for the UnitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-unitgroup',
  templateUrl: 'unitgroup.html',
})
export class UnitgroupPage {

  public pageTitle: string;
  public loginas: any;
  public msgcount: any;
  public notcount: any;
  private permissionMessage: string = "Permission denied for access this page. Please contact your administrator";
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  public totalCount;
  pet: string = "ALL";  
  public sortLblTxt: string = 'Unitgroup Group';
  public reportData: any =
    {
      status: '',
      sort: 'unitgroup_id',
      sortascdesc: 'asc',
      startindex: 0,
      results: 50
    }
  public reportAllLists = [];
  public colorListArr: any;
  public userId: any;
  public companyId;
  constructor(public http: Http, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.VIEWACCESS = localStorage.getItem("UNITS_UNITGROUP_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("UNITS_UNITGROUP_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);
    this.EDITACCESS = localStorage.getItem("UNITS_UNITGROUP_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS);
    this.DELETEACCESS = localStorage.getItem("UNITS_UNITGROUP_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
  }


  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.dounitGroup();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitgroupPage');
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
    this.pageTitle = "Unit Groups";
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
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.unitgroups.length);
        console.log("2" + res.unitgroups);
        console.log("3" + res.colorcode);
        if (res.favorite == 0) {

        }
        if (res.unitgroups.length > 0) {

          for (let unitgroup in res.unitgroups) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.unitgroups[unitgroup].colorcode); // 1
            console.log("Color Index:" + index);
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
            console.log("Color is" + colorcode);
            if (res.unitgroups[unitgroup].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }
            console.log(favorite);
            this.reportAllLists.push({
              unitgroup_id: res.unitgroups[unitgroup].unitgroup_id,
              unitgroup_name: res.unitgroups[unitgroup].unitgroup_name,
              remark: res.unitgroups[unitgroup].remark,
              favorite: res.unitgroups[unitgroup].favorite,
              totalunits: res.unitgroups[unitgroup].totalunits,
              colorcode: res.unitgroups[unitgroup].colorcode,
              colorcodeindication: colorcode,
              favoriteindication: favorite
            });
          }
          //"unitgroup_id":1,"unitgroup_name":"demo unit","colorcode":"FBD75C","remark":"nice","favorite":1,"totalunits":5
          /*this.reportAllLists = res.unitgroups;
         
          console.log("Total Record:`" + this.totalCount);
          console.log(JSON.stringify(this.reportAllLists));*/
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        console.log("Total Record:2" + this.totalCount);

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
      this.dounitGroup();
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
  doAdd() {
    this.nav.setRoot(AddunitgroupPage);
  }
  previous() {
    this.nav.setRoot(DashboardPage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.nav.setRoot(AddunitgroupPage, {
        record: item,
        act: act
      });
    }
  }
  doConfirm(id, item) {
    if (item.totalunits == 0) {
      console.log("Deleted Id" + id);
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this unit group?',
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
    else {
      console.log("Deleted Id" + id);
      let confirm = this.alertCtrl.create({
        message: 'There are some units under this Unit Group.If delete this Unit Group,all units will be deleted.Are you sure you want to delete this unit group?',
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
    this.reportAllLists = [];
    this.dounitGroup();
  }

  favorite(unit_id) {
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    let body: string = "unitgroupid=" + unit_id +
      "&staffs_id=" + this.userId +
      "&is_mobile=1" + "&company_id=" + this.companyId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitgroupfavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        let res = data.json();
        console.log(res.msg[0].Error);
        console.log(res.msg[0].result);
        if (res.msg[0] == 0) {
          console.log("Favorite");
        } else {
          console.log("Un Favorite");
        }

        if (res.unitgroups.length > 0) {

          for (let unitgroup in res.unitgroups) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.unitgroups[unitgroup].colorcode); // 1
            console.log("Color Index:" + index);
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
            console.log("Color is" + colorcode);
            if (res.unitgroups[unitgroup].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }
            console.log(favorite);
            this.reportAllLists.push({
              unitgroup_id: res.unitgroups[unitgroup].unitgroup_id,
              unitgroup_name: res.unitgroups[unitgroup].unitgroup_name,
              remark: res.unitgroups[unitgroup].remark,
              favorite: res.unitgroups[unitgroup].favorite,
              totalunits: res.unitgroups[unitgroup].totalunits,
              colorcode: res.unitgroups[unitgroup].colorcode,
              colorcodeindication: colorcode,
              favoriteindication: favorite
            });
          }
          //"unitgroup_id":1,"unitgroup_name":"demo unit","colorcode":"FBD75C","remark":"nice","favorite":1,"totalunits":5
          /*this.reportAllLists = res.unitgroups;
         
          console.log("Total Record:`" + this.totalCount);
          console.log(JSON.stringify(this.reportAllLists));*/
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }

        // If the request was successful notify the user
        if (data.status === 200) {
          this.sendNotification(res.msg[0].result);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
    //this.dounitGroup();
  }

  notification() {
    this.nav.setRoot(NotificationPage);
  }
  view(id) {
    localStorage.setItem("uid", id);
    this.nav.setRoot(Unitgrouplist);
  }
}

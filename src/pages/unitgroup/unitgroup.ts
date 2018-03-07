import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddunitgroupPage } from '../addunitgroup/addunitgroup';
import { LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
//import { UserPage } from '../user/user';
import { CompanygroupPage } from '../companygroup/companygroup';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitsPage } from '../units/units';
//import { RolePage } from '../role/role';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
//import { CalendarPage } from '../calendar/calendar';
import { Unitgrouplist } from '../unitgrouplist/unitgrouplist';
//import { OrgchartPage } from '../orgchart/orgchart';
import { Config } from '../../config/config';
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
  public footerBar = [];
  public pageTitle: string;
  public loginas: any;
  public msgcount: any;
  public notcount: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  private apiServiceURL: string = "";
  public totalCount;
  pet: string = "ALL";
  public sortLblTxt: string = 'Date';
  public reportData: any =
    {
      status: '',
      sort: 'date',
      sortascdesc: 'desc',
      startindex: 0,
      results: 50
    }
  public unitgroupAllLists = [];
  public colorListArr: any;
  public userId: any;
  public companyId;
  public profilePhoto;
  //tabBarElement: any;
  constructor(public http: Http, private conf: Config, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.apiServiceURL = conf.apiBaseURL();
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


    // Footer Menu Access - Start
    let footeraccessstorage = localStorage.getItem("footermenu");
    let footeraccessparams = this.navParams.get('footermenu');
    let footermenuacc;
    if (footeraccessparams != undefined) {
      footermenuacc = footeraccessparams;
    } else {
      footermenuacc = footeraccessstorage;
    }

    let footermenusplitcomma = footermenuacc.split(",");
    let dashboardAccess = footermenusplitcomma[0];
    let unitAccess = footermenusplitcomma[1];
    let calendarAccess = footermenusplitcomma[2];
    let messageAccess = footermenusplitcomma[3];
    let orgchartAccess = footermenusplitcomma[4];


    let dashboarddisplay;
    if (dashboardAccess == 1) {
      dashboarddisplay = '';
    } else {
      dashboarddisplay = 'none';
    }
    this.footerBar.push({
      title: 'Dashboard',
      active: true,
      colorcode: "rgba(60, 60, 60, 0.7)",
      footerdisplay: dashboarddisplay,
      pageComponent: 'DashboardPage'
    });
    let unitdisplay;
    if (unitAccess == 1) {
      unitdisplay = '';
    } else {
      unitdisplay = 'none';
    }
    this.footerBar.push({
      title: 'Units',
      active: false,
      colorcode: "#488aff",
      footerdisplay: unitdisplay,
      pageComponent: 'UnitsPage'
    });
    let calendardisplay;
    if (calendarAccess == 1) {
      calendardisplay = '';
    } else {
      calendardisplay = 'none';
    }

    this.footerBar.push({
      title: 'Calendar',
      active: false,
      colorcode: "rgba(60, 60, 60, 0.7)",
      footerdisplay: calendardisplay,
      pageComponent: 'CalendarPage'
    });
    let messagedisplay;
    if (messageAccess == 1) {
      messagedisplay = '';
    } else {
      messagedisplay = 'none';
    }
    this.footerBar.push({
      title: 'Message',
      active: false,
      colorcode: "rgba(60, 60, 60, 0.7)",
      footerdisplay: messagedisplay,
      pageComponent: 'MessagePage'
    });
    let orgchartdisplay;
    if (orgchartAccess == 1) {
      orgchartdisplay = '';
    } else {
      orgchartdisplay = 'none';
    }
    this.footerBar.push({
      title: 'Org Chart',
      active: false,
      footerdisplay: orgchartdisplay,
      colorcode: "rgba(60, 60, 60, 0.7)",
      pageComponent: 'OrgchartPage'
    });
    //this.footerBar = "0";
    //let footerBar=this.footerBar.split(",");

    // Footer Menu Access - End
  }


  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.unitgroupAllLists = [];
    this.dounitGroup();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    this.CREATEACCESS = localStorage.getItem("UNITS_UNITGROUP_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_UNITGROUP_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_UNITGROUP_DELETE");
    //this.tabBarElement.style.display = 'none';
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
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.presentLoading(0);
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

            let cname = res.unitgroups[unitgroup].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }

            console.log(favorite);
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
          }
          //"unitgroup_id":1,"unitgroup_name":"demo unit","colorcode":"FBD75C","remark":"nice","favorite":1,"totalunits":5
          /*this.unitgroupAllLists = res.unitgroups;
         
          console.log("Total Record:`" + this.totalCount);
          console.log(JSON.stringify(this.unitgroupAllLists));*/
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        console.log("Total Record:2" + this.totalCount);

      });

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
      console.log("Deleted Id" + id);
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

            let cname = res.unitgroups[unitgroup].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }

            console.log(favorite);
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
          }
          //"unitgroup_id":1,"unitgroup_name":"demo unit","colorcode":"FBD75C","remark":"nice","favorite":1,"totalunits":5
          /*this.unitgroupAllLists = res.unitgroups;
         
          console.log("Total Record:`" + this.totalCount);
          console.log(JSON.stringify(this.unitgroupAllLists));*/
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

  }

  notification() {
    this.nav.setRoot(NotificationPage);
  }
  view(id, colorcode, cname, favoriteindication, unitgroup_name, totalunits, remark, createdOn) {
    //  localStorage.setItem("uid", id);
    this.nav.setRoot(Unitgrouplist, { unitid: id, 'colorcode': colorcode, 'cname': cname, 'favoriteindication': favoriteindication, 'unitgroup_name': unitgroup_name, 'totalunits': totalunits, 'remark': remark, 'createdOn': createdOn });
  }

  doSort() {
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
            console.log(data);
            console.log('Asc clicked');
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
            console.log(data);
            if (data != undefined) {
              console.log('Desc clicked');
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

}

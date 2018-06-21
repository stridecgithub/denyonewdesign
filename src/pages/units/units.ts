import { Component, } from '@angular/core';
import { NavController, NavParams, AlertController, Events, ModalController, Platform, App } from 'ionic-angular';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NotificationPage } from '../notification/notification';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { AddUnitPage } from "../add-unit/add-unit";
import { ModalPage } from '../modal/modal';
import { DashboardPage } from '../dashboard/dashboard';
import { PermissionPage } from '../../pages/permission/permission';
import { ViewunitPage } from '../viewunit/viewunit';
import { MockProvider } from '../../providers/pagination/pagination';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-units',
  templateUrl: 'units.html',
  providers: [Config]
})

export class UnitsPage {
  private subscription: Subscription;
  footerBar: number = 1;
  public alarms: string = "0";
  public warningcount: string = "0";
  public runningcount: string = "0";
  public offlinecount: string = "0";
  public tabs: string = 'listView';
  public unitsPopups: any;
  private apiServiceURL: string = '';
  public totalCount;
  public unitAllLists = [];
  public arrayid = [];
  public sortLblTxt: string = 'Favourites';
  testRadioOpen: boolean;
  testRadioResult;
  //tabBarElement: any;
  public reportData: any =
    {
      status: '',
      sort: 'unit_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 200000
    };

  public companyId: any;
  public userId: any;
  public msgcount: any;
  public notcount: any;
  public profilePhoto;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public VIEWACCESS: any;
  roleId;
  tabIndexVal;
  public selecteditems = [];
  selectallopenpop = 0;
  moreopenpop = 0;
  selectallopenorclose = 1;
  moreopenorclose = 1;
  items: any;
  isInfiniteHide: boolean;
  pageperrecord;
  timezoneoffset;
  constructor(private mockProvider: MockProvider, public app: App, public modalCtrl: ModalController, public platform: Platform, public alertCtrl: AlertController, public navCtrl: NavController, public NP: NavParams, public navParams: NavParams, private conf: Config, private http: Http, public events: Events) {
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();
    this.isInfiniteHide = true;
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    this.roleId = localStorage.getItem("userInfoRoleId");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabIndexVal = localStorage.getItem("tabIndex");
    this.CREATEACCESS = localStorage.getItem("UNITS_UNITSLISTING_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_UNITSLISTING_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_UNITSLISTING_DELETE");
    console.log("this.DELETEACCESS:" + this.DELETEACCESS);

    this.VIEWACCESS = localStorage.getItem("UNITS_UNITSLISTING_VIEW");
    if (this.VIEWACCESS == 0) {
      this.navCtrl.setRoot(PermissionPage, {});
    }


    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage, {
        });
      });
    });

  }
  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }

  }
  ionViewWillEnter() {

    localStorage.setItem("tabIndex", "1");
    this.tabIndexVal = localStorage.getItem("tabIndex");
    //this.tabBarElement.style.display = 'flex';
  }
  presentModal(unit) {
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
  ionViewDidLoad() {


    localStorage.setItem("setpointsdata", "");
    localStorage.setItem("tabIndex", "1");
    this.tabIndexVal = localStorage.getItem("tabIndex");

    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    if (this.userId == 'undefined') {
      this.userId = '';
    }
    if (this.userId == undefined) {
      this.userId = '';
    }
    if (this.userId == 'null') {
      this.userId = '';
    }
    if (this.userId == null) {
      this.userId = '';
    }
    if (this.userId != "") {
      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");
      this.doUnit();
      this.doNotifiyCount();
      // Initiate G Map

    } else {
      this.events.subscribe('user:created', (user, time) => {

        this.companyId = user.company_id;
        this.userId = user.staff_id
        this.doUnit();
        this.doNotifiyCount();
      });
    }
  }

  doNotifiyCount() {
    // Notification count
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
      });
    // Notiifcation count
  }


  /****************************/
  /*@doUnit calling on unit */

  /****************************/
  doUnit() {
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }

    let urlstr;


    //this.subscription = Observable.interval(2000).subscribe(x => {
      console.log('Unit List...');
      if (this.conf.isUTC() > 0) {
        urlstr = this.apiServiceURL + "/units?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId + "&loginid=" + this.userId + "&timezoneoffset=" + Math.abs(this.timezoneoffset);
      } else {
        urlstr = this.apiServiceURL + "/units?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId + "&loginid=" + this.userId;
      }
    //});

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = urlstr;


    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();

        if (res.units.length > 0) {

          for (let unit in res.units) {
            let cname = res.units[unit].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }


            let dur;
            console.log("Role ID:-" + this.roleId);
            if (this.roleId == 1) {
              dur = 0;
            } else {
              dur = res.units[unit].duration;
            }


            this.unitAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              contacts: res.units[unit].contacts,
              nextservicedate: res.units[unit].nextservicedate,
              controllerid: res.units[unit].controllerid,
              neaplateno: res.units[unit].neaplateno,
              serial_number: res.units[unit].serialnumber,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              genstatus: res.units[unit].genstatus,
              favoriteindication: res.units[unit].favorite,
              lat: res.units[unit].lat,
              lng: res.units[unit].lng,
              duration: dur,
              runninghr: res.units[unit].runninghr,
              companygroup_name: cname,
              viewonid: res.units[unit].viewonid,
              nextservicedate_mobileview: res.units[unit].nextservicedate_mobileview,
              duedatecolor: res.units[unit].duedatecolor,
              logo: "assets/imgs/square.png",
              active: ""
            });
            this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);
          }

          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }

      }, error => {
        this.conf.presentLoading(0);
      }, () => {
        this.conf.presentLoading(0);
      });

  }

  /******************************************/
  /* @doConfirm called for alert dialog box **/

  /******************************************/
  doConfirm(id, item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this unit?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.unitAllLists.length; q++) {
            if (this.unitAllLists[q] == item) {
              this.unitAllLists.splice(q, 1);
            }
          }
        }
      },
      {
        text: 'No',
        handler: () => {
        }
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
      // url: any = this.apiServiceURL + "/units/" + recordID + "/1/delete";
      url: any = this.apiServiceURL + "/unitlistaction?action=delete&unitid=" + recordID + "&is_mobile=1&loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          //this.conf.sendNotification(`Units was successfully deleted`);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.reportData.startindex = 0;
          this.unitAllLists = [];
          this.doUnit();
          this.selecteditems = [];

        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      });
  }

  // List page navigate to notification list
  notification() {

    this.navCtrl.setRoot(NotificationPage);
  }



  // Favorite Action

  favorite(unit_id) {
    this.isInfiniteHide = true;
    this.reportData.startindex = 0;
    this.unitAllLists = [];
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.userId + "&company_id=" + this.companyId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitfavorite";

console.log("Favorite Action Url:"+url+"?"+body);
    this.http.post(url, body, options)
      .subscribe(data => {
        //this.reportData.startindex = 0;
        // this.unitAllLists = [];
        //this.doUnit();
        let res = data.json();
        if (data.status === 200) {
          if (res.favorite == 0) {
            //this.conf.sendNotification("Unfavourited successfully");
            this.conf.sendNotification(data.json().msg['result']);
          } else {
            this.conf.sendNotification(data.json().msg['result']);
            //this.conf.sendNotification("Favourite successfully");
          }

          this.reportData.startindex = 0;
          this.unitAllLists = [];
          this.doUnit();

        }

/*

        if (res.units.length > 0) {
          for (let unit in res.units) {
            let cname = res.units[unit].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }
            this.unitAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              contacts: res.units[unit].contacts,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              nextservicedate: res.units[unit].nextservicedate,
              neaplateno: res.units[unit].neaplateno,
              serial_number: res.units[unit].serialnumber,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              favoriteindication: res.units[unit].favorite,
              genstatus: res.units[unit].genstatus,
              lat: res.units[unit].lat,
              duration: res.units[unit].duration,
              lng: res.units[unit].lng,
              runninghr: res.units[unit].runninghr,
              companygroup_name: cname,
              nextservicedate_mobileview: res.units[unit].nextservicedate_mobileview,
              duedatecolor: res.units[unit].duedatecolor,
              logo: "assets/imgs/square.png",
              active: ""
            });
          }
          this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
*/

      }, error => {
      });

    //this.doUnit();
  }

  doSort() {
    this.isInfiniteHide = true;
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Favourites',
          value: 'favorite'
        },
        {
          type: 'radio',
          label: 'Unit Name',
          value: 'unitname',
        },
        {
          type: 'radio',
          label: 'Unit Group',
          value: 'unitgroup',
        },
        {
          type: 'radio',
          label: 'Status',
          value: 'status',
        },
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'asc';
              if (data == 'unitname') {
                this.sortLblTxt = 'Unit Name';
              } else if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'status') {
                this.sortLblTxt = 'Status';
              }
              this.reportData.startindex = 0;
              this.unitAllLists = [];
              this.selecteditems = [];
              this.doUnit();
            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'desc';
              if (data == 'unitname') {
                this.sortLblTxt = 'Unit Name';
              } else if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'status') {
                this.sortLblTxt = 'Status';
              }
              this.reportData.startindex = 0;
              this.unitAllLists = [];
              this.selecteditems = [];
              this.doUnit();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  doAction(item, act, unitId) {
    this.isInfiniteHide = true;
    if (act == 'edit') {
      this.navCtrl.setRoot(AddUnitPage, {
        record: item,
        act: act,
        unitId: unitId
      });
      return false;
    } else if (act == 'detail') {

      localStorage.setItem("unitId", unitId);
      localStorage.setItem("iframeunitId", unitId);
      localStorage.setItem("unitunitname", item.unitname);
      localStorage.setItem("unitlocation", item.location);
      localStorage.setItem("unitprojectname", item.projectname);
      localStorage.setItem("unitcolorcode", item.colorcodeindications);
      if (item.lat == undefined) {
        item.lat = '';
      }
      if (item.lat == 'undefined') {
        item.lat = '';
      }

      if (item.lng == undefined) {
        item.lng = '';
      }
      if (item.lng == 'undefined') {
        item.lng = '';
      }



      if (item.runninghr == undefined) {
        item.runninghr = '';
      }
      if (item.runninghr == 'undefined') {
        item.runninghr = '';
      }

      if (item.nextservicedate == undefined) {
        item.nextservicedate = '';
      }
      if (item.nextservicedate == 'undefined') {
        item.nextservicedate = '';
      }


      localStorage.setItem("unitlat", item.lat);
      localStorage.setItem("unitlng", item.lng);
      localStorage.setItem("runninghr", item.runninghr);
      localStorage.setItem("nsd", item.nextservicedate);

      localStorage.setItem("microtime", "");






      this.navCtrl.setRoot(UnitdetailsPage, {
        record: item
      });


      return false;
    }

  }
  doAdd() {
    localStorage.setItem("location", '');
    localStorage.setItem("location", "");
    localStorage.setItem("unitgroups_id", '');
    localStorage.setItem("companys_id", '');
    localStorage.setItem("unitname", '');
    localStorage.setItem("projectname", '');
    localStorage.setItem("controllerid", '');
    localStorage.setItem("models_id", '');
    localStorage.setItem("neaplateno", '');
    this.navCtrl.setRoot(AddUnitPage);
  }
  viewondash(id) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to pin to dashboard?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.viewondashboard(id);
        }
      },
      {
        text: 'No',
        handler: () => {
        }
      }]
    });
    confirm.present();
  }
  viewondashboard(id) {
    this.isInfiniteHide = true;
    let urlstr = "/unitlistaction?action=dashboard&unitid=" + id + "&is_mobile=1&loginid=" + this.userId
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + urlstr;

    this.http.get(url, options)
      .subscribe((data) => {
        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`Dashboard view action successfully updated`);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.reportData.startindex = 0;
          this.unitAllLists = [];
          this.doUnit();
        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        // this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }


  pressed(item, index) {
    this.selecteditems = [];
    if (this.items[index]) {
      if (this.items[index].active == '') {
        this.items[index].active = 'active';
        this.items[index].logo = 'assets/imgs/tick_white_background.png';
      } else {
        this.items[index].active = '';
        this.items[index].logo = 'assets/imgs/tick_white_background.png';
      }
    }



    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].active == 'active') {

        let cname = this.items[i].unitgroup_name;

        if (cname != 'undefined' && cname != undefined) {
          let stringToSplit = cname;
          let x = stringToSplit.split("");
          cname = x[0].toUpperCase();
        } else {
          cname = '';
        }

        this.selecteditems.push({
          unit_id: this.items[i].unit_id,
          unitname: this.items[i].unitname,
          location: this.items[i].location,
          projectname: this.items[i].projectname,
          colorcode: this.items[i].colorcode,
          contacts: this.items[i].contacts,
          nextservicedate: this.items[i].nextservicedate,
          controllerid: this.items[i].controllerid,
          neaplateno: this.items[i].neaplateno,
          companys_id: this.items[i].companys_id,
          unitgroups_id: this.items[i].unitgroups_id,
          serial_number: this.items[i].serialnumber,
          models_id: this.items[i].models_id,
          alarmnotificationto: this.items[i].alarmnotificationto,
          genstatus: this.items[i].genstatus,
          favoriteindication: this.items[i].favorite,
          lat: this.items[i].latitude,
          lng: this.items[i].longtitude,
          runninghr: this.items[i].runninghr,
          companygroup_name: cname,
          viewonid: this.items[i].viewonid,
          duration: this.items[i].duration
        }
        );
      }
    }


  }

  resettoback(item) {
    this.unitAllLists = [];
    this.selectallopenpop = 0;
    this.moreopenpop = 0;
    this.selecteditems = [];
    for (let unit in item) {
      let dur;
      if (this.roleId == 1) {
        dur = 0;
      } else {
        dur = item[unit].duration;
      }
      this.unitAllLists.push({
        unit_id: item[unit].unit_id,
        unitname: item[unit].unitname,
        location: item[unit].location,
        projectname: item[unit].projectname,
        colorcode: item[unit].colorcode,
        contacts: item[unit].contacts,
        nextservicedate: item[unit].nextservicedate,
        controllerid: item[unit].controllerid,
        neaplateno: item[unit].neaplateno,
        serial_number: item[unit].serialnumber,
        companys_id: item[unit].companys_id,
        unitgroups_id: item[unit].unitgroups_id,
        models_id: item[unit].models_id,
        alarmnotificationto: item[unit].alarmnotificationto,
        genstatus: item[unit].genstatus,
        favoriteindication: item[unit].favoriteindication,
        lat: item[unit].lat,
        lng: item[unit].lng,
        duration: dur,
        runninghr: item[unit].runninghr,
        companygroup_name: item[unit].companygroup_name,
        viewonid: item[unit].viewonid,
        nextservicedate_mobileview: item[unit].nextservicedate_mobileview,
        duedatecolor: item[unit].duedatecolor,
        logo: "assets/imgs/square.png",
        active: ""
      });
    }
    this.items = this.mockProvider.getData(this.unitAllLists, 0, this.pageperrecord);
  }
  selectalltip(selectallopenorclose) {
    this.moreopenpop = 0;
    if (selectallopenorclose == 1) {
      this.selectallopenpop = 1;
      this.selectallopenorclose = 0;
      // this.close = 0;
    }
    if (selectallopenorclose == 0) {
      this.selectallopenpop = 0;
      this.selectallopenorclose = 1;
      //this.close = 1;
    }
  }
  moretip(moreopenorclose) {
    this.selectallopenpop = 0;
    if (moreopenorclose == 1) {
      this.moreopenpop = 1;
      this.moreopenorclose = 0;
      // this.close = 0;
    }
    if (moreopenorclose == 0) {
      this.moreopenpop = 0;
      this.moreopenorclose = 1;
      //this.close = 1;
    }
  }
  selectAll() {
    this.selecteditems = [];
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].active = 'active';
      this.items[i].logo = 'assets/imgs/tick_white_background.png';

      let cname = this.items[i].unitgroup_name;

      if (cname != 'undefined' && cname != undefined) {
        let stringToSplit = cname;
        let x = stringToSplit.split("");
        cname = x[0].toUpperCase();
      } else {
        cname = '';
      }

      this.selecteditems.push({
        unit_id: this.items[i].unit_id,
        unitname: this.items[i].unitname,
        location: this.items[i].location,
        projectname: this.items[i].projectname,
        colorcode: this.items[i].colorcode,
        contacts: this.items[i].contacts,
        nextservicedate: this.items[i].nextservicedate,
        controllerid: this.items[i].controllerid,
        neaplateno: this.items[i].neaplateno,
        companys_id: this.items[i].companys_id,
        unitgroups_id: this.items[i].unitgroups_id,
        serial_number: this.items[i].serialnumber,
        models_id: this.items[i].models_id,
        alarmnotificationto: this.items[i].alarmnotificationto,
        genstatus: this.items[i].genstatus,
        favoriteindication: this.items[i].favorite,
        lat: this.items[i].latitude,
        lng: this.items[i].longtitude,
        runninghr: this.items[i].runninghr,
        companygroup_name: cname,
        viewonid: this.items[i].viewonid,
        duration: this.items[i].duration
      }
      );

    }
  }
  released() {
  }
  onholdaction(action) {
    this.arrayid = [];
    /*console.log("Before Selection:-"+JSON.stringify(this.selecteditems));


    for (let i = 0; i < this.selecteditems.length; i++) {
      if (this.selecteditems[i].duration == 0) {
        this.arrayid.push(
          this.selecteditems[i].unit_id
        )
      }
    }

    console.log("After Selection:-"+JSON.stringify(this.arrayid));
    return false;*/

    this.isInfiniteHide = true;
    if (action == 'view') {
      //let modal = this.modalCtrl.create(ViewunitPage, { item: this.selecteditems });
      //modal.present();
      this.navCtrl.setRoot(ViewunitPage, { item: this.selecteditems, 'from': 'unit' });
      return false;
    }
    this.moreopenpop = 0;
    let str = '';

    if (action == 'favorite') {
      for (let i = 0; i < this.selecteditems.length; i++) {
        this.arrayid.push(
          this.selecteditems[i].unit_id
        )
      }
    } else if (action == 'delete') {
      for (let i = 0; i < this.selecteditems.length; i++) {
        if (this.selecteditems[i].duration == 0) {
          str = str + this.selecteditems[i].unit_id + ",";
        }
      }
    } else {
      for (let i = 0; i < this.selecteditems.length; i++) {
        str = str + this.selecteditems[i].unit_id + ",";
      }
    }
    str = str.replace(/,\s*$/, "");



    let urlstr;

    if (action == 'pin') {
      urlstr = "/onholdunitaction?unitid=" + str + "&action=dashboard&is_mobile=1&loginid=" + this.userId;
    } else if (action == 'delete') {
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this unit?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            urlstr = "/onholdunitaction?unitid=" + str + "&action=delete&is_mobile=1&loginid=" + this.userId;
            let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
              headers: any = new Headers({ 'Content-Type': type }),
              options: any = new RequestOptions({ headers: headers }),
              url: any = this.apiServiceURL + urlstr;
            console.log("On Hold Action" + url);
            this.http.get(url, options)
              .subscribe((data) => {
                if (data.status === 200) {


                  this.reportData.startindex = 0;
                  this.unitAllLists = [];
                  // let res = data.json();
                  if (action == 'favorite') {
                    this.conf.sendNotification(data.json().msg.result);
                  } else {
                    this.reportData.startindex = 0;
                    this.unitAllLists = [];
                    this.doUnit();
                    this.conf.sendNotification(data.json().msg[0]['result']);
                  }


                  this.selecteditems = [];
                  // this.doUnit();


                }
                // Otherwise let 'em know anyway
                else {
                }
              });
          }
        },
        {
          text: 'No',
          handler: () => { }
        }]
      });
      confirm.present();
    } else if (action == 'favorite') {
      urlstr = "/onholdunitaction?unitid=" + this.arrayid + "&action=favorite&is_mobile=1&loginid=" + this.userId;
    }
    if (action != 'delete') {
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + urlstr;
      this.http.get(url, options)
        .subscribe((data) => {
          if (data.status === 200) {


            this.reportData.startindex = 0;
            this.unitAllLists = [];
            // let res = data.json();
            if (action == 'favorite') {
              this.conf.sendNotification(data.json().msg.result);
            } else {
              this.conf.sendNotification(data.json().msg[0]['result']);
            }


            this.selecteditems = [];
            this.doUnit();


          }
          // Otherwise let 'em know anyway
          else {
          }
        });

    }
  }

  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.unitAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }
      if (this.items.length >= this.totalCount) {
        this.isInfiniteHide = false
      }
      infiniteScroll.complete();

    });
  }


}


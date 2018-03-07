import { Component, } from '@angular/core';
import { NavController, NavParams, AlertController, Events, ModalController } from 'ionic-angular';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NotificationPage } from '../notification/notification';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { AddUnitPage } from "../add-unit/add-unit";
import { ModalPage } from '../modal/modal';
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
  
  public footerBar = [];
  public alarms: string = "0";
  public warningcount: string = "0";
  public runningcount: string = "0";
  public offlinecount: string = "0";
  public tabs: string = 'listView';
  public unitsPopups: any;
  private apiServiceURL: string = '';
  public totalCount;
  public unitAllLists = [];
  public sortLblTxt: string = 'Favourites';
  testRadioOpen: boolean;
  testRadioResult;
  //tabBarElement: any;
  public reportData: any =
    {
      status: '',
      sort: 'favorite',
      sortascdesc: 'desc',
      startindex: 0,
      results: 8
    };

  public companyId: any;
  public userId: any;
  public msgcount: any;
  public notcount: any;
  public profilePhoto;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  tabIndexVal;
  constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public navCtrl: NavController, public NP: NavParams, public navParams: NavParams, private conf: Config, private http: Http, public events: Events) {
    this.apiServiceURL = conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.tabIndexVal = localStorage.getItem("tabIndex");
    this.CREATEACCESS = localStorage.getItem("UNITS_LISTING_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_LISTING_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_LISTING_DELETE");;


    
  // Footer Menu Access - Start
  let footeraccessstorage = localStorage.getItem("footermenu");
  let footeraccessparams = this.navParams.get('footermenu');
  let footermenuacc;
  if (footeraccessparams != undefined) {
    footermenuacc = footeraccessparams;
  } else {
    footermenuacc = footeraccessstorage;
  }

  console.log("Footer Menu Access abc:-" + footermenuacc);
  // this.footerBar="0,"+footermenuacc;

  let footermenusplitcomma = footermenuacc.split(",");
  let dashboardAccess = footermenusplitcomma[0];
  let unitAccess = footermenusplitcomma[1];
  let calendarAccess = footermenusplitcomma[2];
  let messageAccess = footermenusplitcomma[3];
  let orgchartAccess = footermenusplitcomma[4];

  console.log("Footer Menu Access for Dashboard" + dashboardAccess);
  console.log("Footer Menu Access for Dashboard" + unitAccess);
  console.log("Footer Menu Access for Calendar" + calendarAccess);
  console.log("Footer Menu Access for Messagees" + messageAccess);
  console.log("Footer Menu Access for Org Chart" + orgchartAccess);
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

  console.log("Footer Access Loop Value:" + JSON.stringify(this.footerBar));
  //this.footerBar = "0";
  //let footerBar=this.footerBar.split(",");
  console.log("Final Footer Menu access:" + this.footerBar);

  // Footer Menu Access - End

  }

  ionViewWillEnter() {

    localStorage.setItem("tabIndex", "1");
    this.tabIndexVal = localStorage.getItem("tabIndex");
    //this.tabBarElement.style.display = 'flex';
  }
  presentModal(unit) {
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  ionViewDidLoad() {

    localStorage.setItem("tabIndex", "1");
    this.tabIndexVal = localStorage.getItem("tabIndex");
    //console.log("Page Name"+this.navCtrl.getActive().name);

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
      console.log("ionViewDidLoad B");
    }
    if (this.userId == null) {
      this.userId = '';
      console.log("ionViewDidLoadC");
    }
    if (this.userId != "") {
      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");
      this.doUnit();
      this.doNotifiyCount();
      // Initiate G Map

    } else {
      this.events.subscribe('user:created', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Welcome', user, 'at', time);
        console.log("Company Id:" + user.company_id);
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
        console.log(error);
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
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId + "&loginid=" + this.userId;

    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();
        // console.log(JSON.stringify(res));
        // console.log("1" + res.units.length);
        // console.log("2" + res.units);
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
            // console.log("Favorite is:" + res.units[unit].favorite);

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
              runninghr: res.units[unit].runninghr,
              companygroup_name: cname,
              viewonid: res.units[unit].viewonid,
              nextservicedate_mobileview: res.units[unit].nextservicedate_mobileview,
              duedatecolor: res.units[unit].duedatecolor
            });
          }
          // console.log("Kannan12345fdsfs" + JSON.stringify(this.unitAllLists));
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        // console.log("Total Record:" + this.totalCount);
        this.conf.presentLoading(0);
      }, error => {
        console.log("Error" + JSON.stringify(error));
      });

  }

  /******************************************/
  /* @doConfirm called for alert dialog box **/

  /******************************************/
  doConfirm(id, item) {
    console.log("Deleted Id" + id);
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
          console.log("Deleted done");
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log("Error")
      });
  }

  // List page navigate to notification list
  notification() {
    console.log('Will go notification list page');
    // Navigate the notification list page
    this.navCtrl.setRoot(NotificationPage);
  }



  // Favorite Action

  favorite(unit_id) {
    this.reportData.startindex = 0;
    this.unitAllLists = [];
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.userId + "&company_id=" + this.companyId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitfavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        //this.reportData.startindex = 0;
        // this.unitAllLists = [];
        //this.doUnit();
        let res = data.json();
        if (data.status === 200) {
          console.log("Kannan:" + res.favorite);
          if (res.favorite == 0) {
            //this.conf.sendNotification("Unfavourited successfully");
            this.conf.sendNotification(data.json().msg[0]['result']);
          } else {
            this.conf.sendNotification(data.json().msg[0]['result']);
            //this.conf.sendNotification("Favourite successfully");
          }
        }



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
            console.log("Favorite is:" + res.units[unit].favorite);
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
              lng: res.units[unit].lng,
              runninghr: res.units[unit].runninghr,
              companygroup_name: cname,
              nextservicedate_mobileview: res.units[unit].nextservicedate_mobileview,
              duedatecolor: res.units[unit].duedatecolor
            });
          }
          //this.unitAllLists = res.units;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }


      }, error => {
        console.log(error);// + "\n" + error;
      });

    //this.doUnit();
  }

  doSort() {
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
            console.log(data);
            console.log('Asc clicked');
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
              this.doUnit();
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
              this.doUnit();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  doAction(item, act, unitId) {

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
      console.log("RHR" + item.runninghr);
      localStorage.setItem("nsd", item.nextservicedate);

      localStorage.setItem("microtime", "");
      this.navCtrl.setRoot(UnitdetailsPage, {
        record: item
      });
      return false;
    } else {

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
    let urlstr = "/unitlistaction?action=dashboard&unitid=" + id + "&is_mobile=1&loginid=" + this.userId
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + urlstr;
    console.log("onAction map.ts:" + url);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));

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

  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doUnit();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }

}


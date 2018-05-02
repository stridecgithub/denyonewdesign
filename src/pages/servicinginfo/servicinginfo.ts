import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ModalController, App } from 'ionic-angular';
import { AddserviceinfoPage } from '../addserviceinfo/addserviceinfo';
import { UnitsPage } from '../units/units';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddrequestsupportPage } from '../addrequestsupport/addrequestsupport';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { OrgchartPage } from '../orgchart/orgchart';
import { Config } from '../../config/config';
import { AddhocPage } from "../addhoc/addhoc";
import { ServicedetailsPage } from "../servicedetails/servicedetails";
import { ServicingDetailsPage } from "../servicing-details/servicing-details";
import { ModalPage } from '../modal/modal';
import { MockProvider } from '../../providers/pagination/pagination';

/**
 * Generated class for the ServicinginfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-servicinginfo',
  templateUrl: 'servicinginfo.html',
  providers: [Config]
})
export class ServicinginfoPage {
  public pageTitle: string;
  public unit_id: any;
  public atMentionedInfo = [];
  public service_subject: any;
  public service_remark: any;
  public msgcount: any;
  public notcount: any;
  public photo: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  itemwidth: any;
  devicewidth: any;
  deviceheight: any;
  h3width = '';
  public upcomingData: any =
    {
      status: '',
      sort: 'service_id',
      sortascdesc: 'desc',
      startindex: 0,
      results:  200000
    }
  public historyData: any =
    {
      status: '',
      sort: 'service_id',
      sortascdesc: 'desc',
      startindex: 0,
      results:  200000
    }
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: '',
    colorcodeindications: '',
    mapicon: ''
  }
  public userId: any;
  public upcomingAllLists = [];
  public historyAllLists = [];
  public addedServiceImgLists = [];
  public addedImgLists = [];
  public loginas: any;
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  public networkType: string;
  public totalCountUpcoming;
  public totalCounthistory;
  public profilePhoto;
  public sortLblTxt: string = 'Date';
  footerBar: number = 1;
  roleId;
  items: any;
  isInfiniteHide: boolean;
  pageperrecord;
  constructor(private mockProvider: MockProvider, public app: App, public modalCtrl: ModalController, private conf: Config, public platform: Platform, public http: Http,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public navCtrl: NavController) {
    this.roleId = localStorage.getItem("userInfoRoleId");
    this.isInfiniteHide = true;
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(UnitdetailsPage, {
          record: this.NP.get("record"),
          tabs: 'dataView'
        });


      });

      this.devicewidth = this.platform.width();
      this.deviceheight = this.platform.height();

    });


    this.pageTitle = 'Servicing Info';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.CREATEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_SERVICINGINFO_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_DELETE");
    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();

    this.profilePhoto = localStorage.getItem

      ("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }

    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }



  ionViewDidLoad() {
    if (this.devicewidth <= 320) {
      this.itemwidth = 'device-320-item-width';
      this.h3width = '230px';
    } else {
      this.itemwidth = '';
      this.h3width = '270px';
    }
    localStorage.setItem("fromModule", "ServicinginfoPage");


    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;



    this.http.get(url, options)
      .subscribe((data) => {

        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

    if (this.NP.get("record")) {

      let editItem = this.NP.get("record");
      // this.showAlert('this.NP.get("record")', JSON.stringify(editItem));
      // UnitDetails Api Call		

      let unitid = editItem.unit_id;
      if (unitid == undefined) {
        unitid = editItem.service_unitid;
      }
      if (unitid == 'undefined') {
        unitid = editItem.service_unitid;
      }

      let
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
          "&unitid=" + unitid;

      this.http.get(url, options)
        .subscribe((data) => {					// If the request was successful notify the user
          if (data.status === 200) {
            this.unitDetailData.unitname = data.json().units[0].unitname;
            this.unitDetailData.projectname = data.json().units[0].projectname;
            this.unitDetailData.location = data.json().units[0].location;
            this.unitDetailData.colorcodeindications = data.json().units[0].colorcode;
            this.unitDetailData.gen_status = data.json().units[0].genstatus;
            this.unitDetailData.nextservicedate = data.json().units[0].nextservicedate;
            this.unitDetailData.companygroup_name = data.json().units[0].companygroup_name;
            this.unitDetailData.runninghr = data.json().units[0].runninghr;
            this.unitDetailData.mapicon = data.json().units[0].mapicon;
            this.unitDetailData.alarmnotificationto = data.json().units[0].nextservicedate;
            if (data.json().units[0].lat == undefined) {
              this.unitDetailData.lat = '';
            } else {
              this.unitDetailData.lat = data.json().units[0].lat;
            }

            if (data.json().units[0].lat == 'undefined') {
              this.unitDetailData.lat = '';
            } else {
              this.unitDetailData.lat = data.json().units[0].lat;
            }


            if (data.json().units[0].lng == undefined) {
              this.unitDetailData.lng = '';
            } else {
              this.unitDetailData.lng = data.json().units[0].lng;
            }

            if (data.json().units[0].lng == 'undefined') {
              this.unitDetailData.lng = '';
            } else {
              this.unitDetailData.lng = data.json().units[0].lng;
            }

            this.unitDetailData.favoriteindication = data.json().units[0].favorite;


          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
      // Unit Details API Call

    }
    this.upcomingData.startindex = 0;
    this.upcomingData.sort = "service_id";
    this.doUpcoming();

    this.historyData.startindex = 0;
    this.historyData.sort = "service_id";
    this.doHistory();


    // Atmentioned Tag Storage
  }

  doRefresh(refresher) {

    this.upcomingData.startindex = 0;
    this.upcomingAllLists = [];
    this.doUpcoming();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  /*doInfinite(infiniteScroll) {



    if (this.upcomingData.startindex < this.totalCountUpcoming && this.upcomingData.startindex > 0) {

      this.doUpcoming();
    }

    setTimeout(() => {

      infiniteScroll.complete();
    }, 500);

  }*/
  doUpcoming() {
    this.conf.presentLoading(1);
    if (this.upcomingData.status == '') {
      this.upcomingData.status = "DRAFT";
    }
    if (this.upcomingData.sort == '') {
      this.upcomingData.sort = "comapny";
    }
    let editItem = this.NP.get("record");

    if (this.NP.get("record").unit_id != undefined && this.NP.get("record").unit_id != 'undefined') {
      this.unit_id = editItem.unit_id;
    } else {
      this.unit_id = editItem.service_unitid;
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/serviceupcoming?is_mobile=1&startindex=" + this.upcomingData.startindex + "&results=" + this.upcomingData.results + "&sort=" + this.upcomingData.sort + "&dir=" + this.upcomingData.sortascdesc + "&unitid=" + localStorage.getItem("unitId");
    let res;

    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();


        if (res.services.length > 0) {
          this.upcomingAllLists = res.services;



          this.totalCountUpcoming = res.totalCountUpcoming;
          this.upcomingData.startindex += this.upcomingData.results;
          this.loadingMoreDataContent = 'Loading More Data';
          for (var i = 0; i < res.services.length; i++) {
            this.photo = res.services[i].user_photo;

          }

        } else {
          this.totalCountUpcoming = 0;
          this.loadingMoreDataContent = 'No More Data';
        }


      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }



  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  previous() {
    this.navCtrl.setRoot(UnitdetailsPage, {
      record: this.NP.get("record"),
      tabs: 'dataView'
    });
  }

  redirectToUnits() {
    this.navCtrl.setRoot(UnitsPage);
  }



  doAdd() {
    this.service_subject = '';
    this.service_remark = '';
    this.addedServiceImgLists = [];
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(AddserviceinfoPage, {
      record: this.NP.get("record"),
      act: 'Add',
      unit_id: this.unit_id
    });
  }


  doRequest() {
    this.service_subject = '';
    this.service_remark = '';
    this.addedImgLists = [];
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(AddrequestsupportPage, {
      record: this.NP.get("record"),
      act: 'Add',
      unit_id: this.unit_id
    });
  }



  doEdit(item, act) {

    this.navCtrl.setRoot(ServicedetailsPage, {
      record: item,
      act: 'Edit',
      from: 'service'
    });


  }
  servicedetailsView(item, act, from) {
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(ServicingDetailsPage, {
      record: item,
      act: 'View',
      from: from
    });
  }
  presentModal(unit) {
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }

  doConfirmUpcoming(id, item, from) {


    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this service schedule?',
      buttons: [{
        text: 'Yes',
        handler: () => {

          this.deleteEntryHistory(id, from);
          if (from == 'upcoming') {
            for (let q: number = 0; q < this.upcomingAllLists.length; q++) {
              if (this.upcomingAllLists[q] == item) {
                this.upcomingAllLists.splice(q, 1);
              }
            }
          } else {
            for (let q: number = 0; q < this.historyAllLists.length; q++) {
              if (this.historyAllLists[q] == item) {
                this.historyAllLists.splice(q, 1);
              }
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
  doConfirmHistory(id, item, from) {


    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this service history?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntryHistory(id, from);
          for (let q: number = 0; q < this.upcomingAllLists.length; q++) {
            if (this.upcomingAllLists[q] == item) {
              this.upcomingAllLists.splice(q, 1);
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



  deleteEntryHistory(recordID, from) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          // this.conf.sendNotification(`Service details deleted successfully`);
          this.conf.sendNotification(data.json().msg[0]['result']);
          if (from == 'upcoming') {
            this.upcomingData.startindex = 0;
            this.upcomingAllLists = [];
            this.doUpcoming();
          } else {
            this.historyData.startindex = 0;
            this.historyAllLists = [];
            this.doHistory();
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.upcomingData.sort = splitdata[0];
    this.upcomingData.sortascdesc = splitdata[1];
    //this.upcomingData.status = "ALL";
    this.upcomingData.startindex = 0;
    this.upcomingAllLists = [];
    this.doUpcoming();
  }

  redirectCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }

  redirectToSettings() {
    this.navCtrl.setRoot(OrgchartPage);
  }

  doSortUpcomingService() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Date',
          value: 'serviced_datetime',
        },
        {
          type: 'radio',
          label: 'Sender',
          value: 'serviced_by',
        },
        {
          type: 'radio',
          label: 'Priority',
          value: 'service_priority',
        }
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {

            if (data != undefined) {
              this.upcomingData.sort = data;
              this.upcomingData.sortascdesc = 'asc';
              if (data == 'alarm_received_date') {
                this.sortLblTxt = 'Date';
              }
              if (data == 'alarm_priority') {
                this.sortLblTxt = 'Fault Code';
              }
              this.upcomingData.startindex = 0;
              this.upcomingAllLists = [];
              this.doUpcoming();


            }
          }
        },
        {
          text: 'Desc',
          handler: data => {

            if (data != undefined) {
              this.upcomingData.sort = data;
              this.upcomingData.sortascdesc = 'desc';


              if (data == 'alarm_received_date') {
                this.sortLblTxt = 'Date';
              }
              if (data == 'alarm_priority') {
                this.sortLblTxt = 'Fault Code';
              }
              this.upcomingData.startindex = 0;
              this.upcomingAllLists = [];
              this.doUpcoming();
            }
          }
        }
      ]
    });
    prompt.present();
  }
  doAddHoc() {
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(AddhocPage, {
      record: this.NP.get("record"),
      act: 'Add',
      unit_id: this.unit_id
    });
  }

  doHistory() {
    this.conf.presentLoading(1);
    if (this.historyData.status == '') {
      this.historyData.status = "DRAFT";
    }
    if (this.historyData.sort == '') {
      this.historyData.sort = "comapny";
    }
    let editItem = this.NP.get("record");

    if (this.NP.get("record").unit_id != undefined && this.NP.get("record").unit_id != 'undefined') {
      this.unit_id = editItem.unit_id;
    } else {
      this.unit_id = editItem.service_unitid;
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/servicehistory?is_mobile=1&startindex=" + this.historyData.startindex + "&results=" + this.historyData.results + "&sort=" + this.historyData.sort + "&dir=" + this.historyData.sortascdesc + "&unitid=" + localStorage.getItem("unitId");
    let res;

    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();

        if (res.services.length > 0) {
          this.historyAllLists = res.services;
          this.totalCounthistory = res.totalCount;
          this.historyData.startindex += this.historyData.results;
          this.loadingMoreDataContent = 'Loading More Data';
          for (var i = 0; i < res.services.length; i++) {
            this.photo = res.services[i].user_photo;

          }

        } else {
          this.totalCounthistory = 0;
          this.loadingMoreDataContent = 'No More Data';
        }
        this.items = this.mockProvider.getData(this.historyAllLists, 0, this.pageperrecord);

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  doRefreshHistory(refresher) {

    this.historyData.startindex = 0;
    this.historyAllLists = [];
    this.doHistory();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  /*doInfiniteHistory(infiniteScroll) {

    if (this.historyData.startindex < this.totalCounthistory && this.historyData.startindex > 0) {

      this.doHistory();
    }

    setTimeout(() => {

      infiniteScroll.complete();
    }, 500);

  }*/

  showAlert(titl, msg) {
    let alert = this.alertCtrl.create({
      title: titl,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.historyAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }
      if (this.items.length >= this.totalCounthistory) {
        this.isInfiniteHide = false
      }
      infiniteScroll.complete();

    });
  }
}

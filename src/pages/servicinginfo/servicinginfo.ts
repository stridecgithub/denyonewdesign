import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ModalController } from 'ionic-angular';
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
  public upcomingData: any =
    {
      status: '',
      sort: 'service_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 50
    }
  public historyData: any =
    {
      status: '',
      sort: 'service_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 50
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
    colorcodeindications: ''
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
  //tabBarElement: any;
  public footerBar = [];
  constructor(public modalCtrl: ModalController, private conf: Config, public platform: Platform, public http: Http,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public navCtrl: NavController) {
    this.pageTitle = 'Servicing Info';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.CREATEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_SERVICINGINFO_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_DELETE");
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();


    this.profilePhoto = localStorage.getItem

      ("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
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

  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }

  ionViewDidLoad() {
    // this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad ServicinginfoPage');
    localStorage.setItem("fromModule", "ServicinginfoPage");
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
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

    if (this.NP.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
      let editItem = this.NP.get("record");
      console.log("SErvine info loading:" + editItem);
      console.log("SErvine info loading JSON:" + JSON.stringify(editItem));
      // UnitDetails Api Call		

      let unitid = editItem.unit_id;
      if (unitid == undefined) {
        unitid = editItem.service_unitid;
      }
      if (unitid == 'undefined') {
        unitid = editItem.service_unitid;
      }
      console.log("Unit Id" + unitid);
      let
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
          "&unitid=" + unitid;
      console.log(url);
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
            console.log("Favorite Indication is" + this.unitDetailData.favoriteindication);

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
    console.log('doRefresh function calling...');
    this.upcomingData.startindex = 0;
    this.upcomingAllLists = [];
    this.doUpcoming();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCountUpcoming)
    if (this.upcomingData.startindex < this.totalCountUpcoming && this.upcomingData.startindex > 0) {
      console.log('B');
      this.doUpcoming();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
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
    //http://denyoappv2.stridecdev.com/serviceupcoming?is_mobile=1&startindex=0&results=50&sort=service_id&dir=desc&unitid=1
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/serviceupcoming?is_mobile=1&startindex=" + this.upcomingData.startindex + "&results=" + this.upcomingData.results + "&sort=" + this.upcomingData.sort + "&dir=" + this.upcomingData.sortascdesc + "&unitid=" + localStorage.getItem("unitId");
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.services.length);
        console.log("2" + res.services);
        if (res.services.length > 0) {
          this.upcomingAllLists = res.services;
          /*if (res.services.length > 0) {
            for (let serviceData in res.services) {
              this.upcomingAllLists.push({
                'is_denyo_support': res.services[serviceData].is_denyo_support,
                'next_service_date_selected': res.services[serviceData].next_service_date_selected,
                'service_unitid': res.services[serviceData].service_unitid,
                'is_request': res.services[serviceData].is_request,
                'service_id': res.services[serviceData].service_id,
                'next_service_date': res.services[serviceData].next_service_date,
                'serviced_schduled_date': res.services[serviceData].serviced_schduled_date,
                'service_scheduled_time_format': res.services[serviceData].service_scheduled_time_format,
                'serviced_by': res.services[serviceData].serviced_by,
                'user_photo': res.services[serviceData].user_photo,
                'service_subject': res.services[serviceData].service_subject,
                'serviced_scheduled_display': res.services[serviceData].serviced_scheduled_display,
                "serviced_created_name": res.services[serviceData].serviced_created_name,
                "serviced_created_name_hastag": res.services[serviceData].serviced_created_name_hastag != undefined ? "(" + res.services[serviceData].serviced_created_name_hastag + ")" : '',
                "serviced_by_name": res.services[serviceData].serviced_by_name,
                "serviced_by_name_hastag": res.services[serviceData].serviced_by_name_hastag != undefined ? "(" + res.services[serviceData].serviced_by_name_hastag + ")" : '',
              });
            }
          }*/


          this.totalCountUpcoming = res.totalCountUpcoming;
          this.upcomingData.startindex += this.upcomingData.results;
          this.loadingMoreDataContent = 'Loading More Data';
          for (var i = 0; i < res.services.length; i++) {
            this.photo = res.services[i].user_photo;
            console.log("PHOTO" + this.photo);
          }

        } else {
          this.totalCountUpcoming = 0;
          this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCountUpcoming);

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
    /* if (item.event_type.toLowerCase() == 's') {
       localStorage.setItem("microtime", "");
       this.navCtrl.setRoot(AddserviceinfoPage, {
         record: item,
         act: 'Edit',
         from: 'service'
       });
     }
     else {
       this.conf.sendNotification("Not Applicable!!!")
     }*/
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
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }

  doConfirmUpcoming(id, item, from) {

    console.log("Deleted Id" + id);
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

    console.log("Deleted Id" + id);
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
            console.log(data);
            console.log('Asc clicked');
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
            console.log(data);
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
    //http://denyoappv2.stridecdev.com/servicehistory?is_mobile=1&startindex=0&results=50&sort=service_id&dir=desc&unitid=1
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/servicehistory?is_mobile=1&startindex=" + this.historyData.startindex + "&results=" + this.historyData.results + "&sort=" + this.historyData.sort + "&dir=" + this.historyData.sortascdesc + "&unitid=" + localStorage.getItem("unitId");
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();

        if (res.services.length > 0) {
          for (let serviceData in res.services) {
            this.historyAllLists = res.services;

            /* this.historyAllLists.push({
               "user_photo": res.services[serviceData].user_photo,
               "service_subject": res.services[serviceData].service_subject,
               "serviced_scheduled_display": res.services[serviceData].serviced_scheduled_display,
               "serviced_created_name": res.services[serviceData].serviced_created_name,
               "serviced_created_name_hastag": res.services[serviceData].serviced_created_name_hastag_withinclosedbracket != undefined ? res.services[serviceData].serviced_created_name_hastag_withinclosedbracket : '',
               "serviced_by_name": res.services[serviceData].serviced_by_name,
               "serviced_by_name_hastag": res.services[serviceData].serviced_by_name_hastag_withinclosedbracket != undefined ?   res.services[serviceData].serviced_by_name_hastag_withinclosedbracket  : '',
               "is_denyo_support": res.services[serviceData].is_denyo_support,
               "is_request": res.services[serviceData].is_request,
               "service_remark": res.services[serviceData].service_remark,
               "service_description": res.services[serviceData].service_description,
               "service_resources": res.services[serviceData].service_resources,
               "service_unitid": res.services[serviceData].service_unitid,
               "service_id": res.services[serviceData].service_id,
               "serviced_schduled_date": res.services[serviceData].serviced_schduled_date,
               "service_scheduled_time_format": res.services[serviceData].service_scheduled_time_format,
               "next_service_date": res.services[serviceData].next_service_date,
               "next_service_date_selected": res.services[serviceData].next_service_date_selected,
               "service_status": res.services[serviceData].service_status,
               "currentdate_mobileview": res.services[serviceData].currentdate_mobileview,
               "serviced_datetime_edit": res.services[serviceData].serviced_datetime_edit
             });*/
          }

          this.totalCounthistory = res.totalCounthistory;
          this.historyData.startindex += this.historyData.results;
          this.loadingMoreDataContent = 'Loading More Data';
          for (var i = 0; i < res.services.length; i++) {
            this.photo = res.services[i].user_photo;
            console.log("PHOTO" + this.photo);
          }

        } else {
          this.totalCounthistory = 0;
          this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCounthistory);

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  doRefreshHistory(refresher) {
    console.log('doRefresh function calling...');
    this.historyData.startindex = 0;
    this.historyAllLists = [];
    this.doHistory();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doInfiniteHistory(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCounthistory)
    if (this.historyData.startindex < this.totalCounthistory && this.historyData.startindex > 0) {
      console.log('B');
      this.doHistory();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
}

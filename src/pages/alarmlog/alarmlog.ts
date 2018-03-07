import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddalarmPage } from '../addalarm/addalarm';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { OrgchartPage } from '../orgchart/orgchart';
import { Config } from '../../config/config';
import { AlarmlogdetailsPage } from '../alarmlogdetails/alarmlogdetails';
import { ModalPage } from '../modal/modal';
/**
 * Generated class for the AlarmlogPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-alarmlog',
  templateUrl: 'alarmlog.html',
  providers: [Config]
})
export class AlarmlogPage {
  public pageTitle: string;
  public loginas: any;
  public footerBar = [];
  private apiServiceURL: string = "";
  public networkType: string;
  public totalCount;
  pet: string = "ALL";
  public reportData: any =
    {
      status: '',
      sort: 'alarm_id',
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
    addedImgLists2: ''
  }
  public reportAllLists = [];
  public colorListArr: any;
  public userId: any;
  public unit_id: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;

  public msgcount: any;
  public notcount: any;
  public sortLblTxt: string = 'Date';
  constructor(public modalCtrl: ModalController, private conf: Config, public platform: Platform, public http: Http, public navCtrl: NavController,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.CREATEACCESS = localStorage.getItem("UNITS_ALARM_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_ALARM_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_ALARM_DELETE");
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });

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
  presentModal(unit) {
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  doAlarmLogDetail(item) {
    this.navCtrl.setRoot(AlarmlogdetailsPage, {
      record: item
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmlogPage');

    localStorage.setItem("fromModule", "AlarmlogPage");
    // UnitDetails Api Call		

    this.unitDetailData.unit_id = localStorage.getItem("unitId");

    let editItem = this.NP.get("record");

    let unid;
    if (this.unitDetailData.unit_id > 0) {
      unid = this.unitDetailData.unit_id;
    } else {
      unid = editItem.unit_id;
    }
    let
      typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headersunit: any = new Headers({ 'Content-Type': typeunit }),
      optionsunit: any = new RequestOptions({ headers: headersunit }),
      urlunit: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
        "&unitid=" + unid;
    console.log(urlunit);
    this.http.get(urlunit, optionsunit)
      .subscribe((data) => {					// If the request was successful notify the user
        if (data.status === 200) {
          console.log('rrrrr');
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

  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doAlarm();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doAlarm() {
    //let editItem = this.NP.get("record");

    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "alarm_id";
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/alarms?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitid=" + localStorage.getItem("unitId") + "&type=alarmlog";
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.alarms.length);
        console.log("2" + res.alarms);

        if (res.alarms.length > 0) {

          for (let alarm in res.alarms) {
            let hashtagbyname;
            if (res.alarms[alarm].alarm_assginedby_hashtag != '') {
              hashtagbyname = "(" + res.alarms[alarm].alarm_assginedby_hashtag + ")";
            } else {
              hashtagbyname = '';
            }

            let hashtagtoname;
            if (res.alarms[alarm].alarm_assginedto_hashtag != '') {
              hashtagtoname = "(" + res.alarms[alarm].alarm_assginedto_hashtag + ")";
            } else {
              hashtagtoname = '';
            }

            this.reportAllLists.push({
              alarm_id: res.alarms[alarm].alarm_id,
              alarm_name: res.alarms[alarm].alarm_name,
              alarm_assginedby_name: res.alarms[alarm].alarm_assginedby_name,
              alarm_assginedto_name: res.alarms[alarm].alarm_assginedto_name,
              alarm_priority: res.alarms[alarm].alarm_priority,
              alarm_received_date: res.alarms[alarm].alarm_received_date,
              alarm_received_date_mobileview: res.alarms[alarm].alarm_received_date_mobileview,
              alarm_received_time: res.alarms[alarm].alarm_received_time,
              alarm_assigned_date: res.alarms[alarm].alarm_assigned_date,
              alarm_assigned_date_mobileview: res.alarms[alarm].alarm_assigned_date_mobileview,
              alarm_remark: res.alarms[alarm].alarm_remark,
              alarm_unit_id: res.alarms[alarm].alarm_unit_id,
              alarm_assginedby_hashtag: hashtagbyname,
              alarm_assginedto_hashtag: hashtagtoname,
              alarm_assgined_to: res.alarms[alarm].alarm_assgined_to


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

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  ionViewWillEnter() {
    this.unitDetailData.unit_id = localStorage.getItem("unitId");
    this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    this.unitDetailData.location = localStorage.getItem("unitlocation");
    this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    this.unitDetailData.favoriteindication = localStorage.getItem("unitfav");
    console.log("Add Comment Color Code:" + this.unitDetailData.colorcodeindications);


    console.log("Alarm log page unit id is" + this.unitDetailData.unit_id)
    localStorage.setItem("unitId", this.unitDetailData.unit_id);
    localStorage.setItem("iframeunitId", this.unitDetailData.unit_id);
    this.unitDetailData.rh = localStorage.getItem("runninghr");
    this.unitDetailData.ns = localStorage.getItem("nsd");

    this.unitDetailData.lat = localStorage.getItem("unitlat");
    this.unitDetailData.lng = localStorage.getItem("unitlng");
    this.pageTitle = "Alarm";
    this.reportData.startindex = 0;
    this.reportData.sort = "alarm_id";
    this.doAlarm();
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
  }
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doAlarm();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }

  previous() {
    this.navCtrl.setRoot(UnitdetailsPage, {
      record: this.NP.get("record"),
      tabs: 'dataView'
    });
  }
  doEdit(item, act) {

    if (this.userId == '1') {
      this.navCtrl.setRoot(AddalarmPage, {
        record: item,
        act: act,
        from: 'alarmlog',
        unitid: localStorage.getItem("unitId")
      });
    } else {
      if (item.alarm_assginedby_name == '') {
        if (act == 'edit') {
          this.navCtrl.setRoot(AddalarmPage, {
            record: item,
            act: act,
            from: 'alarmlog',
            unitid: localStorage.getItem("unitId")
          });
        }
      }
      else {
        this.conf.sendNotification("Alarm already assigned");
      }
    }
  }


  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  redirectToUser() {
    this.navCtrl.setRoot(UnitsPage);
  }

  redirectCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }

  redirectToSettings() {
    this.navCtrl.setRoot(OrgchartPage);
  }
  doSortAlarmLog() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Date',
          value: 'alarm_received_date',
        },
        {
          type: 'radio',
          label: 'Fault Code',
          value: 'alarm_priority',
        }
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
              if (data == 'alarm_received_date') {
                this.sortLblTxt = 'Date';
              }
              if (data == 'alarm_priority') {
                this.sortLblTxt = 'Fault Code';
              }
              this.reportData.startindex = 0;
              this.reportAllLists = [];
              this.doAlarm();


            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            console.log(data);
            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'desc';


              if (data == 'alarm_received_date') {
                this.sortLblTxt = 'Date';
              }
              if (data == 'alarm_priority') {
                this.sortLblTxt = 'Fault Code';
              }
              this.reportData.startindex = 0;
              this.reportAllLists = [];
              this.doAlarm();
            }
          }
        }
      ]
    });
    prompt.present();
  }
}

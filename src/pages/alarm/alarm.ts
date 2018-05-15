import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform, ModalController, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
//import { AddalarmlistPage } from '../addalarmlist/addalarmlist';
import { OrgchartPage } from '../orgchart/orgchart'
import { Config } from '../../config/config';
import { AddalarmPage } from '../addalarm/addalarm';
import { TrendlinePage } from '../trendline/trendline';
import { AlarmlogdetailsPage } from '../alarmlogdetails/alarmlogdetails';
import { ModalPage } from '../modal/modal';
import { MockProvider } from '../../providers/pagination/pagination';
/**
 * Generated class for the AlarmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
  providers: [Config]
})
export class AlarmPage {
  public msgcount: any;
  public notcount: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public pageTitle: string;
  public loginas: any;

  footerBar: number = 1;
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
      results: 200000
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
    mapicon: ''
  }
  public reportAllLists = [];
  public colorListArr: any;
  public userId: any;
  public unit_id: any;
  public sortLblTxt: string = 'Date';
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  timezoneoffset;
  constructor(private mockProvider: MockProvider, private app: App, public modalCtrl: ModalController, private conf: Config, public platform: Platform, public http: Http, public navCtrl: NavController,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams) {
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    this.isInfiniteHide = true;
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(UnitdetailsPage, {
          record: this.NP.get("record"),
          tabs: 'overView'
        });
      });
    });

    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.CREATEACCESS = localStorage.getItem("UNITS_ALARM_CREATE");
    this.EDITACCESS = localStorage.getItem("UNITS_ALARM_EDIT");
    this.DELETEACCESS = localStorage.getItem("UNITS_ALARM_DELETE");
    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();


    platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(UnitdetailsPage, {
        record: this.navParams.get("record"),
        tabs: 'overView'
      });
    });

  }
  presentModal(unit) {
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  ionViewDidEnter() {

    localStorage.setItem("fromModule", "AlarmPage");


    this.unitDetailData.unit_id = localStorage.getItem("unitId");

    let editItem = this.NP.get("record");

    let unid;
    if (this.unitDetailData.unit_id > 0) {
      unid = this.unitDetailData.unit_id;
    } else {
      unid = editItem.unit_id;
    }
    //this.NP.get("record").alarm_unit_id

    // UnitDetails Api Call		
    let
      typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headersunit: any = new Headers({ 'Content-Type': typeunit }),
      optionsunit: any = new RequestOptions({ headers: headersunit }),
      urlunit: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
        "&unitid=" + unid;

    this.http.get(urlunit, optionsunit)
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
  doRefresh(refresher) {

    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doAlarm();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doAlarm() {
    //let editItem = this.NP.get("record");


    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "alarm_id";
    }
    let urlstr;
    if (this.conf.isUTC() > 0) {
      urlstr = this.apiServiceURL + "/alarms?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitid=" + localStorage.getItem("unitId") + "&type=alarm" + "&timezoneoffset=" + Math.abs(this.timezoneoffset);
    } else {
      urlstr = this.apiServiceURL + "/alarms?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitid=" + localStorage.getItem("unitId") + "&type=alarm";

    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstr;
    let res;
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();

        if (res.alarms.length > 0) {
          this.conf.presentLoading(1);
          for (let alarm in res.alarms) {


            let fls = res.alarms[alarm].alarm_name.includes('Fls');
            let wrn = res.alarms[alarm].alarm_name.includes('Wrn');
            let alarm_priority;
            alarm_priority = res.alarms[alarm].alarm_priority

            if (fls > 0) {
              alarm_priority = 3;
            }
            if (wrn > 0) {
              alarm_priority = 2;
            }


            let act = res.alarms[alarm].alarm_name.includes('!');
            let activealarm;
            let activealarmtext;
            if (act > 0) {
              activealarmtext = 'active-alarm-text';
            }
            let trendlineshow;
            if (res.alarms[alarm].code != '') {
              trendlineshow = 'trendlineshow';
            } else {
              trendlineshow = 'trendlineshow-none';

            }

            let color;
            let ispadding;
            if (res.alarms[alarm].isactivealarm > 0) {
              color = '#ffffff';
              ispadding = '3px';
            } else {
              color = '#000000';
              ispadding = '0px';
            }


            this.reportAllLists.push({
              alarm_id: res.alarms[alarm].alarm_id,
              alarm_unit_id: res.alarms[alarm].alarm_unit_id,
              alarm_name: res.alarms[alarm].alarm_name,
              activealarm: activealarm,
              activealarmtext: activealarmtext,
              alarm_assginedby_name: res.alarms[alarm].alarm_assginedby_name,
              alarm_assginedto_name: res.alarms[alarm].alarm_assginedto_name,
              alarm_priority: alarm_priority,
              alarm_received_date: res.alarms[alarm].alarm_received_date,
              alarm_received_time: res.alarms[alarm].alarm_received_time,
              alarm_assgined_to: res.alarms[alarm].alarm_assgined_to,
              alarm_remark: res.alarms[alarm].alarm_remark,
              code: res.alarms[alarm].code,
              trendlineshow: trendlineshow,
              alarmicon: res.alarms[alarm].alarmicon,
              bgcolor: res.alarms[alarm].bgcolor,
              isactivealarm: res.alarms[alarm].isactivealarm,
              color: color,
              ispadding: ispadding
            });
            if (res.alarms.length == parseInt(alarm) + 1) {
              this.conf.presentLoading(0);
            }
            this.items = this.mockProvider.getData(this.reportAllLists, 0, this.pageperrecord);
          }

          this.totalCount = res.totalCount;

        } else {
          this.conf.presentLoading(0);
          this.totalCount = 0;
        }

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  ionViewWillEnter() {

  }




  doEdit(item, act) {
    // let unitid = this.NP.get("record");


    if (act == 'edit') {

      if (this.userId == '1') {
        this.navCtrl.setRoot(AddalarmPage, {
          record: item,
          act: act,
          from: 'alarm',
          unitid: localStorage.getItem("unitId")
        });
      } else {
        if (item.alarm_assginedby_name == '' && this.userId != '1') {
          /* this.navCtrl.setRoot(AddalarmlistPage, {
            record: item,
            act: act,
            from: 'alarm',
            unitid: unitid
          });*/
          this.navCtrl.setRoot(AddalarmPage, {
            record: item,
            act: act,
            from: 'alarm',
            unitid: localStorage.getItem("unitId")
          });
          return false;
        }
        else {
          if (this.userId != '1') {
            this.conf.sendNotification("Alarm already assigned");
          }
        }
      }
    } else if (act == 'trendline') {

      this.trendlineInfo(item.alarm_id, item);
      return false;
    }
  }

  doAlarmLogDetail(item) {
    this.navCtrl.setRoot(AlarmlogdetailsPage, {
      record: item
    });
  }
  doSortAlarmLog() {
    this.isInfiniteHide = true;
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
  previous() {
    this.navCtrl.setRoot(UnitdetailsPage, {
      record: this.NP.get("record"),
      tabs: 'overView'
    });
  }
  trendlineInfo(alarmid, item) {
    // let modal = this.modalCtrl.create(TrendlinePage, { alarmid: alarmid, record: item });
    // modal.present();

    this.navCtrl.setRoot(TrendlinePage, {
      alarmid: alarmid, record: item
    });

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
  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.reportAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }
      infiniteScroll.complete();
      if (this.items.length > this.totalCount) {
        this.isInfiniteHide = false
      }
    });
  }
}

import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { AddalarmlistPage } from '../addalarmlist/addalarmlist';
import { OrgchartPage } from '../orgchart/orgchart'
import { Config } from '../../config/config';
import { AddalarmPage } from '../addalarm/addalarm';
import { TrendlinePage } from '../trendline/trendline';
import { AlarmlogdetailsPage } from '../alarmlogdetails/alarmlogdetails';
import { ModalPage } from '../modal/modal';
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
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public pageTitle: string;
  public loginas: any;
  footerBar: number = 1;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
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
  public sortLblTxt: string = 'Date';
  constructor(public modalCtrl: ModalController, private conf: Config, public platform: Platform, public http: Http, public navCtrl: NavController,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.VIEWACCESS = localStorage.getItem("UNITS_ALARM_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("UNITS_ALARM_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);
    this.EDITACCESS = localStorage.getItem("UNITS_ALARM_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS);
    this.DELETEACCESS = localStorage.getItem("UNITS_ALARM_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
  }
  presentModal(unit) {
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmPage');
    localStorage.setItem("fromModule", "AlarmPage");
    /*let editItem = this.NP.get("record");

    let from = this.NP.get("from");
    let unid;
    console.log("Alarm Ts:" + JSON.stringify(this.NP.get("record")));
    console.log("From:" + from);
    if (from == 'trendline') {
      unid = this.NP.get("record").alarm_unit_id;
      console.log("Alarm Unit Id" + unid);
    } else if (from == 'addalarm') {
      unid = this.NP.get("record").alarm_unit_id;
      console.log("Alarm Unit Id" + unid);
    }else if (from == undefined) {
      unid = this.NP.get("record").unit_id;
      console.log("Alarm Unit Id" + unid);
    } else if (from == 'undefined') {
      unid = this.NP.get("record").unit_id;
      console.log("Alarm Unit Id" + unid);
    }  else {
      unid = this.NP.get("record").alarm_unit_id;
      console.log("Unit Id" + unid);
    }
*/

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
      url: any = this.apiServiceURL + "/alarms?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitid=" + localStorage.getItem("unitId") + "&type=alarm";
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



            this.reportAllLists.push({
              alarm_id: res.alarms[alarm].alarm_id,
              alarm_unit_id: res.alarms[alarm].alarm_unit_id,
              alarm_name: res.alarms[alarm].alarm_name,
              alarm_assginedby_name: res.alarms[alarm].alarm_assginedby_name,
              alarm_assginedto_name: res.alarms[alarm].alarm_assginedto_name,
              alarm_priority: res.alarms[alarm].alarm_priority,
              alarm_received_date: res.alarms[alarm].alarm_received_date,
              alarm_received_time: res.alarms[alarm].alarm_received_time,
              alarm_assgined_to: res.alarms[alarm].alarm_assgined_to,
              alarm_remark: res.alarms[alarm].alarm_remark

            });
          }
          //"unitgroup_id":1,"unitgroup_name":"demo unit","colorcode":"FBD75C","remark":"nice","favorite":1,"totalunits":5
          /*this.reportAllLists = res.unitgroups;
         
          console.log("Total Record:`" + this.totalCount);
          console.log(JSON.stringify(this.reportAllLists));*/
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.conf.presentLoading(0);
          this.totalCount = 0;
        }
        console.log("Total Record:2" + this.totalCount);

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  ionViewWillEnter() {

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
          /*this.navCtrl.setRoot(AddalarmlistPage, {
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

}

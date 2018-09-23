import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, App } from 'ionic-angular';
import { AddserviceinfoPage } from '../addserviceinfo/addserviceinfo';
import { UnitsPage } from '../units/units';
import { CalendarPage } from '../calendar/calendar';
import { EventDetailsPage } from '../event-details/event-details';
import { MessagedetailPage } from '../messagedetail/messagedetail';
import { MessagesPage } from '../messages/messages';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
import { EventDetailsServicePage } from '../event-details-service/event-details-service';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddrequestsupportPage } from '../addrequestsupport/addrequestsupport';
import { DashboardPage } from '../dashboard/dashboard';
import { DomSanitizer } from '@angular/platform-browser';
import { OrgchartPage } from '../orgchart/orgchart';
import { EventDetailsEventPage } from '../event-details-event/event-details-event';
import { Config } from '../../config/config';
import { MockProvider } from '../../providers/pagination/pagination';
/**
 * Generated class for the ServicinginfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  public pageTitle: string;
  public profilePhoto;
  previousPage;
  public atMentionedInfo = [];
  public reportData: any =
    {
      status: '',
      sort: 'companygroup_id',
      sortascdesc: 'asc',
      startindex: 0,
      results: 200000
    }
  public userId: any;
  public notificationAllLists = [];
  public loginas: any;
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  public networkType: string;
  public totalCount;
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  timezoneoffset;
  constructor(private mockProvider: MockProvider, public app: App, private conf: Config, public platform: Platform, private sanitizer: DomSanitizer, public http: Http,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public navCtrl: NavController) {
    this.isInfiniteHide = true;
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    this.pageTitle = 'Notifications';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    this.previousPage = this.navCtrl.getActive().name;

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        if (this.previousPage == 'UnitsPage') {
          this.navCtrl.setRoot(UnitsPage);
        } else if (this.previousPage == 'CalendarPage') {
          this.navCtrl.setRoot(CalendarPage);
        } else if (this.previousPage == 'MessagesPage') {
          this.navCtrl.setRoot(MessagesPage);
        } else if (this.previousPage == 'OrgchartPage') {
          this.navCtrl.setRoot(OrgchartPage);
        } else if (this.previousPage == 'DashboardPage') {
          this.navCtrl.setRoot(DashboardPage);
        } else {
          this.navCtrl.setRoot(DashboardPage);
        }
      });
    });



  }
  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }
  }
  ionViewDidLoad() {
    localStorage.setItem("fromModule", "NotificationPage");


    let body: string = "is_mobile=1&loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/changebellnotify";
    this.http.post(url, body, options)
      .subscribe((data) => {

      });
  }
  notificationdetails(item, nottype) {


    let body: string = "is_mobile=1&loginid=" + this.userId +
      "&table_id=" + item.table_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/changestatusapibell_list";

    this.http.post(url, body, options)
      .subscribe((data) => {

        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`Comment count successfully removed`);

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });



    if (nottype == 'M') {
      localStorage.setItem("fromnavigation",'notification');
      this.navCtrl.setRoot(MessagedetailPage, {
        record: item,
        frompage: 'notification',
        event_id: item.table_id,
        from: 'push'
      });
      return false;

    } else if (nottype == 'OA') {
      this.navCtrl.setRoot(EventDetailsPage, {
        record: item,
        from: 'notification',
        event_id: item.table_id
      });
      return false;
    } else if (nottype == 'A') {
      this.navCtrl.setRoot(EventDetailsPage, {
        record: item,
        from: 'notification',
        event_id: item.table_id
      });
      return false;
    } else if (nottype == 'C') {
      this.navCtrl.setRoot(CommentdetailsPage, {
        record: item,
        from: 'notification',
        event_id: item.table_id
      });
      return false;

    } else if (nottype == 'E') {
      this.navCtrl.setRoot(EventDetailsEventPage, {
        record: item,
        from: 'notification',
        event_id: item.table_id
      });
      return false;
    } else if (nottype == 'S') {
      this.navCtrl.setRoot(EventDetailsServicePage, {
        record: item,
        from: 'notification',
        event_id: item.table_id
      });
      return false;

    }

  }
  ionViewWillEnter() {


    this.reportData.startindex = 0;
    this.reportData.sort = "service_id";
    this.doNotification();

    // Atmentioned Tag Storage
  }

  doRefresh(refresher) {

    this.reportData.startindex = 0;
    this.notificationAllLists = [];
    this.doNotification();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  doNotification() {

    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "comapny";
    }
    // let editItem = this.NP.get("record");
    let urlstr;
    if (this.conf.isUTC() > 0) {
      urlstr = this.apiServiceURL + "/getpushnotification_app?ses_login_id=" + this.userId+ "&timezoneoffset=" + Math.abs(this.timezoneoffset);
    } else {
      urlstr = this.apiServiceURL + "/getpushnotification_app?ses_login_id=" + this.userId;
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      // url: any = this.apiServiceURL + "/reporttemplate?is_mobile=1";
      url: any = urlstr;
    let res;
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();
        if (res.notification != undefined) {
          if (res.notification.length > 0) {
            this.conf.presentLoading(1);
            this.totalCount = res.notification.length;
            for (let notifications in res.notification) {

              let usericon = '';
              if (res.notification[notifications].usericon != '') {
                usericon = this.apiServiceURL + "/staffphotos/" + res.notification[notifications].usericon;
              } else {
                if (res.notification[notifications].notify_type != 'OA' && res.notification[notifications].notify_type != 'A') {
                  usericon = this.apiServiceURL + "/images/default.png";
                } else {
                  usericon = '';
                }
              }
              let cnt;
              if (res.notification[notifications].content == undefined) {
                cnt = '';
              } else if (res.notification[notifications].content == 'undefined') {
                cnt = '';
              } else if (res.notification[notifications].content == '') {
                cnt = '';
              } else {
                cnt = res.notification[notifications].content;
              }
              let con;
              if (cnt != '') {
                con = cnt.replace("<br />", "<br>");
              }else{
                con='';
              }
              let warn_tripped_status;
              let priority;
              if (res.notification[notifications].notify_type == 'OA') {
                warn_tripped_status = con.split("<br>")[0];
                if (warn_tripped_status != '') {
                  warn_tripped_status = warn_tripped_status.replace("\n", "");;
                } else {
                  warn_tripped_status = '';
                }

                let fls = res.notification[notifications].content.includes('Fls');
                let wrn = res.notification[notifications].content.includes('Wrn');

                priority = res.notification[notifications].priority;
                if (fls > 0) {
                  priority = 3;
                }
                if (wrn > 0) {
                  priority = 2;
                }
              }
              if (res.notification[notifications].notify_type == 'A') {
                warn_tripped_status = con.split("<br>")[0];
                if (warn_tripped_status != '') {
                  warn_tripped_status = warn_tripped_status.replace("\n", "");;
                } else {
                  warn_tripped_status = '';
                }
                let fls = res.notification[notifications].content.includes('Fls');
                let wrn = res.notification[notifications].content.includes('Wrn');

                priority = res.notification[notifications].priority;
                if (fls > 0) {
                  priority = 3;
                }
                if (wrn > 0) {
                  priority = 2;
                }
              }


              let unread = '';

              if (res.notification[notifications].notify_to_readstatus == 0) {
                unread = 'unread';
              } else {
                unread = 'read';
              }

              this.notificationAllLists.push({
                table_id: res.notification[notifications].table_id,
                notify_to_readstatus: unread,
                photo: usericon,
                notify_type: res.notification[notifications].notify_type,
                content: res.notification[notifications].content,
                date_time: res.notification[notifications].date_time,
                timesince: res.notification[notifications].timesince,
                priority: priority,
                notify_by_name: res.notification[notifications].notify_by_name
              });

              if (res.notification.length == parseInt(notifications) + 1) {
                this.conf.presentLoading(0);
              }

              this.items = this.mockProvider.getData(this.notificationAllLists, 0, this.pageperrecord);
            }

            this.reportData.startindex += this.reportData.results;
          } else {
            this.totalCount = 0;
          }
        }else{         
          this.totalCount = 0;
        }


      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  doAdd() {
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(AddserviceinfoPage, {
      record: this.NP.get("record"),
      act: 'Add'
    });
  }


  doRequest() {
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(AddrequestsupportPage, {
      record: this.NP.get("record"),
      act: 'Add'
    });
  }



  doEdit(item, act) {
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(AddserviceinfoPage, {
      record: item,
      act: 'Edit'
    });
  }

  





  previous() {
    if (this.previousPage == 'UnitsPage') {
      this.navCtrl.setRoot(UnitsPage);
    } else if (this.previousPage == 'CalendarPage') {
      this.navCtrl.setRoot(CalendarPage);
    } else if (this.previousPage == 'MessagesPage') {
      this.navCtrl.setRoot(MessagesPage);
    } else if (this.previousPage == 'OrgchartPage') {
      this.navCtrl.setRoot(OrgchartPage);
    } else if (this.previousPage == 'DashboardPage') {
      this.navCtrl.setRoot(DashboardPage);
    } else {
      this.navCtrl.setRoot(DashboardPage);
    }
  }


  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.notificationAllLists, this.items.length, this.pageperrecord).then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push(newData[i]);
      }
      infiniteScroll.complete();
      if (this.items.length >= this.totalCount) {
        this.isInfiniteHide = false
      }
    });
  }
}


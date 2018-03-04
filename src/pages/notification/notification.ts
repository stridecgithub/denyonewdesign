import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
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
/**
 * Generated class for the ServicinginfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers: [Config]
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
      results: 8
    }
  public userId: any;
  public notificationAllLists = [];
  public loginas: any;
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  public networkType: string;
  public totalCount;
  constructor(private conf: Config, public platform: Platform, private sanitizer: DomSanitizer, public http: Http,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public navCtrl: NavController) {
    this.pageTitle = 'Notifications';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    this.previousPage = this.navCtrl.getActive().name;



    platform.registerBackButtonAction(() => {
      console.log(this.previousPage);
      this.previous();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    localStorage.setItem("fromModule", "NotificationPage");
  }
  notificationdetails(item, nottype) {
    console.log(nottype);
    console.log(JSON.stringify(item));


    let body: string = "is_mobile=1&loginid=" + this.userId +
      "&table_id=" + item.table_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/changestatusapibell_list";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));

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

    if (this.NP.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
    }
    this.reportData.startindex = 0;
    this.reportData.sort = "service_id";
    this.doNotification();

    // Atmentioned Tag Storage
  }

  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.notificationAllLists = [];
    this.doNotification();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doNotification();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  doNotification() {
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "comapny";
    }
    // let editItem = this.NP.get("record");

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      // url: any = this.apiServiceURL + "/reporttemplate?is_mobile=1";
      url: any = this.apiServiceURL + "/getpushnotification_app?ses_login_id=" + this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log("UCS" + JSON.stringify(res))
        if (res.notification != undefined) {
          if (res.notification.length > 0) {
            for (let notifications in res.notification) {
              // let isphoto = 0;
              // if (res.notification[notifications].id != 'null') {
              //   isphoto = 1;
              // }
              // if (res.notification[notifications].id != null) {
              //   isphoto = 1;
              // }
              // if (res.notification[notifications].id != '') {
              //   isphoto = 1;
              // }
              let usericon
              if (res.notification[notifications].usericon != '') {
                usericon = this.apiServiceURL + "/staffphotos/" + res.notification[notifications].usericon;
              } else {
                usericon = this.apiServiceURL + "/images/default.png";
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
              }
              console.log("coon" + con);
              let warn_tripped_status;
              // if (res.notification[notifications].notify_type == 'OA') {
              //   warn_tripped_status = con.split("<br>")[0];
              //   if (warn_tripped_status != '') {
              //     warn_tripped_status = warn_tripped_status;
              //   } else {
              //     warn_tripped_status = '';
              //   }
              // }
              // if (res.notification[notifications].notify_type == 'A') {
              //   warn_tripped_status = con.split("<br>")[2];
              //   if (warn_tripped_status != '') {
              //     warn_tripped_status = warn_tripped_status.replace("\n", "");;
              //   } else {
              //     warn_tripped_status = '';
              //   }
              //   console.log("Alarm Warning Status:" + warn_tripped_status);
              // }


              this.notificationAllLists.push({
                table_id: res.notification[notifications].table_id,
                notify_to_readstatus: res.notification[notifications].notify_to_readstatus,
                photo: usericon,
                notify_type: res.notification[notifications].notify_type,
                content: res.notification[notifications].content,
                date_time: res.notification[notifications].date_time,
                timesince: res.notification[notifications].timesince,
                priority: res.notification[notifications].priority,
                notify_by_name: res.notification[notifications].notify_by_name
              });
              console.log(JSON.stringify(this.notificationAllLists));
            }
            this.totalCount = res.totalCount;
            this.reportData.startindex += this.reportData.results;
          } else {
            //this.totalCount = 0;
          }
        }
        // console.log("Total Record:2" + this.totalCount);

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

  doConfirm(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this unit group?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.notificationAllLists.length; q++) {
            if (this.notificationAllLists[q] == item) {
              this.notificationAllLists.splice(q, 1);
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
  deleteEntry(recordID) {
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
          this.conf.sendNotification(data.json().msg[0]['result']);
          //this.conf.sendNotification(`Services info was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
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



}


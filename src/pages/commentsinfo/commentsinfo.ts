import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { AddcommentsinfoPage } from '../addcommentsinfo/addcommentsinfo';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
import { EventDetailsPage } from '../event-details/event-details';
import { EventDetailsServicePage } from '../event-details-service/event-details-service';
import { ServicingDetailsPage } from "../servicing-details/servicing-details";
import { AddalarmPage } from "../addalarm/addalarm";
import { ModalPage } from '../modal/modal';
import { ServicedetailsPage } from "../servicedetails/servicedetails";
/**
 * Generated class for the CommentsinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navCtrligation for more info on
 * Ionic pages and navCtrligation.
 */


@Component({
  selector: 'page-commentsinfo',
  templateUrl: 'commentsinfo.html',
  providers: [Config]
})
export class CommentsinfoPage {
  public pageTitle: string;
  public unit_id: any;
  public msgcount: any;
  public notcount: any;
  public atMentionedInfo = [];
  public reportData: any =
    {
      status: '',
      sort: 'comment',
      sortascdesc: 'asc',
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
  public footerBar = [];
  public userId: any;
  public reportAllLists = [];
  public loginas: any;
  public udetails: any;
 
  public COMMENTCREATEACCESS: any;
  public COMMENTEDITACCESS: any;
  public COMMENTDELETEACCESS: any;
  public comments: any;
  public service_subject: any;
  public addedImgLists = [];
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  public networkType: string;
  public totalCount;
  public sortLblTxt: string = 'Comment';
  constructor(public modalCtrl: ModalController, private platform: Platform, private conf: Config, public http: Http,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public navCtrl: NavController) {
    this.pageTitle = 'Comments';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.udetails = localStorage.getItem("unitdetails");
   
    this.COMMENTCREATEACCESS = localStorage.getItem("UNITS_COMMENTS_CREATE");
    this.COMMENTEDITACCESS = localStorage.getItem("UNITS_COMMENTS_EDIT");
    this.COMMENTDELETEACCESS = localStorage.getItem("UNITS_COMMENTS_DELETE");
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

  ionViewDidLoad() {
    console.log('ionViewDidLoadCommentsinfoPage');
  }

  presentModal(unit) {
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  doAlarmView(event_id, event_type) {
    this.navCtrl.setRoot(EventDetailsPage, {
      event_id: event_id,
      event_type: event_type,
      from: 'commentinfo'
    });
  }



  doServiceView(event_id, event_type, eventdata) {
    this.navCtrl.setRoot(ServicingDetailsPage, {
      event_id: event_id,
      event_type: event_type,
      eventdata: eventdata,
      from: 'commentinfo',
      record: eventdata,
      act: 'View'
    });
  }

  doCommentView(event_id, event_type, eventdata) {
    console.log("Event Id" + event_id);
    console.log("event_type" + event_type);
    console.log("eventdata" + JSON.stringify(eventdata));
    this.navCtrl.setRoot(CommentdetailsPage, {
      event_id: event_id,
      event_type: event_type,
      eventdata: eventdata,
      from: 'commentinfo'
    });
  }


  ionViewWillEnter() {

    let iframeunitid = localStorage.getItem("iframeunitId");
    console.log("iframeunitid:" + iframeunitid);
    // UnitDetails Api Call		
    console.log("Comment Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
    let editItem = this.NP.get("record");
    let from = this.NP.get("from");
    console.log("From:" + from);
    console.log("Comment info loading:" + editItem);
    console.log("Comment info loading JSON:" + JSON.stringify(editItem));
    let unitid = localStorage.getItem("iframeunitId");
    if (unitid == undefined) {
      if (from == 'service') {
        console.log("Service");
        unitid = editItem.service_unitid;
      } else if (from == 'alarm') {
        console.log("Alarm");
        unitid = editItem.alarm_unitid;
      } else {
        console.log("Comment");
        unitid = editItem.comment_unit_id;
      }
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
    this.doService();
    //this.unit_id = this.NP.get("record").unit_id;
    // Atmentioned Tag Storage
  }

  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doService();
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
      this.doService();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  doService() {
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "comapny";
    }
    let editItem = this.NP.get("record");


    let iframeunitid = localStorage.getItem("iframeunitId");
    console.log("iframeunitid:" + iframeunitid);
    if (iframeunitid == 'undefined') {
      iframeunitid = '0';
    }
    if (iframeunitid == undefined) {
      iframeunitid = '0';
    }

    if (iframeunitid != undefined && iframeunitid != 'undefined') {
      this.unit_id = iframeunitid;
    } else {
      this.unit_id = editItem.service_unitid;
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/comments?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitid=" + localStorage.getItem("unitId") + "&loginid=" + this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.comments.length);
        console.log("2" + res.comments);
        if (res.comments.length > 0) {
          this.reportAllLists = res.comments;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
          this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCount = 0;
          this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCount);

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  previous() {

    this.navCtrl.push(UnitdetailsPage, {
      record: this.NP.get("record"),
      tabs: 'dataView'
    });
  }

  doAdd() {
    this.service_subject = '';
    this.comments = '';
    this.addedImgLists = [];
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(AddcommentsinfoPage, {
      record: this.NP.get("record"),
      act: 'Add',
      unit_id: this.unit_id
    });
  }




  doEdit(item, act, type) {
    console.log(type);
    if (type.toLowerCase() == 'c') {
      console.log("comment")
      localStorage.setItem("microtime", "");
      this.navCtrl.setRoot(AddcommentsinfoPage, {
        record: item,
        act: 'Edit',
        from: 'commentinfo'
      });
    }

    if (type.toLowerCase() == 's') {
      // this.navCtrl.setRoot(ServicingDetailsPage, {
      //   record: item,

      //   from: 'commentinfo',
      // });

      this.navCtrl.setRoot(ServicedetailsPage, {
        record: item,
        act: 'Edit',
        from: 'commentinfo'
      });


    }

    if (type.toLowerCase() == 'r') {
      // this.navCtrl.setRoot(ServicingDetailsPage, {
      //   record: item,
      //   act: 'Edit',
      //   from: 'commentinfo',
      // });

      this.navCtrl.setRoot(ServicedetailsPage, {
        record: item,
        act: 'Edit',
        from: 'commentinfo'
      });

    }


    if (type.toLowerCase() == 'a') {
      console.log("Alarm")
      // localStorage.setItem("microtime", "");
      if (item.alarm_assigned_to == '') {
        this.navCtrl.setRoot(AddalarmPage, {
          record: item,
          act: act,
          from: 'commentinfo',
        });
      }
      else {
        this.conf.sendNotification("Alarm already assigned");
      }
    }
    /*
   if (type.toLowerCase() == 'r') {
     this.conf.sendNotification("Not Applicable!!!");
   }


 }
 /*details(item, act, type) {
  console.log(JSON.stringify(item));
  console.log(act);
  console.log(type);
  if (type.toLowerCase() == 'c') {
    localStorage.setItem("microtime", "");
    this.navCtrl.push(CommentdetailsPage, {
      record: item,
      act: 'Edit'
    });
  }
 if (type.toLowerCase() == 's') {
    localStorage.setItem("microtime", "");
    this.navCtrl.push(ServicedetailsPage, {
      record: item,
      act: 'Edit',
      from:'comment'
    });
  }
  if (type.toLowerCase() == 'r') {
    localStorage.setItem("microtime", "");
    this.navCtrl.push(ServicedetailsPage, {
      record: item,
      act: 'Edit',
      from:'comment'
    });
  }
  if(type.toLowerCase()=='a')
  {
    this.navCtrl.push(AlarmlistdetailPage, {
      record: item,
      act: act,
      from:'comment'

     
    });
  }*/
  }

  doConfirm(item, ty) {

    if (ty.toLowerCase() == 'c') {
      console.log("Deleted Id" + item.comment_id);
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this comment?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            this.deleteEntry(item.comment_id, item.event_type);
            for (let q: number = 0; q < this.reportAllLists.length; q++) {
              if (this.reportAllLists[q] == item) {
                this.reportAllLists.splice(q, 1);
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
    if (ty.toLowerCase() == 's') {
      console.log("Deleted Id" + item.service_id);
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this Service?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            this.deleteEntry(item.service_id, item.event_type);
            for (let q: number = 0; q < this.reportAllLists.length; q++) {
              if (this.reportAllLists[q] == item) {
                this.reportAllLists.splice(q, 1);
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
    if (ty.toLowerCase() == 'r') {
      console.log("Deleted Id" + item.service_id);
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this Service?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            this.deleteEntry(item.service_id, item.event_type);
            for (let q: number = 0; q < this.reportAllLists.length; q++) {
              if (this.reportAllLists[q] == item) {
                this.reportAllLists.splice(q, 1);
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
  deleteEntry(recordID, types) {
    if (types.toLowerCase() == 'c') {
      let
        //body: string = "key=delete&recordID=" + recordID,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/comments/" + recordID + "/1/delete";
      this.http.get(url, options)
        .subscribe(data => {
          // If the request was successful notify the user
          if (data.status === 200) {

            // this.conf.sendNotification(`Comments was successfully deleted`);
            this.conf.sendNotification(data.json().msg[0]['result']);
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }
    if (types.toLowerCase() == 's') {
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
            // this.conf.sendNotification(`Service was successfully deleted`);
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }
    if (types.toLowerCase() == 'r') {
      let
        //body: string = "key=delete&recordID=" + recordID,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/services/" + recordID + "/1/delete";
      console.log("DURL" + url);
      this.http.get(url, options)
        .subscribe(data => {
          // If the request was successful notify the user
          if (data.status === 200) {
            this.conf.sendNotification(data.json().msg[0]['result']);
            //this.conf.sendNotification(`Service was successfully deleted`);
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }

  }

  doSort() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Comment',
          value: 'comment'
        },
        {
          type: 'radio',
          label: 'Service',
          value: 'service',
        },
        {
          type: 'radio',
          label: 'Name',
          value: 'name',
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
              if (data == 'service') {
                this.sortLblTxt = 'Service';
              } else if (data == 'comment') {
                this.sortLblTxt = 'Comment';
              } else if (data == 'name') {
                this.sortLblTxt = 'Name';
              }
              this.reportData.startindex = 0;
              this.reportAllLists = [];
              this.doService();
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
              if (data == 'service') {
                this.sortLblTxt = 'Service';
              } else if (data == 'comment') {
                this.sortLblTxt = 'Comment';
              } else if (data == 'name') {
                this.sortLblTxt = 'Name';
              }
              this.reportData.startindex = 0;
              this.reportAllLists = [];
              this.doService();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doService();
  }
}
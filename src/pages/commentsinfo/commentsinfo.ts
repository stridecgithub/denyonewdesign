import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ModalController, App } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { AddcommentsinfoPage } from '../addcommentsinfo/addcommentsinfo';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
import { EventDetailsPage } from '../event-details/event-details';
//import { EventDetailsServicePage } from '../event-details-service/event-details-service';
import { ServicingDetailsPage } from "../servicing-details/servicing-details";
import { AddalarmPage } from "../addalarm/addalarm";
import { ModalPage } from '../modal/modal';
import { ServicedetailsPage } from "../servicedetails/servicedetails";
import { MockProvider } from '../../providers/pagination/pagination';
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
      sort: 'comment_id',
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
    colorcodeindications: '',
    mapicon: ''
  }
  footerBar: number = 1;
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
  roleId;
  itemwidth: any;
  devicewidth: any;
  deviceheight: any;
  h3width = '';
  denyosupporttext;
  items: string[];
  isInfiniteHide: boolean;
  pageperrecord;
  constructor(private mockProvider: MockProvider, private app: App, public modalCtrl: ModalController, private platform: Platform, private conf: Config, public http: Http,
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


    this.pageTitle = 'Comments';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.udetails = localStorage.getItem("unitdetails");

    this.COMMENTCREATEACCESS = localStorage.getItem("UNITS_COMMENTS_CREATE");
    this.COMMENTEDITACCESS = localStorage.getItem("UNITS_COMMENTS_EDIT");
    this.COMMENTDELETEACCESS = localStorage.getItem("UNITS_COMMENTS_DELETE");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.pageperrecord = this.conf.pagePerRecord();


    // Footer Menu Access - End
  }



  presentModal(unit) {
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
    this.navCtrl.setRoot(CommentdetailsPage, {
      event_id: event_id,
      event_type: event_type,
      eventdata: eventdata,
      from: 'commentinfo'
    });
  }


  ionViewWillEnter() {
    if (this.devicewidth <= 320) {
      this.itemwidth = 'device-320-item-width';
      this.h3width = '230px';
      this.denyosupporttext = 'denyo-support-text-320';
    } else {
      this.itemwidth = '';
      this.h3width = '270px';
      this.denyosupporttext = 'denyo-support-text';
    }
    // let iframeunitid = localStorage.getItem("iframeunitId");

    let editItem = this.NP.get("record");
    let from = this.NP.get("from");

    let unitid = localStorage.getItem("iframeunitId");
    if (unitid == undefined) {
      if (from == 'service') {

        unitid = editItem.service_unitid;
      } else if (from == 'alarm') {

        unitid = editItem.alarm_unitid;
      } else {

        unitid = editItem.comment_unit_id;
      }
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
    this.doService();
    //this.unit_id = this.NP.get("record").unit_id;
    // Atmentioned Tag Storage
  }

  doRefresh(refresher) {

    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doService();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doService() {

    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "comapny";
    }
    let editItem = this.NP.get("record");


    let iframeunitid = localStorage.getItem("iframeunitId");
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
        this.conf.presentLoading(1);
        res = data.json();

        if (res.comments.length > 0) {
          this.reportAllLists = res.comments;

          this.items = this.mockProvider.getData(this.reportAllLists, 0, this.pageperrecord);

          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
          this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCount = 0;
          this.loadingMoreDataContent = 'No More Data';
        }

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      }, () => {
        console.log('completed');
        this.conf.presentLoading(0);
      });

  }

  previous() {

    this.navCtrl.setRoot(UnitdetailsPage, {
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
    if (type.toLowerCase() == 'c') {
      localStorage.setItem("microtime", "");
      this.navCtrl.setRoot(AddcommentsinfoPage, {
        record: item,
        act: 'Edit',
        from: 'commentinfo'
      });
    }

    if (type.toLowerCase() == 's') {
      //  this.navCtrl.setRoot(ServicingDetailsPage, {
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
      //  this.navCtrl.setRoot(ServicingDetailsPage, {
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

  }

  doConfirm(item, ty) {

    if (ty.toLowerCase() == 'c') {

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
    this.isInfiniteHide = true;
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
              this.items = [];
              this.doService();
            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            if (data != undefined) {
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
              this.items = [];
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
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.items = [];
    this.doService();
  }

  doInfinite(infiniteScroll) {
    this.mockProvider.getAsyncData(this.reportAllLists, this.items.length, this.pageperrecord).then((newData) => {
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
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavController, AlertController, NavParams, Platform, Gesture, PopoverController, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { PopoverPage } from '../popover/popover';
import { Config } from '../../config/config';
import { DashboardPage } from "../dashboard/dashboard";
import { AddorgchartonePage } from "../addorgchartone/addorgchartone";
import { ComposePage } from "../compose/compose";
//import { PermissionPage } from '../permission/permission';
//declare var jQuery: any;
/**
 * Generated class for the UnitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-orgchart',
  templateUrl: 'orgchart.html',
  providers: [Config]
})
export class OrgchartPage {
  private gesture: Gesture;
  @ViewChild('image') ElementRef;
  public responseResultCompanyGroup: any;
  public pageTitle: string;
  public loginas: any;
  public htmlContent;
  footerBar: number = 4;
  public devicewidth;
  public deviceheight;
  private apiServiceURL: string = "";
  public networkType: string;
  public totalCount;
  pet: string = "ALL";
  public msgcount: any;
  public notcount: any;
  public reportData: any =
    {
      status: '',
      sort: 'unitgroup_id',
      sortascdesc: 'asc',
      startindex: 0,
      results: 8
    }
  public parents = [];
  public colorListArr: any;
  public userId: any;
  public companyId: any;
  public CREATEACCESS: any;
  public tap: number = 600;
  timeout: any;
  width: any;
  height: any;
  pinchW: any;
  pinchH: any;
  rotation: any;
  imgwidth: any;
  imgheight: any;
  imgradius: any;
  fontsize: any;

  iframeContent: any;
  public profilePhoto;

  constructor(public app: App, public viewCtrl: ViewController, private el: ElementRef, private conf: Config, public platform: Platform, public NP: NavParams, public popoverCtrl: PopoverController, public http: Http, public navCtrl: NavController,
    public alertCtrl: AlertController, public navParams: NavParams) {
    //this.width = 1;
    //this.height = 150";
    this.imgwidth = 80;
    this.imgheight = 80;
    this.imgradius = 40;
    this.fontsize = 11;
    this.pinchW = 1;
    this.pinchH = 1;
    this.rotation = 0;
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage);
      });
    });

    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    //Authorization Get Value




    this.CREATEACCESS = localStorage.getItem("SETTINGS_ORGCHART_CREATE");
    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();
    this.networkType = '';
    this.platform.ready().then(() => {
      this.devicewidth = platform.width();
      this.deviceheight = platform.height();


    });
    this.profilePhoto = localStorage.getItem

      ("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }






  }

  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }
  }

  pinchEvent(e) {
    //if (this.imgwidth >= 80 && this.imgwidth <= 250) {
    if (e.additionalEvent == 'pinchout') {

      this.fontsize = this.fontsize + 1;

      if (this.fontsize >= 32) {
        // this.fontsize = 32;
      }
      this.imgwidth = this.imgwidth + 1;
      this.imgheight = this.imgheight + 1;
      this.imgradius = parseInt(this.imgwidth) / 2;

     
    } else {
      this.fontsize = this.fontsize - 1;


      if (this.fontsize < 0) {
        this.fontsize = 11;
      }
      if (this.imgwidth >= 80) {

        if (this.fontsize >= 32) {
          // this.fontsize = 32;
        }

        if (this.fontsize < 0) {
          //this.fontsize = 11;
        }

        if (this.fontsize < 12) {
          // this.fontsize = 11;
        }
        this.imgwidth = this.imgwidth - 1;
        this.imgheight = this.imgheight - 1;
        this.imgradius = parseInt(this.imgwidth) / 2;
      }
    }
    //this.rotation = e.rotation;



    if (this.timeout == null) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.updateWidthHeightPinch();
      }, 1000);
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.updateWidthHeightPinch();
      }, 1000);
    }
    //}
  }


  pinchEventManual(e) {
    //if (this.imgwidth >= 80 && this.imgwidth <= 250) {
   
    if (e == 'pinchout') {

      this.fontsize = this.fontsize + 1;

      if (this.fontsize >= 32) {
        this.fontsize = 32;
      }
      this.imgwidth = this.imgwidth + 1;
      this.imgheight = this.imgheight + 1;
      this.imgradius = parseInt(this.imgwidth) / 2;

     

    } else {
      if (this.imgwidth >= 80) {
        this.fontsize = this.fontsize - 1;
        if (this.fontsize >= 32) {
          this.fontsize = 32;
        }



        if (this.fontsize < 0) {
          this.fontsize = 11;
        }

        if (this.fontsize < 12) {
          this.fontsize = 11;
        }

        this.imgwidth = this.imgwidth - 1;
        this.imgheight = this.imgheight - 1;
        this.imgradius = parseInt(this.imgwidth) / 2;
     
      }


    }


    // alert(
    //   "Font Size:" + this.fontsize + "\n" + "Image Width:" + this.imgwidth + "\n Image Height:" + this.imgheight + "\n Image Radius:" + this.imgradius
    // )
    // this.rotation = e.rotation;

    if (this.timeout == null) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.updateWidthHeightPinch();
      }, 1000);
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.updateWidthHeightPinch();
      }, 1000);
    }
    // }
  }


  updateWidthHeightPinch() {
    this.pinchW = this.width;
    this.pinchH = this.height;
  }

  presentPopover(myEvent, item) {
    let popover = this.popoverCtrl.create(PopoverPage, { item: item });
    popover.present({
      ev: myEvent,
    });
    popover.onWillDismiss(data => {


      if (data != null) {
        if (data.length == 1) {
          if (data[0].act == 'delete') {
            this.doDelete(data);
          } else if (data[0].act == 'hashtag') {
            this.doCompose(data[0].hashtag);
          }
        } else {
          this.doEdit(data, 'edit');
        }


      } else {
        // this.previous();
      }
    });
  }
  doCompose(to) {

    this.navCtrl.setRoot(ComposePage, { 'to': to });
  }
  doDelete(item) {

    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item[0].staff_id);
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
      url: any = this.apiServiceURL + "/staff/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.sendNotification(data.json().msg[0]['result']);
          // this.conf.sendNotification(`Non-user was successfully deleted`);

          this.parents = [];
          this.doOrgChart();
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
    this.companyId = val;
    this.parents = [];
    this.doOrgChart();
  }
  pageLoad() {


    //create gesture obj w/ ref to DOM element
    this.gesture = new Gesture(this.el.nativeElement);

    //listen for the gesture
    this.gesture.listen();



    //turn on listening for pinch or rotate events
    this.gesture.on('pinch', e => this.pinchEvent(e));

    localStorage.setItem("fromModule", "OrgchartPage");
    this.getCompanyGroupListData();


    let compId = this.NP.get("companyId");
    if (compId > 0) {
      this.pet = compId;
      this.companyId = compId;
    } else {
      // this.pet = "1";
      this.pet = this.companyId;
    }

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
    this.pageTitle = "Org Chart";
    this.reportData.startindex = 0;
    this.reportData.sort = "unitgroup_id";


  }
  ionViewDidLoad() {
    this.pageLoad();
  }
  ionViewDidEnter() {
    this.pageLoad();
  }
  doOrgChart() {
    this.conf.presentLoading(1);
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1";

    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);

        res = data.json();
        this.totalCount = res.totalCount;
        if (res.parents.length > 0) {
          this.parents = res.parents;



        }

      }, error => {
        this.networkType = this.conf.serverErrMsg();//+ "\n" + error;
      });

  }


  getCompanyGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId + "&pagename=orgchart";
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCompanyGroup = res.companies;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }


  doAdd() {
    localStorage.setItem("photofromgallery", "");
    this.navCtrl.setRoot(AddorgchartonePage, { 'companyId': this.companyId });
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);

  }
  doEdit(item, act) {
    if (act == 'edit') {
      localStorage.setItem("photofromgallery", "");
      this.navCtrl.setRoot(AddorgchartonePage, {
        record: item,
        act: act,
        'companyId': this.companyId
      });
    }
  }
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  redirectToUser() {
    this.navCtrl.setRoot(UnitsPage);
  }

  redirectToMessage() {
    // this.nav.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }
  redirectToMaps() {
    // this.nav.setRoot(MapsPage);
  }
  redirectToSettings() {
    // this.navCtrl.setRoot(OrgchartPage);
  }
}



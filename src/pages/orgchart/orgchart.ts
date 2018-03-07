import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavController, AlertController, NavParams, Platform, Gesture, PopoverController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { PopoverPage } from '../popover/popover';
import { Config } from '../../config/config';
import { DashboardPage } from "../dashboard/dashboard";
import { AddorgchartonePage } from "../addorgchartone/addorgchartone";

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
  //footerBar: number = 4;
  public footerBar = [];
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

  constructor(public viewCtrl: ViewController, private el: ElementRef, private conf: Config, public platform: Platform, public NP: NavParams, public popoverCtrl: PopoverController, public http: Http, public navCtrl: NavController,
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
    this.apiServiceURL = conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    //Authorization Get Value

    platform.registerBackButtonAction(() => {
      this.previous();
      // this.navCtrl.setRoot(DashboardPage);
    });



    this.CREATEACCESS = localStorage.getItem("SETTINGS_ORGCHART_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);


    //Authorization Get Value
    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
    this.networkType = '';
    this.platform.ready().then(() => {

      console.log('Device Resolution Width: ' + platform.width() + 16);
      console.log('Device Resolution Height: ' + platform.height());
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

    // Footer Menu Access - Start
    let footeraccessstorage = localStorage.getItem("footermenu");
    let footeraccessparams = this.navParams.get('footermenu');
    let footermenuacc;
    if (footeraccessparams != undefined) {
      footermenuacc = footeraccessparams;
    } else {
      footermenuacc = footeraccessstorage;
    }

    console.log("Footer Menu Access abc:-" + footermenuacc);
    // this.footerBar="0,"+footermenuacc;

    let footermenusplitcomma = footermenuacc.split(",");
    let dashboardAccess = footermenusplitcomma[0];
    let unitAccess = footermenusplitcomma[1];
    let calendarAccess = footermenusplitcomma[2];
    let messageAccess = footermenusplitcomma[3];
    let orgchartAccess = footermenusplitcomma[4];

    console.log("Footer Menu Access for Dashboard" + dashboardAccess);
    console.log("Footer Menu Access for Dashboard" + unitAccess);
    console.log("Footer Menu Access for Calendar" + calendarAccess);
    console.log("Footer Menu Access for Messagees" + messageAccess);
    console.log("Footer Menu Access for Org Chart" + orgchartAccess);
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
      colorcode: "rgba(60, 60, 60, 0.7)",
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
      colorcode: "#488aff",
      pageComponent: 'OrgchartPage'
    });

    console.log("Footer Access Loop Value:" + JSON.stringify(this.footerBar));
    //this.footerBar = "0";
    //let footerBar=this.footerBar.split(",");
    console.log("Final Footer Menu access:" + this.footerBar);

    // Footer Menu Access - End
  }



  pinchEvent(e) {
    console.log("pinchEvent" + JSON.stringify(e))
    console.log("pinchW is" + this.pinchW);
    console.log("pinchH is" + this.pinchH)

    console.log("Additional Event" + e.additionalEvent);
    if (e.additionalEvent == 'pinchout') {
      console.log("Additional Event pichout 1");

      this.fontsize = this.fontsize + 1;


      console.log("Image size above 80");
      this.imgwidth = this.imgwidth + 1;
      this.imgheight = this.imgheight + 1;
      this.imgradius = parseInt(this.imgwidth) / 2;

      /*this.width = this.pinchW * parseInt(e.scale) + parseInt(this.devicewidth);
      this.height = this.pinchH * parseInt(e.scale) + parseInt(this.deviceheight);
      this.imgwidth = this.pinchW * parseInt(e.scale) + this.imgwidth;
      this.imgheight = this.pinchH * parseInt(e.scale) + this.imgheight;
      this.imgradius = this.imgwidth + parseInt(e.scale) / 2;
      this.fontsize = this.fontsize + parseInt(e.scale);*/
      //this.imgwidth =

    } else {
      console.log("Additional Event pinch in 2");
      // if (this.imgwidth > 0 && this.imgheight > 0) {
      /* this.width = this.pinchW * parseInt(e.scale) - parseInt(this.devicewidth);
       this.height = this.pinchH * parseInt(e.scale) - parseInt(this.deviceheight);
       this.imgwidth = this.pinchW * parseInt(e.scale) - this.imgwidth;
       this.imgheight = this.pinchH * parseInt(e.scale) - this.imgheight;
       this.imgradius = this.imgwidth - parseInt(e.scale) / 2;
       this.fontsize = this.fontsize - parseInt(e.scale);*/
      //}

      this.fontsize = this.fontsize - 1;


      console.log("Image size above 80");
      this.imgwidth = this.imgwidth - 1;
      this.imgheight = this.imgheight - 1;
      this.imgradius = parseInt(this.imgwidth) / 2;

    }


    console.log("E Scale is" + e.scale);
    //console.log("Width is" + this.width);
    //console.log("Height is" + this.height);
    console.log("Image width is" + this.imgwidth);
    console.log("Image height is" + this.imgheight);
    console.log("Image radius is" + this.imgradius);

    this.rotation = e.rotation;

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
      console.log(JSON.stringify(data));
      if (data != null) {
        if (data.length == 1) {
          this.doDelete(data);
        } else {
          this.doEdit(data, 'edit');
        }
      }else{
        this.previous();
      }
    });
  }
  doDelete(item) {
    console.log("Deleted Id" + item[0].staff_id);
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
    console.log('ionViewDidLoad OrgchartPage');
    localStorage.setItem("fromModule", "OrgchartPage");
    this.getCompanyGroupListData();


    let compId = this.NP.get("companyId");
    console.log('A' + compId);
    if (compId > 0) {
      console.log('B')
      this.pet = compId;
      this.companyId = compId;
    } else {
      console.log('C')
      this.pet = this.companyId;
    }

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
    this.pageTitle = "Org Chart";
    this.reportData.startindex = 0;
    this.reportData.sort = "unitgroup_id";

    //this.doOrgChart();


    // console.log(this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1");
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
    console.log(url);
    // console.log(body);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        // console.log("Orgchart Response Success:" + JSON.stringify(data.json()));
        res = data.json();
        this.totalCount = res.totalCount;
        console.log("Total Count:" + this.totalCount);
        console.log("Parent" + JSON.stringify(res));
        if (res.parents.length > 0) {
          this.parents = res.parents;
          // this.responseResultCompany = res.companies;
          //console.log("1:"+JSON.stringify(this.responseResultCompany));


        }

      }, error => {
        this.networkType = this.conf.serverErrMsg();//+ "\n" + error;
      });

  }

  /*previous() {
    this.nav.setRoot(MyaccountPage);
  }*/

  getCompanyGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId + "&pagename=orgchart";
    let res;
    console.log("BALA" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCompanyGroup = res.companies;
        console.log(res.companies);
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }


  doAdd() {
    this.navCtrl.setRoot(AddorgchartonePage, { 'companyId': this.companyId });
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);

  }
  doEdit(item, act) {
    if (act == 'edit') {
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
    //this.nav.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }
  redirectToMaps() {
    //this.nav.setRoot(MapsPage);
  }
  redirectToSettings() {
    //this.navCtrl.setRoot(OrgchartPage);
  }
}



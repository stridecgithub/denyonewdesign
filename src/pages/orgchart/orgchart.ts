import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Platform, Gesture ,PopoverController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { PopoverPage } from '../popover/popover';
import { Config } from '../../config/config';
import { DashboardPage } from "../dashboard/dashboard";
/**
 * Generated class for the UnitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
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

  public devicewidth;
  public deviceheight;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
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
  public VIEWACCESS: any;
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
  constructor(private el: ElementRef, private conf: Config, public platform: Platform, public NP: NavParams, public popoverCtrl: PopoverController, public http: Http, public navCtrl: NavController,
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
    this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    //Authorization Get Value




    this.VIEWACCESS = localStorage.getItem("SETTINGS_ORGCHART_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("SETTINGS_ORGCHART_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);


    //Authorization Get Value
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
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
    this.profilePhoto = this.apiServiceURL +

      "/staffphotos/" + this.profilePhoto;
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

          this.conf.sendNotification(`Orgchart was successfully deleted`);
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


  ionViewDidLoad() {

    //create gesture obj w/ ref to DOM element
    this.gesture = new Gesture(this.el.nativeElement);

    //listen for the gesture
    this.gesture.listen();



    //turn on listening for pinch or rotate events
    this.gesture.on('pinch', e => this.pinchEvent(e));
    console.log('ionViewDidLoad OrgchartPage');
    localStorage.setItem("fromModule", "OrgchartPage");
  }


  onSegmentChanged(val) {
    this.companyId = val;
    this.parents = [];
    this.doOrgChart();
  }

  ionViewWillEnter() {
    this.getCompanyGroupListData();


    let compId = this.NP.get("companyId")
    if (compId > 0) {
      this.pet = compId;
      this.companyId = compId;
    } else {
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
    if (this.VIEWACCESS > 0) {
      this.doOrgChart();
    }

    console.log(this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1");
  }
  doOrgChart() {
    //this.conf.presentLoading(1);
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1&id=" + this.userId;
    console.log(url);
    // console.log(body);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        // this.conf.presentLoading(0);
        // console.log("Orgchart Response Success:" + JSON.stringify(data.json()));
        res = data.json();
        console.log("Parent" + JSON.stringify(res));
        if (res.parents.length > 0) {
          this.parents = res.parents;
          // this.responseResultCompany = res.companies;
          //console.log("1:"+JSON.stringify(this.responseResultCompany));
        } else {
          //this.totalCount = 0;
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
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId;
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
    //this.navCtrl.setRoot(AddorgchartonePage);
  }
  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
  doEdit(item, act) {
    /*if (act == 'edit') {
      this.navCtrl.setRoot(AddorgchartonePage, {
        record: item,
        act: act
      });
    }*/
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



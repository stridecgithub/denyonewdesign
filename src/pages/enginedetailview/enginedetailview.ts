import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
import { ModalPage } from '../modal/modal';
/**
 * Generated class for the EnginedetailviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-enginedetailview',
  templateUrl: 'enginedetailview.html',
  providers: [Config]
})
export class EnginedetailviewPage {
  footerBar: number = 1;
  public pageTitle: string;
  public loginas: any;
  public unitid: any;
  public htmlContent;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public totalCount;
  pet: string = "ALL";
  public reportData: any =
    {
      status: '',
      sort: 'unitgroup_id',
      sortascdesc: 'asc',
      startindex: 0,
      results: 8
    }
  public unitDetailData: any = {
    userId: '',
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
  public companyId: any;
  iframeContent: any;
  public msgcount: any;
  public notcount: any;
  
  constructor(public modalCtrl: ModalController, private conf: Config, public platform: Platform, public http: Http, public navCtrl: NavController, private sanitizer: DomSanitizer,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.unitid = localStorage.getItem("unitId");
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
    console.log('ionViewDidLoad EnginedetailviewPage');
    localStorage.setItem("fromModule", "EnginedetailviewPage");

    // UnitDetails Api Call		
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
        "&unitid=" + this.unitid;
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

    if (this.NP.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
      let editItem = this.NP.get("record");
      this.unitDetailData.runninghr = editItem.runninghr;
      this.unitDetailData.gen_status = editItem.gen_status;
      this.unitDetailData.nextservicedate = editItem.nextservicedate;
      let favorite;
      if (this.NP.get("record").favoriteindication == 'favorite') {
        favorite = "favorite";
      }
      else {
        favorite = "unfavorite";

      }
      this.unitDetailData.favoriteindication = favorite;

      this.unitDetailData.unit_id = localStorage.getItem("unitId");
      if (this.unitDetailData.unit_id == undefined) {
        this.unitDetailData.unit_id = editItem.unit_id;
      }
      if (this.unitDetailData.unit_id == 'undefined') {
        this.unitDetailData.unit_id = editItem.unit_id;
      }
      this.unitDetailData.unitname = localStorage.getItem("unitunitname");
      this.unitDetailData.location = localStorage.getItem("unitlocation");
      this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
      this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
      console.log("Unit Details Color Code:" + this.unitDetailData.colorcodeindications);
      this.unitDetailData.lat = localStorage.getItem("unitlat");
      this.unitDetailData.lng = localStorage.getItem("unitlng");
      this.unitDetailData.rh = localStorage.getItem("runninghr");
      this.unitDetailData.ns = localStorage.getItem("nsd");

    }

    this.pageTitle = "Engine Detail";
    this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + this.unitid + "/1/enginedetails");


  }



  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }


  previous() {
    this.navCtrl.setRoot(UnitdetailsPage, {
      record: this.NP.get("record"),
      tabs: 'dataView'
    });
  }

}

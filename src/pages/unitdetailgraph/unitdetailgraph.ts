import { Component } from '@angular/core';
import { Platform,  NavController, NavParams, ModalController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ModalPage } from '../modal/modal';
/**
 * Generated class for the TrendlinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-unitdetailgraph',
  templateUrl: 'unitdetailgraph.html',
  providers: [Config]
})
export class UnitdetailgraphPage {
 // tabBarElement: any;
  iframeContent: any;
  public userId: any;
  title;
  public unitDetailData: any = {

    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: ''
  }
  private apiServiceURL: string = "";

  constructor(
    public modalCtrl: ModalController, public platfom: Platform, private conf: Config, public http: Http, private sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams) {
    this.apiServiceURL = conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platfom.registerBackButtonAction(() => {
      this.previous();
    });
  }
  presentModal(unit) {
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  ionViewWillLeave() {
    ///this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    console.log("Navigation data of item" + JSON.stringify(this.navParams.get("record")));
    //this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad TrendlinePage');
    console.log("Alaram Id" + this.navParams.get("alarmid"));
    let unit_id = this.navParams.get("unit_id");
    let graphname = this.navParams.get("graphname");
    if (graphname == 'LOADPOWERFACTOR') {
      this.title = 'Load Power Factore';
      //http://denyoappv2.stridecdev.com/{{this.unitDetailData.unit_id}}/LOADPOWERFACTOR/0/showgraph
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/LOADPOWERFACTOR/1/showgraph");
    } else if (graphname == 'OILPRESSURE') {
      this.title = 'Oil Pressure';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/OILPRESSURE/1/showgraph");
    } else if (graphname == 'BATTERYVOLTAGE') {
      this.title = 'Battery Voltage';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/BATTERYVOLTAGE/1/showgraph");
    } else if (graphname == 'LOADPOWERFACTOR') {
      this.title = 'Load Power Factor';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/LOADPOWERFACTOR/1/showgraph");
    } else if (graphname == 'COLLANTTEMP') {
      this.title = 'Collanttemp';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/COLLANTTEMP/1/showgraph");
    } else if (graphname == 'LOADPOWER') {
      this.title = 'Load Power';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/LOADPOWER/1/showgraph");
    } else if (graphname == 'VOLT1') {
      this.title = 'Voltage';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/VOLT1/1/showgraph");
    } else if (graphname == 'CURRENT1') {
      this.title = 'Current';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/CURRENT1/1/showgraph");
    } else if (graphname == 'FREQ') {
      this.title = 'Frequency';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/FREQ/1/showgraph");
    } else if (graphname == 'ENGINESPEED') {
      this.title = 'Engine Speed';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/ENGINESPEED/1/showgraph");
    } else if (graphname == 'FUELLVEL') {
      this.title = 'Fuel Level';
      this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + unit_id + "/FUELLVEL/1/showgraph");

    }

    // UnitDetails Api Call
    let unid = this.navParams.get("unit_id")
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
      });
    // Unit Details API Call
  }
  previous() {
    this.navCtrl.setRoot(UnitdetailsPage, {
      record: this.navParams.get("record"),
      tabs: 'dataView'
    });
  }
}


import { Component } from '@angular/core';
import { Platform,  NavController, NavParams, ModalController,App} from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AlarmPage } from '../alarm/alarm';
import { AlarmlogPage } from '../alarmlog/alarmlog';
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
  selector: 'page-trendline',
  templateUrl: 'trendline.html'
})
export class TrendlinePage {
  //tabBarElement: any;
  iframeContent: any;
  public userId: any;
  public unitDetailData: any = {

    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: '',
    mapicon:''
  }
  private apiServiceURL: string = "";

  constructor( public app: App,public modalCtrl: ModalController,public platform: Platform, private conf: Config, public http: Http, private sanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
       
        if (this.navParams.get("from") == 'alarmlog') {
           this.navCtrl.setRoot(AlarmlogPage, {
            record: this.navParams.get("record"),
            from: 'trendline',
          });
        } else {
           this.navCtrl.setRoot(AlarmPage, {
            record: this.navParams.get("record"),
            from: 'trendline',
          });
        }
      });
    });

  }

  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  
presentModal(unit) {
  
  let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
  modal.present();
}
  ionViewDidLoad() {
  
    let alarmID = this.navParams.get("alarmid");
    //this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/" + "alarmlogtrendline?loginid=" + this.userId + "&alarm_id=" + alarmID + " height=350 width=100% frameborder=0></iframe > ";
    this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + "alarmlogtrendline?loginid=" + this.userId + "&alarm_id=" + alarmID);

    // UnitDetails Api Call
    let unid = this.navParams.get("record").alarm_unit_id;
    let
      typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headersunit: any = new Headers({ 'Content-Type': typeunit }),
      optionsunit: any = new RequestOptions({ headers: headersunit }),
      urlunit: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.userId +
        "&unitid=" + unid;
    
    this.http.get(urlunit, optionsunit)
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
          this.unitDetailData.mapicon=data.json().units[0].mapicon;
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
      });
    // Unit Details API Call
  }
  previous() {
   
    if (this.navParams.get("from") == 'alarmlog') {
       this.navCtrl.setRoot(AlarmlogPage, {
        record: this.navParams.get("record"),
        from: 'trendline',
      });
    } else {
       this.navCtrl.setRoot(AlarmPage, {
        record: this.navParams.get("record"),
        from: 'trendline',
      });
    }

  }
}

import { Component } from '@angular/core';
import { NavController, NavParams ,Platform,App} from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NotificationPage } from '../notification/notification';
import { EnginedetailPage } from '../enginedetail/enginedetail';
import { Config } from '../../config/config';
declare var jQuery: any;
@Component({
  selector: 'page-engineview',
  templateUrl: 'engineview.html',
})
export class EngineviewPage {
  public pageTitle: string; 
  public item = [];
  public msgcount: any;
  public notcount: any;
  public colorListArr = [];
  iframeContent: any;
  profilePhoto;
  private apiServiceURL: string = "";

  public serviceCount;
  public commentCount;




  public unitDetailData: any = {
    model_id: '',
    iframeURL: ''



  }
  constructor(private app:App,public platform:Platform,public http: Http, private conf: Config, private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
    
    
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(EnginedetailPage);
      });
    });

    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.apiServiceURL = this.conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    
  }


  ionViewDidLoad() {
   
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
    
    

    this.http.get(url, options)
      .subscribe((data) => {
       
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    
    let editItem = this.NP.get("record");
    // this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/webview_enginedetails/"+editItem.model_id + " height=500px width=100% frameborder=0></iframe>";
   
    this.iframeContent = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/webview_enginedetails/" + editItem.model_id);
    jQuery('textarea').css('style', 'display:none');
  }
  notification() {
     this.navCtrl.setRoot(NotificationPage);
  }


  previous() {
     this.navCtrl.setRoot(EnginedetailPage);
  }
}

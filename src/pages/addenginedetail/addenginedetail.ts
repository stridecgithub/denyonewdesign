import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { EnginedetailPage } from '../enginedetail/enginedetail';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { OrgchartPage } from '../orgchart/orgchart';
import { Config } from '../../config/config';
//import { Config } from '../../config/config';
/**
 * Generated class for the AddenginedetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var jQuery: any;
@Component({
  selector: 'page-addenginedetail',
  templateUrl: 'addenginedetail.html',
})
export class AddenginedetailPage {

  footerBar: number = 1;
  public pageTitle: string;
  public loginas: any;
  private apiServiceURL: string = "";
  public totalCount;
  public recordID: any = null;
  pet: string = "ALL";
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public msgcount: any;
  public notcount: any;
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  public reportData: any =
    {
      status: '',
      sort: 'unitgroup_id',
      sortascdesc: 'asc',
      startindex: 0,
      results: 8
    }
  public reportAllLists = [];
  public colorListArr: any;
  public userId: any;

  public enginemodel: any;
  public rawhtml: any;
  public companyId;
  public form: FormGroup;
  constructor(private app: App, private conf: Config, public navCtrl: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController, public platform: Platform) {





    this.hidetollbarTextEditor();
    this.apiServiceURL = this.conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        jQuery('.note-btn-group').hide();
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(EnginedetailPage);
      });
    });
    this.form = fb.group({
      "enginemodel": ["", Validators.required],
      "rawhtml": [""]//, Validators.required

    });
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.pageTitle = 'Add Engine Detail';

  }
  ionViewDidLoad() {
    jQuery('#summernote').summernote();
    this.hidetollbarTextEditor();
  }
  ionviewDidEnter() {

    this.hidetollbarTextEditor();

  }
  hidetollbarTextEditor() {
    jQuery('.note-icon-col-before').hide();
    jQuery('.note-fontsize-10').hide();
    jQuery('.note-icon-align-left').hide();
    jQuery('.note-icon-align-right').hide();
    jQuery('.note-icon-align-justify').hide();
    jQuery('.note-icon-row-below').hide();
    jQuery('.note-icon-row-above').hide();
    jQuery('.note-icon-row-before').hide();
    jQuery('.note-icon-row-after').hide();
    jQuery('.note-icon-row-remove').hide();
    jQuery('.note-icon-trash').hide();
    jQuery('.note-icon-col-remove').hide();
    jQuery('.note-icon-col-after').hide();
    jQuery('.note-icon-link').hide();
    jQuery('.note-btn-group.btn-group.note-link').hide();
    jQuery('.note-icon-chain-broken').hide();
    jQuery('.note-btn-group.btn-group.note-insert').hide();
    // jQuery('.note-btn-group').hide();
    
    jQuery('.note-add').hide();
    jQuery('.note-imagesize').hide();
    jQuery('.note-float').hide();
    jQuery('.note-remove').hide();
    jQuery('.note-delete').hide();
    jQuery('.note-frame panel .note-icon-link').show();

    jQuery('.note-btn').show();
    //note-icon-link

    //jQuery('.note-children-container').addStyle('position: absolute;top: 32%;left: 5%;');
    jQuery(".note-children-container").css({ 'position': 'fixed', 'top': '22%', 'left': '5%' });
    jQuery(".note-imagesize").css({ 'position': 'fixed', 'top': '-69%', 'left': '5%' });
    jQuery(".note-float").css({ 'position': 'fixed', 'top': '-69%', 'left': '5%' });
    jQuery(".note-remove").css({ 'position': 'fixed', 'top': '-69%', 'left': '5%' });



    /*jQuery(".note-btn-group.btn-group.note-add").hide();
    jQuery(".button.note-btn.btn.btn-default.btn-sm.btn-md").hide();
    jQuery(".note-btn-group.btn-group.note-link").hide();*/


  }
  ionViewWillEnter() {
    jQuery('#summernote').summernote();
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;



    this.http.get(url, options)
      .subscribe((data) => {

        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    if (this.NP.get("record")) {
      this.pageTitle = 'Edit Engine Detail';

      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));

      // this.pageTitle = 'Edit Company Group';
      this.readOnly = false;
      this.hideActionButton = true;
    }
    else {


    }
  }
  selectEntry(item) {
    this.enginemodel = item.model;
    this.rawhtml = item.rawhtml;
    this.recordID = item.model_id;
    // jQuery('.note-codable').val(this.rawhtml);

    jQuery('#summernote').summernote('code', this.rawhtml);
  }
  saveEntry() {
    //alert(jQuery('.summernote').val());

    this.rawhtml = jQuery('#summernote').summernote('code');
    if (this.isEdited) {
      let body: string = "is_mobile=1&model=" + this.enginemodel +
        "&rawhtml=" + encodeURIComponent(this.rawhtml.toString()) + "&model_id=" + this.recordID,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/enginemodel/update";
      this.http.post(url, body, options)
        .subscribe((data) => {
          // If the request was successful notify the user
          if (data.status === 200) {
            this.hideForm = true;
            this.sendNotification(`Engine Model successfully updated`);
            localStorage.setItem("userPhotoFile", "");
            this.navCtrl.setRoot(EnginedetailPage);
          }
          // Otherwise let 'em know anyway
          else {
            this.sendNotification('Something went wrong!');
          }
        });
    }
    else {
      let body: string = "is_mobile=1&model=" + this.enginemodel +
        "&rawhtml=" + encodeURIComponent(this.rawhtml.toString()),


        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/enginemodel";



      this.http.post(url, body, options)
        .subscribe((data) => {

          // If the request was successful notify the user
          if (data.status === 200) {
            this.hideForm = true;
            this.sendNotification(`Engine Model successfully added`);
            localStorage.setItem("userPhotoFile", "");
            this.navCtrl.setRoot(EnginedetailPage);
          }
          // Otherwise let 'em know anyway
          else {
            this.sendNotification('Something went wrong!');
          }
        });
    }
  }
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
  previous() {
    jQuery('.note-btn-group').hide();
    this.navCtrl.setRoot(EnginedetailPage);
  }

  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  redirectToUser() {
    this.navCtrl.setRoot(UnitsPage);
  }
  redirectToMessage() {
  }
  redirectCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }
  redirectToMaps() {
  }
  redirectToSettings() {
    this.navCtrl.setRoot(OrgchartPage);
  }

}

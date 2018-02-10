import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { CompanygroupPage } from '../companygroup/companygroup';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RolePage } from '../role/role';
import { DashboardPage } from '../dashboard/dashboard';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { DatePicker } from '@ionic-native/date-picker';
import { ReportsPage } from '../reports/reports';
import { OrgchartPage } from '../orgchart/orgchart';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'page-reportviewtable',
  templateUrl: 'reportviewtable.html',
  providers: [DatePicker, FileOpener, FileTransfer, File, DocumentViewer]
})
export class ReportviewtablePage {
  //@ViewChild('mapContainer') mapContainer: ElementRef;
  //map: any;
  public loginas: any;
  iframeContent: any;
  public form: FormGroup;
  public success: any;
  public userid: any;
  public companyid: any;
  public graphview: any;
  public pdfdownloadview: any;
  public pdfDownloadLink: any;
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public from: any;
  public requestsuccess: any;
  requestsuccessview:any;
  public to: any;
  public noentrymsg: any;
  public responseTemplate: any;
  public responseUnit: any;
  public companyId: any;
  public reportAllLists = [];
  public responseResultTimeFrame = [];
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  profilePhoto;
  totalcount;
  constructor(private document: DocumentViewer, private sanitizer: DomSanitizer, private transfer: FileTransfer, private file: File, private fileOpener: FileOpener, private datePicker: DatePicker, public NP: NavParams,
    public fb: FormBuilder, public http: Http, public navCtrl: NavController, public nav: NavController, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Reports Preview & Download';
    this.graphview = 0;
    this.requestsuccess = '';
    this.pdfdownloadview = 0;
    this.requestsuccessview=0;
    this.loginas = localStorage.getItem("userInfoName");
    this.userid = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
    // Create form builder validation rules
    this.form = fb.group({
      "selunit": [""],
      "seltemplate": [""],
      "seltimeframe": [""],
    });

    this.apiServiceURL = this.apiServiceURL;
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if(this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL +"/images/default.png";
    } else {
     this.profilePhoto = this.apiServiceURL +"/staffphotos/" + this.profilePhoto;
    }

  }
  ionViewWillEnter() {
    this.success = 0;
    this.requestsuccess = '';
    this.requestsuccessview=0;
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userid;
    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
  }
  ionViewDidLoad() {
    this.requestsuccess = '';
    this.success = 0;
    this.requestsuccessview=0;
    let seltypeBtn = this.NP.get("val");
    console.log("Select Type Button Submit" + seltypeBtn);
    let action;
    let seltype;
    if (seltypeBtn == '1') {
      action = 'request';
      seltype = '0'; // Request
    }
    if (seltypeBtn == '2') {
      action = 'view';
      seltype = '0'; // Generate
    }
    if (seltypeBtn == '3') {
      action = 'view';
      seltype = '1'; // PDF
    }

    if (this.NP.get("exportto") == 'graph') {
      this.graphview = 1;
    }


    if (seltypeBtn != '3' && this.graphview == 0) {
      console.log("Block A");
      let info = this.NP.get("selunit");
      console.log(JSON.stringify(info));
      let body: string = "is_mobile=1" +
        "&selunit=" + this.NP.get("selunit") +
        "&seltimeframe=" + this.NP.get("seltimeframe") +
        "&seltemplate=" + this.NP.get("seltemplate") +
        "&from=" + this.NP.get("from") +
        "&to=" + this.NP.get("to") +
        "&exportto=" + this.NP.get("exportto") +
        "&seltype=" + seltype +
        "&action=" + action +
        "&loginid=" + this.userid +
        "&companyid=" + this.companyid,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
          "&selunit=" + this.NP.get("selunit") +
          "&seltimeframe=" + this.NP.get("seltimeframe") +
          "&seltemplate=" + this.NP.get("seltemplate") +
          "&from=" + this.NP.get("from") +
          "&to=" + this.NP.get("to") +
          "&exportto=" + this.NP.get("exportto") +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&companyid=" + this.companyid;

      console.log("Report submit url is:-" + url);
      let res;
      this.presentLoading(1);
      //this.http.post(url, body, options)
      this.http.get(url, options)
        ///this.http.post(url, body, options)
        .subscribe((data) => {

          // If the request was successful notify the user
          res = data.json();
          console.log("Report Preview Success Response:-" + JSON.stringify(res));
          if (seltypeBtn == '1') {
            this.success = 1;
          }
          if (res.totalcount > 0) {
            this.reportAllLists = res.reportdata;
            this.totalcount=res.totalcount;
          }else{
             this.totalcount=0;
          }

          if (data.status === 200) {

          }
          // Otherwise let 'em know anyway
          else {

          }

          this.noentrymsg = 'No report entries found';
        });


    } else if (seltypeBtn == '3' && this.graphview == 0) {
      console.log("Block B");
      // PDF Viewer Calling      
      let body: string = "is_mobile=1" +
        "&selunit=" + this.NP.get("selunit") +
        "&seltimeframe=" + this.NP.get("seltimeframe") +
        "&seltemplate=" + this.NP.get("seltemplate") +
        "&from=" + this.NP.get("from") +
        "&to=" + this.NP.get("to") +
        "&exportto=" + this.NP.get("exportto") +
        "&seltype=" + seltype +
        "&action=" + action +
        "&loginid=" + this.userid +
        "&companyid=" + this.companyid,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
          "&selunit=" + this.NP.get("selunit") +
          "&seltimeframe=" + this.NP.get("seltimeframe") +
          "&seltemplate=" + this.NP.get("seltemplate") +
          "&from=" + this.NP.get("from") +
          "&to=" + this.NP.get("to") +
          "&exportto=" + this.NP.get("exportto") +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&companyid=" + this.companyid;

      console.log("Report submit url is:-" + url);
      let res;
      this.presentLoading(1);
      //this.http.post(url, body, options)
      this.http.get(url, options)
        ///this.http.post(url, body, options)
        .subscribe((data) => {
          this.presentLoading(0);
          // If the request was successful notify the user
          res = data.json();
          console.log("Uploaded and generated success file is:" + res.pdf);
          this.pdfdownloadview = 1;
          let pdfFile = res.pdf;
          let pdfPathURL = this.apiServiceURL;
          console.log("PDF Path URL:-" + pdfPathURL + pdfFile);
          this.pdfDownloadLink = res.pdf;
          const url = res.pdf;
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(url, this.file.dataDirectory + pdfFile).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            const options: DocumentViewerOptions = {
              title: res.pdf
            }
            this.document.viewDocument(entry.toURL(), 'application/pdf', options)
          }, (error) => {
            // handle error
          });


          if (data.status === 200) {

          }
          // Otherwise let 'em know anyway
          else {

          }


        });
      //  {"msg":{"result":"success"},"pdf":"reports_generator_1.pdf"}


    } else if (this.graphview > 0) {
      console.log("Block C");

      if (seltypeBtn == '1') {
        this.graphview = 0;
        this.requestsuccessview=1;
        this.requestsuccess = 'Request successfully sent';
        console.log(this.requestsuccess);
      } else {
        this.iframeContent = "<iframe  src=http://denyoappv2.stridecdev.com/reports/viewreport?is_mobile=1" +
          "&selunit=" + this.NP.get("selunit") +
          "&seltimeframe=" + this.NP.get("seltimeframe") +
          "&seltemplate=" + this.NP.get("seltemplate") +
          "&from=" + this.NP.get("from") +
          "&to=" + this.NP.get("to") +
          "&exportto=" + this.NP.get("exportto") +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&companyid=" + this.companyid +
          "&datacodes='' height=350 width=100% frameborder=0></iframe>";
      }
    }

  }
  presentLoading(parm) {
    let loader;
    loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    if (parm > 0) {
      loader.present();
    } else {
      loader.dismiss();
    }
  }
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }

  previous() {
    this.navCtrl.setRoot(ReportsPage);
  }
}





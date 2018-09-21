import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, App } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { RolePage } from '../role/role';
//import { DashboardPage } from '../dashboard/dashboard';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
//import { CalendarPage } from '../calendar/calendar';
import { ReportsPage } from '../reports/reports';
//import { OrgchartPage } from '../orgchart/orgchart';
//import { DocumentViewer } from '@ionic-native/document-viewer';
//import { FileOpener } from '@ionic-native/file-opener';
//import { FileTransfer } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';
import { Config } from '../../config/config';
@Component({
  selector: 'page-reportviewtable',
  templateUrl: 'reportviewtable.html'
})
export class ReportviewtablePage {
  //@ViewChild('mapContainer') mapContainer: ElementRef;
  //map: any;
  public footerBar = [];
  csvData: any[] = [];
  headerRow: any[] = [];
  public posts = [];
  keys: String[];
  csvurl;
  public loginas: any;
  iframeContent: any;
  public form: FormGroup;
  public success: any;
  public userid: any;
  public companyid: any;
  public graphview: any;
  public pdfdownloadview: any;
  public pdfDownloadLink: any;
  public csvDownloadLink: any;
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public from: any;
  public requestsuccess: any;
  requestsuccessview: any;
  public to: any;
  public noentrymsg: any;
  public responseTemplate: any;
  public responseUnit: any;
  public companyId: any;
  public reportAllLists = [];
  public headLists = [];
  public headValue = [];
  public responseResultTimeFrame = [];
  private apiServiceURL: string = "";
  profilePhoto;
  processing: any;
  totalcount;
  location;
  unitname;
  projectname;
  controllerid;
  alarmnotificationto;
  alarmhashtags;
  neaplateno;
  serialnumber;
  nextservicedate;
  contactnames;
  fromdate;
  fromdatedisplay;
  todate;
  todatedisplay
  generatormodel;
  unitgroupname;
  timeframe;
  contactnumbers;
  url;
  storageDirectory: string = '';
  seltypeBtn;
  exportto;
  selunit;
  seltimeframe;
  seltemplate;
  progress: number;
  public isProgress = false;
  public showrunning: boolean = false;
  public showonline: boolean = false;
  public showload: boolean = false;
  public buttonClicked: boolean = false;
  processingtxt: any;
  reportcount: any;
  donwloadstart: any;
  loading: any;
  constructor(public app: App, private conf: Config, private platform: Platform, private sanitizer: DomSanitizer, public NP: NavParams,
    public fb: FormBuilder, public http: Http, public navCtrl: NavController, public nav: NavController, public loadingCtrl: LoadingController) {
    this.apiServiceURL = this.conf.apiBaseURL();
    this.reportcount = 0;
    this.reportcount = 0;
    this.donwloadstart = 0;
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(ReportsPage, {
          selunit: this.NP.get("selunit"),
          seltemplate: this.NP.get("seltemplate"),
          seltimeframe: this.NP.get("seltimeframe"),
          from: this.NP.get("from"),
          to: this.NP.get("to"),
          exportto: this.NP.get("exportto"),
          val: this.NP.get("val")
        });
      });
    });


    this.pageTitle = 'Reports Preview & Download';
    //this.readCsvData();
    this.graphview = 0;
    this.requestsuccess = '';
    this.pdfdownloadview = 1;
    this.requestsuccessview = 0;
    this.loginas = localStorage.getItem("userInfoName");
    this.userid = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
    // Create form builder validation rules
    this.form = fb.group({
      "selunit": [""],
      "seltemplate": [""],
      "seltimeframe": [""],
    });


    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    // make sure this is on a device, not an emulation (e.g. chrome tools device mode)   



  }
  ionViewWillEnter() {
    this.success = 0;
    this.requestsuccess = '';
    this.requestsuccessview = 0;
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userid;
    this.http.get(url, options)
      .subscribe((data) => {

        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
  }
  public onButtonClick() {

    this.buttonClicked = !this.buttonClicked;
  }
  ionViewDidLoad() {
    this.exportto = this.NP.get("exportto")
    this.seltypeBtn = this.NP.get("val");
    this.selunit = this.NP.get("selunit");
    this.seltimeframe = this.NP.get("seltimeframe");
    this.seltemplate = this.NP.get("seltemplate");
    this.from = this.NP.get("from");
    this.to = this.NP.get("to");
    this.showrunning = false;
    this.showonline = false;
    this.showload = false;
    this.getReportResult(this.seltypeBtn, this.exportto, this.selunit, this.seltimeframe, this.seltemplate, this.from, this.to, this.showrunning, this.showonline, this.showload);
  }

  getReportResult(seltypeBtn, exportto, selunit, seltimeframe, seltemplate, from, to, showrunning, showonline, showload) {
    this.isProgress = true;
    //this.presentLoading(1)

    if (exportto == 'graph') {
      this.processingtxt = "Graph view report processing... please wait.";
    } else {
      this.processingtxt = "Table view report processing... please wait.";
    }
    // this.processingtxt = "Processing... please wait.";
    this.presentLoadingText(this.processingtxt);
    this.reportAllLists = [];
    this.headLists = [];
    this.headValue = [];
    if (showrunning == true) {
      showrunning = 1;
    } else {
      showrunning = 0;
    }
    if (showonline == true) {
      showonline = 1;
    } else {
      showonline = 0;
    }
    if (showload == true) {
      showload = 1;
    } else {
      showload = 0;
    }
    this.requestsuccess = '';
    this.success = 0;
    this.requestsuccessview = 0;


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



    if (exportto == 'graph') {
      this.graphview = 1;
    }


    if (seltypeBtn != '3' && this.graphview == 0) {

      //let info = this.NP.get("selunit");

      let
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
          "&selunit=" + selunit +
          "&seltimeframe=" + seltimeframe +
          "&seltemplate=" + seltemplate +
          "&from=" + from +
          "&to=" + to +
          "&exportto=" + exportto +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&showrunning=" + showrunning +
          "&showonline=" + showonline +
          "&showload=" + showload +
          "&companyid=" + this.companyid;
      let res;

      //this.presentLoadingText(this.processingtxt);
      this.http.get(url, options)
        ///this.http.post(url, body, options)
        .subscribe((data) => {


          //this.presentLoading(1);
          // If the request was successful notify the user
          res = data.json();
          if (seltypeBtn == '1') {
            this.success = 1;
            this.navCtrl.setRoot(ReportsPage, { reqsuccess: 1 });
          }
          this.reportcount = res.reportcount;
          if (res.totalcount > 0) {
            //this.download(1, showrunning, showonline, showload);
            //this.download(2, showrunning, showonline, showload);
            this.headLists = res.templatedata;
            this.headValue = res.mobilehistorydata;//res.mobilehistorydata.split(",");//res.reportdata;

            this.posts = res.mobilehistorydata[0];
            for (let jk = 0; jk <= this.headValue.length; jk++) {

              if (jk == this.headValue.length) {
                //this.presentLoading(0);
                this.processing = 1
                this.progress += 5;
                this.isProgress = false;
                //this.processingtxt = "";
                //this.presentLoading(0);
                this.loading.dismiss();
              } else {
                this.processing = 0;

                this.progress += jk;
                this.isProgress = true;
              }

            }

            // this.keys = Object.keys(this.posts);
            this.reportAllLists = res.reportdata;
            this.totalcount = res.totalcount;

            this.location = res.unitdata[0].location;
            this.unitname = res.unitdata[0].unitname;
            this.projectname = res.unitdata[0].projectname;
            this.controllerid = res.unitdata[0].controllerid;
            this.alarmnotificationto = res.unitdata[0].alarmnotificationto;
            this.alarmhashtags = res.unitdata[0].alarmhashtags;
            this.neaplateno = res.unitdata[0].neaplateno;
            this.serialnumber = res.unitdata[0].serialnumber;
            this.nextservicedate = res.nextservicedate;
            this.contactnames = res.contactnames;
            this.contactnumbers = res.contactnumbers
            this.fromdatedisplay = res.fromdate;
            this.todatedisplay = res.todate;
            this.timeframe = res.timeframe;
            this.generatormodel = res.generatormodel;
            this.unitgroupname = res.unitgroupname;
          } else {
            this.totalcount = 0;
          }

          if (data.status === 200) {

          }
          // Otherwise let 'em know anyway
          else {

          }

          this.noentrymsg = 'No report entries found';
          if (res.mobilehistorydata.length == 0 && this.processing == 1) {
            this.loading.dismiss();
          }
        });


    } else if (seltypeBtn == '3' && this.graphview == 0) {
      // PDF

    } else if (this.graphview > 0) {
      this.buttonClicked = false;

      if (seltypeBtn == '1') {
        this.loading.dismiss();
        this.graphview = 0;
        this.requestsuccessview = 1;
        this.requestsuccess = 'Request successfully sent';
        return false;
      } else {
        // For Getting Unit Details in Graph
        let
          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
            "&selunit=" + selunit +
            "&seltimeframe=" + seltimeframe +
            "&seltemplate=" + seltemplate +
            "&from=" + from +
            "&to=" + to +
            "&exportto=table" +
            "&seltype=" + seltype +
            "&action=" + action +
            "&loginid=" + this.userid +
            "&showrunning=" + showrunning +
            "&showonline=" + showonline +
            "&showload=" + showload +
            "&companyid=" + this.companyid;


        let res;

        // "Processing... please wait.";
        //this.presentLoadingText(this.processingtxt);
        this.http.get(url, options)

          .subscribe((data) => {

            // If the request was successful notify the user
            res = data.json();
            this.reportcount = res.reportcount;
            if (seltypeBtn == '1') {
              this.success = 1;
              this.navCtrl.setRoot(ReportsPage, { reqsuccess: 1 });
            }
            if (res.totalcount > 0) {

              this.headLists = res.templatedata;
              this.headValue = res.mobilehistorydata;

              for (let jk = 0; jk <= this.headValue.length; jk++) {

                if (jk == this.headValue.length) {

                  //this.presentLoading(0);
                  this.processing = 1
                  this.progress += 5;
                  this.isProgress = false;
                  //this.processingtxt = "";
                  //this.presentLoading(0);
                  this.loading.dismiss();
                } else {

                  this.processing = 0;

                  this.processingtxt = "Graph view report processing... please wait.";
                  // this.presentLoadingText(this.processingtxt);
                  this.progress += jk;
                  this.isProgress = true;
                }

              }

              this.posts = res.mobilehistorydata[0];

              this.totalcount = res.totalcount;

              this.location = res.unitdata[0].location;
              this.unitname = res.unitdata[0].unitname;
              this.projectname = res.unitdata[0].projectname;
              this.controllerid = res.unitdata[0].controllerid;
              this.alarmnotificationto = res.unitdata[0].alarmnotificationto;
              this.alarmhashtags = res.unitdata[0].alarmhashtags;
              this.neaplateno = res.unitdata[0].neaplateno;
              this.serialnumber = res.unitdata[0].serialnumber;
              this.nextservicedate = res.nextservicedate;
              this.contactnames = res.contactnames;
              this.contactnumbers = res.contactnumbers
              this.fromdatedisplay = res.fromdate;
              this.todatedisplay = res.todate;
              this.timeframe = res.timeframe;
              this.generatormodel = res.generatormodel;
              this.unitgroupname = res.unitgroupname;
            } else {
              this.totalcount = 0;
            }

            if (data.status === 200) {

            }
            // Otherwise let 'em know anyway
            else {

            }

            this.noentrymsg = 'No report entries found';
            if (this.reportcount == 0 && this.processing == 1) {
              this.loading.dismiss();
            }

          }, error => {
          });
        // For Gettting Unit Details in Graph
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
          "&selunit=" + selunit +
          "&seltimeframe=" + seltimeframe +
          "&seltemplate=" + seltemplate +
          "&from=" + from +
          "&to=" + to +
          "&exportto=" + exportto +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&showrunning=" + showrunning +
          "&showonline=" + showonline +
          "&showload=" + showload +
          "&companyid=" + this.companyid +
          "&datacodes=");

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
    this.navCtrl.setRoot(ReportsPage, {
      selunit: this.NP.get("selunit"),
      seltemplate: this.NP.get("seltemplate"),
      seltimeframe: this.NP.get("seltimeframe"),
      from: this.NP.get("from"),
      to: this.NP.get("to"),
      exportto: this.NP.get("exportto"),
      val: this.NP.get("val")
    });
  }
  download(val, showrunning, showonline, showload) {
    this.buttonClicked = false;
    if (showrunning == true) {
      showrunning = 1;
    } else {
      showrunning = 0;
    }
    if (showonline == true) {
      showonline = 1;
    } else {
      showonline = 0;
    }
    if (showload == true) {
      showload = 1;
    } else {
      showload = 0;
    }
    let
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
        "&seltype=" + val +
        "&action=view" +
        "&loginid=" + this.userid +
        "&showrunning=" + showrunning +
        "&showonline=" + showonline +
        "&showload=" + showload +
        "&companyid=" + this.companyid;
    let res;

    if (val == 1) {
      this.processingtxt = "PDF file generated for download... please wait.";
      this.presentLoadingText(this.processingtxt);
    } else {
      this.processingtxt = "CSV file generated for download... please wait.";
      this.presentLoadingText(this.processingtxt);
    }

    this.http.get(url, options)
      ///this.http.post(url, body, options)
      .subscribe((data) => {
        this.donwloadstart = 1;


        // this.presentLoading(0);
        // If the request was successful notify the user
        res = data.json();

        let uri;
        if (val == 1) {
          uri = res.pdf;
          this.pdfDownloadLink = uri;
        } else {
          uri = res.csv;
          this.csvDownloadLink = uri;
        }

        //this.downloadLink = uri;
        this.pdfdownloadview = 1;
        let pdfFile = uri;
        // let pdfPathURL = this.apiServiceURL;
        this.csvurl = uri;
        // this.pdfDownloadLink = url;

        if (val == 2) {
          pdfFile = 'report_' + new Date().toISOString() + '.csv';
          pdfFile = pdfFile.replace("-", "_");

        }
        //this.processingtxt ='';
        //this.presentLoading(0);
        this.loading.dismiss();
        window.open(uri);
        /* const fileTransfer: FileTransferObject = this.transfer.create();
         fileTransfer.download(uri, this.file.dataDirectory + pdfFile).then((entry) => {
          
           this.pdfdownloadview = 0;
         }, (error) => {
 
         });
 
 
         if (data.status === 200) {
 
         }
       
         else {
 
         }
       */

      });
    //  {"msg":{"result":"success"},"pdf":"reports_generator_1.pdf"}
  }

  /*fileDownload(filepathurl) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let url = filepathurl;
    fileTransfer.download(url, this.file.dataDirectory + 'report_' + new Date().toISOString() + '.csv').then((entry) => {
      if (entry) {
        let alert = this.alertCtrl.create({
          title: 'CSV Downloaded Successfully',
          buttons: [{
            text: 'Ok',
          }]
        });
        alert.present();
      }
      else {
        let alert = this.alertCtrl.create({
          title: 'No File to download',
          buttons: [{
            text: 'Ok',
          }]
        });
        alert.present();
      }
    });
  }*/

  presentLoadingText(msg) {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: msg//'Loading Please Wait...'
    });

    this.loading.present();

    /* setTimeout(() => {
       this.nav.push(Page2);
     }, 1000);
   
     setTimeout(() => {
       loading.dismiss();
     }, 5000);*/
  }

}





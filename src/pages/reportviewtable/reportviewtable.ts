import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { FormGroup,  FormBuilder } from '@angular/forms';
//import { RolePage } from '../role/role';
//import { DashboardPage } from '../dashboard/dashboard';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
//import { CalendarPage } from '../calendar/calendar';
import { DatePicker } from '@ionic-native/date-picker';
import { ReportsPage } from '../reports/reports';
//import { OrgchartPage } from '../orgchart/orgchart';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';
import * as papa from 'papaparse';
@Component({
  selector: 'page-reportviewtable',
  templateUrl: 'reportviewtable.html',
  providers: [DatePicker, FileOpener, FileTransfer, File, DocumentViewer]
})
export class ReportviewtablePage {
  //@ViewChild('mapContainer') mapContainer: ElementRef;
  //map: any;
  public footerBar=[];
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
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  profilePhoto;
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
  public buttonClicked: boolean = false;
  constructor( private alertCtrl: AlertController, private sanitizer: DomSanitizer, private transfer: FileTransfer, private file: File, public NP: NavParams,
    public fb: FormBuilder, public http: Http, public navCtrl: NavController, public nav: NavController, public loadingCtrl: LoadingController) {
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

    this.apiServiceURL = this.apiServiceURL;
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    // make sure this is on a device, not an emulation (e.g. chrome tools device mode)   

    // Footer Menu Access - Start
    let footeraccessstorage = localStorage.getItem("footermenu");
    let footeraccessparams = this.NP.get('footermenu');
    let footermenuacc;
    if (footeraccessparams != undefined) {
      footermenuacc = footeraccessparams;
    } else {
      footermenuacc = footeraccessstorage;
    }

    
    // this.footerBar="0,"+footermenuacc;

    let footermenusplitcomma = footermenuacc.split(",");
    let dashboardAccess = footermenusplitcomma[0];
    let unitAccess = footermenusplitcomma[1];
    let calendarAccess = footermenusplitcomma[2];
    let messageAccess = footermenusplitcomma[3];
    let orgchartAccess = footermenusplitcomma[4];

    
    
    
   
    
    let dashboarddisplay;
    if (dashboardAccess == 1) {
      dashboarddisplay = '';
    } else {
      dashboarddisplay = 'none';
    }
    this.footerBar.push({
      title: 'Dashboard',
      active: true,
      colorcode: "#488aff",
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
      colorcode: "rgba(60, 60, 60, 0.7)",
      pageComponent: 'OrgchartPage'
    });

    
    //this.footerBar = "0";
    //let footerBar=this.footerBar.split(",");
    

    // Footer Menu Access - End

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
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
  }
  public onButtonClick() {

    this.buttonClicked = !this.buttonClicked;
  }
  ionViewDidLoad() {
    this.requestsuccess = '';
    this.success = 0;
    this.requestsuccessview = 0;
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
      let /*body: string = "is_mobile=1" +
        "&selunit=" + this.NP.get("selunit") +
        "&seltimeframe=" + this.NP.get("seltimeframe") +
        "&seltemplate=" + this.NP.get("seltemplate") +
        "&from=" + this.NP.get("from") +
        "&to=" + this.NP.get("to") +
        "&exportto=" + this.NP.get("exportto") +
        "&seltype=" + seltype +
        "&action=" + action +
        "&loginid=" + this.userid +
        "&companyid=" + this.companyid,*/
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
            this.navCtrl.setRoot(ReportsPage, { reqsuccess: 1 });
          }
          if (res.totalcount > 0) {
            this.download(1);
            this.download(2);
            this.headLists = res.templatedata;
            this.headValue = res.mobilehistorydata;//res.mobilehistorydata.split(",");//res.reportdata;

            this.posts = res.mobilehistorydata[0];
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
        });


    } else if (seltypeBtn == '3' && this.graphview == 0) {
      // PDF

    } else if (this.graphview > 0) {

      this.buttonClicked = false;
      console.log("Block C");

      if (seltypeBtn == '1') {
        this.graphview = 0;
        this.requestsuccessview = 1;
        this.requestsuccess = 'Request successfully sent';
        console.log(this.requestsuccess);
      } else {

        // For Getting Unit Details in Graph
        let /*body: string = "is_mobile=1" +
          "&selunit=" + this.NP.get("selunit") +
          "&seltimeframe=" + this.NP.get("seltimeframe") +
          "&seltemplate=" + this.NP.get("seltemplate") +
          "&from=" + this.NP.get("from") +
          "&to=" + this.NP.get("to") +
          "&exportto=" + this.NP.get("exportto") +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&companyid=" + this.companyid,*/
          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
            "&selunit=" + this.NP.get("selunit") +
            "&seltimeframe=" + this.NP.get("seltimeframe") +
            "&seltemplate=" + this.NP.get("seltemplate") +
            "&from=" + this.NP.get("from") +
            "&to=" + this.NP.get("to") +
            "&exportto=table" +
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
              this.navCtrl.setRoot(ReportsPage, { reqsuccess: 1 });
            }
            if (res.totalcount > 0) {
              // this.download(2);
              this.headLists = res.templatedata;
              this.headValue = res.mobilehistorydata;//res.mobilehistorydata.split(",");//res.reportdata;

              this.posts = res.mobilehistorydata[0];
              // this.keys = Object.keys(this.posts);
              // this.reportAllLists = res.reportdata;
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
          });
        // For Gettting Unit Details in Graph
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://denyoappv2.stridecdev.com/reports/viewreport?is_mobile=1" +
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
  download(val) {
    //this.buttonClicked = true;
    console.log("PDF Download");
    // PDF Viewer Calling      
    let /*body: string = "is_mobile=1" +
      "&selunit=" + this.NP.get("selunit") +
      "&seltimeframe=" + this.NP.get("seltimeframe") +
      "&seltemplate=" + this.NP.get("seltemplate") +
      "&from=" + this.NP.get("from") +
      "&to=" + this.NP.get("to") +
      "&exportto=" + this.NP.get("exportto") +
      "&seltype=" + val +
      "&action=view" +
      "&loginid=" + this.userid +
      "&companyid=" + this.companyid,*/
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
        console.log("JSON Return" + JSON.stringify(res));
        let uri;
        if (val == 1) {
          uri = res.pdf;
          this.pdfDownloadLink = uri;
        } else {
          uri = res.csv;
          this.csvDownloadLink = uri;
        }
        console.log("Uploaded and generated success file is:" + uri);
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

        // if (val == 1) {
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.download(uri, this.file.dataDirectory + pdfFile).then((entry) => {
          console.log('download complete: ' + entry.toURL());
          // const options: DocumentViewerOptions = {
          //   title: url
          // }
          console.log("val:" + val);
          if (val == 1) {
            // this.document.viewDocument(entry.toURL(), 'application/pdf', options);
          } else {
            // this.fileOpener.open(this.file.dataDirectory + pdfFile, 'application/excel')
            //   .then(() => console.log('File is opened'))
            //   .catch(e => console.log('Error openening file', e));
          }

          this.pdfdownloadview = 0;
        }, (error) => {
          console.log(error);
          // handle error
        });


        if (data.status === 200) {

        }
        // Otherwise let 'em know anyway
        else {

        }
        //}

      });
    //  {"msg":{"result":"success"},"pdf":"reports_generator_1.pdf"}
  }

  fileDownload(filepathurl) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let url = filepathurl;
    fileTransfer.download(url, this.file.dataDirectory + 'report_' + new Date().toISOString() + '.csv').then((entry) => {
      if (entry) {
        console.log('download complete: ' + entry.toURL());
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
  }
  csv() {

    let csv = papa.unparse({
      fields: this.headerRow,
      data: this.csvData
    });

    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    //this.readCsvData();
    //http://denyoappv2.stridecdev.com/report.csv
  }
 

  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    this.headerRow = parsedData[0];

    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }


  trackByFn(index: any, item: any) {
    return index;
  }
}





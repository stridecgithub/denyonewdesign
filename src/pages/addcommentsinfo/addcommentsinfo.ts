import { Component, ViewChild, NgZone } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, ViewController, Platform,App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { DatePicker } from '@ionic-native/date-picker';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
declare var jQuery: any;
import * as moment from 'moment';

/**
 * Generated class for the addhocPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addcommentsinfo',
  templateUrl: 'addcommentsinfo.html',
  providers: [Camera, FileTransfer, File, DatePicker, Config, FileChooser]
})
export class AddcommentsinfoPage {
  @ViewChild('fileInput') fileInput;
  public addedImgLists = [];
  public comment_unitid: any;
  public comment_id: any;
  public comments: any;
  isReadyToSave: boolean;
  public photoInfo = [];
  public addedServiceImgLists = [];
  progress: number;
  public uploadcount: any;
  public priority_lowclass: any;
  public priority_highclass: any;
  public isSubmitted: boolean = false;
  public recordID: any;
  public service_unitid: any;
  public service_id: any;
  public dd: any;
  public mm: any;
  public comment_by: any;
  //public serviced_date: any;
  serviced_date: String = '';
  public serviced_time: any;
  public servicemindate: any;
  public servicemaxdate: any;
  public comment_subject: any;
  public isFuture: any;
  public minyr;
  public minmn;
  public mindt;
  pageTitle;

  public comment_remark: any;
  public msgcount: any;
  public notcount: any;
  public next_service_date: any;
  public service_priority: any;
  is_request: boolean
  public comment_by_name: any;
  public comment_resources: any;
  micro_timestamp: any;
  public isUploadedProcessing: boolean = false;
  public isProgress = false;
  public isUploaded: boolean = true;
  item: any;
  public isEdited: boolean = false;
  private apiServiceURL: string = "";
  public networkType: string;
  form: FormGroup;
  public addedAttachList;
  public hrvalue: any;
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    getremark: '',
    comment_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public hideActionButton = true;
  //tabBarElement: any;
  atmentioneddata = [];
  companyId
  constructor(private app:App, private conf: Config, public actionSheetCtrl: ActionSheetController, public platform: Platform, public http: Http, public alertCtrl: AlertController, private datePicker: DatePicker, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera
    , private transfer: FileTransfer, private ngZone: NgZone) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(CommentsinfoPage, {
          record: this.NP.get("record")
        });
      });
    });


    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.isFuture = 0;
    this.uploadcount = 10;

    if (this.unitDetailData.nextServiceDate == '') {
      // this.isSubmitted = true;
    }

    this.servicemindate = this.minDateStr();
    this.servicemaxdate = this.maxDateStr();



    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.comment_by = localStorage.getItem("userInfoName");

    this.form = formBuilder.group({
      profilePic: [''],
      comment_subject: ['', Validators.required],
      comment_remark: ['', Validators.required],//
      comment_by: ['']
    });
    this.service_priority = 0;
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });


    var date = new Date();

    this.serviced_date = date.toISOString();

    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';

    let already = localStorage.getItem("microtime");
    if (already != undefined && already != 'undefined' && already != '') {
      this.micro_timestamp = already;
    } else {
      let dateStr = new Date();
      let yearstr = dateStr.getFullYear();
      let monthstr = dateStr.getMonth();
      let datestr = dateStr.getDate();
      let hrstr = dateStr.getHours();
      let mnstr = dateStr.getMinutes();
      let secstr = dateStr.getSeconds();
      this.micro_timestamp = yearstr + "" + monthstr + "" + datestr + "" + hrstr + "" + mnstr + "" + secstr;

    }
    localStorage.setItem("microtime", this.micro_timestamp);

    this.addedServiceImgLists = [];
    
    localStorage.setItem("fromModule", "addhocPage");

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");


    this.http.get(url, options)
      .subscribe((data) => {
      
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    // this.getPrority(1);
    //let users = localStorage.getItem("atMentionedStorage");
    this.is_request = false;
    



    if (this.NP.get("record")) {
      this.selectEntry(this.NP.get("record"));
      if (this.NP.get("unit_id") == undefined) {
        this.comment_unitid = this.NP.get("record").comment_unit_id;
      } else {
        this.comment_unitid = this.NP.get("unit_id");
      }

      if (this.NP.get("act") == 'Add') {
        //this.serviced_date = "";
        this.getPrority(0);
        this.comment_remark = "";
        this.comment_subject = "";
        this.next_service_date = "";
        this.isEdited = false;
        this.pageTitle = 'Add New';
        //this.comment_unitid = this.NP.get("unit_id");
      } else {
        //this.comment_unitid = this.NP.get("record").comment_unit_id;
        this.pageTitle = 'Update';
        this.isEdited = true;
        this.isSubmitted = false;
      }



      let
        typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headersunit: any = new Headers({ 'Content-Type': typeunit }),
        optionsunit: any = new RequestOptions({ headers: headersunit }),
        urlunit: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.unitDetailData.userId +
          "&unitid=" + this.comment_unitid;
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
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
      // Unit Details API Call
    }

   

    let body1: string = '',
      //body: string = "key=delete&recordID=" + recordID,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/hashtags?companyid=" + this.companyId + "&login=" + this.unitDetailData.userId;
    
    this.http.get(url1, options1)

  

    this.http.post(url1, body1, options1)

      .subscribe(data => {
        let res;
        // If the request was successful notify the user
        if (data.status === 200) {
          // this.atmentioneddata = data.json();
          res = data.json();
          

          if (res.staffs.length > 0) {
            for (let staff in res.staffs) {
              this.atmentioneddata.push({
                username: res.staffs[staff].username,
                name: res.staffs[staff].name,
                personaltag: res.staffs[staff].username,
              });
            }
          }
          // Otherwise let 'em know anyway
        } else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      })
   
    jQuery(".comment_remark").mention({
      users: this.atmentioneddata
    });

    // Atmentioned API Calls
  }
  maxDateStr() {

    let today = new Date();
    this.dd = today.getDate();
    this.mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (this.dd < 10) {
      this.dd = '0' + this.dd
    }

    if (this.mm < 10) {
      this.mm = '0' + this.mm
    }

    this.servicemaxdate = yyyy + '-' + this.mm + '-' + this.dd;

    
    return this.servicemaxdate;

  }

  minDateStr() {

    let oneWeekAgo = new Date();
    let prevfivedays = oneWeekAgo.setDate(oneWeekAgo.getDate() - 5);
    let dateFormat = new Date(prevfivedays);
    this.servicemindate = dateFormat.getFullYear() + '-' + (dateFormat.getMonth() + 1) + '-' + dateFormat.getDate();
    this.minyr = dateFormat.getFullYear();
    this.minmn = (dateFormat.getMonth() + 1);
    this.mindt = dateFormat.getDate();

    if (this.mindt < 10) {
      this.mindt = '0' + this.mindt;
    }

    if (this.minmn < 10) {
      this.minmn = '0' + this.minmn;
    }
    this.servicemindate = this.minyr + '-' + this.minmn + '-' + this.mindt
    return this.servicemindate;
  }






  fileTrans(path, micro_timestamp) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    

    //YmdHis_123_filename
    let dateStr = new Date();
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth();
    let date = dateStr.getDate();
    let hr = dateStr.getHours();
    let mn = dateStr.getMinutes();
    let sec = dateStr.getSeconds();
    let d = new Date(),
      n = d.getTime(),
      newFileName = year + "" + month + "" + date + "" + hr + "" + mn + "" + sec + "_123_" + n + ".jpg";

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: newFileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }




      fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/commentupload.php?micro_timestamp=' + micro_timestamp, options)
      .then((data) => {
        // this.isSubmitted = true;
        // Upload Response is{"bytesSent":1872562,"responseCode":200,"response":"{\"error\":false,\"id\":51}","objectId":""}


        
        let res = JSON.parse(data.response);
       
        let imgSrc;
        imgSrc = this.apiServiceURL + "/commentimages" + '/' + newFileName;
        this.addedServiceImgLists.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: newFileName,
          resouce_id: res.id
        });

        //loading.dismiss();
        /* if (this.addedServiceImgLists.length > 9) {
           this.isUploaded = false;
         }*/
        this.uploadcount = 10;
        if (this.addedServiceImgLists.length > 9) {
          this.isUploaded = false;

          this.uploadcount = '';
        } else {
          let remcount = this.uploadcount - this.addedServiceImgLists.length;
          this.uploadcount = remcount;
        }
        this.progress += 5;
        if (this.progress == 100) {
          // this.isSubmitted = false;
        }
        this.isProgress = false;
        this.isUploadedProcessing = false;
        return false;



        // Save in Backend and MysQL
        //this.uploadToServer(data.response);
        // Save in Backend and MysQL
      }, (err) => {
        //loading.dismiss();
       
        this.conf.sendNotification("Upload Error:" + JSON.stringify(err));
      })
  }

  onProgress = (progressEvent: ProgressEvent): void => {
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        let progress = Math.round((progressEvent.loaded / progressEvent.total) * 95);
        this.isProgress = true;
        this.progress = progress;
      }
    });
  }

  saveEntry() {

   // var date = new Date();
    let comment_date = moment().format();
    let cmddte = comment_date.split("T")[0];
    let cmdtme = comment_date.split("T")[1].substring(0, 5);
   
    comment_date = cmddte + " " + cmdtme;
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      
      if (this.isUploadedProcessing == false) {

        let comments = jQuery(".comment_remark").val();
        let //comments: string = this.form.controls["comment_remark"].value,
          comment_subject: string = this.form.controls["comment_subject"].value;


        // Personal hashtag checking....
        let toaddress = jQuery(".comment_remark").val();
        let param = "toaddress=" + toaddress + "&ismobile=1&type=textarea";
        let body: string = param,

          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "/messages/chkemailhashtags";
        

        this.http.post(url, body, options)
          .subscribe((data) => {
         
            if (data.json().invalidusers == '') {
              if (this.isEdited) {
                this.updateEntry(comment_date, comments, comment_subject, this.addedImgLists, this.unitDetailData.hashtag, this.micro_timestamp);
              }
              else {
                this.createEntry(comment_date, comments, comment_subject, this.addedImgLists, this.unitDetailData.hashtag, this.micro_timestamp);
              }
            } else {
              this.conf.sendNotification(data.json().invalidusers + " are not available in the user list!");
              return false;
            }
          });
        // Personal hashtag checking....


      }
    }
  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(comment_date, comments, comment_subject, addedImgLists, remarkget, micro_timestamp) {
    this.isSubmitted = true;
    // comments = localStorage.getItem("atMentionResult");
    if (this.service_priority == undefined) {
      this.service_priority = '0';
    }
    if (this.service_priority == 'undefined') {
      this.service_priority = '0';
    }
    let body: string = "is_mobile=1" +
      "&comment_unit_id=" + this.comment_unitid +
      "&comment_priority=" + this.service_priority +
      "&comment_remark=" + comments +
      "&comment_by=" + this.unitDetailData.userId +
      "&comment_subject=" + comment_subject +
      "&micro_timestamp=" + micro_timestamp +
      "&comment_date=" + comment_date +
      "&uploadInfo=" + JSON.stringify(this.addedImgLists),
      //"&contact_number=" + this.contact_number +
      //"&contact_name=" + this.contact_name +
      //"&nextServiceDate=" + nextServiceDate,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/comments/store";


    this.http.post(url, body, options)
      .subscribe((data) => {
       
        if (data.status === 200) {
          this.comment_subject = '';
          this.comments = '';
          this.addedImgLists = [];
          localStorage.setItem("microtime", "");
          //this.conf.sendNotification(`Comments was successfully added`);
          this.conf.sendNotification(data.json().msg[0].result);

          localStorage.setItem("atMentionResult", '');
          this.navCtrl.setRoot(CommentsinfoPage, {
            record: this.NP.get("record")
          });
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });


  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(comment_date, comments, comment_subject, addedImgLists, remarkget, micro_timestamp) {
    this.isSubmitted = true;
    // if (localStorage.getItem("atMentionResult") != '') {
    //   comments = localStorage.getItem("atMentionResult");
    // }
    if (this.service_priority == undefined) {
      this.service_priority = 0;
    }
    if (this.service_priority == 'undefined') {
      this.service_priority = 0;
    }

    let body: string = "is_mobile=1" +
      "&comment_remark=" + comments +
      "&comment_id=" + this.recordID +
      "&comment_priority=" + this.service_priority +
      "&comment_unit_id=" + this.comment_unitid +
      "&comment_by=" + this.unitDetailData.userId +
      "&comment_subject=" + comment_subject +
      "&comment_date=" + comment_date +
      "&micro_timestamp=" + micro_timestamp +
      "&uploadInfo=" + JSON.stringify(this.addedImgLists),

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/comments/update";
    this.http.post(url, body, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.comment_subject = '';
          this.comments = '';
          this.addedImgLists = [];
          localStorage.setItem("microtime", "");
          //this.conf.sendNotification(`Comments was successfully updated`);
          this.conf.sendNotification(data.json().msg[0].result);
          localStorage.setItem("atMentionResult", '');
          this.navCtrl.setRoot(CommentsinfoPage, {
            record: this.NP.get("record")
          });
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }






  getNextDate(val, field) {
    this.isFuture = 0;
    this.isSubmitted = false;
    let date;
    if (val > 0) {
      date = this.addDays(val);
    } else {
      this.showDatePicker();
    }
    if (field == '1') {
      let monthstr;
      let datestr;
      let mn = parseInt(date.getMonth() + 1);
      let dt = date.getDate();
      if (mn < 10) {
        monthstr = "0" + mn;
      } else {
        monthstr = mn;
      }
      if (dt < 10) {
        datestr = "0" + dt;
      } else {
        datestr = dt;
      }
     
      this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + monthstr + "-" + datestr;
    } else {
      let monthstr;
      let datestr;
      let mn = parseInt(date.getMonth() + 1);
      let dt = date.getDate();
     
      if (mn < 10) {
        monthstr = "0" + mn;
      } else {
        monthstr = mn;
      }
      if (dt < 10) {
        datestr = "0" + dt;
      } else {
        datestr = dt;
      }
      this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + monthstr + "-" + datestr;
    }
    if (this.unitDetailData.nextServiceDate != '') {
      //this.isSubmitted = false;
    } else {
      // this.isSubmitted = true;
    }
  }

  getPrority(val) {
    this.priority_highclass = '';
    this.priority_lowclass = '';
    if (val == "2") {
      this.priority_highclass = "border_high";
    }
    if (val == "1") {
      this.priority_lowclass = "border_low";
    }
    this.service_priority = val
  }

  addDays(days) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

  subDays(days) {
    let result = new Date();
    result.setDate(result.getDate() - days);
    
    return result;
  }
  showDatePicker() {
    this.isSubmitted = false;
    
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      maxDate: new Date(),
      allowOldDates: false,
      doneButtonColor: '#F2F3F4',
      cancelButtonColor: '#000000',
      allowFutureDates: true,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {

        let monthstr = date.getMonth() + parseInt("1");

       
        if (new Date().getTime() < date.getTime()) {
          this.isFuture = 0;
          this.isSubmitted = false;
         
          this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + monthstr + "-" + date.getDate();
        } else {
          this.isFuture = 1;
          this.isSubmitted = true;
      
          this.unitDetailData.nextServiceDate = '';
        }
      },
      err =>{}
      );
  }



  previous() {
    this.navCtrl.setRoot(CommentsinfoPage, {
      record: this.NP.get("record")
    });
  }






  selectEntry(item) {
    this.recordID = item.comment_id
    this.comment_by = item.comment_by;
    this.serviced_date = item.serviced_date;
    if (this.serviced_date == "0000-00-00") {
      this.serviced_date = '';
    }
    this.comment_subject = item.comment_subject;
    this.comment_remark = item.comment_remark;
    //this.next_service_date = item.next_service_date;
    this.service_priority = item.service_priority;
    if (this.service_priority == "1") {
      this.priority_lowclass = "border_low";

    } else if (this.service_priority == "2") {

      this.priority_highclass = "border_high";
    }
    if (item.is_request > 0) {
      this.is_request = true;
    }
    this.comment_by_name = item.comment_by_name;
    this.unitDetailData.nextServiceDate = item.next_service_date;
    this.comment_resources = item.comment_resources;

    if (this.comment_resources != undefined && this.comment_resources != 'undefined' && this.comment_resources != '') {
      let hashhypenhash = this.comment_resources.split("#-#");
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i].split("|");
        let imgSrc;
        imgSrc = this.apiServiceURL + "/commentimages" + '/' + imgDataArr[1];
        this.addedServiceImgLists.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: imgDataArr[1],
          resouce_id: imgDataArr[0]
        });
      }



      this.uploadcount = 10;
      if (this.addedServiceImgLists.length > 9) {
        this.isUploaded = false;
      } else {
        let remcount = this.uploadcount - this.addedServiceImgLists.length;
        this.uploadcount = remcount;
      }
    }

    if (this.NP.get("act") == 'Add') {
      this.addedServiceImgLists = [];
      this.addedServiceImgLists.length = 0;
      this.unitDetailData.nextServiceDate = '';
      this.is_request = false;
      this.comment_remark = '';
      this.comment_subject = '';
      localStorage.setItem("microtime", "");
    }
  }
  doRemoveResouce(id, item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          if (id != undefined) {
            this.deleteEntry(id);
          }
          for (let q: number = 0; q < this.addedServiceImgLists.length; q++) {
            if (this.addedServiceImgLists[q] == item) {
              this.addedServiceImgLists.splice(q, 1);

            }
          }
          this.uploadcount = 10 - this.addedServiceImgLists.length;
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }


  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/" + recordID + "/removecommentresources";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          // this.conf.sendNotification(`File was successfully deleted`);
          this.conf.sendNotification(data.json().msg[0].result);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }


  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }



  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Attention',

      message: 'Please note that additional charges may apply, if requesting for Denyo Service Support.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.is_request = true;
            
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.is_request = false;
           
          }
        }
      ],
      cssClass: 'alertDanger'
    });
    confirm.present();
  }
  fileChooser(micro_timestamp) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Attachment',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'md-image',
          role: 'fromgallery',
          handler: () => {
            // var options = {
            //   quality: 25,
            //   destinationType: this.camera.DestinationType.FILE_URI,
            //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            //   allowEdit: true,
            //   encodingType: this.camera.EncodingType.JPEG,
            //   saveToPhotoAlbum: true
            // };

            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }
            this.camera.getPicture(options).then((imageURI) => {
              localStorage.setItem("receiptAttachPath", imageURI);
              
              this.fileTrans(imageURI, micro_timestamp);
              this.addedAttachList = imageURI;
            }, (err) => {

            });
          }
        }, {
          text: 'From Camera',
          icon: 'md-camera',
          handler: () => {
       

            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }

            this.camera.getPicture(options).then((uri) => {
             
              this.fileTrans(uri, micro_timestamp);
              this.addedAttachList = uri;
            }, (err) => {
              // Handle error
              this.conf.sendNotification(err);
            });
          }
        }, {
          text: 'Cancel',
          icon: 'md-close',
          role: 'cancel',
          handler: () => {
           
          }
        }
      ]
    });
    actionSheet.present();
    return false;
  }
  
}

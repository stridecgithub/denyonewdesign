import { Component, ViewChild, NgZone } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
import { DatePicker } from '@ionic-native/date-picker';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
import * as moment from 'moment';
declare var jQuery: any;
declare var mention: any;
/**
 * Generated class for the addhocPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addhoc',
  templateUrl: 'addhoc.html',
  providers: [Camera, FileTransfer, File, DatePicker, Config, FileChooser]
})
export class AddhocPage {
  @ViewChild('fileInput') fileInput;
  futuredatemsg;
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
  public serviced_by: any;
  //public serviced_date: any;
  serviced_date: String = '';
  public serviced_time: any;
  public servicemindate: any;
  public servicemaxdate: any;
  public service_subject: any;
  public isFuture: any;
  public minyr;
  public minmn;
  public mindt;
  public mn;
  currentyear;
  public service_remark: any;
  public msgcount: any;
  public notcount: any;
  public next_service_date: any;
  public service_priority: any;
  is_request: boolean
  public serviced_by_name: any;
  public service_resources: any;
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
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public hideActionButton = true;
  //tabBarElement: any;
  next_service_date_selected;
  atmentioneddata = [];
  companyId
  constructor(private filechooser: FileChooser, private conf: Config, public actionSheetCtrl: ActionSheetController, public platform: Platform, public http: Http, public alertCtrl: AlertController, private datePicker: DatePicker, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera
    , private transfer: FileTransfer, private ngZone: NgZone) {
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
    this.next_service_date_selected = 0;
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.isFuture = 0;
    this.uploadcount = 10;
    let cdate = new Date();
    this.currentyear = cdate.getFullYear();
    if (this.unitDetailData.nextServiceDate == '') {
      // this.isSubmitted = true;
    }

    this.servicemindate = this.minDateStr();
    this.servicemaxdate = this.maxDateStr();


    console.log("Max:" + this.servicemaxdate);

    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.serviced_by = localStorage.getItem("userInfoName");

    this.form = formBuilder.group({
      profilePic: [''],
      serviced_date: [''],//, Validators.required
      service_subject: [''],
      service_remark: ['', Validators.required],//
      serviced_by: [''],
      next_service_date: [''],
      is_request: ['']
    });
    this.service_priority = 0;
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });


    var date = new Date();

    //this.serviced_date = date.toISOString();

    this.serviced_date = moment().format();
    console.log("Date String:" + date.toTimeString());
    //this.serviced_time=date.toTimeString().split(" ")[0];
    console.log("Date Only" + this.serviced_date);
    //this.serviced_date = new Date().toJSON().split('T')[0];
    console.log("Default date is" + this.serviced_date);

    this.networkType = '';
    this.apiServiceURL = conf.apiBaseURL();
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
    console.log('ionViewDidLoad addhocPage');
    localStorage.setItem("fromModule", "addhocPage");

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
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
    // this.getPrority(1);
    //let users = localStorage.getItem("atMentionedStorage");
    this.is_request = false;
    console.log(JSON.stringify(this.NP.get("record")));



    if (this.NP.get("record")) {
      this.selectEntry(this.NP.get("record"));
      this.service_id = this.NP.get("record").service_id;
      if (this.NP.get("act") == 'Add') {
        //this.serviced_date = "";
        this.getPrority(0);
        this.service_remark = "";
        this.service_subject = "";
        this.next_service_date = "";
        this.isEdited = false;
        this.unitDetailData.pageTitle = 'Servicing Info Add';
        this.service_unitid = this.NP.get("unit_id");
      } else {
        this.service_unitid = this.NP.get("record").service_unitid;
        this.unitDetailData.pageTitle = 'Servicing Info Edit';
        this.isEdited = true;
        this.isSubmitted = false;
      }


      console.log("Service Id:" + this.service_id);
      console.log("Service Unit Id:" + this.service_unitid);
      // UnitDetails Api Call		
      let
        typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headersunit: any = new Headers({ 'Content-Type': typeunit }),
        optionsunit: any = new RequestOptions({ headers: headersunit }),
        urlunit: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.unitDetailData.userId +
          "&unitid=" + this.service_unitid;
      console.log(urlunit);
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
            console.log("Favorite Indication is" + this.unitDetailData.favoriteindication);

          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
      // Unit Details API Call
    }

    // Atmentioned API Calls
    // let
    //   //body: string = "key=delete&recordID=" + recordID,
    //   type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
    //   headers1: any = new Headers({ 'Content-Type': type }),
    //   options1: any = new RequestOptions({ headers: headers }),
    //   url1: any = this.apiServiceURL + "/api/atmentionednew.php?method=atmention&act=event&companyId=" + this.companyId + "&userId=" + this.unitDetailData.userId;
    // console.log(url);
    // this.http.get(url1, options1)
    //   .subscribe(data => {
    //     // If the request was successful notify the user
    //     if (data.status === 200) {
    //       this.atmentioneddata = data.json();
    //       // console.log(this.atmentioneddata);
    //       // jQuery('#service_remark').tagEditor({
    //       //   autocomplete: {
    //       //     delay: 0,
    //       //     position: { collision: 'flip' },
    //       //     source: this.atmentioneddata,
    //       //     delimiter: ',;'
    //       //   },
    //       //   forceLowercase: false
    //       // });

    //       // jQuery('#service_remark').tagEditor('addTag',  this.NP.get("record").service_remark,true);

    //     }
    //     // Otherwise let 'em know anyway
    //     else {
    //       this.conf.sendNotification('Something went wrong!');
    //     }
    //   }, error => {

    //   })

    let body1: string = '',
    //body: string = "key=delete&recordID=" + recordID,
    type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
    headers1: any = new Headers({ 'Content-Type': type }),
    options1: any = new RequestOptions({ headers: headers }),
    url1: any = this.apiServiceURL + "/hashtags?companyid=" + this.companyId + "&login=" + this.unitDetailData.userId;
  console.log(url1);
  this.http.get(url1, options1)

  // let body: string = param,

  //   type: string = "application/x-www-form-urlencoded; charset=UTF-8",
  //   headers: any = new Headers({ 'Content-Type': type }),
  //   options: any = new RequestOptions({ headers: headers }),
  //   url: any = urlstring;
  console.log("Message sending API" + url1+ "?" + body1);

  this.http.post(url1, body1, options1)

    .subscribe(data => {
      let res;
      // If the request was successful notify the user
      if (data.status === 200) {
       // this.atmentioneddata = data.json();
        res = data.json();
        console.log(data.json().staffs);

        if (res.staffs.length > 0) {
          for (let staff in res.staffs) {
            this.atmentioneddata.push({
              username: res.staffs[staff].username,
              name: res.staffs[staff].name,
            });
          }
        }
        // Otherwise let 'em know anyway
      } else {
        this.conf.sendNotification('Something went wrong!');
      }
    }, error => {

    })
  console.log(JSON.stringify("Array Result:" + this.atmentioneddata));
  jQuery(".service_remark").mention({
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

    // this.servicemindate = this.minyr + '-' + this.minmn + '-' + this.mindt
    console.log("Max:" + this.servicemaxdate);
    return this.servicemaxdate;

  }

  minDateStr() {

    let oneWeekAgo = new Date();
    let prevfivedays = oneWeekAgo.setDate(oneWeekAgo.getDate() - 5);
    console.log("Previous five days:" + prevfivedays);

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
    console.log("Min:" + this.servicemindate);
    return this.servicemindate;
  }
  fileTrans(path, micro_timestamp) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    console.log("File Name is:" + currentName);

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




    //  http://127.0.0.1/ionic/upload_attach.php
    //http://amahr.stridecdev.com/getgpsvalue.php?key=create&lat=34&long=45
    fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/fileupload.php?micro_timestamp=' + micro_timestamp, options)
      .then((data) => {
        // this.isSubmitted = true;
        // Upload Response is{"bytesSent":1872562,"responseCode":200,"response":"{\"error\":false,\"id\":51}","objectId":""}


        console.log("Upload Response is" + JSON.stringify(data))
        let res = JSON.parse(data.response);
        console.log(res.id);
        console.log(JSON.stringify(res));

        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + newFileName;
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
        this.isProgress = false;
        if (this.progress == 100) {
          //this.isSubmitted = false;
        }
        this.isUploadedProcessing = false;
        return false;



        // Save in Backend and MysQL
        //this.uploadToServer(data.response);
        // Save in Backend and MysQL
      }, (err) => {
        //loading.dismiss();
        console.log("Upload Error:" + JSON.stringify(err));
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

    console.log(this.form.controls);
    if (this.isUploadedProcessing == false) {
      let serviced_date: string = this.form.controls["serviced_date"].value,
        //service_remark: string = this.form.controls["service_remark"].value,
        next_service_date: string = this.form.controls["next_service_date"].value,
        serviced_by: string = this.form.controls["serviced_by"].value,
        is_request: string = this.form.controls["is_request"].value,
        service_subject: string = this.form.controls["service_subject"].value;
      console.log("serviced_date:" + serviced_date);


      if (serviced_date == undefined) {
        this.serviced_date = moment().format();
        console.log("Default date is" + this.serviced_date);
      } else {
        this.serviced_date = serviced_date;
      }
      let datesplit = this.serviced_date.split("T")[1];
      let timesplit = datesplit.split(":");
      this.hrvalue = timesplit[0];
      let minvalue = timesplit[1];
      let ampmstr = 'AM';
      if (this.hrvalue > 12) {
        ampmstr = 'PM';
      }
      let service_remark = jQuery(".service_remark").val();
      // serviced_date = this.serviced_date.split("T")[0];
      // let timevalue = this.hrvalue + ":" + minvalue + "" + ampmstr;
      let timevalue = this.hrvalue + ":" + minvalue + ":00";
      console.log(timevalue);
      console.log("service_remark:" + service_remark);
      console.log("serviced_by:" + serviced_by);
      console.log("is_request:" + is_request);
      console.log("service_subject:" + service_subject);
      console.log("nextServiceDate:" + this.unitDetailData.nextServiceDate);
      this.createEntry(this.serviced_date, timevalue, service_remark, next_service_date, serviced_by, this.is_request, service_subject, this.addedServiceImgLists, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);

    }

  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(serviced_date, serviced_time, service_remark, next_service_date, serviced_by, is_request, service_subject, addedImgLists, remarkget, nextServiceDate, micro_timestamp) {
    this.isSubmitted = true;
    //service_remark = localStorage.getItem("atMentionResult");
    //service_remark = jQuery(".service_remark");
    if (this.service_priority == undefined) {
      this.service_priority = '0';
    }
    if (this.service_priority == 'undefined') {
      this.service_priority = '0';
    }


    console.log("Form date:" + serviced_date);
    if (serviced_date == 'undefined') {

      serviced_date = new Date().toJSON();
      console.log("service datetime for form entry is 1" + serviced_date);
      //serviced_date = this.serviced_date
    }
    if (serviced_date == undefined) {
      serviced_date = new Date().toJSON();
      console.log("service datetime for form entry is 2" + serviced_date);
      //serviced_date = this.serviced_date
    }
    service_subject = 'Ad-hoc Service';

    if (is_request == true) {
      is_request = 1;
    } else {
      is_request = 0;
    }
    let is_denyo_support;

    if (is_request == true) {
      is_denyo_support = 1;
    } else {
      is_denyo_support = 0;
    }

    if (nextServiceDate == 'undefined') {
      nextServiceDate = '0000-00-00';
    } else if (nextServiceDate == undefined) {
      nextServiceDate = '0000-00-00';
    } else if (nextServiceDate == '') {
      nextServiceDate = '0000-00-00';
    }

    let body: string = "is_mobile=1" +
      "&service_priority=" + this.service_priority +
      "&service_unitid=" + this.service_unitid +
      "&serviced_datetime=" + serviced_date +
      "&service_scheduled_date=" + serviced_date +
      "&time=" + serviced_time +
      "&service_remark=" + service_remark +
      "&next_service_date=" + nextServiceDate +
      "&next_service_date_selected=" + this.next_service_date_selected +
      "&is_denyo_support=" + is_denyo_support +
      "&serviced_by=" + this.unitDetailData.userId +// "&serviced_by=" + this.unitDetailData.userId +
      "&created_by=" + this.unitDetailData.userId +
      "&is_request=" + is_request +
      "&service_subject=" + service_subject +
      "&micro_timestamp=" + micro_timestamp +
      "&uploadInfo=" + JSON.stringify(this.addedServiceImgLists),


      //// http://denyoappv2.stridecdev.com/services/adhocstore
      ///?is_mobile=1&service_unitid=1&serviced_date=2017-11-09&time=8 AM &service_remark=@arun&next_service_date=2018-2-7&is_denyo_support=1&serviced_by=1&created_by=1&service_status=1&is_request=false&service_subject=My service&micro_timestamp=2017109153351&uploadInfo=[]

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/adhocstore";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {


        // let res = data.json();
        //console.log("Success Data:" + data);
        // console.log("Success Data JSON:" + data.json());
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user

        if (data.status === 200) {
          /*this.service_subject = '';
          this.service_remark = '';
          this.addedServiceImgLists = [];
          localStorage.setItem("microtime", "");
          this.addedServiceImgLists = [];
          if (res.msg[0]['Error'] > 0) {
            this.conf.sendNotification(res.msg[0]['result']);
          }*/
         // this.conf.sendNotification(`Servicing info was successfully added`);
         this.conf.sendNotification(data.json().msg[0].result);
          this.navCtrl.setRoot(ServicinginfoPage, {
            record: this.NP.get("record"),
            unitid: this.service_unitid
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


  address1get(hashtag) {
    console.log(hashtag);
    this.unitDetailData.hashtag = hashtag;
  }


  getNextDate(val, field) {
    this.isFuture = 0;
    this.isSubmitted = false;
    console.log('1' + val);
    if (val == 14) {
      this.next_service_date_selected = 1;
    } else if (val == 30) {
      this.next_service_date_selected = 2;
    } else if (val == 90) {
      this.next_service_date_selected = 3;
    } else if (val == 0) {
      this.next_service_date_selected = 4;
    } else {
      this.next_service_date_selected = 0;
    }
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
      console.log("Month String:-" + mn);
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
      console.log("Date String:-" + dt);
      this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + monthstr + "-" + datestr;
    } else {
      let monthstr;
      let datestr;
      let mn = parseInt(date.getMonth() + 1);
      let dt = date.getDate();
      console.log("Month String:-" + mn);
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
      console.log("Date String:-" + dt);
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
    console.log("SubDays Function Result is:" + result);
    return result;
  }
  showDatePicker() {
    this.isSubmitted = false;
    console.log("showDatePicker:" + this.servicemaxdate);
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

        console.log('Got date: ', date);
        console.log(new Date().getTime() + "<" + date.getTime());
        if (new Date().getTime() < date.getTime()) {
          this.isFuture = 0;
          this.isSubmitted = false;
          console.log("Future Dates");
          this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + monthstr + "-" + date.getDate();
        } else {
          this.isFuture = 1;
          this.isSubmitted = true;
          console.log("Old Dates");
          this.unitDetailData.nextServiceDate = '';
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }




  previous() {
    this.addedServiceImgLists = [];
    if (this.NP.get("from") == 'service') {
      this.navCtrl.setRoot(ServicinginfoPage, {
        record: this.NP.get("record")
      });
    }
    else if (this.NP.get("from") == 'comment') {
      // this.navCtrl.setRoot(CommentsinfoPage);
    }
    else {
      this.navCtrl.setRoot(ServicinginfoPage, {
        record: this.NP.get("record")
      });
    }
  }






  selectEntry(item) {
    this.serviced_by = item.serviced_by;
    this.serviced_date = item.serviced_date;
    console.log("Service Date Time:" + this.serviced_date);
    if (this.serviced_date == "0000-00-00") {
      this.serviced_date = '';
    }
    this.service_subject = item.service_subject;
    this.service_remark = item.service_remark;
    //this.next_service_date = item.next_service_date;
    this.service_priority = item.service_priority;
    console.log("X" + this.service_priority);
    if (this.service_priority == "1") {
      this.priority_lowclass = "border_low";

    } else if (this.service_priority == "2") {

      this.priority_highclass = "border_high";
    }
    if (item.is_request > 0) {
      this.is_request = true;
    }
    this.serviced_by_name = item.serviced_by_name;
    this.service_resources = item.service_resources;
    this.unitDetailData.nextServiceDate = item.next_service_date;
    this.service_resources = item.service_resources;

    if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {
      let hashhypenhash = this.service_resources.split("#-#");
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i].split("|");
        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + imgDataArr[1];
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
      console.log("Fresh Clear add service info.ts start...");
      this.addedServiceImgLists = [];
      this.addedServiceImgLists.length = 0;
      this.unitDetailData.nextServiceDate = '';
      this.is_request = false;
      this.service_remark = '';
      this.service_subject = '';
      localStorage.setItem("microtime", "");
    }
  }
  doRemoveResouce(id, item) {
    console.log("Deleted Id" + id);
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
          console.log("After Deleted" + JSON.stringify(this.addedServiceImgLists));
          console.log("After Deleted Upload count length:" + this.uploadcount);
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
      url: any = this.apiServiceURL + "/" + recordID + "/removeresource";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`File was successfully deleted`);
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
          text: 'Cancel',
          handler: () => {
            this.is_request = false;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.is_request = true;
            console.log('Confirm clicked');
          }
        }

      ],
      cssClass: 'alertDanger adhoc-alert'
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
              console.log(imageURI);
              this.fileTrans(imageURI, micro_timestamp);
              this.addedAttachList = imageURI;
            }, (err) => {

            });
          }
        }, {
          text: 'From Camera',
          icon: 'md-camera',
          handler: () => {
            console.log('Camera clicked');
            // const options: CameraOptions = {
            //   quality: 25,
            //   destinationType: this.camera.DestinationType.FILE_URI,
            //   sourceType: 1,
            //   targetWidth: 200,
            //   targetHeight: 200,
            //   saveToPhotoAlbum: true

            // };

            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }

            this.camera.getPicture(options).then((uri) => {
              console.log(uri);
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
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
    return false;
  }

  // futureDateValidation(formvalue) {
  //   this.isSubmitted = true;
  //   let date = new Date();
  //   let mn = date.getMonth() + 1;
  //   if (mn < 10) {
  //     this.mn = "0" + mn;
  //   } else {
  //     this.mn = mn;
  //   }
  //   let current_date = date.getFullYear() + "-" + this.mn + "-" + date.getDate();
  //   if (formvalue.split("T")[0] >= current_date) {
  //     this.isSubmitted = false;
  //   } else {     
  //     this.isSubmitted = true;
  //   }
  // }


  AddhocFutureDateValidation(formvalue) {
    this.futuredatemsg = '';
    this.isSubmitted = true;
    let date = new Date();
    let mn = date.getMonth() + 1;
    if (mn < 10) {
      this.mn = "0" + mn;
    } else {
      this.mn = mn;
    }
    let dd = date.getDate();
    if (dd < 10) {
      this.dd = "0" + dd;
    } else {
      this.dd = dd;
    }

    let current_date = date.getFullYear() + "-" + this.mn + "-" + this.dd;
    if (formvalue.split("T")[0] > current_date) {
      this.futuredatemsg = "No future date is allowed";
      console.log("C");
      this.serviced_date = moment().format();
      this.isSubmitted = true;
    } else {

      this.isSubmitted = false;
    }
    console.log(this.futuredatemsg);
    console.log(this.futuredatemsg);
    if (this.futuredatemsg != '') {
      this.showAlert('', 'Please select current date or previous date.')
    }
  }
  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}

import { Component, ViewChild, NgZone } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, ViewController, Platform, App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
import { DatePicker } from '@ionic-native/date-picker';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { Config } from '../../config/config';
import * as moment from 'moment';
declare var jQuery: any;
/*declare var triggeredAutocomplete: any;*/
/**
 * Generated class for the addhocPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-servicedetails',
  templateUrl: 'servicedetails.html',
  providers: [Camera, FileTransfer, File, Config, Camera, DatePicker, FileChooser]
})
export class ServicedetailsPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  public photoInfo = [];
  public addedImgListsArray = [];
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
  public mn: any;
  public serviced_by: any;
  atmentioneddata = [];
  //public serviced_date: any;
  serviced_date: String = new Date().toISOString();
  public serviced_time: any;
  public servicemindate: any;
  public servicemaxdate: any;
  public service_subject: any;
  service_scheduled_date: String = new Date().toISOString();
  public service_scheduled_time: any
  serviced_scheduled_display;
  serviced_created_name;
  serviced_created_name_hastag;
  serviced_created_name_hastag_withinclosedbracket;
  public created_by_hashtag: any
  public created_by_photo: any;
  public isFuture: any;
  public minyr;
  public minmn;
  public mindt;

  public service_remark: any;
  public msgcount: any;
  public notcount: any;
  public next_service_date: any;
  public next_service_date_mobileview: any;
  public service_priority: any;
  is_request: any;
  futuredatemsg;
  public serviced_by_name: any;
  public service_resources: any;
  micro_timestamp: any;
  description: any;
  companyId;
  public isUploadedProcessing: boolean = false;
  public isProgress = false;
  public isUploaded: boolean = true;
  item: any;
  public isEdited: boolean = false;
  private apiServiceURL: string = "";
  public networkType: string;
  form: FormGroup;
  next_service_date_selected;
  next_service_date_highlight;
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
    addedImgLists2: '',
    nextServiceDateDisplay: ''
  }
  public hideActionButton = true;
  //tabBarElement: any;
  weekselection;
  onemonthselection;
  threemonthselection;
  calendarmonthselection;
  currentyear;
  service_time;
  hoursadd24hourformat;
  monthstr;
  constructor(public app: App, private conf: Config, public actionSheetCtrl: ActionSheetController, public platform: Platform, public http: Http, public alertCtrl: AlertController, private datePicker: DatePicker, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera
    , private transfer: FileTransfer, private ngZone: NgZone) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.addedServiceImgLists = [];
        if (this.NP.get("from") == 'service') {
          this.navCtrl.setRoot(ServicinginfoPage, {
            record: this.NP.get("record")
          });
        }
        else if (this.NP.get("from") == 'commentinfo') {
          this.navCtrl.setRoot(CommentsinfoPage, {
            record: this.NP.get("record")
          });
        }
        else {
          this.navCtrl.setRoot(ServicinginfoPage, {
            record: this.NP.get("record")
          });
        }
      });
    });


    // this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.next_service_date_selected = 0;
    this.isFuture = 0;
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.uploadcount = 10;
    let datey = new Date();
    this.currentyear = datey.getFullYear();
    this.serviced_date = moment().format();
    this.service_scheduled_date = moment().format();
    this.servicemindate = this.minDateStr();
    this.servicemaxdate = this.maxDateStr();

    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.serviced_by = localStorage.getItem("userInfoName");

    this.form = formBuilder.group({
      profilePic: [''],
      service_remark: [''],
      service_subject: ['', Validators.required],
      serviced_by: [''],
      next_service_date: [''],
      is_request: [''],
      description: ['', Validators.required],
      service_scheduled_date: ['', Validators.required],
    });
    this.service_priority = 0;
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });


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


    //var date = new Date();

    this.serviced_date = moment().format();


    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();


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
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';
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
        this.service_id = this.NP.get("record").service_id;
        this.unitDetailData.pageTitle = 'Servicing Info Edit';
        this.isEdited = true;
        this.isSubmitted = false;
      }


      // UnitDetails Api Call		
      let
        typeunit: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headersunit: any = new Headers({ 'Content-Type': typeunit }),
        optionsunit: any = new RequestOptions({ headers: headersunit }),
        urlunit: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.unitDetailData.userId +
          "&unitid=" + this.service_unitid;

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


      options1: any = new RequestOptions({ headers: headers }),
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

    jQuery(".service_remark").mention({
      users: this.atmentioneddata
    });


    jQuery(".description").mention({
      users: this.atmentioneddata
    });



    // Atmentioned API Calls

  }
  favoriteaction(unit_id) {
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.unitDetailData.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitfavorite";


    this.http.post(url, body, options)
      .subscribe(data => {
        let favorite;
        if (data.json().favorite == '1') {
          favorite = "favorite";
        }
        else {
          favorite = "unfavorite";

        }
        this.unitDetailData.favoriteindication = favorite;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }



  takePictureURL(micro_timestamp) {
    this.isUploadedProcessing = true;
    // const options: CameraOptions = {
    //   quality: 25,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   saveToPhotoAlbum: true
    // }

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.fileTrans(imageData, micro_timestamp);
      this.addedAttachList = imageData;
    }, (err) => {
      // Handle error
      this.conf.sendNotification(err);
    });
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
    fileTransfer.upload(path, this.apiServiceURL + '/fileupload.php?micro_timestamp=' + micro_timestamp, options)
      .then((data) => {
        this.isProgress = true;

        let res = JSON.parse(data.response);


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
        if (this.progress == 100) {
          this.isSubmitted = false;
        }
        this.isProgress = false;
        this.isUploadedProcessing = false;
        return false;
      }, (err) => {

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

  saveEntry(status) {
    if (this.isUploadedProcessing == false) {
      let service_remark = jQuery(".service_remark").val();
      let description = jQuery(".description").val();


      // Personal hashtag checking....
      let toaddress1 = jQuery(".description").val();
      let param1 = "toaddress=" + toaddress1 + "&ismobile=1&type=textarea";
      let body1: string = param1,

        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/messages/chkemailhashtags";

      this.http.post(url1, body1, options1)
        .subscribe((data) => {
          if (data.json().invalidusers == '') {

          } else {
            this.conf.sendNotification(data.json().invalidusers + " are not available in the user list!");
            return false;
          }
        });
      // Personal hashtag checking....


      if (status == 1) {
        if (service_remark == '') {
          this.conf.sendNotification("Service remark is required");
          return false;
        }
      }
      let

        next_service_date: string = this.form.controls["next_service_date"].value,
        serviced_by: string = this.form.controls["serviced_by"].value,
        is_request: string = this.form.controls["is_request"].value,
        service_scheduled_date: string = this.form.controls["service_scheduled_date"].value,

        service_subject: string = this.form.controls["service_subject"].value;



      // Personal hashtag checking....
      let toaddress = jQuery(".service_remark").val();
      let param = "toaddress=" + toaddress + "&ismobile=1&type=textarea";
      let body: string = param,

        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/messages/chkemailhashtags";

      this.http.post(url, body, options)
        .subscribe((data) => {

          if (data.json().invalidusers == '') {
            this.createEntry(service_scheduled_date, description, status, service_scheduled_date, '', service_remark, next_service_date, serviced_by, is_request, service_subject, this.addedServiceImgLists, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);
          } else {
            this.conf.sendNotification(data.json().invalidusers + " are not available in the user list!");
            return false;
          }
        });
      // Personal hashtag checking....


    }

  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(service_scheduled_date, description, status, serviced_date, serviced_time, service_remark, next_service_date, serviced_by, is_request, service_subject, addedImgLists, remarkget, nextServiceDate, micro_timestamp) {
    this.isSubmitted = true;



    // if (localStorage.getItem("atMentionResult") != '') {
    //   service_remark = localStorage.getItem("atMentionResult");
    // }
    if (this.service_priority == undefined) {
      this.service_priority = '0';
    }
    if (this.service_priority == 'undefined') {
      this.service_priority = '0';
    }

    if (nextServiceDate == 'undefined') {
      nextServiceDate = '';
    } else if (nextServiceDate == undefined) {
      nextServiceDate = '';
    } else if (nextServiceDate == '') {
      nextServiceDate = '';
    }


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
    if (status == 1) {
      serviced_by = this.unitDetailData.userId;
    } else if (status == 0) {
      serviced_by = '0';
    } else {
      serviced_by = '0';
    }
    // service_subject = 'my service';
    let pushnotify = service_remark.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    let descriptionnotify = description.replace(/(\r\n\t|\n|\r\t)/gm, " ");
    let body: string = "is_mobile=1" +

      "&service_unitid=" + this.service_unitid +
      "&serviced_datetime=" + serviced_time +
      "&serviceid=" + this.service_id +
      "&time=" + serviced_time +
      "&service_status=" + status +
      "&service_scheduled_date=" + serviced_date +
      "&pushnotify=" + pushnotify +
      "&descriptionnotify=" + descriptionnotify +
      "&description=" + encodeURIComponent(description.toString()) +
      "&service_remark=" + encodeURIComponent(service_remark.toString()) +
      "&service_description=" +
      "&next_service_date=" + nextServiceDate +
      "&next_service_date_selected=" + this.next_service_date_selected +
      "&is_denyo_support=" + is_denyo_support +
      "&serviced_by=" + serviced_by +
      "&created_by=" + this.unitDetailData.userId +
      "&is_request=" + is_request +
      "&service_subject=" + service_subject +
      "&micro_timestamp=" + micro_timestamp +
      "&uploadInfo=" + JSON.stringify(this.addedServiceImgLists),



      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/serviceupdate";
    this.http.post(url, body, options)
      .subscribe((data) => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.service_subject = '';
          this.service_remark = '';
          this.addedServiceImgLists = [];
          localStorage.setItem("microtime", "");
          this.addedServiceImgLists = [];
          if (data.json().msg[0]['pushid'] != '') {
            this.quickPush(data.json().msg[0]['pushid']);
          }
          this.conf.sendNotification(data.json().msg[0]['result']);
          // this.conf.sendNotification(`Servicing info was successfully updated`);
          localStorage.setItem("atMentionResult", '');

          if (this.NP.get("from") == 'commentinfo') {
            this.navCtrl.setRoot(CommentsinfoPage, {
              record: this.NP.get("record")
            });
          } else {
            this.navCtrl.setRoot(ServicinginfoPage, {
              record: this.NP.get("record")
            });
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }


  quickPush(pushid) {
    // Notification count
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/api/quickpush.php?pushid=" + pushid;
    this.http.get(url, options)
      .subscribe((data) => {
        // this.msgcount = data.json().msgcount;
        //this.notcount = data.json().notifycount;
      }, error => {
      });
    // Notiifcation count
  }


  getNextDate(val) {
    this.isFuture = 0;
    this.isSubmitted = false;
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

    let minutes;
    minutes = parseInt(date.getMinutes());
    if (minutes < 10) {
      minutes = "0" + minutes;
    } else {
      minutes = minutes;
    }

    let hours;
    hours = parseInt(date.getHours());
    if (hours < 10) {
      hours = "0" + hours;
    } else {
      hours = hours;
    }

    let seconds;
    seconds = parseInt(date.getSeconds());
    if (seconds < 10) {
      seconds = "0" + seconds;
    } else {
      seconds = seconds;
    }


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



    this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + monthstr + "-" + datestr + "T" + hours + ":" + minutes + ":" + seconds;///+ " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    this.unitDetailData.nextServiceDateDisplay = date.getFullYear() + "-" + monthstr + "-" + datestr;


    if (this.unitDetailData.nextServiceDate != '') {
      //this.isSubmitted = false;
    } else {
      //this.isSubmitted = true;
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

        let datestr = new Date();
        let minutes;
        minutes = datestr.getMinutes();
        if (minutes < 10) {
          minutes = "0" + minutes;
        } else {
          minutes = minutes;
        }

        let hours;
        hours = datestr.getHours();
        if (hours < 10) {
          hours = "0" + hours;
        } else {
          hours = hours;
        }

        let seconds;
        seconds = datestr.getSeconds();
        if (seconds < 10) {
          seconds = "0" + seconds;
        } else {
          seconds = seconds;
        }
        this.monthstr = date.getMonth();
        if (this.monthstr < 10) {
          this.monthstr = "0" + this.monthstr;
        } else {
          this.monthstr = this.monthstr;
        }

        if (new Date().getTime() < date.getTime()) {
          this.isFuture = 0;
          this.isSubmitted = false;

          this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + this.monthstr + "-" + date.getDate() + "T" + hours + ":" + minutes + ":" + seconds;
          this.unitDetailData.nextServiceDateDisplay = date.getFullYear() + "-" + this.monthstr + "-" + date.getDate();
        } else {
          this.isFuture = 1;
          this.isSubmitted = true;
          this.unitDetailData.nextServiceDate = '';
          this.unitDetailData.nextServiceDateDisplay = '';
        }
      },
      err => { }
      );
  }




  previous() {
    this.addedServiceImgLists = [];
    if (this.NP.get("from") == 'service') {
      this.navCtrl.setRoot(ServicinginfoPage, {
        record: this.NP.get("record")
      });
    }
    else if (this.NP.get("from") == 'commentinfo') {
      this.navCtrl.setRoot(CommentsinfoPage, {
        record: this.NP.get("record")
      });
    }
    else {
      this.navCtrl.setRoot(ServicinginfoPage, {
        record: this.NP.get("record")
      });
    }
  }






  selectEntry(item) {
    if (this.NP.get("act") == 'Add') {
      this.addedServiceImgLists = [];
      this.addedServiceImgLists.length = 0;
      this.unitDetailData.nextServiceDate = '';
      this.is_request = false;
      this.service_remark = '';
      this.service_subject = '';
      localStorage.setItem("microtime", "");
    } else {

      this.service_subject = item.service_subject;

      this.serviced_scheduled_display = item.serviced_scheduled_display;
      this.serviced_date = item.serviced_scheduled_display;
      if (this.serviced_scheduled_display != '') {
        if (item.serviced_schduled_date == undefined) {
          item.serviced_schduled_date = item.service_scheduled_date;
        }

      }





      this.service_scheduled_date = item.serviced_datetime_edit;


      this.serviced_created_name = item.serviced_created_name;
      this.serviced_created_name_hastag = item.serviced_created_name_hastag;
      this.serviced_created_name_hastag_withinclosedbracket = item.serviced_created_name_hastag_withinclosedbracket;

      this.next_service_date_selected = item.next_service_date_selected;

      if (this.next_service_date_selected == 1) {
        this.weekselection = 'weekselection';
        this.next_service_date = item.next_service_date;
      } else if (this.next_service_date_selected == 2) {
        this.onemonthselection = 'onemonthselection';
        this.next_service_date = item.next_service_date;
      } else if (this.next_service_date_selected == 3) {
        this.threemonthselection = 'threemonthselection';
        this.next_service_date = item.next_service_date;
      } else if (this.next_service_date_selected == 4) {
        this.calendarmonthselection = 'calendarmonthselection';
        this.next_service_date = item.next_service_date;
      } else {
        this.next_service_date = '';
      }
      this.next_service_date_mobileview = item.next_service_date_mobileview;

      if (item.description == undefined) {
        this.description = item.service_description;
      } else {
        this.description = item.description;
      } this.service_remark = item.service_remark;
      this.service_scheduled_time = item.service_scheduled_time;
      this.created_by_hashtag = item.serviced_created_name;
      this.created_by_photo = item.user_photo;
      this.service_resources = item.service_resources;
      this.service_subject = item.service_subject
      this.service_id = item.service_id;
      this.is_request = item.is_request;
      if (this.is_request > 0) {
        this.is_request = true;
      } else {
        this.is_request = false;
      }
    }

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
    }

  }
  doImageResources(service_id) {
    let body: string = "serviceid=" + service_id,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/servicebyid";

    this.http.post(url1, body, options1)
      .subscribe((data) => {

        this.service_resources = data.json().servicedetail[0].service_resources;
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
      });
  }
  doRemoveResouce(id, item, service_id) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          if (id != undefined) {
            this.deleteEntry(id, service_id);
          }
          //this.addedServiceImgLists = [];
          //this.addedServiceImgLists.length = 0;
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
  deleteEntry(recordID, service_id) {
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
          //   this.conf.sendNotification(`File was successfully deleted`);

          this.conf.sendNotification(data.json().msg[0]['result']);
          //this.doImageResources(service_id);
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
  redirectToUser() {
    this.navCtrl.setRoot(UnitsPage);
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

          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.is_request = true;

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


  futureDateValidation(formvalue) {
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
    if (formvalue.split("T")[0] >= current_date) {
      this.isSubmitted = false;

    } else {
      this.futuredatemsg = "You have selected previous date is" + formvalue.split("T")[0] + ".No previous date is allowed";

      this.service_scheduled_date = moment().format();
      this.isSubmitted = true;
    }


    if (this.futuredatemsg != '') {
      this.showAlert('', 'Please select current date or future date.')
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

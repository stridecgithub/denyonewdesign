import { Component, ViewChild, NgZone } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, ViewController, Platform ,App} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
//import { DatePicker } from '@ionic-native/date-picker';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
import { FileChooser } from '@ionic-native/file-chooser';
import * as moment from 'moment';
import 'moment-timezone';

declare var jQuery: any;
/*declare var triggeredAutocomplete: any;*/
/**
 * Generated class for the AddserviceinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addserviceinfo',
  templateUrl: 'addserviceinfo.html',
  providers: [Camera, FileTransfer, File, Config, FileChooser]
})
export class AddserviceinfoPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  public photoInfo = [];
  public addedImgListsArray = [];
  public addedServiceImgLists = [];
  progress: number;
  futuredatemsg;
  public uploadcount: any;
  public priority_lowclass: any;
  public priority_highclass: any;
  public isSubmitted: boolean = false;
  public recordID: any;
  public service_unitid: any;
  public service_id: any;
  public hrvalue: any;
  public dd: any;
  public mm: any;
  public mn: any;
  public serviced_by: any;
  //public serviced_datetime: any;
  serviced_datetime: String = '';
  public servicemindate: any;
  public servicemaxdate: any;
  public service_subject: any;
  public description: any;
  public isFuture: any;
  public minyr;
  public minmn;
  public mindt;
  mindate;
  currentyear;
  //public service_remark: any;
  public msgcount: any;
  public notcount: any;
  public next_service_date: any;
  public service_priority: any;
  //is_request: boolean
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
  public atmentioneddata = [];
  public companyId: any;

  constructor(private app:App, private conf: Config, public actionSheetCtrl: ActionSheetController, public platform: Platform, public http: Http, public alertCtrl: AlertController, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera
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
        else if (this.NP.get("from") == 'comment') {
          // this.navCtrl.setRoot(CommentsinfoPage);
        }
        else {
          this.navCtrl.setRoot(ServicinginfoPage, {
            record: this.NP.get("record")
          });
        }
      });
    });
    let date = new Date();
    this.currentyear = date.getFullYear();

    console.log("Min date:" + this.mindate);
    this.isFuture = 0;
    this.uploadcount = 10;
    this.serviced_datetime = moment().format(); // 2018-01-16T23:08:57+05:30
    console.log(this.serviced_datetime);


    this.servicemindate = this.minDateStr();
    this.servicemaxdate = this.maxDateStr();


    console.log("Max:" + this.servicemaxdate);

    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.serviced_by = localStorage.getItem("userInfoName");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.form = formBuilder.group({
      serviced_datetime: [''],
      service_subject: ['', Validators.required],
      description: ['', Validators.required],
      serviced_by: [''],
      is_request: ['']
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
    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();
    // this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

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
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    // this.tabBarElement.style.display = 'none';
    this.addedServiceImgLists = [];
    console.log('ionViewDidLoad AddserviceinfoPage');
    localStorage.setItem("fromModule", "AddserviceinfoPage");
    /*
        // Atmentioned API Calls
        let
          //body: string = "key=delete&recordID=" + recordID,
          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "/api/atmentionednew.php?method=atmention&act=event&companyId=1&userId=1";
        
        this.http.get(url, options)
          .subscribe(data => {
            // If the request was successful notify the user
            if (data.status === 200) {
              this.atmentioneddata = data.json();
              console.log(this.atmentioneddata);
             
            }
            // Otherwise let 'em know anyway
            else {
              this.conf.sendNotification('Something went wrong!');
            }
          }, error => {
    
          })
    
        // Atmentioned API Calls
        jQuery('#description').triggeredAutocomplete({
          source: this.atmentioneddata
        });*/


    // Atmentioned API Calls
    let body: string = '',
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/hashtags?companyid=" + this.companyId + "&login=" + this.unitDetailData.userId;
    
    this.http.get(url, options)

    // let body: string = param,

    //   type: string = "application/x-www-form-urlencoded; charset=UTF-8",
    //   headers: any = new Headers({ 'Content-Type': type }),
    //   options: any = new RequestOptions({ headers: headers }),
    //   url: any = urlstring;
    console.log("Message sending API" + url + "?" + body);

    this.http.post(url, body, options)

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
    console.log(JSON.stringify("Array Result:" + this.atmentioneddata));
    jQuery(".description").mention({
      users: this.atmentioneddata
    });
  }


  ionViewWillEnter() {
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
    
    

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
    //this.is_request = false;
    console.log(JSON.stringify(this.NP.get("record")));



    if (this.NP.get("record")) {
      this.selectEntry(this.NP.get("record"));
      this.service_id = this.NP.get("record").service_id;
      if (this.NP.get("act") == 'Add') {
        //this.serviced_datetime = "";
        this.getPrority(0);
        //this.service_remark = "";
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
      console.log(imageData);
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
        this.isSubmitted = true;
        // Upload Response is{"bytesSent":1872562,"responseCode":200,"response":"{\"error\":false,\"id\":51}","objectId":""}


        console.log("Upload Response is" + JSON.stringify(data))
        let res = JSON.parse(data.response);
        console.log(res.id);
        

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
          this.isSubmitted = false;
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



    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      console.log(this.form.controls);
      if (this.isUploadedProcessing == false) {
        let serviced_datetime: string = this.form.controls["serviced_datetime"].value,
          serviced_by: string = this.unitDetailData.userId,
          service_subject: string = this.form.controls["service_subject"].value;
        let description = jQuery('.description').val();

        // Personal hashtag checking....
        let toaddress = jQuery(".description").val();
        let param = "toaddress=" + toaddress + "&ismobile=1&type=textarea";
        let body: string = param,

          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "/messages/chkemailhashtags";
        console.log("Chkemailhashtags API" + url + "?" + body);

        this.http.post(url, body, options)
          .subscribe((data) => {
            console.log("Chkemailhashtags response success:" + JSON.stringify(data.json()));
            console.log("1" + data.json().invalidusers);
            if (data.json().invalidusers == '') {
              this.createEntry(description, serviced_datetime, serviced_by, service_subject);
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
  createEntry(description, serviced_date, serviced_by, service_subject) {
    this.isSubmitted = true;



    if (this.service_priority == undefined) {
      this.service_priority = '0';
    }
    if (this.service_priority == 'undefined') {
      this.service_priority = '0';
    }


    console.log("Form date:" + serviced_date);
    if (serviced_date == 'undefined') {

      this.serviced_datetime = new Date().toJSON().split('T')[0];
      console.log("service datetime for form entry is 1" + this.serviced_datetime);
      serviced_date = this.serviced_datetime
    }
    if (serviced_date == undefined) {
      this.serviced_datetime = new Date().toJSON().split('T')[0];
      console.log("service datetime for form entry is 2" + this.serviced_datetime);
      serviced_date = this.serviced_datetime
    }

    //description = localStorage.getItem("atMentionResult");
  let body: string = "is_mobile=1" +
      //"&service_priority=" + this.service_priority +
      "&unitid=" + this.service_unitid +
      "&dateandtime=" + serviced_date +
      // "&service_remark=" + service_remark +
      "&description=" + description +
      //"&time=" + serviced_time +
      //"&next_service_date=" + nextServiceDate +
      "&is_denyo_support=0" +
      "&created_by=" + this.unitDetailData.userId +
      "&is_request=0" +
      "&subject=" + service_subject,
      //"&micro_timestamp=" + micro_timestamp +
      //"&uploadInfo=" + JSON.stringify(this.addedServiceImgLists),
      //"&contact_number=" + this.contact_number +
      //"&contact_name=" + this.contact_name +
      //"&nextServiceDate=" + nextServiceDate,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/newserviceschedule";
    
    

    this.http.post(url, body, options)
      .subscribe((data) => {
        let res = data.json();
        
        // If the request was successful notify the user
        if (data.status === 200) {
          this.service_subject = '';
          //this.service_remark = '';
          this.addedServiceImgLists = [];
          localStorage.setItem("microtime", "");
          this.addedServiceImgLists = [];
          //if (res.msg[0]['Error'] > 0) {
          // this.conf.sendNotification(res.msg[0]['result']);
          //}
          // this.conf.sendNotification(`New service scheduled added successfully`);
          this.conf.sendNotification(res.msg[0]['result']);
          this.navCtrl.setRoot(ServicinginfoPage, {
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
            // this.is_request = true;
            console.log('Confirm clicked');
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            // this.is_request = false;
            console.log('Cancel clicked');
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
            const options: CameraOptions = {
              quality: 25,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: 1,
              targetWidth: 200,
              targetHeight: 200,
              saveToPhotoAlbum: true
            };


            // const options: CameraOptions = {
            //   quality: 100,
            //   destinationType: this.camera.DestinationType.FILE_URI,
            //   encodingType: this.camera.EncodingType.JPEG,
            //   mediaType: this.camera.MediaType.PICTURE
            // }


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
  }

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

      this.serviced_datetime = moment().format();
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

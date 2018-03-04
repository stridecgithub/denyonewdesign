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
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
import * as moment from 'moment';
/**
 * Generated class for the AddserviceinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addrequestsupport',
  templateUrl: 'addrequestsupport.html',
  providers: [Camera, FileTransfer, File, DatePicker, Config, FileChooser]
})
export class AddrequestsupportPage {
  @ViewChild('fileInput') fileInput;
  public uploadcount: any;
  isReadyToSave: boolean;
  public photoInfo = [];
  public addedImgListsArray = [];
  public addedServiceImgLists = [];
  progress: number;
  public recordID: any;
  public service_unitid: any;
  public service_subject: any;
  public service_remark: any;
  public service_resources: any;
  public service_id: any;
  micro_timestamp: any;
  public msgcount: any;
  public notcount: any;
  hrvalue;
  serviced_datetime;
  public isSubmitted: boolean = false;
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
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public hideActionButton = true;
  //tabBarElement: any;
  constructor(private filechooser: FileChooser, private conf: Config, public actionSheetCtrl: ActionSheetController, public platform: Platform, public http: Http, public alertCtrl: AlertController, private datePicker: DatePicker, public NP: NavParams, public nav: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, private transfer: FileTransfer,
    private ngZone: NgZone) {
    this.uploadcount = 10;
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.serviced_by = localStorage.getItem("userInfoName");
    this.addedServiceImgLists = [];
    this.form = formBuilder.group({
      service_subject: ['', Validators.required],
      service_remark: ['', Validators.required]
    });

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
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.previous();
      });
    });
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillLeave() {
   // this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
   // this.tabBarElement.style.display = 'none';
    this.addedServiceImgLists = [];
    console.log('ionViewDidLoad AddrequestsupportPage');
    localStorage.setItem("fromModule", "AddrequestsupportPage");
  }

  ionViewWillEnter() {
    this.addedServiceImgLists = [];
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
    this.unitDetailData.unit_id = localStorage.getItem("unitId");
    if (this.unitDetailData.unit_id == undefined) {
      this.unitDetailData.unit_id = this.NP.get("record").unit_id;
    }
    if (this.unitDetailData.unit_id == 'undefined') {
      this.unitDetailData.unit_id = this.NP.get("record").unit_id;
    }
    if (this.NP.get("record")) {
      console.log("Np record param from previous" + JSON.stringify(this.NP.get("record")));
      this.selectEntry(this.NP.get("record"));


      if (this.NP.get("act") == 'Add') {
        this.service_remark = "";
        this.service_subject = "";

        this.isEdited = false;
        this.unitDetailData.pageTitle = 'Request Support Add';
        this.service_unitid = this.unitDetailData.unit_id;
      } else {
        this.service_unitid = this.unitDetailData.unit_id;
        this.unitDetailData.pageTitle = 'Request Support Edit';
        this.isEdited = true;
      }

      console.log("Service Unit Id:" + this.service_unitid);
    }




    this.unitDetailData.unit_id = localStorage.getItem("unitId");
    this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    this.unitDetailData.location = localStorage.getItem("unitlocation");
    this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    this.unitDetailData.favoriteindication = localStorage.getItem("unitfav");
    console.log("Add Comment Color Code:" + this.unitDetailData.colorcodeindications);
    this.unitDetailData.lat = localStorage.getItem("unitlat");
    this.unitDetailData.lng = localStorage.getItem("unitlng");
    this.unitDetailData.rh = localStorage.getItem("runninghr");
    this.unitDetailData.ns = localStorage.getItem("nsd");


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
        this.isSubmitted = false;

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
      /* let name: string = this.form.controls["lat"].value,
         description: string = this.form.controls["long"].value,
         photos: object = this.addedImgLists;*/


      let service_remark: string = this.form.controls["service_remark"].value,
        service_subject: string = this.form.controls["service_subject"].value;

      console.log("service_remark:" + service_remark);

      console.log("service_subject:" + service_subject);
      console.log("nextServiceDate:" + this.unitDetailData.nextServiceDate);
      console.log("Image Data" + JSON.stringify(this.addedServiceImgLists));
      //let d = new Date();
      //let micro_timestamp = d.getFullYear() + "" + d.getMonth() + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
      if (this.isEdited) {
        //this.updateEntry(service_remark, service_subject, this.addedServiceImgLists, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);
      }
      else {
        this.createEntry(service_remark, service_subject, this.addedServiceImgLists, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);
      }
    }

  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(service_remark, service_subject, addedImgLists, remarkget, nextServiceDate, micro_timestamp) {
    this.isSubmitted = true;

   // let serviced_datetime = new Date().toJSON().split('T');
    var date = new Date();
    let serviced_datetime = moment().format();
    console.log("Default date is" + serviced_datetime);

    let datesplit = serviced_datetime.split("T")[1];
    let timesplit = datesplit.split(":");
    this.hrvalue = timesplit[0];
    let minvalue = timesplit[1];
    let ampmstr = 'AM';
    if (this.hrvalue > 12) {
      ampmstr = 'PM';
    }
    this.serviced_datetime = serviced_datetime.split("T");
    //let timevalue = this.hrvalue + ":" + minvalue + "" + ampmstr;
    let timevalue = this.hrvalue + ":" + minvalue + ":00"
    console.log(timevalue);
    let body: string = "is_mobile=1" +
      //"&service_priority=" + this.service_priority +
      "&unitid=" + this.service_unitid +
      "&dateandtime=" + serviced_datetime +
      // "&service_remark=" + service_remark +
      "&description=" + service_remark +
      "&time=" + timevalue +
      //"&next_service_date=" + nextServiceDate +
      "&is_denyo_support=1" +
      "&created_by=" + this.unitDetailData.userId +
      "&serviced_by=" + this.unitDetailData.userId +
      "&is_request=1" +
      "&subject=" + service_subject+
      "&micro_timestamp=" + micro_timestamp +
      "&uploadInfo=" + JSON.stringify(this.addedServiceImgLists),
      //"&contact_number=" + this.contact_number +
      //"&contact_name=" + this.contact_name +
      //"&nextServiceDate=" + nextServiceDate,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/newserviceschedule";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          localStorage.setItem("microtime", "");
          //this.conf.sendNotification(`Servicing info was successfully added`);
          this.conf.sendNotification(data.json().msg[0].result);
          this.nav.push(ServicinginfoPage, {
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
    console.log('1' + val);
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
      this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    }
    if (this.unitDetailData.nextServiceDate != '') {
      // this.isSubmitted = false;
    } else {
      // this.isSubmitted = true;
    }
  }



  addDays(days) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }
  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        console.log('Got date: ', date)
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }






  selectEntry(item) {

    this.service_subject = item.service_subject;
    this.service_remark = item.service_remark;
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
      console.log("this.addedServiceImgLists" + JSON.stringify(this.addedServiceImgLists));
      console.log("Length is:" + this.addedServiceImgLists.length);

      if (this.NP.get("act") == 'Add') {
        console.log("Fresh Clear add request support info.ts start...");
        this.addedServiceImgLists = [];
        this.addedServiceImgLists.length = 0;
        this.service_subject = '';
        this.service_remark = '';
      }
      this.uploadcount = 10;
      if (this.addedServiceImgLists.length > 9) {
        this.isUploaded = false;
      } else {
        let remcount = this.uploadcount - this.addedServiceImgLists.length;
        this.uploadcount = remcount;
      }
    }
  }
  doRemoveResouce(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
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
  previous() {
    this.nav.push(ServicinginfoPage, {
      record: this.NP.get("record")
    });
  }


  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Attention',

      message: 'Please note that additional charges may apply, if requesting for Denyo Service Support.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.isSubmitted = false;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.saveEntry();
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
              this.isSubmitted = true;
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
              this.isSubmitted = true;
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
}


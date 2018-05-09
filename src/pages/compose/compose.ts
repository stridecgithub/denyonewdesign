import { Component, NgZone } from '@angular/core';
import { AlertController, NavController, NavParams, ActionSheetController, Platform, App } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { MessagesPage } from '../messages/messages';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { NotificationPage } from '../notification/notification';
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
declare var jQuery: any;

/**
 * Generated class for the ComposePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-compose',
  templateUrl: 'compose.html',
  providers: [Camera, FileChooser, FileTransfer, File, Config]
})
export class ComposePage {
  form: FormGroup;
  copytome: any;
  public messageid: any;
  public addedImgLists = [];
  public attachedFileLists = [];
  public isUploadedProcessing: boolean = false;
  micro_timestamp: any;
  public isReply: any;
  public isSubmitted: boolean = false;
  public replyforward: any;
  public message_priority: any;
  private apiServiceURL: string = "";
  private activelow: string = "1";
  private activehigh: string = "0";
  private normallow: string = "1";
  private activenormal: string = "0";
  public userId: any;
  public isUploaded: boolean = true;
  public addedAttachList;
  totalFileSizeExisting;
  progress: number;
  hashtag;
  public isProgress = false;
  totalCount;
  totalFileSize = 0;
  nowuploading = 0;
  overAllFileSize = 0;
  messages_subject;
  messages_body;
  personalhashtag;
  personalhashtagreplaceat;
  photo;
  mdate;
  priority_highclass = '';
  priority_lowclass = '';
  inboxsortaction = false;
  sendsortaction = false;
  isCompose = true;
  inboxact = false;
  sendact = false;
  act;
  choice;
  receiver_id;
  receiver_idreplaceat;
  sender_id;
  senderid;
  composemessagecontent;
  subject;
  to;
  // tabBarElement: any;
  isopenorclose = 1;
  close = 0;
  open = 1;
  public companyId: any;
  public atmentioneddata = [];
  existingimagecount;
  replyall;
  timezoneoffset;
  constructor(public app: App, private alertCtrl: AlertController, private conf: Config, public actionSheetCtrl: ActionSheetController, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, public camera: Camera, private filechooser: FileChooser,
    private transfer: FileTransfer,
    private ngZone: NgZone, public platform: Platform) {
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {

        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }

        this.navCtrl.setRoot(MessagesPage);
      });
    });
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.totalFileSizeExisting = 0;
    this.form = formBuilder.group({
      subject: ['', Validators.required],
      composemessagecontent: ['', Validators.required],
      copytome: [''],
      to: ['', Validators.required]

    });
    this.getPrority(0);
    this.apiServiceURL = this.conf.apiBaseURL();
    this.message_priority = 0;
    this.nowuploading = 0;
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
    this.userId = localStorage.getItem("userInfoId");
    this.replyforward = 0;
    this.isReply = 0;
    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.close = 1;
    this.open = 0;
    if (this.navParams.get('to') != undefined) {
      this.to = this.navParams.get('to');
    }


  }
  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }
  }
  toggle(isopenorclose) {
    if (isopenorclose == 1) {
      this.open = 1;
      this.isopenorclose = 0;
      this.close = 0;
    }
    if (isopenorclose == 0) {
      this.open = 0;
      this.isopenorclose = 1;
      this.close = 1;
    }
  }
  ionViewWillLeave() {
    //this.tabBarElement.style.display = 'flex';
  }

  preview(imagedata, frompage, from, favstatus, message_readstatus, messageid) {
    this.navCtrl.setRoot(PreviewanddownloadPage, {
      imagedata: imagedata,
      record: this.navParams.get('item'),
      frompage: frompage,
      from: from,
      favstatus: favstatus,
      message_readstatus: message_readstatus,
      messageid: messageid
    });
  }

  ionViewDidLoad() {
    //this.tabBarElement.style.display = 'none';



    this.copytome = 0;
    this.doAttachmentResources(this.micro_timestamp);
    if (this.navParams.get("record") != undefined) {
      this.messageid = this.navParams.get("record").message_id;
      this.replyall = this.navParams.get("record").replyall;
    }
    this.act = this.navParams.get("action");
    this.choice = this.navParams.get("from");
    if (this.choice != undefined) {
      if (this.act == 'reply') {
        this.priority_highclass = '';
        this.priority_lowclass = '';
        this.inboxsortaction = false;
        this.sendsortaction = false;
        this.isCompose = true;
        this.isSubmitted = false;
        this.replyforward = 1;
        this.isReply = 1;
        if (this.senderid == this.userId) {

          this.to = this.receiver_id;

          this.addedImgLists = [];
          this.copytome = 0;

          this.getPrority(this.navParams.get("record").message_priority);
          this.subject = this.messages_subject;
        }
        else {
          this.isReply = 0;
          this.to = this.navParams.get("record").personalhashtag;

          this.addedImgLists = [];
          this.copytome = 0;
          this.getPrority(this.navParams.get("record").message_priority);
          this.subject = this.navParams.get("record").messages_subject;
          this.composemessagecontent = "\n\n\n" + this.navParams.get("record").message_body;

        }

        this.isReply = 1;
        this.messageid = this.navParams.get("record").message_id;
        this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);
      }


      if (this.act == 'replytoall') {
        this.priority_highclass = '';
        this.priority_lowclass = '';
        this.inboxsortaction = false;
        this.sendsortaction = false;
        this.isCompose = true;
        this.isSubmitted = false;
        this.replyforward = 1;
        this.isReply = 1;
        if (this.senderid == this.userId) {

          this.to = this.navParams.get("record").replyall;//this.receiver_id;

          this.addedImgLists = [];
          this.copytome = 0;

          this.getPrority(this.navParams.get("record").message_priority);

          this.subject = this.messages_subject;
          this.composemessagecontent = "\n\n\n" + this.navParams.get("record").message_body;

        }
        else {

          this.isReply = 0;

          this.to = this.navParams.get("record").replyall;

          this.addedImgLists = [];
          this.copytome = 0;
          this.getPrority(this.navParams.get("record").message_priority);

          this.subject = this.navParams.get("record").messages_subject;
          this.composemessagecontent = "\n\n\n" + this.navParams.get("record").message_body;

          //jQuery("#composemessagecontent").html("<p><br><br></p>"+this.composemessagecontent);
        }

        this.isReply = 1;

        this.messageid = this.navParams.get("record").message_id;
        this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);
      }

      if (this.act == 'forward') {
        this.messageid = this.navParams.get("record").message_id;
        this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);


        this.priority_highclass = '';
        this.priority_lowclass = '';
        this.inboxsortaction = false;
        this.sendsortaction = false;
        this.isCompose = true;
        this.isSubmitted = false;
        this.replyforward = 1;
        this.to = '';

        this.addedImgLists = [];
        this.copytome = 0;

        this.getPrority(this.navParams.get("record").message_priority);
        this.subject = this.navParams.get("record").messages_subject;
        this.composemessagecontent = "\n\n\n" + "-----Forward Message-----" + "\n" + this.navParams.get("record").message_body;
        this.replyforward = 1;
      }
    }
    // Atmentioned API Calls
    let body: string = '',
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messagehashtags?companyId=" + this.companyId + "&loginid=" + this.userId;

    this.http.get(url, options)



    this.http.post(url, body, options)

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
    jQuery(".to").mention({
      users: this.atmentioneddata
    });

  }




  doAttachmentResources(micro_timestamp) {

    this.addedImgLists = [];
    let bodymessage: string = "messageid=0&micro_timestamp=" + micro_timestamp + "&loginid=" + this.userId,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/getmessagedetails";

    this.http.post(url1, bodymessage, options1)
      .subscribe((data) => {



        this.selectEntry(data.json().messages[0]);



      });
  }

  doAttachmentResourcesExisting(message_id, micro_timestamp) {

    let bodymessage: string = "messageid=" + message_id + "&micro_timestamp=" + micro_timestamp + "&loginid=" + this.userId,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/getmessagedetails";
    this.http.post(url1, bodymessage, options1)
      .subscribe((data) => {

        this.selectEntry(data.json().messages[0]);

      }, error => {
      });

  }

  selectEntry(item) {
    this.totalFileSize = item.totalfilesize;
    this.totalFileSizeExisting = this.totalFileSize;
    if (item.attachments != '') {
      let ath = item.attachments.split("#");
      let flsize = item.filesizes.split("#");
      let resourceid = item.resourceids.split("#");
      let oldnew = item.old_new.split("#");
      let ondata;
      for (let i = 0; i < ath.length; i++) {
        if (oldnew[i] == '') {
          ondata = 'old';
        } else if (oldnew[i] == 'old') {
          ondata = 'old';
        } else {
          ondata = 'new';
        }
        this.addedImgLists.push({
          fileName: ath[i],
          fileSize: flsize[i],
          resource_id: resourceid[i],
          oldnew: ondata,
        });
      }



    }
  }
  // When form submitting the below function calling
  saveEntry() {




    // Personal hashtag checking....
    let toaddress = jQuery(".to").val();
    let param = "toaddress=" + toaddress + "&ismobile=1&type=textbox";
    let body: string = param,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/chkemailhashtags";


    this.http.post(url, body, options)
      .subscribe((data) => {

        if (data.json().invalidusers == '') {
          if (this.isUploadedProcessing == false) {
            let copytome: string = this.form.controls["copytome"].value,
              composemessagecontent: string = this.form.controls["composemessagecontent"].value,
              subject: string = this.form.controls["subject"].value;
            this.createEntry(this.micro_timestamp, copytome, composemessagecontent, subject);
          }
        } else {
          this.conf.sendNotification(data.json().invalidusers + " are not available in the user list!");
          return false;
        }
      });
    // Personal hashtag checking....
  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data

  createEntry(micro_timestamp, copytome, composemessagecontent, subject) {
    let to = jQuery(".to").val();
    this.isSubmitted = true;
    if (copytome == true) {
      copytome = '1';
    }
    // if (this.replyforward == 0) {
    //   if (localStorage.getItem("atMentionResult") != '') {
    //     to = localStorage.getItem("atMentionResult");
    //   }
    // }
    let param;
    let urlstring;
    let urlstr;
    let current_datetime = this.conf.convertDatetoUTC(new Date());
    console.log("current_datetime:" + current_datetime);
    if (this.conf.isUTC() > 0) {
      if (this.replyforward > 0) {

        let isrepfor;
        if (this.isReply > 0) {
          isrepfor = 'Reply';
        } else {
          isrepfor = 'forward';
        }

        param = "is_mobile=1" +
          "&important=" + this.message_priority +
          "&microtime=" + micro_timestamp +
          "&loginid=" + this.userId +
          "&to=" + to +
          "&composemessagecontent=" + encodeURIComponent(composemessagecontent.toString()) +
          "&copytome=" + copytome +
          "&submit=" + isrepfor +
          "&forwardmsgid=" + this.messageid +
          "&subject=" + subject +
          "&current_datetime=" + current_datetime +
          "&timezoneoffset=" + this.timezoneoffset;
        urlstring = this.apiServiceURL + "/messages/replyforward";
      } else {
        param = "is_mobile=1" +
          "&important=" + this.message_priority +
          "&microtime=" + micro_timestamp +
          "&loginid=" + this.userId +
          "&to=" + to +
          "&composemessagecontent=" + encodeURIComponent(composemessagecontent.toString()) +
          "&copytome=" + copytome +
          "&subject=" + subject +
          "&current_datetime=" + current_datetime +
          "&timezoneoffset=" + this.timezoneoffset;
        urlstring = this.apiServiceURL + "/messages/store";
      }
    } else {
      if (this.replyforward > 0) {

        let isrepfor;
        if (this.isReply > 0) {
          isrepfor = 'Reply';
        } else {
          isrepfor = 'forward';
        }

        param = "is_mobile=1" +
          "&important=" + this.message_priority +
          "&microtime=" + micro_timestamp +
          "&loginid=" + this.userId +
          "&to=" + to +
          "&composemessagecontent=" + encodeURIComponent(composemessagecontent.toString()) +
          "&copytome=" + copytome +
          "&submit=" + isrepfor +
          "&forwardmsgid=" + this.messageid +
          "&subject=" + subject;
        urlstring = this.apiServiceURL + "/messages/replyforward";
      } else {
        param = "is_mobile=1" +
          "&important=" + this.message_priority +
          "&microtime=" + micro_timestamp +
          "&loginid=" + this.userId +
          "&to=" + to +
          "&composemessagecontent=" + encodeURIComponent(composemessagecontent.toString()) +
          "&copytome=" + copytome +
          "&subject=" + subject;
        urlstring = this.apiServiceURL + "/messages/store";
      }

    }
    let body: string = param,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstring;
    this.http.post(url, body, options)
      .subscribe((data) => {
        // If the request was successful notify the user
        if (data.status === 200) {

          localStorage.setItem("microtime", "");
          // this.conf.sendNotification(`Message sending successfully`);
          //localStorage.setItem("atMentionResult", '');
          //  this.navCtrl.setRoot(MessagesPage);
          // return false;
          if (data.json().msg[0]['pushid'] != '') {
            this.quickPush(data.json().msg[0]['pushid']);
          }
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.navCtrl.setRoot(MessagesPage);

        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      });
    localStorage.setItem("microtime", "");
    // localStorage.setItem("atMentionResult", '');
    //this.conf.sendNotification(`Message sending successfully`);



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

  fileChooser(micro_timestamp) {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Attachment',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'md-image',
          role: 'fromgallery',
          handler: () => {

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
          text: 'From File',
          icon: 'document',
          handler: () => {


            this.isUploadedProcessing = true;
            this.filechooser.open()
              .then(
              uri => {

                this.fileTrans(uri, micro_timestamp);
                this.addedAttachList = uri;
              }

              )
              .catch(e => { });
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

  showAlert(titl, msg) {
    let alert = this.alertCtrl.create({
      title: titl,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  fileTrans(path, micro_timestamp) {
    this.isSubmitted = true;

    const fileTransfer: FileTransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');

    let dateStr = new Date();
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth();
    let date = dateStr.getDate();
    let hr = dateStr.getHours();
    let mn = dateStr.getMinutes();
    let sec = dateStr.getSeconds();
    let d = new Date(),
      n = d.getTime(),
      newFileName = year + "" + month + "" + date + "" + hr + "" + mn + "" + sec + "_Denyo_" + currentName;



    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: newFileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }
    fileTransfer.onProgress(this.onProgress);

    fileTransfer.upload(path, this.apiServiceURL + '/upload_attach.php?micro_timestamp=' + micro_timestamp + "&message_id=" + this.messageid + "&totalSize=" + this.totalFileSize + "&randomtime=" + n, options)
      .then((data) => {

        this.nowuploading = 1;
        // let successData = JSON.parse(data.response);
        this.isSubmitted = false;
        this.conf.sendNotification("File attached successfully");


        if (this.messageid == undefined) {
          this.messageid = 0;
        }


        if (this.messageid > 0) {
          this.doAttachmentResourcesExisting(this.messageid, this.micro_timestamp);
        }
        this.doAttachmentResources(this.micro_timestamp);

        localStorage.setItem('fileAttach', JSON.stringify(this.addedImgLists));
        if (this.addedImgLists.length > 9) {
          this.isUploaded = false;
        }
        this.progress += 5;
        if (this.progress == 100) {
          this.isSubmitted = false;
        }
        this.isProgress = false;
        this.isUploadedProcessing = false;


        return false;
      }, (err) => {

        this.isProgress = false;
        this.conf.errorNotification("Upload Error:" + JSON.stringify(err));
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
  // List page navigate to notification list
  notification() {

    this.navCtrl.setRoot(NotificationPage);
  }
  getPrority(val) {



    if (val == "2") {

      this.activelow = "0";
      this.activehigh = "1";
      this.normallow = "0";
      this.activenormal = "1";
    } else if (val == "1") {

      this.activelow = "1";
      this.activehigh = "0";
      this.normallow = "1";
      this.activenormal = "0";
    } else {

      this.activelow = "0";
      this.activehigh = "0";
      this.normallow = "0";
      this.activenormal = "0";
    }


    this.message_priority = val
  }


  doRemoveResouce(item) {

    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          if (item.resource_id != undefined) {
            this.deleteEntry(item.resource_id);
          }

          for (let q: number = 0; q < this.addedImgLists.length; q++) {
            if (this.addedImgLists[q] == item) {
              this.addedImgLists.splice(q, 1);

            }
          }

        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }

  previous() {
    this.navCtrl.setRoot(MessagesPage);
  }
  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry(recordID) {
    let

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/" + recordID + "/removeattachment";

    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          // this.conf.sendNotification(`File was successfully deleted`);
          //this.doImageResources(service_id);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.doAttachmentResources(this.micro_timestamp);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {

      });
  }


}

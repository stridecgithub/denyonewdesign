import { Component } from '@angular/core';
import { Platform,  NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { MessagesPage } from "../messages/messages";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ComposePage } from "../compose/compose";
import { NotificationPage } from '../notification/notification';
import { PreviewanddownloadPage } from '../previewanddownload/previewanddownload';
import { MessagedetailPage } from '../messagedetail/messagedetail';
/**
 * Generated class for the MessagedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-message-detail-view',
  templateUrl: 'message-detail-view.html',
  providers: [Config]
})
export class MessageDetailViewPage {
  public service_id: any;
  public messageid: any;
  public message_date_mobileview: any;
  public messages_subject: any;
  public messages_body: any;
  public messages_body_html: any;
  private apiServiceURL: string = "";
  public userId: any;
  public companyId: any;
  public is_favorite: any;
  public message_priority: any;
  public time_ago: any;
  public receiver_id: any;
  public sendername: any;
  public senderphoto: any;
  public attachedFileLists = [];
  public service_resources;
  priority_highclass = '';
  priority_lowclass = '';
  // For Messages
  isUploadedProcessing;
  micro_timestamp;
  public isCompose;
  isReply;
  priority_image;
  to;
  addedImgLists = [];
  copytome;
  subject;
  composemessagecontent;
  isSubmitted;
  replyforward;
  senderid;
  personalhashtag;
  detailItem;
  form: FormGroup;
  totalCount;
  totalFileSize = 0;
  from;
  //tabBarElement: any;
  isopenorclose = 1;
  close = 0;
  open = 1;
  delete_icon_only = '1';
  message_readstatus;
  favstatus: any; // 0 is unfavorite 1 is favorite
  // For Messages
  constructor(private platform: Platform, private conf: Config, formBuilder: FormBuilder, public alertCtrl: AlertController, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.apiServiceURL = conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.form = formBuilder.group({
      subject: ['', Validators.required],
      composemessagecontent: ['', Validators.required],
      to: ['', Validators.required],
      copytome: ['']

    });
    this.isCompose = 0;
    if (this.navParams.get("from") != 'push') {
      //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    }
    this.close = 1;
    this.open = 0;
    this.platform.registerBackButtonAction(() => {
      this.previous();
    });
  }
  action(item, action, from) {
    this.navCtrl.setRoot(ComposePage, {
      record: item,
      action: action,
      from: from
    });
  }
  toggle(isopenorclose) {
    console.log(isopenorclose);
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
    if (this.navParams.get("from") != 'push') {
     // this.tabBarElement.style.display = 'flex';
    }
  }
  ionViewDidLoad() {
    if (this.navParams.get("from") != 'push') {
      //this.tabBarElement.style.display = 'none';
    }
    console.log('ionViewDidLoad MessageDetailViewPage');
    this.detailItem = this.navParams.get('item');
    this.from = this.navParams.get('from');
    this.favstatus = this.navParams.get('favstatus');
    this.message_readstatus = this.navParams.get('message_readstatus');
    console.log("From:" + this.from);
    console.log("favstatus:" + this.favstatus);
    console.log("message_readstatus:" + this.message_readstatus);
    if (this.from == 'send') {
      this.delete_icon_only = '0';
    } else if (this.from == 'push') {
      this.delete_icon_only = '0';
    } else {
      this.delete_icon_only = '1';
    }
    // if (this.from != 'push') {
    //   this.selectEntry(this.detailItem);
    // } else {
    let messageids;
    if (this.from == 'push') {
      messageids = this.navParams.get("event_id");
    } else {
      messageids = this.detailItem.message_id;
    }
    let bodymessage: string = "messageid=" + messageids+"&loginid="+this.userId,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/getmessagedetails";
    console.log(url1 + '?' + bodymessage);
    this.conf.presentLoading(1);
    this.http.post(url1, bodymessage, options1)
      //this.http.get(url1, options1)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        console.log("Message Response Success:" + JSON.stringify(data.json()));
        console.log("Message Details:" + data.json().messages[0]);
        this.selectEntry(data.json().messages[0]);
        //this.doAttachmentResources(data.json().messages[0].message_id);
      }, error => {
      });
    /*}
    if (this.from != 'push') {
      this.doAttachmentResources(this.detailItem.message_id);
    }*/
  }
  doAttachmentResources(message_id) {
    this.addedImgLists = [];
    //micro_timestamp = '2017112123520';
    console.log("doImageResources function calling successfully....")
    let //body: string = "micro_timestamp=" + micro_timestamp,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //http://denyoappv2.stridecdev.com/api/message_attachments_by_messageid.php?message_id=87
      url: any = this.apiServiceURL + "/api/message_attachments_by_messageid.php?message_id=" + message_id;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        console.log("servicebyid Response Success:" + JSON.stringify(data.json()));
        this.totalCount = 0;
        console.log(data.json().length - 1);
        for (let i = 0; i < data.json().length; i++) {

          console.log("Attachmnt:" + data.json()[i].messageresource_id);
          this.totalFileSize = data.json()[i];
          let imgSrc;
          imgSrc = this.apiServiceURL + "/attachments" + '/' + data.json()[i].messageresource_filename;
          if (data.json()[i].messageresource_id > 0) {
            this.addedImgLists.push({
              fileName: data.json()[i].messageresource_filename,
              fileSize: data.json()[i].filesize_kb,
              resouce_id: data.json()[i].messageresource_id,
              imgSrc: imgSrc
            });
          }
          if (data.json().length == this.totalCount) {

            break;
          }
          this.totalCount++;
        }

        console.log("Attached from api response:" + JSON.stringify(this.addedImgLists));


      });
  }

  selectEntry(item) {
    this.priority_image='';
    console.log(JSON.stringify(item));
    this.message_date_mobileview = item.message_date_mobileview;
    this.messages_subject = item.messages_subject;
    this.messages_body = item.message_body;
    this.messages_body_html = item.message_body_html;

    this.priority_image = item.priority_image;
    this.messageid = item.message_id;
    this.priority_highclass = '';
    this.priority_lowclass = '';
    if (item.message_priority == "2") {
      this.priority_highclass = "border-high";
    }
    if (item.message_priority == "1") {
      this.priority_lowclass = "border-low";
    } 

    if (item.message_priority == "0") {
      this.priority_lowclass = "";
    } else {
      this.priority_lowclass = "";
    }


    this.favstatus = this.navParams.get('favstatus');
    this.message_readstatus = this.navParams.get('message_readstatus');

    if (this.navParams.get('favstatus') != undefined) {
      this.favstatus = this.navParams.get('favstatus');
    } else {
      this.favstatus = item.is_favorite;
    }
    if (this.navParams.get('message_readstatus') != undefined) {
      this.message_readstatus = this.navParams.get('message_readstatus');
    } else {
      this.message_readstatus = item.message_readstatus;
    }





    console.log("Favorite Status:" + this.favstatus);
    //this.is_favorite = item.is_favorite;
    this.message_priority = item.message_priority;
    this.time_ago = item.time_ago;
    this.receiver_id = item.receiver_id.toLowerCase();
    let personalhashtag = localStorage.getItem("personalhashtag").toLowerCase();
    console.log("Receiver id:" + this.receiver_id.toLowerCase());
    console.log("personal hashtag:" + personalhashtag);

    //let n = this.receiver_id.indexOf(personalhashtag);


    let n = this.receiver_id.includes(personalhashtag);

    console.log(n);
    if (n > 0) {
      this.receiver_id = this.receiver_id.toString().replace(personalhashtag, " ");
      this.receiver_id = "me " + this.conf.toTitleCase(this.receiver_id);
    }

    this.sendername = item.sendername;
    // this.senderphoto = item.senderphoto;
    // if (this.senderphoto == undefined) {
    //   this.senderphoto = item.recipient_photo;
    // }



    if (this.from == 'inbox') {
      this.senderphoto = item.senderphoto;
    } else {
      this.senderphoto = item.recipient_photo;
    }

    if (this.senderphoto == '' || this.senderphoto == 'null') {
      this.senderphoto = this.apiServiceURL + "/images/default.png";
    }


    this.is_favorite = item.is_favorite;



    if (this.navParams.get('act') == 'read') {
      let body: string = "is_mobile=1&ses_login_id=" + this.userId +
        "&message_id=" + item.message_id + "&frompage=inbox",
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/messages/changereadunread";
      console.log(url);
      console.log(body);
      this.http.post(url, body, options)
        .subscribe((data) => {
          console.log("Change read unread api calls:" + JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            //this.conf.sendNotification(`Comment count successfully removed`);

          }
          // Otherwise let 'em know anyway
          else {
            // this.conf.sendNotification('Something went wrong!');
          }
        });

    }
    this.totalFileSize = item.totalfilesize;
    console.log("attachments:" + item.attachments);
    if (item.attachments != '') {
      let ath = item.attachments.split("#");
      let flsize = item.filesizes.split("#")
      for (let i = 0; i < ath.length; i++) {
        this.addedImgLists.push({
          fileName: ath[i],
          fileSize: flsize[i]
          // fileSize: data.json()[i].filesize_kb,
          // resouce_id: data.json()[i].messageresource_id,
          //  imgSrc: imgSrc
        });
      }
      console.log("filesizes:" + item.filesizes);
    }
  }
  previous() {
    if (this.navParams.get('from') == 'push') {
      this.navCtrl.setRoot(MessagedetailPage, {
        event_id: this.messageid,
        from: 'push',
        favstatus: this.navParams.get("favstatus"),
        message_readstatus: this.navParams.get("message_readstatus")
      });

    } else {
      this.navCtrl.setRoot(MessagedetailPage, {
        item: this.navParams.get('item'),
        act: this.navParams.get('act'),
        from: this.from,
        favstatus: this.navParams.get("favstatus"),
        message_readstatus: this.navParams.get("message_readstatus"),
        event_id: this.navParams.get("messageid")
      });
    }
  }
  readAction(messageid, act, from) {
    console.log('act' + act);
    if (act == 'unread') {
      console.log('A');
      this.unreadAction(messageid);
      console.log('B');
      this.message_readstatus = 0;
      return false;
    } else if (act == 'read') {
      this.message_readstatus = 1;
      console.log('A');
      this.readActionStatus(messageid);
      console.log('B');
      return false;
    }
    console.log('D');
  }
  readActionStatus(val) {
    let body: string = "is_mobile=1&ses_login_id=" + this.userId +
      "&message_id=" + val + "&frompage=inbox",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/changereadunread";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe((data) => {
        console.log("Change read unread api calls:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Readstatus action:" + JSON.stringify(data));
          if (data.json().msg[0]['Error'] == 0) {
            this.conf.sendNotification(data.json().msg[0]['result']);
          }
          console.log('Exit 1');
          console.log('Exit 2');

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      });


  }
  unreadAction(val) {


    let urlstr = this.apiServiceURL + "/messages/actions?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=Unread&messageids=" + val;
    let bodymessage: string = "",
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 });
    console.log(urlstr + '?' + bodymessage);
    let res;
    this.http.post(urlstr, bodymessage, options1)
      .subscribe((data) => {
        res = data.json();
        console.log("Unread action:" + JSON.stringify(data.json()));
        console.log("Res Result" + res.msg[0]['result']);
        console.log("data.status" + data.status);
        console.log("Error" + res.msg[0]['Error'])
        if (data.status === 200) {
          console.log('Enter');
          if (res.msg[0]['Error'] == 0) {
            this.conf.sendNotification(res.msg[0]['result']);
          }
          console.log('Exit 1');

          console.log('Exit 2');
        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log(error);
      });


  }

  favoriteact(messageid) {
    if (this.from == 'inbox') {
      this.favorite(messageid);
    } else {
      this.sentfavorite(messageid);
    }
  }
  favorite(messageid) {
    console.log("Favorite Calling...");
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/messagefavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(JSON.stringify(data));
        console.log("Favorit status result:" + data.json().favstatus);
        this.favstatus = data.json().favstatus;
        if (this.favstatus == 'fav') {
          this.favstatus = 1;
        }
        if (this.favstatus == 'unfav') {
          this.favstatus = 0;
        }
        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification('Favorite updated successfully');
          this.conf.sendNotification(data.json().msg[0]['result']);
          // this.navCtrl.setRoot(MessagesPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log(error)
      });


  }

  sentfavorite(messageid) {
    console.log("Sent Favorite Calling...");
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/sendmessagefavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(JSON.stringify(data));
        console.log("Favorit status result:" + data.json().favstatus);
        this.favstatus = data.json().favstatus;
        if (this.favstatus == 'fav') {
          this.favstatus = 1;
        }
        if (this.favstatus == 'unfav') {
          this.favstatus = 0;
        }
        // If the request was successful notify the user
        if (data.status === 200) {
        //  this.conf.sendNotification('Favorite updated successfully');
          // this.navCtrl.setRoot(MessagesPage);
          this.conf.sendNotification(data.json().msg[0]['result']);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log(error)
      });


  }

  doConfirm(id, item, type) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this message?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id, type);

        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }
  deleteEntry(recordID, typestr) {
    let urlstr;
    if (this.from == 'inbox') {
      urlstr = this.apiServiceURL + "/messages/actions?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=Delete&messageids=" + recordID;
    } else {
      urlstr = this.apiServiceURL + "/messages/actions?frompage=senditem&is_mobile=1&ses_login_id=" + this.userId + "&actions=Delete&messageids=" + recordID;

    }
    let bodymessage: string = "",
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 });
    console.log(urlstr + '?' + bodymessage);
    let res;
    this.http.post(urlstr, bodymessage, options1)
      .subscribe((data) => {
        res = data.json();
        console.log("Unread action:" + JSON.stringify(data.json()));
        console.log("Res Result" + res.msg[0]['result']);
        console.log("data.status" + data.status);
        console.log("Error" + res.msg[0]['Error'])
        if (data.status === 200) {

          console.log('Enter');
          if (res.msg[0]['Error'] == 0) {
            this.conf.sendNotification(res.msg[0]['result']);
            this.navCtrl.setRoot(MessagesPage);
          }

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log(error);
      });


  }


  reply(messages_body) {

    this.isCompose = 1;
    this.isSubmitted = false;
    this.replyforward = 1;
    this.isReply = 1;
    if (this.senderid == this.userId) {
      this.to = this.receiver_id;
      this.addedImgLists = [];

      this.copytome = 0;

      this.subject = this.messages_subject;
      //this.composemessagecontent = "-----Reply Message-----" + "\n" + messages_body;

    }
    else {
      this.isReply = 0;
      this.to = this.personalhashtag;
      this.addedImgLists = [];
      this.copytome = 0;

      this.subject = this.messages_subject;
      //this.composemessagecontent = "-----Reply Message-----" + "\n" + messages_body;
      this.composemessagecontent = messages_body;

    }
  }

  forward(messages_body) {

    this.isCompose = 1;
    this.isSubmitted = false;
    this.replyforward = 1;
    this.to = '';
    this.addedImgLists = [];
    this.copytome = 0;
    this.subject = this.messages_subject;
    this.composemessagecontent = "-----Forward Message-----" + "\n" + messages_body;

  }

  saveEntry() {
    console.log(this.form.controls);
    if (this.isUploadedProcessing == false) {
      let to: string = this.form.controls["to"].value,
        copytome: string = this.form.controls["copytome"].value,
        composemessagecontent: string = this.form.controls["composemessagecontent"].value,
        subject: string = this.form.controls["subject"].value;
      console.log("serviced_datetime:" + to);
      console.log("copytome:" + copytome);
      console.log("messages_subject:" + subject);

      console.log("Attached image for file for reply and forward" + JSON.stringify(this.attachedFileLists));
      console.log("Image Data" + JSON.stringify(this.addedImgLists));

      console.log("To Final:" + to);

      this.createEntry(this.micro_timestamp, to, copytome, composemessagecontent, subject);

    }

  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(micro_timestamp, to, copytome, composemessagecontent, subject) {
    this.isSubmitted = true;
    if (copytome == true) {
      copytome = '1';
    }

    let param;
    let urlstring;
    console.log("is reply forward and this.messageid" + this.replyforward + " " + this.messageid);
    console.log("Is reply?" + this.isReply);
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
        "&composemessagecontent=" + composemessagecontent +
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
        "&composemessagecontent=" + composemessagecontent +
        "&copytome=" + copytome +
        "&subject=" + subject;
      urlstring = this.apiServiceURL + "/messages/store";
    }
    let body: string = param,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstring;
    console.log("Message sending API" + url + "?" + body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.replyforward = 0;
          localStorage.setItem("microtime", "");
          //this.conf.sendNotification(`Message sending successfully`);

          this.conf.sendNotification(data.json().msg[0]['result']);
          this.addedImgLists = [];
          this.to = '';
          this.copytome = 0;
          this.composemessagecontent = "";
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      });
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
}


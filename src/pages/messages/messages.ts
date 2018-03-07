import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ComposePage } from "../compose/compose";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../../config/config';
import { NotificationPage } from '../notification/notification';
import { MessagedetailPage } from '../messagedetail/messagedetail';
declare var jQuery: any;

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [Config]
})
export class MessagesPage {
  //footerBar: number = 3;
  public footerBar = [];
  public tabs: string = 'inboxView';
  isReadyToSave: boolean;
  public photoInfo = [];
  public actionId = [];
  public uploadResultBase64Data;
  public inboxLists = [];
  public sendLists = [];
  public inboxsortaction: boolean = false;
  public sendsortaction: boolean = false;
  public isCompose: boolean = false;
  public loginas: any;
  public hashtag;
  public photo: any;
  public mdate: any;
  public act: any;
  public sendact: any;
  public inboxact: any;
  rolePermissionMsg;
  public priority_lowclass: any;
  public priority_highclass: any;
  public addedImgListsArray = [];
  public addedImgLists = [];
  public attachedFileLists = [];
  private apiServiceURL: string = "";
  private popoverThemeJSIonic: any;
  public networkType: string;
  public composemessagecontent: any;
  progress: number;
  public personalhashtag;
  public personalhashtagreplaceat;
  public receiver_id;
  public receiver_idreplaceat;
  public pageTitle: any;
  pet: string = "";
  choice: string = "inbox";
  public recordID: any;
  public userId: any;
  public companyId: any;
  public str: any;
  public strsend: any;
  public strinbox: any;
  public service_id: any;
  public serviced_by: any;
  public messageid: any;
  public serviced_datetime: any;
  public isSubmitted: boolean = false;
  public messages_subject: any;
  public messages_body: any;
  public next_service_date: any;
  public message_priority: any;
  public isReply: any;
  copytome: any;
  public serviced_by_name: any;
  public service_resources: any;
  micro_timestamp: any;
  public isUploadedProcessing: boolean = false;
  public isUploaded: boolean = true;
  public selectedAction = [];
  public message_readstatus: any;
  public replyforward: any;
  item: any;
  public senderid: any;

  // Authority for message send
  public MESSAGESENTVIEWACCESS;
  public MESSAGESENTCREATEACCESS;
  public MESSAGESENTEDITACCESS;
  public MESSAGESENTDELETEACCESS;
  // Authority for message send
  // Authority for message inbox
  public MESSAGEINBOXVIEWACCESS;
  public MESSAGEINBOXCREATEACCESS;
  public MESSAGEINBOXEDITACCESS;
  public MESSAGEINBOXDELETEACCESS;
  // Authority for message inbox

  public msgcount: any;
  public notcount: any;
  public to: any;
  public subject: any;
  atmentedInnerHTML: string;
  public isEdited: boolean = false;
  public addedAttachList;
  public totalCount;
  public totalCountSend;
  valueforngif = true;
  public inboxData: any =
    {
      status: '',
      sort: 'messages_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 50
    }
  public sendData: any =
    {
      status: '',
      sort: 'messages_id',
      sortascdesc: 'desc',
      startindex: 0,
      results: 50
    }
  public hideActionButton = true;
  public sortLblTxt: string = 'Date Received';
  public sortLblSendTxt: string = 'Date Sent';
  segmenttabshow;
  testRadioOpen: boolean;
  testRadioResult;
  // tabBarElement;
  public profilePhoto;
  constructor(public modalCtrl: ModalController, private conf: Config, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.apiServiceURL = conf.apiBaseURL();
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.inb();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }
    this.doNotifiyCount();

    // Footer Menu Access - Start
    let footeraccessstorage = localStorage.getItem("footermenu");
    let footeraccessparams = this.navParams.get('footermenu');
    let footermenuacc;
    if (footeraccessparams != undefined) {
      footermenuacc = footeraccessparams;
    } else {
      footermenuacc = footeraccessstorage;
    }

    console.log("Footer Menu Access abc:-" + footermenuacc);
    // this.footerBar="0,"+footermenuacc;

    let footermenusplitcomma = footermenuacc.split(",");
    let dashboardAccess = footermenusplitcomma[0];
    let unitAccess = footermenusplitcomma[1];
    let calendarAccess = footermenusplitcomma[2];
    let messageAccess = footermenusplitcomma[3];
    let orgchartAccess = footermenusplitcomma[4];

    console.log("Footer Menu Access for Dashboard" + dashboardAccess);
    console.log("Footer Menu Access for Dashboard" + unitAccess);
    console.log("Footer Menu Access for Calendar" + calendarAccess);
    console.log("Footer Menu Access for Messagees" + messageAccess);
    console.log("Footer Menu Access for Org Chart" + orgchartAccess);
    let dashboarddisplay;
    if (dashboardAccess == 1) {
      dashboarddisplay = '';
    } else {
      dashboarddisplay = 'none';
    }
    this.footerBar.push({
      title: 'Dashboard',
      active: true,
      colorcode: "rgba(60, 60, 60, 0.7)",
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
      colorcode: "#488aff",
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

    console.log("Footer Access Loop Value:" + JSON.stringify(this.footerBar));
    //this.footerBar = "0";
    //let footerBar=this.footerBar.split(",");
    console.log("Final Footer Menu access:" + this.footerBar);

    // Footer Menu Access - End


   

  }


  doNotifiyCount() {
    // Notification count
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        console.log(error);
      });
    // Notiifcation count
  }
  // ionViewDidLoad() {

  //   console.log('ionViewDidLoad MessagesPage');
  // }


  ionViewDidLoad() {
     // Authority for message send
     this.MESSAGESENTVIEWACCESS = localStorage.getItem("MESSAGES_SENT_VIEW");
     this.MESSAGESENTCREATEACCESS = localStorage.getItem("MESSAGES_SENT_CREATE");
     this.MESSAGESENTEDITACCESS = localStorage.getItem("MESSAGES_SENT_EDIT");
     this.MESSAGESENTDELETEACCESS = localStorage.getItem("MESSAGES_SENT_DELETE");
     // Authority for message send
     // Authority for message inbox
     this.MESSAGEINBOXVIEWACCESS = localStorage.getItem("MESSAGES_INBOX_VIEW");
     this.MESSAGEINBOXCREATEACCESS = localStorage.getItem("MESSAGES_INBOX_CREATE");
     this.MESSAGEINBOXEDITACCESS = localStorage.getItem("MESSAGES_INBOX_EDIT");
     this.MESSAGEINBOXDELETEACCESS = localStorage.getItem("MESSAGES_INBOX_DELETE");
     // Authority for message inbox
    console.log("Tab" + this.navParams.get("fromtab"));
    if (this.navParams.get("fromtab") != undefined) {
      this.tabs = this.navParams.get("fromtab");
      this.snd();
    }
    console.log('ionViewDidEnter MessagesPage');
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
    if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 1) {
      this.tabs = 'inboxView';
      console.log('A');
      jQuery('#inboxView').show();
      jQuery('#sentView').show();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';
     
    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 1) {
      this.tabs = 'inboxView';
      console.log('B');
      jQuery('#inboxView').show();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = '';
    
    } else if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 0) {
      this.tabs = 'sentView';
      console.log('C');
      jQuery('#inboxView').hide();
      jQuery('#sentView').show();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';
      this.snd();
     
    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 0) {
      console.log('D');
      jQuery('#inboxView').hide();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = this.conf.rolePermissionMsg();
    }


  }

  ionViewDidEnter() {
     // Authority for message send
     this.MESSAGESENTVIEWACCESS = localStorage.getItem("MESSAGES_SENT_VIEW");
     this.MESSAGESENTCREATEACCESS = localStorage.getItem("MESSAGES_SENT_CREATE");
     this.MESSAGESENTEDITACCESS = localStorage.getItem("MESSAGES_SENT_EDIT");
     this.MESSAGESENTDELETEACCESS = localStorage.getItem("MESSAGES_SENT_DELETE");
     // Authority for message send
     // Authority for message inbox
     this.MESSAGEINBOXVIEWACCESS = localStorage.getItem("MESSAGES_INBOX_VIEW");
     this.MESSAGEINBOXCREATEACCESS = localStorage.getItem("MESSAGES_INBOX_CREATE");
     this.MESSAGEINBOXEDITACCESS = localStorage.getItem("MESSAGES_INBOX_EDIT");
     this.MESSAGEINBOXDELETEACCESS = localStorage.getItem("MESSAGES_INBOX_DELETE");
     // Authority for message inbox
     console.log("this.MESSAGESENTVIEWACCESS"+this.MESSAGESENTVIEWACCESS);
     console.log("this.MESSAGEINBOXVIEWACCESS"+this.MESSAGEINBOXVIEWACCESS);
    if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 1) {
      console.log('A');
      this.tabs = 'inboxView';
      jQuery('#inboxView').show();
      jQuery('#sentView').show();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';     
    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 1) {
      console.log('B');
      this.tabs = 'inboxView';
      jQuery('#inboxView').show();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').show();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = '';     
    } else if (this.MESSAGESENTVIEWACCESS == 1 && this.MESSAGEINBOXVIEWACCESS == 0) {
      console.log('C');
      this.tabs = 'sentView';
      jQuery('#inboxView').hide();
      jQuery('#sentView').show();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').show();
      this.segmenttabshow = 1;
      this.rolePermissionMsg = '';     
    } else if (this.MESSAGESENTVIEWACCESS == 0 && this.MESSAGEINBOXVIEWACCESS == 0) {
      console.log('D');
      jQuery('#inboxView').hide();
      jQuery('#sentView').hide();
      jQuery('#inboxblock').hide();
      jQuery('#sendblock').hide();
      this.segmenttabshow = 0;
      this.rolePermissionMsg = this.conf.rolePermissionMsg();
    }
  }
  compose() {
    localStorage.setItem("microtime", "");
    this.navCtrl.setRoot(ComposePage);
  }
  readAction(messageid, item, act, from) {
    localStorage.setItem("microtime", '');
    console.log('act' + act);
    if (act == 'unread') {
      console.log('A');
      this.unreadAction(messageid, item);
      console.log('B');
      return false;
    } else if (act == 'read') {
      console.log('A');
      this.readActionStatus(messageid, item);
      console.log('B');
      return false;
    } else {

      this.navCtrl.setRoot(MessagedetailPage, {
        item: item,
        act: act,
        from: from
      });
    }
    console.log('D');
  }
  inb() {
    this.inboxLists = [];
    this.sendLists = [];
    this.inboxData.startindex = 0;
    this.doInbox();
  }

  snd() {
    this.inboxLists = [];
    this.sendLists = [];
    this.sendData.startindex = 0;
    this.doSend();
  }

  /****************************/
  /*@doCompanyGroup calling on report */
  /****************************/
  doInbox() {
    this.isCompose = false;
    this.inboxact = false;
    this.sendact = false;
    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.inboxsortaction = true;
    this.sendsortaction = false;

    //this.conf.presentLoading(1);
    if (this.inboxData.status == '') {
      this.inboxData.status = "messages_id";
    }
    if (this.inboxData.sort == '') {
      this.inboxData.sort = "messages_id";
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages?is_mobile=1&startindex=" + this.inboxData.startindex + "&results=" + this.inboxData.results + "&sort=" + this.inboxData.sort + "&dir=" + this.inboxData.sortascdesc + "&loginid=" + this.userId;
    let res;
    console.log(url);
    this.conf.presentLoading(1);
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.messages.length);
        console.log("2" + res.messages);
        if (res.messages.length > 0) {
          this.inboxLists = res.messages;
          this.totalCount = res.totalCount;
          this.inboxData.startindex += this.inboxData.results;
          //this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCount = 0;
          //this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCount);
        this.conf.presentLoading(0);
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    // this.conf.presentLoading(0);
  }


  doSend() {
    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.isCompose = false;
    this.inboxact = false;
    this.sendact = false;
    this.inboxsortaction = false;
    this.sendsortaction = true;
    //this.conf.presentLoading(1);
    if (this.sendData.status == '') {
      this.sendData.status = "messages_id";
    }
    if (this.sendData.sort == '') {
      this.sendData.sort = "messages_id";
    } let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/sentitems?is_mobile=1&startindex=" + this.sendData.startindex + "&results=" + this.sendData.results + "&sort=" + this.sendData.sort + "&dir=" + this.sendData.sortascdesc + "&loginid=" + this.userId;
    let res;
    console.log(url);
    this.conf.presentLoading(1);
    this.http.get(url, options)
      .subscribe((data) => {

        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.messages.length);
        console.log("2" + res.messages);
        if (res.messages.length > 0) {

          for (let messageData in res.messages) {

            this.sendLists = res.messages;
            this.totalCount = res.totalCount;
            this.sendData.startindex += this.sendData.results;

            /*
            let receiverNameOutStr;
            if (res.messages[messageData].receiver_name != '') {
              let receiverNamestrArr = res.messages[messageData].receiver_name.split(" ");
              receiverNameOutStr = receiverNamestrArr.join(",");
              console.log(receiverNameOutStr);
            }

            this.sendLists.push({
              "message_id": res.messages[messageData].message_id,
              "sender_id": res.messages[messageData].sender_id,
              "messages_subject": res.messages[messageData].messages_subject,
              "message_body": res.messages[messageData].message_body,
              "message_date_mobileview": res.messages[messageData].message_date_mobileview,
              "message_date_mobileview_list": res.messages[messageData].message_date_mobileview_list,
              "message_date": res.messages[messageData].message_date,
              "time_ago": res.messages[messageData].time_ago,
              "message_priority": res.messages[messageData].message_priority,
              "personalhashtag": res.messages[messageData].personalhashtag,
              "receiver_id": res.messages[messageData].receiver_id,
              "receiver_name": res.messages[messageData].receiver_name,
              "receiver_name_str": receiverNameOutStr,
              "attachments": res.messages[messageData].attachments,
              "recipient_photo": res.messages[messageData].recipient_photo,
              "senderphoto": res.messages[messageData].senderphoto,
              "messages_isfavaurite": res.messages[messageData].messages_isfavaurite,
              "is_favorite": res.messages[messageData].messages_isfavaurite
            })
            */
          }
          console.log("Kannan:-" + JSON.stringify(this.sendLists));
          //this.sendLists = res.messages;
          this.totalCountSend = res.totalCount;
          this.sendData.startindex += this.sendData.results;
          //this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCountSend = 0;
          //this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCountSend);
        this.conf.presentLoading(0);
      }, error => {
        console.log(error);
      });
    //this.conf.presentLoading(0);
  }
  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.inboxData.startindex < this.totalCount && this.inboxData.startindex > 0) {
      console.log('B');
      this.doInbox();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  doSendInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCountSend)
    if (this.sendData.startindex < this.totalCountSend && this.sendData.startindex > 0) {
      console.log('B');
      this.doSend();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  doConfirm(id, item, type) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this message?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id, type);
          if (type == 'inbox') {
            for (let q: number = 0; q < this.inboxLists.length; q++) {
              if (this.inboxLists[q] == item) {
                this.inboxLists.splice(q, 1);
              }
            }
          } else {
            for (let q: number = 0; q < this.sendLists.length; q++) {
              if (this.sendLists[q] == item) {
                this.sendLists.splice(q, 1);
              }
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
  deleteEntry(recordID, typestr) {
    let urlstr;
    if (typestr == 'inbox') {
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
          }
          console.log('Exit 1');
          this.strinbox = '';
          this.inboxact = '';
          this.inboxData.startindex = 0;
          this.doInbox();
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
  // List page navigate to notification list
  notification() {
    console.log('Will go notification list page');
    // Navigate the notification list page
    this.navCtrl.setRoot(NotificationPage);
  }

  doSort() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Date Received',
          value: 'messages_id'
        },
        {
          type: 'radio',
          label: 'Subject',
          value: 'messages_subject',
        },
        {
          type: 'radio',
          label: 'Sender Name',
          value: 'sendername',
        },
        {
          type: 'radio',
          label: 'Favourites',
          value: 'messagesinbox_isfavaurite'
        }
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            console.log(data);
            console.log('Asc clicked');
            if (data != undefined) {
              this.inboxData.sort = data;
              this.inboxData.sortascdesc = 'asc';


              if (data == 'messagesinbox_isfavaurite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'sendername') {
                this.sortLblTxt = 'Sender Name';
              } else if (data == 'messages_id') {
                this.sortLblTxt = 'Date Received';
              } else if (data == 'messages_subject') {
                this.sortLblTxt = 'Subject';
              }
              this.inboxData.startindex = 0;
              this.inboxLists = [];
              this.doInbox();


            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            console.log(data);
            if (data != undefined) {
              this.inboxData.sort = data;
              this.inboxData.sortascdesc = 'desc';

              if (data == 'messagesinbox_isfavaurite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'sendername') {
                this.sortLblTxt = 'Sender Name';
              } else if (data == 'messages_id') {
                this.sortLblTxt = 'Date Received';
              } else if (data == 'messages_subject') {
                this.sortLblTxt = 'Subject';
              }
              this.inboxData.startindex = 0;
              this.inboxLists = [];
              this.doInbox();
            }
          }
        }
      ]
    });
    prompt.present();
  }


  doSortSendItem() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Date Sent',
          value: 'messages_id'
        },
        {
          type: 'radio',
          label: 'Subject',
          value: 'messages_subject',
        },
        {
          type: 'radio',
          label: 'Receipient',
          value: 'reciver_id',
        },
        {
          type: 'radio',
          label: 'Favourites',
          value: 'messages_isfavaurite',
        }
      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            console.log(data);
            console.log('Asc clicked');
            if (data != undefined) {
              this.sendData.sort = data;
              this.sendData.sortascdesc = 'asc';


              if (data == 'messages_subject') {
                this.sortLblSendTxt = 'Subject';
              } else if (data == 'messages_id') {
                this.sortLblSendTxt = 'Date Sent';
              } else if (data == 'reciver_id') {
                this.sortLblSendTxt = 'Receipient';
              } else if (data == 'messages_isfavaurite') {
                this.sortLblSendTxt = 'Favourite';
              }
              this.sendData.startindex = 0;
              this.sendLists = [];
              this.doSend();


            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            console.log(data);
            if (data != undefined) {
              this.sendData.sort = data;
              this.sendData.sortascdesc = 'desc';


              if (data == 'messages_subject') {
                this.sortLblSendTxt = 'Subject';
              } else if (data == 'messages_id') {
                this.sortLblSendTxt = 'Date Sent';
              } else if (data == 'reciver_id') {
                this.sortLblSendTxt = 'Receipient';
              } else if (data == 'messages_isfavaurite') {
                this.sortLblSendTxt = 'Favourites';
              }


              this.sendData.startindex = 0;
              this.sendLists = [];
              this.doSend();
            }
          }
        }
      ]
    });
    prompt.present();
  }



  favorite(messageid) {
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/setfavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(JSON.stringify(data.json().msg.result));
        // If the request was successful notify the user
        if (data.status === 200) {

          /* if (res.favorite == 0) {
             this.conf.sendNotification("Unfavorited successfully");
           } else {
             this.conf.sendNotification("Favorited successfully");
           }*/
          this.conf.sendNotification(data.json().msg.result);
          this.inboxData.startindex = 0;
          this.doInbox();
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log(error)
      });


  }

  senditemfavorite(messageid) {
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/setsenditemfavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.sendNotification(data.json().msg.result);
          this.sendData.startindex = 0;
          //this.snd();
          this.doSend();
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log(error)
      });


  }


  unreadAction(val, inboxData) {

    console.log(JSON.stringify(this.actionId));
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
          this.strinbox = '';
          this.inboxact = '';
          this.inboxData.startindex = 0;
          this.doInbox();
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

  readActionStatus(val, inboxData) {
    let body: string = "is_mobile=1&ses_login_id=" + this.userId +
      "&message_id=" + inboxData.message_id + "&frompage=inbox",
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
          this.strinbox = '';
          this.inboxact = '';
          this.inboxData.startindex = 0;
          this.doInbox();
          console.log('Exit 2');

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      });


  }

}

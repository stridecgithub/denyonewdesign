import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, Platform, ModalController } from 'ionic-angular';
import { Config } from '../../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NotificationPage } from '../notification/notification';
import { MessagesPage } from '../messages/messages';
//import { CalendarPage } from '../calendar/calendar';
import { UnitdetailsPage } from '../unitdetails/unitdetails';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { EventDetailsPage } from '../event-details/event-details';
import { EventDetailsEventPage } from '../event-details-event/event-details-event';
//import { AddUnitPage } from "../add-unit/add-unit";
//import { AlarmLogPage } from "../alarm-log/alarm-log";
//import { UnitDetailsPage } from '../unit-details/unit-details';
import { EventDetailsServicePage } from '../event-details-service/event-details-service';
import { MessageDetailViewPage } from '../message-detail-view/message-detail-view';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
import { ModalPage } from '../modal/modal';
declare let google;
import { AddUnitPage } from "../add-unit/add-unit";
import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [Push, LocalNotifications, Config]
})

export class DashboardPage {
  footerBar: number = 0;
  tabIndexVal;
  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public alarms: string = "0";
  public warningcount: string = "0";
  public runningcount: string = "0";
  public readycount: string = "0";
  public offlinecount: string = "0";
  public tabs: string = 'mapView';
  public unitsPopups: any;

  connected;
  disconnected;
  private apiServiceURL: string = '';
  public totalCount;
  public unitAllLists = [];
  public defaultUnitAllLists = [];
  public reportData: any =
    {
      status: '',
      sort: 'favorite',
      sortascdesc: 'desc',
      startindex: 0,
      results: 8
    };
  public sortLblTxt: string = 'Favourites';
  testRadioOpen: boolean;
  testRadioResult;
  public companyId: any;
  public userId: any;
  public msgcount: any;
  public notcount: any;
  public profilePhoto;
  firstname;
  lastname;
  companyGroupName;
  dashboardhighlight;
  pushnotifycount
  pages: Array<{ title: string, component: any, icon: string, color: any, background: any }>;
  constructor(public modalCtrl: ModalController, private localNotifications: LocalNotifications, private push: Push, public alertCtrl: AlertController, public platform: Platform, private network: Network, public navCtrl: NavController, public NP: NavParams, public navParams: NavParams, private conf: Config, private http: Http, public events: Events) {


    this.platform.ready().then(() => {
      this.tabIndexVal = localStorage.getItem("tabIndex");
      this.network.onConnect().subscribe(data => {
        console.log(data)
        this.displayNetworkUpdate(data.type);
      }, error => console.error(error));

      this.network.onDisconnect().subscribe(data => {
        console.log(data)
        this.displayNetworkUpdate(data.type);
      }, error => console.error(error));

      if (this.userId > 0) {
        this.initPushNotification();
      }

    });
    this.apiServiceURL = conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }

    this.pages = [
      { title: 'Dashboard', component: '', icon: 'dashboard', color: 'gray', background: 'gray' },
      { title: 'Units', component: '', icon: 'units', color: 'gray', background: 'gray' },
      { title: 'Calendar', component: '', icon: 'calendar', color: 'gray', background: 'gray' },
      { title: 'Message', component: '', icon: 'messages', color: 'gray', background: 'gray' },
      { title: 'Reports', component: '', icon: 'reports', color: 'gray', background: 'gray' },
      { title: 'Settings', component: '', icon: 'settings', color: 'gray', background: 'gray' },
      { title: 'Logout', component: '', icon: 'logout', color: 'gray', background: 'gray' }
    ];
    /* events.subscribe('menu:opened', () => {
       this.firstname = localStorage.getItem("userInfoName");
       this.lastname = localStorage.getItem("userInfoLastName");
       this.companyGroupName = localStorage.getItem("userInfoCompanyGroupName");
       this.profilePhoto = localStorage.getItem("userInfoPhoto");
       if (this.profilePhoto == '' || this.profilePhoto == 'null') {
         this.profilePhoto = this.apiServiceURL + "/images/default.png";
       } else {
         this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
       }
       console.log("Dashboard- Menu Opened");
     });
 
     events.subscribe('menu:closed', () => {
       this.firstname = localStorage.getItem("userInfoName");
       this.lastname = localStorage.getItem("userInfoLastName");
       this.companyGroupName = localStorage.getItem("userInfoCompanyGroupName");
       this.profilePhoto = localStorage.getItem("userInfoPhoto");
       if (this.profilePhoto == '' || this.profilePhoto == 'null') {
         this.profilePhoto = this.apiServiceURL + "/images/default.png";
       } else {
         this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
       }
       console.log("Dashboard- Menu Closed");
     });*/
  }
  presentModal(unit) {
    console.log(JSON.stringify(unit));
    let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
    modal.present();
  }
  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    // this.toast.create({
    //   message: `You are now ${connectionState} via ${networkType}`,
    //   duration: 3000
    // }).present();

    this.conf.sendNotification(`You are now ${connectionState}`);

  }
  ionViewWillLeave() {
    this.tabIndexVal = localStorage.getItem("tabIndex");
    // this.connected.unsubscribe();
    // this.disconnected.unsubscribe();
  }
  ionViewDidEnter() {
    localStorage.setItem("tabIndex", "0");
    this.tabIndexVal = localStorage.getItem("tabIndex");
    // this.network.onConnect().subscribe(data => {
    //   console.log(data)
    //   this.displayNetworkUpdate(data.type);
    // }, error => console.error(error));

    // this.network.onDisconnect().subscribe(data => {
    //   console.log(data)
    //   this.displayNetworkUpdate(data.type);
    // }, error => console.error(error));

    // this.connected = this.network.onConnect().subscribe(data => {
    //   console.log(data)
    //   this.displayNetworkUpdate(data.type);
    // }, error => console.error(error));

    // this.disconnected = this.network.onDisconnect().subscribe(data => {
    //   console.log(data)
    //   this.displayNetworkUpdate(data.type);
    // }, error => console.error(error));


  }

  ionViewDidLoad() {
    localStorage.setItem("tabIndex", "0");
    this.tabIndexVal = localStorage.getItem("tabIndex");
    console.log('dashboardselected' + this.navParams.get('dashboardselected'));
    this.dashboardhighlight = this.navParams.get('dashboardselected');

   

    this.conf.showfooter();
    let mapView = document.getElementById('mapView');
    let listView = document.getElementById('listView');
    console.log(this.navParams.get("tabs"));
    if (this.navParams.get("tabs") != undefined) {
      if (this.navParams.get("tabs") == 'mapView') {
        mapView.style.display = 'block';
        listView.style.display = 'none';
      } else {
        mapView.style.display = 'none';
        listView.style.display = 'block';
      }
    }
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    if (this.userId == 'undefined') {
      this.userId = '';
    }
    if (this.userId == undefined) {
      this.userId = '';
    }
    if (this.userId == 'null') {
      this.userId = '';
      console.log("ionViewDidLoad B");
    }
    if (this.userId == null) {
      this.userId = '';
      console.log("ionViewDidLoadC");
    }
    if (this.userId != "") {
      this.companyId = localStorage.getItem("userInfoCompanyId");
      this.userId = localStorage.getItem("userInfoId");
      this.doUnit();
      this.doNotifiyCount();
      // Initiate G Map
      this.initMap();
    } else {
      this.events.subscribe('user:created', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        console.log('Welcome', user, 'at', time);
        console.log("Company Id:" + user.company_id);
        this.companyId = user.company_id;
        this.userId = user.staff_id
        this.doUnit();
        this.doNotifiyCount();
        // Initiate G Map
        this.initMap();
      });
    }
  }

  doNotifiyCount() {
    // Notification count
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log("Notifycount URL:" + url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        console.log(error);
      });
    // Notiifcation count
  }


  /****************************/
  /*@doUnit calling on unit */

  /****************************/
  doUnit() {
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = this.apiServiceURL + "/dashboard?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&loginid=" + this.userId + "&company_id=" + this.companyId;

    let res;
    console.log("Dashboard List URL:" + url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        // console.log(JSON.stringify(res));
        // console.log("1" + res.units.length);
        // console.log("2" + res.units);
        if (res.totalCount > 0) {

          for (let unit in res.units) {
            let cname = res.units[unit].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }
            // console.log("Favorite is:" + res.units[unit].favorite);

            this.unitAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              contacts: res.units[unit].contacts,
              nextservicedate: res.units[unit].nextservicedate,
              controllerid: res.units[unit].controllerid,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              serial_number: res.units[unit].serialnumber,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              genstatus: res.units[unit].genstatus,
              favoriteindication: res.units[unit].favorite,
              lat: res.units[unit].latitude,
              lng: res.units[unit].longtitude,
              runninghr: res.units[unit].runninghr,
              companygroup_name: cname,
              viewonid: res.units[unit].viewonid
            });
          }
          // console.log("Kannan12345fdsfs" + JSON.stringify(this.unitAllLists));
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        // console.log("Total Record:" + this.totalCount);

      }, error => {
        console.log("Error" + JSON.stringify(error));
      });

  }

  /******************************************/
  /* @doConfirm called for alert dialog box **/

  /******************************************/
  doConfirm(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this unit?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.unitAllLists.length; q++) {
            if (this.unitAllLists[q] == item) {
              this.unitAllLists.splice(q, 1);
            }
          }
        }
      },
      {
        text: 'No',
        handler: () => {
        }
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
      // url: any = this.apiServiceURL + "/units/" + recordID + "/1/delete";
      url: any = this.apiServiceURL + "/unitlistaction?action=delete&unitid=" + recordID + "&is_mobile=1&loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.sendNotification(`Units was successfully deleted`);
          this.reportData.startindex = 0;
          this.unitAllLists = [];
          this.doUnit();
          console.log("Deleted done");
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log("Error")
      });
  }

  // List page navigate to notification list
  notification() {
    console.log('Will go notification list page');
    // Navigate the notification list page
    this.navCtrl.setRoot(NotificationPage);
  }


  messages() {
    this.navCtrl.setRoot(MessagesPage);
  }

  // Favorite Action

  favorite(unit_id) {
    this.reportData.startindex = 0;
    this.unitAllLists = [];
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setdashboardfavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        let res = data.json();


        if (res.units.length > 0) {
          for (let unit in res.units) {
            let cname = res.units[unit].unitgroup_name;

            if (cname != 'undefined' && cname != undefined) {
              let stringToSplit = cname;
              let x = stringToSplit.split("");
              cname = x[0].toUpperCase();
            } else {
              cname = '';
            }
            console.log("Favorite is:" + res.units[unit].favorite);
            this.unitAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              contacts: res.units[unit].contacts,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              nextservicedate: res.units[unit].nextservicedate,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              models_id: res.units[unit].models_id,
              serial_number: res.units[unit].serialnumber,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              favoriteindication: res.units[unit].favorite,
              genstatus: res.units[unit].genstatus,
              lat: res.units[unit].latitude,
              lng: res.units[unit].longtitude,
              runninghr: res.units[unit].runninghr,
              companygroup_name: cname,
              viewonid: res.units[unit].viewonid
            });
          }
          //this.unitAllLists = res.units;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }

        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Kannan:" + res.favorite);
          if (res.favorite == 0) {
            this.conf.sendNotification("Unfavorited successfully");
          } else {
            this.conf.sendNotification("Favourite successfully");
          }


        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        console.log(error);// + "\n" + error;
      });
    //this.doUnit();
  }


  /**
   * Segment Changed
   */
  segmentChanged(e) {
    this.doUnit();
    this.initMap();
    console.log("Segment changed:" + e.target);
    //console.log("Tabs value:"+tabsvalue)
    //console.log("Segment changed json stringify:"+JSON.stringify(e));

    let mapView = document.getElementById('mapView');
    let listView = document.getElementById('listView');

    if (e._value == 'mapView') {
      mapView.style.display = 'block';
      listView.style.display = 'none';
    } else {
      mapView.style.display = 'none';
      listView.style.display = 'block';
    }

  }


  /**
   * Initiate G Map
   */
  initMap() {

    // Setting up for API call
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/dashboard?is_mobile=1&startindex=0&results=8&sort=unit_id&dir=asc&loginid=" + this.userId + "&company_id=" + this.companyId;

    console.log("InitMap:" + url);
    // API Request
    this.http.get(url, options)
      .subscribe((data) => {

        // JSON data
        let res = data.json();
        console.log("Total Count:" + res.totalCount);
        this.totalCount = res.totalCount;
        console.log(res, res.trippedcount);

        if (res.totalCount > 0) {        // Map overlay circles
          this.alarms = res.trippedcount;
          this.warningcount = res.warningcount;
          this.runningcount = res.runningcount;
          this.readycount = res.readycount;
          this.offlinecount = res.offlinecount;
        } else {
          this.alarms = '0';
          this.warningcount = '0';
          this.runningcount = '0';
          this.readycount = '0';
          this.offlinecount = '0';
        }

        console.log("res units:" + res.units);
        if (res.units == undefined) {
          console.log("A");
          this.defaultUnitAllLists.push({
            unitname: '',
            longtitude: '103.70307100000002',
            latitude: '1.3249773'
          })
          console.log("Load Maps" + JSON.stringify(this.defaultUnitAllLists));
          // Load G Map
          this.loadMap(this.defaultUnitAllLists, 0);
          // Units popups
          this.unitsPopups = this.defaultUnitAllLists;
        } else if (res.units == 'undefined') {
          console.log("B");
          this.defaultUnitAllLists.push({
            unitname: '',
            longtitude: '103.70307100000002',
            latitude: '1.3249773'
          })
          console.log("Load Maps" + JSON.stringify(this.defaultUnitAllLists));
          // Load G Map
          this.loadMap(this.defaultUnitAllLists, 0);
          // Units popups
          this.unitsPopups = this.defaultUnitAllLists;
        } else if (res.units == '') {
          console.log("C");
          this.defaultUnitAllLists.push({
            unitname: '',
            longtitude: '103.70307100000002',
            latitude: '1.3249773'
          })
          console.log("Load Maps" + JSON.stringify(this.defaultUnitAllLists));
          // Load G Map
          this.loadMap(this.defaultUnitAllLists, 0);
          // Units popups
          this.unitsPopups = this.defaultUnitAllLists;
        } else {

          console.log("D");
          // Load G Map
          this.loadMap(res.units, 1);
          // Units popups
          this.unitsPopups = res.units;

        }

      });

  }


  /**
   * Load G Map
   *
   * @param units
   */
  loadMap(units, unitsavail) {



    // Units

    let markers = units;

    // Maps styles
    let mapStyle = [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "saturation": 36
          },
          {
            "color": "#333333"
          },
          {
            "lightness": 40
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#fefefe"
          },
          {
            "lightness": 17
          },
          {
            "weight": 1.2
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 20
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e6e6e6"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          },
          {
            "lightness": 21
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#acacac"
          },
          {
            "lightness": 17
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "lightness": 29
          },
          {
            "weight": 0.2
          },
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#bcbcbc"
          },
          {
            "lightness": 18
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#f3f3f3"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          },
          {
            "lightness": 16
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#d7d7d7"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "transit.station.airport",
        "elementType": "labels.icon",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "transit.station.bus",
        "elementType": "labels.icon",
        "stylers": [
          {
            "color": "#ff0000"
          }
        ]
      },
      {
        "featureType": "transit.station.rail",
        "elementType": "labels.icon",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#989898"
          },
          {
            "lightness": 17
          }
        ]
      }
    ];

    let bounds = new google.maps.LatLngBounds();
    let latLngmapoption = new google.maps.LatLng(1.3249773, 103.70307100000002);
    // Map options
    let mapOptions = {
      styles: mapStyle,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latLngmapoption
    }


    // Create map
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Use unit location for info box content
    let infowindow = new google.maps.InfoWindow({
      content: ''
    });

    //if (units > 0) {
    // Loop to go through all generators Lat Lang
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].latitude == 0 || markers[i].longtitude == 0) {

      } else {


        let latLng = new google.maps.LatLng(markers[i].latitude, markers[i].longtitude);

        bounds.extend(latLng);

        let iconDisplay;
        console.log('units:' + unitsavail);
        console.log("Gen Status for marker icon:" + markers[i].genstatus);
        if (unitsavail == 0) {
          iconDisplay = 'assets/imgs/marker-white-default.png';
        } else {
          iconDisplay = 'assets/imgs/marker-' + markers[i].genstatus + '.png'
        }
        let marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: markers[i].unitname,
          icon: iconDisplay
        });



        google.maps.event.addListener(infowindow, 'closeclick', function () {
          let popups = document.getElementsByClassName('popup');
          for (let i = 0; i < popups.length; i++) {
            popups[i].classList.remove('showPopup');

          }

        });

        let currinfowindow = null;


        // Add click event
        marker.addListener('click', function () {

          // Use unit location for info box content
          infowindow.setContent(markers[i].location);
          infowindow.open(this.map, marker);

          let popups = document.getElementsByClassName('popup');
          let popup = document.getElementById(markers[i].unit_id);

          for (let i = 0; i < popups.length; i++) {
            popups[i].classList.remove('showPopup');

          }

          popup.classList.add('showPopup');

        });


      }

    }


    //}
    // Automatically center the map fitting all markers on the screen
    this.map.fitBounds(bounds);

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    let boundsListener = google.maps.event.addListener((this.map), 'bounds_changed', function (event) {
      this.setZoom(12);
      google.maps.event.removeListener(boundsListener);
    });


  }



  doSort() {
    let prompt = this.alertCtrl.create({
      title: 'Sort By',
      inputs: [
        {
          type: 'radio',
          label: 'Favourites',
          value: 'favorite'
        },
        {
          type: 'radio',
          label: 'Unit Name',
          value: 'unitname',
        },
        {
          type: 'radio',
          label: 'Unit Group',
          value: 'unitgroup',
        },
        {
          type: 'radio',
          label: 'Status',
          value: 'status',
        },
        /*{
          type: 'radio',
          label: 'Tripped',
          value: 'tripped',
        },
        {
          type: 'radio',
          label: 'Waring',
          value: 'warning',
        },
        {
          type: 'radio',
          label: 'Running',
          value: 'running',
        },
        {
          type: 'radio',
          label: 'Offline',
          value: 'offline',
        },*/




      ],
      buttons: [
        {
          text: 'Asc',
          handler: data => {
            console.log(data);
            console.log('Asc clicked');
            if (data != undefined) {
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'asc';
              if (data == 'unitname') {
                this.sortLblTxt = 'Unit Name';
              } else if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'status') {
                this.sortLblTxt = 'Status';
              }
              this.reportData.startindex = 0;
              this.unitAllLists = [];
              this.doUnit();
            }
          }
        },
        {
          text: 'Desc',
          handler: data => {
            console.log(data);
            if (data != undefined) {
              console.log('Desc clicked');
              this.reportData.sort = data;
              this.reportData.sortascdesc = 'desc';
              if (data == 'unitname') {
                this.sortLblTxt = 'Unit Name';
              } else if (data == 'favorite') {
                this.sortLblTxt = 'Favourites';
              } else if (data == 'unitgroup') {
                this.sortLblTxt = 'Unit Group';
              } else if (data == 'status') {
                this.sortLblTxt = 'Status';
              }
              this.reportData.startindex = 0;
              this.unitAllLists = [];
              this.doUnit();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  hideondash(id) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to hide from dashboard?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.hideondashboard(id);
        }
      },
      {
        text: 'No',
        handler: () => {
        }
      }]
    });
    confirm.present();
  }
  hideondashboard(id) {
    let urlstr = "/dashboardaction?id=" + id + "&action=hide&is_mobile=1&loginid=" + this.userId;
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + urlstr;
    console.log("onAction map.ts:" + url);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));

        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.sendNotification(`Dashboard hide action successfully updated`);
          this.reportData.startindex = 0;
          this.unitAllLists = [];
          this.doUnit();
        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        // this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  doAction(item, act, unitId) {
    if (act == 'edit') {
      this.navCtrl.setRoot(AddUnitPage, {
        record: item,
        act: act,
        unitId: unitId,
        from: 'dashboard'
      });
      return false;
    } else if (act == 'detail') {

      localStorage.setItem("unitId", unitId);
      localStorage.setItem("iframeunitId", unitId);
      localStorage.setItem("unitunitname", item.unitname);
      localStorage.setItem("unitlocation", item.location);
      localStorage.setItem("unitprojectname", item.projectname);
      localStorage.setItem("unitcolorcode", item.colorcodeindications);
      if (item.lat == undefined) {
        item.lat = '';
      }
      if (item.lat == 'undefined') {
        item.lat = '';
      }

      if (item.lng == undefined) {
        item.lng = '';
      }
      if (item.lng == 'undefined') {
        item.lng = '';
      }



      if (item.runninghr == undefined) {
        item.runninghr = '';
      }
      if (item.runninghr == 'undefined') {
        item.runninghr = '';
      }

      if (item.nextservicedate == undefined) {
        item.nextservicedate = '';
      }
      if (item.nextservicedate == 'undefined') {
        item.nextservicedate = '';
      }


      localStorage.setItem("unitlat", item.lat);
      localStorage.setItem("unitlng", item.lng);
      localStorage.setItem("runninghr", item.runninghr);
      console.log("RHR" + item.runninghr);
      localStorage.setItem("nsd", item.nextservicedate);

      localStorage.setItem("microtime", "");
      this.navCtrl.setRoot(UnitdetailsPage, {
        record: item
      });
      return false;
    } else {
      /* this.navCtrl.setRoot(ViewcompanygroupPage, {
         record: item,
         act: act
       });
       return false;*/
    }
  }
  pushTesting() {
    this.navCtrl.setRoot(MessageDetailViewPage, {
      event_id: 10,
      from: 'push'
    });
  }
  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doUnit();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // to initialize push notifications

    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };


    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a new notification in tab page', notification);
      console.log(notification.additionalData.arrayval.type);
      this.pushnotifycount = 0;
      if (notification.additionalData.arrayval.type == 'M') {
        console.log("A:" + this.pushnotifycount);
        this.pushnotifycount = this.pushnotifycount + 1;
        console.log("B:" + this.pushnotifycount);
        //this.msgcount = this.msgcount + this.pushnotifycount;
        console.log("C:" + this.msgcount);
      }

      this.schedule(notification, this.msgcount);
    }
    );

    pushObject.on('registration').subscribe((registration: any) => {

      console.log('Device registered', registration);
      console.log('Device Json registered', JSON.stringify(registration));
      localStorage.setItem("deviceTokenForPushNotification", registration.registrationId);
    }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));


  }
  public schedule(notification, cnt) {
    if (this.userId > 0) {
      //this.msgcount = cnt;
      console.log("D:" + JSON.stringify(notification));
      this.localNotifications.schedule({
        title: notification.title,
        text: notification.message,
        at: new Date(new Date()),
        sound: null
      });

      localStorage.setItem("navtype", notification.additionalData.arrayval.type);
      localStorage.setItem("navtid", notification.additionalData.arrayval.id);

      this.localNotifications.on("click", (notification, state) => {
        console.log("Local notification clicked...");
        console.log("1" + notification);
        console.log("2" + state);
        console.log("3" + JSON.stringify(notification));
        console.log("4" + JSON.stringify(state));
        let navids = localStorage.getItem("navtid");
        let navtypes = localStorage.getItem("navtype");
        console.log(navids);
        console.log(navtypes);

        if (navtypes == 'M') {
          this.navCtrl.setRoot(MessageDetailViewPage, {
            event_id: navids,
            from: 'push'
          });
        }
        else if (navtypes == 'OA') {
          this.navCtrl.setRoot(EventDetailsPage, {
            event_id: navids,
            from: 'Push'
          });
        } else if (navtypes == 'A') {
          this.navCtrl.setRoot(EventDetailsPage, {
            event_id: navids,
            from: 'Push'
          });
          localStorage.setItem("fromModule", "AlarmdetailsPage");
        } else if (navtypes == 'C') {
          this.navCtrl.setRoot(CommentdetailsPage, {
            event_id: navids,
            from: 'Push'
          });
          localStorage.setItem("fromModule", "CommentdetailsPage");
        } else if (navtypes == 'E') {
          this.navCtrl.setRoot(EventDetailsEventPage, {
            event_id: navids,
            from: 'Push',
          });
          localStorage.setItem("fromModule", "CalendardetailPage");
        } else if (navtypes == 'S') {
          this.navCtrl.setRoot(EventDetailsServicePage, {
            event_id: navids,
            from: 'Push'
          });
          localStorage.setItem("fromModule", "ServicedetailsPage");
        }

      });

    }
  }
}


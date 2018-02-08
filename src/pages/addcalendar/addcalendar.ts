import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { NotificationPage } from '../notification/notification';
import { CalendarPage } from '../calendar/calendar';
import { Config } from '../../config/config';
import { DatePicker } from '@ionic-native/date-picker';
import * as moment from 'moment';
/**
 * Generated class for the AddcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addcalendar',
  templateUrl: 'addcalendar.html',
  providers: [DatePicker, Config]
})
export class AddcalendarPage {
  // Define FormBuilder /model properties
  public loginas: any;
  public form: FormGroup;
  public type_name: any;
  public event_project: any;
  public event_subject: any;
  public event_location: any;
  public gethashtag: any;
  public event_unitid: any;
  public companyId: any;
  public event_date: any;
  public event_end_date: any;
  public event_time: any = '';
  public event_end_time: any = '';

  public msgcount: any;
  public notcount: any;
  public month1: any;
  public date1: any;
  public event_title: any;

  public alldayeventvalue: boolean = false;
  public isSubmitted: boolean = false;
  public alldayevent: boolean = true;
  public event_type: any;
  public event_notes: any;
  public service_remark: any;
  public userId: any;
  public responseResultType = [];
  public responseResultTime = [];
  public responseResultCompany: any;
  public unitfield: any;
  public starttimefield: boolean = false;
  public endtimefield: boolean = false;
  public enddatefield: boolean = true;
  public alldayeventhide: boolean = true;

  disunit: any;
  starttimelabel: any = "Start";
  startdatelabel: any = "Start";
  locationstr: any = "Deployed";
  all;
  public hours;
  public profilePhoto;
  mindate;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;

  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  tabBarElement: any;
  constructor(private conf: Config, public platform: Platform, private datePicker: DatePicker, public navCtrl: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    this.locationstr = "Deployed";
    this.mindate = moment().format();
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "event_location": ["", Validators.required],
      "event_subject": ["", Validators.required],
      "event_unitid": [""],
      //  "event_title": ["", Validators.required],
      "event_project": [""],
      "event_date": [""],
      "event_end_date": [""],
      "event_type": [""],
      "event_notes": ["", Validators.required],
      "event_time": [""],
      "event_end_time": [""],
      "alldayevent": [""]

    });
    this.disunit = false;
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");





    this.responseResultTime.push(

      { id: '6:00 AM', time_name: '6:00 AM' }
      , { id: '6:15 AM', time_name: '6:15 AM' }
      , { id: '6:30 AM', time_name: '6:30 AM' }
      , { id: '6:45 AM', time_name: '6:45 AM' }
      , { id: '7:00 AM', time_name: '7:00 AM' }
      , { id: '7:15 AM', time_name: '7:15 AM' }
      , { id: '7:30 AM', time_name: '7:30 AM' }
      , { id: '7:45 AM', time_name: '7:45 AM' }
      , { id: '8:00 AM', time_name: '8:00 AM' }
      , { id: '8:15 AM', time_name: '8:15 AM' }
      , { id: '8:30 AM', time_name: '8:30 AM' }
      , { id: '8:45 AM', time_name: '8:45 AM' }
      , { id: '9:00 AM', time_name: '9:00 AM' }
      , { id: '9:15 AM', time_name: '9:15 AM' }
      , { id: '9:30 AM', time_name: '9:30 AM' }
      , { id: '9:45 AM', time_name: '9:45 AM' }
      , { id: '10:00 AM', time_name: '10:00 AM' }
      , { id: '10:15 AM', time_name: '10:15 AM' }
      , { id: '10:30 AM', time_name: '10:30 AM' }
      , { id: '10:45 AM', time_name: '10:45 AM' }
      , { id: '11:00 AM', time_name: '11:00 AM' }
      , { id: '11:15 AM', time_name: '11:15 AM' }
      , { id: '11:30 AM', time_name: '11:30 AM' }
      , { id: '11:45 AM', time_name: '11:45 AM' }
      , { id: '12:00 PM', time_name: '12:00 PM' }
      , { id: '12:15 PM', time_name: '12:15 PM' }
      , { id: '12:30 PM', time_name: '12:30 PM' }
      , { id: '12:45 PM', time_name: '12:45 PM' }
      , { id: '1:00 PM', time_name: '1:00 PM' }
      , { id: '1:15 PM', time_name: '1:15 PM' }
      , { id: '1:30 PM', time_name: '1:30 PM' }
      , { id: '1:45 PM', time_name: '1:45 PM' }
      , { id: '2:00 PM', time_name: '2:00 PM' }
      , { id: '2:15 PM', time_name: '2:15 PM' }
      , { id: '2:30 PM', time_name: '2:30 PM' }
      , { id: '2:45 PM', time_name: '2:45 PM' }
      , { id: '3:00 PM', time_name: '3:00 PM' }
      , { id: '3:15 PM', time_name: '3:15 PM' }
      , { id: '3:30 PM', time_name: '3:30 PM' }
      , { id: '3:45 PM', time_name: '3:45 PM' }
      , { id: '4:00 PM', time_name: '4:00 PM' }
      , { id: '4:15 PM', time_name: '4:15 PM' }
      , { id: '4:30 PM', time_name: '4:30 PM' }
      , { id: '4:45 PM', time_name: '4:45 PM' }
      , { id: '5:00 PM', time_name: '5:00 PM' }
      , { id: '5:15 PM', time_name: '5:15 PM' }
      , { id: '5:30 PM', time_name: '5:30 PM' }
      , { id: '5:45 PM', time_name: '5:45 PM' }
      , { id: '6:00 PM', time_name: '6:00 PM' }
      , { id: '6:15 PM', time_name: '6:15 PM' }
      , { id: '6:30 PM', time_name: '6:30 PM' }
      , { id: '6:45 PM', time_name: '6:45 PM' }
      , { id: '7:00 PM', time_name: '7:00 PM' }
      , { id: '7:15 PM', time_name: '7:15 PM' }
      , { id: '7:30 PM', time_name: '7:30 PM' }
      , { id: '7:45 PM', time_name: '7:45 PM' }
      , { id: '8:00 PM', time_name: '8:00 PM' }
      , { id: '8:15 PM', time_name: '8:15 PM' }
      , { id: '8:30 PM', time_name: '8:30 PM' }
      , { id: '8:45 PM', time_name: '8:45 PM' }
      , { id: '9:00 PM', time_name: '9:00 PM' }
      , { id: '9:15 PM', time_name: '9:15 PM' }
      , { id: '9:30 PM', time_name: '9:30 PM' }
      , { id: '9:45 PM', time_name: '9:45 PM' }
      , { id: '10:00 PM', time_name: '10:00 PM' }
      , { id: '10:15 PM', time_name: '10:15 PM' }
      , { id: '10:30 PM', time_name: '10:30 PM' }
      , { id: '10:45 PM', time_name: '10:45 PM' }
      , { id: '11:00 PM', time_name: '11:00 PM' }
      , { id: '11:15 PM', time_name: '11:15 PM' }
      , { id: '11:30 PM', time_name: '11:30 PM' }
      , { id: '11:45 PM', time_name: '11:45 PM' }
    );
    let dateStr = new Date();




    this.month1 = dateStr.getUTCMonth() + 1;


    if (this.getlength(this.month1) == 1) {
      this.month1 = '0' + this.month1;
    } else {
      this.month1 = this.month1;
    }


    this.date1 = dateStr.getDate();


    if (this.getlength(this.date1) == 1) {
      this.date1 = '0' + this.date1;
    } else {
      this.date1 = this.date1;
    }



    // this.event_date = dateStr.getFullYear() + "-" + this.month1 + "-" + this.date1;
    this.event_date = localStorage.getItem("eventDate");
    this.event_end_date = localStorage.getItem("eventDate");
    this.event_date = moment().format();
    this.event_end_date = moment().format();
    console.log("Bottom UTC Format Current Date:" + this.event_date);

    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.profilePhoto = localStorage.getItem

      ("userInfoPhoto");
    this.profilePhoto = this.apiServiceURL +

      "/staffphotos/" + this.profilePhoto;
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.previous();
      });
    });
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
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
    //this.event_date=localStorage.getItem("sdate");
    this.getUnitListData();
    this.resetFields();
    if (this.NP.get("item")) {
      console.log(this.NP.get("type"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("item"), this.NP.get("type"));
      this.pageTitle = 'Update Event';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("type").toLowerCase() == 'event') {
        this.responseResultType.push({
          id: '1',
          type_name: 'Event',
        }
        );
      }
      else {
        this.responseResultType.push({
          id: '2',
          type_name: 'Service',
        }
        );
      }
    }
    else {
      this.responseResultType.push({
        id: '1',
        type_name: 'Service',
      }, {
          id: '2',
          type_name: 'Event'
        });
      this.isEdited = false;
      this.pageTitle = "Add New";
    }
  }
  getlength(number) {
    return number.toString().length;
  }
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad  AddcalendarPage');
    localStorage.setItem("fromModule", "AddcalendarPage");




  }


  address1get(hashtag) {
    console.log(hashtag);
    this.gethashtag = hashtag;
  }

  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters



  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item, type) {
    console.log("Edit Select Entry Response" + JSON.stringify(item));

    this.event_location = item.event_location

    if (type == 'service') {
      this.type_name = "Service";
      this.event_type = 'Service';
      this.event_date = item.service_scheduled_date;
      console.log("Event Date:" + item.event_date);
      this.event_unitid = item.service_unitid;
      this.recordID = item.service_id;
      this.event_time = item.service_scheduled_time.substr(0, 5);
      let getampmpvalue = item.service_scheduled_time.substr(6, 8)
      console.log("AMPM:" + getampmpvalue);
      if (getampmpvalue == 'PM') {
        let timesplit = this.event_time.split(":");
        let hoursadd24hourformat = parseInt(timesplit[0]) + 12;
        console.log("hoursadd24hourformat" + hoursadd24hourformat);
        this.event_time = hoursadd24hourformat + ":" + timesplit[1];
      }
      //this.event_time ='17:30';
      console.log("Time for Start:" + this.event_time);

      this.event_subject = item.service_subject;
      this.event_notes = item.description;
      this.alldayeventhide = false;
      this.enddatefield = false;
      this.endtimefield = false;
      this.starttimefield = true;
      this.starttimelabel = "";
      this.startdatelabel = "";
      this.unitfield = true;
      this.disunit = true;
    }
    if (type == 'event') {
      this.unitfield = false;
      this.disunit = false;
      console.log("Time for End Before:" + item.event_end_time);
      this.getType(this.type_name);

      this.type_name = "Event";
      this.event_type = 'Event';
      this.event_subject = item.event_title;
      this.event_notes = item.event_remark;
      this.event_unitid = item.event_unitid;
      this.recordID = item.event_id;
      this.event_date = item.event_date_y_m_d;
      this.event_end_date = item.event_end_date;
      this.event_time = item.event_time.substr(0, 5);
      let getampmpvalue = item.event_time.substr(6, 8)
      console.log("AMPM:" + getampmpvalue);
      if (getampmpvalue == 'PM') {
        let timesplit = this.event_time.split(":");
        let hoursadd24hourformat = parseInt(timesplit[0]) + 12;
        console.log("hoursadd24hourformat" + hoursadd24hourformat);
        this.event_time = hoursadd24hourformat + ":" + timesplit[1];
        console.log("this.event_time" + this.event_time);
      }


      if (this.event_time != '') {
        this.starttimefield = true;
      }
      if (this.event_end_date != '') {
        this.alldayevent = false;
      }
      if (item.event_end_time == null) {
        console.log("A");
        this.event_end_time = '';
      } else {
        console.log("B");
        this.event_end_time = item.event_end_time;
      }

      console.log("this.event_end_time" + this.event_end_time);
      console.log("item.event_end_time" + item.event_end_time);
      if (this.event_end_time != '') {
        // console.log("E");
        // this.event_end_time = item.event_end_time.substr(0, 5);

        // let getampmpvalue = item.event_end_time.substr(5, 7)
        // console.log("AMPM:" + getampmpvalue);
        // if (getampmpvalue == 'PM') {
        //   console.log('Enter PM'+ item.event_end_time);
        //   let timesplit = item.event_end_time.split(":");
        //   let hoursadd24hourformat = parseInt(timesplit[0]) + 12;
        //   console.log("hoursadd24hourformat" + hoursadd24hourformat);
        //   this.event_end_time = this.event_end_time + ":" + timesplit[1];
        //   console.log(this.event_end_time);
        //   console.log("this.event_end_time" + this.event_end_time);
        // }


        this.event_end_time = item.event_end_time.substr(0, 5);
        let getampmpvalue = item.event_end_time.substr(6, 8)
        console.log("END TIME AMPM:" + getampmpvalue);
        if (getampmpvalue == 'PM') {
          let timesplit = this.event_end_time.split(":");
          let hoursadd24hourformat = parseInt(timesplit[0]) + 12;
          console.log("hoursadd24hourformat" + hoursadd24hourformat);
          this.event_end_time = hoursadd24hourformat + ":" + timesplit[1];
          console.log("this.event_end_time" + this.event_end_time);
        }

      } else {
        this.event_end_time = '';
      }
     
      if (item.event_alldayevent == 0) {
        this.starttimefield = true;
        this.endtimefield = true;
        this.alldayevent = false;
      } else {
        this.starttimefield = false;
        this.endtimefield = false;
        this.alldayevent = true;
      }
    }

    ///this.event_subject = item.event_subject;


    if (this.event_unitid > 0) {
      this.getProjectLocation(this.event_unitid)
    }
    this.address1get(this.event_notes);
  }

  getType(type) {
    console.log("Event Type:" + type);
    if (type == "Service") {
      this.locationstr = 'Deployed';
      this.unitfield = true;
      this.disunit = true;
      this.starttimefield = true;
      this.enddatefield = false;
      this.endtimefield = false;
      this.starttimelabel = "";
      this.startdatelabel = "";
      this.alldayeventhide = false;
    } else {
      this.locationstr = '';
      this.unitfield = false;
      this.disunit = false;
      this.enddatefield = true;
      this.endtimefield = false;
      this.starttimefield = false;
      this.starttimelabel = "Start";
      this.startdatelabel = "Start";
      this.alldayeventhide = true;
    }
  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(event_date, event_end_date, event_end_time, alldayevent, type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, createdby) {
    //let updatedby = createdby;


    let timesplit_start = event_time.split(":");
    let hrvalue_start = timesplit_start[0];
    let minvalue_start = timesplit_start[1];
    let ampmstr_start = 'AM';
    if (hrvalue_start > 12) {
      hrvalue_start = hrvalue_start - 12;
      hrvalue_start = hrvalue_start < 10 ? "0" + hrvalue_start : hrvalue_start;
      ampmstr_start = 'PM';
    }
    if (hrvalue_start != '') {
      event_time = hrvalue_start + ":" + minvalue_start + " " + ampmstr_start;
    } else {
      let date = new Date();
      let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      let am_pm = date.getHours() >= 12 ? "PM" : "AM";
      this.hours = hours < 10 ? "0" + hours : hours;
      let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      event_time = this.hours + ":" + minutes + " " + am_pm;
    }


    let timesplit_end = event_end_time.split(":");
    let hrvalue_end = timesplit_end[0];
    let minvalue_end = timesplit_end[1];
    let ampmstr_end = 'AM';
    if (hrvalue_end > 12) {
      hrvalue_end = hrvalue_end - 12;
      hrvalue_end = hrvalue_end < 10 ? "0" + hrvalue_end : hrvalue_end;
      ampmstr_end = 'PM';
    }
    if (hrvalue_end != '') {
      event_end_time = hrvalue_end + ":" + minvalue_end + " " + ampmstr_end;
    } else {
      let date = new Date();
      let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      let am_pm = date.getHours() >= 12 ? "PM" : "AM";
      this.hours = hours < 10 ? "0" + hours : hours;
      let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      event_end_time = this.hours + ":" + minutes + " " + am_pm;
    }
    // let timesplit_end = event_end_time.split(":");
    // let hrvalue_end = timesplit_end[0];
    // let minvalue_end = timesplit_end[1];
    // let ampmstr_end = 'AM';
    // if (hrvalue_end > 12) {
    //   hrvalue_end = hrvalue_end - 12;
    //   ampmstr_end = 'PM';
    // }
    // if (hrvalue_end != '') {
    //   event_end_time = hrvalue_end + ":" + minvalue_end + " " + ampmstr_end;
    // } else {
    //   event_end_time = '';
    // }
    this.isSubmitted = true;
   

    if (localStorage.getItem("atMentionResult") != '') {
      service_remark = localStorage.getItem("atMentionResult");
    }

    let field;
    if (type_name == 'Service') {
      field = "&event_title=" + event_subject;
    } else {
      field = "&event_title=" + event_subject;
    }
    let body: string = "is_mobile=1&event_type="
      + type_name + field + "&event_date=" + this.event_date.split("T")[0] + "&event_time=" + event_time + "&service_unitid=" + event_unitid + "&event_location=" + event_location + "&service_remark=" + service_remark + "&event_added_by=" + createdby + "&serviced_by=" + createdby + "&event_alldayevent=" + alldayevent + "&event_end_date=" + this.event_end_date + "&event_end_time=" + event_end_time,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/eventstorev2";

    //http://denyoappv2.stridecdev.com/eventstorev2?is_mobile=1&event_type=Event&event_title=testing&event_location=madurai&event_date=2017-12-12&event_time=12%20AM&event_added_by=1&service_remark=testing%20remarks&event_alldayevent=1&event_end_date=2017-12-25&event_end_time=12%20AM
    console.log(url + "?" + body);
    this.http.post(url, body, options)
      .subscribe((data) => {
        let res = data.json();
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            this.conf.sendNotification(res.msg[0].result);
          } else {
            this.conf.sendNotification(res.msg[0].result);
            localStorage.setItem("atMentionResult", '');
            this.navCtrl.setRoot(CalendarPage);
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



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data


  updateEntry(event_date, event_end_date, event_end_time, alldayevent, type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, createdby) {
    
    if (localStorage.getItem("atMentionResult") != '') {
      service_remark = localStorage.getItem("atMentionResult");
    }
    this.isSubmitted = true;
    let timesplit_start = event_time.split(":");
    let hrvalue_start = timesplit_start[0];
    let minvalue_start = timesplit_start[1];
    let ampmstr_start = 'AM';
    if (hrvalue_start > 12) {
      hrvalue_start = hrvalue_start - 12;
      ampmstr_start = 'PM';
    }
    if (hrvalue_start != '') {
      event_time = hrvalue_start + ":" + minvalue_start + " " + ampmstr_start;
    } else {
      let date = new Date();
      let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      let am_pm = date.getHours() >= 12 ? "PM" : "AM";
      this.hours = hours < 10 ? "0" + hours : hours;
      let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      event_time = this.hours + ":" + minutes + " " + am_pm;
    }


    let timesplit_end = event_end_time.split(":");
    let hrvalue_end = timesplit_end[0];
    let minvalue_end = timesplit_end[1];
    let ampmstr_end = 'AM';
    if (hrvalue_end > 12) {
      hrvalue_end = hrvalue_end - 12;
      hrvalue_end = hrvalue_end < 10 ? "0" + hrvalue_end : hrvalue_end;
      ampmstr_end = 'PM';
    }
    if (hrvalue_end != '') {
      event_end_time = hrvalue_end + ":" + minvalue_end + " " + ampmstr_end;
    } else {
      let date = new Date();
      let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      let am_pm = date.getHours() >= 12 ? "PM" : "AM";
      this.hours = hours < 10 ? "0" + hours : hours;
      let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      event_end_time = this.hours + ":" + minutes + " " + am_pm;
    }
    
    // let timesplit_end = event_end_time.split(":");
    // let hrvalue_end = timesplit_end[0];
    // let minvalue_end = timesplit_end[1];
    // let ampmstr_end = 'AM';
    // if (hrvalue_end > 12) {
    //   hrvalue_end = hrvalue_end - 12;
    //   ampmstr_end = 'PM';
    // }
    // if (hrvalue_end != '') {
    //   event_end_time = hrvalue_end + ":" + minvalue_end + " " + ampmstr_end;
    // } else {
    //   event_end_time = '';
    // }
    /* if (localStorage.getItem("atMentionResult") != '') {
       service_remark = localStorage.getItem("atMentionResult");
     }*/
    let field;
    if (type_name == 'Service') {
      field = "&event_title=" + event_subject;
    } else {
      field = "&event_title=" + event_subject;
    }
    event_unitid = this.event_unitid;
    let body: string = "is_mobile=1&event_type="
      + type_name + field + "&event_date=" + this.event_date + "&event_time=" + event_time + "&service_unitid=" + event_unitid + "&event_location=" + event_location + "&event_remark=" + service_remark + "&ses_login_id=" + createdby + "&id=" + this.recordID + "&event_alldayevent=" + alldayevent + "&event_end_date=" + this.event_end_date + "&event_end_time=" + event_end_time,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/calendar/update";
    console.log("Update Event API URL:=" + url + "?" + body);
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();
        console.log(data.json());
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            this.conf.sendNotification(res.msg[0].result);
            localStorage.setItem("atMentionResult", '');
          } else {
            this.conf.sendNotification(res.msg[0].result);
            this.navCtrl.setRoot(CalendarPage);
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



  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry() {


    let type_name: string = this.form.controls["type_name"].value,
      //body: string = "key=delete&recordID=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/" + this.recordID + "/1/delete";
    console.log(url);
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          this.conf.sendNotification(`Company group: ${type_name} was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }



  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {


    let type_name: string = this.form.controls["event_type"].value,
      event_project: string = this.form.controls["event_project"].value,
      event_subject: string = this.form.controls["event_subject"].value,
      event_unitid: string = this.form.controls["event_unitid"].value,
      // event_title: string = this.form.controls["event_title"].value,

      event_date: string = this.form.controls["event_date"].value,
      event_end_date: string = this.form.controls["event_end_date"].value,
      event_time: string = this.form.controls["event_time"].value,
      event_end_time: string = this.form.controls["event_end_time"].value,
      event_location: string = this.form.controls["event_location"].value,
      service_remark: string = this.form.controls["event_notes"].value;
    this.alldayeventvalue = this.form.controls["alldayevent"].value;

    console.log("alldayevent toggle value" + this.alldayeventvalue);
    if (event_end_date == undefined) {
      event_end_date = '';
    }
    if (event_end_date == 'undefined') {
      event_end_date = '';
    }
    if (event_end_date == '') {
      event_end_date = '';
    }
    if (event_end_date != '') {
      if (event_end_date >= event_date) {
        console.log('Positive');
      } else {
        if (type_name != 'Service') {

          this.conf.sendNotification('End date should be after start date');
          return false;
        }
      }
    }
    let togglevalue;
    if (this.alldayeventvalue == true) {
      togglevalue = 1;
      // this.event_end_date='0000-00-00';
      event_end_time = '';
    } else {
      togglevalue = 0
    }

    console.log("Final Toggle" + this.alldayeventvalue + ":" + togglevalue);

    if (this.isEdited) {
      this.updateEntry(event_date, event_end_date, event_end_time, togglevalue, type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, this.userId);
    }
    else {
      this.createEntry(event_date, event_end_date, event_end_time, togglevalue, type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, this.userId);
    }

  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.type_name = "";
    this.event_project = "";
    this.event_subject = "";
    this.event_unitid = "";
  }

  getUnitListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=0&results=300&sort=unit_id&dir=asc&company_id=" + this.companyId + "&loginid=" + this.userId;
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        this.responseResultCompany = res.units;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  getProjectLocation(unitid) {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/" + unitid + "/1/getunitdata";
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("Project Name:" + res.unitdata[0].projectname);
        console.log("Project Location:" + res.unitdata[0].location);
        this.event_project = res.unitdata[0].projectname;
        this.event_location = res.unitdata[0].location;
        //this.responseResultCompany = res.companies;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }





  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.event_date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        console.log('Got date: ', this.event_date);
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  previous() {
    this.navCtrl.setRoot(CalendarPage);
  }
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  redirectCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }

  alldayeenttoggle(event, val) {
    console.log(event);
    console.log(val);
    if (val == true) {
      this.endtimefield = false;
      this.starttimefield = false;
      this.isEdited = true;
      this.recordID
      if (this.recordID == 0) {
        this.event_end_time = '';
      }
      // this.event_end_date='';

    } else {
      this.endtimefield = true;
      this.starttimefield = true;
    }
  }
  filToDate(event_date) {
    console.log("Start Date:" + event_date);
    this.event_end_date = event_date.split("T")[0];
  }
}


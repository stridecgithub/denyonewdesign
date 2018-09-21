
import { Component, Input, Output, EventEmitter, HostListener, ElementRef }
  from '@angular/core';
import { Events, NavController, AlertController, Platform, ItemSliding, NavParams, App } from 'ionic-angular';
import * as moment from 'moment';
import * as shortid from 'shortid';
import { Http, Headers, RequestOptions } from "@angular/http";
import { EventDetailsPage } from '../../pages/event-details/event-details';
import { EventDetailsServicePage } from '../../pages/event-details-service/event-details-service';
import { EventDetailsEventPage } from '../../pages/event-details-event/event-details-event';
import { NotificationPage } from '../notification/notification';
import { AddcalendarPage } from '../../pages/addcalendar/addcalendar';
import { AddalarmPage } from '../../pages/addalarm/addalarm';
import { Config } from '../../config/config';
import { DashboardPage } from '../dashboard/dashboard';
interface CalendarEvent {
  data?: any;
  id?: string;
  name: string;
  type?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  isExtension?: boolean;
  extensionMonthViewDayIdxs?: number[];
  icon?: string;
  ontap?: Function;
  onpress?: Function;
  ondoubletap?: Function;
}

interface CalendarDay {
  date: moment.Moment;
  events: CalendarEvent[];
}

interface MonthView {
  days: CalendarDay[];
  numberOfDaysThisMonth: number;
  firstDayOfMonth: moment.Moment;
  lastDayOfMonth: moment.Moment;
  selectedDate: moment.Moment;
}

interface WeekView {
  days: any[];
  firstDayOfWeek: moment.Moment;
  lastDayOfWeek: moment.Moment;
  selectedDate: moment.Moment;
}

interface CalendarControl {
  viewMode: string;
  dateSelection: moment.Moment;
  selectedYear: number;
  selectedMonth: string;
  selectedDay: number;
  monthView: MonthView;
  weekView: WeekView;
}
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
  footerBar: number = 2;
  allselected: any;
  typeStr: any;
  serviceselected: any;
  alarmselected: any;
  eventsselected: any;
  dateHeaderTitle: any;
  petselection: any;
  pet: string = "ALL";
  onLoad: boolean;
  public currentCalendarDate: any;
  public currentDate: any;
  public currentMonth: any;
  public currentYear: any;
  public monthstr: any;
  calendarResultAll: any;
  daySession: any;
  currentDateFormatToday: any;
  calendarResultService: any;
  calendarResultEvent: any;
  calendarResultAlarm: any;
  currentDataHighlights: any;
  public totalCountEventDateWise: any;
  noeventtitle: any;
  highlightdots: any;
  public EVENTVIEWACCESS: any;
  public EVENTDELETEACCESS: any;
  public ALARMVIEWACCESS: any;
  public ALARMDELETEACCESS: any;
  public SERVICEVIEWACCESS: any;
  public EVENTEDITACCESS: any;
  public SERVICEEDITACCESS: any;
  public ALARMEDITACCESS: any;
  public month: any;
  public date: any;
  public SERVICEDELETEACCESS: any;
  public eventIdentify = [];
  public serviceIdentify = [];
  public alarmIdentity = [];
  public highlighteddata = [];
  public userId: any;
  public monthTitle: any;
  public yearTitle: any;
  public companyId: any;
  public calendarMonth: any;
  public calendarDate: any;
  public calendarYear: any;
  months: string[] = moment.months();
  weekDays: any[] = moment.weekdays();
  ctrl: CalendarControl;
  activeDragGroup: string;
  itemCameFromBag: any;
  draggingItem: any = null;
  draggingItemId: string;
  sizeClassChanged: boolean;
  sizeClass: string;
  private apiServiceURL: string = "";
  public networkType: string;
  public msgcount: any;
  public notcount: any;
  @Input('calEvents') calEvents: any[];
  @Output() afterEventMove = new EventEmitter<any>();
  @Output() onEventTap = new EventEmitter<any>();
  @Output() onEventDoubleTap = new EventEmitter<any>();
  @Output() onEventPress = new EventEmitter<any>();
  public profilePhoto;
  roleId;
  devicewidth: any;
  deviceheight: any;
  eventdetailclass: any;
  calendaradd: any;
  timezoneoffset;
  constructor(private app: App, private conf: Config, public NP: NavParams, public navParams: NavParams, public platform: Platform, public navCtrl: NavController,
    private calendarElement: ElementRef,
    public events: Events, private http: Http, public alertCtrl: AlertController) {
    this.timezoneoffset = localStorage.getItem("timezoneoffset");
    this.roleId = localStorage.getItem("userInfoRoleId");
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        const overlayView = this.app._appRoot._overlayPortal._views[0];
        if (overlayView && overlayView.dismiss) {
          overlayView.dismiss();
        }
        this.navCtrl.setRoot(DashboardPage, {
        });
      });
      this.devicewidth = this.platform.width();
      this.deviceheight = this.platform.height();
    });

    localStorage.setItem("sdate", "");
    let currentDate = new Date();
    this.currentDataHighlights = '';
    this.currentDate = currentDate.getDate();
    this.currentMonth = currentDate.getMonth() + 1;
    if (this.getlength(this.currentMonth) == 1) {
      this.currentMonth = '0' + this.currentMonth;
    } else {
      this.currentMonth = this.currentMonth;
    }
    this.currentYear = currentDate.getFullYear();
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.EVENTVIEWACCESS = localStorage.getItem("CALENDAR_EVENTS_VIEW");
    this.SERVICEEDITACCESS = localStorage.getItem("CALENDAR_SERVICES_EDIT");
    this.EVENTEDITACCESS = localStorage.getItem("CALENDAR_EVENTS_EDIT");
    this.EVENTDELETEACCESS = localStorage.getItem("CALENDAR_EVENTS_DELETE");
    this.ALARMVIEWACCESS = localStorage.getItem("CALENDAR_ALARM_VIEW");
    this.ALARMDELETEACCESS = localStorage.getItem("CALENDAR_ALARM_DELETE");
    this.ALARMEDITACCESS = localStorage.getItem("CALENDAR_ALARM_EDIT");
    this.SERVICEVIEWACCESS = localStorage.getItem("CALENDAR_SERVICES_VIEW");
    this.SERVICEDELETEACCESS = localStorage.getItem("CALENDAR_SERVICES_DELETE");


    this.networkType = '';
    this.apiServiceURL = this.conf.apiBaseURL();
    this.calEvents = [];


    this.profilePhoto = localStorage.getItem

      ("userInfoPhoto");
    if (this.profilePhoto == '' || this.profilePhoto == 'null') {
      this.profilePhoto = this.apiServiceURL + "/images/default.png";
    } else {
      this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
    }




  }
  isNet() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
    }
  }
  ionViewDidLoad() {
    if (this.devicewidth <= 320) {
      this.eventdetailclass = 'event-detail-device-320';
      this.calendaradd = 'calendaradd-320';

    } else {
      this.eventdetailclass = 'event-detail';
      this.calendaradd = 'calendaradd';
    }
    localStorage.setItem("sdate", "");
    this.doNotifiyCount();
  }

  getlength(number) {
    return number.toString().length;
  }

  ngOnInit() {

    this.onLoad = false;

    this.addMissingIds();

    this.ctrl = {
      viewMode: 'month',
      dateSelection: moment(),
      selectedYear: moment().year(),
      selectedMonth: this.months[moment().month()],
      selectedDay: moment().date(),
      monthView: {
        days: [],
        numberOfDaysThisMonth: 0,
        firstDayOfMonth: null,
        lastDayOfMonth: null,
        selectedDate: null
      },
      weekView: {
        days: [],
        firstDayOfWeek: null,
        lastDayOfWeek: null,
        selectedDate: null
      }
    };

    let toStrDte = this.ctrl.dateSelection.toString();

    let calendardaystr = toStrDte.split(" ")[0];
    let calendarmonthstr = toStrDte.split(" ")[1];
    let calendardatestr = toStrDte.split(" ")[2];
    let calendaryearstr = toStrDte.split(" ")[3];


    this.currentDateFormatToday = calendardaystr + " " + calendardatestr + " " + calendarmonthstr + " " + calendaryearstr;
    this.calendarDate = calendardatestr;
    this.calendarYear = calendaryearstr;
    this.calendarMonth = calendarmonthstr;
    let mn = moment().month() + 1;


    if (this.getlength(mn) == 1) {
      this.month = '0' + mn;
    } else {
      this.month = mn;
    }


    if (this.getlength(this.ctrl.selectedDay) == 1) {
      this.date = '0' + this.ctrl.selectedDay
    } else {
      this.date = this.ctrl.selectedDay;
    }

    let currentDate = this.ctrl.selectedYear + "-" + this.month + "-" + this.date;
    localStorage.setItem("eventDate", currentDate);
    this.monthTitle = this.ctrl.selectedMonth;
    this.yearTitle = this.ctrl.selectedYear;
    this.monthstr = this.monthTitle + "-" + this.calendarYear;
    this.defaultDevent(currentDate, this.monthstr);
    this.makeDaysInMonthViewList();
  }

  ngAfterViewInit() {

    this.updateSize();
  }

  addMissingIds() {
    this.calEvents.forEach((d: any) => {
      if (!d.id) {
        d.id = shortid.generate();
      }
    });
  }

  selectDate(date) {
    this.ctrl.dateSelection = date.date;
    this.ctrl.monthView.selectedDate = date;
  }

  monthNum2monthStr(monthNum) {
    return this.months[monthNum];
  };

  monthStr2monthNum(monthStr: string) {
    return this.months.indexOf(monthStr);
  }

  updateMainView = function () {
    if (this.ctrl.viewMode === 'month') {
      this.makeDaysInMonthViewList();
    } else if (this.ctrl.viewMode === 'week') {
      this.makeDaysInWeekViewList();
    }
  }

  plusMonth = function (amount: number) {
    this.calEvents = [];
    this.onLoad = false;
    this.ctrl.dateSelection.add(amount, 'month');
    this.ctrl.selectedMonth = this.monthNum2monthStr(this.ctrl.dateSelection.month());
    let toStrDte = this.ctrl.dateSelection.toString();
    let calendardaystr = toStrDte.split(" ")[0];
    let calendarmonthstr = toStrDte.split(" ")[1];
    let calendardatestr = toStrDte.split(" ")[2];
    let calendaryearstr = toStrDte.split(" ")[3];
    this.currentDateFormatToday = calendardaystr + " " + calendardatestr + " " + calendarmonthstr + " " + calendaryearstr;
    this.calendarDate = calendardatestr;
    this.calendarYear = calendaryearstr;
    this.calendarMonth = calendarmonthstr;
    let mn = moment().month() + 1;

    this.monthTitle = this.ctrl.selectedMonth;
    this.yearTitle = this.ctrl.selectedYear;
    this.monthstr = this.monthTitle + "-" + this.calendarYear;
    if (this.monthTitle == 'May') {
      mn = 5;
    } else if (this.monthTitle == 'January') {
      mn = 1;
    } else if (this.monthTitle == 'March') {
      mn = 3;
    } else if (this.monthTitle == 'April') {
      mn = 4;
    } else if (this.monthTitle == 'February') {
      mn = 2;
    }
    else if (this.monthTitle == 'June') {
      mn = 6;
    }
    else if (this.monthTitle == 'July') {
      mn = 7;
    }
    else if (this.monthTitle == 'August') {
      mn = 8;
    }
    else if (this.monthTitle == 'September') {
      mn = 9;
    }
    else if (this.monthTitle == 'October') {
      mn = 10;
    }
    else if (this.monthTitle == 'November') {
      mn = 11;
    }
    else if (this.monthTitle == 'December') {
      mn = 12;
    }
    let currentDate = this.ctrl.selectedYear + "-" + mn + "-" + this.ctrl.selectedDay;
    this.defaultDevent(currentDate, this.monthstr);
    this.updateMainView();
  }


  setDateSelectionMonth($event) {
    this.makeDaysInMonthViewList();
  }

  makeDaysInMonthViewList() {

    this.ctrl.monthView.numberOfDaysThisMonth = this.ctrl.dateSelection.daysInMonth();
    this.ctrl.monthView.firstDayOfMonth = moment(this.ctrl.dateSelection).startOf('month');
    this.ctrl.monthView.lastDayOfMonth = moment(this.ctrl.dateSelection).endOf('month');
    var firstDayOfMonthAsWeekday = this.ctrl.monthView.firstDayOfMonth.isoWeekday();
    var firstDayInViewOfPreviousMonth = moment(this.ctrl.monthView.firstDayOfMonth).subtract(firstDayOfMonthAsWeekday - 1, 'days');

    var currentDay = moment(firstDayInViewOfPreviousMonth);
    var ctrlObj: any = {
      idx: 0,
      reachedEventListEnd: false,
      pastMaxDate: false,
      maxDate: moment(firstDayInViewOfPreviousMonth).add(42, 'days')
    };
    this.ctrl.monthView.days = [];
    for (var i = 0; i < 42; i++) {
      ctrlObj.currentDay = {
        date: moment(currentDay),
        events: []
      };
      if (!(ctrlObj.reachedEventListEnd || ctrlObj.pastMaxDate)) {
        this.findNextEvent(ctrlObj);
      }

      this.ctrl.monthView.days.push(ctrlObj.currentDay);
      currentDay.add(1, 'days');
    }
    this.ctrl.monthView.days.forEach((d: CalendarDay, idx: number) => {
      this.makeExtensionEvents(d, idx);
    });
  }

  private eventFinishesOnDifferentDay(calEvent: CalendarEvent): boolean {
    return !moment(calEvent.startDate).isSame(calEvent.endDate, 'day');
  }

  private insertDate(elem) {
    var insertAt = null;
    this.calEvents.some((ce: CalendarEvent, idx: number) => {
      if (ce.startDate.getTime() > elem.startDate.getTime()) {
        insertAt = idx;
        return true;
      }
      return false;
    });
    if (insertAt !== null) {
      this.calEvents.splice(insertAt, 0, elem);
    } else {
      this.calEvents.push(elem);
    }
  }

  private makeExtensionEvents(d: CalendarDay, idx: number) {
    if (d.events.length > 0) {
      d.events.forEach((dd: any) => {
        if (dd.isExtension) {
          return;
        }
        dd.isExtension = this.eventFinishesOnDifferentDay(dd);
        dd.extensionMonthViewDayIdxs = [idx];
        var startDateEndOfDay = moment(dd.startDate).endOf('day'),
          endDateEndOfDay = moment(dd.endDate).endOf('day'),
          daysPlus = 0;
        while (startDateEndOfDay.isBefore(endDateEndOfDay) && startDateEndOfDay.isBefore(this.ctrl.monthView.days[this.ctrl.monthView.days.length - 1].date)) {
          daysPlus++;
          dd.extensionMonthViewDayIdxs.push(idx + daysPlus);
          if (this.ctrl.monthView.days[idx + daysPlus].events.indexOf(dd) < 0) {
            this.ctrl.monthView.days[idx + daysPlus].events.push(dd);
          }
          startDateEndOfDay.add(1, 'days');
        }

      });
    }
  }

  findNextEvent(ctrlObj: any) {
    if (typeof this.calEvents === 'undefined') {
      return;
    }
    while (true) {
      if (ctrlObj.idx >= this.calEvents.length) {
        ctrlObj.reachedEventListEnd = true;
        return;
      }
      var stDate = this.calEvents[ctrlObj.idx].startDate.getTime();
      if (stDate > ctrlObj.maxDate.valueOf()) { //plus one day here
        ctrlObj.pastMaxDate = true;
        return;
      }
      if (ctrlObj.currentDay.date.valueOf() > stDate) {
        ctrlObj.idx = ctrlObj.idx + 1;
      } else if (ctrlObj.currentDay.date.valueOf() < stDate) {
        if (stDate > moment(ctrlObj.currentDay.date).add(1, 'days').valueOf()) {
          return;
        }
        // Reset isExtension, which could have been added previously:
        this.calEvents[ctrlObj.idx].isExtension = false;
        this.calEvents[ctrlObj.idx].extensionMonthViewDayIdxs = [];
        ctrlObj.currentDay.events.push(this.calEvents[ctrlObj.idx]);
        ctrlObj.idx = ctrlObj.idx + 1;
      }
    }
  }

  @HostListener('window:resize')
  updateSize() {
    var wkds;
    if (this.calendarElement.nativeElement.clientWidth < 400) {
      wkds = moment.weekdaysMin();
      if (this.sizeClass !== 'extra-small') {
        this.sizeClass = 'extra-small';
        this.sizeClassChanged = true;
      } else {
        this.sizeClassChanged = false;
      }
    } else if (this.calendarElement.nativeElement.clientWidth < 600) {
      wkds = moment.weekdaysShort();
      if (this.sizeClass !== 'small') {
        this.sizeClass = 'small';
        this.sizeClassChanged = true;
      } else {
        this.sizeClassChanged = false;
      }
    } else {
      wkds = moment.weekdays();
      if (this.sizeClass !== '') {
        this.sizeClass = '';
        this.sizeClassChanged = true;
      } else {
        this.sizeClassChanged = false;
      }
    }
    if (this.sizeClassChanged) {
      this.weekDays = wkds;
    }
  }

  tmpTapCount = 0;
  eventOnClick(item: CalendarEvent, $event) {
    $event.srcEvent.stopPropagation(); // <-- Doesn't seem to work
    this.tmpTapCount = $event.tapCount;
    setTimeout(() => {
      if (this.tmpTapCount === 1) {
        if (this.draggingItem === null) {
          this.events.publish('calendar-event:item-tap', item);
          if (typeof item.ontap === 'function') {
            item.ontap(item);
          } else if (this.onEventTap) {
            this.onEventTap.emit(item);
          }
        }
      } else if (this.tmpTapCount === 2) {
        this.events.publish('calendar-event:item-doubletap', item);
        if (typeof item.ondoubletap === 'function') {
          item.ondoubletap(item);
        } else if (this.onEventDoubleTap) {
          this.onEventDoubleTap.emit(item);
        }
      }
      this.tmpTapCount = 0;
    }, 300);
  }

  stopPressPropagation = false;
  eventOnPress(item: CalendarEvent, $event) {
    $event.srcEvent.stopImmediatePropagation();
    $event.srcEvent.stopPropagation();
    this.stopPressPropagation = true;
    setTimeout(() => {
      this.stopPressPropagation = false;
    }, 100);
    if (this.draggingItem === null) {
      this.events.publish('calendar-event:item-press', item);
      if (typeof item.onpress === 'function') {
        item.onpress(item);
      } else if (this.onEventPress) {
        this.onEventPress.emit(item);
      }
    }
  }

  monthDayGridCellOnPress(item: CalendarEvent, $event) {

    $event.srcEvent.stopPropagation();
    if (this.draggingItem === null && this.tmpTapCount === 0 && !this.stopPressPropagation) {
      this.events.publish('calendar-event:month-grid-cell-press - calendar.components', item);
    }
  }

  addCalendarEvent(calEvent: CalendarEvent) {
    if (typeof calEvent.id !== 'string') {
      calEvent.id = shortid.generate();
    }
    this.insertDate(calEvent);
    this.ctrl.monthView.days.some((d: CalendarDay) => {
      if (d.date.isSame(calEvent.startDate, 'day')) {
        d.events.push(calEvent);
        return true;
      }
      return false;
    });
  }



  defaultDevent(currentdate, monthstr) {

    this.highlighteddata = [];


    let urlstr;
    if (this.conf.isUTC() > 0) {
      urlstr = this.apiServiceURL + "/calendarv2?is_mobile=1&loginid=" + this.userId + "&date=" + currentdate + "&month=" + monthstr + "&companyid=" + this.companyId + "" + this.typeStr + "&timezoneoffset=" + this.timezoneoffset;
    } else {
      urlstr = this.apiServiceURL + "/calendarv2?is_mobile=1&loginid=" + this.userId + "&date=" + currentdate + "&month=" + monthstr + "&companyid=" + this.companyId + "" + this.typeStr;

    }
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstr;
    this.conf.presentLoading(1);
    this.http.get(url, options)
      .subscribe((data) => {

        let res = data.json();

        this.eventIdentify = res.events;

        if (res.highlightdots.length > 0) {
          for (let hlgts in res.highlightdots) {
            let splitdatehypen = res.highlightdots[hlgts].date.split("-");
            this.highlighteddata.push({
              date: res.highlightdots[hlgts].date,
              class: res.highlightdots[hlgts].class,
              dte: parseInt(splitdatehypen[2]),
              mne: parseInt(splitdatehypen[1]),
              yrd: splitdatehypen[0],
              cdate: this.currentYear + "-" + this.currentMonth + "-" + this.currentDate
            });
          }

        }
        for (var i = 0; i < this.eventIdentify.length; i += 1) {
          var startTime;
          var endTime;
          var event_date_array = this.eventIdentify[i]['event_date'].split('-');
          var yearstr = event_date_array[0];
          var monthstr = parseInt(event_date_array[1], 10) - 1;
          var datestr = parseInt(event_date_array[2], 10);
          var startMinute = 20;
          var endMinute = 10 + startMinute;
          startTime = new Date(yearstr, monthstr, datestr, 10, 0 + startMinute);
          endTime = new Date(yearstr, monthstr, datestr, 10, 0 + endMinute);
          this.calEvents.push({
            data: {},
            id: this.eventIdentify[i]['event_id'],
            event_id: this.eventIdentify[i]['event_id'],
            startDate: startTime,
            endDate: endTime,
            name: this.eventIdentify[i]['event_title'],
            event_title: this.eventIdentify[i]['event_title'],
            type: 'event',
            event_type: 'E',
            allDay: true,
            event_added_by: this.eventIdentify[i]['event_added_by'],
            icon: 'clock',
            class: 'event',
            iconStyle: { color: 'green' },
            event_date: this.eventIdentify[i]['event_date'],
            style: { color: 'red' },
            eventlength: this.eventIdentify.length,
            event_time: this.eventIdentify[i]['event_time'],
            event_location: this.eventIdentify[i]['event_location'],
            event_remark: this.eventIdentify[i]['event_remark'],
            duration: this.eventIdentify[i]['duration'],
            event_addedby_name: this.eventIdentify[i]['event_addedby_name'],
            event_time_new: this.eventIdentify[i]['service_scheduled_time'],
            calendar_time: this.eventIdentify[i]['created_time']
          });
        }
        this.serviceIdentify = res.services;

        for (var j = 0; j < this.serviceIdentify.length; j += 1) {
          var startTimej;
          var endTimej;
          var service_date_arrayj;

          service_date_arrayj = this.serviceIdentify[j]['next_service_date'];
          if (service_date_arrayj != undefined) {
            var yearstrj = service_date_arrayj[0];
            var monthstrj = parseInt(service_date_arrayj[1], 10) - 1;
            var datestrj = parseInt(service_date_arrayj[2], 10);
            var startMinutej = 20;
            var endMinutej = 10 + startMinutej;
            startTimej = new Date(yearstrj, monthstrj, datestrj, 10, 0 + startMinutej);
            endTimej = new Date(yearstrj, monthstrj, datestrj, 10, 0 + endMinutej);
          }

          let rem_desc = this.serviceIdentify[j]['description'];
          if (rem_desc == '') {
            rem_desc = this.serviceIdentify[j]['service_remark']
          }

          this.calEvents.push({
            data: {},
            id: this.serviceIdentify[j]['service_id'],
            event_id: this.serviceIdentify[j]['service_id'],
            event_date: this.serviceIdentify[j]['next_service_date'],
            startDate: startTimej,
            endDate: endTimej,
            name: this.serviceIdentify[j]['service_subject'],
            event_title: this.serviceIdentify[j]['service_subject'],
            unitname: this.serviceIdentify[j]['unitname'],
            projectname: this.serviceIdentify[j]['unit_project_name'],
            event_unitid: this.serviceIdentify[j]['service_unitid'],
            event_added_by: this.serviceIdentify[j]['event_added_by'],
            duration: this.serviceIdentify[j]['duration'],
            type: 'event',
            allDay: true,
            icon: 'camera',
            event_type: 'S',
            class: 'service',
            iconStyle: { color: 'green' },
            style: { color: 'green' },
            servicelength: this.serviceIdentify.length,
            event_time: this.serviceIdentify[j]['serviced_time'],
            event_remark: rem_desc,
            event_location: this.serviceIdentify[j]['service_location'],
            event_addedby_name: this.serviceIdentify[j]['serviced_by_name'],
            serviced_by: this.serviceIdentify[j]['serviced_by'],
            event_time_new: this.serviceIdentify[j]['service_scheduled_time'],
            calendar_time: this.serviceIdentify[j]['created_time']

          });


        }
        this.alarmIdentity = res.alarms;
        for (var k = 0; k < this.alarmIdentity.length; k += 1) {
          var startTimeAlarm;
          var endTimeAlarm;
          var substrdt = this.alarmIdentity[k]['alarm_received_date'];//.substring(0, 10)'         
          var service_date_arrayk = substrdt.split('-');
          var yearstrk = service_date_arrayk[0];
          var monthstrk = parseInt(service_date_arrayk[1], 10) - 1;
          var datestrk = parseInt(service_date_arrayk[2], 10);
          var startMinuteAlam = 20;
          var endMinuteAlarm = 10 + startMinute;

          startTimeAlarm = new Date(yearstrk, monthstrk, datestrk, 10, 0 + startMinuteAlam);
          endTimeAlarm = new Date(yearstrk, monthstrk, datestrk, 10, 0 + endMinuteAlarm);


          let fls = this.alarmIdentity[k]['alarm_name'].includes('Fls');
          let wrn = this.alarmIdentity[k]['alarm_name'].includes('Wrn');
          let alarm_priority;
          alarm_priority = this.alarmIdentity[k]['alarm_priority']
          if (fls > 0) {
            alarm_priority = 3;
          }
          if (wrn > 0) {
            alarm_priority = 2;
          }


          let eventcolor;
          if (alarm_priority == '1')
            eventcolor = 'trippedcolor';
          if (alarm_priority == '2')
            eventcolor = 'warningcolor';
          if (alarm_priority == '3')
            eventcolor = 'flscolor';
          this.calEvents.push({
            data: {},
            id: this.alarmIdentity[k]['alarm_id'],
            event_id: this.alarmIdentity[k]['alarm_id'],
            startDate: startTimeAlarm,
            endDate: endTimeAlarm,
            event_date: this.alarmIdentity[k]['alarm_received_date'],
            name: this.alarmIdentity[k]['alarm_name'],
            event_title: this.alarmIdentity[k]['alarm_name'],
            unitname: this.alarmIdentity[k]['unitname'],
            projectname: this.alarmIdentity[k]['unit_project_name'],
            type: 'event',
            allDay: true,
            event_type: 'A',
            icon: 'alarm',
            class: 'alarm',
            iconStyle: { color: 'orange' },
            style: { color: 'orange' },
            alarmlength: this.alarmIdentity.length,
            event_remark: this.alarmIdentity[k]['alarm_remark'],
            event_location: this.alarmIdentity[k]['alarm_location'],
            event_addedby_name: this.alarmIdentity[k]['alarm_assginedby_name'],
            alarm_time: this.alarmIdentity[k]['alarm_time'],
            event_time_new: this.alarmIdentity[k]['service_scheduled_time'],
            alarm_priority: this.alarmIdentity[k]['alarm_priority'],
            eventcolor: eventcolor,
            calendar_time: this.alarmIdentity[k]['created_time']

          });


        }


        // If the request was successful notify the user
        if (data.status === 200) {


        }
        // Otherwise let 'em know anyway
        else {

        }
        this.totalCountEventDateWise = this.calEvents.length;
        if (this.totalCountEventDateWise == 0) {
          this.noeventtitle = 'There is no events';
        }
        this.conf.presentLoading(0);
      }, error => {
        this.networkType = this.conf.serverErrMsg();
      });
  }

  doAdd() {
    this.navCtrl.setRoot(AddcalendarPage);
  }

  doCalendarDelete(item, action) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.event_id, action);
          for (let q: number = 0; q < this.calEvents.length; q++) {
            if (this.calEvents[q] == item) {
              this.calEvents.splice(q, 1);
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
  doCalendarEdit(item, type) {
    this.navCtrl.setRoot(AddcalendarPage, {
      item: item,
      type: type
    });
  }

  doCalendarView(event_id, event_type) {
    this.navCtrl.setRoot(EventDetailsPage, {
      event_id: event_id,
      event_type: event_type
    });
  }
  doServiceView(event_id, event_type, eventdata) {
    this.navCtrl.setRoot(EventDetailsServicePage, {
      event_id: event_id,
      event_type: event_type,
      eventdata: eventdata
    });
  }
  doEventView(event_id, event_type, eventdata) {
    this.navCtrl.setRoot(EventDetailsEventPage, {
      event_id: event_id,
      event_type: event_type,
      eventdata: eventdata
    });
  }



  deleteEntry(recordID, deltype) {
    let delactionurl;
    if (deltype == 'Event') {
      delactionurl = "/calendar/" + recordID + "/1/deleteevent";
    } else if (deltype == 'Service') {
      delactionurl = "/calendar/" + recordID + "/1/deleteservice";

    } else if (deltype == 'Alarm') {
      delactionurl = "/calendar/" + recordID + "/1/deletealarm";
    }
    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + delactionurl;
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          if (deltype == 'Event') {
            //this.conf.sendNotification(`Event was successfully deleted`);
            this.conf.sendNotification(data.json().msg[0]['result']);
          }
          if (deltype == 'Service') {
            // this.conf.sendNotification(`Service was successfully deleted`);
            this.conf.sendNotification(data.json().msg[0]['result']);
          }
          if (deltype == 'Alarm') {
            // this.conf.sendNotification(`Alarm was successfully deleted`);
            this.conf.sendNotification(data.json().msg[0]['result']);
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


  onTimeSelected(year, month, date, ev) {
    this.onLoad = true;
    this.currentDate = date;
    this.currentYear = year;
    this.currentMonth = month;


    this.currentCalendarDate = ev;
    this.calendarResultAll = [];
    this.calendarResultService = [];
    this.calendarResultEvent = [];
    this.calendarResultAlarm = [];
    let dateStr;
    let typeStr;

    if (ev != '') {

      this.petselection = '';
      this.calendarResultAll = [];
      this.calendarResultService = [];
      this.calendarResultEvent = [];
      this.calendarResultAlarm = [];


      if (ev.selectedTime == undefined) {

        month = month
        date = date;
      } else {

        month = month;
        year = year;
        date = date;
      }

      if (this.getlength(month) == 1) {
        month = '0' + month;
      } else {
        month = month;
      }


      if (this.getlength(date) == 1) {
        date = '0' + date
      } else {
        date = date;
      }

      dateStr = "&date=" + year + "-" + month + "-" + date;
      typeStr = '';
      this.typeStr = '';
      if (this.pet == 'ALL') {
        typeStr = '&type=all';
        this.typeStr = typeStr;
      } else if (this.pet == 'SERVICE') {
        typeStr = '&type=service';
        this.typeStr = typeStr;
      } else if (this.pet == 'EVENT') {
        typeStr = '&type=event';
        this.typeStr = typeStr;
      } else if (this.pet == 'ALARM') {
        typeStr = '&type=alarm';
        this.typeStr = typeStr;
      }

    } else {
      // dateStr = "";
      dateStr = "&date=" + year + "-" + month + "-" + date;
      if (this.pet == 'ALL') {
        typeStr = '&type=all';
      } else if (this.pet == 'SERVICE') {
        typeStr = '&type=service';
      } else if (this.pet == 'EVENT') {
        typeStr = '&type=event';
      } else if (this.pet == 'ALARM') {
        typeStr = '&type=alarm';
      }
      this.typeStr = typeStr;
      this.defaultDevent('', this.monthstr);
    }



    let urlstr;
    if (this.conf.isUTC() > 0) {
      urlstr = this.apiServiceURL + "/calendarv2?is_mobile=1&loginid=" + this.userId + "&companyid=" + this.companyId + "" + dateStr + "&month=" + this.monthstr + "" + typeStr+ "&timezoneoffset=" + this.timezoneoffset;;
    } else {
      urlstr = this.apiServiceURL + "/calendarv2?is_mobile=1&loginid=" + this.userId + "&companyid=" + this.companyId + "" + dateStr + "&month=" + this.monthstr + "" + typeStr;
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstr;
    this.conf.presentLoading(1)
    this.http.get(url, options)
      .subscribe((data) => {

        let currentDateArr = new Date();
        let cmonth = currentDateArr.getMonth() + 1;
        let mnstr;
        let dtstr;
        if (cmonth > 9) {
          cmonth = cmonth;
          mnstr = '';

        } else {
          cmonth = cmonth;
          mnstr = '0';

        }

        if (currentDateArr.getDate() > 9) {
          dtstr = '';
        } else {
          dtstr = '0';

        }



        let curDate = currentDateArr.getFullYear() + "-" + mnstr + cmonth + "-" + dtstr + currentDateArr.getDate();

        let months = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December' };

        let selDate = year + "-" + month + "-" + date;
        if (selDate == '--') {
          localStorage.setItem("eventDate", curDate);
        } else {
          localStorage.setItem("eventDate", selDate);
        }

        let selectdate = year + "-" + month + "-" + date;
        if (year != undefined)
          this.dateHeaderTitle = months[month] + " " + year;
        if (ev != '') {
          localStorage.setItem("sdate", selectdate);
        } else {
        }
        this.calendarResultEvent = [];
        if (this.petselection == 'ALL') {

          this.doCalendarResult(data, 0, 0, 0, 'all')
        } else if (this.petselection == 'SERVICE') {
          this.doCalendarResult(data, 0, 0, 0, 'service');//JsonData,Event,Service,Alarm
        } else if (this.petselection == 'EVENT') {
          this.doCalendarResult(data, 0, 0, 0, 'event');//JsonData,Event,Service,Alarm
        } else if (this.petselection == 'ALARM') {
          this.doCalendarResult(data, 0, 0, 0, 'alarm');//JsonData,Event,Service,Alarm
        } else {
          if (ev != '') {
            this.doCalendarResult(data, 1, 1, 1, '')//JsonData,Event,Service,Alarm
          }

        }

        let cdateform = this.currentDateFormatToday.split(" ");
        let weekdayname = this.getDayOfWeek(selectdate);
        if (curDate == selDate) {
          if (this.totalCountEventDateWise > 0) {
            this.daySession = this.totalCountEventDateWise + ' upcoming Event today';
          }

          if (this.calEvents.length > 0) {
            this.daySession = this.totalCountEventDateWise + ' upcoming Event today';
          }

          this.currentDateFormatToday = weekdayname.substr(0, 3) + " " + date + " " + cdateform[2] + " " + cdateform[3];
        } else {
          this.daySession = '';
          this.currentDateFormatToday = "" + weekdayname.substr(0, 3) + " " + date + " " + cdateform[2] + " " + cdateform[3];
        }
        this.conf.presentLoading(0)
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });


  }
  getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }
  doCalendarResult(data, event, service, alarm, type) {//JsonData,Event,Service,Alarm
    this.serviceIdentify = [];
    this.eventIdentify = [];
    this.alarmIdentity = [];

    this.eventIdentify = data.json().events;
    for (var i = 0; i < this.eventIdentify.length; i += 1) {

      this.calendarResultEvent.push({
        event_id: this.eventIdentify[i]['event_id'],
        event_title: this.eventIdentify[i]['event_title'],
        event_date: this.eventIdentify[i]['event_date'],
        event_time: this.eventIdentify[i]['event_time'],
        event_location: this.eventIdentify[i]['event_location'],
        event_remark: this.eventIdentify[i]['event_remark'],
        event_addedby_name: this.eventIdentify[i]['event_addedby_name'],
        formatted_datetime: this.eventIdentify[i]['formatted_datetime'],
        event_time_new: this.eventIdentify[i]['service_scheduled_time'],
        event_added_by: this.eventIdentify[i]['event_added_by'],
        duration: this.eventIdentify[i]['duration'],
        calendar_time: this.eventIdentify[i]['created_time'],
        event_type: 'E',
        icon: 'alarm', // Icon of the alert. This is compulsory when using the 
        // calendar on small screens, as the name of the event will
        // not be displayed in the month grid. It has to be a valid
        // IonicIcons icon name.
        class: 'eventclass', // Class of the item in the month grid cell
        iconStyle: { color: 'green' } // Style for the item's icon
        //style: { color: 'red' }, // Style for the item
      });
    }


    this.serviceIdentify = data.json().services;
    for (var j = 0; j < this.serviceIdentify.length; j += 1) {
      let eventdate;



      eventdate = this.serviceIdentify[j]['next_service_date'];


      let rem_desc = this.serviceIdentify[j]['description'];
      if (rem_desc == '') {
        rem_desc = this.serviceIdentify[j]['service_remark']
      }
      this.calendarResultEvent.push({
        event_id: this.serviceIdentify[j]['service_id'],
        event_title: this.serviceIdentify[j]['service_subject'],
        event_unitid: this.serviceIdentify[j]['service_unitid'],
        unitname: this.serviceIdentify[j]['unitname'],
        projectname: this.serviceIdentify[j]['unit_project_name'],
        event_date: this.serviceIdentify[j]['next_service_date'],
        event_time: this.serviceIdentify[j]['serviced_time'],
        event_added_by: this.serviceIdentify[j]['event_added_by'],
        event_remark: rem_desc,
        event_location: this.serviceIdentify[j]['service_location'],
        event_addedby_name: this.serviceIdentify[j]['serviced_by_name'],
        serviced_by: this.serviceIdentify[j]['serviced_by'],
        formatted_datetime: this.serviceIdentify[j]['formatted_datetime'],
        event_time_new: this.serviceIdentify[j]['service_scheduled_time'],
        duration: this.serviceIdentify[j]['duration'],
        calendar_time: this.serviceIdentify[j]['created_time'],
        event_type: 'S',
        icon: 'service',
        class: 'service'
      });


    }

    this.alarmIdentity = data.json().alarms;
    for (var k = 0; k < this.alarmIdentity.length; k += 1) {
      let tme = this.alarmIdentity[k]['formatted_datetime'].substr(12, 10);
      //"05 Dec 2017 03:43 PM"
      // let tmepm = tme.substr(5,4) + " " + tme.substr(10, 2);
      let tmepm = tme;
      let fls = this.alarmIdentity[k]['alarm_name'].includes('Fls');
      let wrn = this.alarmIdentity[k]['alarm_name'].includes('Wrn');
      let alarm_priority;
      alarm_priority = this.alarmIdentity[k]['alarm_priority']
      if (fls > 0) {
        alarm_priority = 3;
      }
      if (wrn > 0) {
        alarm_priority = 2;
      }


      let eventcolor;
      if (alarm_priority == '1')
        eventcolor = 'trippedcolor';
      if (alarm_priority == '2')
        eventcolor = 'warningcolor';
      if (alarm_priority == '3')
        eventcolor = 'flscolor';

      this.calendarResultEvent.push({

        event_id: this.alarmIdentity[k]['alarm_id'],
        event_title: this.alarmIdentity[k]['alarm_name'],
        event_unitid: this.alarmIdentity[k]['alarm_unit_id'],
        event_date: this.alarmIdentity[k]['alarm_received_date'],
        unitname: this.alarmIdentity[k]['unitname'],
        projectname: this.alarmIdentity[k]['unit_project_name'],
        event_remark: this.alarmIdentity[k]['alarm_remark'],
        event_location: this.alarmIdentity[k]['alarm_location'],
        event_addedby_name: this.alarmIdentity[k]['alarm_assginedby_name'],
        event_t: this.alarmIdentity[k]['date_time'],
        formatted_datetime: tmepm,
        event_time_new: this.alarmIdentity[k]['service_scheduled_time'],
        alarm_time: this.alarmIdentity[k]['alarm_time'],
        calendar_time: this.alarmIdentity[k]['created_time'],
        alarm_priority: this.alarmIdentity[k]['alarm_priority'],
        eventcolor: eventcolor,
        event_type: 'A',
        icon: 'event',
        class: 'event'
      });


    }
    this.totalCountEventDateWise = this.calendarResultEvent.length;
    if (this.totalCountEventDateWise == 0) {
      this.noeventtitle = 'There is no events';
    }
    //this.makeDaysInMonthViewList();
  }


  /**********************************/
  /* Dropdown Filter onchange event */
  /**********************************/
  onSegmentChanged(val) {
    this.calEvents = [];
    this.noeventtitle = '';
    this.calendarResultEvent = [];
    this.calendarResultAll = [];
    this.calendarResultService = [];
    this.calendarResultAlarm = [];
    if (val == "ALL") {
      this.calendarResultAll = [];
      this.petselection = 'ALL';
      this.allselected = true;
      this.pet = 'ALL';

    } else if (val == "SERVICE") {
      this.serviceselected = true;
      this.calendarResultService = [];
      this.petselection = 'SERVICE';
      this.pet = 'SERVICE';
    } else if (val == "EVENT") {

      this.eventsselected = true;
      this.calendarResultEvent = [];
      this.petselection = 'EVENT';
      this.pet = 'EVENT';
    } else if (val == "ALARM") {
      this.alarmselected = true;
      this.calendarResultAlarm = [];
      this.petselection = 'ALARM';
      this.pet = 'ALARM';
    } else {
      this.pet = '';
    }

    this.ctrl = {
      viewMode: 'month',
      dateSelection: moment(),
      selectedYear: moment().year(),
      selectedMonth: this.months[moment().month()],
      selectedDay: moment().date(),
      monthView: {
        days: [],
        numberOfDaysThisMonth: 0,
        firstDayOfMonth: null,
        lastDayOfMonth: null,
        selectedDate: null
      },
      weekView: {
        days: [],
        firstDayOfWeek: null,
        lastDayOfWeek: null,
        selectedDate: null
      }
    };
    let mn = moment().month() + 1;


    if (this.getlength(mn) == 1) {
      this.month = '0' + mn;
    } else {
      this.month = mn;
    }


    if (this.getlength(this.ctrl.selectedDay) == 1) {
      this.date = '0' + this.ctrl.selectedDay
    } else {
      this.date = this.ctrl.selectedDay;
    }

    let currentDate = this.ctrl.selectedYear + "-" + this.month + "-" + this.date;

    //let selDate = currentDate;

    this.onTimeSelected(this.ctrl.selectedYear, this.month, this.date, '');


    localStorage.setItem("eventDate", currentDate);
  }


  swipeopensliding(slidingItem: ItemSliding) {

    slidingItem.getOpenAmount();

  }
  // List page navigate to notification list
  notification() {

    // Navigate the notification list page
    this.navCtrl.setRoot(NotificationPage);
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

      });
    // Notiifcation count
  }



  doServiceDelete(item) {

    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntryService(item.event_id);
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }

  deleteEntryService(recordID) {
    let delactionurl;
    delactionurl = "/calendar/" + recordID + "/1/deleteservice";
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + delactionurl;
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          // this.conf.sendNotification(`Service was successfully deleted`);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.navCtrl.setRoot(CalendarPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });
  }
  addCalendar(item, event_type) {
    if (event_type == 'S') {
      event_type = 'service';
      this.navCtrl.setRoot(AddcalendarPage,
        {
          from: 'event-detail-service',
          item: item,
          // item: this.NP.get("eventdata"),
          type: event_type,
          service_id: item.event_id
        });
    }
    if (event_type == 'E') {
      event_type = 'event';
      this.navCtrl.setRoot(AddcalendarPage,
        {
          from: 'event-detail-service',
          item: item,
          // item: this.NP.get("eventdata"),
          type: event_type,
          event_id: item.event_id
        });
    }

  }


  doEditAlarm(item, act) {
    console.log(JSON.stringify(item));
    console.log(item.event_addedby_name);
    console.log(act);
    if (item.event_addedby_name == '') {
      if (act == 'edit') {
        this.navCtrl.setRoot(AddalarmPage, {
          record: item,
          act: act,
          from: 'alarm',
          unitid: item.alarm_unit_id
        });
      }
    }
    else {
      this.conf.sendNotification("Alarm already assigned");
    }
  }



  doEventDelete(item) {
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntryEvent(item.event_id);
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }

  deleteEntryEvent(recordID) {
    let delactionurl;
    delactionurl = "/calendar/" + recordID + "/1/deleteevent";

    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + delactionurl;
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`Event was successfully deleted`);
          this.conf.sendNotification(data.json().msg[0]['result']);
          this.navCtrl.setRoot(CalendarPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
      });
  }

}


import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MenuPage } from "../pages/menu/menu";
import { MyApp } from './app.component';
import { LoginPage } from "../pages/login/login";
import { DashboardPage } from "../pages/dashboard/dashboard";
import { NotificationPage } from "../pages/notification/notification";
import { MessagesPage } from "../pages/messages/messages";
import { ComposePage } from "../pages/compose/compose";
import { HttpModule } from '@angular/http';
import { AddcalendarPage } from "../pages/addcalendar/addcalendar";
import { DragulaModule } from "ng2-dragula/ng2-dragula"
//import { AlarmdetailsPage } from '../pages/alarmdetails/alarmdetails';
import { TabsPage } from "../pages/tabs/tabs";
import { UnitsPage } from "../pages/units/units";
import { CalendarPage } from "../pages/calendar/calendar";
import { OrgchartPage } from "../pages/orgchart/orgchart";
import { ReportsPage } from "../pages/reports/reports";
import { MessagedetailPage } from '../pages/messagedetail/messagedetail';
import { UnitdetailsPage } from '../pages/unitdetails/unitdetails';
import { ServicinginfoPage } from '../pages/servicinginfo/servicinginfo';
import { AddserviceinfoPage } from '../pages/addserviceinfo/addserviceinfo';
import { AlarmlogPage } from '../pages/alarmlog/alarmlog';
import { AlarmPage } from '../pages/alarm/alarm';
import { AddalarmPage } from '../pages/addalarm/addalarm';
import { AddalarmlistPage } from '../pages/addalarmlist/addalarmlist';
import { AddunitsonePage } from '../pages/addunitsone/addunitsone';
import { AttentionPage } from '../pages/attention/attention';
import { CommentsinfoPage } from "../pages/commentsinfo/commentsinfo";
import { AddhocPage } from "../pages/addhoc/addhoc";
import { ServicedetailsPage } from "../pages/servicedetails/servicedetails";
import { PopoverPage } from '../pages/popover/popover';
import { AddUnitPage } from "../pages/add-unit/add-unit";
import { PiclocationPage } from "../pages/piclocation/piclocation";
//import { AlarmLogPage } from "../pages/alarm-log/alarm-log";
import { UnitDetailsPage } from '../pages/unit-details/unit-details';
//import { EventDetailsPage } from '../pages/calendardetail/calendardetail';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { NotificationSettingsPage } from '../pages/notification-settings/notification-settings';
import { EventDetailsServicePage } from '../pages/event-details-service/event-details-service';
import { EventDetailsEventPage } from '../pages/event-details-event/event-details-event';
//import { AlarmListPage } from '../pages/alarm-list/alarm-list';

import { AlarmlogdetailsPage } from '../pages/alarmlogdetails/alarmlogdetails';
import { EnginedetailviewPage } from '../pages/enginedetailview/enginedetailview';
import { ServicingDetailsPage } from '../pages/servicing-details/servicing-details';
import { AddrequestsupportPage } from '../pages/addrequestsupport/addrequestsupport';
import { PreviewanddownloadPage } from '../pages/previewanddownload/previewanddownload';
import { TrendlinePage } from '../pages/trendline/trendline';
import { AddcommentsinfoPage } from '../pages/addcommentsinfo/addcommentsinfo';
import { CommentdetailsPage } from '../pages/commentdetails/commentdetails';
import { MessageDetailViewPage } from '../pages/message-detail-view/message-detail-view';
import { MsgPopoverPage } from '../pages/msgpopover/msgpopover';
import { NativeStorage } from '@ionic-native/native-storage';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { EditprofilesteponePage } from '../pages/editprofilestepone/editprofilestepone';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { UnitdetailgraphPage } from '../pages/unitdetailgraph/unitdetailgraph';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { UnitgroupPage } from '../pages/unitgroup/unitgroup';
import { EnginedetailPage } from '../pages/enginedetail/enginedetail';
import { UserPage } from '../pages/user/user';
import { CompanygroupPage } from '../pages/companygroup/companygroup';
import { RolePage } from '../pages/role/role';
import { AddunitgroupPage } from '../pages/addunitgroup/addunitgroup';
import { AddenginedetailPage } from '../pages/addenginedetail/addenginedetail';
import { AddcompanygroupPage } from '../pages/addcompanygroup/addcompanygroup';
import { ReporttemplatePage } from '../pages/reporttemplate/reporttemplate';
import { AddreporttemplatePage } from '../pages/addreporttemplate/addreporttemplate';
import { AddrolePage } from '../pages/addrole/addrole';
import { AdduserPage } from '../pages/adduser/adduser';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
//import { ReporttemplatedetailPage } from '../pages/reporttemplatedetail/reporttemplatedetail';

//import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { ReportviewtablePage } from '../pages/reportviewtable/reportviewtable';
import { Config } from '../config/config';
import { CompanydetailPage } from '../pages/companydetail/companydetail';
import { EngineviewPage } from '../pages/engineview/engineview';

import { AddorgchartonePage } from '../pages/addorgchartone/addorgchartone';

@NgModule({
  declarations: [  
    AddorgchartonePage,
    CompanydetailPage,
    ReportviewtablePage, 
    AdduserPage,
    AddreporttemplatePage,
    ReporttemplatePage,
    AddcompanygroupPage,
    RolePage,
    AddenginedetailPage,
    AddunitgroupPage,
    CompanygroupPage,
    UserPage,
    UnitgroupPage,
    EnginedetailPage,
    MyApp,
    UnitdetailgraphPage,
    AddUnitPage,
    MenuPage,
    EventDetailsPage,
    LoginPage,
    DashboardPage,
    NotificationPage,
    MessagesPage,
    ComposePage,
    CalendarPage,
    AddcalendarPage,
    PiclocationPage,
    ForgotpasswordPage,
    EventDetailsServicePage,
    MessagesPage,
    TabsPage,
    UnitsPage,
    CalendarPage,
    OrgchartPage,
    ReportsPage,
    ComposePage,
    MessagedetailPage,
    UnitdetailsPage,
    UnitDetailsPage,
    ServicinginfoPage,
    AddserviceinfoPage,
    AlarmlogPage,
    AlarmPage,
    AddalarmPage,
    AddalarmlistPage,
    AddunitsonePage,
    AttentionPage,
    CommentsinfoPage,
    AddhocPage,
    ServicedetailsPage,
    PopoverPage,
    NotificationSettingsPage,
    EventDetailsEventPage,
    EnginedetailviewPage,
    AlarmlogdetailsPage,
    ServicingDetailsPage,
    AddrequestsupportPage,
    PreviewanddownloadPage,
    TrendlinePage,
    AddcommentsinfoPage,
    CommentdetailsPage,
    MessageDetailViewPage,
    MsgPopoverPage,
    MyaccountPage,
    EditprofilesteponePage,
    AddrolePage,
	ChangepasswordPage,
	//ReporttemplatedetailPage,
  //  ChangepasswordPage,
  
    EngineviewPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DragulaModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        android: {
          tabsPlacement: 'bottom',
          tabsHideOnSubPages: false,
          tabsHighlight: true,
          scrollAssist: true,
          autoFocusAssist: false,
          scrollPadding: false
        }
      }
    },
    )],
  bootstrap: [IonicApp],
  entryComponents: [
    AddorgchartonePage,
    ReportviewtablePage, 
    CompanydetailPage,   
    AddrolePage,
    AdduserPage,
    AddreporttemplatePage,
    ReporttemplatePage,
    AddenginedetailPage,
    AddcompanygroupPage,
    RolePage,
    AddunitgroupPage,
    CompanygroupPage,
    UserPage,
    EnginedetailPage,
    MyApp,
    UnitgroupPage,
    UnitdetailgraphPage,
    AddUnitPage,
    MenuPage,
    EventDetailsPage,
    LoginPage,
    DashboardPage,
    NotificationPage,
    MessagesPage,
    PiclocationPage,
    ComposePage,
    CalendarPage,
    AddcalendarPage,
    EventDetailsServicePage,
    TabsPage,
    UnitsPage,
    CalendarPage,
    OrgchartPage,
    ReportsPage,
    ComposePage,
    MessagedetailPage,
    UnitdetailsPage,
    UnitDetailsPage,
    ServicinginfoPage,
    AddserviceinfoPage,
    AlarmlogPage,
    AlarmPage,
    AddalarmPage,
    AddalarmlistPage,
    AddunitsonePage,
    AttentionPage,
    ForgotpasswordPage,
    CommentsinfoPage,
    AddhocPage,
    ServicedetailsPage,
    PopoverPage,
    NotificationSettingsPage,
    EventDetailsEventPage,
    EnginedetailviewPage,
    AlarmlogdetailsPage,
    ServicingDetailsPage,
    AddrequestsupportPage,
    PreviewanddownloadPage,
    TrendlinePage,
    AddcommentsinfoPage,
    CommentdetailsPage,
    MessageDetailViewPage,
    MsgPopoverPage,
    MyaccountPage,
    EditprofilesteponePage,

	ChangepasswordPage,
	//ReporttemplatedetailPage,
    //ChangepasswordPage
    
    EngineviewPage
  ],
  providers: [
    Config,
    StatusBar,
    SplashScreen,
    NativeStorage,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataServiceProvider
  ]
})
export class AppModule {
}



import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { LoginPage } from "../pages/login/login";
import { DashboardPage } from "../pages/dashboard/dashboard";
import { NotificationPage } from "../pages/notification/notification";
import { MessagesPage } from "../pages/messages/messages";
import { ComposePage } from "../pages/compose/compose";
import { HttpModule } from '@angular/http';
import { AddcalendarPage } from "../pages/addcalendar/addcalendar";
import { DragulaModule } from "ng2-dragula/ng2-dragula"
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
import { CommentsinfoPage } from "../pages/commentsinfo/commentsinfo";
import { AddhocPage } from "../pages/addhoc/addhoc";
import { ServicedetailsPage } from "../pages/servicedetails/servicedetails";
import { PopoverPage } from '../pages/popover/popover';
import { AddUnitPage } from "../pages/add-unit/add-unit";
import { EventDetailsPage } from '../pages/event-details/event-details';
import { NotificationSettingsPage } from '../pages/notification-settings/notification-settings';
import { EventDetailsServicePage } from '../pages/event-details-service/event-details-service';
import { EventDetailsEventPage } from '../pages/event-details-event/event-details-event';
import { AlarmlogdetailsPage } from '../pages/alarmlogdetails/alarmlogdetails';
import { EnginedetailviewPage } from '../pages/enginedetailview/enginedetailview';
import { ServicingDetailsPage } from '../pages/servicing-details/servicing-details';
import { AddrequestsupportPage } from '../pages/addrequestsupport/addrequestsupport';
import { PreviewanddownloadPage } from '../pages/previewanddownload/previewanddownload';
import { TrendlinePage } from '../pages/trendline/trendline';
import { AddcommentsinfoPage } from '../pages/addcommentsinfo/addcommentsinfo';
import { CommentdetailsPage } from '../pages/commentdetails/commentdetails';
import { MessageDetailViewPage } from '../pages/message-detail-view/message-detail-view';
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
import { ReportviewtablePage } from '../pages/reportviewtable/reportviewtable';
import { Config } from '../config/config';
import { CompanydetailPage } from '../pages/companydetail/companydetail';
import { EngineviewPage } from '../pages/engineview/engineview';
import { AddorgchartonePage } from '../pages/addorgchartone/addorgchartone';
import { RequestdenyoPage } from '../pages/requestdenyo/requestdenyo';
import { ReportviewPage } from '../pages/reportview/reportview';
import { MapPage } from '../pages/map/map';
import { Network } from '@ionic-native/network';
import { ModalPage } from '../pages/modal/modal';
import { PopovercolorcodePage } from '../pages/popovercolorcode/popovercolorcode';
import { PopoverchoosecolorPage } from '../pages/popoverchoosecolor/popoverchoosecolor';
import { Unitgrouplist } from '../pages/unitgrouplist/unitgrouplist';
import { ReporttemplatedetailPage } from '../pages/reporttemplatedetail/reporttemplatedetail';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { Push } from '@ionic-native/push';
import { PermissionPage } from '../pages/permission/permission';
import { LongPressModule } from 'ionic-long-press';
import { ViewunitPage } from '../pages/viewunit/viewunit';
import { PaginatePage } from '../pages/paginate/paginate';
import { MockProvider } from '../providers/pagination/pagination';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { DatePicker } from '@ionic-native/date-picker';
import { Crop } from '@ionic-native/crop';
import { NetworkProvider } from '../providers/network/network';
@NgModule({
  declarations: [
    PermissionPage,
    ProgressBarComponent,
    ReporttemplatedetailPage,
    Unitgrouplist,
    PopovercolorcodePage,
    ModalPage,
    MapPage,
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
    EventDetailsPage,
    LoginPage,
    DashboardPage,
    NotificationPage,
    MessagesPage,
    ComposePage,
    CalendarPage,
    AddcalendarPage,
    //PiclocationPage,
    ForgotpasswordPage,
    EventDetailsServicePage,
    MessagesPage,
    //TabsPage,
    UnitsPage,
    CalendarPage,
    OrgchartPage,
    ReportsPage,
    ComposePage,
    MessagedetailPage,
    UnitdetailsPage,
    //UnitDetailsPage,
    ServicinginfoPage,
    AddserviceinfoPage,
    AlarmlogPage,
    AlarmPage,
    AddalarmPage,
    AddalarmlistPage,
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
    //MsgPopoverPage,
    MyaccountPage,
    EditprofilesteponePage,
    AddrolePage,
    RequestdenyoPage,
    ChangepasswordPage,
    ReportviewPage,
    EngineviewPage,
    PopoverchoosecolorPage,
    ViewunitPage,
    PaginatePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DragulaModule,
    LongPressModule,
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
    })],
  bootstrap: [IonicApp],
  entryComponents: [
    PermissionPage,
    ProgressBarComponent,
    ReporttemplatedetailPage,
    Unitgrouplist,
    PopovercolorcodePage,
    ModalPage,
    MapPage,
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
    EventDetailsPage,
    LoginPage,
    DashboardPage,
    NotificationPage,
    MessagesPage,
    //PiclocationPage,
    ComposePage,
    CalendarPage,
    AddcalendarPage,
    EventDetailsServicePage,
    //TabsPage,
    UnitsPage,
    CalendarPage,
    OrgchartPage,
    ReportsPage,
    ComposePage,
    MessagedetailPage,
    UnitdetailsPage,
    //UnitDetailsPage,
    ServicinginfoPage,
    AddserviceinfoPage,
    AlarmlogPage,
    AlarmPage,
    AddalarmPage,
    AddalarmlistPage,
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
    //MsgPopoverPage,
    MyaccountPage,
    EditprofilesteponePage,
    RequestdenyoPage,
    ChangepasswordPage,
    ReportviewPage,
    EngineviewPage,
    PopoverchoosecolorPage,
    ViewunitPage,
    PaginatePage
  ],
  providers: [
    Config,
    StatusBar,
    SplashScreen,
    NativeStorage,
    Network,
    FileOpener,
    FileTransfer,
    File,
    FilePath,
    Base64,
    DocumentViewer,
    MockProvider,
    Push,
    Camera,
    FileChooser,
    DatePicker,
    Crop,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataServiceProvider,
    NetworkProvider
  ]
})
export class AppModule {
}



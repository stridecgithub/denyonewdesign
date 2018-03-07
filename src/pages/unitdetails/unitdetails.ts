import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, ModalController } from 'ionic-angular';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
import { AlarmlogPage } from '../alarmlog/alarmlog';
import { AlarmPage } from '../alarm/alarm';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { Config } from '../../config/config';
import { EnginedetailviewPage } from '../enginedetailview/enginedetailview';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { AddUnitPage } from "../add-unit/add-unit";
import { UnitdetailgraphPage } from "../unitdetailgraph/unitdetailgraph";
import { ModalPage } from '../modal/modal';
import * as $ from 'jquery';
declare var jQuery: any;
declare var Gauge: any;
declare var jqLinearGauge: any;
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";

/**
 * Generated class for the UnitdetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
	selector: 'page-unitdetails',
	templateUrl: 'unitdetails.html',
	providers: [Config]
})
export class UnitdetailsPage {
	private tick: any;
	private subscription: Subscription;
	public footerBar = [];
	public pageTitle: string;
	//public userId: any;
	public item = [];
	public setpointsdata = [];
	public rangesdata = [];
	voltlabel;
	voltcolors;
	currentlabel;
	currentcolors;
	frequencylabel;
	frequencycolors;
	enginespeedlabel
	enginespeedcolors;
	fuellabel;
	fuelcolors;
	loadpowerlabel;
	loadpowercolors;
	coolantlabel;
	coolantcolors;
	coolantbarlabels;
	needlevalue;
	batteryvoltbarlabels;
	oilperssuerbarlabels;
	rolePermissionMsg;
	oilpressuerlabel;
	oilpressuercolors;
	batteryvoltlabel;
	batteryvoltcolors;
	public colorListArr = [];
	public voltsetpointslabel = [];
	iframeContent: any;
	iframeContent1: any;
	iframeContent2: any;
	tabview1: any;
	tabview2: any;
	private apiServiceURL: string = "";
	public networkType: string;
	volt1;
	volt2;
	volt3;
	current1;
	current2;
	current3;
	freq;
	enginespeed;
	timerswitch;
	fuellevel;
	loadpower;
	coolanttemp;
	oilpressure;
	loadpowerfactor;
	batteryvoltage;
	commstatus;
	enginestatus;
	unitfavorite;
	startbtn;
	stopbtn;
	public startbtnenable: boolean = false;
	public stopbtnenable: boolean = false;
	public alarmviewenable: boolean = false;
	public serviceviewenable: boolean = false;
	public commentviewenable: boolean = false;
	public engineviewenable: boolean = false;
	alarmstatus;
	voltguagelabel;
	voltguagecolors;
	controllermode;
	controlleroffmode;
	controllerautomode;
	controllermanmode;
	runninghrs;
	enginestatuscolor;
	commstatuscolor;
	selectedvoltage;
	selectedcurrent;
	selectedfrequency;
	selectedenginespeed;
	selectedfuel;
	selectedloadpower;
	public serviceCount;
	public commentCount;
	public msgcount: any;
	public notcount: any;
	public chk: any;

	public tabs: string = 'overView';

	public unitDetailData: any = {
		unit_id: '',
		unitname: '',
		unitnameellipse: '',
		location: '',
		projectname: '',
		colorcode: '',
		gen_status: '',
		nextservicedate: '',
		alarmnotificationto: '',
		favoriteindication: '',
		userId: '',
		loginas: '',
		htmlContent: '',
		lat: '',
		lng: '',
		iframeURL: '',
		companygroup_name: '',
		runninghr: '',
		controllerid: '',
		neaplateno: '',
		generatormodel: '',
		serial_number: '',
		contactpersonal: '',
		contactnumber: '',
		contacts: ''
	}
	public profilePhoto;
	nextservicedate;
	url1;
	url;
	l1l2l3voltagelablel;
	voltageselection;
	l1l2l3currentlablel;
	currentselection;
	genkey;
	public COMMENTVIEWACCESS: any;
	public SERVICEVIEWACCESS: any;
	public ALARMVIEWACCESS: any;
	public ENGINEDETAILVIEWACCESS: any;
	constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, private conf: Config, public platform: Platform, public http: Http, private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams) {
		this.unitDetailData.loginas = localStorage.getItem("userInfoName");
		this.unitDetailData.userId = localStorage.getItem("userInfoId");

		this.ENGINEDETAILVIEWACCESS = localStorage.getItem("UNITS_ENGINEMODEL_VIEW");
		if (this.ENGINEDETAILVIEWACCESS == 1) {
			this.engineviewenable = false;
		} else {
			this.engineviewenable = true;
		}


		this.COMMENTVIEWACCESS = localStorage.getItem("UNITS_COMMENTS_VIEW");
		if (this.COMMENTVIEWACCESS == 1) {
			this.commentviewenable = false;
		} else {
			this.commentviewenable = true;
		}
		this.SERVICEVIEWACCESS = localStorage.getItem("UNITS_SERVICINGINFO_VIEW");

		if (this.SERVICEVIEWACCESS == 1) {
			this.serviceviewenable = false;
		} else {
			this.serviceviewenable = true;
		}

		this.ALARMVIEWACCESS = localStorage.getItem("UNITS_ALARM_VIEW");
		if (this.ALARMVIEWACCESS == 1) {
			this.alarmviewenable = false;
		} else {
			this.alarmviewenable = true;
		}

		this.apiServiceURL = conf.apiBaseURL();
		this.timerswitch = 1;
		this.controlleroffmode = '';
		this.controllerautomode = '';
		this.controllermanmode = '';

		this.profilePhoto = localStorage.getItem

			("userInfoPhoto");
		if (this.profilePhoto == '' || this.profilePhoto == 'null') {
			this.profilePhoto = this.apiServiceURL + "/images/default.png";
		} else {
			this.profilePhoto = this.apiServiceURL + "/staffphotos/" + this.profilePhoto;
		}

		this.platform.registerBackButtonAction(() => {
			this.previous();
		});

		// Footer Menu Access - Start
		let footeraccessstorage = localStorage.getItem("footermenu");
		let footeraccessparams = this.navParams.get('footermenu');
		let footermenuacc;
		if (footeraccessparams != undefined) {
			footermenuacc = footeraccessparams;
		} else {
			footermenuacc = footeraccessstorage;
		}

		let footermenusplitcomma = footermenuacc.split(",");
		let dashboardAccess = footermenusplitcomma[0];
		let unitAccess = footermenusplitcomma[1];
		let calendarAccess = footermenusplitcomma[2];
		let messageAccess = footermenusplitcomma[3];
		let orgchartAccess = footermenusplitcomma[4];


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
			colorcode: "#488aff",
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
			colorcode: "rgba(60, 60, 60, 0.7)",
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
		//this.footerBar = "0";
		//let footerBar=this.footerBar.split(",");

		// Footer Menu Access - End
	}
	// ngOnInit() {
	// 	let timer = TimerObservable.create(2000, 1000);
	// 	this.subscription = timer.subscribe(t => {
	// 		this.tick = t;
	// 	});
	// }
	presentModal(unit) {
		console.log(JSON.stringify(unit));
		let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
		modal.present();
	}

	ngOnDestroy() {
		// unsubscribe here
		this.subscription.unsubscribe();
	}
	ionViewWillLeave() {

		//this.subscription.unsubscribe();

	}
	ionViewDidLoad() {


		// this.unitstimervalue(1);

		if (this.timerswitch > 0) {
			this.subscription = Observable.interval(2000).subscribe(x => {

				console.log("Enter:" + this.timerswitch);
				console.log(JSON.stringify(x))
				if (this.timerswitch > 0) {
					let unitid = localStorage.getItem("iframeunitId");
					console.log("After storage:" + unitid);
					let urlstr;
					console.log("Tab choosen" + this.tabs);
					if (this.tabs == 'dataView') {
						urlstr = "/" + unitid + "/" + this.unitDetailData.userId + "/unitdata";
						let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
							headers: any = new Headers({ 'Content-Type': type }),
							options: any = new RequestOptions({ headers: headers }),
							url: any = this.apiServiceURL + urlstr;
						console.log("Unit Timer Value:" + url);


						this.http.get(url, options)
							.subscribe((data) => {
								console.log("Unit data response success:" + JSON.stringify(data.json()));
								// Votage
								this.volt1 = data.json().volt1;
								this.volt2 = data.json().volt2;
								this.volt3 = data.json().volt3;
								console.log("Votage A" + this.volt1);
								if (this.voltageselection == 3) {
									this.selectedvoltage = this.volt3;
								} else if (this.voltageselection == 2) {
									this.selectedvoltage = this.volt2;
								} else {
									this.selectedvoltage = this.volt1;
								}
								// Votage

								// Current
								this.current1 = data.json().current1;
								this.current2 = data.json().current2;
								this.current3 = data.json().current3;
								console.log("Current B" + this.current1);
								if (this.currentselection == 3) {
									this.selectedcurrent = this.current3;
								} else if (this.currentselection == 2) {
									this.selectedcurrent = this.current2;
								} else {
									this.selectedcurrent = this.current1;
								}
								// Current

								// Frequency
								this.freq = data.json().freq;
								this.selectedfrequency = this.freq;
								// Frequency
								// Engine Speed
								this.enginespeed = data.json().enginespeed;
								this.selectedenginespeed = this.enginespeed;
								// Engine Speed
								// Fuel Level
								this.fuellevel = data.json().fuellevel;
								this.selectedfuel = this.fuellevel;
								// Fuel Level
								// Load Power Factor
								this.loadpower = data.json().loadpower;
								this.selectedloadpower = this.loadpower;
								// Load Power Factor

								this.commstatus = data.json().commstatus;

								this.enginestatus = data.json().enginestatus;
								console.log("Unit Data Engine Status Color:" + this.enginestatus)
								// if(this.enginestatus=='Warning'){
								// 	this.enginestatuscolor='#F8A70F';
								// }else if(this.enginestatus=='Alarm'){
								// 	this.enginestatuscolor='#C71717';
								// }

								this.enginestatuscolor = data.json().enginestatuscolor;
								console.log("Engine Status Color in Overview:-" + this.enginestatuscolor);
								if (this.enginestatuscolor == '') {
									this.enginestatuscolor = '#EDEDED';
								}

								this.commstatus = data.json().commstatus;
								console.log("Com Status in Dataview" + this.commstatus);
								if (this.commstatus == 'Offline') {
									this.commstatuscolor = "gray";
								} else {
									this.commstatuscolor = "#00BA28";
								}

								this.coolanttemp = data.json().coolanttemp;
								this.oilpressure = data.json().oilpressure;
								this.loadpowerfactor = data.json().loadpowerfactor;
								this.batteryvoltage = data.json().batteryvoltage;

							}, error => {

							});
						// Votage
						let voltage = 0;
						console.log("Votage SA" + this.selectedvoltage);
						let actual_voltage = this.selectedvoltage;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;
						// if (actual_voltage > 0) {
						// 	voltage = ((actual_voltage - 260) / 200) * 100;
						// } else {
						// 	voltage = 0;
						// }

						let diff = this.setpointsdata[0].maxvalue - this.setpointsdata[0].minvalue;
						if (actual_voltage < this.setpointsdata[0].minvalue)
							voltage = 0;
						else if (actual_voltage > this.setpointsdata[0].maxvalue)
							voltage = 100;
						else
							voltage = ((actual_voltage - this.setpointsdata[0].minvalue) / diff) * 100;

						console.log("Voltage Pecentage:" + voltage);
						let voltguagelabel = this.voltguagelabel;
						var vltlabels = JSON.parse('{' + this.voltlabel + '}');
						var vltcolors = JSON.parse('{' + this.voltcolors + '}');
						let voltagegauge = new Gauge(jQuery('.voltagegauge'), {
							values: vltlabels,
							colors: vltcolors,
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: voltage
						});
						// Votage


						// Current
						let current = 0;
						let actual_current = this.selectedcurrent;


						if (actual_current <= this.setpointsdata[1].minvalue) {
							current = 0;
						} else if (actual_current >= this.setpointsdata[1].maxvalue) {
							current = 100;
						} else {
							current = actual_current;
						}


						var cntlabels = JSON.parse('{' + this.currentlabel + '}');
						var cntcolors = JSON.parse('{' + this.currentcolors + '}');

						let currentgauge = new Gauge(jQuery('.currentgauge'), {

							values: cntlabels,
							colors: cntcolors,
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: current
						});
						// Current


						// Frequency
						let frequency = 0;

						let actual_frequency = this.freq;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;
						/*if (actual_frequency > 0) {
							frequency = (((actual_frequency - 40) / 20) * 100);
						} else {
							frequency = 0;
						}*/

						let difffreq = this.setpointsdata[2].maxvalue - this.setpointsdata[2].minvalue;
						if (actual_frequency < this.setpointsdata[2].minvalue)
							frequency = 0;
						else if (actual_frequency > this.setpointsdata[2].maxvalue)
							frequency = 100;
						else
							frequency = (((actual_frequency - this.setpointsdata[2].minvalue) / difffreq) * 100);




						var frqlabels = JSON.parse('{' + this.frequencylabel + '}');
						var frqcolors = JSON.parse('{' + this.frequencycolors + '}');

						let frequencygauge = new Gauge(jQuery('.frequencygauge'), {

							values: frqlabels,
							colors: frqcolors,
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: frequency
						});
						// Frequency

						// Engine Speed
						let enginespeed = 0;
						let diffengine = this.setpointsdata[3].maxvalue - this.setpointsdata[3].minvalue;
						let actual_enginespeed = this.enginespeed;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;
						if (actual_enginespeed < this.setpointsdata[3].minvalue) {
							enginespeed = 0;
						} else if (actual_enginespeed > this.setpointsdata[3].maxvalue) {
							enginespeed = 100;
						} else {
							enginespeed = (((actual_enginespeed - this.setpointsdata[3].minvalue) / diffengine) * 100);
						}




						var engspeedlabels = JSON.parse('{' + this.enginespeedlabel + '}');
						var engspeedcolors = JSON.parse('{' + this.enginespeedcolors + '}');

						let enginespeedgauge = new Gauge(jQuery('.enginespeedgauge'), {

							values: engspeedlabels,
							colors: engspeedcolors,
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: enginespeed
						});
						// Engine Speed


						// Fuel Level
						let fuel = 0;

						let actual_fuel = this.fuellevel;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;
						if (actual_fuel <= 0) {
							fuel = 0;
						} else if (actual_fuel >= 100) {
							fuel = 100;
						} else {
							fuel = actual_fuel;
						}
						var fullabels = JSON.parse('{' + this.fuellabel + '}');
						var fulcolors = JSON.parse('{' + this.fuelcolors + '}');

						let fuelgauge = new Gauge(jQuery('.fuelgauge'), {

							values: fullabels,
							colors: fulcolors,
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: fuel
						});
						// Fuel Level


						// Load Factor
						let loadfactor = 0;

						let actual_loadfactor = this.loadpower;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;
						if (actual_loadfactor > this.setpointsdata[4].minvalue) {
							loadfactor = ((actual_loadfactor) / this.setpointsdata[4].maxvalue) * 100;
						} else {
							loadfactor = 0;
						}



						if (actual_loadfactor <= this.setpointsdata[4].minvalue) {
							loadfactor = 0;
						} else if (actual_loadfactor >= this.setpointsdata[4].maxvalue) {
							loadfactor = 100;
						} else {
							loadfactor = actual_loadfactor;
						}


						var loadpowerlabels = JSON.parse('{' + this.loadpowerlabel + '}');
						var loadpowercolors = JSON.parse('{' + this.loadpowercolors + '}');

						let loadpowergauge = new Gauge(jQuery('.loadpowergauge'), {

							values: loadpowerlabels,
							colors: loadpowercolors,
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: loadfactor
						});
						// Load Factor







						var coolantbarlabels = this.coolantbarlabels.split(",");

						var gradient1 = {
							type: 'linearGradient',
							x0: 0,
							y0: 0.5,
							x1: 1,
							y1: 0.5,
							colorStops: [{ offset: 0, color: '#df0000' }, { offset: 1, color: '#df0000' }]
						};

						var gradient2 = {
							type: 'linearGradient',
							x0: 0,
							y0: 0.5,
							x1: 1,
							y1: 0.5,
							colorStops: [{ offset: 0, color: '#ffca00' }, { offset: 1, color: '#ffca00' }]
						};

						var gradient3 = {
							type: 'linearGradient',
							x0: 0,
							y0: 0.5,
							x1: 1,
							y1: 0.5,
							colorStops: [{ offset: 0, color: '#00FF50' }, { offset: 1, color: '#00FF50' }]
						};

						var needleGradient = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.1,
							y1: 0.1,
							colorStops: [{ offset: 0, color: '#4F6169' }, { offset: 1, color: '#252E32' }]
						};



						let res = this.setpointsdata;
						console.log(this.setpointsdata);
						console.log(this.setpointsdata.length);
						for (var i = 0; i < res.length; i++) {
							this.rangesdata = [];
							var code = res[i].code.toLowerCase();
							var labels = res[i].barlabels.split(',');
							console.log("Bar Lbels:-" + labels);
							var barchartcolors = res[i].barchartcolors.split(',');
							var sval = 0;
							var enval = 0;
							//
							console.log("Lables Length:" + labels.length);
							for (var x = 0; x < labels.length; x++) {
								console.log("Xav" + x);
								if (x == 0) {
									sval = 0;
									enval = labels[x];

								} /*else if (x == labels.length - 1) {
									sval = labels[x];
									enval = res[i].maxvalue;
									
								}*/ else {

									sval = labels[x - 1];
									enval = labels[x];

								}
								//var brclr= barchartcolors[x].replace('"','');
								var gradver;
								if (barchartcolors[x] == "gradient1") {
									gradver = '#df0000';
								}
								if (barchartcolors[x] == "gradient2") {
									gradver = '#ffca00';
								}
								if (barchartcolors[x] == "gradient3") {
									gradver = '#00FF50';
								}
								this.rangesdata.push({
									startValue: sval,
									endValue: enval,
									innerOffset: 0.46,
									outerStartOffset: 0.70,
									outerEndOffset: 0.70,
									fillStyle: gradver
								})
								/*startValue: 97,
									endValue: 105,
										innerOffset: 0.46,
											outerStartOffset: 0.70,
												outerEndOffset: 0.70,
													fillStyle: gradient3*/


							}
							if (enval == res[i].maxvalue) {
								enval = sval;
							}

							this.rangesdata.push({
								startValue: enval,
								endValue: res[i].maxvalue,
								innerOffset: 0.46,
								outerStartOffset: 0.70,
								outerEndOffset: 0.70,
								fillStyle: '#df0000'
							})

							console.log("Ranges Data Array:" + JSON.stringify(this.rangesdata));

							if (code == "coolanttemp") {
								console.log("this.coolanttemp" + this.coolanttemp);
								this.needlevalue = this.coolanttemp;
							}
							if (code == "oilpressure") {
								console.log("this.oilpressure" + this.oilpressure)
								this.needlevalue = this.oilpressure;
							}
							if (code == "batteryvolt") {
								console.log("this.batteryvoltage" + this.batteryvoltage)
								this.needlevalue = this.batteryvoltage;
							}
							// if (code == "loadpower") {
							// 	needlevalue = this.loadpowerfactor;
							// }
							if (this.needlevalue == undefined) {
								this.needlevalue = 0;
							}
							if (this.needlevalue == 'undefined') {
								this.needlevalue = 0;
							}
							console.log("Needle value:" + this.needlevalue);
							console.log("Join:" + labels.join(","));
							console.log("JASON PARSE:" + JSON.parse('[' + labels + ']'));

							jQuery('#' + code).jqLinearGauge({
								orientation: 'horizontal',
								background: '#fff',
								border: {
									padding: 5,
									lineWidth: 0,
									strokeStyle: '#76786A'
								},
								tooltips: {
									disabled: false,
									highlighting: true
								},
								animation: false,
								scales: [
									{
										minimum: res[i].minvalue,
										maximum: res[i].maxvalue,
										labels: {
											offset: 0.15
										},
										majorTickMarks: {
											length: 0,
											offset: 1,
											lineWidth: 2
										},
										minorTickMarks: {
											length: 0,
											visible: false,
											interval: 2,
											offset: 1,
											lineWidth: 2
										},
										customTickMarks: JSON.parse('[' + labels + ']'),//coolanttemplabel_0, coolanttemplabel_1, coolanttemplabel_2, coolanttemplabel_3, coolanttemplabel_4
										ranges:
											// {"startValue":0,"endValue":8,"innerOffset":0.46,"outerStartOffset":0.7,"outerEndOffset":0.7,"fillStyle":"gradient2"},
											// {"startValue":8,"endValue":15,"innerOffset":0.46,"outerStartOffset":0.7,"outerEndOffset":0.7,"fillStyle":"gradient3"}
											this.rangesdata
										/*{
											startValue: 0,
											endValue: 20,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient1
										},
										{
											startValue: 20,
											endValue: 97,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient2
										},
										{
											startValue: 97,
											endValue: 105,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient3
										}*/
										,
										needles: [
											{
												type: 'pointer',
												value: this.needlevalue,
												fillStyle: needleGradient,
												innerOffset: 0.50,
												outerOffset: 1.00
											}
										]
									}
								]
							});
						}

						jQuery('#powerfactor').jqLinearGauge({
							orientation: 'horizontal',
							background: '#fff',
							border: {
								padding: 5,
								lineWidth: 0,
								strokeStyle: '#76786A'
							},
							tooltips: {
								disabled: false,
								highlighting: true
							},
							animation: false,
							scales: [
								{
									minimum: 0,
									maximum: 1.0,
									labels: {
										offset: 0.15
									},
									majorTickMarks: {
										length: 0,
										offset: 1,
										lineWidth: 2
									},
									minorTickMarks: {
										length: 0,
										visible: false,
										interval: 2,
										offset: 1,
										lineWidth: 2
									},
									customTickMarks: coolantbarlabels,//coolanttemplabel_0, coolanttemplabel_1, coolanttemplabel_2, coolanttemplabel_3, coolanttemplabel_4
									ranges: [
										{
											startValue: 0,
											endValue: 1.0,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient3
										}
									],
									needles: [
										{
											type: 'pointer',
											value: this.loadpowerfactor,
											fillStyle: needleGradient,
											innerOffset: 0.50,
											outerOffset: 1.00
										}
									]
								}
							]

						});



					}

					if (this.tabs == 'overView') {

						urlstr = "/" + unitid + "/" + this.unitDetailData.userId + "/unitoverview";
						let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
							headers: any = new Headers({ 'Content-Type': type }),
							options: any = new RequestOptions({ headers: headers }),
							url: any = this.apiServiceURL + urlstr;
						console.log("Unit Timer Value:" + url);
						this.http.get(url, options)
							.subscribe((data) => {
								console.log("Unit  overview response success:" + JSON.stringify(data.json()));
								// Votage
								this.commstatus = data.json().commstatus;
								if (this.commstatus == 'Offline') {
									this.commstatuscolor = "gray";
								} else {
									this.commstatuscolor = "#00BA28";
								}

								this.startbtn = data.json().startbtn;
								this.stopbtn = data.json().stopbtn;

								this.startbtnenable = true;
								this.stopbtnenable = true;
								if (this.startbtn == 'Non Clickable') {
									this.startbtnenable = true;
								}
								if (this.startbtn == 'Clickable') {
									this.startbtnenable = false;
								}


								if (this.stopbtn == 'Non Clickable') {
									this.stopbtnenable = true;
								}
								if (this.stopbtn == 'Clickable') {
									this.stopbtnenable = false;
								}
								this.alarmstatus = data.json().alarmstatus;



								this.enginestatus = data.json().enginestatus;
								this.controllermode = data.json().controllermode;
								this.nextservicedate = data.json().nextservicedate;
								this.unitfavorite = data.json().unitfavorite;
								this.controlleroffmode = '';
								this.controllermanmode = '';
								this.controllerautomode = '';
								if (this.controllermode == 'OFF') {
									this.controlleroffmode = 'active';
								} else if (this.controllermode == 'MAN') {
									this.controllermanmode = 'active';
								} else if (this.controllermode == 'AUTO') {
									this.controllerautomode = 'active';
								}
								this.runninghrs = data.json().runninghrs;
								this.enginestatuscolor = data.json().enginestatuscolor;
								console.log("Engine Status Color in Overview:-" + this.enginestatuscolor);
								if (this.enginestatuscolor == '') {
									this.enginestatuscolor = '#EDEDED';
								}
							}, error => {

							});
					}



				}
			});
		}
		this.selectedvoltage = 0;
		this.selectedcurrent = 0;
		this.freq = 0;
		this.enginespeed = 0;
		this.fuellevel = 0;
		this.coolanttemp = 0;
		this.oilpressure = 0;
		this.loadpowerfactor = 0;
		this.batteryvoltage = 0;
		this.selectedvoltage = 0;
		this.selectedcurrent = 0;
		this.freq = 0;
		this.enginespeed = 0;
		this.fuellevel = 0;
		this.voltguagelabel = localStorage.getItem("voltguagelabel");
		this.voltguagecolors = localStorage.getItem("voltguagecolors");
		this.conf.presentLoading(1);

		this.pageTitle = "Unit Detail";
		let editItem = this.NP.get("record");
		let iframeunitid = localStorage.getItem("iframeunitId");
		console.log("iframeunitid:" + iframeunitid);
		if (iframeunitid == 'undefined') {
			iframeunitid = '0';
		}
		if (iframeunitid == undefined) {
			iframeunitid = '0';
		}
		if (iframeunitid != '0') {
			this.unitDetailData.unit_id = iframeunitid
		} else {
			if (this.NP.get("record").unit_id > 0) {
				this.unitDetailData.unit_id = this.NP.get("record").unit_id;
			} else {
				this.unitDetailData.unit_id = editItem.unit_id;
			}
		}
		console.log('ionViewDidLoad UnitdetailsPage');
		localStorage.setItem("fromModule", "UnitdetailsPage");
		this.geninfo(this.unitDetailData.unit_id);
		// UnitDetails Api Call		
		let
			type: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers: any = new Headers({ 'Content-Type': type }),
			options: any = new RequestOptions({ headers: headers }),
			url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.unitDetailData.userId +
				"&unitid=" + this.unitDetailData.unit_id;
		console.log(url);
		this.http.get(url, options)
			.subscribe((data) => {					// If the request was successful notify the user
				if (data.status === 200) {

					// Genset Info

					/*this.unitDetailData.serialnumber = data.json().units[0];
					this.unitDetailData.contactpersonal = data.json().units[0];
					this.unitDetailData.contactnumber = data.json().units[0];*/
					// Genset Info
					this.unitDetailData.unit_id = data.json().units[0].unit_id;
					this.unitDetailData.unitname = data.json().units[0].unitname;

					///DCA6000SS Denyo Testing Unit Name can be very long
					console.log("A" + this.unitDetailData.unitname.length);
					if (this.unitDetailData.unitname.length > 20) {
						console.log("B" + this.unitDetailData.unitname.length);
						this.unitDetailData.unitnameellipse = this.unitDetailData.unitname.substr(0, 25) + "...";
						console.log(this.unitDetailData.unitnameellipse)
					} else {
						this.unitDetailData.unitnameellipse = this.unitDetailData.unitname;
					}
					console.log("C" + this.unitDetailData.unitname.length);
					this.unitDetailData.projectname = data.json().units[0].projectname;
					this.unitDetailData.location = data.json().units[0].location;
					this.unitDetailData.colorcodeindications = data.json().units[0].colorcode;
					this.unitDetailData.gen_status = data.json().units[0].genstatus;
					this.unitDetailData.nextservicedate = data.json().units[0].nextservicedate;
					this.unitDetailData.companygroup_name = data.json().units[0].companygroup_name;
					this.unitDetailData.runninghr = data.json().units[0].runninghr;
					this.unitDetailData.unitgroup_name = data.json().units[0].unitgroup_name;

					this.unitDetailData.serial_number = data.json().units[0].serialnumber;
					this.unitDetailData.contactpersonal = data.json().units[0].contactpersonal;
					this.unitDetailData.contactnumber = data.json().units[0].contactnumber;
					this.unitDetailData.unitgroups_id = data.json().units[0].unitgroups_id;
					this.unitDetailData.controllerid = data.json().units[0].controllerid;
					this.unitDetailData.companys_id = data.json().units[0].companys_id;
					this.unitDetailData.models_id = data.json().units[0].models_id;
					this.unitDetailData.contacts = data.json().units[0].contacts;
					//this.unitDetailData.alarmnotificationto = data.json().units[0].nextservicedate;
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


					let colorcode;
					let index = this.colorListArr.indexOf(this.unitDetailData.colorcodeindications);
					let colorvalincrmentone = index + 1;
					colorcode = "button" + colorvalincrmentone;
					this.unitDetailData.colorcodeindications = colorcode;
					let favorite;
					if (data.json().units[0].favorite == '1') {
						favorite = "favorite";
					}
					else {
						favorite = "unfavorite";

					}
					this.unitDetailData.favoriteindication = favorite;

				}
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
		// Unit Details API Call
		//	http://denyoappv2.stridecdev.com/7/1/unitdetails1	
		///this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails height=1000 width=100% frameborder=0></iframe>";
		//width='508' height='286'
		console.log("Tab1:-" + this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails1");
		console.log("Tab12:-" + this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails2");
		this.tabview1 = "<iframe   height=500 width=100% frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen src=" + this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails1></iframe>";
		this.tabview2 = "<iframe height=1000 width=100% frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen src=" + this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails2></iframe>";

		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails1");
		this.url1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails2");

		this.conf.presentLoading(0);
		let tabActive = this.NP.get("tabs");
		if (tabActive != undefined) {
			this.tabs = tabActive;
			let overView = document.getElementById('overView');
			let dataView = document.getElementById('dataView');
			let gensetView = document.getElementById('gensetView');

			if (tabActive == 'dataView') {
				dataView.style.display = 'block';
				overView.style.display = 'none';
				gensetView.style.display = 'none';
			} else if (tabActive == 'gensetView') {
				dataView.style.display = 'none';
				overView.style.display = 'none';
				gensetView.style.display = 'block';
			} else {
				dataView.style.display = 'none';
				overView.style.display = 'block';
				gensetView.style.display = 'none';
			}
		}

		this.genkey = Math.floor(Math.random() * 9000000000) + 1000000000;//'1502851159';

	}
	overviewAction(genkey, controllerid, action) {


		console.log('action' + action);
		let acttitle;
		if (action == 'on') {
			acttitle = "START";
			action = "START";
		}
		if (action == 'off') {
			acttitle = "STOP";
			action = "STOP";
		}
		if (action == 'off-mode') {
			acttitle = "OFF-MODE";
			action = "OFF-MODE";
		}
		if (action == 'fault-reset') {
			acttitle = "Fault reset";
			action = "FAULT-RESET";
		}
		if (action == 'man-mode') {
			acttitle = "Manual mode";
			action = "MAN-MODE";
		}
		if (action == 'auto-mode') {
			acttitle = "Automatic mode";
			action = "AUTO-MODE";
		}

		let confirm = this.alertCtrl.create({
			message: 'Are you sure you want to ' + acttitle + ' this unit?',
			buttons: [{
				text: 'Yes',
				handler: () => {
					//http://denyoapi.stridecdev.com/api2/{{unitDetailData.controllerid}}/fault-reset/{{genkey}}
					let body: string = "",
						type: string = "application/x-www-form-urlencoded; charset=UTF-8",
						headers: any = new Headers({ 'Content-Type': type }),
						options: any = new RequestOptions({ headers: headers }),
						//url: any = "http://denyoapi.stridecdev.com/api2/" + controllerid + "/" + action + "/" + genkey;
						url: any = this.apiServiceURL + "/remoteaction?controllerid=" + controllerid + "&controlaction=" + action + "&ismobile=1";
					console.log(url);
					console.log(body);


					console.log("Enter API Calls");
					//this.http.get(url, options)
					this.http.post(url, body, options)
						.subscribe((data) => {
							if (data.status === 200) {
								if (action == 'START') {
									this.startbtnenable = true;
								}
								//console.log("Fault successfully reset!");
								if (action == 'OFF-MODE') {
									//this.showAlert('OFF-Mode', 'OFF-Mode')
									this.conf.sendNotification(`OFF-Mode`);
								} else if (action == 'FAULT-RESET') {
									//this.showAlert('Fault Rest', 'Fault successfully reset!');
									this.conf.sendNotification(`Fault successfully reset`);
								} else if (action == 'MAN-Mode') {
									//this.showAlert('MAN-Mode', 'MAN-Mode');
									this.conf.sendNotification(`MAN-Mode`);
								} else if (action == 'AUTO-MODE') {
									//this.showAlert('AUTO-Mode', 'AUTO-Mode');
									this.conf.sendNotification(`AUTO-Mode`);
								}

							}
							// Otherwise let 'em know anyway
							else {
								console.log("Something went wrong!");
							}
						}, error => {
							this.networkType = this.conf.serverErrMsg();// + "\n" + error;
						});
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
	geninfo(unitid) {
		let //body: string = "loginid=" + this.userId,
			type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers1: any = new Headers({ 'Content-Type': type1 }),
			options1: any = new RequestOptions({ headers: headers1 }),
			url1: any = this.apiServiceURL + "/" + unitid + "/1/enginedetailsnewapi";

		console.log(url1);
		this.http.get(url1, options1)
			.subscribe((data) => {
				let res;
				res = data.json();
				console.log("enginedetailsnewapi" + JSON.stringify(res));
				let unitdetails = res.genset_detail[0];
				console.log("Controller Id" + unitdetails.controllerid);
				this.unitDetailData.controllerid = unitdetails.controllerid;
				this.unitDetailData.neaplateno = unitdetails.neaplateno;
				this.unitDetailData.serialnumber = unitdetails.serialnumber;
				this.unitDetailData.generatormodel = unitdetails.generatormodel;
				this.unitDetailData.companygroup_name = unitdetails.companygroup_name;
				this.unitDetailData.alarmnotificationto = unitdetails.alarmnotificationto;



				// Get Guage Details
				//denyoappv2.stridecdev.com/gaugedetails/GEN0002

				let //body: string = "loginid=" + this.userId,
					type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
					headers1: any = new Headers({ 'Content-Type': type1 }),
					options1: any = new RequestOptions({ headers: headers1 }),
					url1: any = this.apiServiceURL + "/gaugedetails/" + this.unitDetailData.controllerid;

				console.log(url1);
				this.http.get(url1, options1)
					.subscribe((data) => {
						let res;
						res = data.json();
						//this.setpointsdata = data.json();
						console.log("data.json().setpoints[0].length:" + data.json().setpoints[0].length);
						if (data.json().setpoints.length > 0) {
							for (let sp in res.setpoints) {
								this.setpointsdata.push({
									code: res.setpoints[sp].code,
									labels: res.setpoints[sp].labels,
									colors: res.setpoints[sp].colors,
									barlabels: res.setpoints[sp].barlabels,
									minvalue: res.setpoints[sp].minvalue,
									maxvalue: res.setpoints[sp].maxvalue,
									barchartcolors: res.setpoints[sp].barchartcolors
								})
							}
						}
						console.log("Push Value:-" + JSON.stringify(this.setpointsdata))
						this.voltlabel = data.json().setpoints[0].labels;
						this.voltcolors = data.json().setpoints[0].colors;

						this.currentlabel = data.json().setpoints[1].labels;
						this.currentcolors = data.json().setpoints[1].colors;

						this.frequencylabel = data.json().setpoints[2].labels;
						this.frequencycolors = data.json().setpoints[2].colors;

						this.enginespeedlabel = data.json().setpoints[3].labels;
						this.enginespeedcolors = data.json().setpoints[3].colors;

						this.fuellabel = data.json().setpoints[4].labels;
						this.fuelcolors = data.json().setpoints[4].colors;

						this.loadpowerlabel = data.json().setpoints[5].labels;
						this.loadpowercolors = data.json().setpoints[5].colors;

						this.coolantlabel = data.json().setpoints[6].labels;
						this.coolantcolors = data.json().setpoints[6].colors;
						this.coolantbarlabels = data.json().setpoints[6].barlabels;

						this.oilpressuerlabel = data.json().setpoints[7].labels;
						this.oilpressuercolors = data.json().setpoints[7].colors;
						this.oilperssuerbarlabels = data.json().setpoints[7].barlabels;

						this.batteryvoltlabel = data.json().setpoints[8].labels;
						this.batteryvoltcolors = data.json().setpoints[8].colors;
						this.batteryvoltbarlabels = data.json().setpoints[8].barlabels;




					}, error => {
						this.networkType = this.conf.serverErrMsg();// + "\n" + error;
					});
				// Get Guage Details
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
	}

	ionViewWillEnter() {
		this.chk = localStorage.getItem("viewlist")

		localStorage.setItem("unitdetailsclicked", '');
		this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails height=1000 width=100% frameborder=0></iframe>";
		let body: string = "is_mobile=1&loginid=" + this.unitDetailData.userId +
			"&unitid=" + this.unitDetailData.unit_id,
			type: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers: any = new Headers({ 'Content-Type': type }),
			options: any = new RequestOptions({ headers: headers }),
			url: any = this.apiServiceURL + "/getcount";
		console.log(url);
		console.log(body);

		this.http.post(url, body, options)
			.subscribe((data) => {
				console.log("Count Response Success:" + JSON.stringify(data.json()));
				let res = data.json();
				this.serviceCount = res.servicecount;
				this.commentCount = res.commentcount;
				// If the request was successful notify the user
				if (data.status === 200) {
					//this.conf.sendNotification(`Comment count successfully removed`);

				}
				// Otherwise let 'em know anyway
				else {
					// this.conf.sendNotification('Something went wrong!');
				}
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
		let //body: string = "loginid=" + this.userId,
			type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers1: any = new Headers({ 'Content-Type': type1 }),
			options1: any = new RequestOptions({ headers: headers1 }),
			url1: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.unitDetailData.userId;
		console.log(url1);
		// console.log(body);

		this.http.get(url1, options1)
			.subscribe((data) => {
				console.log("Count Response Success:" + JSON.stringify(data.json()));
				this.msgcount = data.json().msgcount;
				this.notcount = data.json().notifycount;
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
	}
	servicingInfo(unitId, access) {
		if (access == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('SERVICING INFO', this.rolePermissionMsg)
		} else {
			let body: string = "is_mobile=1&userid=" + this.unitDetailData.userId +
				"&unitid=" + this.unitDetailData.unit_id,
				type: string = "application/x-www-form-urlencoded; charset=UTF-8",
				headers: any = new Headers({ 'Content-Type': type }),
				options: any = new RequestOptions({ headers: headers }),
				url: any = this.apiServiceURL + "/removeservicecount";
			console.log(url);
			console.log(body);

			this.http.post(url, body, options)
				.subscribe((data) => {
					if (data.status === 200) {
						console.log("Service count successfully removed");
					}
					// Otherwise let 'em know anyway
					else {
						console.log("Something went wrong!");
					}
				}, error => {
					this.networkType = this.conf.serverErrMsg();// + "\n" + error;
				});


			this.navCtrl.setRoot(ServicinginfoPage, {
				record: this.NP.get("record")
			});
		}
	}
	alamInfo() {

		if (this.alarmviewenable == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('ALARM LOG', this.rolePermissionMsg)
		} else {
			this.navCtrl.setRoot(AlarmPage, {
				record: this.NP.get("record")
			});
		}
	}
	commentsInfo(unitId, access) {
		console.log(access);
		//this.navCtrl.setRoot(MenuPage);
		if (access == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('EVENTS/COMMENTS', this.rolePermissionMsg)
		} else {
			let body: string = "is_mobile=1&userid=" + this.unitDetailData.userId +
				"&unitid=" + unitId,
				type: string = "application/x-www-form-urlencoded; charset=UTF-8",
				headers: any = new Headers({ 'Content-Type': type }),
				options: any = new RequestOptions({ headers: headers }),
				url: any = this.apiServiceURL + "/removecommentcount";
			console.log(url);
			console.log(body);

			this.http.post(url, body, options)
				.subscribe((data) => {

					// If the request was successful notify the user
					if (data.status === 200) {
						console.log("Comment count successfully removed");

					}
					// Otherwise let 'em know anyway
					else {
						console.log("Something went wrong!");
					}
				}, error => {
					this.networkType = this.conf.serverErrMsg();// + "\n" + error;
				});

			this.navCtrl.setRoot(CommentsinfoPage, {
				record: this.NP.get("record")
			});
		}
	}


	/**
	 * Segment Changed
	 */
	segmentChanged(e) {
		this.conf.presentLoading(1);
		let overView = document.getElementById('overView');
		let dataView = document.getElementById('dataView');
		let gensetView = document.getElementById('gensetView');

		if (e._value == 'dataView') {
			//this.unitstimervalue(1);

			this.conf.presentLoading(0);
			dataView.style.display = 'block';
			overView.style.display = 'none';
			gensetView.style.display = 'none';
		} else if (e._value == 'gensetView') {
			if (this.timerswitch > 0) {
				//this.unitstimervalue(0);
				//this.subscription.unsubscribe();
			}
			this.conf.presentLoading(0);
			dataView.style.display = 'none';
			overView.style.display = 'none';
			gensetView.style.display = 'block';
		} else {
			//this.unitstimervalue(1);
			this.conf.presentLoading(0);
			dataView.style.display = 'none';
			overView.style.display = 'block';
			gensetView.style.display = 'none';
		}

	}

	alarm(access) {
		// if (this.timerswitch > 0) {
		// 	this.subscription.unsubscribe();
		// }

		if (access == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('ALARM', this.rolePermissionMsg)
		} else {
			this.navCtrl.setRoot(AlarmlogPage, {
				record: this.NP.get("record")
			});
		}
	}
	enginedetail(access) {
		console.log(access);
		// if (this.timerswitch > 0) {
		// 	this.subscription.unsubscribe();
		// }
		if (access == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('ENGINE DETAIL', this.rolePermissionMsg)
		} else {
			this.navCtrl.setRoot(EnginedetailviewPage, {
				record: this.NP.get("record")
			});
		}
		//this.navCtrl.setRoot(MenuPage);
	}
	previous() {
		// if (this.timerswitch > 0) {
		// 	this.subscription.unsubscribe();
		// }
		this.navCtrl.setRoot(UnitsPage);
	}
	notification() {
		//this.subscription.unsubscribe();
		this.navCtrl.setRoot(NotificationPage);
	}


	showAlert(title, msg) {
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: msg,
			buttons: ['OK']
		});
		alert.present();
	}
	viewunit() {
		//this.subscription.unsubscribe();
		/*
			this.navCtrl.setRoot(ViewunitsPage, {
				record: this.NP.get("record")
			});*/
	}

	/******************************************/
	/* @doConfirm called for alert dialog box **/

	/******************************************/
	doConfirm(id) {
		console.log("Deleted Id" + id);
		let confirm = this.alertCtrl.create({
			message: 'Are you sure you want to delete this unit?',
			buttons: [{
				text: 'Yes',
				handler: () => {
					this.deleteEntry(id);
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
			url: any = this.apiServiceURL + "/unitlistaction?action=delete&unitid=" + recordID + "&is_mobile=1&loginid=" + this.unitDetailData.userId;
		this.http.get(url, options)
			.subscribe(data => {
				// If the request was successful notify the user
				if (data.status === 200) {

					//this.conf.sendNotification(`Units was successfully deleted`);
					this.conf.sendNotification(data.json().msg[0]['result']);
					this.navCtrl.setRoot(UnitsPage);
				}
				// Otherwise let 'em know anyway
				else {
					this.conf.sendNotification('Something went wrong!');
				}
			}, error => {
				console.log("Error")
			});
	}
	viewondash(id) {
		let confirm = this.alertCtrl.create({
			message: 'Are you sure you want to pin to dashboard?',
			buttons: [{
				text: 'Yes',
				handler: () => {
					this.viewondashboard(id);
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
	viewondashboard(id) {
		let urlstr = "/unitlistaction?action=dashboard&unitid=" + this.unitDetailData.unit_id + "&is_mobile=1&loginid=" + this.unitDetailData.userId;
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
					//this.conf.sendNotification(`Dashboard view action successfully updated`);
					this.conf.sendNotification(data.json().msg[0]['result']);
				}
				// Otherwise let 'em know anyway
				else {
					// this.conf.sendNotification('Something went wrong!');
				}
			}, error => {
				// this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
	}
	doAction(item, act, unitId, from) {
		console.log("Item From Do Action:" + JSON.stringify(item));
		this.navCtrl.setRoot(AddUnitPage, {
			record: item,
			act: act,
			unitId: unitId,
			from: from
		});
		return false;
	}

	selectVoltage(voltage) {
		this.voltageselection = voltage;
		console.log(voltage);
		if (voltage == 3) {
			this.selectedvoltage = this.volt3;
			this.l1l2l3voltagelablel = 'L1-L3';
		} else if (voltage == 2) {
			this.selectedvoltage = this.volt2;
			this.l1l2l3voltagelablel = 'L2-L3';
		} else {
			this.selectedvoltage = this.volt1;
			this.l1l2l3voltagelablel = 'L1-L2';
		}

	}
	selectCurrent(current) {
		this.currentselection = current;
		console.log(current);
		if (current == 3) {
			this.selectedcurrent = this.current3;
			this.l1l2l3currentlablel = 'L3';
		} else if (current == 2) {
			this.selectedcurrent = this.current2;
			this.l1l2l3currentlablel = 'L2';
		} else {
			this.selectedcurrent = this.current1;
			this.l1l2l3currentlablel = 'L1';
		}

	}


	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	showgraph(unit_id, graphname) {

		this.navCtrl.setRoot(UnitdetailgraphPage, {
			unit_id: unit_id,
			graphname: graphname
		});


		// let modal = this.modalCtrl.create(UnitdetailgraphPage, {
		// 	unit_id: unit_id,
		// 	graphname: graphname
		// });
		// modal.present();

		// console.log("Show Graph function calling:-" + unit_id);

	}

}

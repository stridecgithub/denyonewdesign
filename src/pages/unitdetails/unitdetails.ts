import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
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

import * as $ from 'jquery';
declare var jQuery: any;
declare var Gauge: any;
declare var jqLinearGauge: any;
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

/**
 * Generated class for the UnitdetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-unitdetails',
	templateUrl: 'unitdetails.html',
	providers: [Config]
})
export class UnitdetailsPage {
	private tick: any;
	private subscription: Subscription;

	public pageTitle: string;
	//public userId: any;
	public item = [];

	public colorListArr = [];
	public voltsetpointslabel = [];
	iframeContent: any;
	iframeContent1: any;
	iframeContent2: any;
	tabview1: any;
	tabview2: any;
	private apiServiceURL: string = "";
	private permissionMessage: string = "";
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
	constructor(public alertCtrl: AlertController, private conf: Config, public platform: Platform, public http: Http, private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams) {
		this.unitDetailData.loginas = localStorage.getItem("userInfoName");
		this.unitDetailData.userId = localStorage.getItem("userInfoId");
		this.l1l2l3voltagelablel = 'L1-L2';
		this.l1l2l3currentlablel = 'L1';
		this.permissionMessage = conf.rolePermissionMsg();
		this.apiServiceURL = conf.apiBaseURL();
		this.timerswitch = 1;
		this.controlleroffmode = '';
		this.controllerautomode = '';
		this.controllermanmode = '';

		this.profilePhoto = localStorage.getItem

			("userInfoPhoto");
			if(this.profilePhoto == '' || this.profilePhoto == 'null') {
				this.profilePhoto = this.apiServiceURL +"/images/default.png";
			  } else {
			   this.profilePhoto = this.apiServiceURL +"/staffphotos/" + this.profilePhoto;
			  }

		this.platform.registerBackButtonAction(() => {
			this.previous();
		});

		//this.unitstimervalue(1);
	}
	// ngOnInit() {
	// 	let timer = TimerObservable.create(2000, 1000);
	// 	this.subscription = timer.subscribe(t => {
	// 		this.tick = t;
	// 	});
	// }

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


						if (actual_voltage < 260)
							voltage = 0;
						else if (actual_voltage > 460)
							voltage = 100;
						else
							voltage = ((actual_voltage - 260) / 200) * 100;

						console.log(voltage);


						console.log("Voltage storage Label" + this.voltguagelabel);


						let oilguagelabel = localStorage.getItem("oilguagelabel");
						let iolguagecolors = localStorage.getItem("iolguagecolors");

						console.log("oilguagelabel" + oilguagelabel);
						console.log("iolguagecolors" + iolguagecolors);

						let voltguagelabel = this.voltguagelabel;
						let colorzero = "#df0000";
						let colorten = "#ffca00";
						let colortwenty = "#00ff50";
						let coloreighty = "#ffca00";
						let coloreightyfive = "#df0000";
						let voltagelabel_0 = 280;//localStorage.getItem("voltagelabel_0");
						let voltagelabel_1 = 300; //localStorage.getItem("voltagelabel_1");
						let voltagelabel_2 = 420; //localStorage.getItem("voltagelabel_2");
						let voltagelabel_3 = 440; //localStorage.getItem("voltagelabel_3");
						let voltagecolor_0 = '#df0000'; //localStorage.getItem("voltagecolor_0");

						///0:,10:,20:,80:,85:

						let voltagecolor_1 = '#ffca00';//localStorage.getItem("voltagecolor_1");
						let voltagecolor_2 = '#00ff50'; //localStorage.getItem("voltagecolor_2");
						let voltagecolor_3 = '#ffca00';//localStorage.getItem("voltagecolor_3");
						let voltagecolor_4 = '#df0000'; //localStorage.getItem("voltagecolor_4");
						let voltagegauge = new Gauge(jQuery('.voltagegauge'), {
							values: {
								10: voltagelabel_0, 20: voltagelabel_1, 80: voltagelabel_2, 90: voltagelabel_3
							},
							colors: {
								0: voltagecolor_0, 10: voltagecolor_1, 20: voltagecolor_2, 80: voltagecolor_3, 90: voltagecolor_4
							},
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
						console.log("Current SB" + this.selectedcurrent);
						let actual_current = this.selectedcurrent;
						// if (actual_current > 0) {
						// 	current = actual_current;
						// } else if (actual_current == 0) {
						// 	current = 0;
						// } else {
						// 	current = 0;
						// }


						if (actual_current <= 0) {
							current = 0;
						} else if (actual_current >= 100) {
							current = 100;
						} else {
							current = actual_current;
						}



						// if (actual_current == 0)
						// 	current = 0;
						// else
						// 	current = actual_current;

						let currentlabel_0 = 85; //localStorage.getItem("currentlabel_0");
						let currentlabel_1 = 90; //localStorage.getItem("currentlabel_1");

						let currentcolor_0 = '#00ff50'; //localStorage.getItem("currentcolor_0");
						let currentcolor_1 = '#ffca00'; //localStorage.getItem("currentcolor_1");
						let currentcolor_2 = '#df0000'; //localStorage.getItem("currentcolor_2");

						let currentgauge = new Gauge(jQuery('.currentgauge'), {

							values: {
								85: currentlabel_0, 90: currentlabel_1
							},
							colors: {
								0: currentcolor_0, 85: currentcolor_1, 90: currentcolor_2
							},
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


						if (actual_frequency < 40)
							frequency = 0;
						else if (actual_frequency > 60)
							frequency = 100;
						else
							frequency = (((actual_frequency - 40) / 20) * 100);


						let freqlabel_0 = 42.5; //localStorage.getItem("freqlabel_0");
						let freqlabel_1 = 45; //localStorage.getItem("freqlabel_1");
						let freqlabel_2 = 56; //localStorage.getItem("freqlabel_2");
						let freqlabel_3 = 57.5; //localStorage.getItem("freqlabel_3");
						let freqcolor_0 = '#df0000';    //localStorage.getItem("freqcolor_0");
						let freqcolor_1 = '#ffca00'; //localStorage.getItem("freqcolor_1");
						let freqcolor_2 = '#00ff50'; //localStorage.getItem("freqcolor_2");
						let freqcolor_3 = '#ffca00'; //localStorage.getItem("freqcolor_3");
						let freqcolor_4 = '#df0000'; //localStorage.getItem("freqcolor_4");
						let frequencygauge = new Gauge(jQuery('.frequencygauge'), {

							values: {
								12.5: freqlabel_0, 25: freqlabel_1, 80: freqlabel_2, 87.5: freqlabel_3
							},
							colors: {
								0: freqcolor_0, 12.5: freqcolor_1, 25: freqcolor_2, 80: freqcolor_3, 87.5: freqcolor_4
							},
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

						let actual_enginespeed = this.enginespeed;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;
						if (actual_enginespeed < 1200) {
							enginespeed = 0;
						} else if (actual_enginespeed > 1800) {
							enginespeed = 100;
						} else {
							enginespeed = (((actual_enginespeed - 1200) / 600) * 100);
						}




						console.log(enginespeed);

						let enginespeedlabel_0 = 1275; //localStorage.getItem("enginespeedlabel_0");
						let enginespeedlabel_1 = 1350; //localStorage.getItem("enginespeedlabel_1");
						let enginespeedlabel_2 = 1680; //localStorage.getItem("enginespeedlabel_2");
						let enginespeedlabel_3 = 1725; //localStorage.getItem("enginespeedlabel_3");
						let enginespeedcolor_0 = '#df0000'; //localStorage.getItem("enginespeedcolor_0");
						let enginespeedcolor_1 = '#ffca00'; //localStorage.getItem("enginespeedcolor_1");
						let enginespeedcolor_2 = '#00ff50'; //localStorage.getItem("enginespeedcolor_2");
						let enginespeedcolor_3 = '#ffca00'; //localStorage.getItem("enginespeedcolor_3");
						let enginespeedcolor_4 = '#df0000'; //localStorage.getItem("enginespeedcolor_4");


						let enginespeedgauge = new Gauge(jQuery('.enginespeedgauge'), {

							values: {
								12.5: enginespeedlabel_0, 25: enginespeedlabel_1, 80: enginespeedlabel_2, 87.5: enginespeedlabel_3
							},
							colors: {
								0: enginespeedcolor_0, 12.5: enginespeedcolor_1, 25: enginespeedcolor_2, 80: enginespeedcolor_3, 87.5: enginespeedcolor_4
							},
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
						let fuellevellabel_0 = 6.25// localStorage.getItem("fuellevellabel_0");

						let fuellevelcolor_0 = '#ffca00'// localStorage.getItem("fuellevelcolor_0");
						let fuellevelcolor_1 = '#00ff50'// localStorage.getItem("fuellevelcolor_1");

						let fuelgauge = new Gauge(jQuery('.fuelgauge'), {

							values: {
								6.25: fuellevellabel_0
							},
							colors: {
								0: fuellevelcolor_0, 6.25: fuellevelcolor_1
							},
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
						if (actual_loadfactor > 0) {
							loadfactor = ((actual_loadfactor) / 60) * 100;
						} else {
							loadfactor = 0;
						}



						if (actual_loadfactor <= 0) {
							loadfactor = 0;
						} else if (actual_loadfactor >= 60) {
							loadfactor = 100;
						} else {
							loadfactor = actual_loadfactor;
						}


						let loadfactorlabel_0 = 48; //localStorage.getItem("loadfactorlabel_0");
						let loadfactorlabel_1 = 50; //localStorage.getItem("loadfactorlabel_1");

						let loadfactorcolor_0 = '#00ff50'; //localStorage.getItem("loadfactorcolor_0");
						let loadfactorcolor_1 = '#ffca00'; //localStorage.getItem("loadfactorcolor_1");
						let loadfactorcolor_2 = '#df0000'; //localStorage.getItem("loadfactorcolor_2");

						let loadpowergauge = new Gauge(jQuery('.loadpowergauge'), {

							values: {
								80: loadfactorlabel_0, 83: loadfactorlabel_1
							},
							colors: {
								0: loadfactorcolor_0, 80: loadfactorcolor_1, 83: loadfactorcolor_2
							},
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: loadfactor
						});
						// Load Factor


						let coolanttemplabel_0 = 0;//localStorage.getItem("coolanttemplabel_0");
						let coolanttemplabel_1 = 20;//localStorage.getItem("coolanttemplabel_1");
						let coolanttemplabel_2 = 97; //localStorage.getItem("coolanttemplabel_2");
						let coolanttemplabel_3 = 105;//localStorage.getItem("coolanttemplabel_3");
						let coolanttemplabel_4 = 120;  //localStorage.getItem("coolanttemplabel_4");
						let coolanttempcolor_0 = '#ffca00'; //localStorage.getItem("coolanttempcolor_0");
						let coolanttempcolor_1 = '#00FF50'; //localStorage.getItem("coolanttempcolor_1");
						let coolanttempcolor_2 = '#ffca00';// localStorage.getItem("coolanttempcolor_2");
						let coolanttempcolor_3 = '#df0000';// localStorage.getItem("coolanttempcolor_3");
						let coolanttempcolor_4 = '#df0000'; //localStorage.getItem("coolanttempcolor_4");





						// 1 Linear Graph For Coolant Temp
						var ctgradient1 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: coolanttempcolor_0 },
							{ offset: 1, color: coolanttempcolor_0 }]
						};

						var ctgradient2 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: coolanttempcolor_1 },
							{ offset: 1, color: coolanttempcolor_1 }]
						};

						var ctgradient3 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: coolanttempcolor_2 },
							{ offset: 1, color: coolanttempcolor_2 }]
						};

						var ctgradient4 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: coolanttempcolor_3 },
							{ offset: 1, color: coolanttempcolor_3 }]
						};

						var ctneedleGradient = {
							type: 'linearGradient',
							x0: 0,
							y0: 0.5,
							x1: 1,
							y1: 0.5,
							colorStops: [{ offset: 0, color: '#4F6169' },
							{ offset: 1, color: '#252E32' }]
						};


						jQuery('#coolanttemp').jqLinearGauge({
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
									maximum: 120,
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
									customTickMarks: [coolanttemplabel_0, coolanttemplabel_1, coolanttemplabel_2, coolanttemplabel_3, coolanttemplabel_4],
									ranges: [
										{
											startValue: 0,
											endValue: 20,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: ctgradient1
										},
										{
											startValue: 20,
											endValue: 97,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: ctgradient2
										},
										{
											startValue: 97,
											endValue: 105,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: ctgradient3
										},
										{
											startValue: 105,
											endValue: 120,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: ctgradient4
										}
									],
									needles: [
										{
											type: 'pointer',
											value: this.coolanttemp,
											fillStyle: ctneedleGradient,
											innerOffset: 0.50,
											outerOffset: 1.00
										}
									]
								}
							]

						});


						jQuery('#coolanttemp').bind('tooltipFormat', function (e, data) {

							var tooltip = '<b>Element: ' + data.elementType + '</b> ' + '<br />';

							switch (data.elementType) {

								case 'needle':
									tooltip += 'Value: ' + data.value;
									break;
								case 'range':
									tooltip += 'Start Value: ' + data.startValue + '<br/>End Value: ' + data.endValue;
							}

							return tooltip;
						});
						// 1 Linear Graph For Coolant Temp

						let oilpressurelabel_0 = 0; //localStorage.getItem("oilpressurelabel_0");
						let oilpressurelabel_1 = 1.0; //localStorage.getItem("oilpressurelabel_1");
						let oilpressurelabel_2 = 1.3; //localStorage.getItem("oilpressurelabel_2");
						let oilpressurelabel_3 = 10; //localStorage.getItem("oilpressurelabel_3");
						let oilpressurelabel_4 = '' //localStorage.getItem("oilpressurelabel_4");
						let oilpressurecolor_0 = '#df0000';//localStorage.getItem("oilpressurecolor_0");
						let oilpressurecolor_1 = '#ffca00';// localStorage.getItem("oilpressurecolor_1");
						let oilpressurecolor_2 = '#00FF50';//localStorage.getItem("oilpressurecolor_2");
						let oilpressurecolor_3 = '#00FF50'; //localStorage.getItem("oilpressurecolor_3");
						let oilpressurecolor_4 = '' //localStorage.getItem("oilpressurecolor_4");
						// 2 Linear Graph For Oil Pressure
						var gradient1 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: oilpressurecolor_0 },
							{ offset: 1, color: oilpressurecolor_0 }]
						};

						var gradient2 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: oilpressurecolor_1 },
							{ offset: 1, color: oilpressurecolor_1 }]
						};

						var gradient3 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: oilpressurecolor_2 },
							{ offset: 1, color: oilpressurecolor_2 }]
						};

						var needleGradient = {
							type: 'linearGradient',
							x0: 0,
							y0: 0.5,
							x1: 1,
							y1: 0.5,
							colorStops: [{ offset: 0, color: '#4F6169' },
							{ offset: 1, color: '#252E32' }]
						};


						jQuery('#oilpressure').jqLinearGauge({
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
									maximum: 10,
									labels: {
										offset: -2.15,
										font: '2px'
									},
									majorTickMarks: {
										length: 0,
										offset: 1,
										lineWidth: 2
									},
									minorTickMarks: {
										length: 0,
										visible: true,
										interval: 2,
										offset: 1,
										lineWidth: 2
									},
									customTickMarks: [oilpressurelabel_0, oilpressurelabel_1, oilpressurelabel_2, oilpressurelabel_3],
									ranges: [
										{
											startValue: 0,
											endValue: 1,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient1
										},
										{
											startValue: 1,
											endValue: 1.5,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient2
										},
										{
											startValue: 1.5,
											endValue: 10,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient3
										}
									],
									needles: [
										{
											type: 'pointer',
											value: this.oilpressure,
											fillStyle: needleGradient,
											innerOffset: 0.50,
											outerOffset: 1.00
										}
									]
								}
							]

						});


						jQuery('#oilpressure').bind('tooltipFormat', function (e, data) {

							var tooltip = '<b>Element: ' + data.elementType + '</b> ' + '<br />';

							switch (data.elementType) {

								case 'needle':
									tooltip += 'Value: ' + data.value;
									break;
								case 'range':
									tooltip += 'Start Value: ' + data.startValue + '<br/>End Value: ' + data.endValue;
							}

							return tooltip;
						});
						// 2 Linear Graph For Oil Pressure

						let loadpowerfactorlabel_0 = 0; //localStorage.getItem("loadpowerfactorlabel_0");
						let loadpowerfactorlabel_1 = 1.0; //localStorage.getItem("loadpowerfactorlabel_1");
						let loadpowerfactorcolor_0 = '#00FF50'; //localStorage.getItem("loadpowerfactorcolor_0");
						let loadpowerfactorcolor_1 = '#00FF50'; //localStorage.getItem("loadpowerfactorcolor_1");
						let loadpowerfactorcolor_2 = ''; //localStorage.getItem("loadpowerfactorcolor_2");
						let loadpowerfactorcolor_3 = ''; //localStorage.getItem("loadpowerfactorcolor_3");
						let loadpowerfactorcolor_4 = ''; //localStorage.getItem("loadpowerfactorcolor_4");
						// 3 Linear Graph For Load Power Factor
						var lpgradient1 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: loadpowerfactorcolor_0 },
							{ offset: 1, color: loadpowerfactorcolor_0 }]
						};



						var needleGradient = {
							type: 'linearGradient',
							x0: 0,
							y0: 0.5,
							x1: 1,
							y1: 0.5,
							colorStops: [{ offset: 0, color: '#4F6169' },
							{ offset: 1, color: '#252E32' }]
						};


						jQuery('#loadpowerfactor').jqLinearGauge({
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
									maximum: 1,
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
										visible: true,
										interval: 2,
										offset: 1,
										lineWidth: 2
									},
									customTickMarks: [loadpowerfactorlabel_0, loadpowerfactorlabel_1],
									ranges: [
										{
											startValue: 0,
											endValue: 1.0,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: lpgradient1
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


						jQuery('#loadpowerfactor').bind('tooltipFormat', function (e, data) {

							var tooltip = '<b>Element: ' + data.elementType + '</b> ' + '<br />';

							switch (data.elementType) {

								case 'needle':
									tooltip += 'Value: ' + data.value;
									break;
								case 'range':
									tooltip += 'Start Value: ' + data.startValue + '<br/>End Value: ' + data.endValue;
							}

							return tooltip;
						});
						// 3 Linear Graph For Load Power Factor

						let batteryvoltagelabel_0 = 0; //localStorage.getItem("batteryvoltagelabel_0");
						let batteryvoltagelabel_1 = 8; //localStorage.getItem("batteryvoltagelabel_1");
						let batteryvoltagelabel_2 = 16; ///localStorage.getItem("batteryvoltagelabel_2");
						let batteryvoltagelabel_3 = 24; //localStorage.getItem("batteryvoltagelabel_3");
						let batteryvoltagecolor_0 = '#ffca00'// localStorage.getItem("batteryvoltagecolor_0");
						let batteryvoltagecolor_1 = '#00FF50' //localStorage.getItem("batteryvoltagecolor_1");
						let batteryvoltagecolor_2 = '#ffca00' //localStorage.getItem("batteryvoltagecolor_2");
						let batteryvoltagecolor_3 = '#00FF50';//localStorage.getItem("batteryvoltagecolor_3");
						let batteryvoltagecolor_4 = '';//localStorage.getItem("batteryvoltagecolor_4");

						//4 Linear Graph For Battery Voltage
						var bvgradient1 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: batteryvoltagecolor_0 },
							{ offset: 1, color: batteryvoltagecolor_0 }]
						};

						var bvgradient2 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: batteryvoltagecolor_1 },
							{ offset: 1, color: batteryvoltagecolor_1 }]
						};

						var bvgradient3 = {
							type: 'linearGradient',
							x0: 0.5,
							y0: 0,
							x1: 0.5,
							y1: 1,
							colorStops: [{ offset: 0, color: batteryvoltagecolor_2 },
							{ offset: 1, color: batteryvoltagecolor_2 }]
						};

						var needleGradient = {
							type: 'linearGradient',
							x0: 0,
							y0: 0.5,
							x1: 1,
							y1: 0.5,
							colorStops: [{ offset: 0, color: '#4F6169' },
							{ offset: 1, color: '#252E32' }]
						};


						jQuery('#batteryvoltage').jqLinearGauge({
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
									maximum: 24,
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
										visible: true,
										interval: 2,
										offset: 1,
										lineWidth: 2
									},
									customTickMarks: [batteryvoltagelabel_0, batteryvoltagelabel_1, batteryvoltagelabel_2, batteryvoltagelabel_3],
									ranges: [
										{
											startValue: 0,
											endValue: 8,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: bvgradient1
										},
										{
											startValue: 8,
											endValue: 16,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: bvgradient2
										},
										{
											startValue: 16,
											endValue: 24,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: bvgradient3
										}
									],
									needles: [
										{
											type: 'pointer',
											value: this.batteryvoltage,
											fillStyle: needleGradient,
											innerOffset: 0.50,
											outerOffset: 1.00
										}
									]
								}
							]

						});


						jQuery('#batteryvoltage').bind('tooltipFormat', function (e, data) {

							var tooltip = '<b>Element: ' + data.elementType + '</b> ' + '<br />';

							switch (data.elementType) {

								case 'needle':
									tooltip += 'Value: ' + data.value;
									break;
								case 'range':
									tooltip += 'Start Value: ' + data.startValue + '<br/>End Value: ' + data.endValue;
							}

							return tooltip;
						});
						// 4 Linear Graph For Battery Voltage

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


					// if (this.timerswitch > 0) {
					// 	setTimeout(function () {
					// 		this.unitstimervalue;
					// 	}, 2000);
					// }
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
		// Linear Graph Calling
		//var randomvalue = this.getRandomInt(0, 10);
		/*
				var gradient1 = {
					type: 'linearGradient',
					x0: 0.5,
					y0: 0,
					x1: 0.5,
					y1: 1,
					colorStops: [{ offset: 0, color: '#df0000' },
					{ offset: 1, color: '#df0000' }]
				};
		
				var gradient2 = {
					type: 'linearGradient',
					x0: 0.5,
					y0: 0,
					x1: 0.5,
					y1: 1,
					colorStops: [{ offset: 0, color: '#ffca00' },
					{ offset: 1, color: '#ffca00' }]
				};
		
				var gradient3 = {
					type: 'linearGradient',
					x0: 0.5,
					y0: 0,
					x1: 0.5,
					y1: 1,
					colorStops: [{ offset: 0, color: '#00FF50' },
					{ offset: 1, color: '#00FF50' }]
				};
		
				var needleGradient = {
					type: 'linearGradient',
					x0: 0,
					y0: 0.5,
					x1: 1,
					y1: 0.5,
					colorStops: [{ offset: 0, color: '#4F6169' },
					{ offset: 1, color: '#252E32' }]
				};
		
		
				jQuery('#oilpressure').jqLinearGauge({
					orientation: 'horizontal',
					background: '#F7F7F7',
					border: {
						padding: 5,
						lineWidth: 2,
						strokeStyle: '#76786A'
					},
					tooltips: {
						disabled: false,
						highlighting: true
					},
					animation: {
						duration: 1
					},
					scales: [
						{
							minimum: 0,
							maximum: 10,
							labels: {
								offset: 0.15,
							},
							majorTickMarks: {
								length: 3,
								offset: 0.28,
								lineWidth: 2
							},
							minorTickMarks: {
								length: 3,
								visible: true,
								interval: 2,
								offset: 0.32,
								lineWidth: 2
							},
							ranges: [
								{
									startValue: 0,
									endValue: 1.0,
									innerOffset: 0.46,
									outerStartOffset: 0.50,
									outerEndOffset: 0.50,
									fillStyle: gradient1
								},
								{
									startValue: 1.0,
									endValue: 1.3,
									innerOffset: 0.46,
									outerStartOffset: 0.50,
									outerEndOffset: 0.50,
									fillStyle: gradient2
								},
								{
									startValue: 1.3,
									endValue: 10,
									innerOffset: 0.46,
									outerStartOffset: 0.50,
									outerEndOffset: 0.50,
									fillStyle: gradient3
								}
							],
							needles: [
								{
									type: 'pointer',
									value: this.coolanttemp,
									fillStyle: needleGradient,
									innerOffset: 0.50,
									outerOffset: 1.00
								}
							]
						}
					]
		
				});
		
		
				$('#oilpressure').bind('tooltipFormat', function (e, data) {
		
					var tooltip = '<b>Element: ' + data.elementType + '</b> ' + '<br />';
		
					switch (data.elementType) {
		
						case 'needle':
							tooltip += 'Value: ' + data.value;
							break;
						case 'range':
							tooltip += 'Start Value: ' + data.startValue + '<br/>End Value: ' + data.endValue;
					}
		
					return tooltip;
				});
		*/
		// Linear Graph Calling
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
	servicingInfo(unitId) {
		// if (this.timerswitch > 0) {
		// 	this.subscription.unsubscribe();
		// }

		// this.subscription.unsubscribe(x => {
		// 	this.unitstimervalue(0);
		// });


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
	alamInfo() {
		this.navCtrl.setRoot(AlarmPage, {
			record: this.NP.get("record")
		});
	}
	commentsInfo(unitId) {
		//this.navCtrl.setRoot(MenuPage);

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

	alarm() {
		// if (this.timerswitch > 0) {
		// 	this.subscription.unsubscribe();
		// }
		this.navCtrl.setRoot(AlarmlogPage, {
			record: this.NP.get("record")
		});
	}
	enginedetail() {
		// if (this.timerswitch > 0) {
		// 	this.subscription.unsubscribe();
		// }
		this.navCtrl.setRoot(EnginedetailviewPage, {
			record: this.NP.get("record")
		});
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

					this.conf.sendNotification(`Units was successfully deleted`);

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
					this.conf.sendNotification(`Dashboard view action successfully updated`);

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
		console.log("Show Graph function calling:-" + unit_id);

	}

}

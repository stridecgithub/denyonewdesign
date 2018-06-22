import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, ModalController, App } from 'ionic-angular';
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
declare var jQuery: any;
declare var Gauge: any;
//declare var jqLinearGauge: any;
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";
import { ViewunitPage } from '../viewunit/viewunit';

/**
 * Generated class for the UnitdetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
	selector: 'page-unitdetails',
	templateUrl: 'unitdetails.html'
})
export class UnitdetailsPage {
	private subscription: Subscription;
	footerBar: number = 1;
	public pageTitle: string;
	//public userId: any;
	public item = [];
	public setpointsdatastorage: any;
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
	loadpowerfactorneedlevalue;
	rolePermissionMsg;
	oilpressuerlabel;
	oilpressuercolors;
	batteryvoltlabel;
	batteryvoltcolors;
	loadfactor: any;
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
	loadpower: any;
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
	public uniteditable: boolean = false;
	public unitdeletable: boolean = false;
	public dataviewactive: boolean = true;

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
		contacts: '',
		mapicon: ''
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
	public UNITEDITACCESS: any;
	public UNITDELETEACCESS: any;
	devicewidth: any;
	deviceheight: any;
	select_text_device;
	edit_device;
	delete_device;
	pin_device;
	breakerindicatorimage;
	breakerindicatortext;
	constructor(public app: App, public modalCtrl: ModalController, public alertCtrl: AlertController, private conf: Config, public platform: Platform, public http: Http, private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams) {
		this.breakerindicatorimage = 'indicator@2x.png';
		this.breakerindicatortext = 'I / O';
		this.platform.ready().then(() => {
			this.platform.registerBackButtonAction(() => {
				const overlayView = this.app._appRoot._overlayPortal._views[0];
				if (overlayView && overlayView.dismiss) {
					overlayView.dismiss();
				}
				this.navCtrl.setRoot(UnitsPage);
			});
			this.devicewidth = platform.width();
			this.deviceheight = platform.height();
			//this.showAlert('Width: ', this.devicewidth);
			//this.showAlert('Height: ', this.deviceheight);
			if (this.devicewidth <= 320) {
				this.select_text_device = 'select-text-device-320';
				this.edit_device = 'edit-device-320';
				this.delete_device = 'delete-device-320';
				this.pin_device = 'pin-device-320';
			} else {
				this.select_text_device = 'select-text-device-360';
				this.edit_device = 'edit-device-360';
				this.delete_device = 'delete-device-360';
				this.pin_device = 'pin-device-360';
			}
		});

		this.unitDetailData.loginas = localStorage.getItem("userInfoName");
		this.unitDetailData.userId = localStorage.getItem("userInfoId");

		this.ENGINEDETAILVIEWACCESS = localStorage.getItem("UNITS_ENGINEMODEL_VIEW");
		this.UNITEDITACCESS = localStorage.getItem("UNITS_UNITSLISTING_EDIT");

		if (this.UNITEDITACCESS == 1) {
			this.uniteditable = false;
		} else {
			this.uniteditable = true;
		}

		this.UNITDELETEACCESS = localStorage.getItem("UNITS_LISTING_DELETE");

		if (this.UNITDELETEACCESS == 1) {
			this.unitdeletable = false;
		} else {
			this.unitdeletable = true;
		}


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

		this.apiServiceURL = this.conf.apiBaseURL();
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




	}
	// ngOnInit() {
	// 	let timer = TimerObservable.create(2000, 1000);
	// 	this.subscription = timer.subscribe(t => {
	// 		this.tick = t;
	// 	});
	// }
	presentModal(unit) {
		let modal = this.modalCtrl.create(ModalPage, { unitdata: unit });
		modal.present();
	}
	isNet() {
		let isNet = localStorage.getItem("isNet");
		if (isNet == 'offline') {
			this.conf.networkErrorNotification('You are now ' + isNet + ', Please check your network connection');
		}
	}
	ngOnDestroy() {
		// unsubscribe here
		this.subscription.unsubscribe();
	}
	ionViewDidLoad() {
		let ls;
		if (localStorage.getItem("setpointsdata") == undefined) {
			ls = '';
		}
		if (localStorage.getItem("setpointsdata") == '') {
			ls = '';
		}
		if (localStorage.getItem("setpointsdata") == 'undefined') {
			ls = '';
		}

		if (ls == '') {
			// Get Guage Details
			let //body: string = "loginid=" + this.userId,
				type2: string = "application/x-www-form-urlencoded; charset=UTF-8",
				headers2: any = new Headers({ 'Content-Type': type2 }),
				options2: any = new RequestOptions({ headers: headers2 }),
				url2: any = this.apiServiceURL + "/gaugedetails/" + this.navParams.get('record').controllerid;
			
			this.http.get(url2, options2)
				.subscribe((data) => {
					let res1;
					res1 = data.json();

					if (data.json().setpoints.length > 0) {
						localStorage.setItem("setpointsdata", JSON.stringify(data.json().setpoints));
						/*	this.navCtrl.setRoot(UnitdetailsPage, {
								record: item,
								setpointsdata: JSON.stringify(data.json().setpoints)
							});*/



						// Get Guage Details
						/*
						if (this.navParams.get("setpointsdata") != undefined) {
							this.setpointsdatastorage = JSON.parse(this.navParams.get("setpointsdata"));
							localStorage.setItem("setpointsdata", this.navParams.get("setpointsdata"));
						} else {
							this.setpointsdatastorage = JSON.parse(localStorage.getItem("setpointsdata"));
						}
						
						
						*/
						this.setpointsdatastorage = data.json().setpoints;
						if (this.setpointsdatastorage.length > 0) {
							for (let sp in this.setpointsdatastorage) {
								this.setpointsdata.push({
									code: this.setpointsdatastorage[sp].code,
									labels: this.setpointsdatastorage[sp].labels,
									colors: this.setpointsdatastorage[sp].colors,
									barlabels: this.setpointsdatastorage[sp].barlabels,
									minvalue: this.setpointsdatastorage[sp].minvalue,
									maxvalue: this.setpointsdatastorage[sp].maxvalue,
									barchartcolors: this.setpointsdatastorage[sp].barchartcolors
								})
							}
						}
						this.voltlabel = this.setpointsdata[0].labels;
						this.voltcolors = this.setpointsdata[0].colors;

						this.currentlabel = this.setpointsdata[1].labels;
						this.currentcolors = this.setpointsdata[1].colors;

						this.frequencylabel = this.setpointsdata[2].labels;
						this.frequencycolors = this.setpointsdata[2].colors;

						this.enginespeedlabel = this.setpointsdata[3].labels;
						this.enginespeedcolors = this.setpointsdata[3].colors;

						this.fuellabel = this.setpointsdata[4].labels;
						this.fuelcolors = this.setpointsdata[4].colors;

						this.loadpowerlabel = this.setpointsdata[5].labels;
						this.loadpowercolors = this.setpointsdata[5].colors;

						this.coolantlabel = this.setpointsdata[6].labels;
						this.coolantcolors = this.setpointsdata[6].colors;
						this.coolantbarlabels = this.setpointsdata[6].barlabels;

						this.oilpressuerlabel = this.setpointsdata[7].labels;
						this.oilpressuercolors = this.setpointsdata[7].colors;
						this.oilperssuerbarlabels = this.setpointsdata[7].barlabels;

						this.batteryvoltlabel = this.setpointsdata[8].labels;
						this.batteryvoltcolors = this.setpointsdata[8].colors;
						this.batteryvoltbarlabels = this.setpointsdata[8].barlabels;
						// Get Guage Details

					}
				}, error => {
					//this.networkType = this.conf.serverErrMsg();// + "\n" + error;

				});
			// Get Guage Details
		} else {
			this.setpointsdatastorage = JSON.parse(localStorage.getItem("setpointsdata"));
			if (this.setpointsdatastorage.length > 0) {
				for (let sp in this.setpointsdatastorage) {
					this.setpointsdata.push({
						code: this.setpointsdatastorage[sp].code,
						labels: this.setpointsdatastorage[sp].labels,
						colors: this.setpointsdatastorage[sp].colors,
						barlabels: this.setpointsdatastorage[sp].barlabels,
						minvalue: this.setpointsdatastorage[sp].minvalue,
						maxvalue: this.setpointsdatastorage[sp].maxvalue,
						barchartcolors: this.setpointsdatastorage[sp].barchartcolors
					})
				}
			}
			this.voltlabel = this.setpointsdata[0].labels;
			this.voltcolors = this.setpointsdata[0].colors;

			this.currentlabel = this.setpointsdata[1].labels;
			this.currentcolors = this.setpointsdata[1].colors;

			this.frequencylabel = this.setpointsdata[2].labels;
			this.frequencycolors = this.setpointsdata[2].colors;

			this.enginespeedlabel = this.setpointsdata[3].labels;
			this.enginespeedcolors = this.setpointsdata[3].colors;

			this.fuellabel = this.setpointsdata[4].labels;
			this.fuelcolors = this.setpointsdata[4].colors;

			this.loadpowerlabel = this.setpointsdata[5].labels;
			this.loadpowercolors = this.setpointsdata[5].colors;

			this.coolantlabel = this.setpointsdata[6].labels;
			this.coolantcolors = this.setpointsdata[6].colors;
			this.coolantbarlabels = this.setpointsdata[6].barlabels;

			this.oilpressuerlabel = this.setpointsdata[7].labels;
			this.oilpressuercolors = this.setpointsdata[7].colors;
			this.oilperssuerbarlabels = this.setpointsdata[7].barlabels;

			this.batteryvoltlabel = this.setpointsdata[8].labels;
			this.batteryvoltcolors = this.setpointsdata[8].colors;
			this.batteryvoltbarlabels = this.setpointsdata[8].barlabels;
		}



		// this.unitstimervalue(1);

		if (this.timerswitch > 0) {
			this.subscription = Observable.interval(2000).subscribe(x => {
				if (this.timerswitch > 0) {
					let unitid = localStorage.getItem("iframeunitId");

					//this.geninfo(unitid);
					let urlstr;

					if (this.tabs == 'dataView') {

						urlstr = "/" + unitid + "/" + this.unitDetailData.userId + "/unitdata";
						let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
							headers: any = new Headers({ 'Content-Type': type }),
							options: any = new RequestOptions({ headers: headers }),
							url: any = this.apiServiceURL + urlstr;
						this.http.get(url, options)
							.subscribe((data) => {

								// Votage
								this.volt1 = data.json().volt1;
								this.volt2 = data.json().volt2;
								this.volt3 = data.json().volt3;
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
								this.loadpower = parseFloat(data.json().loadpower);
								this.selectedloadpower = this.loadpower;
								// Load Power Factor

								this.commstatus = data.json().commstatus;

								this.enginestatus = data.json().enginestatus;

								this.enginestatuscolor = data.json().enginestatuscolor;
								if (this.enginestatuscolor == '') {
									this.enginestatuscolor = '#EDEDED';
								}

								this.commstatus = data.json().commstatus;
								if (this.commstatus == 'Offline') {
									this.commstatuscolor = "gray";
								} else {
									this.commstatuscolor = "#00BA28";
								}

								this.coolanttemp = data.json().coolanttemp;
								this.oilpressure = data.json().oilpressure;

								this.loadpowerfactor = data.json().loadpowerfactor;
								if (data.json().loadpowerfactor >= 1) {
									this.loadpowerfactorneedlevalue = 1;

								} else {
									this.loadpowerfactorneedlevalue = data.json().loadpowerfactor;
								}
								this.batteryvoltage = data.json().batteryvoltage;

							}, error => {

							});
						// Votage
						let voltage = 0;
						let actual_voltage = this.selectedvoltage;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;


						let diff = this.setpointsdata[0].maxvalue - this.setpointsdata[0].minvalue;
						if (actual_voltage < this.setpointsdata[0].minvalue)
							voltage = 0;
						else if (actual_voltage > this.setpointsdata[0].maxvalue)
							voltage = 100;
						else
							voltage = ((actual_voltage - this.setpointsdata[0].minvalue) / diff) * 100;



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
						/*
	
							if (this.selectedcurrent == parseFloat(this.setpointsdata[1].minvalue)) {
								current = 0;
	
							} else if (this.selectedcurrent >= parseFloat(this.setpointsdata[1].maxvalue)) {
	
								current = 100;
							} else {
	
								current = this.selectedcurrent;
							}
	
	*/

						let gaugevalcurrent;
						if (this.selectedcurrent < 0)
							gaugevalcurrent = 0;
						else if (this.selectedcurrent > 100) {
							if (this.selectedcurrent >= 150) {
								gaugevalcurrent = (this.selectedcurrent / 10) * 2;
							} else {
								gaugevalcurrent = 100;
							}
						}
						else
							gaugevalcurrent = this.selectedcurrent;

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
							value: gaugevalcurrent
						});
						// Current


						// Frequency
						let frequency = 0;

						let actual_frequency = this.freq;//Math.floor(Math.random() * (450 - 280 + 1)) + 280;


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
						this.loadfactor = 0;

						//Math.floor(Math.random() * (450 - 280 + 1)) + 280;

						let minvalue = this.setpointsdata[5].minvalue;
						let maxvalue = this.setpointsdata[5].maxvalue;
						/*if (mnfactor == '') {
							mnfactor = 0;
						}
						if (mxfactor == '') {
							mxfactor = 100;
						}
						if (actual_loadfactor <= parseFloat(mnfactor)) {
							loadfactor = 0;
						} else if (actual_loadfactor >= parseFloat(mxfactor)) {
							loadfactor = 100;
						} else {
							loadfactor = this.loadpower;
						}*/
						let gaugeval = 0;
						if (minvalue == '') { minvalue = 0; }
						if (maxvalue == '') { maxvalue = 100; }

						if (maxvalue < 100) {
							minvalue = 0;
							maxvalue = 100;
						}
						if (minvalue == 0 && maxvalue == 100) {
							if (this.loadpower < 0)
								this.loadfactor = 0;
							else if (this.loadpower > 100)
								this.loadfactor = 100;
							else
								this.loadfactor = this.loadpower;
						} else {


							this.loadfactor = this.loadpower / 2;
							if (minvalue > 200) {
								this.loadfactor = this.loadpower / 4;
							}

						}

						let loadpowerlabels = JSON.parse('{' + this.loadpowerlabel + '}');
						let loadpowercolors = JSON.parse('{' + this.loadpowercolors + '}');
						
						let loadfactorisnan = isNaN(this.loadfactor);
						if (loadfactorisnan == true) {
							this.loadfactor = 0;
						}

						
						let loadpowergauge = new Gauge(jQuery('.loadpowergauge'), {

							values: loadpowerlabels,
							colors: loadpowercolors,
							angles: [90, 380],
							lineWidth: 8,
							arrowWidth: 5,
							arrowColor: '#000',
							inset: false,
							value: this.loadfactor
						});
						// Load Factor







						var coolantbarlabels = this.coolantbarlabels.split(",");


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
						for (var i = 0; i < res.length; i++) {
							this.rangesdata = [];
							var code = res[i].code.toLowerCase();
							var labels = res[i].barlabels.split(',');
							var barchartcolors = res[i].barchartcolors.split(',');
							var sval = 0;
							var enval = 0;
							for (var x = 0; x < labels.length; x++) {
								if (x == 0) {
									sval = 0;

									enval = labels[x];



								} else {

									sval = labels[x - 1];
									enval = labels[x];

								}

								var gradver;


								if (code == 'batteryvolt') {
									/*if (barchartcolors[x] == "gradient1") {
										gradver = '#ffca00';
									}*/
									if (barchartcolors[x] == "gradient2") {
										gradver = '#ffca00';
									}
									if (barchartcolors[x] == "gradient3") {
										gradver = '#00ff50';
									}
								} else {
									if (barchartcolors[x] == "gradient1") {
										gradver = '#df0000';
									}
									if (barchartcolors[x] == "gradient2") {
										gradver = '#ffca00';
									}
									if (barchartcolors[x] == "gradient3") {
										gradver = '#00FF50';
									}
								}

								this.rangesdata.push({
									startValue: sval,
									endValue: enval,
									innerOffset: 0.46,
									outerStartOffset: 0.70,
									outerEndOffset: 0.70,
									fillStyle: gradver
								})



							}
							if (enval == res[i].maxvalue) {
								enval = sval;
							}
							if (res[i].maxvalue == '') {
								res[i].maxvalue = 100;
							}
							if (res[i].minvalue == '') {
								res[i].minvalue = 0;
							}
							let angle = 0;
							let labelofset = 0.30;

							if (code == 'oilpressure') {
								angle = -0.5;

								if (enval > 1.1 && enval <= 1.5) {


								}
								this.rangesdata.push({
									startValue: enval,
									endValue: res[i].maxvalue,
									innerOffset: 0.46,
									outerStartOffset: 0.70,
									outerEndOffset: 0.70,
									fillStyle: '#00FF50'
								})
							} else {
								if (code != 'batteryvolt') {
									this.rangesdata.push({
										startValue: enval,
										endValue: res[i].maxvalue,
										innerOffset: 0.46,
										outerStartOffset: 0.70,
										outerEndOffset: 0.70,
										fillStyle: '#df0000'
									})
								} else {
									this.rangesdata.push({
										startValue: enval,
										endValue: res[i].maxvalue,
										innerOffset: 0.46,
										outerStartOffset: 0.70,
										outerEndOffset: 0.70,
										fillStyle: '#ffca00'
									})
								}
							}

							if (code == "coolanttemp") {

								this.needlevalue = this.coolanttemp;

								if (this.coolanttemp > 120) {
									this.needlevalue = 120;
								} else if (this.coolanttemp <= 0) {
									this.needlevalue = 0;
								} else {
									this.needlevalue = this.coolanttemp;
								}

							}
							if (code == "oilpressure") {




								if (this.oilpressure <= 0) {
									this.needlevalue = 0;
								} else {
									this.needlevalue = this.oilpressure;
								}
								if (this.needlevalue >= 10) {
									this.needlevalue = 10;
								}
							}
							if (code == "batteryvolt") {

								if (this.batteryvoltage > res[i].maxvalue) {
									this.needlevalue = res[i].maxvalue;
								} else if (this.batteryvoltage <= 0) {
									this.needlevalue = 0;
								} else {
									this.needlevalue = this.batteryvoltage;
								}



							}

							if (this.needlevalue == undefined) {
								this.needlevalue = 0;
							}
							if (this.needlevalue == 'undefined') {
								this.needlevalue = 0;
							}

							let scalemax;
							scalemax = res[i].maxvalue;
							jQuery('#' + code).jqLinearGauge({
								orientation: 'horizontal',
								background: '#fff',
								width: this.devicewidth,
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
										maximum: scalemax,

										labels: {

											offset: labelofset,
											angle: angle

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
										customTickMarks: JSON.parse('[' + labels + ']'),
										ranges:
											this.rangesdata

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
							width: this.devicewidth,
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
										visible: false,
										interval: 2,
										offset: 1,
										lineWidth: 2
									},
									customTickMarks: [0, 1],//coolanttemplabel_0, coolanttemplabel_1, coolanttemplabel_2, coolanttemplabel_3, coolanttemplabel_4
									ranges: [
										{
											startValue: 0,
											endValue: 1,
											innerOffset: 0.46,
											outerStartOffset: 0.70,
											outerEndOffset: 0.70,
											fillStyle: gradient3
										}
									],
									needles: [
										{
											type: 'pointer',
											value: this.loadpowerfactorneedlevalue,
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
						
						this.http.get(url, options)
							.subscribe((data) => {
								this.commstatus = data.json().commstatus;
								if (this.commstatus == 'Offline') {
									this.commstatuscolor = "gray";
								} else {
									this.commstatuscolor = "#00BA28";
								}
								this.breakerindicatorimage = data.json().breakerindicatorimage;
								this.breakerindicatortext = data.json().breakerindicatortext
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
								if (this.enginestatuscolor == '') {
									this.enginestatuscolor = '#EDEDED';
								}
								this.dataviewactive = false;
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
		this.loadpowerfactorneedlevalue = 0;
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
		localStorage.setItem("fromModule", "UnitdetailsPage");
		this.geninfo(this.unitDetailData.unit_id);
		// UnitDetails Api Call		
		let
			type: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers: any = new Headers({ 'Content-Type': type }),
			options: any = new RequestOptions({ headers: headers }),
			url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.unitDetailData.userId +
				"&unitid=" + this.unitDetailData.unit_id;
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
					if (this.unitDetailData.unitname.length > 20) {

						this.unitDetailData.unitnameellipse = this.unitDetailData.unitname.substr(0, 25) + "...";

					} else {
						this.unitDetailData.unitnameellipse = this.unitDetailData.unitname;
					}

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
					this.unitDetailData.mapicon = data.json().units[0].mapicon;
				}
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});


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
					let body: string = "",
						type: string = "application/x-www-form-urlencoded; charset=UTF-8",
						headers: any = new Headers({ 'Content-Type': type }),
						options: any = new RequestOptions({ headers: headers }),
						url: any = this.apiServiceURL + "/remoteaction?controllerid=" + controllerid + "&controlaction=" + action + "&ismobile=1";




					//this.http.get(url, options)
					this.http.post(url, body, options)
						.subscribe((data) => {
							if (data.status === 200) {
								if (action == 'START') {
									this.startbtnenable = true;
								}

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
		this.dataviewactive = false;
		let //body: string = "loginid=" + this.userId,
			type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers1: any = new Headers({ 'Content-Type': type1 }),
			options1: any = new RequestOptions({ headers: headers1 }),
			url1: any = this.apiServiceURL + "/" + unitid + "/1/enginedetailsnewapi";
		this.http.get(url1, options1)
			.subscribe((data) => {
				let res;
				res = data.json();

				let unitdetails = res.genset_detail[0];

				this.unitDetailData.controllerid = unitdetails.controllerid;
				this.unitDetailData.neaplateno = unitdetails.neaplateno;
				this.unitDetailData.serialnumber = unitdetails.serialnumber;
				this.unitDetailData.generatormodel = unitdetails.generatormodel;
				this.unitDetailData.companygroup_name = unitdetails.companygroup_name;
				this.unitDetailData.alarmnotificationto = unitdetails.alarmnotificationto;






			}, error => {
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

		this.http.post(url, body, options)
			.subscribe((data) => {
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


		this.http.get(url1, options1)
			.subscribe((data) => {
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

			this.http.post(url, body, options)
				.subscribe((data) => {

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
		localStorage.setItem('currentlenth', "0");
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


			this.http.post(url, body, options)
				.subscribe((data) => {
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

		if (access == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('ENGINE DETAIL', this.rolePermissionMsg)
		} else {
			this.navCtrl.setRoot(EnginedetailviewPage, {
				record: this.NP.get("record")
			});
		}
		// this.navCtrl.setRoot(MenuPage);
	}
	previous() {
		// if (this.timerswitch > 0) {
		// 	this.subscription.unsubscribe();
		// }
		if (this.NP.get("page") == 'viewunit') {
			this.navCtrl.setRoot(ViewunitPage, {
				item: this.navParams.get('record'),
				from: this.navParams.get('from'),
			});
		} else {
			this.navCtrl.setRoot(UnitsPage);
		}
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
	doConfirm(id, access) {

		if (access == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('DELETE', this.rolePermissionMsg)
		} else {
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

		this.http.get(url, options)
			.subscribe((data) => {


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
	doAction(item, act, unitId, from, access) {

		if (access == true) {
			this.rolePermissionMsg = this.conf.rolePermissionMsg();
			this.showAlert('EDIT', this.rolePermissionMsg)
		} else {

			this.navCtrl.setRoot(AddUnitPage, {
				record: item,
				act: act,
				unitId: unitId,
				from: from
			});
			return false;
		}
	}

	selectVoltage(voltage) {
		this.voltageselection = voltage;
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



	}

}

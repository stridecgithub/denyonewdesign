<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Unit;
use App\Unitgroup;
use App\Staff;
use App\Service;
use App\CompanyGroup;
use App\DataTables\UnitDataTable;
use Yajra\Datatables\Datatables;
use DB;
use Symfony\Component\HttpFoundation\Session\Session;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use DateTime;

class UnitController extends Controller
{
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request, UnitDataTable $dataTable)
	{
		if($request->is_mobile == 1) {
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');
			$loginid = $request->input('loginid');
			$company_id = $request->input('company_id');
			$ids = array();
			$offlineids=array();
			$trippedids=array();
			$warningids=array();
			$runningids=array();
			$readystateids=array();
			$tmpunitids=array();

			$units = array();
			$unitslist = array();
			$todaydate=date('d M Y');
			 if($company_id == 1) {
				 $allunits = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('deletestatus',0)->where('unitgroups.delete_status','0')->orderBy('unit_id','desc')->get();	
			 }
			 else {
				 $allunits = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.companys_id',$company_id)->where('units.deletestatus',0)->orderBy('unit_id','desc')->where('unitgroups.delete_status','0')->get();
			 }
			
			if($sort == 'companygroup_name') {
				if($dir == 'asc') {
					$dir = 'desc';
				}
				else $dir = 'asc';
				if($company_id == 1) {
					$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->join('companygroups', 'companygroups.companygroup_id', '=', 'units.companys_id')->where('units.deletestatus',0)->orderBy('companygroups.'.$sort, $dir)->skip($startindex)->take($results)->get();
				}
				else {
					$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->join('companygroups', 'companygroups.companygroup_id', '=', 'units.companys_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->orderBy('companygroups.'.$sort, $dir)->skip($startindex)->take($results)->get();
				}		
			}
			elseif($sort == 'favorite') {
				$unit_ids = DB::table('unit_favorites')->where('staffs_id',$loginid)->select('units_id')->orderBy('units_id','desc')->get();
				//$unit_ids = DB::table('unit_favorites')->select('units_id')->orderBy('units_id','desc')->get();
				if(count($unit_ids) > 0) {
					foreach($unit_ids as $ug_ids) {
						$ugids[] = "'".$ug_ids->units_id."'";
					}
					$comma_ids = implode(',',$ugids);
					if($company_id == 1) {
						$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();
					}
					else {
						$unitslist = Unit::where('deletestatus',0)->where('units.companys_id',$company_id)->orderByRaw("FIELD(unit_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();
					}				
				}
				else {
					if($company_id == 1) {
						$unitslist = Unit::where('deletestatus',0)->skip($startindex)->take($results)->get();
					}
					else {
						$unitslist = Unit::where('deletestatus',0)->where('units.companys_id',$company_id)->skip($startindex)->take($results)->get();
					}
					
				}
			}
			elseif($sort == 'unitgroup') {
				$unit_ids = DB::table('unitgroups')->select('unitgroup_id')->orderBy('unitgroup_name','asc')->get();
				
				foreach($unit_ids as $ug_ids) {
					$ugids[] = "'".$ug_ids->unitgroup_id."'";
				}
				$comma_ids = implode(',',$ugids);
				if($company_id == 1) {
					$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unitgroups_id,$comma_ids) ".$dir)->skip($startindex)->take($results)->get();
				}
				else {
					$unitslist = Unit::where('deletestatus',0)->where('units.companys_id',$company_id)->orderByRaw("FIELD(unitgroups_id,$comma_ids) ".$dir)->skip($startindex)->take($results)->get();	
				}
				
			}
			elseif($sort == 'tripped') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->where('deletestatus','0')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($enginestate) > 0) {
							if($enginestate[0]->value == 12) {
								$ids[] = "'".$genid->unit_id."'";
							}
						}
					}
					$ids = implode(',',$ids);
					if($ids) {
						if($company_id == 1) {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
						}
						else {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();							
						}
					}
					else {
						if($company_id == 1) {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->skip($startindex)->take($results)->get();	
						}
						else {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->skip($startindex)->take($results)->get();
						}
					}
				}
			}
			elseif($sort == 'running') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->where('deletestatus','0')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($enginestate) > 0) {
							if($enginestate[0]->value == 7) {
								$ids[] = "'".$genid->unit_id."'";
							}
						}
					}
					$ids = implode(',',$ids);
					
					if($ids) {
						if($company_id == 1) {
						$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
							
						}
						else {
						$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();
							
						}
					}
					else {
						if($company_id == 1) {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->skip($startindex)->take($results)->get();	
						}
						else {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->skip($startindex)->take($results)->get();
						}
					}
				}
			}
			elseif($sort == 'warning') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->where('deletestatus','0')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($enginestate) > 0) {
							if($enginestate[0]->value == 7) {
								$alarms = DB::table('alarms')->where('alarm_unit_id', $genid->unit_id)->where('alarm_status', '0')->count();
								if(count($alarms) > 0)
									$ids[] = "'".$genid->unit_id."'";
							}
						}
					}
					$ids = implode(',',$ids);
					
					if($ids) {
						if($company_id == 1) {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
						}
						else {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();						
						}
					}
					else {
						if($company_id == 1) {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->skip($startindex)->take($results)->get();	
						}
						else {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->skip($startindex)->take($results)->get();
						}
					}
				}
			}
			elseif($sort == 'offline') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->where('deletestatus','0')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						if(count($enginestate) > 0) {
							$lastupdatetime = $enginestate[0]->timestamp;
							
							//echo date('Y-m-d H:i:s', strtotime('+5 minutes', strtotime('2011-04-8 08:29:49')));
							$currenttime = strtotime(date('Y-m-d H:i:s'));
							$addedthreemins = strtotime('+3 minutes',strtotime($lastupdatetime));
							
							
							if($addedthreemins < $currenttime) {
								$ids[] = "'".$genid->unit_id."'";
							}							
						}
					}					
					$ids = implode(',',$ids);					
					if($ids) {
						if($company_id == 1) {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
						}
						else {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();						
						}
					}
					else {
						if($company_id == 1) {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->skip($startindex)->take($results)->get();	
						}
						else {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->skip($startindex)->take($results)->get();
						}
					}
				}
			}
	// fathima coding for sorting status ->Asc Desc 
			elseif($sort == 'status')
			{
               	$generatorid = DB::table('units')->select('controllerid','unit_id')->where('deletestatus','0')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						if(count($enginestate) > 0) {
							$lastupdatetime = $enginestate[0]->timestamp;
							
							//echo date('Y-m-d H:i:s', strtotime('+5 minutes', strtotime('2011-04-8 08:29:49')));
							$currenttime = strtotime(date('Y-m-d H:i:s'));
							$addedthreemins = strtotime('+3 minutes',strtotime($lastupdatetime));
							
							
							if($addedthreemins < $currenttime) {
								$offlineids[] = "'".$genid->unit_id."'";
							}
							else
							{
								$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
								if(count($enginestate) > 0) {
									if($enginestate[0]->value == 12 || $enginestate[0]->value == 2) {
										  $trippedids[] = "'".$genid->unit_id."'";
									 }
									 elseif($enginestate[0]->value == 7)
									  {
											 	$alarms = DB::table('alarms')->where('alarm_unit_id', $genid->unit_id)->where('alarm_status', '0')->count();
											    if(count($alarms) > 0)
											    {
												   $warningids[] = "'".$genid->unit_id."'";
											    }
											    else
											    {
											    	$runningids[] = "'".$genid->unit_id."'";
											    }
									      
									}
								       elseif($enginestate[0]->value == 1 || $enginestate[0]->value == 4 || $enginestate[0]->value == 10)
								       {
								       	   $readystateids[] = "'".$genid->unit_id."'";
								       }

							     }
							}							
						}
						else
						{
							$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
							if(count($enginestate) > 0) {
								if($enginestate[0]->value == 12 || $enginestate[0]->value == 2) {
									  $trippedids[] = "'".$genid->unit_id."'";
								 }
								 elseif($enginestate[0]->value == 7)
								  {
										 	$alarms = DB::table('alarms')->where('alarm_unit_id', $genid->unit_id)->where('alarm_status', '0')->count();
										    if(count($alarms) > 0)
										    {
											   $warningids[] = "'".$genid->unit_id."'";
										    }
										    else
										    {
										    	$runningids[] = "'".$genid->unit_id."'";
										    }
								      
							        }
							       elseif($enginestate[0]->value == 1 || $enginestate[0]->value == 4 || $enginestate[0]->value == 10)
							       {
							       	   $readystateids[] = "'".$genid->unit_id."'";
							       }

						     }
						}

					}

					if($dir == 'asc')
					{
						$tmpunitids[] = array_merge($trippedids, $warningids, $offlineids, $runningids, $readystateids);
					}
					elseif($dir == 'desc')
					{
						$tmpunitids[] = array_merge($readystateids, $runningids, $offlineids, $warningids, $trippedids);
					}

                    $tmpunitids = $tmpunitids[0];                  
					$ids = implode(',',$tmpunitids);

		

					if($ids) {
						if($company_id == 1) {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)")->skip($startindex)->take($results)->get();
						}
						else {
							$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)")->skip($startindex)->take($results)->where('companys_id',$company_id)->get();						
						}
					}
					else {
						if($company_id == 1) {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->skip($startindex)->take($results)->get();	
						}
						else {
							$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->skip($startindex)->take($results)->get();
						}
					}

					
				}
			}

			else {
				if($company_id == 1) {
					$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('unitgroups.delete_status','0')->orderBy('units.'.$sort, $dir)->skip($startindex)->take($results)->get();	
				}
				else {
					$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->where('unitgroups.delete_status','0')->orderBy('units.'.$sort, $dir)->skip($startindex)->take($results)->get();
				}

			}
			
			//$units = array();
			
			if(count($unitslist) > 0)
			{
				$i = 0;

				foreach($unitslist as $unit)
				{
					
					$units[$i]['unit_id'] = $unit->unit_id;
					$units[$i]['unitname'] = $unit->unitname;
					$units[$i]['projectname'] = $unit->projectname;
					$units[$i]['controllerid'] = $unit->controllerid;
					$units[$i]['serialnumber'] = $unit->serialnumber;
					$units[$i]['neaplateno'] = $unit->neaplateno;
					$units[$i]['location'] = $unit->location;
					$units[$i]['companys_id'] = $unit->companys_id;
					$units[$i]['unitgroups_id'] = $unit->unitgroups_id;
					$units[$i]['models_id'] = $unit->models_id;
					$units[$i]['timezone'] = $unit->timezone;
					if($unit->alarmnotificationto != '') {
						$units[$i]['alarmnotificationto'] = str_replace(",", ' ', $unit->alarmnotificationto);
					} else {
						$units[$i]['alarmnotificationto'] = '';
					}
					
					$chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->where('staffs_id',$loginid)->get();
					
					if(count($chkfav) > 0)
					$units[$i]['favorite'] = 1;
					else
					$units[$i]['favorite'] = 0;
					
					$companygroup = CompanyGroup::where('companygroup_id', $unit->companys_id)->select('companygroup_name')->get();
					if(count($companygroup) > 0)
					  {
						$units[$i]['companygroup_name'] = $companygroup[0]->companygroup_name;
					    $units[$i]['group_name_firstletter']=$units[$i]['companygroup_name'][0];
					  }
					
					$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
					if(count($unitgroup) > 0)
					{
						$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
						$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}

					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
					if(count($currentstatus) > 0)
					{
						$units[$i]['runninghr'] = $currentstatus[0]->value;
					}
					else
						$units[$i]['runninghr'] = 0;
					
					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
					if(count($currentstatus) > 0)
					{
						
						$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						//print_r($chkstatusres);
						if(count($chkstatusres) > 0)
						{
							$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
							$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
							
							if($lastupdatestatus1 < $currentstatus1)
							  { 
								 $units[$i]['genstatus'] = 'Offline';
								 $units[$i]['compstatus']='Offline';


							     $units[$i]['gencolor']='#8C8C8A';  // gray colour
							   }
							else
							{
								if($currentstatus[0]->value == 1)
								  {
									$units[$i]['genstatus'] = 'Ready';
								    $units[$i]['gencolor']='#51B749'; // Green colour
								    $units[$i]['compstatus']='Online';

								  }
								else if($currentstatus[0]->value == 7)
								{
									$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
									if(count($alarms) > 0) { $units[$i]['genstatus'] = 'Warning'; $units[$i]['gencolor']='#ffca00'; } else { $units[$i]['genstatus'] = 'Running';  $units[$i]['compstatus']='Online';

 }
								}
								else if($currentstatus[0]->value == 2) { $units[$i]['genstatus'] = 'Not_Ready';  $units[$i]['gencolor']='#ff0000';  $units[$i]['compstatus']='Online';

}  // red colour
								else if($currentstatus[0]->value == 12) { $units[$i]['genstatus'] = 'Tripped'; $units[$i]['gencolor']='#ff0000'; $units[$i]['compstatus']='Online'; }   // red colour
								else { $units[$i]['genstatus'] = 'Offline'; $units[$i]['gencolor']='#8C8C8A'; $units[$i]['compstatus']='Offline'; }
							}
						}					
						else { $units[$i]['genstatus'] = 'Offline'; $units[$i]['gencolor']='#8C8C8A'; $units[$i]['compstatus']='Offline'; }
					}
					else { $units[$i]['genstatus'] = 'Offline'; $units[$i]['gencolor']='#8C8C8A'; $units[$i]['compstatus']='Offline'; }
					
				

					$services = Service::where('deletestatus','0')->where('service_unitid', $unit->unit_id)->whereRaw('(service_status = ? OR (DATE(service_scheduled_date) > ? AND service_status = ?))', [0, date('Y-m-d'), 1])->orderBy('service_scheduled_date', 'asc')->skip(0)->take(1)->get();
                   			
					$todaydate=date('d M Y');
					if(count($services) > 0)
					{
						if($services[0]->service_scheduled_date != '0000-00-00') {
							$units[$i]['nextservicedate'] = date("d M Y", strtotime($services[0]->service_scheduled_date));
							$units[$i]['nextservicedate_mobileview'] = date("d/m/Y", strtotime($services[0]->service_scheduled_date));						
							
							
							if($services[0]->serviced_by == '0' && (strtotime($todaydate) > strtotime($services[0]->service_scheduled_date)))
							{
								$units[$i]['nextservicedate_status']='duedate';
								$units[$i]['duedatecolor']='#C71717';
								
							}
							else
							{
								$units[$i]['nextservicedate_status']='upcoming';
								$units[$i]['duedatecolor']='';
								
							}
							
						} else {
							if($services[0]->serviced_by == '0' && (strtotime($todaydate) > strtotime($services[0]->service_scheduled_date)))
							{						
								$units[$i]['nextservicedate_status']='duedate';
								$units[$i]['duedatecolor']='#C71717';
							}
						}
						$units[$i]['service_id']=$services[0]->service_id;
							$units[$i]['servicedeletestatus']=$services[0]->deletestatus;
					}		
					else
					{
						$units[$i]['nextservicedate'] = '';
						$units[$i]['nextservicedate_status']='';
					}
						

					$contactslist = DB::table('unit_contacts')->where('units_id', $unit->unit_id)->get();

					$tmpcontacts = array();
					$contacts = '';
					
					if($contactslist)
					{
						foreach($contactslist as $contact)
						{
							$tmpcontacts[] = $contact->contact_name.'|'.$contact->contact_number; 
						}
						if($tmpcontacts)
						{
							$contacts = @implode("#", $tmpcontacts);
						}
					}
					if($contacts != '')
					{
						$units[$i]['contacts'] = $contacts;
					}
					$unitstatus='';
					$latlongs = DB::table('unit_latlong')->where('latlong_unit_id', $unit->unit_id)->whereRaw('(unit_latlong.gps_status = ? OR unit_latlong.gps_status = ?)', [2, 3])->get();
					if (count($latlongs) > 0) {
			
			$units[$i]['lat'] = $latlongs[0]->latitude;
						$units[$i]['lng'] = $latlongs[0]->longtitude;
			$gpstodatetime = strtotime($latlongs[0]->todatetime);
			$gpsfromdatetime = strtotime($latlongs[0]->fromdatetime);
			if($gpsfromdatetime != $gpstodatetime) {
				$gpsreceiveddate = strtotime($latlongs[0]->receiveddate);
				$addfourhours = strtotime("+4 hours", strtotime($latlongs[0]->todatetime));
				if($gpsreceiveddate > $addfourhours) {
				if($unitstatus == 'Offline') {
					$units[$i]['lat'] = '1.32';
								$units[$i]['lng'] = '103.701';
								$units[$i]['mapicon'] = '';
				}else{
					$units[$i]['mapicon'] = 'Multicolor';
				}
					
				}
			}
						
					}else {
						$units[$i]['lat'] = '1.32';
						$units[$i]['lng'] = '103.701';
						//$units[$i]['mapicon'] = '';
					}
					$cdate = date('Y-m-d H:i:s');					
					$datediff = date("Y-m-d H:i:s", strtotime($unit->createdon));
					if($cdate == $datediff)
						$timediff = 0;
					else
						$timediff = strtotime($cdate) - strtotime($datediff);
					
					//MORE THAN 24 HOURS
					if( $timediff > 86400 ) {
						$units[$i]['duration'] = '1';						
					}
					else {
						$units[$i]['duration'] = '0';
					}
					
					++$i;
				}	
			}					
			//exit;	
			
			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>count($allunits), 'units' => $units]);
		}
		else {
			$session = new Session();
			if(isset($request->unitgroup_id) && $request->unitgroup_id != '') {
				$unitgroupid = $request->unitgroup_id;
				$session->set('unitgroup_id',$unitgroupid);				
			}
			else {
				$session->set('unitgroup_id','');
			}
			$unitids = '';
			$company_id = $session->get('ses_company_id');			
			$staff_id   = $session->get('ses_login_id');
			if($company_id == 1) {
				$unitidsqry = Unit::where('deletestatus','0')->get();
			}
			else {
				$unitidsqry = Unit::where('deletestatus','0')->where('companys_id',$company_id)->get();
			}
			if(count($unitidsqry) > 0) {
				foreach($unitidsqry as $unitid) {
					$unitidsarr[] = $unitid->unit_id;
				}
				$unitids = implode('#',$unitidsarr);
			}
			
			$session->set('viewids', '');
			return $dataTable->render('Unit.index',['unitids'=>$unitids,'staff_id'=>$staff_id]);
		}

    }

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function create()
	{
		$session = new Session();
		$company_id = $session->get('ses_company_id');
		$login_id = $session->get('ses_login_id');		
		$enginemodels = DB::table('engine_models')->where('deletestatus',0)->get();
		if($company_id == 1)
		{
			$companies = CompanyGroup::where('deletestatus', '0')->get();
			$unitgroups = Unitgroup::where('delete_status', '0')->get();
			//$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->get();
		}
		else
		{
			$companies = CompanyGroup::where('deletestatus', '0')->where('companygroup_id', $company_id)->get();
			$unitgroups = Unitgroup::where('delete_status', '0')->where('company_id', $company_id)->get();
			//$staffs = DB::table('users')->where('company_id', $company_id)->get();
			//$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.company_id', $company_id)->get();
		}	

		$staffs = DB::table('staffs')->where('status', '0')->where('company_id', $company_id)->get();
		$staffids = '';
		if($staffs)
		{
			foreach($staffs as $staff)
			{		
				if($staff->personalhashtag != '')		
				$staffids[] = "'".substr($staff->personalhashtag, 1, strlen($staff->personalhashtag))."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		return view('Unit.create', ['companies' => $companies, 'unitgroups' => $unitgroups, 'enginemodels' => $enginemodels, 'staffids' => $staffids]);

	}

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request)
	{
		$session = new Session();		
		$serial_number='';
		if($request->serial_number!=''){
			$unitdata['serialnumber'] = $request->serial_number;
		}
		if($request->is_mobile == 1) {
			$login_id = $request->createdby;
		}
		else {
			$login_id = $session->get('ses_login_id');
		}		
		$unitdata['unitname'] = $request->unitname;
		$unitdata['projectname'] = $request->projectname;
		$unitdata['location'] = $request->location;
		$unitdata['controllerid'] = $request->controllerid;
		$unitdata['neaplateno'] = $request->neaplateno;
		$unitdata['serialnumber'] = $request->serial_number;
		$alarmnotifications = $request->alarmnotificationto;
		if($request->is_mobile == 0)
		{
			$alarmnotifications = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($alarmnotifications));
			$alarmnotifications = str_replace('</span>', '', $alarmnotifications);			
			$alarmnotifications = str_replace('&nbsp;', '', $alarmnotifications);
			$alarmnotifications = str_replace('<br>', '', $alarmnotifications);
			$alarmnotifications = str_replace('?', '', $alarmnotifications);
			$alarmnotifications = str_replace('\xE2\x80\x8D', '', $alarmnotifications);
			$alarmnotifications = str_replace('\u200d', '', $alarmnotifications);	
			$alarmnotifications = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($alarmnotifications));				
			$alarmnotifications = strip_tags(stripslashes($alarmnotifications));
		}
		$unitdata['alarmnotificationto'] = str_replace(' ', ',', $alarmnotifications);
		$alarmnotifications = str_replace(' ', ',', $alarmnotifications);
		if($request->unitgroups_id != '') {
			$unitdata['unitgroups_id'] = $request->unitgroups_id;
		}
		else {
			$unitdata['unitgroups_id'] = 0;
		}
		
		$unitdata['companys_id'] = $request->companys_id;
		$unitdata['models_id'] = $request->models_id;
		$unitdata['timezone'] = $request->timezone;
		$unitdata['createdby'] = $login_id;
		
		$alarmemails = $alarmhashtags = $tmpalarmnotifys = '';
		$tmpalarmnotifys = explode(',', $alarmnotifications);
		if($tmpalarmnotifys)
		{
			for($i = 0; $i < count($tmpalarmnotifys); $i++)
			{
				$tmp = $tmpalarmnotifys[$i];
				if($tmp)
				{
				if($tmp[0] == "@")
					$alarmhashtags[] = $tmpalarmnotifys[$i];
				else
					$alarmemails[] = $tmpalarmnotifys[$i];
				}
			}
			if($alarmhashtags && is_array($alarmhashtags))
				$alarmhashtags = implode(',', $alarmhashtags);
			if($alarmemails && is_array($alarmemails))
				$alarmemails = implode(',', $alarmemails);
		}
		
		$unitdata['alarmhashtags'] = $alarmhashtags;
		$unitdata['alarmemails'] = $alarmemails;
		
		DB::table('units')->insert($unitdata);

		$unitid = 1;
		$lastins = DB::table('units')->where('deletestatus', '0')->orderBy('unit_id', 'desc')->skip(0)->take(1)->get();
		if($lastins)
			$unitid = $lastins[0]->unit_id;

		if($request->is_mobile == 1)
		{
			$contacts = $request->contactInfo;
			$contacts = json_decode($contacts);
			for($i = 0; $i < count($contacts); $i++)
			{
				$contactname = $contacts[$i]->contact_name;
				$contactnumber = $contacts[$i]->contact_number;
				if($contactname != '' && $contactnumber != '') {
					DB::table('unit_contacts')->insert(['contact_name' => $contactname, 'contact_number' => $contactnumber, 'units_id' => $unitid]);
				}
			}				
		}
		else
		{
			$contactnames = $request->contact_names;
			$contactnumbers = $request->contact_numbers;

			if(count($contactnames) > 0)
			{
				DB::table('unit_contacts')->where('units_id', $unitid)->delete();
				for($x = 0; $x < count($contactnames); $x++)
				{
					$contactname = $contactnames[$x];
					$contactnumber = $contactnumbers[$x];
					if($contactname != '' && $contactnumber != '') {
						DB::table('unit_contacts')->insert(['contact_name' => $contactname, 'contact_number' => $contactnumber, 'units_id' => $unitid]);
					}
				}
			}
		}
		// Create dynamic table for store unit history
		Schema::create('unitdatahistory_'.$unitid, function($table)
	   	{
	   		$table->increments('id');
	   		$table->text('hexacode');
	   		$table->string('code');
	   		$table->string('genid');
	   		$table->string('currentval');
	   		$table->date('date');
	   		$table->string('time');
	   		$table->datetime('fromdateandtime');
			$table->datetime('todateandtime');
			$table->integer('runningstatus');
			$table->integer('loadstatus');
	   	});

		$unitlabels = DB::table('unit_labels')->get();
		foreach($unitlabels as $unitlabel)
		{
			$parentid = $unitlabel->id;
			$code = $unitlabel->code;			
			$hexavalue = "0";
			$generatorid = $request->controllerid;
			DB::table('unit_currentstatus')->insert(array('parentid' => $parentid, 'code' => $code, 'generatorid' => $generatorid, 'value' => $hexavalue, 'timestamp' => date("Y-m-d H:i:s")));
		}

		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Unit details created successfully'));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session->getFlashBag()->add('unit_created','Unit details created successfully.');
			return redirect('/units')->with('alert','Unit details created successfully');	
		}

	}

	/**
	* Display the specified resource.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function show($id)
	{
		//
	}

	/**
	* Show the form for editing the specified resource.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function edit($id)
	{
		$unitdetails = Unit::where('unit_id', $id)->get();	
		$session = new Session();
		
		$company_id = $session->get('ses_company_id');
		$login_id = $session->get('ses_login_id');		
		$enginemodels = DB::table('engine_models')->get();
		if($company_id == 1)
		{
			$companies = CompanyGroup::where('deletestatus', '0')->get();
			$unitgroups = Unitgroup::where('delete_status', '0')->get();
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->get();
		}
		else
		{
			$companies = CompanyGroup::where('deletestatus', '0')->where('companygroup_id', $company_id)->get();
			$unitgroups = Unitgroup::where('delete_status', '0')->where('company_id', $company_id)->get();
			//$staffs = DB::table('users')->where('company_id', $company_id)->get();
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.company_id', $company_id)->get();
		}		
		$staffids = '';
		if($staffs)
		{
			foreach($staffs as $staff)
			{
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		$enginemodels = DB::table('engine_models')->get();
		$unitcontacts = DB::table('unit_contacts')->where('units_id', $id)->where('contact_name','!=','')->get();
		$lat_lng = DB::table('unit_latlong')->where('latlong_unit_id',$id)->get();
		if(count($lat_lng) > 0) {
			//$lat_lng = $lat_lng[0]->latitude . ' / ' . $lat_lng[0]->longtitude;
			$lat_lng = "{Latitude:&nbsp;".$lat_lng[0]->latitude.", Longtitude:&nbsp;".$lat_lng[0]->longtitude."}";
		}
		else $lat_lng = '';
		$alarmnotify = @implode(' ', @explode(',', $unitdetails[0]->alarmnotificationto));
		return view('Unit.edit', ['unitdetails' => $unitdetails, 'unitcontacts' => $unitcontacts, 'companies' => $companies, 'unitgroups' => $unitgroups, 'enginemodels' => $enginemodels, 'staffids' => $staffids, 'alarmnotify' => $alarmnotify,'lat_lng'=>$lat_lng]);
	}

	/**
	* Update the specified resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function update(Request $request)
	{		
		$session = new Session();
		$serial_number='';
		if($request->serial_number!=''){
			$unitdata['serialnumber'] = $request->serial_number;
		}
 		$unitupdate = Unit::where('unit_id', $request->unit_id)->get();
		if($unitupdate->count() > 0 ) {
			
			$unitdata['unit_id'] = $request->unit_id;
			$unitdata['unitname'] = $request->unitname;
			$unitdata['projectname'] = $request->projectname;
			$unitdata['location'] = $request->location;
			$unitdata['controllerid'] = $request->controllerid;
			$unitdata['neaplateno'] = $request->neaplateno;
			$unitdata['serialnumber'] = $request->serial_number;
			$unitlng = $unitlat = '';
			if($request->is_mobile == 1) {
				$unitlat = $request->latitude;
				$unitlng = $request->longitude;				
			}
			else {
				$unitlat = $request->mylattitude;
				$unitlng = $request->mylongitute;				
			}

			$alarmnotifications = $request->alarmnotificationto;
			if($request->is_mobile == 0)
			{
				$alarmnotifications = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($alarmnotifications));
				$alarmnotifications = str_replace('</span>', '', $alarmnotifications);				
				$alarmnotifications = str_replace('&nbsp;', '', $alarmnotifications);
				$alarmnotifications = str_replace('<br>', '', $alarmnotifications);
				$alarmnotifications = str_replace('?', '', $alarmnotifications);
				$alarmnotifications = str_replace('\xE2\x80\x8D', '', $alarmnotifications);
				$alarmnotifications = str_replace('\u200d', '', $alarmnotifications);	
				$alarmnotifications = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($alarmnotifications));				
				$alarmnotifications = strip_tags(stripslashes($alarmnotifications));				
			}
			$unitdata['alarmnotificationto'] = str_replace(' ', ',', $alarmnotifications);
			$unitdata['unitgroups_id'] = $request->unitgroups_id;
			$unitdata['companys_id'] = $request->companys_id;
			$unitdata['models_id'] = $request->models_id;
			
			$alarmemails = $alarmhashtags = '';
			$tmpalarmnotifys = explode(' ', $alarmnotifications);
			if($tmpalarmnotifys)
			{
				for($i = 0; $i < count($tmpalarmnotifys); $i++)
				{
					$tmp = $tmpalarmnotifys[$i];
					if($tmp[0] == "@")
						$alarmhashtags[] = $tmpalarmnotifys[$i];
					else
						$alarmemails[] = $tmpalarmnotifys[$i];
				}
				if($alarmhashtags && is_array($alarmhashtags))
					$alarmhashtags = implode(',', $alarmhashtags);
				if($alarmemails && is_array($alarmemails))
					$alarmemails = implode(',', $alarmemails);
			}
			
			$unitdata['alarmhashtags'] = $alarmhashtags;
			$unitdata['alarmemails'] = $alarmemails;
			
			DB::table('units')->where('unit_id', $request->unit_id)->update($unitdata);
//			echo $unitlat.' '; echo $unitlng; die;  
			if($unitlat != '' && $unitlng != '') {
				
				$checkexits = DB::table('unit_latlong')->where('latlong_unit_id',$request->unit_id)->count();
				if($checkexits > 0) {
					DB::table('unit_latlong')->where('latlong_unit_id',$request->unit_id)->update(['latitude'=>$unitlat,'longtitude'=>$unitlng]);
				}
				else {
					DB::table('unit_latlong')->insert(['latlong_unit_id'=>$request->unit_id,'latitude'=>$unitlat,'longtitude'=>$unitlng]);
				}
				
			}

			$unitid = $request->unit_id;

			if($request->is_mobile == 1)
			{				
				$contacts = $request->contactInfo;
				if($contacts) {
					DB::table('unit_contacts')->where('units_id', $unitid)->delete();
					$contacts = json_decode($contacts);
					for($i = 0; $i < count($contacts); $i++)
					{
						$contactname = $contacts[$i]->contact_name;
						$contactnumber = $contacts[$i]->contact_number;
						DB::table('unit_contacts')->insert(['contact_name' => $contactname, 'contact_number' => $contactnumber, 'units_id' => $unitid]);
					}
				}				
			}
			else
			{
				$contactnames = $request->contact_names;
				$contactnumbers = $request->contact_numbers;

				if($contactnames)
				{					
					DB::table('unit_contacts')->where('units_id', $unitid)->delete();
					for($x = 0; $x < count($contactnames); $x++)
					{
						$contactname = $contactnames[$x];
						$contactnumber = $contactnumbers[$x];
						DB::table('unit_contacts')->insert(['contact_name' => $contactname, 'contact_number' => $contactnumber, 'units_id' => $unitid]);
					}
				}
			}

			DB::table('unit_currentstatus')->where('generatorid', $unitupdate[0]->controllerid)->update(array('generatorid' => $request->controllerid));			
		}
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Unit details updated successfully'));
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session->getFlashBag()->add('unit_updated','Unit details updated successfully');
			return redirect('/units')->with('alert','Unit details updated successfully');
		}
    }

	/**
	* Remove the specified resource from storage.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function delete($id, $ismobile)
	{
		$session = new Session();
		DB::table('units')->where('unit_id', $id)->update(array('deletestatus' => '1'));
		DB::table('unit_contacts')->where('units_id', $id)->delete();
		DB::table('unit_favorites')->where('units_id', $id)->delete(); 
		DB::table('view_on_dashboard')->where('view_unit_id', $id)->delete(); 
		
		$ctrl_id = Unit::where('unit_id',$id)->select('controllerid')->get();
		if(count($ctrl_id) > 0) {
			DB::table('unit_currentstatus')->where('generatorid',$ctrl_id[0]->controllerid)->delete();
		}		
		Schema::dropIfExists('unitdatahistory_'.$id);
		$staffs = Staff::where('status', '0')->orderBy("staff_id","desc")->get();
		if($ismobile == 0) {
			$session->getFlashBag()->add('unit_deleted','Unit details deleted successfully');
			return redirect('/units');
		}
		else {
			$msg = array(array('Error' => '0','result'=>'Unit details deleted successfully'));
			return response()->json(['staffs' => $staffs, 'msg'=>$msg]);
		}
    }

	/* Show the details of specific Unit */

	public function unitdetails($unitid, $ismobile)
	{
		
		$session = new Session();
		$session->set('unit_id', $unitid);
		$pageids = $session->get('viewids');
		$company_id = $session->get('ses_company_id');
		$loginid = $session->get('ses_login_id');

		$units = Unit::where('unit_id', $unitid)->get();
		$latlongqry = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		if(count($latlongqry) > 0) {
			$latlong = $latlongqry[0];
		}
		else {
			$latlong = new \stdClass();
		}
		$controllerid = $units[0]->controllerid;
		$unitgauges = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED', 'FUELLEVEL', 'LOADPOWER'])->get();
		$unitgauges1 = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED'])->get();
		$unitgauges2 = DB::table('unit_setpoints')->whereIn('code', ['FUELLEVEL', 'LOADPOWER'])->get();

		$unitbars = DB::table('unit_setpoints')->whereIn('code', ['COLLANTTEMP', 'OILPRESSURE', 'LOADPOWERFACTOR', 'BATTERYVOLTAGE'])->get();	
		$runninghr = 0;
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->get();

		$runninghrs = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->where('code', 'RUNNINGHR')->get();
		if(count($runninghrs) > 0) { $runninghr = $runninghrs[0]->value; }

		$unit = new Unit;
		$nextservicedate = $unit->nextservicedate($unitid);
		$colorcode = $unit->getstatuscolor($unitid);
		
		//Set Favorite (star)
		$unitfavorite = '0';
		$unit_favoriteqry = DB::table('unit_favorites')->where('units_id', $unitid)->where('staffs_id',$loginid)->get();
		if(count($unit_favoriteqry) > 0) {
			$unitfavorite = '1';
		}
		else {
			$unitfavorite = '0';
		}
		
		$servicecount = DB::table('service_notifications')->where('service_unit_id', $unitid)->where('service_staff_id', $loginid)->groupBy('services_id')->count();	

		$commentcount = DB::table('comment_notifications')->where('comment_unit_id', $unitid)->where('comment_staff_id', $loginid)->groupBy('comments_id')->count();
		
		$comments = DB::table('comments')->where('comment_unit_id', $unitid)->where('comment_status', 0)->orderBy('comment_id', 'desc')->skip(0)->take(3)->get();
		
		$login_id = 0;
		$viewpage = 'unitdetails'; 
		if($ismobile == 1)
			$viewpage = 'mobile_unitdetails';
		else
		{
			
			$login_id = $session->get('ses_login_id');	
		}	
		$randomkey = rand();
		$actlastunitid ='';
		$actfirstunitid='';

		if(is_array($pageids))
		{			
	
			if(count($pageids) > 1)
			{
				$first = $pageids[0];
				$last = end($pageids);
				$actunitid = "";
				if($first == $unitid)
				{
					$actfirstunitid = $first;
					$actlastunitid = $pageids[1];
					$session->set('sesfirstpos', 0);
					$session->set('seslastpos', 1);
					$session->set('sescurrentcount', 1);
				}
				else if($last == $unitid)
				{						
					$actfirstunitid = $pageids[count($pageids) - 2];
					$actlastunitid = $last;
					$session->set('sesfirstpos', count($pageids) - 2);
					$session->set('seslastpos', count($pageids));
					$session->set('sescurrentcount', count($pageids));
				}
				else
				{
					$tmplast = count($pageids) - 1;
					$tmpfirst = $session->get('sesfirstpos') - 1;
					if($tmpfirst <= 0)
						$tmpfirst = 0;
					if($session->get('seslastpos') < count($pageids) - 1)
					{
						$tmplast = $session->get('seslastpos') + 1;
					}
					//echo $tmpfirst."=".$tmplast;
					$session->set('sesfirstpos', $tmpfirst);
					$session->set('seslastpos', $tmplast);
					$actfirstunitid = $pageids[$tmpfirst];
					$actlastunitid = $pageids[$tmplast];
					$session->set('sescurrentcount', $tmplast);
				}							
			}
			else
			{
				$actlastunitid = $actfirstunitid = $pageids[0];
			}
		}

		// Speedo Meter & Bar chart set points from DB - Start 

		$setpoints = '';		
		$codearr = ['VOLT', 'CURRENT', 'FREQ', 'ENGINESPEED', 'FUEL', 'LOADPOWER', 'COOLANTTEMP', 'OILPRESSURE', 'BATTERYVOLT'];
		$colorcodes = ['SD' => '#df0000', 'L_WRN' => '#00ff50', 'WRN' => '#ffca00', 'BOC' => '#ffca00', 'G_WRN' => '#ffca00', 'L' => '#00ff50', 'H' => '#ffca00', 'NOM' => '#df0000'];
		$fuelcolorcodes = ['#00ff50'];
		$coolcolorcodes = ['#ffca00', '#00ff50'];
		$oilcolorcodes = ['#df0000', '#ffca00'];
		$freqcolorcodes = ['#ffca00', '#00ff50', '#ffca00', '#df0000'];	
		$freqcolorcodes1 = ['#00ff50', '#ffca00', '#df0000'];	
		$loadcolorcodes = ['#ffca00', '#df0000'];
		$barcolors = ['#df0000' => 'gradient1', '#ffca00' => 'gradient2', '#00ff50' => 'gradient3'];
		$dimensions = ['VOLT' => 'V', 'CURRENT' => 'A', 'FREQ' => 'Hz', 'ENGINESPEED' => 'RPM', 'FUEL' => '%', 'LOADPOWER' => 'kW', 'COOLANTTEMP' => '&deg C', 'OILPRESSURE' => 'bar', 'BATTERYVOLT' => 'V'];
		$i = 0;
		$setpointlabels = '';
		foreach($codearr as $key => $code) {  
			$labels = $values = $setpointlabels = $colors = $minvalue = $maxvalue = $barchartcolors = '';          
			$unitcodes = DB::table('setpoints')->where('code', $code)->where('controllerid', $controllerid)->get();
			if(count($unitcodes) <= 0) {
				$unitcodes = DB::table('setpoints')->where('code', $code)->where('controllerid', 'DEFAULTSETPOINT')->get();
			}
			foreach($unitcodes as $unitcode) {				
				if($unitcode->type != "Labels" && $unitcode->type != 'SP' && $unitcode->type != 'EP') {
					$values[] = $unitcode->value;
				} else if($unitcode->type == "Labels") {
					$labels = $unitcode->value;
				} else if($unitcode->type == "SP") {
					$minvalue = $unitcode->value;
				} else if($unitcode->type == "EP") {
					$maxvalue = $unitcode->value;
				}
			}
			
			if($labels != '') {				
				$labels = @explode(",", $labels);
				$labels = array_unique($labels);				
				sort($labels);
			}
			
			if($values && is_array($values)) {
				$values = array_unique($values);
				sort($values);
			} 
			

			for($x = 0; $x < count($values); $x++) {
				
				$setpointlabels[] = $labels[$x].':'.$values[$x];								
				if($code != "FUEL" && $code != "OILPRESSURE" && $code != "CURRENT" && $code != "LOADPOWER") {
					$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->where('type', '!=', 'EP')->where('type', '!=', 'SP')->get();
					if(count($forcolors) > 0) {	
						if(count($forcolors) > 1  && $code != "FREQ" && $code != "ENGINESPEED" && $code != "COOLANTTEMP") {
							$colors[] = '0:'.$colorcodes[$forcolors[1]->type];
							
							$barchartcolors[] = $barcolors[$colorcodes[$forcolors[1]->type]];
						}
						if($x == 0) {
							if($code == "COOLANTTEMP" || $code == "OILPRESSURE" || $code == "BATTERYVOLT") {
								$colors[] = '0:#00ff50';
								$barchartcolors[] = $barcolors['#00ff50'];
								
							} else {
								$colors[] = '0:#df0000';
								$barchartcolors[] = $barcolors['#df0000'];
							}
						}
						$colors[] = $labels[$x].':'.$colorcodes[$forcolors[0]->type];
						$barchartcolors[] = $barcolors[$colorcodes[$forcolors[0]->type]];
					}
				 } else if($code == "OILPRESSURE") {
					
					$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->get();
					if(count($forcolors) > 0) {					
						
						$colors[] = $labels[$x].':'.$oilcolorcodes[$x];
						$barchartcolors[] = $barcolors[$oilcolorcodes[$x]];
					}
					if($x == count($values) - 1) {
					 	$colors[] = '0:#00ff50';
						$barchartcolors[] = $barcolors['#df0000'];
					}
				 } else if($code == "LOADPOWER" || $code == "CURRENT") {
				 	$colors[] = '0:#00ff50';
					$barchartcolors[] = $barcolors['#00ff50'];
					$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->get();
					if(count($forcolors) > 0) {					
					
						$colors[] = $labels[$x].':'.$loadcolorcodes[$x];
						$barchartcolors[] = $barcolors[$loadcolorcodes[$x]];
					}
				 } else {
					if($code == "FUEL") {
						$colors[] = '0:#df0000';
						$barchartcolors[] = $barcolors['#df0000'];
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->get();
						if(count($forcolors) > 0) {					
						
							$colors[] = $labels[$x].':'.$fuelcolorcodes[$x];
							$barchartcolors[] = $barcolors[$fuelcolorcodes[$x]];
						}
					} else {
						$colors[] = '0:#df0000';
						$barchartcolors[] = $barcolors['#df0000'];
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->get();
						if(count($forcolors) > 0) {					
						
							$colors[] = $labels[$x].':'.$fuelcolorcodes[$x];
							$barchartcolors[] = $barcolors[$fuelcolorcodes[$x]];
						}
					}
				}
				
			}
			
			
			if($setpointlabels) {
				$setpointlabels = @implode(",", $setpointlabels);
			}	
			
			if($colors) {
				
				$colors = @implode(",", array_unique($colors));
			}
			
			$setpoints[$i]['code'] = $code;
			$setpoints[$i]['labels'] = $setpointlabels;
			$setpoints[$i]['colors'] = $colors;			
			$setpoints[$i]['barlabels'] = $values;
			$setpoints[$i]['dimensions'] = $dimensions[$code];
			$setpoints[$i]['minvalue'] = $minvalue;
			$setpoints[$i]['maxvalue'] = $maxvalue;
			$setpoints[$i]['barchartcolors'] = $barchartcolors;
			
			++$i;

		}
		
		//echo "<pre>";
		//print_r($setpoints); exit;
		// Speedo Meter & Bar chart set points from DB - End
		/*$colorcode = "8C8C8A";
		$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->where('code', 'ENGINESTATE')->get();
		
		if (count($chkstatusres) > 0) {
			$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
			$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
			
			if($lastupdatestatus1 < $currentstatus1)						
			{
				$colorcode = "8C8C8A";
			} else {
				if($chkstatusres[0]->value == 7 || $chkstatusres[0]->value == 3 || $chkstatusres[0]->value == 4 || $chkstatusres[0]->value == 10)
				{					
					$alarms = DB::table('unit_currentstatus')->where('generatorid', $units[0]->controllerid)->where('code', 'ALARMS')->get();
					if($alarms[0]->value > 0) {						
						$colorcode = "ffb400";
					} else {						
						$colorcode = "51B749";
					}
				} else if($chkstatusres[0]->value == 1) {
					$colorcode = "51B749";
				} else if($chkstatusres[0]->value == 2) {
					$colorcode = "ff0000";
				} else {
					$alarms = DB::table('alarms')->where('alarm_unit_id', $units[0]->unit_id)->where('alarm_status', 0)->get();
					if(count($alarms) > 0) {						
						$colorcode = "ff0000";
					}									
				} 
			}			
		}*/
		
		return view('Unit.'.$viewpage, ['unitgauges' => $unitgauges, 'unitgauges1' => $unitgauges1, 'unitgauges2' => $unitgauges2, 'unitid' => $unitid, 'controllerid' => $controllerid, 'currentstatus' => $currentstatus, 'nextservicedate' => $nextservicedate, 'servicecount' => $servicecount, 'unitbars' => $unitbars, 'commentcount' => $commentcount, 'comments' => $comments, 'staffid' => $login_id, 'randomkey' => $randomkey, 'runninghr' => $runninghr, 'pageids' => $pageids, 'actlastunitid' => $actlastunitid, 'actfirstunitid' => $actfirstunitid, 'unitdetail' => $units, 'latlong' => $latlong, 'unitfavorite'=>$unitfavorite, 'setpoints' => $setpoints, 'colorcode' => $colorcode]);
	}

	public function unitdetails1($unitid, $ismobile)
	{
		$session = new Session();
		$session->set('unit_id', $unitid);
		$pageids = $session->get('viewids');
		$company_id = $session->get('ses_company_id');
		$loginid = $session->get('ses_login_id');

		$units = Unit::where('unit_id', $unitid)->get();
		$latlongqry = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		if(count($latlongqry) > 0) {
			$latlong = $latlongqry[0];
		}
		else {
			$latlong = new \stdClass();
		}
		$controllerid = $units[0]->controllerid;
		$unitgauges = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED', 'FUELLEVEL', 'LOADPOWER'])->get();
		$unitgauges1 = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED'])->get();
		$unitgauges2 = DB::table('unit_setpoints')->whereIn('code', ['FUELLEVEL', 'LOADPOWER'])->get();

		$unitbars = DB::table('unit_setpoints')->whereIn('code', ['COLLANTTEMP', 'OILPRESSURE', 'LOADPOWERFACTOR', 'BATTERYVOLTAGE'])->get();	
		$runninghr = 0;
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->get();

		$runninghrs = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->where('code', 'RUNNINGHR')->get();
		if(count($runninghrs) > 0) { $runninghr = $runninghrs[0]->value; }

		$unit = new Unit;
		$nextservicedate = $unit->nextservicedate($unitid);
		
		//Set Favorite (star)
		$unitfavorite = '0';
		$unit_favoriteqry = DB::table('unit_favorites')->where('units_id', $unitid)->where('staffs_id',$loginid)->get();
		if(count($unit_favoriteqry) > 0) {
			$unitfavorite = '1';
		}
		else {
			$unitfavorite = '0';
		}
		
		$servicecount = DB::table('service_notifications')->where('service_unit_id', $unitid)->where('service_staff_id', $loginid)->count();	

		$commentcount = DB::table('comment_notifications')->where('comment_unit_id', $unitid)->where('comment_staff_id', $loginid)->count();
		
		$comments = DB::table('comments')->where('comment_unit_id', $unitid)->orderBy('comment_id', 'desc')->skip(0)->take(3)->get();
		
		$login_id = 0;
		$viewpage = 'unitdetails'; 
		if($ismobile == 1)
			$viewpage = 'mobile_unitdetails1';
		else
		{
			
			$login_id = $session->get('ses_login_id');	
		}	
		$randomkey = rand();
$actlastunitid ='';
$actfirstunitid='';

		if(is_array($pageids))
		{			
	// echo '<pre>';
// print_r($pageids);
// die;

			if(count($pageids) > 1)
			{
				$first = $pageids[0];
				$last = end($pageids);
				$actunitid = "";
				if($first == $unitid)
				{
					$actfirstunitid = $first;
					$actlastunitid = $pageids[1];
					$session->set('sesfirstpos', 0);
					$session->set('seslastpos', 1);
					$session->set('sescurrentcount', 1);
				}
				else if($last == $unitid)
				{						
					$actfirstunitid = $pageids[count($pageids) - 2];
					$actlastunitid = $last;
					$session->set('sesfirstpos', count($pageids) - 2);
					$session->set('seslastpos', count($pageids));
					$session->set('sescurrentcount', count($pageids));
				}
				else
				{
					$tmplast = count($pageids) - 1;
					$tmpfirst = $session->get('sesfirstpos') - 1;
					if($tmpfirst <= 0)
						$tmpfirst = 0;
					if($session->get('seslastpos') < count($pageids) - 1)
					{
						$tmplast = $session->get('seslastpos') + 1;
					}
					//echo $tmpfirst."=".$tmplast;
					$session->set('sesfirstpos', $tmpfirst);
					$session->set('seslastpos', $tmplast);
					$actfirstunitid = $pageids[$tmpfirst];
					$actlastunitid = $pageids[$tmplast];
					$session->set('sescurrentcount', $tmplast);
				}							
			}
			else
			{
				$actlastunitid = $actfirstunitid = $pageids[0];
			}
		}
		return view('Unit.'.$viewpage, ['unitgauges' => $unitgauges, 'unitgauges1' => $unitgauges1, 'unitgauges2' => $unitgauges2, 'unitid' => $unitid, 'controllerid' => $controllerid, 'currentstatus' => $currentstatus, 'nextservicedate' => $nextservicedate, 'servicecount' => $servicecount, 'unitbars' => $unitbars, 'commentcount' => $commentcount, 'comments' => $comments, 'staffid' => $login_id, 'randomkey' => $randomkey, 'runninghr' => $runninghr, 'pageids' => $pageids, 'actlastunitid' => $actlastunitid, 'actfirstunitid' => $actfirstunitid, 'unitdetail' => $units, 'latlong' => $latlong, 'unitfavorite'=>$unitfavorite]);
	}

	public function unitdetails2($unitid, $ismobile)
	{
		$session = new Session();
		$session->set('unit_id', $unitid);
		$pageids = $session->get('viewids');
		$company_id = $session->get('ses_company_id');
		$loginid = $session->get('ses_login_id');

		$units = Unit::where('unit_id', $unitid)->get();
		$latlongqry = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		if(count($latlongqry) > 0) {
			$latlong = $latlongqry[0];
		}
		else {
			$latlong = new \stdClass();
		}
		$controllerid = $units[0]->controllerid;
		$unitgauges = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED', 'FUELLEVEL', 'LOADPOWER'])->get();
		$unitgauges1 = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED'])->get();
		$unitgauges2 = DB::table('unit_setpoints')->whereIn('code', ['FUELLEVEL', 'LOADPOWER'])->get();

		$unitbars = DB::table('unit_setpoints')->whereIn('code', ['COLLANTTEMP', 'OILPRESSURE', 'LOADPOWERFACTOR', 'BATTERYVOLTAGE'])->get();	
		$runninghr = 0;
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->get();

		$runninghrs = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->where('code', 'RUNNINGHR')->get();
		if(count($runninghrs) > 0) { $runninghr = $runninghrs[0]->value; }

		$unit = new Unit;
		$nextservicedate = $unit->nextservicedate($unitid);
		
		//Set Favorite (star)
		$unitfavorite = '0';
		$unit_favoriteqry = DB::table('unit_favorites')->where('units_id', $unitid)->where('staffs_id',$loginid)->get();
		if(count($unit_favoriteqry) > 0) {
			$unitfavorite = '1';
		}
		else {
			$unitfavorite = '0';
		}
		
		$servicecount = DB::table('service_notifications')->where('service_unit_id', $unitid)->where('service_staff_id', $loginid)->count();	

		$commentcount = DB::table('comment_notifications')->where('comment_unit_id', $unitid)->where('comment_staff_id', $loginid)->count();
		
		$comments = DB::table('comments')->where('comment_unit_id', $unitid)->orderBy('comment_id', 'desc')->skip(0)->take(3)->get();
		
		$login_id = 0;
		$viewpage = 'unitdetails'; 
		if($ismobile == 1)
			$viewpage = 'mobile_unitdetails2';
		else
		{
			
			$login_id = $session->get('ses_login_id');	
		}	
		$randomkey = rand();
$actlastunitid ='';
$actfirstunitid='';

		if(is_array($pageids))
		{			
	// echo '<pre>';
// print_r($pageids);
// die;

			if(count($pageids) > 1)
			{
				$first = $pageids[0];
				$last = end($pageids);
				$actunitid = "";
				if($first == $unitid)
				{
					$actfirstunitid = $first;
					$actlastunitid = $pageids[1];
					$session->set('sesfirstpos', 0);
					$session->set('seslastpos', 1);
					$session->set('sescurrentcount', 1);
				}
				else if($last == $unitid)
				{						
					$actfirstunitid = $pageids[count($pageids) - 2];
					$actlastunitid = $last;
					$session->set('sesfirstpos', count($pageids) - 2);
					$session->set('seslastpos', count($pageids));
					$session->set('sescurrentcount', count($pageids));
				}
				else
				{
					$tmplast = count($pageids) - 1;
					$tmpfirst = $session->get('sesfirstpos') - 1;
					if($tmpfirst <= 0)
						$tmpfirst = 0;
					if($session->get('seslastpos') < count($pageids) - 1)
					{
						$tmplast = $session->get('seslastpos') + 1;
					}
					//echo $tmpfirst."=".$tmplast;
					$session->set('sesfirstpos', $tmpfirst);
					$session->set('seslastpos', $tmplast);
					$actfirstunitid = $pageids[$tmpfirst];
					$actlastunitid = $pageids[$tmplast];
					$session->set('sescurrentcount', $tmplast);
				}							
			}
			else
			{
				$actlastunitid = $actfirstunitid = $pageids[0];
			}
		}
		return view('Unit.'.$viewpage, ['unitgauges' => $unitgauges, 'unitgauges1' => $unitgauges1, 'unitgauges2' => $unitgauges2, 'unitid' => $unitid, 'controllerid' => $controllerid, 'currentstatus' => $currentstatus, 'nextservicedate' => $nextservicedate, 'servicecount' => $servicecount, 'unitbars' => $unitbars, 'commentcount' => $commentcount, 'comments' => $comments, 'staffid' => $login_id, 'randomkey' => $randomkey, 'runninghr' => $runninghr, 'pageids' => $pageids, 'actlastunitid' => $actlastunitid, 'actfirstunitid' => $actfirstunitid, 'unitdetail' => $units, 'latlong' => $latlong, 'unitfavorite'=>$unitfavorite]);
	}


	public function unitdetails3($unitid, $ismobile)
	{
		$session = new Session();
		$session->set('unit_id', $unitid);
		$pageids = $session->get('viewids');
		$company_id = $session->get('ses_company_id');
		$loginid = $session->get('ses_login_id');

		$units = Unit::where('unit_id', $unitid)->get();
		$latlongqry = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		if(count($latlongqry) > 0) {
			$latlong = $latlongqry[0];
		}
		else {
			$latlong = new \stdClass();
		}
		$controllerid = $units[0]->controllerid;
		$unitgauges = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED', 'FUELLEVEL', 'LOADPOWER'])->get();
		$unitgauges1 = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED'])->get();
		$unitgauges2 = DB::table('unit_setpoints')->whereIn('code', ['FUELLEVEL', 'LOADPOWER'])->get();

		$unitbars = DB::table('unit_setpoints')->whereIn('code', ['COLLANTTEMP', 'OILPRESSURE', 'LOADPOWERFACTOR', 'BATTERYVOLTAGE'])->get();	
		$runninghr = 0;
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->get();

		$runninghrs = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->where('code', 'RUNNINGHR')->get();
		if(count($runninghrs) > 0) { $runninghr = $runninghrs[0]->value; }

		$unit = new Unit;
		$nextservicedate = $unit->nextservicedate($unitid);
		
		//Set Favorite (star)
		$unitfavorite = '0';
		$unit_favoriteqry = DB::table('unit_favorites')->where('units_id', $unitid)->where('staffs_id',$loginid)->get();
		if(count($unit_favoriteqry) > 0) {
			$unitfavorite = '1';
		}
		else {
			$unitfavorite = '0';
		}
		
		$servicecount = DB::table('service_notifications')->where('service_unit_id', $unitid)->where('service_staff_id', $loginid)->count();	

		$commentcount = DB::table('comment_notifications')->where('comment_unit_id', $unitid)->where('comment_staff_id', $loginid)->count();
		
		$comments = DB::table('comments')->where('comment_unit_id', $unitid)->orderBy('comment_id', 'desc')->skip(0)->take(3)->get();
		
		$login_id = 0;
		$viewpage = 'unitdetails'; 
		if($ismobile == 1)
			$viewpage = 'mobile_unitdetails3';
		else
		{
			
			$login_id = $session->get('ses_login_id');	
		}	
		$randomkey = rand();
		$actlastunitid ='';
		$actfirstunitid='';

		if(is_array($pageids))
		{			
	// echo '<pre>';
// print_r($pageids);
// die;

			if(count($pageids) > 1)
			{
				$first = $pageids[0];
				$last = end($pageids);
				$actunitid = "";
				if($first == $unitid)
				{
					$actfirstunitid = $first;
					$actlastunitid = $pageids[1];
					$session->set('sesfirstpos', 0);
					$session->set('seslastpos', 1);
					$session->set('sescurrentcount', 1);
				}
				else if($last == $unitid)
				{						
					$actfirstunitid = $pageids[count($pageids) - 2];
					$actlastunitid = $last;
					$session->set('sesfirstpos', count($pageids) - 2);
					$session->set('seslastpos', count($pageids));
					$session->set('sescurrentcount', count($pageids));
				}
				else
				{
					$tmplast = count($pageids) - 1;
					$tmpfirst = $session->get('sesfirstpos') - 1;
					if($tmpfirst <= 0)
						$tmpfirst = 0;
					if($session->get('seslastpos') < count($pageids) - 1)
					{
						$tmplast = $session->get('seslastpos') + 1;
					}
					//echo $tmpfirst."=".$tmplast;
					$session->set('sesfirstpos', $tmpfirst);
					$session->set('seslastpos', $tmplast);
					$actfirstunitid = $pageids[$tmpfirst];
					$actlastunitid = $pageids[$tmplast];
					$session->set('sescurrentcount', $tmplast);
				}							
			}
			else
			{
				$actlastunitid = $actfirstunitid = $pageids[0];
			}
		}
		return view('Unit.'.$viewpage, ['unitgauges' => $unitgauges, 'unitgauges1' => $unitgauges1, 'unitgauges2' => $unitgauges2, 'unitid' => $unitid, 'controllerid' => $controllerid, 'currentstatus' => $currentstatus, 'nextservicedate' => $nextservicedate, 'servicecount' => $servicecount, 'unitbars' => $unitbars, 'commentcount' => $commentcount, 'comments' => $comments, 'staffid' => $login_id, 'randomkey' => $randomkey, 'runninghr' => $runninghr, 'pageids' => $pageids, 'actlastunitid' => $actlastunitid, 'actfirstunitid' => $actfirstunitid, 'unitdetail' => $units, 'latlong' => $latlong, 'unitfavorite'=>$unitfavorite]);
	}
	
	public function unitdetails_graph($unitid, $ismobile)
	{
		$session = new Session();
		$session->set('unit_id', $unitid);
		$pageids = $session->get('viewids');
		$company_id = $session->get('ses_company_id');
		$loginid = $session->get('ses_login_id');

		$units = Unit::where('unit_id', $unitid)->get();
		$latlongqry = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		if(count($latlongqry) > 0) {
			$latlong = $latlongqry[0];
		}
		else {
			$latlong = new \stdClass();
		}
		$controllerid = $units[0]->controllerid;
		$unitgauges = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED', 'FUELLEVEL', 'LOADPOWER'])->get();
		$unitgauges1 = DB::table('unit_setpoints')->whereIn('code', ['VOLT1', 'CURRENT1', 'FREQ', 'ENGINESPEED'])->get();
		$unitgauges2 = DB::table('unit_setpoints')->whereIn('code', ['FUELLEVEL', 'LOADPOWER'])->get();

		$unitbars = DB::table('unit_setpoints')->whereIn('code', ['COLLANTTEMP', 'OILPRESSURE', 'LOADPOWERFACTOR', 'BATTERYVOLTAGE'])->get();	
		$runninghr = 0;
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->get();

		$runninghrs = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->where('code', 'RUNNINGHR')->get();
		if(count($runninghrs) > 0) { $runninghr = $runninghrs[0]->value; }

		$unit = new Unit;
		$nextservicedate = $unit->nextservicedate($unitid);
		
		
		$servicecount = DB::table('service_notifications')->where('service_unit_id', $unitid)->where('service_staff_id', $loginid)->count();	

		$commentcount = DB::table('comment_notifications')->where('comment_unit_id', $unitid)->where('comment_staff_id', $loginid)->count();
		
		$comments = DB::table('comments')->where('comment_unit_id', $unitid)->orderBy('comment_id', 'desc')->skip(0)->take(3)->get();
		
		$login_id = 0;
		$viewpage = 'mobile_unitdetails_graph'; 
		if($ismobile == 1)
			$viewpage = 'mobile_unitdetails_graph';
		else
		{
			
			$login_id = $session->get('ses_login_id');	
		}	
		$randomkey = rand();
$actlastunitid ='';
$actfirstunitid='';

		if(is_array($pageids))
		{			
	// echo '<pre>';
// print_r($pageids);
// die;

			if(count($pageids) > 1)
			{
				$first = $pageids[0];
				$last = end($pageids);
				$actunitid = "";
				if($first == $unitid)
				{
					$actfirstunitid = $first;
					$actlastunitid = $pageids[1];
					$session->set('sesfirstpos', 0);
					$session->set('seslastpos', 1);
					$session->set('sescurrentcount', 1);
				}
				else if($last == $unitid)
				{						
					$actfirstunitid = $pageids[count($pageids) - 2];
					$actlastunitid = $last;
					$session->set('sesfirstpos', count($pageids) - 2);
					$session->set('seslastpos', count($pageids));
					$session->set('sescurrentcount', count($pageids));
				}
				else
				{
					$tmplast = count($pageids) - 1;
					$tmpfirst = $session->get('sesfirstpos') - 1;
					if($tmpfirst <= 0)
						$tmpfirst = 0;
					if($session->get('seslastpos') < count($pageids) - 1)
					{
						$tmplast = $session->get('seslastpos') + 1;
					}
					//echo $tmpfirst."=".$tmplast;
					$session->set('sesfirstpos', $tmpfirst);
					$session->set('seslastpos', $tmplast);
					$actfirstunitid = $pageids[$tmpfirst];
					$actlastunitid = $pageids[$tmplast];
					$session->set('sescurrentcount', $tmplast);
				}							
			}
			else
			{
				$actlastunitid = $actfirstunitid = $pageids[0];
			}
		}
		return view('Unit.mobile_unitdetails_graph', ['unitgauges' => $unitgauges, 'unitgauges1' => $unitgauges1, 'unitgauges2' => $unitgauges2, 'unitid' => $unitid, 'controllerid' => $controllerid, 'currentstatus' => $currentstatus, 'nextservicedate' => $nextservicedate, 'servicecount' => $servicecount, 'unitbars' => $unitbars, 'commentcount' => $commentcount, 'comments' => $comments, 'staffid' => $login_id, 'randomkey' => $randomkey, 'runninghr' => $runninghr, 'pageids' => $pageids, 'actlastunitid' => $actlastunitid, 'actfirstunitid' => $actfirstunitid, 'unitdetail' => $units, 'latlong' => $latlong ]);
	}

	public function unitdetailsforinterval(Request $request)
	{      
       		date_default_timezone_set("Asia/Singapore");
		$id = $request->input('unitid');

		$finalStatus = $alarm = "";

		if($request->ajax())
		{  
			$generatordetails = DB::table('unit_currentstatus')->where('generatorid', $id)->get();

			$units = DB::table('units')->where('controllerid', $id)->where('deletestatus', '0')->get();
			$unitid = $units[0]->unit_id;
			$tmpvals = $finalStatus = $detailpagevalue = $isalarm = $commstatus = '';
			$alarmpriority = 0;
			foreach($generatordetails as $generatordetail) { 
				$res = DB::table('unit_labels')->where('id', $generatordetail->parentid)->get();
				if(count($res) > 0)
				{
					$data = $res[0];
					$label = strtolower($data->code);
					$resultlabels[] = $label;
					$resultvalues[] = $generatordetail->value;
					$detailpagevalue .= $label.'#'.$generatordetail->value.'|';
					if($label == 'mode'){
						$currentMode = $generatordetail->value;
					}
					if($label == 'enginestate'){
						$currentState = $generatordetail->value;

					}
					if($label == 'alarm'){
						$currentAlarm = $generatordetail->value;
						//$alarmpriority = 3;
						$alarm = DB::table('alarms')->where('alarm_status', '0')->where('alarm_unit_id', $unitid)->get();						
					}
				}
			}

			$addonStatus = "";

			$showmodeactive = '';
			if($currentMode == "0")
				$showmodeactive = '|MANBTN#0|AUTOBTN#0|OFFBTN#1';
			else if($currentMode == '1')
				$showmodeactive = '|MANBTN#1|AUTOBTN#0|OFFBTN#0';
			else if($currentMode == '2')
				$showmodeactive = '|MANBTN#0|AUTOBTN#1|OFFBTN#0';
			else
				$showmodeactive = '|MANBTN#0|AUTOBTN#0|OFFBTN#1';


			// Mode = MAN, State = Ready
			if($currentMode == '1' && $currentState == '1' ){
				$addonStatus = 'STARTBTN#1|STOPBTN#0';
			}
            		// Mode = MAN , State=Not Ready
			else if($currentMode == '1' && $currentState == '2'){
				$addonStatus = 'STARTBTN#0|STOPBTN#0';
			}
			// Mode = Auto , State=Not Ready
			else if($currentMode == '2' && $currentState == '2'){
				$addonStatus = 'STARTBTN#0|STOPBTN#0';
			}
			// Mode = OFF , State=Not Ready
			else if($currentMode == '0' && $currentState == '2'){
				$addonStatus = 'STARTBTN#0|STOPBTN#0';
			}
			// Mode = MAN , State=Running
			else if($currentMode == '1' && $currentState == '7'){
				$addonStatus = 'STARTBTN#0|STOPBTN#1';
			}
			// Mode = Auto , State=Ready
			else if($currentMode == '2' && $currentState == '1')
			{
				$addonStatus = 'STARTBTN#1|STOPBTN#0';
			}
			// Mode = Auto , State=Running
			else if($currentMode == '2' && $currentState == '7')
			{
				$addonStatus = 'STARTBTN#0|STOPBTN#1';
			}
			else if($currentState == '4' || $currentState == "10")
			{
				$addonStatus = 'STARTBTN#1|STOPBTN#1';
			}
			else if($currentState == '12')
			{
				$addonStatus = 'STARTBTN#1|STOPBTN#0|MANBTN#1|AUTOBTN#0|OFFBTN#0';
			} else if($currentState == '8') {
				$addonStatus = 'STARTBTN#0|STOPBTN#1';
			}

			//$alarmres = DB::select('SELECT * FROM alarms WHERE alarm_unit_id = "'.$unitid.'" AND alarm_status = 0')->get();
			$alarmres = DB::table('unit_currentstatus')->where('generatorid', $id)->where('code', 'ALARMS')->get();
			//echo 'SELECT * FROM alarms WHERE alarm_unit_id = "'.$unitid.'" AND alarm_status = 0';
			//print_r($alarmres);
			if(count($alarmres) > 0)
			{
				if($alarmres[0]->value > 0) {
				$addonStatus = $addonStatus."|FAULTBTN#1";
				$isalarm = "ALARM#1";
				} else {
					$addonStatus = $addonStatus."|FAULTBTN#0";
				$isalarm = "ALARM#0";
				}
			}
			else
			{
				$addonStatus = $addonStatus."|FAULTBTN#0";
				$isalarm = "ALARM#0";
			}

			//Comm status check - start
			$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $id)->where('code', 'ENGINESTATE')->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
			if($chkstatusres)
			{
				$lastupdatestatus = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
				$currentstatus = strtotime(date("Y-m-d H:i:s"));
				if($lastupdatestatus < $currentstatus)
					$commstatus = "commstatus#Offline";
				else
					$commstatus = "commstatus#Online";
			}
			//$commstatus = "commstatus#Online";
			//Comm status check - end

			$finalStatus = $detailpagevalue.'---'.$addonStatus.$showmodeactive.'|---'.$isalarm.'|---'.$commstatus.'|---'.$currentState;

			if($tmpvals)
			{

				$tmpvals = @implode("|", $tmpvals);
			}
		
			$resultlabels = @implode("|", $resultlabels);
			$resultvalues = @implode("|", $resultvalues);
			$result = $resultlabels."#".$resultvalues;


			// SET POINT - START
			$setpoints = $graphsetpoints = '';		
			$codearr = ['VOLT', 'CURRENT', 'FREQ', 'ENGINESPEED', 'FUEL', 'LOADPOWER'];
			//$colorcodes = ['SD' => '#df0000', 'L_WRN' => '#00ff50', 'WRN' => '#ffca00', 'BOC' => '#ffca00', 'G_WRN' => '#ffca00', 'L' => '#00ff50', 'H' => '#ffca00', 'NOM' => '#df0000'];
			$colorcodes = ['SD' => '#df0000', 'L_WRN' => '#00ff50', 'WRN' => '#ffca00', 'BOC' => '#ffca00', 'G_WRN' => '#ffca00', 'L' => '#00ff50', 'H' => '#ffca00', 'NOM' => '#df0000'];
			$fuelcolorcodes = ['#00ff50', '#00ff50'];
			$coolcolorcodes = ['#ffca00', '#00ff50'];
			$oilcolorcodes = ['#df0000', '#ffca00'];
			$loadcolorcodes = ['#ffca00', '#df0000'];
			$freqcolorcodes = ['#ffca00', '#00ff50', '#ffca00', '#df0000'];
			$freqcolorcodes1 = ['#00ff50', '#ffca00', '#df0000'];
			$dimensions = ['VOLT' => 'V', 'CURRENT' => 'A', 'FREQ' => 'Hz', 'ENGINESPEED' => 'RPM', 'FUEL' => '%', 'LOADPOWER' => 'kW'];
			$i = 0;
			foreach($codearr as $key => $code) {  
				$labels = $values = $setpointlabels = $colors = $minvalue = $maxvalue = '';
				$setpoints = '';          
				$unitcodes = DB::table('setpoints')->where('code', $code)->where('controllerid', $id)->get();
				if(count($unitcodes) <= 0) {
					$unitcodes = DB::table('setpoints')->where('code', $code)->where('controllerid', 'DEFAULTSETPOINT')->get();
				}
				foreach($unitcodes as $unitcode) {				
					if($unitcode->type != "Labels" && $unitcode->type != 'SP' && $unitcode->type != 'EP') {
						$values[] = $unitcode->value;
					} else if($unitcode->type == "Labels") {
						$labels = $unitcode->value;
					} else if($unitcode->type == "SP") {
						$minvalue = $unitcode->value;
					} else if($unitcode->type == "EP") {
						$maxvalue = $unitcode->value;
					}
				}
			
				if($labels != '') {				
					$labels = @explode(",", $labels);
					$labels = array_unique($labels);				
					sort($labels);
				}
			
				if($values && is_array($values)) {
					$values = array_unique($values);
					sort($values);
				} 
				
				//$setpointlabels = "'{'";
				//'{'+'"10":"280",'+'"80":"420",'+'"90":"440"'+'}' 
				
				for($x = 0; $x < count($values); $x++) {			
					$setpointlabels[] = '"'.$labels[$x].'"'.':'.'"'.$values[$x].'"';
					$tmpcolor = $ftype1 = $ftype = '';
					if($code != "FUEL" && $code != "FREQ" && $code != "ENGINESPEED" && $code != "COOLANTTEMP" && $code != "OILPRESSURE" && $code != "LOADPOWER" && $code != "CURRENT") {
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->where('type', '!=', 'SP')->where('type', '!=', 'EP')->get();
						if(count($forcolors) > 0) {
							$ftype = '"'.$colorcodes[$forcolors[0]->type].'"';
							if(count($forcolors) > 1) {
								$ftype1 = '"'.$colorcodes[$forcolors[1]->type].'"';
								$colors[] = "\"0\"".':'.$ftype1;
							}
							if($x == 0) {							
								if($code == "BATTERYVOLT") {
									$tmpcolor = "#00ff50";
									$colors[] = "\"0\"".':'.'"'.$tmpcolor.'"';
								} else {
									$tmpcolor = "#df0000";
									$colors[] = "\"0\"".':'.'"'.$tmpcolor.'"';
								}
							}
							if($forcolors[0]->type == "L_WRN") {
								$tmpcolor = "#00ff50";
								$ftype = '"'.$tmpcolor.'"';
							}
							$colors[] = '"'.$labels[$x].'"'.':'.$ftype;
						}
					} else if($code == "FREQ" || $code == "ENGINESPEED") {
						$tmpcolor1 = "#df0000";
						$colors[] = "\"0\"".':'.'"'.$tmpcolor1.'"';
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->where('type', '!=', 'SP')->where('type', '!=', 'EP')->get();
						if(count($forcolors) > 0) {
							if(count($values) == 3)							
								$ftype = '"'.$freqcolorcodes1[$x].'"';
							else
								$ftype = '"'.$freqcolorcodes[$x].'"';
							$colors[] = '"'.$labels[$x].'"'.':'.$ftype;
						}
					} else if($code == "COOLANTTEMP") {
						if($x == 0) {						
						$tmpcolor1 = "#00ff50";
						$colors[] = "\"0\"".':'.'"'.$tmpcolor1.'"';
						}
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->where('type', '!=', 'SP')->where('type', '!=', 'EP')->get();
						if(count($forcolors) > 0) {							
							$ftype = '"'.$colorcodes[$forcolors[0]->type].'"';
							$colors[] = '"'.$labels[$x].'"'.':'.$ftype;
						}
					} else if($code == "LOADPOWER" || $code == "CURRENT") {
						if($x == 0) {						
						$tmpcolor1 = "#00ff50";
						$colors[] = "\"0\"".':'.'"'.$tmpcolor1.'"';
						}
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->where('type', '!=', 'SP')->where('type', '!=', 'EP')->get();
						if(count($forcolors) > 0) {	
							if(count($values) == 1)	{					
								$ftype = '"'.$loadcolorcodes[$x+1].'"';
								$colors[] = '"'.$labels[$x].'"'.':'.$ftype;
							} else {
								$ftype = '"'.$loadcolorcodes[$x].'"';
								$colors[] = '"'.$labels[$x].'"'.':'.$ftype;
							}
						}
					} else if($code == "OILPRESSURE") {						
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->where('type', '!=', 'SP')->where('type', '!=', 'EP')->get();
						if(count($forcolors) > 0) {							
							$ftype = '"'.$oilcolorcodes[$x].'"';
							$colors[] = '"'.$labels[$x].'"'.':'.$ftype;
						}
					} else {						
						$tmpcolor1 = "#df0000";
						$colors[] = "\"0\"".':'.'"'.$tmpcolor1.'"';
						$forcolors = DB::table('setpoints')->where('code', $code)->where('value', $values[$x])->where('type', '!=', 'Labels')->where('type', '!=', 'SP')->where('type', '!=', 'EP')->get();
						if(count($forcolors) > 0) {							
							$ftype = '"'.$fuelcolorcodes[$x].'"';
							$colors[] = '"'.$labels[$x].'"'.':'.$ftype;
						}
					}
				}
				//$setpointlabels .= "'}'";
				if($setpointlabels) {
					$setpointlabels = @implode(",", $setpointlabels);
				}
				
				if($colors) {
					$colors = @implode(",", array_unique($colors));
				}
				
				$setpoints[] = $code;
				$setpoints[] = $setpointlabels;
				$setpoints[] = $colors;
				$setpoints[] = @implode(",", $labels);	
				$setpoints[] = $minvalue;
				$setpoints[] = $maxvalue;
				$graphsetpoints[] = @implode("*---*", $setpoints);			
				
			}
			// SET POINT - END
			

			$unit = new Unit;			
			$colorcode = $unit->getstatuscolor($unitid);
			$finalStatus = $finalStatus.'|---'.@implode("**-**", $graphsetpoints).'|---'.$colorcode;

	    	}		
		echo $finalStatus;
		
	}
	
	public function checkalarm($unitid) {
		$alarmres = DB::table('alarms')->where('alarm_unit_id', $unitid)->where('alarm_status', '0')->count();
			
			if($alarmres > 0)
			{
				
				$isalarm = "1";
			}
			else
			{
				
				$isalarm = "0";
			}
			return response()->json(['msg'=>array('result'=>'success'),'alarm' => $isalarm]);
	}
	
	public function mobile_unitdetails(Request $request)
	{
		return view('Unit.mob_unitdetails');
	}

	
	public function getmodels() {		
		$models = DB::table('engine_models')->where('deletestatus', '0')->get();
		
		return response()->json(['msg'=>array('result'=>'success'),'models' => $models]);
	}
	
	
	//unit groups dropdown for API in create unit
	public function getunitgroups(Request $request) {
		if($request->company_id == 1) {
			$unitgroups = DB::table('unitgroups')->where('delete_status', '0')->get();
		}
		else {
			$unitgroups = DB::table('unitgroups')->where('delete_status', '0')->where('company_id',$request->company_id)->get();
		}

		
		return response()->json(['msg'=>array('result'=>'success'),'unitgroups' => $unitgroups]);
	}

	//For API
	public function checkcontrollerid(Request $request)
	{
		$chkname = $request->controllerid;
		$unitid = $request->unit_id;
		if($unitid == 0)
			$chkexist = DB::table('units')->where('deletestatus', '0')->where('controllerid', $chkname)->get();
		else
			$chkexist = DB::table('units')->where('deletestatus', '0')->where('controllerid', $chkname)->where('unit_id', '!=', $unitid)->get();
		
		if(count($chkexist) > 0)
		{
			$msg = array(array('Error' => '1','result'=>'Controller Id already exist!'));			
			return response()->json(['msg'=>$msg]);
		}
		else
		{
			$msg = array(array('Error' => '0','result'=>'Controller Id Available!'));			
			return response()->json(['msg'=>$msg]);
		}
	}
	
	//For Web
	public function check_ctrl_id(Request $request)
	{
		$chkname = $request->controllerid;
		$unitid = $request->unit_id;
		if($unitid == 0)
			$chkexist = DB::table('units')->where('deletestatus', '0')->where('controllerid', $chkname)->get();
		else
			$chkexist = DB::table('units')->where('deletestatus', '0')->where('controllerid', $chkname)->where('unit_id', '!=', $unitid)->get();
		
		if(count($chkexist) > 0)
			return 1;
		else
			return 0;
		
	}

	public function getpersonalhashtags()
	{
		$users = DB::table('users')->where('deletestatus', '0')->get();
		$personalhashtags = array();
		if($users)
		{
			$i = 0;
			foreach($users as $user)
			{
				$personalhashtags[$i] = $user->username;
				++$i;
			}
		}
		return response()->json(['msg' => array('result' => 'success'), 'personalhashtags' => $personalhashtags]);
	}

	public function removecommentcount(Request $request)
	{
		$unitid = $request->unitid;
		$userid = $request->userid;
		DB::table('comment_notifications')->where('comment_unit_id', $unitid)->where('comment_staff_id', $userid)->delete();
		echo 'removed';
	}

	public function removeservicecount(Request $request)
	{
		$unitid = $request->unitid;
		$userid = $request->userid;
		DB::table('service_notifications')->where('service_unit_id', $unitid)->where('service_staff_id', $userid)->delete();
		echo 'removed';
	}
	
	public function setunitfavorite(Request $request) {
		$result = '';
		$unitid = $request->unitid;
		$loginid = $request->loginid;		
		$is_mobile = $request->is_mobile;
		$company_id = $request->company_id;
		if(!$company_id) {
			$comp = DB::table('staffs')->where('staff_id', $loginid)->select('company_id')->get();
			if($comp) { $company_id = $comp[0]->company_id; }
		}
		$chkexist = DB::table('unit_favorites')->where('units_id', $unitid)->where('staffs_id',$loginid)->get();
		if(count($chkexist) > 0) {
			DB::table('unit_favorites')->where('units_id', $unitid)->where('staffs_id',$loginid)->delete();
			$result = 'unfav';
			$msg = '0';
		}
		else {
			DB::table('unit_favorites')->insert(['units_id' => $unitid, 'staffs_id' => $loginid ]);
			$result = 'fav';
			$msg = '1';
		}
		if($is_mobile == 1) {		
			if($company_id == 1) {	
				$allunits = DB::table('units')
		    		->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')
				->where('deletestatus',0)					
		    		->get();
			
				$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')
				->where('units.deletestatus',0)->get();
			} else {
				$allunits = DB::table('units')
		    		->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')
				->where('deletestatus',0)	
				->where('companys_id', $company_id)	
		    		->get();
			
				$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')
				->where('units.deletestatus',0)->where('units.companys_id', $company_id)->get();
			}
			$units = array();
			if(count($unitslist) > 0)
			{
				$i = 0;
				foreach($unitslist as $unit)
				{
					$units[$i]['unit_id'] = $unit->unit_id;
					$units[$i]['unitname'] = $unit->unitname;
					$units[$i]['projectname'] = $unit->projectname;
					$units[$i]['controllerid'] = $unit->controllerid;
					$units[$i]['neaplateno'] = $unit->neaplateno;
					$units[$i]['location'] = $unit->location;
					$units[$i]['companys_id'] = $unit->companys_id;
					$units[$i]['unitgroups_id'] = $unit->unitgroups_id;
					$units[$i]['models_id'] = $unit->models_id;
					//
					$chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->where('staffs_id',$loginid)->get();
					if(count($chkfav) > 0)
					$units[$i]['favorite'] = 1;
					else
					$units[$i]['favorite'] = 0;
					

// Current Status - Kannan
						$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
					if(count($currentstatus) > 0) {
						$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						
						if(count($chkstatusres) > 0) {
							$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
							$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
							
							if($lastupdatestatus1 < $currentstatus1)
								$units[$i]['genstatus'] = 'Offline';
							else
							{
								if($currentstatus[0]->value == 1)
									$units[$i]['genstatus'] = 'Ready';
								else if($currentstatus[0]->value == 7)
								{
									$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
									if(count($alarms) > 0) { $units[$i]['genstatus'] = 'Warning'; } else { $units[$i]['genstatus'] = 'Running'; }
								}
								else if($currentstatus[0]->value == 2) { $units[$i]['genstatus'] = 'Not_Ready'; }
								else if($currentstatus[0]->value == 12) { $units[$i]['genstatus'] = 'Tripped'; }
								else { $units[$i]['genstatus'] = 'Offline'; }
							}
						}					
						else { $units[$i]['genstatus'] = 'Offline'; }
					}
					else { $units[$i]['genstatus'] = 'Offline'; }


					$services = Service::where('deletestatus','0')->where('service_unitid', $unit->unit_id)->whereRaw('(service_status = ? OR (DATE(service_scheduled_date) > ? AND service_status = ?))', [0, date('Y-m-d'), 1])->orderBy('service_scheduled_date', 'asc')->skip(0)->take(1)->get();
                   			
					$todaydate=date('d M Y');
					if(count($services) > 0)
					{
						if($services[0]->service_scheduled_date != '0000-00-00') {
							$units[$i]['nextservicedate'] = date("d M Y", strtotime($services[0]->service_scheduled_date));
							$units[$i]['nextservicedate_mobileview'] = date("d/m/Y", strtotime($services[0]->service_scheduled_date));
						
							//if((strtotime($units[$i]['nextservicedate']) < strtotime($todaydate)) && ($services[0]->serviced_by == '0' || $services[0]->serviced_by == 'null' || $services[0]->serviced_by == ''))
							
							if($services[0]->serviced_by == '0' && (strtotime($todaydate) > strtotime($services[0]->service_scheduled_date)))
							{
								$units[$i]['nextservicedate_status']='duedate';
								$units[$i]['duedatecolor']='#C71717';
								
							}
							else
							{
								$units[$i]['nextservicedate_status']='upcoming';
								$units[$i]['duedatecolor']='';
								
							}
							
						} else {
							if($services[0]->serviced_by == '0' && (strtotime($todaydate) > strtotime($services[0]->service_scheduled_date)))
							{						
								$units[$i]['nextservicedate_status']='duedate';
								$units[$i]['duedatecolor']='#C71717';
							}
						}
						$units[$i]['service_id']=$services[0]->service_id;
							$units[$i]['servicedeletestatus']=$services[0]->deletestatus;
					}		
					else
					{
						$units[$i]['nextservicedate'] = '';
						$units[$i]['nextservicedate_status']='';
					}

					$units[$i]['timezone'] = $unit->timezone;
					$units[$i]['alarmnotificationto'] = $unit->alarmnotificationto;
					$companygroup = CompanyGroup::where('companygroup_id', $unit->companys_id)->select('companygroup_name')->get();
					if(count($companygroup) > 0) {
						$units[$i]['companygroup_name'] = $companygroup[0]->companygroup_name;
					}
					$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
					if(count($unitgroup) > 0)
					{
						$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
						$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}

					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
					if(count($currentstatus) > 0)
						$units[$i]['runninghr'] = $currentstatus[0]->value;

					$units[$i]['nextservicedate'] = '';
					
					++$i;
				}
			}

			if($msg=='1'){
				$favmsg='Favourite successfully';
			}else{
				$favmsg='Unfavourited successfully';
			}

			return response()->json(['msg' => array('result'=>$favmsg), 'totalCount'=>$allunits->count(), 'units' => $units,'favorite'=>$msg]);
		}
		else
			echo $result;
	}

	public function resetfault(Request $request)
	{
		$unitid = $request->unitid;
		DB::table('alarms')->where('alarm_unit_id', $unitid)->update(['alarm_status' => '1']);
		echo "Fault Reset Success";
	}

	public function getcount(Request $request)
	{
		$unitid = $request->unitid;
		$loginid = $request->loginid;
		$servicecount = DB::table('service_notifications')->join('services', 'services.service_id', '=', 'service_notifications.services_id')->where('services.deletestatus', '0')->where('service_notifications.service_unit_id', $unitid)->where('service_notifications.service_staff_id', $loginid)->count();	
		$commentcount = DB::table('comment_notifications')->join('comments', 'comments.comment_id', '=', 'comment_notifications.comments_id')->where('comments.comment_status', '0')->where('comment_notifications.comment_unit_id', $unitid)->where('comment_notifications.comment_staff_id', $loginid)->count();
		return response()->json(['msg' => array('result'=>'success'), 'servicecount'=>$servicecount, 'commentcount' => $commentcount]);
	}
	
	//function unitlistaction(Request $request,$id,$ismobile,$action) {		
	function unitlistaction(Request $request) {
		$ismobile = $request->is_mobile;
		$id = $request->unitid;
		$action = $request->action;
		if($ismobile == 1) {
			$ses_login_id = $request->loginid;
		}
		else {
			$session = new Session();
			$ses_login_id = $session->get('ses_login_id');			
		}
		$idsarr = explode(',',$id);
		if($action == 'delete') {
			foreach($idsarr as $id) {
				DB::table('units')->where('unit_id', $id)->update(array('deletestatus' => '1'));
				DB::table('unit_contacts')->where('units_id', $id)->delete();
				DB::table('unit_favorites')->where('units_id', $id)->delete(); 
				
				$ctrl_id = Unit::where('unit_id',$id)->select('controllerid')->get();
				if(count($ctrl_id) > 0) {
					DB::table('unit_currentstatus')->where('generatorid',$ctrl_id[0]->controllerid)->delete();
				}
				
				
				Schema::dropIfExists('unitdatahistory_'.$id);
			}
			if($ismobile == 0)
			return redirect('/units');
			else {
				$msg = array(array('Error' => '0','result'=>'Unit deleted successfully'));
				return response()->json([ 'msg'=>$msg]);
			}
		}
		if($action == 'dashboard') {			
			// foreach($idsarr as $id) {
				// DB::table('view_on_dashboard')->where('view_staff_id',$ses_login_id)->delete();						
			// }
			foreach($idsarr as $id) {
				$existing=DB::table('view_on_dashboard')->where('view_unit_id',$id)->where('view_staff_id',$ses_login_id)->get();
				if(count($existing)>0)
				{
					
				}
				else
				{
					DB::table('view_on_dashboard')->insert(array('view_unit_id' => $id,'view_staff_id'=>$ses_login_id));
				}
				
			}
			if($ismobile == 0) {				
				$session->getFlashBag()->add('unitviewon_dashboard', 'Selected units viewing in Dashboard');			
				return redirect('/units');
			}					
			else 
				return response()->json([ 'msg'=>array(array('Error' => '0','result'=>'Unit viewed in Dashboard successfully'))]);
			
		}
		if($action == 'view') {
			$i=0;
			if($ismobile == 1) {			
				//$unitdetails = DB::table('units')->where('unit_id',$id)->get();
				$unitdetails = DB::table('units')->whereIn('unit_id', $idsarr)->get();
				if(count($unitdetails) > 0) {
					foreach($unitdetails as $unit) {
					//$unitgroup = Unitgroup::select('colorcode')->where('unitgroup_id', $unit->unit_id)->get();
					$units[$i]['unit_id'] = $unit->unit_id;
					$units[$i]['unitname'] = $unit->unitname;
					$units[$i]['projectname'] = $unit->projectname;
					$units[$i]['controllerid'] = $unit->controllerid;
					$units[$i]['neaplateno'] = $unit->neaplateno;
					$units[$i]['location'] = $unit->location;
					$units[$i]['companys_id'] = $unit->companys_id;
					$nxtserddate = Service::where('deletestatus', '0')->where('next_service_date','!=','0000-00-00')->where('service_unitid', $unit->unit_id)->orderBy('service_id','desc')->skip(0)->take(1)->get();	
					if(count($nxtserddate) > 0) {
						 $units[$i]['nextservicedate'] = date('d M Y',strtotime($nxtserddate[0]->next_service_date));
						 $units[$i]['nextservicedate_mobileview'] = date('d/m/Y',strtotime($nxtserddate[0]->next_service_date));
					}
					else {
						$units[$i]['nextservicedate'] = '';
						$units[$i]['nextservicedate_mobileview'] ='';
					}
					$units[$i]['unitgroups_id'] = $unit->unitgroups_id;
					$units[$i]['models_id'] = $unit->models_id;
					$units[$i]['timezone'] = $unit->timezone;
					$units[$i]['alarmnotificationto'] = $unit->alarmnotificationto;
					
					//if(count($unitgroup) > 0) {
						//$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					//}
					$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
					if(count($unitgroup) > 0) {
						$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
						$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}
					else {
						$units[$i]['unitgroup_name'] = '';
						$units[$i]['colorcode'] = 'FFFFFF';
					}
					$chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->where('staffs_id',$ses_login_id)->get();
					if(count($chkfav) > 0)
						$units[$i]['favorite'] = 1;
					else
						$units[$i]['favorite'] = 0;
					
					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
					if(count($currentstatus) > 0) {
						$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						
						if(count($chkstatusres) > 0) {
							$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
							$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
							
							if($lastupdatestatus1 < $currentstatus1)
								$units[$i]['genstatus'] = 'Offline';
							else
							{
								if($currentstatus[0]->value == 1)
									$units[$i]['genstatus'] = 'Ready';
								else if($currentstatus[0]->value == 7)
								{
									$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
									if(count($alarms) > 0) { $units[$i]['genstatus'] = 'Warning'; } else { $units[$i]['genstatus'] = 'Running'; }
								}
								else if($currentstatus[0]->value == 2) { $units[$i]['genstatus'] = 'Not_Ready'; }
								else if($currentstatus[0]->value == 12) { $units[$i]['genstatus'] = 'Tripped'; }
								else { $units[$i]['genstatus'] = 'Offline'; }
							}
						}					
						else { $units[$i]['genstatus'] = 'Offline'; }
					}
					else { $units[$i]['genstatus'] = 'Offline'; }
					
					$i++;
					}
				}
				$msg = array(array('Error' => '0','result'=>'Unit viewed in Dashboard successfully'));
				return response()->json(['msg'=>$msg,'unitdetails'=>$units]);
			}
			else {
				$session->set('viewids', $idsarr);			
				if($idsarr[0] != '')
				return redirect('/'.$idsarr[0].'/0/unitdetails');
			}
		}		
	}
	
	function redirectunits(Request $request) {
		$unitid = $request->unitid;
		return redirect('/'.$unitid.'/0/unitdetails');
	}

	public function showgraph($id, $code, $ismobile)
	{
		$unitdata = '';
		$todate = date("Y-m-d");
		///$fromdate = date("Y-m-d", strtotime('-1 day'));
		$fromdate = date("Y-m-d");
		$units = Unit::where('unit_id', $id)->get();
		$units = $units[0];
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0) {
			$runninghrs = $currentstatus[0]->value;
		}
		$unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$id)->get();		

		$firstdata = DB::table('unitdatahistory_'.$id)->where('code', $code)->where('todateandtime', 'LIKE', "$fromdate%")->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();

		$unitdata = DB::table('unitdatahistory_'.$id)->where('code', $code)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'asc')->get();

		// fathima coding for api 

		//$timeframe = $request->seltimeframe;

         	//$formatted_date=date("Y-m-d H:i:s", strtotime('-30 minutes'));
		$formatted_date = date("Y-m-d H:i:s", strtotime('-3 days'));
		//echo $formatted_date;

         	$unitdataapi = DB::table('unitdatahistory_'.$id)->where('code', $code)->where('fromdateandtime','>=',$formatted_date)->orderBy('todateandtime', 'asc')->get();



		// fathima coding for api

	

		//$unitdata = DB::table('unitdatahistory_'.$id)->where('code', $code)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'asc')->get();
		
		
		//$unitdata = DB::select('SELECT * FROM unitdatahistory_'.$id.' WHERE code = "'.$code.'" AND todateandtime > "'.$fromdate.' 00:00:00" AND todateandtime <= "'.$todate.' 23:59:00"');

		
		if($ismobile == 0)
			$view = 'showgraph';
		else
			$view = 'trendline';
		return view('Unit.'.$view, ['unitdata' => $unitdata, 'units' => $units, 'code' => $code, 'id' => $id, 'timeframe' => '30 Mins', 'fromdate' => $fromdate, 'todate' => $todate, 'runninghrs' => $runninghrs, 'currentdate' => $todate, 'firstdata' => $firstdata,'unit_latlong' => $unit_latlong,'unitdataapi'=>$unitdataapi]);
	}

	public function viewgraph(Request $request)
	{
		$todate = $request->to;
		$fromdate = $request->from;
		$timeframe = $request->seltimeframe;
		$id = $request->unitid;
		$code = $request->code;
		$ismobile = $request->ismobile;
		$units = Unit::where('unit_id', $id)->get();
		$units = $units[0];
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0)
			$runninghrs = $currentstatus[0]->value;

		$firstdata = DB::table('unitdatahistory_'.$id)->where('code', $code)->where('todateandtime', 'LIKE', "$fromdate%")->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();

		$formatted_date=date("Y-m-d H:i:s", strtotime($fromdate.'-30 minutes'));
		if($timeframe == "30 Mins")
			$formatted_date=date("Y-m-d H:i:s", strtotime($fromdate.'-30 minutes'));
		else if($timeframe == "1 Hour")
			$formatted_date=date("Y-m-d H:i:s", strtotime($fromdate.'-60 minutes'));
		else if($timeframe == "1 Day")
			$formatted_date=date("Y-m-d H:i:s", strtotime($fromdate.'-1 Day'));
		else if($timeframe == "1 Week")
			$formatted_date=date("Y-m-d H:i:s", strtotime($fromdate.'-7 Days'));
		else if($timeframe == "1 Month")
			$formatted_date=date("Y-m-d H:i:s", strtotime($fromdate.'-1 Month'));

		$unitdata = DB::table('unitdatahistory_'.$id)->where('code', $code)->where('fromdateandtime','>=',$formatted_date)->orderBy('todateandtime', 'asc')->get();

		$unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$id)->get();	

		if($ismobile == 1)
			$view = 'trendline';
		else
			$view = 'showgraph';
		return view('Unit.'.$view, ['unitdata' => $unitdata, 'units' => $units, 'code' => $code, 'id' => $id, 'timeframe' => $timeframe, 'fromdate' => $fromdate, 'todate' => $todate, 'runninghrs' => $runninghrs, 'currentdate' => $todate, 'firstdata' => $firstdata,'unit_latlong' => $unit_latlong]);
	}
	
	function enginedetails($id,$ismobile) {
		if($ismobile == 1) {
			$model_id = DB::table('units')->where('unit_id',$id)->select('models_id')->get();
			if(count($model_id) > 0) {
				$modeldetails = DB::table('engine_models')->where('model_id',$model_id[0]->models_id)->select('model','rawhtml')->get();
			}
			return view('Unit.mobile_enginedetails',['modeldetails'=>$modeldetails,'id'=>$id]);
		}
		else {
			$model_id = DB::table('units')->where('unit_id',$id)->select('models_id')->get();
			$modeldetails = DB::table('engine_models')->where('model_id',$model_id[0]->models_id)->select('model','rawhtml')->get();
			$unitdata = Unit::where('unit_id',$id)->get();
			$unitlatlong =	DB::table('unit_latlong')->where('latlong_unit_id',$id)->get();					
			//
			$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unitdata[0]->controllerid)->where('code', 'RUNNINGHR')->get();
			$runninghrs = 0;
			if(count($currentstatus) > 0)
				$runninghrs = $currentstatus[0]->value;
			
			$services = Service::where('service_unitid', $id)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id','desc')->skip(0)->take(1)->get();
			if(count($services) > 0)
				$nextservicedate = $services[0]->next_service_date;
			else
				$nextservicedate = '';
			//

			$unit = new Unit;
			$nxtservicedate = $unit->nextservicedate($id);
			$colorcode = $unit->getstatuscolor($id);
			return view('Unit.enginedetails',['modeldetails'=>$modeldetails,'id'=>$id,'unitdata'=>$unitdata,'unitlatlong'=>$unitlatlong,'runninghrs'=>$runninghrs,'nextservicedate'=>$nextservicedate, 'colorcode' => $colorcode]);
		}
	}
	
	// For api
	function getunitdetailsbyid(Request $request) {
		//
		$loginid = $request->loginid;
		$unitslist = DB::table('units')->where('unit_id',$request->unitid)->where('deletestatus','0')->get();			
		if(count($unitslist) > 0) {
			$i = 0;
			foreach($unitslist as $unit) {					
				$units[$i]['unit_id'] = $unit->unit_id;
				$units[$i]['unitname'] = $unit->unitname;
				$units[$i]['projectname'] = $unit->projectname;
				$units[$i]['controllerid'] = $unit->controllerid;
				$units[$i]['neaplateno'] = $unit->neaplateno;
				$units[$i]['location'] = $unit->location;
				$units[$i]['companys_id'] = $unit->companys_id;
				$units[$i]['serialnumber'] = $unit->serialnumber;
				$companygroup = CompanyGroup::where('companygroup_id',$unit->companys_id)->get();
				if(count($companygroup) > 0) {
					$units[$i]['companygroup_name'] = $companygroup[0]->companygroup_name;
				}
				$units[$i]['unitgroups_id'] = $unit->unitgroups_id;
				$units[$i]['models_id'] = $unit->models_id;
				$units[$i]['timezone'] = $unit->timezone;
				$units[$i]['alarmnotificationto'] = $unit->alarmnotificationto;
				
				$chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->where('staffs_id',$loginid)->get();
				
				if(count($chkfav) > 0)
				$units[$i]['favorite'] = 1;
				else
				$units[$i]['favorite'] = 0;
				
				$companygroup = CompanyGroup::where('companygroup_id', $unit->companys_id)->select('companygroup_name')->get();
				if(count($companygroup) > 0)
					$units[$i]['companygroup_name'] = $companygroup[0]->companygroup_name;
				
				$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
				if(count($unitgroup))
				{
					$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
					$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
				}
				else {
					$units[$i]['unitgroup_name'] = '';
					$units[$i]['colorcode'] = 'FFFFFF';
				}

				$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
				if(count($currentstatus) > 0)
				{
					$units[$i]['runninghr'] = $currentstatus[0]->value;
				}
				else
					$units[$i]['runninghr'] = 0;


				$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
					if(count($currentstatus) > 0)
					{
						
						$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						//print_r($chkstatusres);
						if(count($chkstatusres) > 0)
						{
							$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
							$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
							
							if($lastupdatestatus1 < $currentstatus1)
							  { 
								 $units[$i]['genstatus'] = 'Offline';
								 $units[$i]['compstatus']='Offline';


								 $units[$i]['gencolor']='#8C8C8A';  // gray colour
								 $unitstatus = 'Offline';
								 $units[$i]['mapicon'] = '';
							   }
							else
							{
								if($currentstatus[0]->value == 1)
								  {
									$units[$i]['mapicon'] = 'Ready';
									$units[$i]['genstatus'] = 'Ready';
								    $units[$i]['gencolor']='#51B749'; // Green colour
								    $units[$i]['compstatus']='Online';
									$unitstatus = 'Ready';
								  }
								else if($currentstatus[0]->value == 7)
								{
									$units[$i]['mapicon'] = 'Warning';
									$unitstatus = 'Warning';
									$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
									if(count($alarms) > 0) { $units[$i]['genstatus'] = 'Warning'; } else { $units[$i]['genstatus'] = 'Running';  $units[$i]['compstatus']='Online';

 }
								}
								else if($currentstatus[0]->value == 2) {$unitstatus = 'Not Ready';$units[$i]['mapicon'] = 'Not_Ready'; $units[$i]['genstatus'] = 'Not_Ready';  $units[$i]['gencolor']='#ff0000';  $units[$i]['compstatus']='Online';

}  // red colour
								else if($currentstatus[0]->value == 12) {	$units[$i]['mapicon'] = 'Tripped';$unitstatus = 'Tripped'; $units[$i]['genstatus'] = 'Tripped'; $units[$i]['gencolor']='#ff0000'; $units[$i]['compstatus']='Online'; }   // red colour
								else {$units[$i]['mapicon'] = 'Offline';$unitstatus = 'Offline'; $units[$i]['genstatus'] = 'Offline'; $units[$i]['gencolor']='#8C8C8A'; $units[$i]['compstatus']='Offline'; }
							}
						}					
						else { $units[$i]['mapicon'] = 'Offline';$unitstatus = 'Offline';$units[$i]['genstatus'] = 'Offline'; $units[$i]['gencolor']='#8C8C8A'; $units[$i]['compstatus']='Offline'; }
					}
					else {$units[$i]['mapicon'] = 'Offline';$unitstatus = 'Offline'; $units[$i]['genstatus'] = 'Offline'; $units[$i]['gencolor']='#8C8C8A'; $units[$i]['compstatus']='Offline'; }

				
				//$services = Service::where('service_unitid', $unit->unit_id)->where('next_service_date','!=','0000-00-00')->select('next_service_date')->orderBy('service_unitid',$unit->unit_id)->skip(0)->take(1)->get();
				$services = Service::where('service_unitid', $unit->unit_id)->where('next_service_date','!=','0000-00-00')->where('next_service_date', '>', date("Y-m-d"))->select('next_service_date')->orderBy('next_service_date', 'asc')->skip(0)->take(1)->get();
				if(count($services) > 0)
					$units[$i]['nextservicedate'] = $services[0]->next_service_date;
				else
					$units[$i]['nextservicedate'] = '';

				$contactslist = DB::table('unit_contacts')->where('units_id', $unit->unit_id)->get();

				$tmpcontacts = array();
				$contacts = '';
				$contactnames='';
				$contactnumbers='';
				if($contactslist)
				{
					foreach($contactslist as $contact)
					{
						$tmpcontacts[] = $contact->contact_name.'|'.$contact->contact_number; 
						$contactnumbers.=$contact->contact_number.",";
						$contactnames.=$contact->contact_name.",";
					}
					if($tmpcontacts)
					{
						$contacts = @implode("#", $tmpcontacts);
					}
					if($contactnames!='')
					$units[$i]['contactpersonal']=substr($contactnames,0,-1);
					if($contactnumbers!='')
					$units[$i]['contactnumber']=substr($contactnumbers,0,-1);
				}
				if($contacts != '')
				{
					$units[$i]['contacts'] = $contacts;
				}
				/*$unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$unit->unit_id)->get();
				if(count($unit_latlong) > 0) {
					$units[$i]['lat'] = $unit_latlong[0]->latitude;
					$units[$i]['lng'] = $unit_latlong[0]->longtitude;
				}
				else {
					$units[$i]['lat'] = '';
					$units[$i]['lng'] = '';
				}*/
			
				$latlongs =DB::table('unit_latlong')->where('latlong_unit_id',$unit->unit_id)->get();
                        if (count($latlongs) > 0) {
			    
			    $units[$i]['lat'] = $latlongs[0]->latitude;
                            $units[$i]['lng'] = $latlongs[0]->longtitude;
			    $gpstodatetime = strtotime($latlongs[0]->todatetime);
			    $gpsfromdatetime = strtotime($latlongs[0]->fromdatetime);
			    if($gpsfromdatetime != $gpstodatetime) {
				    $gpsreceiveddate = strtotime($latlongs[0]->receiveddate);
				    $addfourhours = strtotime("+4 hours", strtotime($latlongs[0]->todatetime));
				    if($gpsreceiveddate > $addfourhours) {
					if($unitstatus == 'Offline') {
						$units[$i]['lat'] = '1.32';
									$units[$i]['lng'] = '103.701';
									$units[$i]['mapicon'] = '';
					}else{
						$units[$i]['mapicon'] = 'Multicolor';
					}
				    	
				    }
			    }
                            
						} else {
                            $units[$i]['lat'] = '1.32';
							$units[$i]['lng'] = '103.701';
							//$units[$i]['mapicon'] = '';
						}
						
				++$i;
			}
			return response()->json(['msg' => array('result'=>'success'),  'units' => $units]);
		}	
	}
	
	function getunitcurrentstatus(Request $request) {
		$unitid = $status = $commstatus = '';
		$inputunitids = $request->unitids;
		$unitidsarr = explode('#',$inputunitids);
		//date_default_timezone_set("Asia/Singapore");
		if($unitidsarr) {
			$unitids = Unit::whereIn('unit_id',$unitidsarr)->where('deletestatus','0')->select('unit_id','controllerid')->get();			
			foreach($unitids as $unit) {	
				$chkstatusres = '';			
				$unitid = $unit->unit_id;
				//Comm status check - start
				$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
				if(count($chkstatusres) > 0) {
					$lastupdatestatus = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
					$currentstatus = strtotime(date("Y-m-d H:i:s"));
					
					if($lastupdatestatus < $currentstatus)
					{
						$commstatus = "OFFLINE";
						$status[] = $unitid.'#OFFLINE#'.$commstatus;
					}
					else
					{
						$commstatus = "Online";
						$genstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($genstatus) > 0) {
							$statusvalue = $genstatus[0]->value;					
							if($statusvalue == "7") {
								$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->count();
								if($alarms > 0)
									$status[] = $unitid.'#WARNNING#'.$commstatus;
								else
									$status[] = $unitid.'#RUNNING#'.$commstatus;						
							}
							
							else if($statusvalue == "2") {
								$status[] = $unitid.'#NOT READY#'.$commstatus;
							}
							else if($statusvalue == "12") {
								$status[] = $unitid.'#TRIPPED#'.$commstatus;
							}
							else if($statusvalue == "8" || $statusvalue == "9" || $statusvalue == "10" || $statusvalue == "11") {
								$status[] = $unitid.'#COOLING#'.$commstatus;
							}
							else if($statusvalue == "4" || $statusvalue == "5" || $statusvalue == "6") {
								$status[] = $unitid.'#CRANKING#'.$commstatus;
							}
							else if($statusvalue == "1" || $statusvalue == "3") {
								$status[] = $unitid.'#READY#'.$commstatus;
							}		
							
						}
					}
				}
				//Comm status check - end			
								
			}
			$unitstatus = @implode('|',$status);
			echo $unitstatus;
		}		
	}	

		function enginedetailsnewapi($id,$ismobile) {
			$units = array();
		    $msg = array(array('result' => 'success'));
		if($ismobile == 1) {
			$unit_details = DB::table('units')->select('units.controllerid', 'units.neaplateno', 'units.alarmnotificationto','unitgroups.unitgroup_name','companygroups.companygroup_name','engine_models.generatormodel')->where('unit_id',$id)->join('unitgroups', 'unitgroup_id', '=', 'units.unitgroups_id')->join('companygroups','companygroups.companygroup_id','=','units.companys_id')->join('engine_models','engine_models.model_id','=','units.models_id')->get();
			$contact_details=DB::table('unit_contacts')->where('units_id',$id)->get();

			$contact_detail[]=array();

           if($contact_details)
           {
           	    $i=0;
				foreach ($contact_details as $contact)
				{
					$contact_detail[$i]['unit_contact_name']=$contact->contact_name;
					$contact_detail[$i]['contact_number']=$contact->contact_number;

					$i++;
				}
		  }



			

			//return response()->json(['msg' => array('result'=>'success'),'genset_detail' => $unit_details,'contact_details'=>$contact_detail]);

			return response()->json(['msg' => $msg, 'genset_detail' => $unit_details,'contact_details'=>$contact_detail]);
		}

	}


	public function showtrendlinealarm($id, $code, $ismobile,$datetime)
	{
		$unitdata = '';
		
		$units = Unit::where('unit_id', $id)->get();
		$units = $units[0];
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0) {
			$runninghrs = $currentstatus[0]->value;
		}
		$unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$id)->get();		

		
		// fathima coding for api 



         $formatted_date=date("Y-m-d H:i:s", strtotime($datetime.'-30 minutes'));



         $unitdataapi = DB::table('unitdatahistory_'.$id)->where('code', $code)->where('fromdateandtime','>=',$formatted_date)->orderBy('todateandtime', 'asc')->get();



		// fathima coding for api



		
		if($ismobile == 0)
			$view = 'showgraph';
		else
			$view = 'trendline';
		return view('Unit.'.$view, ['code' => $code,'unitdataapi'=>$unitdataapi]);
	}

	public function unitlatlong($unit_id)
	{
		 $units = array();
	     $unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$unit_id)->get();
		 if(count($unit_latlong) > 0) {						
						if($unit_latlong[0]->latitude == 'undefined' || $unit_latlong[0]->longtitude == 'undefined') {
							$units['lat'] = '';
							$units['lng'] = '';
						}
						else {
							$units['lat'] = $unit_latlong[0]->latitude;
							$units['lng'] = $unit_latlong[0]->longtitude;
						}
					}
					else {
						$units['lat'] = '';
						$units['lng'] = '';
					}

	return response()->json(['msg' => array('result'=>'success'),'units' => $units]);

	}

public function unitdetailsapi($id, $ismobile,$loginid)
  {
			
		$finalStatus = $alarm = "";

		$unitsguagevalue = array();

		$i=0;



			$generatordetails = DB::table('unit_currentstatus')->where('generatorid',$id)->get();

			

			$units = DB::table('units')->where('controllerid',$id)->where('deletestatus', '0')->get();

			$chkfav = DB::table('unit_favorites')->where('units_id', $units[0]->unit_id)->where('staffs_id',$loginid)->get();

			if(count($chkfav) > 0)
					$favorite = 1;
					else
					$favorite= 0;
					

	




			$unitid = $units[0]->unit_id;
			$unitname=$units[0]->unitname;
			$projectname=$units[0]->projectname;
			$location=$units[0]->location;
			$tmpvals = $finalStatus = $detailpagevalue = $isalarm = $commstatus = '';
			$alarmpriority = 0;

			
			foreach($generatordetails as $generatordetail) { 
				$res = DB::table('unit_labels')->where('id', $generatordetail->parentid)->get();
				if(count($res) > 0)
				{
					$data = $res[0];
					$label = strtolower($data->code);
					
					$unitsguagevalue[$i][$label]=$generatordetail->value;
					$detailpagevalue .= $label.'#'.$generatordetail->value.'|';
					if($label == 'mode'){
						$currentMode = $generatordetail->value;
					}
					if($label == 'enginestate'){
						$currentState = $generatordetail->value;

					}
					if($label == 'alarm'){
						$currentAlarm = $generatordetail->value;
						//$alarmpriority = 3;
						$alarm = DB::table('alarms')->where('alarm_status', '0')->where('alarm_unit_id', $unitid)->get();						
					}
				}

				$i++;
			}

			$addonStatus = "";

			$showmodeactive = '';
			if($currentMode == "0")
				$showmodeactive = '|MANBTN#0|AUTOBTN#0|OFFBTN#1';
			else if($currentMode == '1')
				$showmodeactive = '|MANBTN#1|AUTOBTN#0|OFFBTN#0';
			else if($currentMode == '2')
				$showmodeactive = '|MANBTN#0|AUTOBTN#1|OFFBTN#0';
			else
				$showmodeactive = '|MANBTN#0|AUTOBTN#0|OFFBTN#1';


			// Mode = MAN, State = Ready
			if($currentMode == '1' && $currentState == '1' ){
				$addonStatus = 'STARTBTN#1|STOPBTN#0';
			}
            		// Mode = MAN , State=Not Ready
			else if($currentMode == '1' && $currentState == '2'){
				$addonStatus = 'STARTBTN#0|STOPBTN#0';
			}
			// Mode = Auto , State=Not Ready
			else if($currentMode == '2' && $currentState == '2'){
				$addonStatus = 'STARTBTN#0|STOPBTN#0';
			}
			// Mode = OFF , State=Not Ready
			else if($currentMode == '0' && $currentState == '2'){
				$addonStatus = 'STARTBTN#0|STOPBTN#0';
			}
			// Mode = MAN , State=Running
			else if($currentMode == '1' && $currentState == '7'){
				$addonStatus = 'STARTBTN#0|STOPBTN#1';
			}
			// Mode = Auto , State=Ready
			else if($currentMode == '2' && $currentState == '1')
			{
				$addonStatus = 'STARTBTN#1|STOPBTN#0';
			}
			// Mode = Auto , State=Running
			else if($currentMode == '2' && $currentState == '7')
			{
				$addonStatus = 'STARTBTN#0|STOPBTN#1';
			}
			else if($currentState == '4' || $currentState == "10")
			{
				$addonStatus = 'STARTBTN#1|STOPBTN#1';
			}
			else if($currentState == '12')
			{
				$addonStatus = 'STARTBTN#1|STOPBTN#0|MANBTN#1|AUTOBTN#0|OFFBTN#0';
			}

			//$alarmres = DB::select('SELECT * FROM alarms WHERE alarm_unit_id = "'.$unitid.'" AND alarm_status = 0')->get();
			$alarmres = DB::table('alarms')->where('alarm_unit_id', $unitid)->where('alarm_status', '0')->count();
			//echo 'SELECT * FROM alarms WHERE alarm_unit_id = "'.$unitid.'" AND alarm_status = 0';
			//print_r($alarmres);
			if($alarmres > 0)
			{
				$addonStatus = $addonStatus."|FAULTBTN#1";
				$isalarm = "ALARM#1";
			}
			else
			{
				$addonStatus = $addonStatus."|FAULTBTN#0";
				$isalarm = "ALARM#0";
			}

			//Comm status check - start
			$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $id)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
			if($chkstatusres)
			{
				$lastupdatestatus = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
				$currentstatus = strtotime(date("Y-m-d H:i:s"));
				if($lastupdatestatus < $currentstatus)
					$commstatus = "commstatus#Offline";
				else
					$commstatus = "commstatus#Online";
			}
			//Comm status check - end

			
			if($tmpvals)
			{

				$tmpvals = @implode("|", $tmpvals);
			}
		
			$resultlabels = @implode("|", $resultlabels);
			$resultvalues = @implode("|", $resultvalues);
			$result = $resultlabels."#".$resultvalues;
		
	//	echo $finalStatus;

	//	print_r($unitsguagevalue);

		return response()->json(['msg' => array('result'=>'success'),'unitname'=>$unitname,'projectname'=>$projectname,'location'=>$location,'favorite'=>$favorite,'unitsguagevalue' => $unitsguagevalue,'buttonstatus'=>$addonStatus.$showmodeactive,'isalarm'=>$isalarm,'commstatus'=>$commstatus,'currentState'=>$currentState]);
		
		}


	public function getgpslocation(Request $request) {
		$unitid = $request->unitid;
		$controllerid = 0;
		$units = DB::table('units')->where('unit_id', $unitid)->select('controllerid')->get();
		if(count($units) > 0) {
			$controllerid = $units[0]->controllerid;
		}
		
		/*$url = "http://13.250.190.101//DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/APPCMD:GPS";

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,  $url);
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$result = curl_exec($ch);
		if ($result) {	
		        curl_close($ch);			
		}*/
		$latitude = $longtitude = 0;
		$latlongs = DB::table('unit_currentstatus')->where('generatorid', $controllerid)->where('code', 'AT$GPSACP')->get();
		
		if(count($latlongs) > 0) {
			
			$latlong = $latlongs[0];
			$gpsvalue = @explode(",", $latlong->value);
			
			$gpslat = $gpsvalue[1];
			$gpslong = $gpsvalue[2];
			
			$latitude = substr($gpslat, 0, 2) + (substr($gpslat, 2, strlen($gpslat)) / 60);
			$longtitude = substr($gpslong, 0, 3) + (substr($gpslong, 3, strlen($gpslong)) / 60);

		} else {
			$latitude = "1.32";
			$longtitude = "103.70";
		}

		$url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longtitude&sensor=false&key=AIzaSyCbvwOWwex4xcDVJKlfPsJiz5fmmsEB9KA";

		// Make the HTTP request
		$data = @file_get_contents($url);
		// Parse the json response
		$jsondata = json_decode($data,true);
		$address = $jsondata['results'][0]['formatted_address'];
		if($request->ismobile == 0) {
			echo $jsondata['results'][0]['formatted_address']."|".$latitude."|".$longtitude;
		} else {
			return response()->json(['msg' => array('result'=>'success'), 'address' => $address, 'latitude' => $latitude, 'longtitude' => $longtitude]);
		}
		
		
	}

	function onholdunitaction(Request $request) {
		$ismobile = $request->is_mobile;
		$id = $request->unitid;
		$action = $request->action;
		if($ismobile == 1) {
			$ses_login_id = $request->loginid;
		}
		else {
			$session = new Session();
			$ses_login_id = $session->get('ses_login_id');			
		}
		$idsarr = explode(',',$id);
		if($action == 'delete') {
			foreach($idsarr as $id) {
				DB::table('units')->where('unit_id', $id)->update(array('deletestatus' => '1'));
				DB::table('unit_contacts')->where('units_id', $id)->delete();
				DB::table('unit_favorites')->where('units_id', $id)->delete(); 
				
				$ctrl_id = Unit::where('unit_id',$id)->select('controllerid')->get();
				if(count($ctrl_id) > 0) {
					DB::table('unit_currentstatus')->where('generatorid',$ctrl_id[0]->controllerid)->delete();
				}
				
				
				Schema::dropIfExists('unitdatahistory_'.$id);
			}
			if($ismobile == 0)
			return redirect('/units');
			else {
				$msg = array(array('Error' => '0','result'=>'Unit deleted successfully'));
				return response()->json([ 'msg'=>$msg]);
			}
		}
		if($action == 'dashboard') {			
			// foreach($idsarr as $id) {
				// DB::table('view_on_dashboard')->where('view_staff_id',$ses_login_id)->delete();						
			// }
			foreach($idsarr as $id) {
				$existing=DB::table('view_on_dashboard')->where('view_unit_id',$id)->where('view_staff_id',$ses_login_id)->get();
				if(count($existing)>0)
				{
					
				}
				else
				{
					DB::table('view_on_dashboard')->insert(array('view_unit_id' => $id,'view_staff_id'=>$ses_login_id));
				}
				
			}
			if($ismobile == 0) {				
				$session->getFlashBag()->add('unitviewon_dashboard', 'Selected units viewing in Dashboard');			
				return redirect('/units');
			}					
			else 
				return response()->json([ 'msg'=>array(array('Error' => '0','result'=>'Unit viewed in Dashboard successfully'))]);
			
		}
		if($action == 'view') {
			$i=0;
			if($ismobile == 1) {			
				//$unitdetails = DB::table('units')->where('unit_id',$id)->get();
				$unitdetails = DB::table('units')->whereIn('unit_id', $idsarr)->get();
				if(count($unitdetails) > 0) {
					foreach($unitdetails as $unit) {
					//$unitgroup = Unitgroup::select('colorcode')->where('unitgroup_id', $unit->unit_id)->get();
					$units[$i]['unit_id'] = $unit->unit_id;
					$units[$i]['unitname'] = $unit->unitname;
					$units[$i]['projectname'] = $unit->projectname;
					$units[$i]['controllerid'] = $unit->controllerid;
					$units[$i]['neaplateno'] = $unit->neaplateno;
					$units[$i]['location'] = $unit->location;
					$units[$i]['companys_id'] = $unit->companys_id;
					$nxtserddate = Service::where('deletestatus', '0')->where('next_service_date','!=','0000-00-00')->where('service_unitid', $unit->unit_id)->orderBy('service_id','desc')->skip(0)->take(1)->get();	
					if(count($nxtserddate) > 0) {
						 $units[$i]['nextservicedate'] = date('d M Y',strtotime($nxtserddate[0]->next_service_date));
						 $units[$i]['nextservicedate_mobileview'] = date('d/m/Y',strtotime($nxtserddate[0]->next_service_date));
					}
					else {
						$units[$i]['nextservicedate'] = '';
						$units[$i]['nextservicedate_mobileview'] ='';
					}
					$units[$i]['unitgroups_id'] = $unit->unitgroups_id;
					$units[$i]['models_id'] = $unit->models_id;
					$units[$i]['timezone'] = $unit->timezone;
					$units[$i]['alarmnotificationto'] = $unit->alarmnotificationto;
					
					//if(count($unitgroup) > 0) {
						//$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					//}
					$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
					if(count($unitgroup) > 0) {
						$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
						$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}
					else {
						$units[$i]['unitgroup_name'] = '';
						$units[$i]['colorcode'] = 'FFFFFF';
					}
					$chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->where('staffs_id',$ses_login_id)->get();
					if(count($chkfav) > 0)
						$units[$i]['favorite'] = 1;
					else
						$units[$i]['favorite'] = 0;
					
					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
					if(count($currentstatus) > 0) {
						$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						
						if(count($chkstatusres) > 0) {
							$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
							$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
							
							if($lastupdatestatus1 < $currentstatus1)
								$units[$i]['genstatus'] = 'Offline';
							else
							{
								if($currentstatus[0]->value == 1)
									$units[$i]['genstatus'] = 'Ready';
								else if($currentstatus[0]->value == 7)
								{
									$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
									if(count($alarms) > 0) { $units[$i]['genstatus'] = 'Warning'; } else { $units[$i]['genstatus'] = 'Running'; }
								}
								else if($currentstatus[0]->value == 2) { $units[$i]['genstatus'] = 'Not_Ready'; }
								else if($currentstatus[0]->value == 12) { $units[$i]['genstatus'] = 'Tripped'; }
								else { $units[$i]['genstatus'] = 'Offline'; }
							}
						}					
						else { $units[$i]['genstatus'] = 'Offline'; }
					}
					else { $units[$i]['genstatus'] = 'Offline'; }
					
					$i++;
					}
				}
				$msg = array(array('Error' => '0','result'=>'Unit viewed in Dashboard successfully'));
				return response()->json(['msg'=>$msg,'unitdetails'=>$units]);
			}
			else {
				$session->set('viewids', $idsarr);			
				if($idsarr[0] != '')
				return redirect('/'.$idsarr[0].'/0/unitdetails');
			}
		}	
		
		if( $action=='favorite'){
			$unitid = explode(",",$request->unitid);
			$ismobile = $request->is_mobile;
			$loginid = $request->loginid;
			foreach ($unitid as $uid){	
			   // echo "UID:". $uid;
			 //   echo "<br>";				
			   // DB::table('unit_favorites')->insert(['units_id' => $uid, 'staffs_id' => $loginid ]);


			   $chkexist = DB::table('unit_favorites')->where('units_id', $uid)->where('staffs_id',$loginid)->get();
			   if(count($chkexist) > 0) {
				  // DB::table('unit_favorites')->where('units_id', $uid)->where('staffs_id',$loginid)->delete();                      
			   }
			   else {
				   DB::table('unit_favorites')->insert(['units_id' => $uid, 'staffs_id' => $loginid ]);                      
			   }

			}
//exit;
			$dashboardunits = DB::table('view_on_dashboard')->where('view_staff_id', $loginid)->get();
			$viewunits = '';
			$units = '';
			$unitids = [];
			if (count($dashboardunits) > 0) {
				foreach ($dashboardunits as $dashunit) {
					$unitids[] = $dashunit->view_unit_id;
				}
			}				
			$viewunits = Unit::whereIn('unit_id', $unitids)->get()->where('deletestatus', '0');
			if (count($viewunits) > 0) {
				$i = 0;
				foreach ($viewunits as $unit) {
					$units[$i]['unit_id'] = $unit->unit_id;
					$units[$i]['unitname'] = $unit->unitname;
					$units[$i]['projectname'] = $unit->projectname;
					$units[$i]['controllerid'] = $unit->controllerid;
					$units[$i]['neaplateno'] = $unit->neaplateno;
					$units[$i]['location'] = $unit->location;
					$units[$i]['companys_id'] = $unit->companys_id;
					$units[$i]['unitgroups_id'] = $unit->unitgroups_id;
					$units[$i]['models_id'] = $unit->models_id;
					$units[$i]['timezone'] = $unit->timezone;
					$units[$i]['alarmnotificationto'] = $unit->alarmnotificationto;
					$chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->get();

					$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
					if (count($unitgroup) > 0) {
						$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
						$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}

					if (count($chkfav) > 0)
						$units[$i]['favorite'] = 1;
					else
						$units[$i]['favorite'] = 0;
						$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($currentstatus) > 0) {
							$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
							
							if(count($chkstatusres) > 0) {
								$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
								$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
								
								if($lastupdatestatus1 < $currentstatus1)
									$units[$i]['genstatus'] = 'Offline';
								else
								{
									if($currentstatus[0]->value == 1)
										$units[$i]['genstatus'] = 'Ready';
									else if($currentstatus[0]->value == 7)
									{
										$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
										if(count($alarms) > 0) { $units[$i]['genstatus'] = 'Warning'; } else { $units[$i]['genstatus'] = 'Running'; }
									}
									else if($currentstatus[0]->value == 2) { $units[$i]['genstatus'] = 'Not_Ready'; }
									else if($currentstatus[0]->value == 12) { $units[$i]['genstatus'] = 'Tripped'; }
									else { $units[$i]['genstatus'] = 'Offline'; }
								}
							}                   
							else { $units[$i]['genstatus'] = 'Offline'; }
						}
						else { $units[$i]['genstatus'] = 'Offline'; }
					$companygroup = CompanyGroup::where('companygroup_id', $unit->companys_id)->select('companygroup_name')->get();
					if (count($companygroup) > 0)
						$units[$i]['companygroup_name'] = $companygroup[0]->companygroup_name;

					$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
					if (count($unitgroup) > 0) {
						$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
						$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}

					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
					if (count($currentstatus) > 0)
						$units[$i]['runninghr'] = $currentstatus[0]->value;
					else
						$units[$i]['runninghr'] = '';

					$units[$i]['nextservicedate'] = '';

					$contactslist = DB::table('unit_contacts')->where('units_id', $unit->unit_id)->get();

					$tmpcontacts = array();
					$contacts = '';

					if (count($contactslist) > 0) {
						foreach ($contactslist as $contact) {
							$tmpcontacts[] = $contact->contact_name . '|' . $contact->contact_number;
						}
						if ($tmpcontacts) {
							$contacts = @implode("#", $tmpcontacts);
						}
					}
					if ($contacts != '') {
						$units[$i]['contacts'] = $contacts;
					}

					$latlongs = DB::table('unit_latlong')->where('latlong_unit_id', $unit->unit_id)->get();
					if (count($latlongs) > 0) {
						$units[$i]['latitude'] = $latlongs[0]->latitude;
						$units[$i]['longtitude'] = $latlongs[0]->longtitude;
					} else {
						$units[$i]['latitude'] = 0;
						$units[$i]['longtitude'] = 0;
					}

					$dashboardunits = DB::table('view_on_dashboard')->where('view_unit_id', $unit->unit_id)->where('view_staff_id', $loginid)->get();
					if (count($dashboardunits) > 0) {
						$units[$i]['viewonid'] = $dashboardunits[0]->view_on_id;
					} else {
						$units[$i]['viewonid'] = 0;
					}
					++$i;
				}
			}

		   // $msg = array(array('Error' => '0','result'=>'Favourite successfully'), 'units' => $units);
		   // return response()->json(['msg'=>$msg]);
		   return response()->json(['msg' => array('result' => 'Favourite successfully'), 'units' => $units]);
  
		}
	}
}

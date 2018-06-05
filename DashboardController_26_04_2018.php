<?php

namespace App\Http\Controllers;

use App\Unit;
use App\CompanyGroup;
use App\Unitgroup;
use App\Dashboard;
use App\Service;
use Illuminate\Http\Request;
use DB;
use App\DataTables\DashboardDataTable;
use Yajra\Datatables\Datatables;
use Symfony\Component\HttpFoundation\Session\Session;

class DashboardController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, DashboardDataTable $dataTable) {

        $ismobile = $request->is_mobile;
        if ($ismobile == 1) {
            $company_id = $request->company_id;
            $loginid = $request->loginid;
            $startindex = $request->startindex; // start limit
            $results = $request->results; // end limit		
            $sort = $request->sort;
            $dir = $request->dir;
            $unitids = $viewallunits = array();
            $dashboardunits = DB::table('view_on_dashboard')->join('units', 'units.unit_id', '=', 'view_on_dashboard.view_unit_id')->where('view_on_dashboard.view_staff_id', $loginid)->where('units.deletestatus', 0)->get();
            $ugids = array();
            $viewunits = '';
            $comma_ids = '';
            $units = '';
            $resp_vuallunits = '0';

            $offlinecount='0';
            $warningcount='0';
            $runningcount='0';
            $notreadycount='0';
            $trippedcount='0';
            $readycount='0';

            $offlineids=array();
            $trippedids=array();
            $warningids=array();
            $runningids=array();
            $readystateids=array();
            $tmpunitids=array();


            $ids = array(0);
            $view_unitid = array();
            if (count($dashboardunits) > 0) {
                foreach ($dashboardunits as $dashunit) {
                    $unitids[] = $dashunit->view_unit_id;
                }
		
                //$unitids = @implode(',', $unitids);
            }
		
            if (count($unitids) > 0) {
                $unitlist = Unit::whereIn('unit_id', $unitids)->where('deletestatus', '0')->get();
                $resp_vuallunits = count($unitlist);

                //sorting
                if ($sort == 'companygroup_name') {
                    if ($company_id == 1) {
                        $unitlist = DB::table('units')->join('companygroups', 'companygroups.companygroup_id', '=', 'units.companys_id')->whereIn('unit_id', $unitids)->where('units.deletestatus', 0)->orderBy('companygroups.' . $sort, $dir)->skip($startindex)->take($results)->select('units.*', 'companygroups.*')->get();
                    } else {
                        $unitlist = DB::table('units')->join('companygroups', 'companygroups.companygroup_id', '=', 'units.companys_id')->whereIn('unit_id', $unitids)->where('units.companys_id', $company_id)->where('units.deletestatus', 0)->orderBy('companygroups.' . $sort, $dir)->skip($startindex)->take($results)->get();
                    }

                    $resp_vuallunits = count($unitlist);
                } elseif ($sort == 'favorite') {

                    $unit_ids = DB::table('unit_favorites')->whereIn('units_id', $unitids)->where('staffs_id', $loginid)->select('units_id')->orderBy('units_id', 'desc')->get();

                    if (count($unit_ids) > 0) {
                        foreach ($unit_ids as $ug_ids) {
                            $ugids[] = "'" . $ug_ids->units_id . "'";
                            //$view_unitid[] = $ug_ids->units_id;
                        }
                        if ($ugids) {
                            $comma_ids = implode(',', $ugids);
                        }


                        $unitlist = Unit::where('deletestatus', 0)->whereIn('unit_id', $unitids)->orderByRaw("FIELD(unit_id,$comma_ids)" . $dir)->skip($startindex)->take($results)->get();
                        //print_r($unitlist);
                        //die;
                        $resp_vuallunits = count($unitlist);
                    } else {
                        $unitlist = Unit::where('deletestatus', 0)->whereIn('unit_id', $unitids)->skip($startindex)->take($results)->get();
                        //print_r($unitlist);
                        //die;
                        $resp_vuallunits = count($unitlist);
                    }
                } elseif ($sort == 'unitgroup') {
                    $unit_groupids = DB::table('unitgroups')->select('unitgroup_id')->orderBy('unitgroup_name', 'asc')->get();
                    foreach ($unit_groupids as $unit_groupid) {
                        $ugids[] = "'" . $unit_groupid->unitgroup_id . "'";
                    }
		    
                    $comma_ids = implode(',', $ugids);
                    $unitlist = Unit::where('deletestatus', 0)->whereIn('unit_id', $unitids)->orderByRaw("FIELD(unitgroups_id, $comma_ids) ".$dir)->skip($startindex)->take($results)->get();
		    
                } elseif ($sort == 'tripped') {
                    $generatorid = DB::table('units')->select('controllerid', 'unit_id')->whereIn('unit_id', $unitids)->get();
                    if (count($generatorid) > 0) {
                        foreach ($generatorid as $genid) {
                            $enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
                            if (count($enginestate) > 0) {
                                if ($enginestate[0]->value == 12) {
                                    $ids[] = "'" . $genid->unit_id . "'";
                                }
                            }
                        }
                        $ids = implode(',', $ids);


                        $unitlist = Unit::where('deletestatus', 0)->whereIn('unit_id', $unitids)->orderByRaw("FIELD(unit_id,$ids)" . $dir)->skip($startindex)->take($results)->get();
                    }
                    $resp_vuallunits = count($unitlist);
                } elseif ($sort == 'running') {
                    $generatorid = DB::table('units')->select('controllerid', 'unit_id')->whereIn('unit_id', [$unitids])->get();
                    if (count($generatorid) > 0) {
                        foreach ($generatorid as $genid) {
                            $enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
                            if (count($enginestate) > 0) {
                                if ($enginestate[0]->value == 7) {
                                    $ids[] = "'" . $genid->unit_id . "'";
                                }
                            }
                        }
                        $ids = implode(',', $ids);

                        if ($company_id == 1) {

                            $unitlist = Unit::where('deletestatus', 0)->orderByRaw("FIELD(unit_id,$ids)" . $dir)->skip($startindex)->take($results)->get();
                        } else {

                            $unitlist = Unit::where('deletestatus', 0)->orderByRaw("FIELD(unit_id,$ids)" . $dir)->skip($startindex)->take($results)->where('companys_id', $company_id)->get();
                        }
                    }
                    $resp_vuallunits = count($unitlist);
                } elseif ($sort == 'warning') {
                    $generatorid = DB::table('units')->select('controllerid', 'unit_id')->whereIn('unit_id', [$unitids])->get();
                    if (count($generatorid) > 0) {
                        foreach ($generatorid as $genid) {
                            $enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
                            if (count($enginestate) > 0) {
                                if ($enginestate[0]->value == 7) {
                                    $alarms = DB::table('alarms')->where('alarm_unit_id', $genid->unit_id)->where('alarm_status', '0')->count();
                                    if (count($alarms) > 0)
                                        $ids[] = "'" . $genid->unit_id . "'";
                                }
                            }
                        }
                        $ids = implode(',', $ids);
                        if ($company_id == 1) {
                            $unitlist = Unit::where('deletestatus', 0)->orderByRaw("FIELD(unit_id,$ids)" . $dir)->skip($startindex)->take($results)->get();
                        } else {
                            $unitlist = Unit::where('deletestatus', 0)->orderByRaw("FIELD(unit_id,$ids)" . $dir)->skip($startindex)->take($results)->where('companys_id', $company_id)->get();
                        }
                    }
                    $resp_vuallunits = count($unitlist);
                } elseif ($sort == 'offline') {
                    $generatorid = DB::table('units')->select('controllerid', 'unit_id')->whereIn('unit_id', [$unitids])->get();
                    if (count($generatorid) > 0) {
                        foreach ($generatorid as $genid) {
                            $enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
                            if (count($enginestate) > 0) {
                                $lastupdatetime = $enginestate[0]->timestamp;
                                //echo date('Y-m-d H:i:s', strtotime('+5 minutes', strtotime('2011-04-8 08:29:49')));
                                $currenttime = date('Y-m-d H:i:s');
                                $addedthreemins = date('Y-m-d H:i:s', strtotime('+3 minutes', strtotime($lastupdatetime)));
                                if ($lastupdatetime < $addedthreemins) {
                                    $ids[] = "'" . $genid->unit_id . "'";
                                }
                            }
                        }
                        $ids = implode(',', $ids);
                        if ($company_id == 1) {
                            $unitlist = Unit::where('deletestatus', 0)->orderByRaw("FIELD(unit_id,$ids)" . $dir)->skip($startindex)->take($results)->get();
                        } else {
                            $unitlist = Unit::where('deletestatus', 0)->orderByRaw("FIELD(unit_id,$ids)" . $dir)->skip($startindex)->take($results)->where('companys_id', $company_id)->get();
                        }
                    }
                    $resp_vuallunits = count($unitlist);
                } 

                // fathima coding for sorting status ->Asc Desc 
            elseif($sort == 'status')
            {
		
                $generatorid = DB::table('units')->select('controllerid','unit_id')->whereIn('unit_id', $unitids)->get();
		
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
                            } else {
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

		                     } else {
					$offlineids[] = "'".$genid->unit_id."'";
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

                             } else {
				$offlineids[] = "'".$genid->unit_id."'";
			     }
                        }

                    }
		
                    if($dir == 'asc')
                    {
                        $tmpunitids = array_merge($trippedids, $warningids, $offlineids, $runningids, $readystateids);
                    }
                    elseif($dir == 'desc')
                    {
                        $tmpunitids = array_merge($readystateids, $runningids, $offlineids, $warningids, $trippedids);
                    }
		    
                       
                    $ids = implode(',',$tmpunitids);        
			
                    if($ids != '') {
			
                        if($company_id == 1) {
                            $unitlist = DB::table('units')->where('deletestatus',0)->whereIn('unit_id', $unitids)->orderByRaw("FIELD(unit_id,$ids)")->skip($startindex)->take($results)->get();                        }
                        else {
                            $unitlist = DB::table('units')->where('deletestatus',0)->whereIn('unit_id', $unitids)->orderByRaw("FIELD(unit_id,$ids)")->skip($startindex)->take($results)->where('companys_id',$company_id)->get();                      
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
                    if ($company_id == 1) {
                        $unitlist = Unit::whereIn('unit_id', $unitids)->where('deletestatus', '0')->orderBy($sort, $dir)->skip($startindex)->take($results)->get();

                        //$units = '';	

                        $resp_vuallunits = count($unitlist);
                    } else {
                        $unitlist = Unit::whereIn('unit_id', $unitids)->where('deletestatus', '0')->where('companys_id', $company_id)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
                        //$units = '';	
                        
                        $resp_vuallunits = count($unitlist);
                    }
                }
	   


                
		
		
                //$units = array();
                //sorting
		
                if (count($unitlist) > 0) {
                    $i = 0;
                    foreach($unitlist as $unit) {
			
                        $units[$i]['unit_id'] = $unit->unit_id;
                        $units[$i]['unitname'] = $unit->unitname;
                        $units[$i]['projectname'] = $unit->projectname;
                        $units[$i]['controllerid'] = $unit->controllerid;
                        $units[$i]['neaplateno'] = $unit->neaplateno;
			            $units[$i]['serialnumber'] = $unit->serialnumber;
                        $units[$i]['location'] = $unit->location;
                        $units[$i]['companys_id'] = $unit->companys_id;
                        $units[$i]['unitgroups_id'] = $unit->unitgroups_id;
                        $units[$i]['models_id'] = $unit->models_id;
                        $units[$i]['timezone'] = $unit->timezone;
                        $units[$i]['alarmnotificationto'] = $unit->alarmnotificationto;

                        $chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->where('staffs_id', $loginid)->get();
                        if (count($chkfav) > 0)
                            $units[$i]['favorite'] = 1;
                        else
                            $units[$i]['favorite'] = 0;

                        $companygroup = CompanyGroup::where('companygroup_id', $unit->companys_id)->select('companygroup_name')->get();
                        if (count($companygroup) > 0)
                            $units[$i]['companygroup_name'] = $companygroup[0]->companygroup_name;

                        $unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
                        if (count($unitgroup) > 0) {
                            $units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
                            $units[$i]['colorcode'] = $unitgroup[0]->colorcode;
                        }

                        $currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
                        if (count($currentstatus) > 0) {
                            $units[$i]['runninghr'] = $currentstatus[0]->value;
                        } else
                            $units[$i]['runninghr'] = 0;

                        $currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
			$lastupdatestatus1 = $currentstatus1 = $unitstatus = '';
                        if (count($currentstatus) > 0) {
                            //checkcurrentstatus starts
                            $chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();

                            if (count($chkstatusres) > 0) {
                                $lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
                                $currentstatus1 = strtotime(date("Y-m-d H:i:s"));

                              if ($lastupdatestatus1 < $currentstatus1)
                                // for demoif($lastupdatestatus1 == $currentstatus1)
                                { 
                                    $units[$i]['genstatus'] = 'Offline';
                                    $units[$i]['gencolor']='#8C8C8A'; // graycolour
                                      $units[$i]['compstatus']='Offline';
                                    $offlinecount++;
                    $unitstatus = 'Offline';
                    $units[$i]['mapicon'] = '';
                                }
                                else {
                                    if ($currentstatus[0]->value == 1)
                                          {
						$units[$i]['mapicon'] = 'Ready';
                                                $units[$i]['genstatus'] = 'Ready';
                                                $units[$i]['gencolor']='#51B749';  // green colour
                                                $units[$i]['compstatus']='Online';
                                                $readycount++;
						$unitstatus = 'Ready';
                                          }

                                    else if ($currentstatus[0]->value == 7) {
                                        $alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
                                        if (count($alarms) > 0) {
					    $units[$i]['mapicon'] = 'Warning';
                                            $units[$i]['genstatus'] = 'Warning';  
                                            $units[$i]['gencolor']='#FFB878';     // yellow colour
                                            $units[$i]['compstatus']='Online';
                                            $warningcount++;
						$unitstatus = 'Warning';
                                        } else {
					    $units[$i]['mapicon'] = 'Running';
                                            $units[$i]['genstatus'] = 'Running';
                                            $units[$i]['gencolor']='#51B749';    // green colour
                                            $units[$i]['compstatus']='Online';
                                            $runningcount++;
					    $unitstatus = 'Running';
                                        }
                                    } else if ($currentstatus[0]->value == 2) {
					$units[$i]['mapicon'] = 'Not_Ready';
                                        $units[$i]['genstatus'] = 'Not_Ready';
                                        $units[$i]['gencolor']='#ff0000';      // red colour
                                        $units[$i]['compstatus']='Online';
                                        $trippedcount++;
					$unitstatus = 'Not Ready';
                                    } else if ($currentstatus[0]->value == 12) {
					$units[$i]['mapicon'] = 'Tripped';
                                        $units[$i]['genstatus'] = 'Tripped';
                                        $units[$i]['gencolor']='#ff0000';   // red colour
                                        $units[$i]['compstatus']='Online';
                                        $trippedcount++;
					$unitstatus = 'Tripped';
                                    } else {
					$units[$i]['mapicon'] = '';
                                        $units[$i]['genstatus'] = 'Offline';
                                        $units[$i]['gencolor']='#8C8C8A';    // gray
                                        $units[$i]['compstatus']='Offline';
                                        $offlinecount++;
					$unitstatus = 'Offline';
                                    }
                                }
                            } else {
				$units[$i]['mapicon'] = '';
                                $units[$i]['genstatus'] = 'Offline';
                                $units[$i]['gencolor']='#8C8C8A';
                                $units[$i]['compstatus']='Offline';
                                $offlinecount++;
				$unitstatus = 'Offline';
                            }                            
                        } else {
			    $units[$i]['mapicon'] = '';
                            $units[$i]['genstatus'] = 'Offline';
                            $units[$i]['compstatus']='Offline';
                            $units[$i]['gencolor']='';
                            $offlinecount++;
				$unitstatus = 'Offline';
                        }
                        $services = Service::where('service_unitid', $unit->unit_id)->select('next_service_date')->get();
                        if (count($services) > 0)
                            $units[$i]['nextservicedate'] = $services[0]->next_service_date;
                        else
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

                        $latlongs = DB::table('unit_latlong')->where('latlong_unit_id', $unit->unit_id)->whereRaw('(unit_latlong.gps_status = ? OR unit_latlong.gps_status = ?)', [2, 3])->get();
                        if (count($latlongs) > 0) {
			    
			    $units[$i]['latitude'] = $latlongs[0]->latitude;
                            $units[$i]['longtitude'] = $latlongs[0]->longtitude;
			    $gpstodatetime = strtotime($latlongs[0]->todatetime);
			    $gpsfromdatetime = strtotime($latlongs[0]->fromdatetime);
			    if($gpsfromdatetime != $gpstodatetime) {
				    $gpsreceiveddate = strtotime($latlongs[0]->receiveddate);
				    $addfourhours = strtotime("+4 hours", strtotime($latlongs[0]->todatetime));
				    if($gpsreceiveddate > $addfourhours) {
					if($unitstatus == 'Offline') {
						$units[$i]['latitude'] = '1.32';
                                    $units[$i]['longtitude'] = '103.701';
                                    $units[$i]['mapicon'] = '';
					}else{
                        $units[$i]['mapicon'] = 'Multicolor';
                    }
				    	
				    }
			    }
                            
                        } else {
                            $units[$i]['latitude'] = '1.32';
                            $units[$i]['longtitude'] = '103.701';
                            $units[$i]['mapicon'] = '';
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
            } else {
                $msg = array(array('Error' => '1', 'result' => 'No Records Found', 'totalCount' => '0','offlinecount'=>$offlinecount,'runningcount'=>$runningcount,'trippedcount'=>$trippedcount,'warningcount'=>$warningcount,'notreadycount'=>$notreadycount,'readycount'=>$readycount));
                return response()->json(['msg' => $msg]);
            }

		
            return response()->json(['msg' => array('result' => 'success'), 'totalCount' => $resp_vuallunits,'offlinecount'=>$offlinecount,'runningcount'=>$runningcount,'trippedcount'=>$trippedcount,'warningcount'=>$warningcount,'notreadycount'=>$notreadycount,'readycount'=>$readycount,'units' => $units]);
		} else {
			$session = new Session();
			$ses_login_id = $session->get('ses_login_id');
			$company_id = $session->get('company_id');
			$roledata = $session->get('roledata');
			$mainmenu = $session->get('mainmenu');
			$unitids = '';
			$i = $offlinecount = $alarmcount = $warningcount = $runningcount = 0;
			$location = $informations = $icons = '';
			$dashboardunits = DB::table('view_on_dashboard')->join('units', 'units.unit_id', '=', 'view_on_dashboard.view_unit_id')->where('view_on_dashboard.view_staff_id', $ses_login_id)->where('units.deletestatus', 0)->get();
			if (count($dashboardunits) > 0) {
				foreach ($dashboardunits as $dashunit) {
					$unitidsarr[] = $dashunit->view_unit_id;
					$latlongs = DB::table('unit_latlong')->join('units', 'units.unit_id', '=', 'unit_latlong.latlong_unit_id')->where('unit_latlong.latlong_unit_id', $dashunit->view_unit_id)->where('units.deletestatus',0)->whereRaw('(unit_latlong.gps_status = ? OR unit_latlong.gps_status = ?)', [2, 3])->get();
					
					if(count($latlongs) > 0)
					{
						$runninghr = DB::table('unit_currentstatus')->where('generatorid', $latlongs[0]->controllerid)->where('code', 'RUNNINGHR')->get();		
						$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $latlongs[0]->controllerid)->where('code', 'ENGINESTATE')->get();	
						$location[$i]['latitude'] = $latlongs[0]->latitude;
						$location[$i]['longtitude'] = $latlongs[0]->longtitude;
						$informations[$i]['unitname'] = $latlongs[0]->unitname;
						$informations[$i]['projectname'] = $latlongs[0]->projectname;
						$informations[$i]['uid'] = $latlongs[0]->unit_id;
						$informations[$i]['location'] = $latlongs[0]->location;			
						if(count($runninghr) > 0) {
							if($runninghr) {
								$informations[$i]['runninghr'] = $runninghr[0]->value;
							}
						}
						else 
							$informations[$i]['runninghr'] = 0; 

						
						$unit = new Unit;						
						$colorcode = $unit->getstatuscolor($latlongs[0]->unit_id);
						$informations[$i]['colorcode'] = $colorcode; 
						
						if($colorcode == "51B749") {							
							$icons[$i] = url("/")."/images/running_map.png";
						} else if($colorcode == "ffb400") {
							$icons[$i] = url("/")."/images/warning_map.png";
						} else if($colorcode == "b60015") {
							$icons[$i] = url("/")."/images/alarm_map.png";
						} else if($colorcode == "8C8C8A") {
							$icons[$i] = url("/")."/images/offline_map.png";
							++$offlinecount;
						}  
						//$icons[$i] = url("/")."/images/multicolormap.png";
						$gpstodatetime = strtotime($latlongs[0]->todatetime);
						$gpsfromdatetime = strtotime($latlongs[0]->fromdatetime);
						if($gpsfromdatetime != $gpstodatetime) {
							$gpsreceiveddate = strtotime($latlongs[0]->receiveddate);
							$addfourhours = strtotime("+4 hours", strtotime($latlongs[0]->todatetime));
							if($gpsreceiveddate > $addfourhours) {	
								if($colorcode == "8C8C8A") {
									$location[$i]['latitude'] = 0;
									$location[$i]['longtitude'] = 0;
								}						
								$icons[$i] = url("/")."/images/multicolormap.png";
							}
						}
						$i++;				
					}
					
				}
				$unitids = implode('#', $unitidsarr);
			}

			if($icons && is_array($icons)) {
				$icons = @implode('#-#', $icons);
			}

			if(in_array(1,$mainmenu)) {	
				$role_id = $session->get('role_id');
				$access = DB::table('role_permissions')->where('module_name','1')->where('role_id',$role_id)->get();
			}
			//echo count($dashboardunits); exit;
			return $dataTable->render('Dashboard.index', ['unitids' => $unitids, 'ses_login_id' => $ses_login_id, 'dashboardunits' => $dashboardunits, 'access' => $access, 'location' => $location, 'informations' => $informations, 'icons' => $icons, 'offlinecount' => $offlinecount, 'warningcount' => $warningcount, 'runningcount' => $runningcount, 'alarmcount' => $alarmcount]);			
		}
	}

    public function setdashboardfavorite(Request $request) {
        $result = '';
        $unitid = $request->unitid;
        $loginid = $request->loginid;
        $unitids = $viewallunits = array();
        $dashboardunits = DB::table('view_on_dashboard')->where('view_staff_id', $loginid)->get();

        if (count($dashboardunits) > 0) {
               foreach ($dashboardunits as $dashunit) 
                  {
                        $unitids[] = $dashunit->view_unit_id;
                  }
                    //$unitids = @implode(',', $unitids);
            }

        
        $is_mobile = $request->is_mobile;
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
            $allunits = DB::table('units')
                    ->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->whereIn('units.unit_id', $unitids)
            ->where('deletestatus',0)       
                    ->get();
            
            $unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->whereIn('units.unit_id', $unitids)
            ->where('units.deletestatus',0)->get();
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
// Current Status - Kannan
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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        //
    }

    //hide view on dashboard
    public function delete($id, $ismobile) {
        $session = new Session();
        $ses_login_id = $session->get('ses_login_id');

        DB::table('view_on_dashboard')->where('view_unit_id', $id)->where('view_staff_id', $ses_login_id)->delete();
        $dashboards = DB::table('view_on_dashboard')->where('view_staff_id', $ses_login_id)->get();

        if ($ismobile == 0)
            return redirect('/dashboard');
        else {
            $msg = array(array('Error' => '0', 'result' => 'Unit hided in dashboard'));
            return response()->json(['dashboards' => $dashboards, 'msg' => $msg]);
        }
    }

    public function mapwebview(Request $request) {

        $ses_login_id = $request->ses_login_id;
        //die($ses_login_id);
        $dashboardunits = DB::table('view_on_dashboard')->where('view_staff_id', $ses_login_id)->get();
        $i = 0;
        $location = $informations = '';
        if (count($dashboardunits) > 0) {
            foreach ($dashboardunits as $dashunits) {
                $latlongs = DB::table('unit_latlong')->join('units', 'units.unit_id', '=', 'unit_latlong.latlong_unit_id')->where('unit_latlong.latlong_unit_id', $dashunits->view_unit_id)->get();
                if (count($latlongs) > 0) {
                    $runninghr = DB::table('unit_currentstatus')->where('generatorid', $latlongs[0]->controllerid)->where('code', 'RUNNINGHR')->get();
                    $location[$i]['latitude'] = $latlongs[0]->latitude;
                    $location[$i]['longtitude'] = $latlongs[0]->longtitude;
                    $informations[$i]['unitname'] = $latlongs[0]->unitname;
                    $informations[$i]['projectname'] = $latlongs[0]->projectname;
                    $informations[$i]['uid'] = $latlongs[0]->unit_id;
                    if (count($runninghr) > 0) {
                        $informations[$i]['runninghr'] = $runninghr[0]->value;
                    } else {
                        $informations[$i]['runninghr'] = 0;
                    }
                }
                $i++;
            }
        }
        return view('Dashboard.mapwebview', ['location' => $location, 'informations' => $informations]);
    }

    public function dashboardaction(Request $request) {

        $ismobile = $request->is_mobile;
        $id = $request->id;
        $action = $request->action;
		$idsarr = explode(',', $id);


		if($ismobile == '1') {
			$loginid = $request->loginid;
		}
		else {
			$session = new Session();
			$session->set('viewids', $idsarr);
			$loginid = $request->loginid;
		}                       
        if ($action == 'hide') {            
            foreach ($idsarr as $id) {
                DB::table('view_on_dashboard')->where('view_on_id', $id)->where('view_staff_id',$loginid)->delete();
            }
            if ($ismobile == 1) {
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
                        if (count($chkfav) > 0)
                            $units[$i]['favorite'] = 1;
                        else
                            $units[$i]['favorite'] = 0;

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
                return response()->json(['msg' => array('result' => 'success'), 'units' => $units]);
            } else {
                $session->getFlashBag()->add('unithidedon_dash', 'Selected units hided Successfully');
                return redirect('/dashboard');
            }
        }
        if ($action == 'view') {        
            $unitids = DB::table('view_on_dashboard')->whereIn('view_on_id', $idsarr)->where('view_staff_id', $loginid)->get();
             
            if (count($unitids) > 0) {
                $firstunitid = $unitids[0]->view_unit_id;
                foreach ($unitids as $unitid) {
                    $unitidarr[] = $unitid->view_unit_id;
                }
                $session->set('viewids', $unitidarr);
            }
            return redirect('/' . $firstunitid . '/0/unitdetails');            
        }
    }

    public function onholddashboardaction(Request $request) {

        $ismobile = $request->is_mobile;
        $id = $request->id;
        $action = $request->action;
		$idsarr = explode(',', $id);


		if($ismobile == '1') {
			$loginid = $request->loginid;
		}
		else {
			$session = new Session();
			$session->set('viewids', $idsarr);
			$loginid = $request->loginid;
		}                       
        if ($action == 'hide') {            
            foreach ($idsarr as $id) {
                DB::table('view_on_dashboard')->where('view_on_id', $id)->where('view_staff_id',$loginid)->delete();
            }
            if ($ismobile == 1) {
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
                return response()->json(['msg' => array('result' => 'Selected units hided Successfully'), 'units' => $units]);
            } else {
                $session->getFlashBag()->add('unithidedon_dash', 'Selected units hided Successfully');
                return redirect('/dashboard');
            }
        }
        if ($action == 'view') {        
            $unitids = DB::table('view_on_dashboard')->whereIn('view_on_id', $idsarr)->where('view_staff_id', $loginid)->get();
             
            if (count($unitids) > 0) {
                $firstunitid = $unitids[0]->view_unit_id;
                foreach ($unitids as $unitid) {
                    $unitidarr[] = $unitid->view_unit_id;
                }
                $session->set('viewids', $unitidarr);
            }
            return redirect('/' . $firstunitid . '/0/unitdetails');            
        }


       /* if( $action=='favorite'){
            $ismobile = $request->is_mobile;
            $loginid = $request->ses_login_id;
            foreach ($id as $unitid){					
                DB::table('unit_favorites')->insert(['units_id' => $unitid, 'staffs_id' => $loginid ]);
             }
             return response()->json(['msg' => array('result' => 'Favourite successfully'));
           

        }*/
        
        if( $action=='favorite'){
                $unitid = explode(",",$request->id);
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

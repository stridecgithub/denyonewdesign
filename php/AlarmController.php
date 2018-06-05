<?php

namespace App\Http\Controllers;

use App\Alarm;
use DB;
use App\Unit;
use App\Staff;
use App\Timezone;
use App\Service;
use Mail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use App\DataTables\AlarmLogDataTable;
use Yajra\Datatables\Datatables;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlarmController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, AlarmLogDataTable $dataTable) {
        $timezone = new Timezone;
        $session = new Session();
        $session->set('alarmpage', 'alarm');
        $ismobile = $request->is_mobile;
        $unitid = $request->unitid;

        if ($ismobile == 1) {
            $startindex = $request->tartindex; // start limit
            $results = $request->results; // end limit		
            $sort = $request->sort;
            $dir = $request->dir;
            $type = $request->type;
            if ($type == "alarm") {
                $allalarms = DB::table('alarms')->where('alarm_unit_id', $unitid)->where('alarm_status', '0')->where('active_changed', '0')->get();
                $alarmlist = DB::table('alarms')->where('alarm_unit_id', $unitid)->where('alarm_status', '0')->where('active_changed', '0')->orderBy($sort,$dir)->skip($startindex)->take($results)->get();

           

            } else {
                $allalarms = DB::table('alarms')->where('alarm_unit_id',$unitid)->where('active_changed', '0')->get();
                $alarmlist = DB::table('alarms')->where('alarm_unit_id',$unitid)->where('active_changed', '0')->orderBy($sort,$dir)->skip($startindex)->take($results)->get();
		      if($sort == "alarm_priority")
                {
                     //$allalarms = DB::table('alarms')->where('alarm_unit_id', $unitid)->where('alarm_status', '0')->orderBy('alarm_priority',$dir)->get();
		              $allalarms = DB::table('alarms')->where('alarm_unit_id', $unitid)->orderBy('alarm_priority',$dir)->get();
                     //$alarmlist = DB::table('alarms')->where('alarm_unit_id', $unitid)->where('alarm_status', '0')->orderBy('alarm_priority',$dir)->skip($startindex)->take($results)->get();
		              $alarmlist = DB::table('alarms')->where('alarm_unit_id', $unitid)->orderBy('alarm_priority',$dir)->skip($startindex)->take($results)->get();

                }
                elseif($sort == "alarm_received_date")
                {
                     $allalarms = DB::table('alarms')->where('alarm_unit_id', $unitid)->orderBy('alarm_received_date',$dir)->get();
                     $alarmlist = DB::table('alarms')->where('alarm_unit_id', $unitid)->orderBy('alarm_received_date',$dir)->skip($startindex)->take($results)->get();

                }
            }
            $alarms = '';
            if ($alarmlist) {
                $i = 0;
                foreach ($alarmlist as $alarm) {
                    $alarms[$i]['alarm_id'] = $alarm->alarm_id;
                    $alarms[$i]['alarm_unit_id'] = $alarm->alarm_unit_id;
                    $alarms[$i]['alarm_name'] = $alarm->alarm_name;
                    $alarms[$i]['alarm_assgined_by'] = $alarm->alarm_assigned_by;
			$actualalarmname = strtolower($alarm->alarm_name);
		    $alarms[$i]['isactivealarm'] = $alarm->is_active_alarm;

		    if(strpos($actualalarmname, "sd") !== false || strpos($actualalarmname, "eme") !== false || strpos($actualalarmname, "boc") !== false) {
			$alarmicon = 'sd';
		   } else if(strpos($actualalarmname, "fls") !== false) {
			$alarmicon = 'fls';
			} else {
			$alarmicon = 'wrn';
			}
			$alarms[$i]['alarmicon'] = $alarmicon;
			$alarms[$i]['bgcolor'] = '';
		    if($alarm->is_active_alarm == 1) {
			if($alarmicon == "sd") {
				$alarms[$i]['bgcolor'] = '#F00';
			} else if($alarmicon == "fls") {
				$alarms[$i]['bgcolor'] = '#c2c3c3';
			} else {
				$alarms[$i]['bgcolor'] = '#F9AB00';
			}
		    }

                    if ($alarm->alarm_assigned_by > 0) {
                        $assignby = Staff::where('staff_id', $alarm->alarm_assigned_by)->select('firstname','lastname', 'personalhashtag')->get();
			if(count($assignby) > 0) {
		                $alarms[$i]['alarm_assginedby_name'] = $assignby[0]->firstname." ".$assignby[0]->lastname;
				$alarms[$i]['alarm_assginedby_hashtag'] = $assignby[0]->personalhashtag;
			} else {
                        $alarms[$i]['alarm_assginedby_name'] = '';
			$alarms[$i]['alarm_assginedby_hashtag'] = '';
		        }
                    } else {
                        $alarms[$i]['alarm_assginedby_name'] = '';
			$alarms[$i]['alarm_assginedby_hashtag'] = '';
		    }
                    $alarms[$i]['alarm_assgined_to'] = $alarm->alarm_assigned_to;
                    if ($alarm->alarm_assigned_to > 0) {
                        $assignto = Staff::where('staff_id', $alarm->alarm_assigned_to)->select('firstname','lastname', 'personalhashtag')->get();
			if(count($assignto) > 0) {
		                $alarms[$i]['alarm_assginedto_name'] = $assignto[0]->firstname." ".$assignto[0]->lastname;
				$alarms[$i]['alarm_assginedto_hashtag'] = $assignto[0]->personalhashtag;
			}
			else {
                        $alarms[$i]['alarm_assginedto_name'] = '';
			$alarms[$i]['alarm_assginedto_hashtag'] = '';
		    	}
                    } else {
                        $alarms[$i]['alarm_assginedto_name'] = '';
			$alarms[$i]['alarm_assginedto_hashtag'] = '';
		    }
                    if ($alarm->alarm_assigned_date == "0000-00-00 00:00:00"){
                        $alarms[$i]['alarm_assigned_date'] = '';
                    }else{
                        $alarms[$i]['alarm_assigned_date'] = date("d M Y h:iA", strtotime($alarm->alarm_assigned_date));
                    $alarms[$i]['alarm_assigned_date_mobileview'] = date("d/m/Y", strtotime($alarm->alarm_assigned_date));
                   
                     } 
                     
                     $alarms[$i]['alarm_received_date'] = date("d M Y h:iA", strtotime($alarm->alarm_received_date));
            
            
                     $alarms[$i]['alarm_received_date_mobileview'] = date("d/m/Y", strtotime($alarm->alarm_received_date));
		
            		
                    

                    if( $request->input('timezoneoffset')){	
                        $alarms[$i]['alarm_received_time'] = $timezone->convertUTCtoTime($alarm->alarm_received_date,$request->input('timezoneoffset'));
                    }else{
                        $alarms[$i]['alarm_received_time'] = date("h:i A", strtotime($alarm->alarm_received_date));
                    }
                    
                    $alarms[$i]['alarm_status'] = $alarm->alarm_status;
                    $alarms[$i]['alarm_priority'] = $alarm->alarm_priority;
                    $alarms[$i]['alarm_remark'] = $alarm->alarm_remark;


			 $alarmname = strtolower($alarm->alarm_name);
			
			if(strpos($alarmname, 'voltage') !== false) {
			    $code = "VOLT1";
			    if(strpos($alarmname, 'l1l2') !== false) {
				$code = "VOLT1";
			    } else if(strpos($alarmname, 'l2l3') !== false) {
				$code = "VOLT2";
			    } else if(strpos($alarmname, 'l3l1') !== false) {
				$code = "VOLT3";
			    } else if(strpos($alarmname, 'l1 >') !== false || strpos($alarmname, 'l1 <') !== false) {
				$code = "VOLT1";
			    } else if(strpos($alarmname, 'l2 >') !== false || strpos($alarmname, 'l2 <') !== false) {
				$code = "VOLT2";
			    } else if(strpos($alarmname, 'l3 >') !== false || strpos($alarmname, 'l3 <') !== false) {
				$code = "VOLT3";
			    }
			}
			else if (strpos($alarmname, 'current') !== false) {
			    $code = "CURRENT1";
			    if(strpos($alarmname, 'l1 >') !== false || strpos($alarmname, 'l1 <') !== false) {
				$code = "CURRENT1";
			    } else if(strpos($alarmname, 'l2 >') !== false || strpos($alarmname, 'l2 <') !== false) {
				$code = "CURRENT2";
			    } else if(strpos($alarmname, 'l3 >') !== false || strpos($alarmname, 'l3 <') !== false) {
				$code = "CURRENT3";
			    }
			}
			else if (strpos($alarmname, 'oil') !== false)
			    $code = "OILPRESSURE";
			else if (strpos($alarmname, 'fuel') !== false)
			    $code = "FUELLEVEL";
			else if (strpos($alarmname, 'coolant') !== false)
			    $code = "COLLANTTEMP";
			else if (strpos($alarmname, 'frequency') !== false)
			    $code = "FREQ";
			else if (strpos($alarmname, 'battery') !== false)
			    $code = "BATTERYVOLTAGE";
			else if (strpos($alarmname, 'speed') !== false)
			    $code = "ENGSPEED";
			else if (strpos($alarmname, 'load') !== false)
			    $code = "LOADPOWER";
			else
			    $code = '';

			$alarms[$i]['code'] = $code;

                    ++$i;
                }
            }
            $msg = array('result' => 'success');
            return response()->json(['msg' => $msg, 'totalCount' => $allalarms->count(), 'alarms' => $alarms]);
        }
        else {
            $unitid = $session->get('unit_id');
            $unitdata = Unit::where('unit_id', $unitid)->get();
            $runninghrs = '';
            $currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unitdata[0]->controllerid)->where('code', 'RUNNINGHR')->get();
            if (count($currentstatus) > 0) {
                $runninghrs = $currentstatus[0]->value;
            }
            
            $unitlatlong = DB::table('unit_latlong')->where('latlong_unit_id', $unitid)->get();
            $session->set('alarmpage', 'alarm');
	    	$unit = new Unit;
		$nxtservicedate = $unit->nextservicedate($unitid);
		$colorcode = $unit->getstatuscolor($unitid);
            	return $dataTable->render('Alarm.alarms', ['unitdata' => $unitdata, 'unitlatlong' => $unitlatlong, 'runninghrs' => $runninghrs, 'nxtservicedate' => $nxtservicedate, 'unitid' => $unitid, 'colorcode' => $colorcode]);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function alarmlog(Request $request, AlarmLogDataTable $dataTable) {
        $session = new Session();
        $unitid = $session->get('unit_id');
        $unitdata = Unit::where('unit_id', $unitid)->get();
        $session->set('alarmpage', 'alarmlog');

        $ismobile = $request->is_mobile;
        //$unitid = $request->unitid;		
        //
		$runninghrs = '';
        $currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unitdata[0]->controllerid)->where('code', 'RUNNINGHR')->get();
        if (count($currentstatus) > 0) {
            $runninghrs = $currentstatus[0]->value;
        }
        $nxtservicedateqry = Service::where('deletestatus', '0')->where('service_unitid', $unitid)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
        if (count($nxtservicedateqry) > 0) {
            $nxtservicedate = date('d M Y', strtotime($nxtservicedateqry[0]->next_service_date));
        } else {
            $nxtservicedate = '';
        }
        //
        $unitdata = Unit::where('unit_id', $unitid)->get();
        $unitlatlong = DB::table('unit_latlong')->where('latlong_unit_id', $unitid)->get();
	$unit = new Unit;
		$nxtservicedate = $unit->nextservicedate($unitid);
		$colorcode = $unit->getstatuscolor($unitid);
        return $dataTable->render('Alarm.alarmlog', ['unitdata' => $unitdata, 'unitlatlong' => $unitlatlong, 'runninghrs' => $runninghrs, 'nxtservicedate' => $nxtservicedate, 'colorcode' => $colorcode, 'unitid' => $unitid]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function assignalarm(Request $request) {

        $timezone = new Timezone;
		if( $request->input('timezoneoffset')){		
            $timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
            $alarmdata['timezone'] = $timezonename;
		}else{
            $timezonename='';
            $alarmdata['timezone'] =  $timezonename;
        }
        if($request->current_datetime){
            $current_datetime=$request->current_datetime;
            $alarmdata['alarm_assigned_date'] =$request->alarm_assigned_date;
            $alarmdata['alarm_assigned_time'] = $current_datetime;
		}else{
            $current_datetime= date('Y-m-d H:i:s');
            $alarmdata['alarm_assigned_date'] =$request->alarm_assigned_date;//date("Y-m-d H:i:s", strtotime($request->alarm_assigned_date));
            $alarmdata['alarm_assigned_time'] = date('Y-m-d H:i:s');
        }
        
        $ismobile = $request->is_mobile;
        $alarmid = $request->alarmid;
	$alarmassignto = 0;
        $alarmdata['alarm_assigned_by'] = $request->alarm_assigned_by;
	/*if($ismobile == 1) {
		$staff = DB::table('staffs')->where('personalhashtag', $request->alarm_assigned_to)->get();
		if(count($staff) > 0) {
			$alarmdata['alarm_assigned_to'] = $staff[0]->staff_id;
			$alarmassignto = $staff[0]->staff_id;
		}
	} else {
		$alarmdata['alarm_assigned_to'] = $request->alarm_assigned_to;
		$alarmassignto = $request->alarm_assigned_to;
	}*/
	$alarmdata['alarm_assigned_to'] = $request->alarm_assigned_to;
    $alarmassignto = $request->alarm_assigned_to;
    

      
	
        $remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->alarm_remark));
        $remark = str_replace('</span>', '', $remark);
        $remark = str_replace('&nbsp;', '', $remark);
        $remark = str_replace('<br>', '', $remark);
        $remark = str_replace('?', '', $remark);
        $remark = str_replace('\xE2\x80\x8D', '', $remark);
        $remark = str_replace('\u200d', '', $remark);
        $remark = strip_tags(stripslashes($remark));
        //$remark = trim($request->alarm_remark);
        $alarmdata['alarm_remark'] = $remark;

	

        // assign alarm - update alarms table
        DB::table('alarms')->where('alarm_id', $alarmid)->update($alarmdata);


       
        $alarms = DB::table('alarms')->where('alarm_id', $alarmid)->get();

        $unit = DB::table('units')->where('unit_id', $alarms[0]->alarm_unit_id)->get();
        $assignby = Staff::where('staff_id', $request->alarm_assigned_by)->select('firstname', 'email')->get();
        $assignto = Staff::where('staff_id', $alarmassignto)->select('firstname')->get();

        // get notify content for send push notifications
        $notifycontent = '';
        $notifys = DB::table('notification_content')->where('notify_type', 'A')->get();

        if ($notifys) {
            $notify_content = $notifys[0]->notify_for . '<br>' . $notifys[0]->notify_content;
            if ($alarms[0]->alarm_priority == 1) {
                $type = 'Tripped<br>';
            } else {
                $type = 'Warning<br>';
            }

            $notify_content = str_replace('#NAME#', $assignby[0]->firstname, $notify_content);
            $notify_content = str_replace('#UNITNAME#', $unit[0]->unitname, $notify_content);

            $notify_content = str_replace('#TYPE#', $type, $notify_content);
            $notify_content = str_replace('#PROJECTNAME#', $unit[0]->projectname, $notify_content);
            $notify_content = str_replace('#ALARMSUBJECT#', $alarms[0]->alarm_name, $notify_content);
            $notifycontent = str_replace('#DATETIME#', date('d M Y h:iA', strtotime($alarms[0]->alarm_assigned_date)), $notify_content);
            $notifycontent = nl2br($notifycontent);
        }
        $pushid='';
        // get the personalhashtags from remark
        $emailids = $mentionids = $notifyids = '';
        $notifyids[] = $request->alarm_assigned_to;
        $notifyemail = Staff::where('staff_id', $alarmassignto)->select('email')->get();
        if ($notifyemail)
            $emailids[] = $notifyemail[0]->email;
        $hashtags = @explode(' ', $remark);
	if(isset($request->pushnotify)) {
		$hashtags = @explode(' ',$request->pushnotify);
	}
        if ($hashtags) {
            foreach ($hashtags as $hashtag) {
                $chkhashtag = substr($hashtag, 0, 1);
                $hashtag = preg_replace('/[^A-Za-z0-9\-]/', '', $hashtag);
                if ($chkhashtag == "@") {
                    $hashtag = '@' . $hashtag;
                    $staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
                    if (count($staffs)) {
                        $emailids[] = $staffs[0]->email;
                        $notifyids[] = $staffs[0]->staff_id;
                    }
                }
            }
        }
	
        if (count($notifyids) > 0) {
            // Insert data for send push notifications
            for ($i = 0; $i < count($notifyids); $i++) {
                $pushid=DB::table('pushnotifications')->insertGetId(['notify_content' => $notifycontent, 'notify_by' => $request->alarm_assigned_by, 'notify_to' => $notifyids[$i], 'notify_type' => 'A', 'table_id' => $alarmid, 'notify_subject' => 'Assign Alarm']);
            }
        }

        if ($emailids) {
            $content = '<table width="100%" cellpadding="5" cellspacing="5">';
            $content .= '<tr><td><b>Alarm Task Assign:</b><br></td></tr>';
            $content .= '<tr><td>Unit Name: ' . $unit[0]->unitname . '</td></tr>';
            $content .= '<tr><td>Project Name: ' . $unit[0]->projectname . '</td></tr>';
            $content .= '<tr><td>Location: ' . $unit[0]->location . '</td></tr>';
            $content .= '<tr><td>Subject: ' . $alarms[0]->alarm_name . '</td></tr>';
            $content .= '<tr><td>Alarm Assigned By: ' . $assignby[0]->firstname . '</td></tr>';
            $content .= '<tr><td>Alarm Assigned To: ' . $assignto[0]->firstname . '</td></tr>';
            $content .= '<tr><td>Remark: ' . $remark . '</td></tr>';
            $content .= '</table>';
            $subject = 'Alarm Task Assign';
            $replyto = $assignby[0]->email;
            $data = array('replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);
            Mail::send('emails.service', $data, function ($m) use ($data, $emailids) {
                $m->from('cip@stridec.com', 'Denyo');
                $m->replyTo($data['replytoemail'], $name = null);
                $m->bcc('balamurugan@webneo.in', '');
                $m->to($emailids, '')->subject($data['subject']);
            });
        }

        if ($ismobile == 1) {
            $msg = array(array('Error' => '0', 'result' => 'Alarm task assigned successfully','pushid'=>$pushid));
            return response()->json(['msg' => $msg]);
        } else {
            return redirect('/alarmlog')->with('alert', 'Alarm task assigned successfully');
        }
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
        $session = new Session();
        $ses_login_id = $session->get('ses_login_id');
        DB::table('pushnotifications')->where('notify_to', $ses_login_id)->where('table_id', $id)->update(['notify_to_readstatus' => '1']);

        $assignby = $assignto = $assigndate = $actualhistorydata = '';
        $alarms = Alarm::where('alarm_id', $id)->get();
	if(count($alarms) > 0) {
	
        $alarms = $alarms[0];
        $units = Unit::where('unit_id', $alarms->alarm_unit_id)->get();
        $units = $units[0];
        $currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units->controllerid)->where('code', 'RUNNINGHR')->get();
        $runninghrs = 0;
        if (count($currentstatus) > 0)
            $runninghrs = $currentstatus[0]->value;

        $alarmassignby = Staff::where('staff_id', $alarms->alarm_assigned_by)->select('firstname', 'personalhashtag')->get();
        if (count($alarmassignby) > 0) {
            $assignby = $alarmassignby[0]->firstname.' ('.$alarmassignby[0]->personalhashtag.')';
        }

        $alarmassignto = Staff::where('staff_id', $alarms->alarm_assigned_to)->select('firstname', 'personalhashtag')->get();
        if (count($alarmassignto) > 0) {
            $assignto = $alarmassignto[0]->firstname.' ('.$alarmassignto[0]->personalhashtag.')';
        }

        if ($alarms->alarm_assigned_date != "0000-00-00 00:00:00" && $alarms->alarm_assigned_date != '')
            $assigndate = date('d M Y h:i A', strtotime($alarms->alarm_assigned_date));

        $alarmname = strtolower($alarms->alarm_name);
        //print_r($alarmname);
        if(strpos($alarmname, 'voltage') !== false) {
            $code = "VOLT1";
	    if(strpos($alarmname, 'l1l2') !== false) {
		$code = "VOLT1";
	    } else if(strpos($alarmname, 'l2l3') !== false) {
		$code = "VOLT2";
	    } else if(strpos($alarmname, 'l3l1') !== false) {
		$code = "VOLT3";
	    } else if(strpos($alarmname, 'l1 >') !== false || strpos($alarmname, 'l1 <') !== false) {
		$code = "VOLT1";
	    } else if(strpos($alarmname, 'l2 >') !== false || strpos($alarmname, 'l2 <') !== false) {
		$code = "VOLT2";
	    } else if(strpos($alarmname, 'l3 >') !== false || strpos($alarmname, 'l3 <') !== false) {
		$code = "VOLT3";
	    }
	}
        else if (strpos($alarmname, 'current') !== false) {
            $code = "CURRENT1";
	    if(strpos($alarmname, 'l1 >') !== false || strpos($alarmname, 'l1 <') !== false) {
		$code = "CURRENT1";
	    } else if(strpos($alarmname, 'l2 >') !== false || strpos($alarmname, 'l2 <') !== false) {
		$code = "CURRENT2";
	    } else if(strpos($alarmname, 'l3 >') !== false || strpos($alarmname, 'l3 <') !== false) {
		$code = "CURRENT3";
	    }
	}
        else if (strpos($alarmname, 'oil') !== false)
            $code = "OILPRESSURE";
        else if (strpos($alarmname, 'fuel') !== false)
            $code = "FUELLEVEL";
        else if (strpos($alarmname, 'coolant') !== false)
            $code = "COLLANTTEMP";
        else if (strpos($alarmname, 'frequency') !== false)
            $code = "FREQ";
        else if (strpos($alarmname, 'battery') !== false)
            $code = "BATTERYVOLTAGE";
	else if (strpos($alarmname, 'speed') !== false)
            $code = "ENGSPEED";
	else if (strpos($alarmname, 'load') !== false)
            $code = "LOADPOWER";
        else
            $code = '';
        //$currentdate = date("Y-m-d H:i", strtotime($alarms->alarm_received_date));				
        //$previousdate = date("Y-m-d H:i", strtotime('-15 minutes', strtotime($currentdate)));
        $fromdate = date("Y-m-d");
        $todate = date("Y-m-d");
        


        $firstdata = DB::table('unitdatahistory_' . $alarms->alarm_unit_id)->where('code', $code)->where('todateandtime', 'LIKE', "$fromdate%")->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();

        $alarmdata = DB::table('unitdatahistory_' . $alarms->alarm_unit_id)->where('code', $code)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'asc')->get();

	if(count($alarmdata) <= 0) {
		$alarmdata = DB::table('unitdatahistory_' . $alarms->alarm_unit_id)->where('code', $code)->orderBy('todateandtime', 'desc')->skip(0)->take(1)->get();
	}

        $nxtservicedateqry = Service::where('deletestatus', '0')->where('service_unitid', $alarms->alarm_unit_id)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
        if (count($nxtservicedateqry) > 0) {
            $nxtservicedate = $nxtservicedateqry[0]->next_service_date;
        } else {
            $nxtservicedate = '';
        }
        $unitlatlong = DB::table('unit_latlong')->where('latlong_unit_id', $alarms->alarm_unit_id)->get();
        if (count($unitlatlong) > 0) {
            $lat = $unitlatlong[0]->latitude;
            $lng = $unitlatlong[0]->longtitude;
        } else {
            $lat = '';
            $lng = '';
        }
	$unit = new Unit;
		$nxtservicedate = $unit->nextservicedate($units->unit_id);
		$colorcode = $unit->getstatuscolor($units->unit_id);

	
        return view('Alarm.show', ['alarms' => $alarms, 'units' => $units, 'runninghrs' => $runninghrs, 'returnpage' => 'alarms', 'assignby' => $assignby, 'assignto' => $assignto, 'assigndate' => $assigndate, 'alarmdata' => $alarmdata, 'code' => $code, 'id' => $id, 'timeframe' => '', 'currentdate' => $fromdate, 'previousdate' => $todate, 'firstdata' => $firstdata, 'nxtservicedate' => $nxtservicedate, 'lat' => $lat, 'lng' => $lng, 'colorcode' => $colorcode]);
	}
    }

    /**
     *
     *
     */
    public function alarmlogtrendline(Request $request) {
        $ses_login_id = $request->loginid;
        $id = $request->alarm_id;
        DB::table('pushnotifications')->where('notify_to', $ses_login_id)->where('notify_to', $ses_login_id)->where('table_id', $id)->update(['notify_to_readstatus' => '1']);

        $assignby = $assignto = $assigndate = $actualhistorydata = '';
        $alarms = Alarm::where('alarm_id', $id)->get();
        if (count($alarms) > 0) {
            $alarms = $alarms[0];
            if (Schema::hasTable('unitdatahistory_' . $alarms->alarm_unit_id)) {
                //


                $units = Unit::where('unit_id', $alarms->alarm_unit_id)->get();
                if (count($units) > 0) {
                    $units = $units[0];
                    $currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units->controllerid)->where('code', 'RUNNINGHR')->get();
                }


                $runninghrs = 0;
                if (count($currentstatus) > 0)
                    $runninghrs = $currentstatus[0]->value;

                $alarmassignby = Staff::where('staff_id', $alarms->alarm_assigned_by)->select('firstname')->get();
                if (count($alarmassignby) > 0) {
                    $assignby = $alarmassignby[0]->firstname;
                }

                $alarmassignto = Staff::where('staff_id', $alarms->alarm_assigned_to)->select('firstname')->get();
                if (count($alarmassignto) > 0) {
                    $assignto = $alarmassignto[0]->firstname;
                }

                if ($alarms->alarm_assigned_date != "0000-00-00 00:00:00" && $alarms->alarm_assigned_date != '')
                    $assigndate = date('d M Y h:i A', strtotime($alarms->alarm_assigned_date));

                $alarmname = strtolower($alarms->alarm_name);

                if(strpos($alarmname, 'voltage') !== false) {
		    $code = "VOLT1";
		    if(strpos($alarmname, 'l1l2') !== false) {
			$code = "VOLT1";
		    } else if(strpos($alarmname, 'l2l3') !== false) {
			$code = "VOLT2";
		    } else if(strpos($alarmname, 'l3l1') !== false) {
			$code = "VOLT3";
		    } else if(strpos($alarmname, 'l1 >') !== false || strpos($alarmname, 'l1 <') !== false) {
			$code = "VOLT1";
		    } else if(strpos($alarmname, 'l2 >') !== false || strpos($alarmname, 'l2 <') !== false) {
			$code = "VOLT2";
		    } else if(strpos($alarmname, 'l3 >') !== false || strpos($alarmname, 'l3 <') !== false) {
			$code = "VOLT3";
		    }
		}
		else if (strpos($alarmname, 'current') !== false) {
		    $code = "CURRENT1";
		    if(strpos($alarmname, 'l1 >') !== false || strpos($alarmname, 'l1 <') !== false) {
			$code = "CURRENT1";
		    } else if(strpos($alarmname, 'l2 >') !== false || strpos($alarmname, 'l2 <') !== false) {
			$code = "CURRENT2";
		    } else if(strpos($alarmname, 'l3 >') !== false || strpos($alarmname, 'l3 <') !== false) {
			$code = "CURRENT3";
		    }
		}
		else if (strpos($alarmname, 'oil') !== false)
		    $code = "OILPRESSURE";
		else if (strpos($alarmname, 'fuel') !== false)
		    $code = "FUELLEVEL";
		else if (strpos($alarmname, 'coolant') !== false)
		    $code = "COLLANTTEMP";
		else if (strpos($alarmname, 'frequency') !== false)
		    $code = "FREQ";
		else if (strpos($alarmname, 'battery') !== false)
		    $code = "BATTERYVOLTAGE";
		else if (strpos($alarmname, 'speed') !== false)
		    $code = "ENGSPEED";
		else if (strpos($alarmname, 'load') !== false)
		    $code = "LOADPOWER";
		else
		    $code = '';

                $fromdate = date("Y-m-d");
                $todate = date("Y-m-d");


                $firstdata = DB::table('unitdatahistory_' . $alarms->alarm_unit_id)->where('code', $code)->where('todateandtime', 'LIKE', "$fromdate%")->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();

                $alarmdata = DB::table('unitdatahistory_' . $alarms->alarm_unit_id)->where('code', $code)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'asc')->get();

                $nxtservicedateqry = Service::where('deletestatus', '0')->where('service_unitid', $alarms->alarm_unit_id)->orderBy('service_id', 'desc')->get();
                if (count($nxtservicedateqry) > 0) {
                    $nxtservicedate = $nxtservicedateqry[0]->next_service_date;
                } else {
                    $nxtservicedate = '';
                }
                $unitlatlong = DB::table('unit_latlong')->where('latlong_unit_id', $alarms->alarm_unit_id)->get();
                if (count($unitlatlong) > 0) {
                    $lat = $unitlatlong[0]->latitude;
                    $lng = $unitlatlong[0]->longtitude;
                } else {
                    $lat = '';
                    $lng = '';
                }
                return view('Alarm.show_webview', ['alarms' => $alarms, 'units' => $units, 'runninghrs' => $runninghrs, 'returnpage' => 'alarms', 'assignby' => $assignby, 'assignto' => $assignto, 'assigndate' => $assigndate, 'alarmdata' => $alarmdata, 'code' => $code, 'id' => $id, 'timeframe' => '', 'currentdate' => $fromdate, 'previousdate' => $todate, 'firstdata' => $firstdata, 'nxtservicedate' => $nxtservicedate, 'lat' => $lat, 'lng' => $lng]);
            } else {
                echo '<font color="red">Trendline chart not available in this unit!</font>';
            }
        }
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
    public function update(Request $request) {
        $alarmsdata['alarm_assigned_to'] = $request->alarm_assigned_to;
        $alarmsdata['alarm_remark'] = $request->alarm_remark;
        $alarmsdata['alarm_assigned_by'] = $request->alarm_assigned_byid;
        DB::table('alarms')->where('alarm_id', $request->alarm_id)->update($alarmsdata);
        return redirect('/alarmlog');
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

    public function alarmlog_edit($alarmid) {
        $session = new Session();
        $ses_login_id = $session->get('ses_login_id');

        $ses_company_id = $session->get('ses_company_id');
	$alarms = DB::table('alarms')->where('alarm_id', $alarmid)->get();
        $unitid = $session->get('unit_id');
	if($unitid == '' || $unitid == 0) {
		$unitid = $alarms[0]->alarm_unit_id;
	}
        $unit_details = DB::table('units')->where('unit_id', $unitid)->get();
        $assigned_to = DB::table('staffs')->where('company_id', $ses_company_id)->where('non_user', '0')->where('staff_id', '!=', $ses_login_id)->where('status', 0)->get();
        $alarm_assigned_by = DB::table('staffs')->where('staff_id', $ses_login_id)->get();


        /*$staffs = DB::table('users')->where('company_id', $ses_company_id)->where('staffs_id', '!=', $ses_login_id)->get();
        $staffids = '';
        if ($staffs) {
            foreach ($staffs as $staff) {
                $staffids[] = "'" . $staff->username . "'";
            }
            if (is_array($staffids) && $staffids)
                $staffids = @implode(',', $staffids);
        }*/
	$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('staff_id', '!=', $ses_login_id)->where('company_id', $ses_company_id)->get();

		$staffids = '';
		if($staffs)
		{
			foreach($staffs as $staff)
			{
				$staffids[] = "'".substr($staff->personalhashtag, 1, strlen($staff->personalhashtag))."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
        //
	$currentstatus = '';
	$runninghrs = 0;
	if(count($unit_details) > 0) {
        	$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit_details[0]->controllerid)->where('code', 'RUNNINGHR')->get();        
		if (count($currentstatus) > 0)
		    $runninghrs = $currentstatus[0]->value;
	}
        $nxtservicedateqry = Service::where('deletestatus', '0')->where('service_unitid', $unitid)->orderBy('service_id', 'desc')->get();
        if (count($nxtservicedateqry) > 0) {
            $nxtservicedate = date('d M Y', strtotime($nxtservicedateqry[0]->next_service_date));
        } else {
            $nxtservicedate = '';
        }
        $unitlatlong = DB::table('unit_latlong')->where('latlong_unit_id', $unitid)->get();
        if (count($unitlatlong) > 0) {
            $lat = $unitlatlong[0]->latitude;
            $lng = $unitlatlong[0]->longtitude;
        } else {
            $lat = '';
            $lng = '';
        }
        //

	$unit = new Unit;
	$nxtservicedate = $unit->nextservicedate($unitid);
	$colorcode = $unit->getstatuscolor($unitid);
        return view('Alarm.alarmlog_edit', ['alarms' => $alarms, 'alarm_assigned_by' => $alarm_assigned_by,
            'assigned_to' => $assigned_to, 'unit_details' => $unit_details, 'alarmid' => $alarmid, 'staffids' => $staffids, 'nxtservicedate' => $nxtservicedate, 'lat' => $lat, 'lng' => $lng, 'runninghrs' => $runninghrs, 'colorcode' => $colorcode]);
    }

    public function getalarm($unitid) {
        //$unitid = $request->unitid;
        $alarms = DB::table('alarms')->where('alarm_unit_id', $unitid)->where('alarm_status', '0')->get();
        if (count($alarms) > 0) {
            $msg = array(array('result' => '1'));
        } else {
            $msg = array(array('result' => '0'));
        }
        return response()->json(['msg' => $msg]);
    }

    public function editalarms2($alarmid) {
        //$unitid = $request->unitid;
        $alarms = DB::table('alarms')->where('alarm_id', $alarmid) ->join('units', 'units.unit_id', '=', 'alarms.alarm_unit_id')->get();


    
        if (count($alarms) > 0) {
            $msg = array(array('result' => '1'));
        } else {
            $msg = array(array('result' => '0'));
        }
        return response()->json(['msg' => $msg,'alarms'=>$alarms]);
    }

    public function getalarmdetails(Request $request) {
        $timezone = new Timezone;
        $alarms = '';
		$unit_status = 1;
        $alarmlist = DB::table('alarms')->where('alarm_id', $request->alarmid)->get();
        if (count($alarmlist) > 0) {
            $deletedunits = Unit::where('unit_id', $alarmlist[0]->alarm_unit_id)->where('deletestatus', 1)->get();
            if (count($deletedunits) > 0) {
				$unit_status = 0;
			}
                $i = 0;
                foreach ($alarmlist as $alarm) {
                    $alarms[$i]['alarm_id'] = $alarm->alarm_id;
                    $alarms[$i]['alarm_unit_id'] = $alarm->alarm_unit_id;
                    $alarms[$i]['alarm_name'] = $alarm->alarm_name;
                    $alarms[$i]['alarm_assgined_by'] = $alarm->alarm_assigned_by;
                    if ($alarm->alarm_assigned_by > 0) {
                        $assignby = Staff::where('staff_id', $alarm->alarm_assigned_by)->select('firstname', 'lastname', 'personalhashtag')->get();
			if(count($assignby) > 0) {
                        $alarms[$i]['alarm_assginedby_name'] = $assignby[0]->firstname.' '.$assignby[0]->lastname;
			$alarms[$i]['alarm_assginedby_hashtag'] = $assignby[0]->personalhashtag;
			} else {
                        $alarms[$i]['alarm_assginedby_name'] = '';
			$alarms[$i]['alarm_assginedby_hashtag'] = '';
			}
                    } else {
                        $alarms[$i]['alarm_assginedby_name'] = '';
			$alarms[$i]['alarm_assginedby_hashtag'] = '';
			}
                    $alarms[$i]['alarm_assgined_to'] = $alarm->alarm_assigned_to;
                    if ($alarm->alarm_assigned_to > 0) {
                        $assignto = Staff::where('staff_id', $alarm->alarm_assigned_to)->select('firstname', 'lastname', 'personalhashtag')->get();
			if(count($assignto) > 0) {
		                $alarms[$i]['alarm_assginedto_name'] = $assignto[0]->firstname.' '.$assignto[0]->lastname;
				$alarms[$i]['alarm_assginedto_hashtag'] = $assignto[0]->personalhashtag;
			}
			else {
		                $alarms[$i]['alarm_assginedto_name'] = '';
				$alarms[$i]['alarm_assginedto_hashtag'] = '';
			    }
                    } else {
                        $alarms[$i]['alarm_assginedto_name'] = '';
			$alarms[$i]['alarm_assginedto_hashtag'] = '';
		    }
                    $alarms[$i]['alarm_assigned_date'] = $alarm->alarm_assigned_date;
                    $alarms[$i]['alarm_received_date'] = $alarm->alarm_received_date;
                    
                    if( $request->input('timezoneoffset')){	
                        $alarms[$i]['alarm_received_formatted_date'] = $timezone->convertUTCtoDate($alarm->alarm_received_date,$request->input('timezoneoffset'));
                    }else{
                        $alarms[$i]['alarm_received_formatted_date'] = date('l, d M Y H:i A',strtotime($alarm->alarm_received_date));
                    }
                   

                    $alarms[$i]['alarm_received_date_mobileview'] = date('d/m/Y',strtotime($alarm->alarm_received_date));
                    $alarms[$i]['alarm_status'] = $alarm->alarm_status;


                    $alarms[$i]['alarm_priority'] = $alarm->alarm_priority;
                    $alarms[$i]['alarm_remark'] = $alarm->alarm_remark;

                    if($alarm->alarm_priority == '1')
                    {
                         $alarms[$i]['alarm_color_code']='#ff0000';
                         $alarms[$i]['labels']='Tripped';
                    }
                    elseif($alarm->alarm_priority == '2')
                    {
                        $alarms[$i]['alarm_color_code']='#ffcc00';
                         $alarms[$i]['labels']='Warning';
                    }
                    else
                    {
                         $alarms[$i]['alarm_color_code']='';
                          $alarms[$i]['labels']='';
                    }
                    $units = Unit::where('unit_id', $alarm->alarm_unit_id)->get();
                    if (count($units) > 0) {

                        $alarms[$i]['unitname'] = $units[0]->unitname;
                        $alarms[$i]['projectname'] = $units[0]->projectname;
                        $alarms[$i]['location'] = $units[0]->location;

                        $runninghrs = '';
                        $currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units[0]->controllerid)->where('code', 'RUNNINGHR')->get();
                        if (count($currentstatus) > 0) {
                            $runninghrs = $currentstatus[0]->value;
                        }

                        $alarms[$i]['runninghrs'] = $runninghrs;
                        $nxtservicedateqry = Service::where('deletestatus', '0')->where('service_unitid', $units[0]->unit_id)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
                        if (count($nxtservicedateqry) > 0) {
                            $nxtservicedate = date('d M Y', strtotime($nxtservicedateqry[0]->next_service_date));
                        } else {
                            $nxtservicedate = '';
                        }
                        $alarms[$i]['next_service_date'] = $nxtservicedate;
                        $unitgroup = DB::table('unitgroups')->where('unitgroup_id', $units[0]->unitgroups_id)->get();
                        if (count($unitgroup) > 0) {
                            $alarms[$i]['colorcode'] = $unitgroup[0]->colorcode;
                        }
                        $unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id', $alarm->alarm_unit_id)->orderBy('unit_latlong_id', 'desc')->skip(0)->take(1)->get();
                        if (count($unit_latlong) > 0) {
                            $alarms[$i]['latitude'] = $unit_latlong[0]->latitude;
                            $alarms[$i]['longtitude'] = $unit_latlong[0]->longtitude;
                        }
                    }
                }
				$alarms[$i]['unit_status'] = $unit_status;
                $msg = array('result' => 'success');
                return response()->json(['msg' => $msg, 'alarms' => $alarms]);
            
			// else {
                // $msg = array('result' => 'error');
                // return response()->json(['msg' => $msg, 'alarms' => 'no data']);
            // }
        }
    }

}

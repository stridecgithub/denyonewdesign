<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;
use App\Unit;
use App\Comment;
use App\Service;
use App\Staff;
use App\Alarm;
use App\Timezone;
use App\CompanyGroup;
use Illuminate\Support\Facades\Input;
use Illuminate\Html\HtmlServiceProvider;
use File;
use Response;
use Mail;
use Symfony\Component\HttpFoundation\Session\Session;
use App\DataTables\CommentDataTable;
use Yajra\Datatables\Html\Builder;
use Symfony\Component\Finder\Finder;

class CommentController extends Controller
{
	
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request, CommentDataTable $dataTable)
	{
		$timezone = new Timezone;
		$ismobile = $request->is_mobile;
		$unitid = $request->unitid;
		
		if($ismobile == 1)
		{
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');
			$loginid = $request->loginid;
			$type = '';
			$staff_idarr = array();
			$servicesid = array();
			$alarmsid = array();
			
			$commentsid=array();
			if($sort == 'alarm') {
				$type = "\"A\", \"OA\", \"S\", \"C\"";
			}
			else if($sort == 'service') {
				$type = "\"S\", \"A\", \"OA\", \"C\"";
			}
			else if($sort == 'comment') {
				$type = "\"C\", \"A\", \"OA\", \"S\"";
			}
			else if($sort == 'name') {
				$eventorcomments = DB::table('eventorcomments')->where('event_unit_id',$unitid)->get();
				foreach($eventorcomments as $alldata) {
					if($alldata->event_type == "S") {
						$servicesid[] = $alldata->type_table_id;
					}
					if($alldata->event_type == "C") {
						$commentsid[] = $alldata->type_table_id;
					}
					if($alldata->event_type == "A" || $alldata->event_type == "OA") {
						$alarmsid[] = $alldata->type_table_id;
					}
				}
				
				$tmpids = [];
				if(count($servicesid) > 0) {
					foreach($servicesid as $sid) {
						$servicedby_qry = Service::where('service_id', $sid)->select('serviced_by')->get();
						foreach($servicedby_qry as $sby) {						
							$tmpids[] = $sby->serviced_by;
						}
					}
				}
				
				if(count($commentsid) > 0) {
					foreach($commentsid as $cid) {
						$comments_qry = DB::table('comments')->where('comment_id', $cid)->get();
						foreach($comments_qry as $comment) {
							$tmpids[] = $comment->comment_by;
						}
					}
				}	
				
				if(count($alarmsid) > 0) {
					foreach($alarmsid as $aid) {
						$alarms_qry = DB::table('alarms')->where('alarm_id', $aid)->get();
						foreach($alarms_qry as $alarms) {
							$tmpids[] = $alarms->alarm_assigned_by;
						}
					}
				}
				
				if($tmpids) { $tmpids = array_unique($tmpids); }
				$staffs = Staff::whereIn('staff_id', $tmpids)->orderBy('firstname','asc')->get();
				if(count($staffs) > 0) {
					foreach($staffs as $staff) {
						$staff_idarr[] = $staff->staff_id;
					}
				}
				foreach($staff_idarr as $staff_id) {
					$services = Service::where('serviced_by', $staff_id)->get();
					foreach($services as $servid) {
						$servicesbyname_id[] = "'".$servid->service_id."'";
					}
					$comments = DB::table('comments')->where('comment_by', $staff_id)->get();
					foreach($comments as $comm) {
						$servicesbyname_id[] = "'".$comm->comment_id."'";
					}
					$alarms = DB::table('alarms')->where('alarm_assigned_by', $staff_id)->get();
					foreach($alarms as $alarm) {
						$servicesbyname_id[] = "'".$alarm->alarm_id."'";
					}
				}
				$service_commaid = @implode(',',$servicesbyname_id);
				if(isset($service_commaid) && $service_commaid != '') {
					//$direction = 'asc';
					//if($dir == 'asc') { $direction = 'desc'; }
				$allcomments = DB::table('eventorcomments')->where('event_unit_id',$unitid)->orderByRaw("FIELD(type_table_id,$service_commaid)".$dir)->groupBy('event_type', 'type_table_id')->get();					
				}
						
			}
			else {
				$allcomments = DB::table('eventorcomments')->where('event_unit_id',$unitid)->skip($startindex)->take($results)->orderBy('dateandtime','desc')->groupBy('event_type', 'type_table_id')->get();
			}
			
			if($type != '') {				
				$allcomments = DB::table('eventorcomments')->where('event_unit_id',$unitid)->skip($startindex)->take($results)->orderByRaw("FIELD(event_type,$type)".$dir)->groupBy('event_type', 'type_table_id')->get();
							
			}
			$comments = array();
			
			if(count($allcomments) > 0)
			{	
				$i = 0;
				foreach($allcomments as $allcomment)
				{
					if($allcomment->event_type == "S")
					{
						$services = Service::where('service_id', $allcomment->type_table_id)->where('deletestatus', 0)->get();
						//echo count($services);exit; - I am modified below line sunday 31-07-2017 if($service) to if(count($services)>0)-Kannan.N
						
						if(count($services)>0)
						{							
							$service = $services[0];
							/*$comments[$i]['service_id'] = $service->service_id;
							$comments[$i]['service_unitid'] = $service->service_unitid;
							$comments[$i]['serviced_by'] = $service->serviced_by;
													
							
							$comments[$i]['serviced_datetime_formatted'] = date("D d/m/Y h:i A", strtotime($service->service_scheduled_date));
							$comments[$i]['next_service_date_selected'] = $service->next_service_date_selected;

							if($service->serviced_schduled_date == "0000-00-00 00:00:00") {
								$comments[$i]['serviced_scheduled_display'] = '';
								$comments[$i]['serviced_schduled_date']='';
								$comments[$i]['serviced_datetime_edit'] = '';
							}
							else {
								$comments[$i]['serviced_scheduled_display'] = date("l d/m/Y", strtotime($service->service_scheduled_date)). " " .$service->service_scheduled_time;
								$comments[$i]['serviced_schduled_date']=date("Y-m-d", strtotime($service->service_scheduled_date));
								$tmpdate = date("Y-m-d H:i:s", strtotime($service->service_scheduled_date));
								$comments[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
								
							}
							
							$comments[$i]['service_subject'] = $service->service_subject;
							$comments[$i]['service_remark'] = $service->service_remark;

							if($service->description != "")
							{
								$comments[$i]['service_description'] = $service->description;
		
							}
							else
							{
								$comments[$i]['service_description'] = "";
							}
							$comments[$i]['service_priority'] = $service->service_priority;
							$comments[$i]['nxt_serviceformatted'] = date('d M Y',strtotime($service->next_service_date));
							$comments[$i]['next_service_date'] = $service->next_service_date;
							$comments[$i]['time_ago'] = $this->time_elapsed_string($service->current_datetime);
							
							$comments[$i]['is_request'] = $service->is_request;
							$comments[$i]['is_denyo_support'] = $service->is_denyo_support;
							
							$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname', 'photo', 'personalhashtag')->get();
						
							$created_by_staff = Staff::where('staff_id', $service->created_by)->select('firstname', 'photo', 'personalhashtag')->get();


							if(count($created_by_staff))
							{
								$comments[$i]['serviced_created_name'] = $created_by_staff[0]->firstname;
								$comments[$i]['serviced_created_name_hastag'] = "(".$created_by_staff[0]->personalhashtag.")";
								$comments[$i]['user_photo'] = url('/') . '/staffphotos/'.$created_by_staff[0]->photo;
								if($created_by_staff[0]->photo == '' || $created_by_staff[0]->photo == 'undefined')
								{
									$comments[$i]['user_photo'] = url('/') . '/images/default.png';
								}							

							}
							if(count($staff) > 0) {
								$comments[$i]['serviced_by_name'] = $staff[0]->firstname;
								$comments[$i]['serviced_by_name_hastag'] = "(".$staff[0]->personalhashtag.")";
								if($staff[0]->photo != '')
								$comments[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
								else
								$comments[$i]['user_photo'] = url('/') . '/images/default.png';
							}
							else {
								$comments[$i]['serviced_by_name'] = '';
								$comments[$i]['serviced_by_name_hastag'] = '';
								$comments[$i]['user_photo'] = url('/') . '/images/default.png';
							}
							
							$cdate = strtotime(date('Y-m-d'));
							$timediff = $cdate - strtotime($service->current_datetime);
							if( $timediff > 86400 && $loginid > 1) {
								$comments[$i]['duration'] = '1';
							}
							else {
								$comments[$i]['duration'] = '0';
							}
							
							$serviceresources = '';
							$resources = DB::table('service_resources')->where('services_id', $service->service_id)->get();
							if($resources)
							{
								foreach($resources as $resource)
								{
									$serviceresources[] = $resource->service_resource_id.'|'.$resource->service_resource;
								}
								if($serviceresources)
									$serviceresources = @implode('#-#', $serviceresources);
							}
							$comments[$i]['service_resources'] = $serviceresources;
							*/


							$comments[$i]['serviced_datetime_formatted'] = date("D d/m/Y h:i A", strtotime($service->service_scheduled_date));


							$comments[$i]['next_service_date_selected_date'] = $service->next_service_date_selected_date;
							$comments[$i]['next_service_date_selected'] = $service->next_service_date_selected;

							$comments[$i]['service_id'] = $service->service_id;
							$comments[$i]['service_unitid'] = $service->service_unitid;
							$comments[$i]['serviced_by'] = $service->serviced_by;
							if($service->serviced_datetime == "0000-00-00" || $service->serviced_datetime != '' || strtolower($service->serviced_datetime) != 'null') {
								$comments[$i]['serviced_datetime'] = '';
							}
							else {
								$comments[$i]['serviced_datetime'] = $service->serviced_datetime;
							}	

					

							if($service->service_scheduled_date == "0000-00-00 00:00:00") {
								$comments[$i]['serviced_scheduled_display'] = '';
								$comments[$i]['serviced_schduled_date']='';
								$comments[$i]['serviced_datetime_edit']='';
							}
							else {
								if( $request->input('timezoneoffset')){							
									$comments[$i]['serviced_schduled_date_utc'] =$service->service_scheduled_date;
									$comments[$i]['serviced_schduled_date_local'] =$timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));
									$comments[$i]['timezone_name'] =$timezone->getTimeZoneName($request->input('timezoneoffset'));
									$comments[$i]['serviced_scheduled_display'] = $timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));			
									$tmpdate = $timezone->convertUTCtoDateYMDHIS($service->service_scheduled_date,$request->input('timezoneoffset'));
									$comments[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
								}else{
								$comments[$i]['serviced_schduled_date'] = date("Y-m-d", strtotime($service->service_scheduled_date));						
								$comments[$i]['serviced_scheduled_display'] = date("D d/m/Y, h:i A", strtotime($service->service_scheduled_date));			
								$tmpdate = date("Y-m-d H:i:s", strtotime($service->service_scheduled_date));
								$comments[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
								}
							}

							/*$cdate = date('Y-m-d H:i:s');
							$datediff = date("Y-m-d H:i:s", strtotime($service->current_datetime));
							if($cdate == $datediff)
								$timediff = 0;
							else
								$timediff = strtotime($cdate) - strtotime($datediff);
					
							//MORE THAN 24 HOURS
							if( $timediff > 86400 ) {
								$comments[$i]['duration'] = '1';
						
							}
							else {
								$comments[$i]['duration'] = '0';
							}
*/
							$comments[$i]['duration']=$timezone->duration($service->current_datetime);

							if($service->service_subject != "")
							{
				        			$comments[$i]['service_subject'] = $service->service_subject;
							}
							else
							{
				         			$comments[$i]['service_subject'] ="";
							}
					
							if($service->service_remark != "")
							{
							   	$comments[$i]['service_remark'] = $service->service_remark;	
							}
							else
							{
								$comments[$i]['service_remark'] ="";
							}
							if($service->description != "")
							{
								$comments[$i]['service_description'] = $service->description;

							}
							else
							{
								$comments[$i]['service_description'] = "";
							}
					
					
							$comments[$i]['is_denyo_support'] = $service->is_denyo_support;
							$comments[$i]['service_priority'] = $service->service_priority;		
							$comments[$i]['current_datetime'] = date('d M Y',strtotime($service->current_datetime));					
							$comments[$i]['is_request'] = $service->is_request;	
							if($service->created_by != "")
							{
								$comments[$i]['created_by']=$service->created_by;
							}
							else
							{
								$comments[$i]['created_by']="";
							}
					

							
							if($service->next_service_date != '0000-00-00' || $service->next_service_date != '') {
								$comments[$i]['next_service_date'] = $service->next_service_date;
								$comments[$i]['next_service_date_mobileview'] = date("d/m/Y", strtotime($service->next_service_date));
								$comments[$i]['nxtserviceformatted'] = date("d M Y", strtotime($service->next_service_date));
							}
							else {
								$comments[$i]['next_service_date'] = '';
								$comments[$i]['nxtserviceformatted'] = '';
								$comments[$i]['next_service_date_mobileview'] ='';
							}
							$comments[$i]['currentdate_mobileview'] =  date("d M Y", strtotime($service->current_datetime));
							$comments[$i]['service_status'] = $service->service_status;
						//	$services[$i]['time_ago'] = $this->time_elapsed_string($service->current_datetime);
					
							$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname','photo','personalhashtag')->get();
					
							$created_by_staff = Staff::where('staff_id', $service->created_by)->select('firstname','personalhashtag','photo')->get();

							if(count($created_by_staff)>0)
							{
								$comments[$i]['serviced_created_name'] = $created_by_staff[0]->firstname;
								$comments[$i]['serviced_created_name_hastag'] = "(".$created_by_staff[0]->personalhashtag.")";
								$comments[$i]['serviced_created_name_hastag_withinclosedbracket'] = "(".$created_by_staff[0]->personalhashtag.")";
								$comments[$i]['user_photo'] = url('/') . '/staffphotos/'.$created_by_staff[0]->photo;
								if($created_by_staff[0]->photo == '' || $created_by_staff[0]->photo == 'undefined') {
									$comments[$i]['user_photo'] = url('/') . '/images/default.png';
								}
							}
							if(count($staff) > 0) {
								$comments[$i]['serviced_by_name'] = $staff[0]->firstname;
								$comments[$i]['serviced_by_name_hastag'] = "(".$staff[0]->personalhashtag.")";					    
								$comments[$i]['serviced_by_name_hastag_withinclosedbracket'] = "(".$staff[0]->personalhashtag.")";
							}
							
							$serviceresources = '';
							$resources = DB::table('service_resources')->where('services_id', $service->service_id)->get();
							if($resources)
							{
								foreach($resources as $resource)
								{
									$serviceresources[] = $resource->service_resource_id.'|'.$resource->service_resource;
								}
								if($serviceresources)
									$serviceresources = @implode('#-#', $serviceresources);
							}
							$comments[$i]['service_resources'] = $serviceresources;

							if($service->is_denyo_support == '1') {
								$comments[$i]['event_type'] = 'R'; 
							}
							else {
								$comments[$i]['event_type'] = $allcomment->event_type;
							}
							++$i;
						}
						
					}
					
					else if($allcomment->event_type == "C")
					{
						
						$commentlist = DB::table('comments')->where('comment_id', $allcomment->type_table_id)->get();
				
						if(count($commentlist) > 0)
						{
							$comment = $commentlist[0];
							$comments[$i]['comment_id'] = $comment->comment_id;
							$comments[$i]['comment_unit_id'] = $comment->comment_unit_id;
							$comments[$i]['comment_by'] = $comment->comment_by;
							$comments[$i]['comment_subject'] = $comment->comment_subject;
							$comments[$i]['comment_remark'] = $comment->comment_remark;
							$comments[$i]['comment_priority'] = $comment->comment_priority;
							$comments[$i]['time_ago'] = $this->time_elapsed_string($comment->comment_date);
							
							

							if( $request->input('timezoneoffset')){	
								$comments[$i]['comment_date'] = $timezone->convertUTCtoDate($comment->comment_date,$request->input('timezoneoffset'));			
								$comments[$i]['comment_date_formatted'] =  $timezone->convertUTCtoDate($comment->comment_date,$request->input('timezoneoffset'));
								$comments[$i]['timezone_name'] =$timezone->getTimeZoneName($request->input('timezoneoffset'));

							}else{
								$comments[$i]['comment_date'] = $comment->comment_date;
								$comments[$i]['comment_date_formatted'] = date('D d/m/Y, h:i A',strtotime($comment->comment_date));
							}

							
							//
							/*$cdate = strtotime(date('Y-m-d H:i:s'));
							$timediff = $cdate - strtotime($comment->comment_date);
							if( $timediff > 86400) {
								$comments[$i]['duration'] = '1';
							}
							else {
								$comments[$i]['duration'] = '0';
							}*/
							$comments[$i]['duration']=$timezone->duration($comment->comment_date);
							//
							


							$staff = Staff::where('staff_id', $comment->comment_by)->select('firstname','photo','personalhashtag')->get();
							
							$created_by_staff = Staff::where('staff_id', $comment->comment_by)->select('firstname','photo','personalhashtag')->get();


							if(count($created_by_staff))
							{
								$comments[$i]['serviced_created_name'] = $created_by_staff[0]->firstname;
								$comments[$i]['serviced_created_name_hastag'] = "(".$created_by_staff[0]->personalhashtag.")";
								$comments[$i]['user_photo'] = url('/') . '/staffphotos/'.$created_by_staff[0]->photo;
								if($created_by_staff[0]->photo == '' || $created_by_staff[0]->photo == 'undefined')
								{
									$comments[$i]['user_photo'] = url('/') . '/images/default.png';
								}
								

							}
							if(count($staff) > 0) {
								$comments[$i]['comment_by_name'] = $staff[0]->firstname;
			
								$comments[$i]['comment_by_name_hastag'] ="(".$staff[0]->personalhashtag.")";
								if($staff[0]->photo != '')
								$comments[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
								else
								$comments[$i]['user_photo'] = url('/') . '/images/default.png';
							
							}
							else {
								$comments[$i]['comment_by_name'] = '';
			
								$comments[$i]['comment_by_name_hastag'] = '';
								$comments[$i]['user_photo'] = url('/') . '/images/default.png';
							}

							
							
							$commentresources = '';
							$resources = DB::table('comment_resources')->where('comments_id', $comment->comment_id)->get();
							
							if(count($resources) > 0)
							{
								foreach($resources as $resource)
								{
									$commentresources[] = $resource->comment_resource_id.'|'.$resource->comment_resource;
								}
								if($commentresources)
									$commentresources = @implode('#-#', $commentresources);
							}
							$comments[$i]['comment_resources'] = $commentresources;
							$comments[$i]['event_type'] = $allcomment->event_type;
							++$i;
						}
						
					}
					else if($allcomment->event_type == "A" || $allcomment->event_type == "OA")
					{
						
						//$alarmlist = DB::table('alarms')->where('alarm_id', $allcomment->type_table_id)->where('alarm_assigned_by','!=','0')->get();

						//echo 'select * from `alarms` where `alarms_id` = '.$allcomment->type_table_id.' and `alarm_assigned_by` != 0';

						$alarmlist = DB::table('alarms')->where('alarm_id', $allcomment->type_table_id)->get();
						
						//echo $allcomment->type_table_id;

						if(count($alarmlist) > 0)
						{
							$comment = $alarmlist[0];
							$comments[$i]['alarm_id'] = $comment->alarm_id;
							$comments[$i]['alarm_name'] = $comment->alarm_name;
							$comments[$i]['alarm_unit_id'] = $comment->alarm_unit_id;
							$comments[$i]['alarm_assigned_by'] = $comment->alarm_assigned_by;
							$comments[$i]['alarm_assigned_to'] = $comment->alarm_assigned_to;							
							$comments[$i]['alarm_received_date'] = date('D d/m/Y, h:i A',strtotime($comment->alarm_received_date));
							$comments[$i]['alarm_priority'] = $comment->alarm_priority;
							$comments[$i]['time_ago'] = $this->time_elapsed_string($comment->alarm_received_date);							
							if($comments[$i]['alarm_priority'] == '1') {
								$comments[$i]['user_photo'] = url('/').'/images/alert_red_48.png';
							}
							else {
								$comments[$i]['user_photo'] = url('/').'/images/alert_yellow_48.png';	
							}
							
							
							$staff = Staff::where('staff_id', $comment->alarm_assigned_by)->select('firstname')->get();
							if(count($staff) > 0) {
								$comments[$i]['alarm_assigned_by'] = $staff[0]->firstname;							
							}
							else {
								$comments[$i]['alarm_assigned_by'] = '';	
							}
							
							$staff = Staff::where('staff_id', $comment->alarm_assigned_to)->select('firstname')->get();
							if(count($staff) > 0) {
								$comments[$i]['alarm_assigned_to'] = $staff[0]->firstname;
							}
							else {
								$comments[$i]['alarm_assigned_to'] = '';	
							}
							$comments[$i]['event_type'] = $allcomment->event_type;
							++$i;
						}
						
					}					
				}
			}
			//sort
			/*if($sort == 'alarm') {

				foreach($comments as $comment) {
					if($comment->event_type == "A" || $comment->event_type == "OA") {					
						$alarmid[] = $comment->type_table_id;
						
					}
				}
			$ala = @implode(',',$alarmid);

			$allcomments = Comment::where('event_unit_id',$unitid)->->get();					
			
			}*/
			//sort ends

			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allcomments->count(), 'comments' => $comments]);
		}
		else {
			$unitdata = Unit::where('unit_id', $unitid)->get();
			$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unitdata[0]->controllerid)->where('code', 'RUNNINGHR')->get();
			$runninghrs = 0;
			if(count($currentstatus) > 0) {
				$runninghrs = $currentstatus[0]->value;
			}
			$nextservice = '';
			$nextserviceqry = Service::where('service_unitid', $unitid)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id','desc')->skip(0)->take(1)->get();
			
			if(count($nextserviceqry) > 0) {
				$nextservice = date('d M Y',strtotime($nextserviceqry[0]->next_service_date));
			}
			
			$unitlatlong =	DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();	

			$unit = new Unit;			
			$colorcode = $unit->getstatuscolor($unitid);
		
			return $dataTable->render('Comment.index', ['unitid' => $unitid,'unitdata'=>$unitdata,'unitlatlong'=>$unitlatlong,'runninghrs'=>$runninghrs,'nextservice'=>$nextservice, 'colorcode' => $colorcode]);
		}
	}

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function createcomment($unitid)
	{
		$session = new Session();
		$ses_login_id = $session->get('ses_login_id');
		$units = Unit::where('unit_id', $unitid)->select('unitname', 'projectname', 'location', 'controllerid')->get();
		$unit = $units[0];
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0) {
			$runninghrs = $currentstatus[0]->value;
		}	
		$microtimestamp = date("YmdHis");
		
		$company_id = $session->get('ses_company_id');
		$staffid = $session->get('ses_login_id');
		$serviceby = Staff::where('staff_id', $staffid)->select('firstname', 'lastname')->get();
		$staffname = $serviceby[0]->firstname;
		
		if($ses_login_id == 1) {
			$staffs = DB::table('users')->join('staffs','staffs.staff_id','=','users.staffs_id')->where('staffs.status','0')->where('staffs.non_user',0)->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->get();
		}
		else
			$staffs = DB::table('users')->where('users.company_id', $company_id)->join('staffs','staffs.staff_id','=','users.staffs_id')->where('staffs.status','0')->where('staffs.non_user',0)->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->get();
		
		
		$staffids = '';
		if(count($staffs) > 0)
		{
			foreach($staffs as $staff)
			{
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		$nextservice = '';
		$nextserviceqry = Service::where('service_unitid', $unitid)->where('next_service_date', '!=', '')->orderBy('service_id','desc')->skip(0)->take(1)->get();
			
		if(count($nextserviceqry) > 0) {
			$nextservice = date('d M Y',strtotime($nextserviceqry[0]->next_service_date));
		}
		$unitdata = new Unit;			
		$colorcode = $unitdata->getstatuscolor($unitid);

		return view('Comment.create', ['unitid' => $unitid, 'units' => $unit, 'runninghrs' => $runninghrs, 'microtimestamp' => $microtimestamp, 'staffname' => $staffname, 'staffids' => $staffids, 'staffid' => $staffid,'ses_login_id'=>$ses_login_id,'nextservice'=>$nextservice, 'colorcode' => $colorcode]);
	}

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request)
	{	
		$timezone = new Timezone;
		if( $request->input('timezoneoffset')){				
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			$commentdata['timezone'] =$timezonename;
		}else{
			$timezonename='';
			$commentdata['timezone'] =$timezonename;
		}

		if($request->current_datetime){
			$current_datetime=$request->current_datetime;
			$commentdata['comment_date'] = $current_datetime;
		}else{
			$current_datetime= date('Y-m-d H:i:s');
			$commentdata['comment_date'] = $current_datetime;
		}

		$session = new Session();
		$ismobile = $request->is_mobile;		
		$commentdata['comment_unit_id'] = $request->comment_unit_id;
		$commentdata['comment_by'] = $request->comment_by;
		$commentdata['comment_date'] = $request->comment_date;
		$commentdata['comment_subject'] = $request->comment_subject;
		
		if($request->is_mobile == 1) {
			$remark = trim($request->comment_remark);
		} else {
			$remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->comment_remark));
			$remark = str_replace('</span>', '', $remark);
			$remark = str_replace('&nbsp;', '', $remark);
			$remark = str_replace('<br>', '', $remark);
			$remark = str_replace('?', '', $remark);
			$remark = str_replace('\xE2\x80\x8D', '', $remark);		
			$remark = str_replace('\u200d', '', $remark);     
			$remark = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($remark));				
			$remark = strip_tags(stripslashes($remark));
		}
		$commentdata['comment_remark'] = $remark;
		$commentdata['comment_priority'] = $request->comment_priority;

		$staff = Staff::where('staff_id', $request->comment_by)->select('firstname', 'email')->get();
		$unit = Unit::where('unit_id', $request->comment_unit_id)->select('unitname', 'projectname', 'location')->get();

		// Store service form data in services table.
		DB::table('comments')->insert($commentdata);
		
		// Get services last insert id
		$commentid = 1;
		$lastins = DB::table('comments')->orderBy('comment_id', 'desc')->skip(0)->take(1)->get();
		//print_r($lastins);
		if($lastins)
			$commentid = $lastins[0]->comment_id;
		
		// Update service id in service resources table using micro_timestamp
		DB::table('comment_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['comments_id' => $commentid]);

		$attachfiles = array();
		$attachments = DB::table('comment_resources')->where('micro_timestamp', $request->micro_timestamp)->where('comments_id', $commentid)->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$attachfiles[] = url('/').'/commentimages/'.$attachment->comment_resource;
			}
		}

		// Insert data for service notification to show count in unit details 
		DB::table('comment_notifications')->insert(['comment_unit_id' => $request->comment_unit_id, 'comment_staff_id' => $request->comment_by, 'comments_id' => $commentid]);

		// Insert data for show in events / comments.
		DB::table('eventorcomments')->insert(['event_type' => 'C', 'event_unit_id'=>$request->comment_unit_id,'type_table_id' => $commentid, 'dateandtime' => $current_datetime]);
		
		// get notify content for send push notifications
		$notifycontent = '';		
		$notifys = DB::table('notification_content')->where('notify_type', 'C')->get();
		//print_r($notifys);
		if($notifys)
		{	
			
			$notify_content = $notifys[0]->notify_for.'<br>'.$notifys[0]->notify_content;
			$notify_content = str_replace('#NAME#', $staff[0]->firstname, $notify_content);
			$notify_content = str_replace('#UNITNAME#', $unit[0]->unitname, $notify_content);
			$notify_content = str_replace('#PROJECTNAME#', $unit[0]->projectname, $notify_content);
			$notify_content = str_replace('#SUBJECT#', $remark, $notify_content);
			$notifycontent = str_replace('#DATEANDTIME#', date('d M Y h:iA'), $notify_content);
			$notifycontent = nl2br($notifycontent);
			
		
		}
//die;
		// get the personalhashtags from remark
		$emailids = $mentionids = $notifyids = '';
		$hashtags = @explode(' ', $remark);
		if(isset($request->pushnotify)) {
			$hashtags = @explode(' ',$request->pushnotify);
		}
		if($hashtags)
		{
			foreach($hashtags as $hashtag)
			{		
				$hashtag = trim($hashtag);
				$chkhashtag = substr($hashtag, 0,1); 	
				
				$hashtag = preg_replace('/[^A-Za-z0-9\-]/', '', $hashtag);					
				if($chkhashtag == "@")
				{
					
					$hashtag = '@'.$hashtag;
					
					$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
					if(count($staffs))
					{
						if (filter_var($staffs[0]->email, FILTER_VALIDATE_EMAIL)) {				
							$emailids[] = $staffs[0]->email;
						}
						
						$notifyids[] = $staffs[0]->staff_id;							
					}
				}
				else {
					//$emailids  = array();
					$notifyids = array();
				}
			}
		}

		if(!$notifyids)
		{
			$alarmnotifys = Unit::where('unit_id', $request->comment_unit_id)->select('alarmhashtags')->get();
			if(count($alarmnotifys) > 0)
			{
				$hashtags = $alarmnotifys[0]->alarmhashtags;
				if($hashtags)
				{
					$hashtags = @explode(",", $hashtags);
					for($i = 0; $i < count($hashtags); $i++)
					{
						$notify_to = Staff::where('personalhashtag',$hashtags[$i])->select('staff_id')->get();
						if(count($notify_to) >0)
							$notifyids[] = $notify_to[0]->staff_id;
					}
				}
			}			
		}
		if(!$emailids && !is_array($emailids))
		{
			$alarmnotifys = Unit::where('unit_id', $request->comment_unit_id)->select('alarmemails')->get();
			if(count($alarmnotifys) > 0)
			{
				$emails = $alarmnotifys[0]->alarmemails;
				if($emails)
				{
					$emails = @explode(",", $emails);
					for($i = 0; $i < count($emails); $i++)
					{
						if(filter_var($emails[$i], FILTER_VALIDATE_EMAIL)) {		
							$emailids[] = $emails[$i];	
						}					
					}
				}
			}
		}

		if(count($notifyids) > 0)
		{
			// Insert data for send push notifications
			for($i = 0; $i < count($notifyids); $i++)
			{				
				if(isset($notifyids[$i]) && $notifyids[$i] > 0) {
					DB::table('pushnotifications')->insert(['notify_subject'=>$request->comment_subject,'notify_content' => $notifycontent, 'notify_by' => $request->comment_by, 'notify_to' => $notifyids[$i], 'notify_type' => 'C', 'table_id' => $commentid]);

					// Insert data for service notification to show count in unit details 
					DB::table('comment_notifications')->insert(['comment_unit_id' => $request->comment_unit_id, 'comment_staff_id' => $notifyids[$i], 'comments_id' => $commentid]);
				}
			}
		}
		
		if(count($emailids) > 0 && is_array($emailids))
		{			
			$content = '<table width="100%" cellpadding="5" cellspacing="5">';
			$content .= '<tr><td><b>Comment Info:</b><br></td></tr>';
			$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
			$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
			$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
			$content .= '<tr><td>Comment By: '.$staff[0]->firstname.'</td></tr>';
			$content .= '<tr><td>Remark: '.$remark.'</td></tr>';
			$content .= '</table>';			
			$subject = $request->comment_subject;
			$replyto = $staff[0]->email;
			$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);
			Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
				$m->from('cip@stridececommerce.com', 'Denyo');
				$m->replyTo($data['replytoemail'], $name = null);
				$m->bcc('balamurugan@webneo.in', '');
				$m->to($emailids, '')->subject($data['subject']);
				foreach($attachfiles as $attachfile)
				{
					$m->attach($attachfile);
				}
			});
		}		
		
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Comment details created successfully'));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session->getFlashBag()->add('comment_created','Comment details created successfully');
			return redirect('/comments?unitid='.$request->comment_unit_id);	
		}
		
	}

	/**
	* Display the specified resource.
	*
	* @param  \App\Service  $Service
	* @return \Illuminate\Http\Response
	*/
	public function show($id)
	{
		$companyname = '';
		$actual = @explode('-', $id);
		$id = $actual[0];
		$type = strtolower($actual[1]);
		$unitid = $actual[2];
		$units = Unit::where('unit_id', $unitid)->get();
		if(count($units) > 0) {
			$units = $units[0];
		
		
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0)
			$runninghrs = $currentstatus[0]->value;
		$staff = array();
		$unitlatlong =	DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		
		$nxtservicedate='';
		$nextserviceqry = Service::where('service_unitid', $unitid)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id','desc')->skip(0)->take(1)->get();
		if(count($nextserviceqry) > 0) {
			$nxtservicedate = date('d M Y',strtotime($nextserviceqry[0]->next_service_date));
		}


		$unit = new Unit;			
		$colorcode = $unit->getstatuscolor($unitid);

		if($type == 'comment')
		{
			$comments = DB::table('comments')->where('comment_id', $id)->get();
			if($comments)
				$comments = $comments[0];
			$commentresources = DB::table('comment_resources')->where('comments_id', $id)->get();
			$staff = Staff::where('staff_id', $comments->comment_by)->select('firstname', 'email', 'photo', 'company_id')->get();
			if($staff)
			{
				$staff = $staff[0];
				$company = CompanyGroup::where('companygroup_id', $staff->company_id)->select('companygroup_name')->get();
				if($company)
					$companyname = $company[0]->companygroup_name;	
			}
			
			DB::table('pushnotifications')->where('table_id', $id)->update(['notify_to_readstatus'=>1]);
			

			return view('Comment.show', ['comments' => $comments, 'commentresources' => $commentresources, 'units' => $units, 'runninghrs' => $runninghrs, 'nxtservicedate'=>$nxtservicedate, 'staff' => $staff, 'companyname' => $companyname,'unitlatlong'=>$unitlatlong, 'colorcode' => $colorcode]);
		}
		else if($type == "service")
		{
			$serviceresources = '';
			$services = Service::where('service_id', $id)->get();
			if($services)
				$services = $services[0];
			$serviceresources = DB::table('service_resources')->where('services_id', $id)->get();
			$staff = Staff::where('staff_id', $services->created_by)->select('firstname', 'email', 'photo', 'company_id', 'personalhashtag')->get();
			
			if(count($staff) > 0)
			{
				$staff = $staff[0];
				$company = CompanyGroup::where('companygroup_id', $staff->company_id)->select('companygroup_name')->get();
				if($company)
					$companyname = $company[0]->companygroup_name;
			}
			else {
				$staff = new \stdClass();
			}
			return view('Service.show', ['services' => $services, 'serviceresources' => $serviceresources, 'units' => $units, 'runninghrs' => $runninghrs, 'staff' => $staff, 'companyname' => $companyname, 'returnpage' => 'comments','unitlatlong'=>$unitlatlong,'nxtservicedate'=>$nxtservicedate, 'colorcode' => $colorcode]);
		}	
		else
		{
			$alarms = $assignby = $assignto = $assigndate = '';
			$alarms = Alarm::where('alarm_id', $id)->get();
			if($alarms)
			{
				$alarms = $alarms[0];
			
				$alarmassignby = Staff::where('staff_id', $alarms->alarm_assigned_by)->select('firstname')->get();
				if(count($alarmassignby) > 0) { $assignby = $alarmassignby[0]->firstname; }

				$alarmassignto = Staff::where('staff_id', $alarms->alarm_assigned_to)->select('firstname')->get();
				if(count($alarmassignto)) { $assignto = $alarmassignto[0]->firstname; }

				if($alarms->alarm_assigned_date != "0000-00-00 00:00:00" && $alarms->alarm_assigned_date != '')
					$assigndate = date('d M Y h:i A', strotime($alarms->alarm_assigned_date));
			}
			return view('Alarm.show', ['alarms' => $alarms, 'units' => $units, 'runninghrs' => $runninghrs, 'returnpage' => 'alarms', 'assignby' => $assignby, 'assignto' => $assignto, 'assigndate' => $assigndate, 'code'=>'', 'alarmdata'=>'', 'currentdate'=>'', 'unitlatlong'=>$unitlatlong, 'colorcode' => $colorcode]);
		}	
		}
	}

	/**
	* Show the form for editing the specified resource.
	*
	* @param  \App\Service  $Service
	* @return \Illuminate\Http\Response
	*/
	public function edit($id)
	{				
		$comments = DB::table('comments')->where('comment_id',$id)->get();
		
		$comments = $comments[0];
		$commentresources = DB::table('comment_resources')->where('comments_id', $id)->get();
		$unitid = $comments->comment_unit_id;	
		$units = Unit::where('unit_id', $unitid)->select('unitname', 'projectname', 'location', 'controllerid')->get();
		$unit = $units[0];
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0) {
			$runninghrs = $currentstatus[0]->value;
		}
		$microtimestamp = date("YmdHis");
		$session = new Session();
		$company_id = $session->get('ses_company_id');
		$staffid = $session->get('ses_login_id');
		$commentby = Staff::where('staff_id', $comments->comment_by)->select('firstname', 'lastname')->get();
		$staffname = $commentby[0]->firstname;
		
		if($staffid == 1) {
			$staffs = DB::table('users')->where('deletestatus', '0')->where('staffs_id','!=',$staffid)->get();
		}
		else
			$staffs = DB::table('users')->where('company_id', $company_id)->where('staffs_id','!=',$staffid)->where('deletestatus', '0')->get();
		
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
		$nxtservicedate='';
		$nextserviceqry = Service::where('service_unitid', $unitid)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id','desc')->skip(0)->take(1)->get();
		if(count($nextserviceqry) > 0) {
			$nxtservicedate = date('d M Y',strtotime($nextserviceqry[0]->next_service_date));
		}

		$unitdata = new Unit;			
		$colorcode = $unitdata->getstatuscolor($unitid);
		return view('Comment.edit', ['comments' => $comments, 'commentresources' => $commentresources, 'unitid' => $unitid, 'units' => $unit, 'runninghrs' => $runninghrs, 'nxtservicedate'=>$nxtservicedate, 'microtimestamp' => $microtimestamp, 'staffname' => $staffname, 'staffids' => $staffids, 'staffid' => $staffid, 'colorcode' => $colorcode]);
		
	}

	/**
	* Update the specified resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @param  \App\Service  $Service
	* @return \Illuminate\Http\Response
	*/
	public function update(Request $request)
	{		
		$session = new Session();
		$ismobile = $request->is_mobile;
		$commentid = $request->comment_id;
		$commentdata['comment_unit_id'] = $request->comment_unit_id;
		$commentdata['comment_by'] = $request->comment_by;
		$commentdata['comment_date'] = $request->comment_date;
		$commentdata['comment_subject'] = $request->comment_subject;
		$remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->comment_remark));
		$remark = str_replace('</span>', '', $remark);
		$remark = str_replace('&nbsp;', '', $remark);
		$remark = str_replace('<br>', '', $remark);
		$remark = str_replace('?', '', $remark);
		$remark = str_replace('\xE2\x80\x8D', '', $remark);		
		$remark = str_replace('\u200d', '', $remark);     
		$remark = strip_tags(stripslashes($remark));
		$remark = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($remark));
		
		//$remark = trim($request->comment_remark);		
		$commentdata['comment_remark'] = $remark;
		$commentdata['comment_priority'] = $request->comment_priority;	
		

		// Store service form data in services table.
		DB::table('comments')->where('comment_id', $commentid)->update($commentdata);
				
		// Update service id in service resources table using micro_timestamp
		DB::table('comment_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['comments_id' => $commentid]);

		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Comment details updated successfully'));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session->getFlashBag()->add('comment_updated','Comment details updated successfully');
			return redirect('/comments?unitid='.$request->comment_unit_id)->with('alert','Comment details updated successfully');	
		}
	}

	/**
	* Remove the specified resource from storage.
	*
	* @param  \App\Service  $Service
	* @return \Illuminate\Http\Response
	*/
	public function delete($id, $ismobile)
	{		
		$comment = DB::table('comments')->where('comment_id', $id)->update(['comment_status' => '1']);		
		DB::table('eventorcomments')->where('event_type','C')->where('type_table_id',$id)->delete();
		DB::table('comment_resources')->where('comments_id',$id)->delete();
		if($ismobile == 0) {
			$session = new Session();
			$unitid = $session->get('unit_id');
			$session->getFlashBag()->add('comment_deleted','Comment details deleted successfully');
			return redirect('/comments?unitid='.$unitid);
		}
		else {
			$msg = array(array('Error' => '0','result'=>'Comment details deleted successfully'));
			return response()->json(['msg'=>$msg]);
		}
	}

	// upload service resources
	public function uploadcommentresources(Request $request)
	{
		if(!empty($_FILES)) 
		{           
			$file = Input::file('file');
			$destinationPath = public_path().'/commentimages';     
			$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
			$filename = $timestamp."_123_".$file->getClientOriginalName();
			if(Input::file('file')->move($destinationPath, $filename)) {
				$microtimestamp = $request->microtimestamp;
				DB::table('comment_resources')->insert(['comment_resource' => $filename,'micro_timestamp' => $microtimestamp]);
				return Response::json('success', 200);
			} else {
				return Response::json('error', 400);
			}
		} 
	}

	// remove resource from service resources table - for web
	public function removecommentresource(Request $request)
	{
		$resourceid = $request->resourceid;
		$resource = '_'.$request->resourcefile;
		$microtimestamp = $request->microtimestamp;
		if($resourceid > 0)
			$resources = DB::table('comment_resources')->where('comment_resource_id', $resourceid)->get();
		else
			$resources = DB::table('comment_resources')->where('micro_timestamp', $microtimestamp)->where('comment_resource', 'LIKE', "%$resource%")->get();
		if(count($resources) > 0)
		{
			$filename = public_path().'/commentimages/'.$resources[0]->comment_resource;
			DB::table('comment_resources')->where('comment_resource_id', $resources[0]->comment_resource_id)->delete();
			if(file_exists($filename))
				unlink($filename);
			//return redirect('/comments/'.$resources[0]->comments_id.'/edit');
		}
	}

	public function removecommentresources($resourceid)
	{
		$resources = DB::table('comment_resources')->where('comment_resource_id', $resourceid)->get();
		if(count($resources) > 0)
		{
			$filename = public_path().'/commentimages/'.$resources[0]->comment_resource;
			DB::table('comment_resources')->where('comment_resource_id', $resourceid)->delete();			
			if(file_exists($filename))
				unlink($filename);
		}		
	}
	
		
	/**
	*
	* @return Time ago (general function)
	*/
	function time_elapsed_string($datetime, $full = false) {
		$now = new \DateTime;
		$ago = new \DateTime($datetime);
		$diff = $now->diff($ago);

		$diff->w = floor($diff->d / 7);
		$diff->d -= $diff->w * 7;

		$string = array(
			'y' => 'year',
			'm' => 'month',
			'w' => 'week',
			'd' => 'day',
			'h' => 'hour',
			'i' => 'minute',
			's' => 'second',
		);
		foreach ($string as $k => &$v) {
			if ($diff->$k) {
				$v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
			} else {
				unset($string[$k]);
			}
		}

		if (!$full) $string = array_slice($string, 0, 1);
		return $string ? implode(', ', $string) . ' ago' : 'just now';
	}
	
	public function getcommentdetails(Request $request) {
		$timezone = new Timezone;
		$allcomments = DB::table('eventorcomments')->where('type_table_id',$request->commentid)->get();
			$comments = array();
			
			if(count($allcomments) > 0)
			{	
				$i = 0;
				foreach($allcomments as $allcomment)
				{
					if($allcomment->event_type == "S")
					{
						// $services = Service::where('service_id', $allcomment->type_table_id)->get();
						// //echo count($services);exit; - I am modified below line sunday 31-07-2017 if($service) to if(count($services)>0)-Kannan.N
						// if(count($services)>0)
						// {							
							// $service = $services[0];
							// $comments[$i]['service_id'] = $service->service_id;
							// $comments[$i]['table_id'] = $allcomment->event_comment_id;
							// $comments[$i]['service_unitid'] = $service->service_unitid;
							// $comments[$i]['serviced_by'] = $service->serviced_by;
							// $comments[$i]['serviced_datetime'] = date('d M Y',strtotime($service->serviced_datetime));
							// $comments[$i]['service_subject'] = $service->service_subject;
							// $comments[$i]['service_remark'] = $service->service_remark;
							// $comments[$i]['service_priority'] = $service->service_priority;
							// $comments[$i]['next_service_date'] = date('d M Y',strtotime($service->next_service_date));
							// $comments[$i]['time_ago'] = $this->time_elapsed_string($service->current_datetime);
							// $comments[$i]['is_request'] = $service->is_request;
							// $staff = Staff::where('staff_id', $service->serviced_by)->select('firstname','photo')->get();
							// if(count($staff) > 0) {
								// $comments[$i]['serviced_by_name'] = $staff[0]->firstname;
								// $comments[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
								// if($staff[0]->photo == '' || $staff[0]->photo == 'undefined')
									// $comments[$i]['user_photo'] = url('/') . '/images/default.png';
							// }
							// else {
								// $comments[$i]['serviced_by_name'] = '';
								// $comments[$i]['user_photo'] = '';
							// }
							// $serviceresources = '';
							// $resources = DB::table('service_resources')->where('services_id', $service->service_id)->get();
							// if($resources)
							// {
								// foreach($resources as $resource)
								// {
									// $serviceresources[] = $resource->service_resource_id.'|'.$resource->service_resource;
								// }
								// if($serviceresources)
									// $serviceresources = @implode('#-#', $serviceresources);
							// }
							// $comments[$i]['service_resources'] = $serviceresources;
							// $comments[$i]['event_type'] = $allcomment->event_type;
							// ++$i;
						// }						
					}
					
					else if($allcomment->event_type == "C")
					{
						$commentlist = DB::table('comments')->where('comment_id', $allcomment->type_table_id)->get();
				
						if(count($commentlist) > 0)
						{
							$comment = $commentlist[0];
							//							
							$nextserviceqry = Service::where('service_unitid', $comment->comment_unit_id)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id','desc')->skip(0)->take(1)->get();
							if(count($nextserviceqry) > 0) {
								$comments[$i]['next_service_date'] = date('d M Y',strtotime($nextserviceqry[0]->next_service_date));
							}
							else {
								$comments[$i]['next_service_date'] = date('d M Y');
							}
							//
							$comments[$i]['table_id'] = $allcomment->event_comment_id;
							$comments[$i]['comment_id'] = $comment->comment_id;
							$comments[$i]['comment_unit_id'] = $comment->comment_unit_id;
							$comments[$i]['comment_by'] = $comment->comment_by;
							$comments[$i]['comment_subject'] = $comment->comment_subject;
							$comments[$i]['comment_remark'] = $comment->comment_remark;
							$comments[$i]['comment_priority'] = $comment->comment_priority;
							$comments[$i]['time_ago'] = $this->time_elapsed_string($comment->comment_date);
							

							if( $request->input('timezoneoffset')){	
								$comments[$i]['comment_date'] = $timezone->convertUTCtoDate($comment->comment_date,$request->input('timezoneoffset'));			
							}else{
								$comments[$i]['comment_date'] = date('d M Y h:iA',strtotime($comment->comment_date));
							}

								
							$staff = Staff::where('staff_id', $comment->comment_by)->select('firstname','photo', 'personalhashtag')->get();
							if(count($staff) > 0) {
								$comments[$i]['comment_by_name'] = $staff[0]->firstname;
								$comments[$i]['comment_by_name_hastag'] = "(".$staff[0]->personalhashtag.")";
								$comments[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
								if($staff[0]->photo == '' || $staff[0]->photo == 'undefined')
									$comments[$i]['user_photo'] = url('/') . '/images/default.png';
							} else {
								$comments[$i]['comment_by_name'] = '';
								$comments[$i]['comment_by_name_hastag'] = '';
								$comments[$i]['user_photo'] = url('/') . '/images/default.png';
							}
							
							
							$commentresources = '';
							$resources = DB::table('comment_resources')->where('comments_id', $comment->comment_id)->get();
							
							if(count($resources) > 0)
							{
								foreach($resources as $resource)
								{
									$commentresources[] = $resource->comment_resource_id.'|'.$resource->comment_resource;
								}
								if($commentresources)
									$commentresources = @implode('#-#', $commentresources);
							}
							$comments[$i]['comment_resources'] = $commentresources;
							$comments[$i]['event_type'] = $allcomment->event_type;
							//
							$units = Unit::where('unit_id',$comment->comment_unit_id)->get();
							if(count($units) > 0) {
								$comments[$i]['unitname'] = $units[0]->unitname;
								$comments[$i]['projectname'] = $units[0]->projectname;
								$comments[$i]['location'] = $units[0]->location;
								$unitgroup = DB::table('unitgroups')->where('unitgroup_id',$units[0]->unitgroups_id)->get();
								if(count($unitgroup) > 0) {
									$comments[$i]['colorcode'] = $unitgroup[0]->colorcode;
								}								
								$unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$comment->comment_unit_id)->orderBy('unit_latlong_id', 'desc')->skip(0)->take(1)->get();
								if(count($unit_latlong) > 0) {
									$comments[$i]['latitude'] = $unit_latlong[0]->latitude;
									$comments[$i]['longtitude'] = $unit_latlong[0]->longtitude;
								}
								else {
									$comments[$i]['latitude'] = '';
									$comments[$i]['longtitude'] = '';
								}
																
								$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units[0]->controllerid)->where('code', 'RUNNINGHR')->get();
								
								if(count($currentstatus) > 0) {
									$comments[$i]['runninghr'] = $currentstatus[0]->value;
								}
								else {
									$comments[$i]['runninghr'] = 0;
								}
								
							}
							//
							++$i;
						}
					}
					else if($allcomment->event_type == "A" || $allcomment->event_type == "OA")
					{
						// $alarmlist = DB::table('alarms')->where('alarm_id', $allcomment->type_table_id)->get();
				
						// if(count($alarmlist) > 0)
						// {
							// $comment = $alarmlist[0];
							// $comments[$i]['table_id'] = $allcomment->event_comment_id;
							// $comments[$i]['comment_id'] = $comment->alarm_id;
							// $comments[$i]['alarm_name'] = $comment->alarm_name;
							// $comments[$i]['alarm_unit_id'] = $comment->alarm_unit_id;
							// $comments[$i]['alarm_assigned_by'] = $comment->alarm_assigned_by;
							// $comments[$i]['alarm_assigned_to'] = $comment->alarm_assigned_to;							
							// $comments[$i]['alarm_received_date'] = date('d M Y H:i A',strtotime($comment->alarm_received_date));
							// $comments[$i]['alarm_priority'] = $comment->alarm_priority;
							// $comments[$i]['time_ago'] = $this->time_elapsed_string($comment->alarm_received_date);
							// $comments[$i]['user_photo'] = url('/').'/images/alert_yellow_48.png';							
							
							// $staff = Staff::where('staff_id', $comment->alarm_assigned_by)->select('firstname')->get();
							// if(count($staff) > 0) {
								// $comments[$i]['alarm_assigned_by'] = $staff[0]->firstname;							
							// }	
							// $comments[$i]['event_type'] = $allcomment->event_type;
							// ++$i;
						// }
					}					
				}
				return response()->json(['msg' => array('result'=>'success'), 'comments' => $comments ]);
			}
	}
	
	
	
	
}

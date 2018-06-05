<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;
use App\Unit;
use App\Service;
use App\Timezone;
use App\Staff;
use App\CompanyGroup;
use Illuminate\Support\Facades\Input;
use Illuminate\Html\HtmlServiceProvider;
use Symfony\Component\HttpFoundation\Session\Session;
use File;
use Response;
use Mail;
use App\DataTables\ServiceDataTable;
use Yajra\Datatables\Html\Builder;
use Symfony\Component\Finder\Finder;

class ServiceController extends Controller
{
	
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request, ServiceDataTable $dataTable)
	{
		date_default_timezone_set('Asia/Singapore');
		$ismobile = $request->is_mobile;
		$unitid = $request->unitid;
		if($ismobile == 1)
		{
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');

			// $allservices = Service::where('deletestatus','0')->where('service_unitid', $unitid)->where('serviced_datetime','!=','0000-00-00')->get();
			// $servicelist = Service::where('deletestatus','0')->where('service_unitid', $unitid)->where('serviced_datetime','!=','0000-00-00')->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			
			$allservices = Service::where('deletestatus','0')->where('service_unitid', $unitid)->get();
			$servicelist = Service::where('deletestatus','0')->where('service_unitid', $unitid)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			
			$services = array();
			if(count($servicelist) > 0)
			{
				$i = 0;
				foreach($servicelist as $service)
				{
					$services[$i]['service_id'] = $service->service_id;
					$services[$i]['service_unitid'] = $service->service_unitid;
					$services[$i]['serviced_by'] = $service->serviced_by;

										
					/*$cdate = date('Y-m-d');
					$datediff = date("Y-m-d", strtotime($service->current_datetime));
					if($cdate == $datediff)
						$timediff = 0;
					else
						$timediff = strtotime($cdate) - strtotime($datediff);
					
					//MORE THAN 24 HOURS
					if( $timediff > 86400 ) {
						$services[$i]['duration'] = '1';
						
					}
					else {
						$services[$i]['duration'] = '0';
					}*/

					$services[$i]['duration']=$timezone->duration($service->current_datetime);
					$services[$i]['service_subject'] = $service->service_subject;
					$services[$i]['service_remark'] = $service->service_remark;
					$services[$i]['is_denyo_support'] = $service->is_denyo_support;
					$services[$i]['service_priority'] = $service->service_priority;		
					$services[$i]['current_datetime'] = date('d M Y',strtotime($service->current_datetime));
					$services[$i]['is_request'] = $service->is_request;
					if($service->is_denyo_support == '1') {
						$services[$i]['event_type'] = 'R';
						$services[$i]['is_request'] = '1';
						
					}
					else {
						$services[$i]['event_type'] = 'S';
					}
					if($service->next_service_date != '0000-00-00') {
						$services[$i]['next_service_date'] = $service->next_service_date;
						$services[$i]['nxtserviceformatted'] = date("d M Y", strtotime($service->next_service_date));
					}
					else {
						$services[$i]['next_service_date'] = '';
						$services[$i]['nxtserviceformatted'] = '';
					}
					//$services[$i]['time_ago'] = $this->time_elapsed_string($service->current_datetime);
					
					$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname','photo')->get();
					if(count($staff) > 0) {
						$services[$i]['serviced_by_name'] = $staff[0]->firstname;
						$services[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
						if($staff[0]->photo == '' || $staff[0]->photo == 'undefined')
									$services[$i]['user_photo'] = url('/') . '/images/default.png';
					}
					else {
						$services[$i]['user_photo'] = url('/') . '/images/default.png';
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
					$services[$i]['service_resources'] = $serviceresources;

					++$i;
				}
			}


			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allservices->count(), 'services' => $services]);
		}
		else {
			//
			$session = new Session();
			$servicestatus = $request->status;
				if(!isset($request->status) || $request->status == '')
					$servicestatus = 0;
							if($unitid != '') {
				$session->set('service_status', $servicestatus);
				$unitdata = Unit::where('unit_id',$unitid)->get();
				$unitlatlong =	DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();				
				//
				$runninghrs='';
				$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unitdata[0]->controllerid)->where('code', 'RUNNINGHR')->get();
				$runninghrs = 0;
				if(count($currentstatus) > 0) {
					$runninghrs = $currentstatus[0]->value;
				}

				//
				//$nxtservicedateqry = Service::where('deletestatus', '0')->where('service_unitid', $unitid)->where('next_service_date','!=','0000-00-00')->orderBy('service_id','desc')->skip(0)->take(1)->get();
				$nxtservicedateqry = Service::where('service_unitid', $unitid)->where('next_service_date','!=','0000-00-00')->where('next_service_date', '>', date("Y-m-d"))->select('next_service_date')->orderBy('next_service_date', 'asc')->skip(0)->take(1)->get();
				if(count($nxtservicedateqry) > 0) {
					$nxtservicedate = $nxtservicedateqry[0]->next_service_date;
				} 
				else {
					$nxtservicedate='';
				}
				$service_status = 0;
				$servicetype = "Upcoming Services";
				$switchbtn = "Service History";
				if($servicestatus == 0) {
					$service_status = 1;
					$servicetype = "Service History";
					$switchbtn = "Upcoming Services";
				}

				$unit = new Unit;
				$nxtservicedate = $unit->nextservicedate($unitid);
				$colorcode = $unit->getstatuscolor($unitid);
				
				return $dataTable->render('Service.index', ['unitid' => $unitid,'unitdata'=>$unitdata,'unitlatlong'=>$unitlatlong,'nxtservicedate'=>$nxtservicedate,'runninghrs'=>$runninghrs, 'service_status' => $service_status, 'servicetype' => $servicetype, 'switchbtn' => $switchbtn, 'colorcode' => $colorcode]);
			}
		}
	}

	public function history($unitid, ServiceDataTable $dataTable)
	{
		
		date_default_timezone_set('Asia/Singapore');
				
		$session = new Session();
		
		if($unitid != '') {
			$session->set('service_status', 1);
			$unitdata = Unit::where('unit_id',$unitid)->get();
			$unitlatlong =	DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();				
			//
			$runninghrs='';
			$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unitdata[0]->controllerid)->where('code', 'RUNNINGHR')->get();
			$runninghrs = 0;
			if(count($currentstatus) > 0) {
				$runninghrs = $currentstatus[0]->value;
			}

			
			$nxtservicedateqry = Service::where('service_unitid', $unitid)->where('next_service_date','!=','0000-00-00')->where('next_service_date', '>', date("Y-m-d"))->select('next_service_date')->orderBy('next_service_date', 'asc')->skip(0)->take(1)->get();
			if(count($nxtservicedateqry) > 0) {
				$nxtservicedate = $nxtservicedateqry[0]->next_service_date;
			} 
			else {
				$nxtservicedate='';
			}
			return $dataTable->render('Service.history', ['unitid' => $unitid,'unitdata'=>$unitdata,'unitlatlong'=>$unitlatlong,'nxtservicedate'=>$nxtservicedate,'runninghrs'=>$runninghrs]);
		}

		
	}

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function createservice($unitid)
	{
		$session = new Session();
		$units = Unit::where('unit_id', $unitid)->select('unitname', 'projectname', 'location', 'controllerid', 'unitgroups_id')->get();
		
		$latlng = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();		
		
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
		/*if($company_id == 1)
			$staffs = DB::table('users')->where('users.staffs_id','!=',$staffid)->join('staffs','staffs.staff_id','=','users.staffs_id')->where('staffs.non_user',0)->where('staffs.status','0')->where('users.deletestatus', '0')->get();
		else {
			$staffs = DB::table('users')->where('users.staffs_id','!=',$staffid)->where('users.company_id', $company_id)
			->join('staffs','staffs.staff_id','=','users.staffs_id')->where('staffs.non_user',0)->where('staffs.status','0')->where('users.deletestatus', '0')->get();			
		} */

		$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('staff_id', '!=', $staffid)->where('company_id', $company_id)->get();

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
		$unitdata = new Unit;
		$nxtservicedate = $unitdata->nextservicedate($unitid);
		$colorcode = $unitdata->getstatuscolor($unitid);
		return view('Service.create', ['unitid' => $unitid, 'units' => $unit, 'runninghrs' => $runninghrs, 'microtimestamp' => $microtimestamp, 'staffname' => $staffname, 'staffids' => $staffids, 'staffid' => $staffid,'latlng'=>$latlng, 'colorcode' => $colorcode]);
	}

	public function adhoc($unitid)
	{
		$session = new Session();
		$units = Unit::where('unit_id', $unitid)->select('unitname', 'projectname', 'location', 'controllerid', 'unitgroups_id')->get();
		
		$latlng = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();		
		
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
		
		$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('staff_id', '!=', $staffid)->where('company_id', $company_id)->get();

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
		$unitdata = new Unit;
		$nxtservicedate = $unitdata->nextservicedate($unitid);
		$colorcode = $unitdata->getstatuscolor($unitid);
		return view('Service.adhoc', ['unitid' => $unitid, 'units' => $unit, 'runninghrs' => $runninghrs, 'microtimestamp' => $microtimestamp, 'staffname' => $staffname, 'staffids' => $staffids, 'staffid' => $staffid,'latlng'=>$latlng, 'colorcode' => $colorcode]);
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
		$servicescheduleddatetime = date('Y-m-d h:i A', strtotime($request->service_scheduled_date));
		$servicedata['service_scheduled_date'] = date('Y-m-d H:i:s', strtotime($request->service_scheduled_date));
		$servicedata['service_unitid'] = $request->service_unitid;
		$unitid = $servicedata['service_unitid'];
		$servicedata['serviced_by'] = $request->serviced_by;
		$servicedata['created_by'] = $request->created_by;
		$servicedata['service_subject'] = $request->service_subject;		
		$servicedata['is_denyo_support'] = $request->is_denyo_support;

		$description = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->description));
		$description = str_replace('</span>', '', $description);
		$description = str_replace('&nbsp;', '', $description);
		$description = str_replace('<br>', '', $description);
		$description = str_replace('?', '', $description);
		$description = str_replace('\xE2\x80\x8D', '', $description);
		$description = str_replace('\u200d', '', $description);     
		$description = strip_tags(stripslashes($description));
		$description = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($description));			
		
		$servicedata['description'] = $description;	
		
		if($request->is_denyo_support == 1)
		$servicedata['service_status'] = 1;
		else
		$servicedata['service_status'] = 0;
		$staff = Staff::where('staff_id', $request->created_by)->select('firstname', 'email', 'lastname')->get();
		$unit = Unit::where('unit_id', $request->service_unitid)->select('unitname', 'projectname', 'location')->get();

		// Store service form data in services table.			
		date_default_timezone_set('Asia/Singapore');
		DB::table('services')->insert($servicedata);
	
		// Get services last insert id
		$serviceid = 1;
		$lastins = DB::table('services')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
		if($lastins)
			$serviceid = $lastins[0]->service_id;
	
		// Update service id in service resources table using micro_timestamp
		DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['services_id' => $serviceid]);
		$attachfiles = array();
		$attachments = DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->where('services_id', $serviceid)->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$attachfiles[] = url('/').'/serviceimages/'.$attachment->service_resource;
			}
		}

		$notifycontent = '';
		$servicedby = $request->serviced_by;
		if($servicedby == '') {
			$servicedby = 0;
		}
		// Insert data for service notification to show count in unit details 
		DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $servicedby, 'services_id' => $serviceid]);

		

		// Insert data for show in events / comments.
		DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid,'type_table_id' => $serviceid, 'dateandtime' => date("Y-m-d H:i:s")]);

		// get notify content for send push notifications
		//if($servicedby > 0) {
		$notifys = DB::table('notification_content')->where('notify_type', 'S')->get();
		if($notifys)
		{			
			$notify_content = $notifys[0]->notify_for.'<br>'.$notifys[0]->notify_content;
			if(count($staff) > 0) {
				$notify_content = str_replace('#NAME#', $staff[0]->firstname, $notify_content);
			} else {
				$createname = '';
				$serv = DB::table('services')->where('service_id', $serviceid)->select('created_by')->get();
				if(count($serv) > 0) {
					$servicedby = $serv[0]->created_by; 
					$createby = $serv[0]->created_by;
					$crestaff = DB::table('staffs')->where('staff_id', $createby)->select('firstname')->get();
					if(count($crestaff) > 0) {
						$createname = $crestaff[0]->firstname;
					}
				}
				$notify_content = str_replace('#NAME#', $createname, $notify_content);
			}
			$notify_content = str_replace('#UNITNAME#', $unit[0]->unitname, $notify_content);
			$notify_content = str_replace('#PROJECTNAME#', $unit[0]->projectname, $notify_content);
			$notify_content = str_replace('#SUBJECT#', $description, $notify_content);
			$notifycontent = str_replace('#DATEANDTIME#', date('d M Y h:iA'), $notify_content);
			$notifycontent = nl2br($notifycontent);
		}
		//}
		// get the personalhashtags from remark
		$emailids = $mentionids = '';
		$hashtags = @explode(' ', $description);
		
		if($hashtags)
		{
			foreach($hashtags as $hashtag)
			{		
				$chkhashtag = substr($hashtag, 0,1); 	
				$hashtag = preg_replace('/[^A-Za-z0-9\-]/', '', $hashtag);	
						
				if($chkhashtag == "@")
				{
					$hashtag = '@'.$hashtag;
					$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
					if(count($staffs) > 0)
					{
						$emailids[] = $staffs[0]->email;						
						// Insert data for send push notifications
						DB::table('pushnotifications')->insert(['notify_subject'=>$request->service_subject,'notify_content' => $notifycontent, 'notify_by' => $servicedby, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => 'S', 'table_id' => $serviceid]);	
						// Insert data for service notification to show count in unit details 
						DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $staffs[0]->staff_id, 'services_id' => $serviceid]);

						//echo "Hai inserted";
					}
				}
				
			}
		}
		
		if(count($emailids) > 0 && is_array($emailids))
		{
			$content = '<table width="100%" cellpadding="5" cellspacing="5">';
			$content .= '<tr><td><b>Servicing Info:</b><br></td></tr>';
			$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
			$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
			$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
			$content .= '<tr><td>Subject: '.$request->service_subject.'</td></tr>';
			$content .= '<tr><td>Date & Time: '.$servicescheduleddatetime.'</td></tr>';
			$content .= '<tr><td>Description: '.$request->description.'</td></tr>';
			if(count($staff) > 0) {
				$content .= '<tr><td>Created By: '.$staff[0]->firstname.' '.$staff[0]->lastname.'</td></tr>';
			}		
			
			$content .= '</table>';			
			$subject = $request->service_subject;
			if(count($staff) > 0) {
				$replyto = $staff[0]->email;
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridec.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '')->subject($data['subject']);
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
				});
			}
		}
	
		$session->getFlashBag()->add('service_created','Service details created successfully');
		return redirect('/services?unitid='.$unitid.'&status=0');	
		
		
	}



	public function storeadhoc(Request $request) //for web
	{
		$session = new Session();
		
		$servicedata['service_scheduled_date'] = date('Y-m-d H:i:s', strtotime($request->service_scheduled_date));
		$servicedata['service_unitid'] = $request->service_unitid;
		$unitid = $servicedata['service_unitid'];
		$servicedata['serviced_by'] = $request->serviced_by;
		$servicedata['created_by'] = $request->created_by;
		$servicedata['service_subject'] = $request->service_subject;
		$servicedata['is_denyo_support'] = $request->is_denyo_support;
		$servicedata['service_status'] = 1;
		
		$remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->service_remark));
		$remark = str_replace('</span>', '', $remark);
		$remark = str_replace('&nbsp;', '', $remark);
		$remark = str_replace('<br>', '', $remark);
		$remark = str_replace('?', '', $remark);
		$remark = str_replace('\xE2\x80\x8D', '', $remark);
		$remark = str_replace('\u200d', '', $remark);     
		$remark = strip_tags(stripslashes($remark));
		$remark = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($remark));			
		
		$servicedata['service_remark'] = $remark;			

		$staff = Staff::where('staff_id', $request->created_by)->select('firstname', 'email', 'lastname')->get();
		$unit = Unit::where('unit_id', $request->service_unitid)->select('unitname', 'projectname', 'location')->get();

		// Store service form data in services table.			
		date_default_timezone_set('Asia/Singapore');
		DB::table('services')->insert($servicedata);
	
		// Get services last insert id
		$serviceid = 1;
		$lastins = DB::table('services')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
		if($lastins)
			$serviceid = $lastins[0]->service_id;
	
		// Update service id in service resources table using micro_timestamp
		DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['services_id' => $serviceid]);

		$attachfiles = array();
		$attachments = DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->where('services_id', $serviceid)->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$attachfiles[] = url('/').'/serviceimages/'.$attachment->service_resource;
			}
		}

		$notifycontent = '';
		$servicedby = $request->serviced_by;
		if($servicedby == '' || $servicedby == 0) {
			$servicedby = $request->created_by;
		}
		// Insert data for service notification to show count in unit details 
		DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $servicedby, 'services_id' => $serviceid]);

		// Insert data for show in events / comments.
		DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid,'type_table_id' => $serviceid, 'dateandtime' => date("Y-m-d H:i:s")]);

		// get notify content for send push notifications
		if($servicedby > 0) {
			$notifys = DB::table('notification_content')->where('notify_type', 'S')->get();
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
		}
		// get the personalhashtags from remark
		$emailids = $mentionids = '';
		$hashtags = @explode(' ', $remark);
		
		if($hashtags)
		{
			foreach($hashtags as $hashtag)
			{		
				$chkhashtag = substr($hashtag, 0,1); 	
				$hashtag = preg_replace('/[^A-Za-z0-9\-]/', '', $hashtag);	
						
				if($chkhashtag == "@")
				{
					$hashtag = '@'.$hashtag;
					$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
					if(count($staffs) > 0)
					{
						$emailids[] = $staffs[0]->email;						
						// Insert data for send push notifications
						DB::table('pushnotifications')->insert(['notify_subject'=>$request->service_subject,'notify_content' => $notifycontent, 'notify_by' => $servicedby, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => 'S', 'table_id' => $serviceid]);	
						// Insert data for service notification to show count in unit details 
						DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $staffs[0]->staff_id, 'services_id' => $serviceid]);

						//echo "Hai inserted";
					}
				}
				
			}
		}
		
		if(count($emailids) > 0 && is_array($emailids))
		{
			$content = '<table width="100%" cellpadding="5" cellspacing="5">';
			$content .= '<tr><td><b>Servicing Info:</b><br></td></tr>';
			$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
			$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
			$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
			$content .= '<tr><td>Subject: '.$request->service_subject.'</td></tr>';
			$content .= '<tr><td>Date & Time: '.date("d M Y h:i A", strtotime($request->service_scheduled_date)).'</td></tr>';
			$content .= '<tr><td>Description: '.$request->description.'</td></tr>';
			if(count($staff) > 0) {
				$content .= '<tr><td>Created By: '.$staff[0]->firstname.' '.$staff[0]->lastname.'</td></tr>';
			}				
			
			$content .= '</table>';			
			$subject = $request->service_subject;
			if(count($staff) > 0) {
				$replyto = $staff[0]->email;
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridec.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '')->subject($data['subject']);
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
				});
			}
		}
	
		$session->getFlashBag()->add('service_created','Ad-hoc Service details created successfully');
		return redirect('/services?unitid='.$unitid.'&status=0');	
	}


   	public function adhocstore(Request $request)
	{

		$timezone = new Timezone;
		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			$servicedata['timezone'] = $timezonename;
		}else{		
			$servicedata['timezone'] ='';
		}
		if($request->current_datetime){
			$current_datetime=$request->current_datetime;
			$servicedata['current_datetime'] =$current_datetime;
		}else{
			$current_datetime= date('Y-m-d H:i:s');
			$servicedata['current_datetime'] =$current_datetime;
		}
		$session = new Session();
		$dateandtime = $request->service_scheduled_date;
		$tmpdateandtime = @explode("T", $dateandtime);
		$date = $tmpdateandtime[0];
		$time = @explode("+", $tmpdateandtime[1]);
		$dateandtime = $date.' '.$time[0];
		$servicedata['service_scheduled_date'] = $dateandtime;
		$servicedata['service_unitid'] = $request->service_unitid;
		$unitid = $servicedata['service_unitid'];
		$servicedata['serviced_by'] = $request->serviced_by;
		$servicedata['created_by'] = $request->created_by;
		$servicedata['service_subject'] = $request->service_subject;
		$servicedata['is_denyo_support'] = $request->is_denyo_support;
		$servicedata['service_status'] = 1;
		
		$remark = trim($request->service_remark);		
		
		$servicedata['service_remark'] = $remark;			

		$staff = Staff::where('staff_id', $request->created_by)->select('firstname', 'email', 'lastname')->get();
		$unit = Unit::where('unit_id', $request->service_unitid)->select('unitname', 'projectname', 'location')->get();

		// Store service form data in services table.			
		date_default_timezone_set('Asia/Singapore');
		DB::table('services')->insert($servicedata);
	
		// Get services last insert id
		$serviceid = 1;
		$lastins = DB::table('services')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
		if($lastins)
			$serviceid = $lastins[0]->service_id;


		$serscheduledate = '';
		$inservices = DB::table('services')->where('service_id', $serviceid)->select('service_scheduled_date')->get();
		if(count($inservices) > 0) {
			$serscheduledate = $inservices[0]->service_scheduled_date;
		}
	
		// Update service id in service resources table using micro_timestamp
		DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['services_id' => $serviceid]);
		$attachfiles = array();
		$attachments = DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->where('services_id', $serviceid)->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$attachfiles[] = url('/').'/serviceimages/'.$attachment->service_resource;
			}
		}

		$notifycontent = '';
		$servicedby = $request->serviced_by;
		if($servicedby == '') {
			$servicedby = $request->created_by;
		}
		// Insert data for service notification to show count in unit details 
		DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $servicedby, 'services_id' => $serviceid]);

		// Insert data for show in events / comments.
		DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid,'type_table_id' => $serviceid, 'dateandtime' => date("Y-m-d H:i:s")]);

		// get notify content for send push notifications
		if($servicedby > 0) {
			$notifys = DB::table('notification_content')->where('notify_type', 'S')->get();
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
		}
		// get the personalhashtags from remark
		$emailids = $mentionids = '';
		$hashtags = @explode(' ', $remark);
		$pushid='';
		if(isset($request->pushnotify)) {
			$hashtags = @explode(' ',$request->pushnotify);
		}
		if($hashtags)
		{
			foreach($hashtags as $hashtag)
			{		
				$chkhashtag = substr($hashtag, 0,1); 	
				$hashtag = preg_replace('/[^A-Za-z0-9\-]/', '', $hashtag);	
						
				if($chkhashtag == "@")
				{
					$hashtag = '@'.$hashtag;
					$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
					if(count($staffs) > 0)
					{
						$emailids[] = $staffs[0]->email;						
						// Insert data for send push notifications
						$pushid=DB::table('pushnotifications')->insertGetId(['notify_subject'=>$request->service_subject,'notify_content' => $notifycontent, 'notify_by' => $servicedby, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => 'S', 'table_id' => $serviceid]);	
						// Insert data for service notification to show count in unit details 
						DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $staffs[0]->staff_id, 'services_id' => $serviceid]);

						//echo "Hai inserted";
					}
				}
				
			}
		}
		
		if(count($emailids) > 0 && is_array($emailids))
		{
			$content = '<table width="100%" cellpadding="5" cellspacing="5">';
			$content .= '<tr><td><b>Servicing Info:</b><br></td></tr>';
			$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
			$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
			$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
			$content .= '<tr><td>Subject: '.$request->service_subject.'</td></tr>';
			$content .= '<tr><td>Date & Time: '.date("d M Y h:i A", strtotime($serscheduledate)).'</td></tr>';
			$content .= '<tr><td>Description: '.$remark.'</td></tr>';
			if(count($staff) > 0) {
				$content .= '<tr><td>Created By: '.$staff[0]->firstname.' '.$staff[0]->lastname.'</td></tr>';
			}				
			
			$content .= '</table>';			
			$subject = $request->service_subject;
			if(count($staff) > 0) {
				$replyto = $staff[0]->email;
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridec.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '')->subject($data['subject']);
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
				});
			}
		}
	
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Ad Hoc Service details created successfully','pushid'=>$pushid));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session->getFlashBag()->add('service_created','Service details created successfully');
			return redirect('/services?unitid='.$unitid);	
		}
		
	}

	   public function serviceupdate(Request $request)
	    {

			$timezone = new Timezone;
			if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			}else{
			$timezonename='';
			}
		$session = new Session();
		$serviceid=$request->serviceid;

		$tmpdescription = $tmpremark = '';
		$serv = DB::table('services')->where('service_id', $serviceid)->select('description', 'service_remark')->get();
		if(count($serv) > 0) {
			$tmpdescription = $serv[0]->description;
			$tmpremark = $serv[0]->service_remark;
		}
		//if(($request->next_service_date == ""))
		//{
			if($request->is_denyo_support == 0) {

			$ismobile = $request->is_mobile;
			
			
			$servicedata['service_unitid'] = $request->service_unitid;

			$unitid = $servicedata['service_unitid'];
			$servicedata['serviced_by'] = $request->serviced_by;
			//$servicedata['description']=$request->service_description;

			
			$servicedata['service_subject'] = $request->service_subject;
			

			$remark = trim($request->service_remark);

			$datetime = @explode("T", $request->service_scheduled_date);
			$date = $datetime[0];
			$time = $datetime[1];
			if(strlen($time) == 9) {
				$time = substr($time, 0, strlen($time) - 1);
			}

			$servicedata['service_scheduled_date'] = $date.' '.$time;
		
			$servicedata['service_remark'] = $remark;
			$servicedata['service_priority'] = $request->service_priority;
			
			//$servicedata['created_by']=$request->created_by;
			$servicedata['service_status']=$request->service_status;
			
			/*if($request->next_service_date != "") {
				$servicedata['next_service_date_selected']=$request->next_service_date_selected;
				$servicedata['next_service_date_selected_date']= date('Y-m-d h:i A');
			}*/		
			
			$servicedata['description'] = $request->description;
			$servicedata['service_subject'] = $request->service_subject;
			if(!is_numeric($request->is_request))
			{
				if($request->is_request == "true"){
					$servicedata['is_request'] = 1;
					$servicedata['is_denyo_support'] = 1;
				}
				else{
					$servicedata['is_request'] = 0;
					$servicedata['is_denyo_support'] = 0;
				}
			}
			else{
				$servicedata['is_request'] = $request->is_request;
				$servicedata['is_denyo_support'] = $request->is_denyo_support;
			}
        		DB::table('services')->where('service_id', $serviceid)->update($servicedata);


			$description = $servicedata['description'];

			$staff = Staff::where('staff_id', $request->serviced_by)->select('firstname', 'email')->get();
			$unit = Unit::where('unit_id', $request->service_unitid)->select('unitname', 'projectname', 'location')->get();



			// Store service form data in services table.			
			date_default_timezone_set('Asia/Singapore');
			DB::table('services')->where('service_id', $serviceid)->update($servicedata);


		
			// Update service id in service resources table using micro_timestamp
		    	DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['services_id' => $serviceid]);

			$attachfiles = array();
			$attachments = DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->where('services_id', $serviceid)->get();
			if($attachments)
			{
				foreach($attachments as $attachment)
				{
					$attachfiles[] = url('/').'/serviceimages/'.$attachment->service_resource;
				}
			}

			$notifycontent = '';	
			$servicedby = $request->serviced_by;
			if($servicedby == '') {
				$servicedby = 0;
				
			}

			if($request->created_by != '' && $servicedby == 0) {
				$servicedby = $request->created_by;
			}

			// Insert data for service notification to show count in unit details 
			DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $servicedby, 'services_id' => $serviceid]);


			// Insert data for show in events / comments.
			DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid,'type_table_id' => $serviceid, 'dateandtime' => date("Y-m-d H:i:s")]);
	
			//if($servicedby > 0) {
				// get notify content for send push notifications
				
			$notifys = DB::table('notification_content')->where('notify_type', 'S')->get();

			if($notifys)
			{		


				$notify_content = $notifys[0]->notify_for.'<br>'.$notifys[0]->notify_content;

				if(count($staff) > 0) {
					$notify_content = str_replace('#NAME#', $staff[0]->firstname, $notify_content);
				} else {
					$createname = '';
					$serv = DB::table('services')->where('service_id', $serviceid)->select('created_by')->get();
					if(count($serv) > 0) {
						$createby = $serv[0]->created_by;
						$crestaff = DB::table('staffs')->where('staff_id', $createby)->select('firstname')->get();
						if(count($crestaff) > 0) {
							$createname = $crestaff[0]->firstname;
						}
					}
					$notify_content = str_replace('#NAME#', $createname, $notify_content);
				}
				$notify_content = str_replace('#UNITNAME#', $unit[0]->unitname, $notify_content);
	
				$notify_content = str_replace('#PROJECTNAME#', $unit[0]->projectname, $notify_content);
				$notify_content = str_replace('#SUBJECT#', $remark, $notify_content);
				$notifycontent = str_replace('#DATEANDTIME#', date('d M Y h:iA'), $notify_content);
				$notifycontent = nl2br($notifycontent);
			}
			//}
		
			// get the personalhashtags from remark
			$emailids = $mentionids = '';

			$hashtags = '';
			if($tmpremark != $remark) {
				$hashtags = @explode(' ', $remark);
			}
			if($tmpdescription != $description) {			
				$hashtags = @explode(' ', ($remark.' '.$description));
			}

			if(isset($request->pushnotify)) {
				if($tmpremark != $remark) {
					$hashtags = @explode(' ',$request->pushnotify);
				}
			}

			if(isset($request->descriptionnotify)) {
				if($tmpdescription != $description) {
					$hashtags = @explode(' ', ($request->pushnotify.' '.$request->descriptionnotify));
				}
			}

			//$hashtags = @explode(' ', $remark);
			$pushid='';
			if($hashtags)
			{
				foreach($hashtags as $hashtag)
				{		
					$chkhashtag = substr($hashtag, 0,1); 	
					$hashtag = preg_replace('/[^A-Za-z0-9\-]/', '', $hashtag);	
							
					if($chkhashtag == "@")
					{
						$hashtag = '@'.$hashtag;
						$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
						if(count($staffs) > 0)
						{
							$emailids[] = $staffs[0]->email;							
						
							// Insert data for send push notifications
							$pushid=DB::table('pushnotifications')->insertGetId(['notify_subject'=>$request->service_subject,'notify_content' => $notifycontent, 'notify_by' => $servicedby, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => 'S', 'table_id' => $serviceid]);	
							// Insert data for service notification to show count in unit details 
							DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $staffs[0]->staff_id, 'services_id' => $serviceid]);

							//echo "Hai inserted";
						}
					}					
				}
			}


			
			if(count($emailids) > 0 && is_array($emailids))
			{
				$content = '<table width="100%" cellpadding="5" cellspacing="5">';
				$content .= '<tr><td><b>Servicing Info:</b><br></td></tr>';
				$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
				$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
				$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
				if(count($staff) > 0) {
				$content .= '<tr><td>Serviced By: '.$staff[0]->firstname.'</td></tr>';
				}
				$content .= '<tr><td>Serviced Date & Time: '.date("d M Y h:i A", strtotime($request->service_scheduled_date)).'</td></tr>';
				if($request->next_service_date != '0000-00-00' && $request->next_service_date != '') {
					$content .= '<tr><td>Next Servicing Date: '.date("d M Y", strtotime($request->next_service_date)).'</td></tr>';
				}
				$content .= '<tr><td>Remark: '.$remark.'</td></tr>';
				$content .= '</table>';			
				$subject = $request->service_subject;
				if(count($staff) > 0) {
					$replyto = $staff[0]->email;
					$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
					Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
						$m->from('cip@stridec.com', 'Denyo');
						$m->replyTo($data['replytoemail'], $name = null);
						$m->bcc('balamurugan@webneo.in', '');
						$m->to($emailids, '')->subject($data['subject']);
						foreach($attachfiles as $attachfile)
						{
							$m->attach($attachfile);
						}
					});
				}
			}
		}


		 else {
		
			/*$remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->service_remark));
			$remark = str_replace('</span>', '', $remark);
			$remark = str_replace('&nbsp;', '', $remark);
			$remark = str_replace('<br>', '', $remark);
			$remark = str_replace('?', '', $remark);
		
			$remark = str_replace('\xE2\x80\x8D', '', $remark);
			$remark = str_replace('\u200d', '', $remark);     
			$remark = strip_tags(stripslashes($remark));
			$remark = strip_tags($remark);*/

			$remark = trim($request->service_remark);
		
			$denyosupport['service_remark'] = $remark;
			$denyosupport['service_subject'] = $request->service_subject;
			
			$datetime = @explode("T", $request->service_scheduled_date);
			$date = $datetime[0];
			$time = $datetime[1];
			if(strlen($time) == 9) {
				$time = substr($time, 0, strlen($time) - 1);
			}

			$servicedata['service_scheduled_date'] = $date.' '.$time;
			
			
		    $denyosupport['description'] =$request->description;

			$denyosupport['service_unitid'] = $request->service_unitid;
			if($request->next_service_date == "")	{
				$denyosupport['is_denyo_support'] = $request->is_denyo_support;
				$denyosupport['next_service_date_selected']=$request->next_service_date_selected;
				$denyosupport['next_service_date_selected_date']= date('Y-m-d h:i:s:A');
				DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['services_id' => $serviceid]);
			}
			$denyosupport['service_status']=$request->service_status;
			$unitid = $denyosupport['service_unitid'];
			$denyosupport['serviced_by'] = $request->serviced_by;
			//$last_service_id = Service::insertGetId($denyosupport);
			// Insert data for show in events / comments.
			DB::table('services')->where('service_id', $serviceid)->update($denyosupport);
			
			DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid, 'type_table_id' => $serviceid, 'dateandtime' => date("Y-m-d H:i:s")]);
		
		}	

		//}



		if(($request->next_service_date != ""))
		{
           $remark = trim($request->service_remark);
		
			$nextservicesupport['service_remark'] = $remark;


			if( $request->input('timezoneoffset')){		
				$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
				$nextservicesupport['timezone'] = $timezonename;
			}else{
				$timezonename='';
				$nextservicesupport['timezone'] = $timezonename;
			}
			if($request->current_datetime){
				$current_datetime=$request->current_datetime;
				$nextservicesupport['current_datetime'] = $current_datetime;
			}else{
				$current_datetime= date('Y-m-d H:i:s');
				$nextservicesupport['current_datetime'] = $current_datetime;
			}

			$nextservicesupport['service_subject'] = $request->service_subject;
			$nextservicesupport['service_scheduled_date']= $request->next_service_date;
			$nextservicesupport['next_service_date']= $request->next_service_date;
			if($request->next_service_date){
			$nextservicesupport['next_service_date_selected']=$request->next_service_date_selected;
				$nextservicesupport['next_service_date_selected_date']= date('Y-m-d h:i:s:A');
			}
			//$nextservicesupport['serviced_datetime'] = date('Y-m-d', strtotime($request->serviced_datetime));
			$nextservicesupport['service_status']=$request->service_status;
			$nextservicesupport['is_denyo_support'] = $request->is_denyo_support;
			$nextservicesupport['created_by']=$request->created_by;
			
			$nextservicesupport['service_unitid']=$request->service_unitid;	
		    	$nextservicesupport['description']=$request->description;
			
			$last_service_id = Service::insertGetId($nextservicesupport);

			//image update change 
			
			//$chkresource = DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->where('services_id', '>', 0)->get();

			$chkresource = DB::table('service_resources')->where('services_id', $last_service_id)->get();
			if(count($chkresource) > 0) {
				foreach($chkresource as $resource) {
					DB::table('service_resources')->insert(array('micro_timestamp' => $request->micro_timestamp, 'services_id' => $last_service_id, 'service_resource' => $resource->service_resource));
				}
			}
		    	//DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['services_id' => $last_service_id]);

			
			// Insert data for show in events / comments.

			DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid, 'type_table_id' => $last_service_id, 'dateandtime' => date("Y-m-d H:i:s")]);
	


		}
		/* commented by kannan discuss later*/
	


	
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Service details updated successfully','pushid'=>$pushid));			
			return response()->json(['msg'=>$msg]);
		}
		/*else {
			$session->getFlashBag()->add('service_created','Service details updated successfully');
			return redirect('/services?unitid='.$unitid);	
		}*/
		
	}

	/**
	* Display the specified resource.
	*
	* @param  \App\Service  $Service
	* @return \Illuminate\Http\Response
	*/
	public function show($id)
	{

		$session = new Session();
		$loginid = $session->get('ses_login_id');
		DB::table('pushnotifications')->where('table_id',$id)->where('notify_to',$loginid)->update(['notify_to_readstatus'=>'1']);
		$companyname = '';
		$lat = $lng = '';
		$services = Service::where('service_id', $id)->get();
		if(count($services) > 0) {
			$services = $services[0];
		
		$nxtservicedate='';
		$nxtservicedateqry = Service::where('service_unitid', $services->service_unitid)->where('next_service_date','!=','0000-00-00')->where('next_service_date', '>', date("Y-m-d"))->select('next_service_date')->orderBy('next_service_date', 'asc')->skip(0)->take(1)->get();
		if(count($nxtservicedateqry) > 0) {
			$nxtservicedate = date('d M Y',strtotime($nxtservicedateqry[0]->next_service_date));
		}
		$unitlatlong = DB::table('unit_latlong')->where('latlong_unit_id',$services->service_unitid)->get();	
		$units = Unit::where('unit_id', $services->service_unitid)->get();
		
		if(count($units) > 0) {
			$units = $units[0];

		}
		
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $units->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0) {
			$runninghrs = $currentstatus[0]->value;
		}
		$staff = array();		
		$serviceresources = DB::table('service_resources')->where('services_id', $id)->get();
		$staff = Staff::where('staff_id', $services->created_by)->select('firstname', 'email', 'photo', 'company_id', 'personalhashtag')->get();
		if(count($staff) > 0)
		{
			$staff = $staff[0];
			$company = CompanyGroup::where('companygroup_id', $staff->company_id)->select('companygroup_name')->get();
			if(count($company) > 0)
				$companyname = $company[0]->companygroup_name;
		}	

		$unit = new Unit;
		$nxtservicedate = $unit->nextservicedate($services->service_unitid);
		$colorcode = $unit->getstatuscolor($services->service_unitid);
	
		return view('Service.show', ['services' => $services, 'serviceresources' => $serviceresources, 'units' => $units, 'runninghrs' => $runninghrs, 'staff' => $staff, 'companyname' => $companyname, 'returnpage' => 'services','unitlatlong'=>$unitlatlong,'nxtservicedate'=>$nxtservicedate, 'colorcode' => $colorcode]);
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
		$session = new Session();
		$staffname = '';
		$company_id = $session->get('ses_company_id');
		$staffid = $session->get('ses_login_id');
		
		$services = Service::where('service_id', $id)->get();
		if(count($services) > 0) {
		$services = $services[0];
		}
		$serviceresources = DB::table('service_resources')->where('services_id', $id)->get();
		$unitid = $services->service_unitid;	
		$units = Unit::where('unit_id', $unitid)->select('unitname', 'projectname', 'location', 'controllerid', 'unitgroups_id')->get();
		if(count($units) > 0) {
		$unitdata = $units[0];
		}
		
		$latlng = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unitdata->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0)
			$runninghrs = $currentstatus[0]->value;
		$microtimestamp = date("YmdHis");
		
		$serviceby = Staff::where('staff_id', $services->serviced_by)->select('firstname', 'lastname')->get();
		if(count($serviceby) > 0)
		$staffname = $serviceby[0]->firstname;
	
		$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('staff_id', '!=', $staffid)->where('company_id', $company_id)->get();
			
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
		$nxtservicedate = '';
		$nextserviceqry = Service::where('service_unitid', $unitid)->where('next_service_date', '!=', '0000-00-00')->orderBy('service_id','desc')->skip(0)->take(1)->get();
		
		//$nxtservicedate = date('d M Y',strtotime($services->next_service_date));
		if(count($nextserviceqry) > 0) {
			$nxtservicedate = date('d M Y',strtotime($nextserviceqry[0]->next_service_date));
		}
		$unit = new Unit;
		$nxtservicedate = $unit->nextservicedate($unitid);
		$colorcode = $unit->getstatuscolor($unitid);
		
		return view('Service.edit', ['services' => $services, 'serviceresources' => $serviceresources, 'unitid' => $unitid, 'units' => $unitdata, 'runninghrs' => $runninghrs, 'nxtservicedate'=>$nxtservicedate,'microtimestamp' => $microtimestamp, 'staffname' => $staffname, 'staffids' => $staffids, 'staffid' => $staffid,'latlng'=>$latlng, 'colorcode' => $colorcode]);
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
		$serviceid = $request->service_id;
		//echo "<pre>";
		//print_r($request->all()); exit;
		$tmpdescription = $tmpremark = '';
		$serv = DB::table('services')->where('service_id', $serviceid)->select('description', 'service_remark')->get();
		if(count($serv) > 0) {
			$tmpdescription = $serv[0]->description;
			$tmpremark = $serv[0]->service_remark;
		}

		$servicedata['service_unitid'] = $request->service_unitid;
		if($request->service_status > 0) {
			$servicedata['serviced_by'] = $request->serviced_by;
		} else {
			$servicedata['serviced_by'] = 0;
		}
		$servicedata['service_subject'] = $request->service_subject;

		$description = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->description));
		$description = str_replace('</span>', '', $description);
		$description = str_replace('&nbsp;', '', $description);
		$description = str_replace('<br>', '', $description);
		$description = str_replace('?', '', $description);
		$description = str_replace('\xE2\x80\x8D', '', $description);
		$description = str_replace('\u200d', '', $description);     
		$description = strip_tags(stripslashes($description));
		$description = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($description));			
		$description = strip_tags($description);
		$servicedata['description'] = $description;
		
		$remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($request->service_remark));
		$remark = str_replace('</span>', '', $remark);
		$remark = str_replace('&nbsp;', '', $remark);
		$remark = str_replace('<br>', '', $remark);
		$remark = str_replace('?', '', $remark);
		$remark = str_replace('\xE2\x80\x8D', '', $remark);
		$remark = str_replace('\u200d', '', $remark);     
		$remark = strip_tags(stripslashes($remark));
		$remark = preg_replace('/[^A-Za-z0-9 @.]/u','', strip_tags($remark));	
	
		$servicedata['service_remark'] = $remark;
		$servicedata['service_priority'] = $request->service_priority;
		if($request->next_service_date == '') {
			$servicedata['service_scheduled_date'] = date('Y-m-d H:i:s', strtotime($request->service_scheduled_date));		
		} else {
			$servicedata['service_scheduled_date'] = date('Y-m-d H:i:s', strtotime($request->next_service_date));
		}
		
		//$servicedata['service_scheduled_time'] = $request->service_scheduled_time;
		//$servicedata['created_by'] = $request->created_by;
		$servicedata['service_status'] = $request->service_status;
		
		if(!is_numeric($request->is_request))
		{
			if($request->is_request == "true")
				$servicedata['is_request'] = 1;
			else
				$servicedata['is_request'] = 0;
		}
		else {
			$servicedata['is_request'] = $request->is_request;
		}
				
		$last_service_id = $serviceid;
		if($request->next_service_date != "") {
			$chkexist = DB::table('services')->where('service_id', $serviceid)->where('next_service_date', $request->next_service_date)->where('service_unitid', $request->service_unitid)->get();
			if(count($chkexist) <= 0) {
				$servicedata['next_service_date'] = date('Y-m-d', strtotime($request->next_service_date));
			
				$servicedata['next_service_date_selected'] = $request->next_service_date_selected;
				$servicedata['next_service_date_selected_date'] = date('Y-m-d h:i A');

				$last_service_id = Service::insertGetId($servicedata);

				$chkresource = DB::table('service_resources')->where('services_id', $serviceid)->get();
				if(count($chkresource) > 0) {
					foreach($chkresource as $resource) {
						DB::table('service_resources')->insert(array('micro_timestamp' => $request->micro_timestamp, 'services_id' => $last_service_id, 'service_resource' => $resource->service_resource));
					}
				}
			    	
				// Insert data for show in events / comments.
				DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid, 'type_table_id' => $last_service_id, 'dateandtime' => date("Y-m-d H:i:s")]);
			} else {
				DB::table('services')->where('service_id', $serviceid)->update($servicedata);
			}
		} else {
			// update service form data in services table.
			DB::table('services')->where('service_id', $serviceid)->update($servicedata);
		}

	
		// Update service id in service resources table using micro_timestamp
		DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->update(['services_id' => $last_service_id]);


		$attachfiles = array();
		$attachments = DB::table('service_resources')->where('micro_timestamp', $request->micro_timestamp)->where('services_id', $last_service_id)->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$attachfiles[] = url('/').'/serviceimages/'.$attachment->service_resource;
			}
		}

		$notifycontent = '';
		$servicedby = $request->serviced_by;
		if($servicedby == '') {
			$servicedby = 0;
		}
		// Insert data for service notification to show count in unit details 
		DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $servicedby, 'services_id' => $last_service_id]);

		// Insert data for show in events / comments.
		DB::table('eventorcomments')->insert(['event_type' => 'S', 'event_unit_id'=>$request->service_unitid,'type_table_id' => $last_service_id, 'dateandtime' => date("Y-m-d H:i:s")]);

		$staff = Staff::where('staff_id', $request->serviced_by)->select('firstname', 'email', 'lastname')->get();
		$unit = Unit::where('unit_id', $request->service_unitid)->select('unitname', 'projectname', 'location')->get();

		// get notify content for send push notifications
		//if($servicedby > 0) {
		$notifys = DB::table('notification_content')->where('notify_type', 'S')->get();
		if($notifys)
		{			
			$notify_content = $notifys[0]->notify_for.'<br>'.$notifys[0]->notify_content;
			if(count($staff) > 0) {
				$notify_content = str_replace('#NAME#', $staff[0]->firstname, $notify_content);
			} else {
				$createname = '';
				$serv = DB::table('services')->where('service_id', $last_service_id)->select('created_by')->get();
				if(count($serv) > 0) {
					$servicedby = $serv[0]->created_by; 
					$createby = $serv[0]->created_by;
					$crestaff = DB::table('staffs')->where('staff_id', $createby)->select('firstname')->get();
					if(count($crestaff) > 0) {
						$createname = $crestaff[0]->firstname;
					}
				}
				$notify_content = str_replace('#NAME#', $createname, $notify_content);
			}
			$notify_content = str_replace('#UNITNAME#', $unit[0]->unitname, $notify_content);
			$notify_content = str_replace('#PROJECTNAME#', $unit[0]->projectname, $notify_content);
			$notify_content = str_replace('#SUBJECT#', $remark, $notify_content);
			$notifycontent = str_replace('#DATEANDTIME#', date('d M Y h:iA'), $notify_content);
			$notifycontent = nl2br($notifycontent);
		}
		//}
		// get the personalhashtags from remark
		$emailids = $mentionids = '';
		$hashtags = '';
		if($tmpremark != $remark) {
			$hashtags = @explode(' ', $remark);
		}
		if($tmpdescription != $description) {			
			$hashtags = @explode(' ', ($remark.' '.$description));
		}
		
		if($hashtags)
		{
			foreach($hashtags as $hashtag)
			{		
				$chkhashtag = substr($hashtag, 0,1); 	
				$hashtag = preg_replace('/[^A-Za-z0-9\-]/', '', $hashtag);	
						
				if($chkhashtag == "@")
				{
					$hashtag = '@'.$hashtag;
					$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
					
					if(count($staffs) > 0)
					{
						$emailids[] = $staffs[0]->email;						
						// Insert data for send push notifications
						DB::table('pushnotifications')->insert(['notify_subject'=>$request->service_subject,'notify_content' => $notifycontent, 'notify_by' => $servicedby, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => 'S', 'table_id' => $last_service_id]);	
						// Insert data for service notification to show count in unit details 
						DB::table('service_notifications')->insert(['service_unit_id' => $request->service_unitid, 'service_staff_id' => $staffs[0]->staff_id, 'services_id' => $last_service_id]);

						//echo "Hai inserted";
					}
				}
				
			}
		}
		
		if(count($emailids) > 0 && is_array($emailids))
		{
			$content = '<table width="100%" cellpadding="5" cellspacing="5">';
			$content .= '<tr><td><b>Servicing Info:</b><br></td></tr>';
			$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
			$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
			$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
			$content .= '<tr><td>Subject: '.$request->service_subject.'</td></tr>';
			$content .= '<tr><td>Date & Time: '.date("d M Y h:i A", strtotime($request->service_scheduled_date)).'</td></tr>';
			$content .= '<tr><td>Description: '.$description.'</td></tr>';
			if($request->next_service_date != '' && $request->next_service_date != "0000-00-00") {
				$content .= '<tr><td>Next Servicing Date: '.$request->next_service_date.'</td></tr>';
			}
			if($request->service_remark != '') {
				$content .= '<tr><td>Remark: '.$remark.'</td></tr>';
			}
			if($request->service_status > 0) {
				$content .= '<tr><td>Serviced By: '.$staff[0]->firstname.' '.$staff[0]->lastname.'</td></tr>';
			}				
			
			$content .= '</table>';			
			$subject = $request->service_subject;
			if(count($staff) > 0) {
				$replyto = $staff[0]->email;
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridec.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '')->subject($data['subject']);
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
				});
			}
		}


		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Service details updated successfully'));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session->getFlashBag()->add('service_updated','Service details updated successfully');
			return redirect('/services?unitid='.$request->service_unitid.'&status=0');
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
		
		DB::table('services')->where('service_id', $id)->update(['deletestatus' => '1']);
		DB::table('eventorcomments')->where('type_table_id', $id)->where('event_type','S')->delete();
		DB::table('service_resources')->where('services_id', $id)->delete();
		
		$unitid = Service::select('service_unitid')->where('service_id',$id)->get();
		if($ismobile == 0) {
			$session = new Session();
			$session->getFlashBag()->add('service_deleted','Service details deleted successfully');
			return redirect('/services?unitid='.$unitid[0]->service_unitid);
		}
		else {
			$msg = array(array('Error' => '0','result'=>'Service details deleted successfully'));
			return response()->json(['msg'=>$msg]);
		}
	}

	// upload service resources
	public function uploadserviceresources(Request $request)
	{
		if(!empty($_FILES)) 
		{           
			$file = Input::file('file');
			$destinationPath = public_path().'/serviceimages';     
			$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
			$filename = $timestamp."_123_".$file->getClientOriginalName();
			if(Input::file('file')->move($destinationPath, $filename)) {
				$microtimestamp = $request->microtimestamp;
				DB::table('service_resources')->insert(['service_resource' => $filename,'micro_timestamp' => $microtimestamp]);
				return Response::json('success', 200);
			} else {
				return Response::json('error', 400);
			}
		} 
	}

	// remove resource from service resources table - for web
	public function removeserviceresource(Request $request)
	{
		$resourceid = $request->resourceid;
		$resource = '_'.$request->resourcefile;
		$microtimestamp = $request->microtimestamp;
		if($resourceid > 0)
			$resources = DB::table('service_resources')->where('service_resource_id', $resourceid)->get();
		else
			$resources = DB::table('service_resources')->where('micro_timestamp', $microtimestamp)->where('service_resource', 'LIKE', "%$resource%")->get();
		if(count($resources) > 0)
		{
			$filename = public_path().'/serviceimages/'.$resources[0]->service_resource;
			DB::table('service_resources')->where('service_resource_id', $resources[0]->service_resource_id)->delete();
			if(file_exists($filename))
				unlink($filename);
		}
	}

	public function removeresource($resourceid)
	{
		$resources = DB::table('service_resources')->where('service_resource_id', $resourceid)->get();
		if(count($resources) > 0)
		{
			$filename = public_path().'/serviceimages/'.$resources[0]->service_resource;
			DB::table('service_resources')->where('service_resource_id', $resourceid)->delete();			
			if(file_exists($filename))
				unlink($filename);
		}
		
	}

	public function servicedetails($id)
	{
		$session = new Session();
		$company_id = $session->get('ses_company_id');
		$staffid = $session->get('ses_login_id');

		$services = Service::where('service_id', $id)->get();
		$services = $services[0];
		$serviceresources = DB::table('service_resources')->where('services_id', $id)->get();
		$unitid = $services->service_unitid;	
		$units = Unit::where('unit_id', $unitid)->select('unitname', 'projectname', 'location', 'controllerid')->get();
		$unit = $units[0];
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
		$runninghrs = 0;
		if(count($currentstatus) > 0) {
			$runninghrs = $currentstatus[0]->value;
		}
		$microtimestamp = date("YmdHis");
		$serviceby = Staff::where('staff_id', $services->serviced_by)->select('firstname', 'lastname')->get();
		$staffname = $serviceby[0]->firstname;
		$staffs = DB::table('users')->where('company_id', $company_id)->get();
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
		$unitlatlongqry = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		if(count($unitlatlongqry) > 0) {
			$lat = $unitlatlongqry[0]->latitude;
			$lng = $unitlatlongqry[0]->longtitude;
		}
		//
		
		//
		return view('Service.servicedetails', ['services' => $services, 'serviceresources' => $serviceresources, 'unitid' => $unitid, 'units' => $unit, 'runninghrs' => $runninghrs, 'microtimestamp' => $microtimestamp, 'staffname' => $staffname, 'staffids' => $staffids, 'staffid' => $staffid,'lat'=>$lat,'lng'=>$lng]);
	}
	
	function denyorequest($unitid) {
		$session = new Session();
		$microtimestamp = date("YmdHis");
		$units = Unit::where('unit_id', $unitid)->select('unitname', 'projectname', 'location', 'controllerid', 'unitgroups_id')->get();
		$loginid = $session->get('ses_login_id');
		$unit = $units[0];
		$runninghrs = 0;
		$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
		if(count($currentstatus) > 0) {
			$runninghrs = $currentstatus[0]->value;
		}
		$unitlatlong = DB::table('unit_latlong')->where('latlong_unit_id',$unitid)->get();
		$unitdata = new Unit;
		$nxtservicedate = $unitdata->nextservicedate($unitid);
		$colorcode = $unitdata->getstatuscolor($unitid);
		return view('Service.denyorequest', ['unitid' => $unitid,'units'=>$unit,'microtimestamp'=>$microtimestamp,'runninghrs'=>$runninghrs,'unitlatlong'=>$unitlatlong,'loginid'=>$loginid,'colorcode'=>$colorcode]);		
		
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
	
	public function servicebyid(Request $request) {
		$timezone = new Timezone;
		$servicedetail = array();
		
		$services = '';
		//$servicedetailqry = Service::where('service_id',$request->serviceid)->where('deletestatus','0')->where('serviced_datetime','!=','0000-00-00')->get();
		$servicedetailqry = Service::where('service_id',$request->serviceid)->where('deletestatus','0')->get();
		if($servicedetailqry) {
			$i = 0;
			foreach($servicedetailqry as $service)
			{

				/*if($service->service_scheduled_time == "") {
					$services[$i]['service_scheduled_time_format'] = '';
				}
				else {
					$services[$i]['service_scheduled_time_format'] = $service->service_scheduled_time;
				}	*/
				$services[$i]['service_id'] = $service->service_id;
				$services[$i]['service_unitid'] = $service->service_unitid;
				$services[$i]['unit_id'] = $service->service_unitid;
				$services[$i]['serviced_by'] = $service->serviced_by;
				$services[$i]['created_by'] = $service->created_by;
				$services[$i]['service_dot_color']='#0066ff';
				$services[$i]['service_dot_label']='service';
				if($service->service_scheduled_date !='0000-00-00' || $service->service_scheduled_date !='')
				{
				   $services[$i]['service_formatted_date'] = date('D, d M Y h:i A',strtotime($service->service_scheduled_date));
				}  
				else
				{
					$services[$i]['service_formatted_date'] ='';
				}
				
				$services[$i]['service_subject'] = $service->service_subject;
				$services[$i]['service_remark'] = $service->service_remark;
				$services[$i]['is_denyo_support'] = $service->is_denyo_support;
				$services[$i]['service_priority'] = $service->service_priority;
				$services[$i]['description'] = $service->description;
				$services[$i]['service_scheduled_date'] = date('Y-m-d',strtotime($service->service_scheduled_date));
				$services[$i]['serviced_datetime'] = str_replace(" ","T",$service->service_scheduled_date);
				if($service->next_service_date!='0000-00-00'){
					
				$services[$i]['next_service_date_selected'] = $service->next_service_date_selected;
				$services[$i]['next_service_date'] = date("d M Y", strtotime($service->next_service_date));
				$services[$i]['next_service_date_mobileview'] = date("d/m/Y", strtotime($service->next_service_date));
				}else{
				$services[$i]['next_service_date'] = '';
				$services[$i]['next_service_date_mobileview'] = '';
				$services[$i]['next_service_date_selected'] = '';
				}
				$services[$i]['is_request'] = $service->is_request;					
				$services[$i]['time_ago'] = $this->time_elapsed_string($service->current_datetime);
				$services[$i]['current_datetime'] = date('d M Y',strtotime($service->current_datetime));
				/*$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname','photo','personalhashtag')->get();
				if(count($staff) > 0) {

					$services[$i]['serviced_created_name'] = $staff[0]->firstname;
					$services[$i]['serviced_created_name_hastag'] = $staff[0]->personalhashtag;

					$services[$i]['serviced_by_name'] = $staff[0]->firstname;
					$services[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
					if($staff[0]->photo == '' || $staff[0]->photo == 'undefined')
								$services[$i]['user_photo'] = url('/') . '/images/default.png';
				}*/


				if($service->service_scheduled_date == "0000-00-00 00:00:00") {
					$services[$i]['serviced_scheduled_display'] = '';
					$services[$i]['serviced_schduled_date']='';
					$services[$i]['serviced_datetime_edit']='';
				}
				else {
					if( $request->input('timezoneoffset')){							
						//$services[$i]['serviced_schduled_date_utc'] =$service->service_scheduled_date;
						//$services[$i]['serviced_schduled_date_local'] =$timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));
						//$services[$i]['timezone_name'] =$timezone->getTimeZoneName($request->input('timezoneoffset'));
						$services[$i]['serviced_scheduled_display'] = $timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));			
						$tmpdate = $timezone->convertUTCtoDateYMDHIS($service->service_scheduled_date,$request->input('timezoneoffset'));
						$services[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
						//$services[$i]['convertutctolocal']=$timezone->convertutctolocal($service->service_scheduled_date,$request->input('timezoneoffset'));
					}else{
						$services[$i]['serviced_schduled_date'] = date("Y-m-d", strtotime($service->service_scheduled_date));						
						$services[$i]['serviced_scheduled_display'] = date("D d/m/Y, h:i A", strtotime($service->service_scheduled_date));			
						$tmpdate = date("Y-m-d H:i:s", strtotime($service->service_scheduled_date));
						$services[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
					}
					
					
				}

				$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname','photo','personalhashtag')->get();
				
					$created_by_staff = Staff::where('staff_id', $service->created_by)->select('firstname','photo','personalhashtag')->get();


					if(count($created_by_staff))
					{
						$services[$i]['serviced_created_name'] = $created_by_staff[0]->firstname;
						$services[$i]['serviced_created_name_hastag'] =  "(".$created_by_staff[0]->personalhashtag.")";
						
						if($created_by_staff[0]->photo == '' || $created_by_staff[0]->photo == 'undefined')
						{
							 $services[$i]['user_photo'] = url('/') . '/images/default.png';
						} else {
							$services[$i]['user_photo'] = url('/') . '/staffphotos/'.$created_by_staff[0]->photo;
						}			

					} else {
						$services[$i]['serviced_created_name'] = '';
						$services[$i]['serviced_created_name_hastag'] =  '';
						$services[$i]['user_photo'] = url('/') . '/images/default.png';
					}
					if(count($staff) > 0) {
						$services[$i]['serviced_by_name'] = $staff[0]->firstname;
						$services[$i]['serviced_by_name_hastag'] = "(".$staff[0]->personalhashtag.")";
						$services[$i]['serviced_by_name_hastag_withinclosedbracket'] = "(".$staff[0]->personalhashtag.")";
					   
					}
					/*else {
						$services[$i]['user_photo'] = url('/') . '/images/default.png';
					}*/

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
				$services[$i]['service_resources'] = $serviceresources;
				
				$units = Unit::where('unit_id',$service->service_unitid)->get();
				if($units) {
					$services[$i]['unitname'] = $units[0]->unitname;
					$services[$i]['projectname'] = $units[0]->projectname;
					$services[$i]['location'] = $units[0]->location;
					$unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$service->service_unitid)->orderBy('unit_latlong_id','desc')->skip(0)->take(1)->get();
					if(count($unit_latlong) > 0) {
						$services[$i]['latitude'] = $unit_latlong[0]->latitude;
						$services[$i]['longtitude'] = $unit_latlong[0]->longtitude;
					}
					$unitgroup = DB::table('unitgroups')->where('unitgroup_id',$units[0]->unitgroups_id)->get();
					if(count($unitgroup) > 0) {
						$services[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}
				}
				
				++$i;
			}
		}
		return response()->json(['msg' => array('result'=>'success'), 'servicedetail' => $services ]);
	}


	public function servicehistorynewapi(Request $request)
	{
		date_default_timezone_set('Asia/Singapore');
		$timezone = new Timezone;
		$ismobile = $request->is_mobile;
		$unitid = $request->unitid;
		if($ismobile == 1)
		{
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');
			
			$allservices = Service::where('deletestatus','0')->where('service_unitid', $unitid)->where('service_status','1')->whereRaw('DATE(service_scheduled_date) <= ?', [date('Y-m-d')])->get();
			
			$servicelist = Service::where('deletestatus','0')->where('service_unitid', $unitid)->where('service_status','1')->whereRaw('DATE(service_scheduled_date) <= ?', [date('Y-m-d')])->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			
			$services = array();
			if(count($servicelist) > 0)
			{
				$i = 0;
				foreach($servicelist as $service)
				{
					$services[$i]['next_service_date_selected_date'] = $service->next_service_date_selected_date;
					$services[$i]['next_service_date_selected'] = $service->next_service_date_selected;

					$services[$i]['service_id'] = $service->service_id;
					$services[$i]['service_unitid'] = $service->service_unitid;
					$services[$i]['serviced_by'] = $service->serviced_by;
					if($service->serviced_datetime == "0000-00-00" || $service->serviced_datetime != '' || strtolower($service->serviced_datetime) != 'null') {
						$services[$i]['serviced_datetime'] = '';
					}
					else {
						$services[$i]['serviced_datetime'] = $service->serviced_datetime;
					}	

					

					if($service->service_scheduled_date == "0000-00-00 00:00:00") {
						$services[$i]['serviced_scheduled_display'] = '';
						$services[$i]['serviced_schduled_date']='';
						$services[$i]['serviced_datetime_edit']='';
					}
					else {
						

						if( $request->input('timezoneoffset')){							
							$services[$i]['serviced_schduled_date_utc'] =$service->service_scheduled_date;
							$services[$i]['serviced_schduled_date_local'] =$timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));
							$services[$i]['timezone_name'] =$timezone->getTimeZoneName($request->input('timezoneoffset'));
							$services[$i]['serviced_scheduled_display'] = $timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));			
							$tmpdate = $timezone->convertUTCtoDateYMDHIS($service->service_scheduled_date,$request->input('timezoneoffset'));
							$services[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
						}else{
						$services[$i]['serviced_schduled_date'] = date("Y-m-d", strtotime($service->service_scheduled_date));						
						$services[$i]['serviced_scheduled_display'] = date("D d/m/Y, h:i A", strtotime($service->service_scheduled_date));			
						$tmpdate = date("Y-m-d H:i:s", strtotime($service->service_scheduled_date));
						$services[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
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
						$services[$i]['duration'] = '1';
						
					}
					else {
						$services[$i]['duration'] = '0';
					}*/
					$services[$i]['duration']=$timezone->duration($service->current_datetime);
					if($service->service_subject != "")
					{
                        			$services[$i]['service_subject'] = $service->service_subject;
					}
					else
					{
                         			$services[$i]['service_subject'] ="";
					}
					
					if($service->service_remark != "")
					{
					   $services[$i]['service_remark'] = $service->service_remark;	
					}
					else
					{
						$services[$i]['service_remark'] ="";
					}
					if($service->description != "")
					{
						$services[$i]['service_description'] = $service->description;

					}
					else
					{
						$services[$i]['service_description'] = "";
					}
					
					
					$services[$i]['is_denyo_support'] = $service->is_denyo_support;
					$services[$i]['service_priority'] = $service->service_priority;		
					$services[$i]['current_datetime'] = date('d M Y',strtotime($service->current_datetime));					
					$services[$i]['is_request'] = $service->is_request;	
					if($service->created_by != "")
					{
						$services[$i]['created_by']=$service->created_by;
					}
					else
					{
						$services[$i]['created_by']="";
					}
					

					if($service->is_denyo_support == '1') {
						$services[$i]['event_type'] = 'R';
						$services[$i]['is_request'] = '1';
						
					}
					else {
						$services[$i]['event_type'] = 'S';
					}
					if($service->next_service_date != '0000-00-00' || $service->next_service_date != '') {
						$services[$i]['next_service_date'] = $service->next_service_date;
						$services[$i]['next_service_date_mobileview'] = date("d/m/Y", strtotime($service->next_service_date));
						$services[$i]['nxtserviceformatted'] = date("d M Y", strtotime($service->next_service_date));
					}
					else {
						$services[$i]['next_service_date'] = '';
						$services[$i]['nxtserviceformatted'] = '';
						$services[$i]['next_service_date_mobileview'] ='';
					}
					$services[$i]['currentdate_mobileview'] =  date("d M Y", strtotime($service->current_datetime));
					$services[$i]['service_status'] = $service->service_status;
				//	$services[$i]['time_ago'] = $this->time_elapsed_string($service->current_datetime);
					
					$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname','photo','personalhashtag')->get();
					
					$created_by_staff = Staff::where('staff_id', $service->created_by)->select('firstname','personalhashtag')->get();

					if(count($created_by_staff)>0)
					{
						$services[$i]['serviced_created_name'] = $created_by_staff[0]->firstname;
						$services[$i]['serviced_created_name_hastag'] = "(".$created_by_staff[0]->personalhashtag.")";
						
					}
					if(count($staff) > 0) {
						$services[$i]['serviced_by_name'] = $staff[0]->firstname;
						$services[$i]['serviced_by_name_hastag'] = "(".$staff[0]->personalhashtag.")";					    
						$services[$i]['serviced_by_name_hastag_withinclosedbracket'] = "(".$staff[0]->personalhashtag.")";

						$services[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
						if($staff[0]->photo == '' || $staff[0]->photo == 'undefined')
									$services[$i]['user_photo'] = url('/') . '/images/default.png';
					}
					else {
						$services[$i]['user_photo'] = url('/') . '/images/default.png';
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
					$services[$i]['service_resources'] = $serviceresources;

					++$i;
				}
			}


			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allservices->count(), 'services' => $services]);
		}

	}


	public function serviceupcomingnewapi(Request $request)
	{


		
		$timezone = new Timezone;

		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			date_default_timezone_set($timezonename);
		}else{
			$timezonename='Asia/Singapore';
			date_default_timezone_set($timezonename);
		}

		$ismobile = $request->is_mobile;
		$unitid = $request->unitid;
		$todaydate=date('d M Y');
		if($ismobile == 1)
		{
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');			

			$allservices = Service::where('deletestatus','0')->where('service_unitid', $unitid)->whereRaw('(service_status = ? OR (DATE(service_scheduled_date) > ? AND service_status = ?))', [0, date('Y-m-d'), 1])->get();

			$servicelist = Service::where('deletestatus','0')->where('service_unitid', $unitid)->whereRaw('(service_status = ? OR (DATE(service_scheduled_date) > ? AND service_status = ?))', [0, date('Y-m-d'), 1])->orderBy($sort, $dir)->skip($startindex)->take($results)->get();		
			
			$services = array();
			if(count($servicelist) > 0)
			{
				$i = 0;
				foreach($servicelist as $service)
				{

					$services[$i]['service_id'] = $service->service_id;
					$services[$i]['service_status'] = $service->service_status;
					$services[$i]['service_unitid'] = $service->service_unitid;
					$services[$i]['serviced_by'] = $service->serviced_by;
					$services[$i]['next_service_date_selected_date'] = $service->next_service_date_selected_date;
					$services[$i]['next_service_date_selected'] = $service->next_service_date_selected;


					if($service->serviced_datetime == "0000-00-00" || $service->serviced_datetime == '' || strtolower($service->serviced_datetime) == 'null') {
						$services[$i]['serviced_datetime'] = '';
					}
					else {
						$services[$i]['serviced_datetime'] = $service->serviced_datetime;
					}					
					if($service->serviced_datetime == "0000-00-00") {
						$services[$i]['serviced_datetime_display'] = '';
					}
					else {
						$services[$i]['serviced_datetime_display'] = date("D d/m/Y, h:i a", strtotime($service->serviced_datetime));
					}
					if($service->service_scheduled_date == "0000-00-00 00:00:00") {
						$services[$i]['serviced_scheduled_display'] = '';
						$services[$i]['serviced_schduled_date']='';
						$services[$i]['serviced_datetime_edit']='';
					}
					else {
						
						$services[$i]['serviced_schduled_date'] = date("Y-m-d", strtotime($service->service_scheduled_date));						
						

						
						if( $request->input('timezoneoffset')){							
							//$services[$i]['serviced_schduled_date_utc'] =$service->service_scheduled_date;
							//$services[$i]['serviced_schduled_date_local'] =$timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));
							//$services[$i]['timezone_name'] =$timezone->getTimeZoneName($request->input('timezoneoffset'));
							$services[$i]['serviced_scheduled_display'] = $timezone->convertUTCtoDate($service->service_scheduled_date,$request->input('timezoneoffset'));			
							$tmpdate = $timezone->convertUTCtoDateYMDHIS($service->service_scheduled_date,$request->input('timezoneoffset'));
							$services[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
							//$services[$i]['convertutctolocal']=$timezone->convertutctolocal($service->service_scheduled_date,$request->input('timezoneoffset'));
						}else{
							$services[$i]['serviced_scheduled_display'] = date("D d/m/Y, h:i A", strtotime($service->service_scheduled_date));			
							$tmpdate = date("Y-m-d H:i:s", strtotime($service->service_scheduled_date));
							$services[$i]['serviced_datetime_edit'] = str_replace(" ","T", $tmpdate);
						}
				
						
					}

					$services[$i]['currentdate_mobileview'] =  date("d M Y", strtotime($service->current_datetime));
					$services[$i]['serviced_status'] = $service->service_status;
					
					if($service->current_datetime == "0000-00-00 00:00:00") {
						$services[$i]['created_datetime'] = '';
					}
					else {
						$services[$i]['created_datetime'] = date("d/m/Y ", strtotime($service->current_datetime));
					}

					$cdate = date('Y-m-d H:i:s');
					$scheduledtime=date("Y-m-d H:i:s", strtotime($service->service_scheduled_date));
					$datediff = date("Y-m-d H:i:s", strtotime($service->current_datetime));
					if($cdate == $datediff)
						$timediff = 0;
					else
						$timediff = strtotime($cdate) - strtotime($datediff);
					
					//MORE THAN 24 HOURS
					if( $timediff > 86400 ) {
						$services[$i]['duration'] = '1';
						
					}
					else {
						$services[$i]['duration'] = '0';
					}

				    
				    	$timediffschedule = strtotime($cdate) - strtotime($scheduledtime);
					
					//MORE THAN 24 HOURS

					if(($timediffschedule > 86400) && ($service->serviced_by == 0 ) && ($service->serviced_datetime == '0000-00-00')) {
						$services[$i]['schuled_status'] = '1';
						
					}
					else {
						$services[$i]['schuled_status'] = '0';
					}

        
					    if( $service->service_subject !="")
					    {
					    	$services[$i]['service_subject'] = $service->service_subject;
					    }
					    else
					    {
					    	$services[$i]['service_subject'] = "";
					    }

					    if($service->service_remark != "")
					    {
						 $services[$i]['service_remark'] = $service->service_remark;
					    }
					    else
					    {
						 $services[$i]['service_remark'] = "";
					    }
					    if($service->description != "")
					    {
					    	$services[$i]['service_description'] = $service->description;
					    }
					    else
					    {
					    	$services[$i]['service_description'] = "";
					    }
					
					
					//$services[$i]['service_description'] = $service->description;

					$services[$i]['is_denyo_support'] = $service->is_denyo_support;
					$services[$i]['service_priority'] = $service->service_priority;		
					$services[$i]['current_datetime'] = date('d M Y',strtotime($service->current_datetime));
					$services[$i]['is_request'] = $service->is_request;
					if($service->is_denyo_support == '1') {
						$services[$i]['event_type'] = 'R';
						$services[$i]['is_request'] = '1';
						
					}
					else {
						$services[$i]['event_type'] = 'S';
					}
					if($service->service_scheduled_date != '0000-00-00')  {
						$services[$i]['next_service_date'] = $service->service_scheduled_date;
						$services[$i]['next_service_date_mobileview'] = date("d/m/Y", strtotime($service->service_scheduled_date));
						$services[$i]['nxtserviceformatted'] = date("d M Y", strtotime($service->service_scheduled_date));
						
						
						if($service->serviced_by == '0' && (strtotime($todaydate) > strtotime($service->service_scheduled_date)))
						{
						
							$services[$i]['duedatecolor']='#C71717';
						}
						else
						{
						
							$services[$i]['duedatecolor']='';
						}
						
					
					}
					else {
						$services[$i]['next_service_date'] = "";
						$services[$i]['nxtserviceformatted'] = "";
						$services[$i]['next_service_date_mobileview'] = "";
						if($service->serviced_by == '0' && (strtotime($todaydate) > strtotime($service->service_scheduled_date)))
						{						
							$services[$i]['duedatecolor']='#C71717';
						}
						else
						{
						
							$services[$i]['duedatecolor']='';
						}
					}
					
				//	$services[$i]['time_ago'] = $this->time_elapsed_string($service->current_datetime);
					
					$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname','photo','personalhashtag')->get();
				
					$created_by_staff = Staff::where('staff_id', $service->created_by)->select('firstname','photo','personalhashtag')->get();


					if(count($created_by_staff))
					{
						$services[$i]['serviced_created_name'] = $created_by_staff[0]->firstname;
						$services[$i]['serviced_created_name_hastag'] =  "(".$created_by_staff[0]->personalhashtag.")";
						$services[$i]['serviced_created_name_hastag_withinclosedbracket'] = "(".$created_by_staff[0]->personalhashtag.")";
						$services[$i]['user_photo'] = url('/') . '/staffphotos/'.$created_by_staff[0]->photo;
						if($created_by_staff[0]->photo == '' || $created_by_staff[0]->photo == 'undefined')
						{
							 $services[$i]['user_photo'] = url('/') . '/images/default.png';
						}					

					}
					if(count($staff) > 0) {

						$services[$i]['serviced_by_name'] = $staff[0]->firstname;
						$services[$i]['serviced_by_name_hastag'] = "(".$staff[0]->personalhashtag.")";
						$services[$i]['serviced_by_name_hastag_withinclosedbracket'] = "(".$staff[0]->personalhashtag.")";
					    	$services[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;


						$services[$i]['user_photo'] = url('/') . '/staffphotos/'.$staff[0]->photo;
						if($staff[0]->photo == '' || $staff[0]->photo == 'undefined')
							$services[$i]['user_photo'] = url('/') . '/images/default.png';
					}
					else {
						$services[$i]['serviced_by_name'] = '';
						$services[$i]['serviced_by_name_hastag'] = '';
						//$services[$i]['user_photo'] = url('/') . '/images/default.png';
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
					$services[$i]['service_resources'] = $serviceresources;

					++$i;
				}
			}

			
			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allservices->count(), 'services' => $services]);
		}

	}


	public function servicescheduleedit($id)
	{
       	$services = DB::table('services')->where('service_id', $id)->get();  
       	 $service_edit=array();


       

        $service_edit['service_id']=$services[0]->service_id;
       	$service_edit['service_unitid']=$services[0]->service_unitid;
       	$service_edit['service_subject']=$services[0]->service_subject;
       	$service_edit['service_remark']=$services[0]->service_remark;
       	$service_edit['is_request']=$services[0]->is_request;
       	$service_edit['is_denyo_support']=$services[0]->is_denyo_support;
       	$service_edit['service_scheduled_date']=$services[0]->service_scheduled_date;       	
       	$service_edit['description']=$services[0]->description;

       	if($services[0]->created_by != "")
       	{
       		  	$staff = Staff::where('staff_id', $services[0]->created_by)->select('firstname','photo','personalhashtag')->get();
       		  	$service_edit['created_by']=$staff[0]->firstname;
       		  	$service_edit['created_by_hashtag']=$staff[0]->personalhashtag;
       		  	$service_edit['created_by_photo']=url('/') . '/staffphotos/'.$staff[0]->photo;

			   if($staff[0]->photo == '' || $staff[0]->photo == 'undefined')
			   $service_edit['created_by_photo'] = url('/') . '/images/default.png';
        }

      


       	return response()->json(['msg' => array('result'=>'success'),'services' => $service_edit]);

	}

	public function newserviceschedule(Request $request)
	{
		$timezone = new Timezone;
		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
		}else{
			$timezonename='';
		}
		$is_denyo_support = $request->is_denyo_support;	

		
		$is_request = $request->is_request;
		$ismobile = $request->is_mobile;
		$subject =   $request->subject;
		$dateandtime = $request->dateandtime;
		$tmpdateandtime = @explode("T", $dateandtime);
		$date = $tmpdateandtime[0];
		$time = @explode("+", $tmpdateandtime[1]);
		$dateandtime = $date.' '.$time[0];
			
		$created_by = $request->created_by;
		$unitid = $request->unitid;
		$description = trim($request->description);
		if($request->current_datetime){
			$current_datetime=$request->current_datetime;
		}else{
			$current_datetime= date('Y-m-d H:i:s');
		}
		if($is_denyo_support == 0) {					
			DB::table('services')->insert(array('description' => $description, 'service_subject' => $subject, 'service_scheduled_date' => $dateandtime, 'created_by' => $created_by, 'service_unitid' => $unitid, 'is_denyo_support' => $is_denyo_support, 'is_request' => $is_request,'timezone'=>$timezonename,'current_datetime'=>$current_datetime));
		} else {
			DB::table('services')->insert(array('service_remark' => $description, 'service_subject' => $subject, 'service_scheduled_date' => $dateandtime,'serviced_by' => $created_by, 'created_by' => $created_by, 'service_unitid' => $unitid, 'is_denyo_support' => $is_denyo_support, 'is_request' => $is_request, 'service_status' => 1,'timezone'=>$timezonename,'current_datetime'=>$current_datetime));
		}
		
		
		// Get services last insert id
		$serviceid = 1;
		$lastins = DB::table('services')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
		if($lastins)
			$serviceid = $lastins[0]->service_id;

		$serscheduledate = '';
		$inservices = DB::table('services')->where('service_id', $serviceid)->select('service_scheduled_date')->get();
		if(count($inservices) > 0) {
			$serscheduledate = $inservices[0]->service_scheduled_date;
		}

		// Push & Email 
		$staff = Staff::where('staff_id', $request->created_by)->select('firstname', 'email')->get();
		$unit = Unit::where('unit_id', $request->unitid)->select('unitname', 'projectname', 'location')->get();

	
		// get notify content for send push notifications
		$notifycontent = '';		
		$notifys = DB::table('notification_content')->where('notify_type', 'S')->get();
		if($notifys)
		{			
			$notify_content = $notifys[0]->notify_for.'<br>'.$notifys[0]->notify_content;
			$notify_content = str_replace('#NAME#', $staff[0]->firstname, $notify_content);
			$notify_content = str_replace('#UNITNAME#', $unit[0]->unitname, $notify_content);
			$notify_content = str_replace('#PROJECTNAME#', $unit[0]->projectname, $notify_content);
			$notify_content = str_replace('#SUBJECT#', $description, $notify_content);
			$notifycontent = str_replace('#DATEANDTIME#', date('d M Y h:iA'), $notify_content);
			$notifycontent = nl2br($notifycontent);
		}

		// get the personalhashtags from remark
		$emailids = '';
		$mentionids = '';
		$pushid='';
		$hashtags = @explode(' ',$description);
		if(isset($request->pushnotify)) {
			$hashtags = @explode(' ',$request->pushnotify);
		}
		//print_r($hashtags); exit;
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
					if(count($staffs) > 0)
					{
						$emailids[] = $staffs[0]->email;						
						// Insert data for send push notifications
						$pushid=DB::table('pushnotifications')->insertGetId(['notify_subject'=>$request->subject,'notify_content' => $notifycontent, 'notify_by' => $request->created_by, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => 'S', 'table_id' => $serviceid]);	
						// Insert data for service notification to show count in unit details 
						DB::table('service_notifications')->insert(['service_unit_id' => $request->unitid, 'service_staff_id' => $staffs[0]->staff_id, 'services_id' => $serviceid]);

						//echo "Hai inserted";
					}
				}				
			}
		}


		$serviceresources = '';
		$microtime = $request->micro_timestamp;
		$resources = DB::table('service_resources')->where('micro_timestamp', $microtime)->get();
		if($resources)
		{
			DB::table('service_resources')->where('micro_timestamp', $microtime)->update(['services_id' => $serviceid]);
		}

		$attachfiles = array();
		$attachments = DB::table('service_resources')->where('micro_timestamp', $microtime)->where('services_id', $serviceid)->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$attachfiles[] = url('/').'/serviceimages/'.$attachment->service_resource;
			}
		}	

		
		if(count($emailids) > 0 && is_array($emailids))
		{
			
			$content = '<table width="100%" cellpadding="5" cellspacing="5">';
			$content .= '<tr><td><b>Servicing Info:</b><br></td></tr>';
			$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
			$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
			$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
			
			$content .= '<tr><td>Scheduled Date & Time: '.date("d M Y h:i A", strtotime($serscheduledate)).'</td></tr>';
			
			$content .= '<tr><td>Description: '.$description.'</td></tr>';
			$content .= '</table>';			
			$subject = $request->subject;
			if(count($staff) > 0) {
				$replyto = $staff[0]->email;
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridec.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '')->subject($data['subject']);
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
				});
			}
		}
		// Push & Email 
		//return response()->json(['msg' => array('result'=>'New Service Scheduled Added successfully')]);
		//return response()->json(['msg' => array('result'=>'New Service Scheduled Added successfully'),'d' =>'']);
		//return response()->json(['msg' => array('result'=>'New Service Scheduled Added successfully')]);
		$msg = array(array('Error' => '0','result'=>'New Service Scheduled Added successfully','pushid'=>$pushid));			
		return response()->json(['msg'=>$msg]);
	}

	
}

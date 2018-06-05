<?php

namespace App\Http\Controllers;
use App\Message;
use App\Staff;
use App\Unit;
use Illuminate\Http\Request;
use DB;
use File;
use Mail;
use Response;
use App\Timezone;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\DataTables\MessageDataTable;
use App\DataTables\SentItemsDataTable;
use Yajra\Datatables\Datatables;
use Symfony\Component\HttpFoundation\Session\Session;

class MessageController extends Controller
{
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request, MessageDataTable $dataTable)
	{		
		$ismobile = $request->is_mobile;
		if($ismobile == 1)
		{
			$startindex = $request->startindex; // start limit
			$results = $request->results; // end limit		
			$sort = $request->sort;
			$dir = $request->dir;
			$loginid = $request->loginid;
			$allmessages = DB::table('messagesinbox')->where('reciver_id', $loginid)->get();
			$senderids = $sender_ids = $messagelist = '';
			
			if($sort == 'sendername')
			{
				$sendermessages = DB::select('SELECT * FROM messagesinbox WHERE reciver_id='.$loginid);
				
				//$sendermessages = DB::table('messagesinbox')->groupBy('sender_id')->where('reciver_id', //$loginid)->select()->get();
				
				if(count($sendermessages) > 0)
				{
					foreach($sendermessages as $sendermessage)
					{
						$senderids[] = $sendermessage->sender_id;
					}
					if($senderids)
					{
						$senders = DB::table('staffs')->whereIn('staff_id', $senderids)->orderBy('firstname', 'asc')->get();
						
						if($senders)
						{
							foreach($senders as $sender)
							{
								$sender_ids[] = "'".$sender->staff_id."'";
							}
						}						
					}
				}
				if($sender_ids)
				{
					$sender_ids = @implode(',', $sender_ids);
					$messagelist = DB::table('messagesinbox')->where('reciver_id', $loginid)->orderByRaw("FIELD(sender_id,$sender_ids)".$dir)->skip($startindex)->take($results)->get();
				}
			}
			else
				$messagelist = DB::table('messagesinbox')->where('reciver_id', $loginid)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			
			$messages = '';
			if($messagelist)
			{
				$i = 0;
				foreach($messagelist as $message)
				{
					$messageinbox = DB::table('messages')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_body_html'] =  strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_date'] = date('d M Y h:i A',strtotime($messageinbox[0]->messages_date));
					$messages[$i]['message_date_mobileview'] = date('d/m/Y h:i A',strtotime($messageinbox[0]->messages_date));
					$messages[$i]['message_date_mobileview_list'] = date('d/m/Y',strtotime($messageinbox[0]->messages_date));
					$messages[$i]['is_favorite'] = $message->messagesinbox_isfavaurite;
					$messages[$i]['message_readstatus'] = $message->messagesinbox_status;
					$messages[$i]['message_priority'] = $message->messagesinbox_priority;
					if($message->messagesinbox_priority == 1) {
						$messages[$i]['priority_image'] = "arrow_active_low.png";
					} else if($message->messagesinbox_priority == 2) {
						$messages[$i]['priority_image'] = "arrow_active_high.png";
					} else {
						$messages[$i]['priority_image'] = "";
					}
					$messages[$i]['isreply'] = $message->messages_isreply;
					$messages[$i]['time_ago'] = $this->time_elapsed_string($messageinbox[0]->messages_date);
					
					$messages[$i]['receiver_id'] =$messageinbox[0]->reciver_id;
					
					
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;

					$replyall = '';

					$receivers = DB::table('messagesinbox')->where('messages_id', $message->messages_id)->get();

					if($receivers)
					{
						foreach($receivers as $receiver)
						{	
							if($receiver->reciver_id != $loginid) {	
								$staff = Staff::where('staff_id', $receiver->reciver_id)->select('personalhashtag')->get();			
								if(count($staff) > 0) {		
									$replyall[] = $staff[0]->personalhashtag;
								}
							}						
						}
					}
					
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo','personalhashtag')->get();
					if(count($sender) > 0)
					{
						$replyall[] = $sender[0]->personalhashtag;
						$messages[$i]['sendername'] = $sender[0]->firstname;
						if($sender[0]->photo == '' || $sender[0]->photo == 'undefined') {
							$messages[$i]['senderphoto'] = url('/') . '/images/default.png';	
						}
						else {
							$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
						}
						
						$messages[$i]['personalhashtag'] = $sender[0]->personalhashtag;
					}
					else
					{
						$messages[$i]['sendername'] = '';
						$messages[$i]['senderphoto'] = '';
					}
					
					if($replyall && is_array($replyall)) {
						$messages[$i]['replyall'] = @implode(' ', $replyall);
					} else {
						$messages[$i]['replyall'] = '';
					}


					$cdate = date('Y-m-d H:i:s');					
					$datediff = date("Y-m-d H:i:s", strtotime($messageinbox[0]->messages_date));
					if($cdate == $datediff)
						$timediff = 0;
					else
						$timediff = strtotime($cdate) - strtotime($datediff);
					
					//MORE THAN 24 HOURS
					if( $timediff > 86400 ) {
						$messages[$i]['duration'] = '1';						
					}
					else {
						$messages[$i]['duration'] = '0';
					}

					
					++$i;
				}
			}

			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allmessages->count(), 'messages' => $messages]);
		}
		else
		{
			$session = new Session();
			$session->set('ses_from_page', 'inbox');
			return $dataTable->render('Message.index');
		}					
	}

	public function sentitems(Request $request, SentItemsDataTable $dataTable)
	{		
		$ismobile = $request->is_mobile;
		if($ismobile == 1)
		{
			$startindex = $request->startindex; // start limit
			$results = $request->results; // end limit		
			$sort = $request->sort;
			$dir = $request->dir;
			$loginid = $request->loginid;
			$allmessages = DB::table('messages')->where('sender_id', $loginid)->where('messages_status', '0')->orderBy('messages_id', 'desc')->get();
			
			$receiverids = $receiver_ids = $messagelist = $receivernames = $tmpmessages = '';
			if($sort == 'receivername')
			{
				if($allmessages)
				{
					foreach($allmessages as $allmessage)
					{
						$inboxids = DB::table('messagesinbox')->where('messages_id', $allmessage->messages_id)->get();
						if($inboxids)
						{
							foreach($inboxids as $inboxid)
							{
								$receiverids[] = $inboxid->reciver_id;
							}							
						}
					}
				}
				if($receiverids)
				{
					$receiverids = array_unique($receiverids);
					$staffs = DB::table('staffs')->whereIn('staff_id', $receiverids)->orderBy('firstname', 'desc')->get();
					if($staffs)
					{						
						foreach($staffs as $staff)
						{							
							$tmpmessages = DB::table('messagesinbox')->where('sender_id', $loginid)->where('reciver_id', $staff->staff_id)->get();
							if($tmpmessages)
							{
								foreach($tmpmessages as $tmpmessage)
								{
									$receiver_ids[] = "'".$tmpmessage->messages_id."'";
								}
							}
						}
						
					}
				}
				if($receiver_ids)
				{
					$receiver_ids = array_unique($receiver_ids);
					
					$receiver_ids = @implode(',', $receiver_ids);
			
					$messagelist = DB::table('messages')->where('sender_id', $loginid)->where('messages_status', '0')->orderByRaw("FIELD(messages_id, $receiver_ids)". $dir)->skip($startindex)->take($results)->skip($startindex)->take($results)->get();
				}				
			}
			else
				$messagelist = DB::table('messages')->where('sender_id', $loginid)->where('messages_status', '0')->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			
			$messages = '';
			if(count($messagelist) > 0)
			{
				$i = 0;
				foreach($messagelist as $message)
				{					
					//$messageinbox = DB::table('messagesinbox')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['messages_isfavaurite'] = $message->messages_isfavaurite;
					$messages[$i]['message_body'] = strip_tags($message->messages_body);
					$messages[$i]['message_body_html'] =  strip_tags($message->messages_body);
					$messages[$i]['message_date'] = date('d M Y',strtotime($message->messages_date));
					$messages[$i]['message_date_mobileview'] = date('d/m/Y H:i A',strtotime($message->messages_date));
					$messages[$i]['message_date_mobileview_list'] = date('d/m/Y',strtotime($message->messages_date));
					
					$messages[$i]['time_ago'] = $this->time_elapsed_string($message->messages_date);
					
					$messages[$i]['message_priority'] = $message->message_priority;
					// if(count($messageinbox) > 0) {
						// $messages[$i]['receiver_id'] = $messageinbox[0]->reciver_id;						
					// }
					if($message->message_priority == 1) {
						$messages[$i]['priority_image'] = "arrow_active_low.png";
					} else if($message->message_priority == 2) {
						$messages[$i]['priority_image'] = "arrow_active_high.png";
					} else {
						$messages[$i]['priority_image'] = "";
					}
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo','personalhashtag')->get();
					$senderphoto = '';
					if(count($sender) > 0)
					{
						$messages[$i]['personalhashtag'] = $sender[0]->personalhashtag;
						$senderphoto = url('/').'/staffphotos/'.$sender[0]->photo;
					}
					else
					{
						$messages[$i]['personalhashtag'] = '';
						$senderphoto = '';
					}
					$receivernames = $receiversphoto= $directemails = '';
					$receivers = DB::table('messagesinbox')->where('messages_id', $message->messages_id)->get();

					if($receivers)
					{

						foreach($receivers as $receiver)
						{
							$staff = Staff::where('staff_id',$receiver->reciver_id)->select('firstname','photo', 'lastname')->get();
							if($staff) { $receivernames[] = $staff[0]->firstname.' '.$staff[0]->lastname; $receiversphoto[]=$staff[0]->photo; } else{ $receiversphoto[]='';}
						}
					}
					if($message->reciver_id)
					{
						$tmpids = @explode(' ', $message->reciver_id);
						if($tmpids)
						{
							foreach($tmpids as $tmpid)
							{
								if($tmpid[0] != "@") { $receivernames[] = $tmpid; } 
							}
						}
					}
					if($receivernames) { 
						$receivernames = @implode(' ', $receivernames);
						if(strlen($receivernames) > 50) { $receivernames = substr($receivernames, 0, 50).'..'; }
						$messages[$i]['receiver_id']   = '@'.$receivernames;
						$messages[$i]['receiver_name'] = $receivernames;
						if($receiversphoto !=''){

		                 			if($receiversphoto[0] == '' || $receiversphoto[0] == 'undefined') {
								$messages[$i]['recipient_photo'] = url('/') . '/images/default.png';
								//$messages[$i]['senderphoto'] = url('/') . '/images/default.png';	
							}
							else {
								$messages[$i]['recipient_photo'] = url('/').'/staffphotos/'.$receiversphoto[0];
								//$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$receiversphoto[0];
							}

					    	}  // only photo of first recipient 
						else {
							$messages[$i]['receiver_name'] = '';
							$messages[$i]['recipient_photo'] = '';
							$messages[$i]['senderphoto'] = '';
						}
					}
					else {
						$messages[$i]['receiver_id'] = '';
						$messages[$i]['receiver_name'] = '';
						$messages[$i]['recipient_photo'] = '';
						$messages[$i]['senderphoto'] = '';
					}

					if(count($sender) > 0) {
						if($sender[0]->photo != '' && $sender[0]->photo != 'NULL') {
							$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
						} else {
							$messages[$i]['senderphoto'] = url('/') . '/images/default.png';
						}
					}
					
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;

					$replyall = '';

					$receivers = DB::table('messages')->where('messages_id', $message->messages_id)->get();

					if($receivers)
					{
						foreach($receivers as $receiver)
						{
							
							//$replyall[] = $receiver->reciver_id;
							if($receiver->reciver_id != $loginid) {	
								$staff = Staff::where('staff_id', $receiver->reciver_id)->select('personalhashtag')->get();			
								if(count($staff) > 0) {		
									$replyall[] = $staff[0]->personalhashtag;
								}
							}
							
						}
					}
					
					if($replyall && is_array($replyall)) {
						$messages[$i]['replyall'] = @implode(' ', $replyall);
					} else {
						$messages[$i]['replyall'] = '';
					}

					$cdate = date('Y-m-d H:i:s');					
					$datediff = date("Y-m-d H:i:s", strtotime($message->messages_date));
					if($cdate == $datediff)
						$timediff = 0;
					else
						$timediff = strtotime($cdate) - strtotime($datediff);
					
					//MORE THAN 24 HOURS
					if( $timediff > 86400 ) {
						$messages[$i]['duration'] = '1';						
					}
					else {
						$messages[$i]['duration'] = '0';
					}

					++$i;
				}
			}
			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allmessages->count(), 'messages' => $messages]);
		}
		else
		{
			$session = new Session();
			$session->set('ses_from_page', 'sentitems');
			return $dataTable->render('Message.sentitems', ['frompage' => 'sentitems']);	
		}				
	}

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function create(Request $request)
	{
		$session = new Session();
		$ses_login_id = $session->get('ses_login_id');
		$company_id = $session->get('ses_company_id');
		$staffids = '';
		$tag = '';
		if(isset($request->tag)) {
			$tag = $request->tag;
		}

		if($company_id == 1)
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->get();
		else
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->whereIn('staffs.company_id', [1, $company_id])->get();
		if($staffs)
		{
			foreach($staffs as $staff)
			{
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}

		$unit = new Unit;
		$hashtags = $unit->gethashtags($company_id, $ses_login_id, 'message');

		$microtime = date("YmdHis");
		
		return view('Message.create', ['hashtags' => $hashtags, 'microtime' => $microtime, 'tag' => $tag, 'staffids' => $staffids]);
	}

	

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request)
	{		
		
		date_default_timezone_set('Asia/Singapore');
		$timezone = new Timezone;
		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			$nextservicesupport['timezone'] = $timezonename;
		}else{
			$timezonename='';
			$nextservicesupport['timezone'] = $timezonename;
		}
		if($request->current_datetime){
			$current_datetime=$request->current_datetime;		
		}else{
			$current_datetime= date('Y-m-d H:i:s');			
		}

		$ismobile = $request->is_mobile;
		if($ismobile)
		{
			$loginid = $request->loginid;
		}
		else
		{
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$toids = $request->to;
		$subject = $request->subject;
		$content = $request->composemessagecontent;
		$copytome = $request->copytome;
		$important = $request->important;
		$microtime = $request->microtime;
		$emailids = '';
		$attachfiles = array();
		if($toids)
		{
			$toids = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($toids));
			$toids = str_replace('</span>', '', $toids);			
			$toids = str_replace('&nbsp;', '', $toids);
			$toids = str_replace('<br>', '', $toids);
			$toids = str_replace('?', '', $toids);
			$toids = str_replace('\xE2\x80\x8D', '', $toids);
			$toids = str_replace('\u200d', '', $toids);	
			$toids = preg_replace('/[^A-Za-z0-9 @_.]/u','', strip_tags($toids));				
			$toids = strip_tags(stripslashes($toids));
			$toids = str_replace(",", ' ', $toids);
			if($copytome == 1)
			{
				$sender = Staff::where('staff_id', $loginid)->select('email')->get();
				if(count($sender) > 0) { $emailids[] = $sender[0]->email; }
				
			}
			
			DB::table('messages')->insert(['sender_id' => $loginid, 'reciver_id' => $toids, 'messages_subject' => $subject, 'messages_body' => $content, 'messages_date' => $current_datetime,	'messages_currentdatetime'=>$current_datetime, 'messages_isresource' => '0', 'message_priority' => $important,'timezone'=>$timezonename]);
			$messageid = 1;
			$getlastid = DB::table('messages')->orderBy('messages_id', 'desc')->skip(0)->take(1)->get();
			if($getlastid) { $messageid = $getlastid[0]->messages_id; }
			

			$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->get();
			if($attachments)
			{
				foreach($attachments as $attachment)
				{
					$attachfiles[] = url('/').'/attachments/'.$attachment->attachment;
					DB::table('messageattachment')->insert(['message_id' => $messageid, 'messageresource_filename' => $attachment->attachment,'filesizetotal_int'=> $attachment->filesizetotal_int,'filesize_int'=>$attachment->filesize_int,'filesize_kb'=>$attachment->filesize_kb,'filesizetotal_kb'=>$attachment->filesizetotal_kb,'attchment_filesize'=>$attachment->attach_filesize,'old_new'=>'old']);
					DB::table('attachments')->where('attachment_id', $attachment->attachment_id)->delete();
				}
			}

			$sender = Staff::where('staff_id', $loginid)->select('email', 'firstname')->get();
			$replyto = $sender[0]->email;
			$sendername = $sender[0]->firstname;
			$toids = str_replace(",", ' ', $toids);
			$toids = @explode(' ', $toids);
			$pushid='';
			for($i = 0; $i < count($toids); $i++)
			{
				$to = $toids[$i];
				if($to[0] == '@')
				{
					$staff = Staff::where('personalhashtag', $to)->where('status','0')->select('staff_id', 'email')->get();
					if(count($staff) > 0)
					{
						$emailids[] = $staff[0]->email;
						$msgto = $staff[0]->staff_id;
						
						DB::table('messagesinbox')->insert(['messages_id' => $messageid, 'sender_id' => $loginid, 'reciver_id' => $msgto, 'messages_subject' => $subject, 'messagesinbox_date' => $current_datetime, 'messagesinbox_priority' => $important, 'timezone' => $timezonename]);
						
						$notifycontent = 'New Message <br>by: '.$sendername.'<br>'.$subject;
						
						$pushid=DB::table('pushnotifications')->insertGetId(['notify_subject' => $subject, 'notify_by' => $loginid, 'notify_to' => $msgto, 'notify_type' => 'M', 'table_id' => $messageid, 'notify_content' => $notifycontent]);
					}
				}
				else
				{					
					
					if(filter_var($to, FILTER_VALIDATE_EMAIL)) {
						$emailids[] = $to;
					}
				}
			}
			/*kannan hide end - 02-12-2017
			*/
			
			if($emailids)
			{				
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);
		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridec.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '');
					$m->subject($data['subject']);	
					
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
					
				});
			}
		}
		if($ismobile == 1)
		{
			$msg = array(array('Error' => '0','result'=>'Message sent successfully','pushid'=>$pushid));			
			return response()->json(['msg' => $msg]);
		}	
		else {
			$session->getFlashBag()->add('msg_sent','Message sent successfully');
			return redirect('/messages');
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
		$session = new Session();
		$ses_login_id = $session->get('ses_login_id');
		$company_id = $session->get('ses_company_id');
		$frompage = $session->get('ses_from_page');		
		DB::table('messagesinbox')->where('messages_id', $id)->update(['messagesinbox_status' => '1']);
		$msginbox = DB::table('messagesinbox')->where('messages_id', $id)->get();		
		DB::table('pushnotifications')->where('table_id', $id)->where('notify_to',$ses_login_id)->update(['notify_to_readstatus' => '1']);
		$messagedetails = DB::table('messages')->where('messages_id', $id)->get();
		if(count($messagedetails) > 0) {
			$messagedetails = $messagedetails[0];
		
		$msgbody = $messagedetails->messages_body;
		@preg_match('/(<img[^>]+>)/i', $msgbody, $matches);
		$inlineimage = @$matches[0];
		
		
		$microtime = date('YmdHis');		
		$staffids = '';
		if($company_id == 1)
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->get();
		else
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->whereIn('staffs.company_id', [1, $company_id])->get();
		if(count($staffs) > 0)
		{
			foreach($staffs as $staff)
			{
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		$replyall = '';
		$sender = Staff::where('staff_id', $messagedetails->sender_id)->select('firstname', 'photo', 'email', 'personalhashtag')->get();
		if($sender) { 
			$sender = $sender[0]; 
			$replyall[] = $sender->personalhashtag;
		}
		$receivers = '';
		$receiverids = $messagedetails->reciver_id;
		
		if($receiverids)
		{
			$receiverids = @explode(' ', $receiverids);
			foreach($receiverids as $receiver)
			{
				if($receiver[0] == "@")
				{
					$staff = Staff::where('personalhashtag', $receiver)->select('staff_id', 'firstname', 'email', 'lastname', 'personalhashtag')->get();					
					if($ses_login_id != $staff[0]->staff_id) {
						$receivers .= $staff[0]->firstname.' '.$staff[0]->lastname.', ';
						$replyall[] = $staff[0]->personalhashtag;
					} else {
						$receivers .= 'Me, ';
					}
				} else {
					$replyall[] = $receiver;
				}
			}
			if($receivers) {				
				$receivers = substr($receivers, 0, strlen($receivers) - 2);
			}
			if($replyall && is_array($replyall)) {
				$replyall = @implode(' ', $replyall);
			}
		}
		$user = DB::table('staffs')->where('staff_id', $ses_login_id)->get();
		if(count($user) > 0) { $userdata = $user[0]; }
		$attachments = DB::table('messageattachment')->where('message_id', $id)->get();
		return view('Message.show', ['messagedetails' => $messagedetails, 'microtime' => $microtime, 'staffids' => $staffids, 'sender' => $sender, 'receivers' => $receivers, 'attachments' => $attachments, 'inlineimage'=>$inlineimage,'userdata' => $userdata,'msginbox'=>$msginbox,'frompage'=>$frompage, 'replyall' => $replyall]);
		}

	}

	public function replyforward(Request $request) {
		
		$timezone = new Timezone;
		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			$nextservicesupport['timezone'] = $timezonename;
		}else{
			$timezonename='';
			$nextservicesupport['timezone'] = $timezonename;
		}
		if($request->current_datetime){
			$current_datetime=$request->current_datetime;		
		}else{
			$current_datetime= date('Y-m-d H:i:s');			
		}

		date_default_timezone_set('Asia/Singapore');
		if($request->is_mobile == 1) {
			$loginid = $request->loginid;			
		}
		else {
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$toids = $request->to;
		$subject = $request->subject;
		$content = $request->composemessagecontent;
		$copytome = $request->copytome;
		$important = $request->important;
		$microtime = $request->microtime;
		$chkreply = $request->submit;
		$forwardmsgid = $request->forwardmsgid;
		$emailids = '';
		$attachfiles = [];
		$isreply = 0;
		
		if($toids)
		{
			
			$toids = str_replace(",", ' ', $toids);

			if($chkreply == "Reply")
			{
				$isreply = 1;
				$tmpsubject = @explode(' ', $subject);
				if(trim($tmpsubject[0]) != 'RE:') {
					$subject = "RE: ".$subject;
				}
			} else {
				$isreply = 0;
			}
			
			if($copytome == 1)
			{
				$sender = Staff::where('staff_id', $loginid)->select('email')->get();
				if($sender) { $emailids[] = $sender[0]->email; }
			}
			
			DB::table('messages')->insert(['sender_id' => $loginid, 'reciver_id' => $toids, 'messages_subject' => $subject, 'messages_body' => $content, 'messages_date' => $current_datetime,	'messages_currentdatetime'=>$current_datetime, 'messages_isresource' => '0', 'message_priority' => $important, 'timezone' => $timezonename]);
			$messageid = 1;
			$getlastid = DB::table('messages')->orderBy('messages_id', 'desc')->skip(0)->take(1)->get();
			if($getlastid) { $messageid = $getlastid[0]->messages_id; }

			
			$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->get();
			if($attachments)
			{
				foreach($attachments as $attachment)
				{
					$attachfiles[] = url('/').'/attachments/'.$attachment->attachment;
					DB::table('messageattachment')->insert(['message_id' => $messageid, 'messageresource_filename' => $attachment->attachment,'attchment_filesize'=>$attachment->attach_filesize]);
					DB::table('attachments')->where('attachment_id', $attachment->attachment_id)->delete();
				}
			}


			$tmpattachments = DB::table('messageattachment')->where('message_id', $forwardmsgid)->get();
			$totalfsize = $filesizes = $totalfilesize = '';
			if($tmpattachments)
			{
				foreach($tmpattachments as $attachment)
				{
					$attachfiles[] = url('/').'/attachments/'.$attachment->messageresource_filename;
					DB::table('messageattachment')->insert(['message_id' => $messageid, 'messageresource_filename' => $attachment->messageresource_filename,'attchment_filesize'=>$attachment->attchment_filesize]);					
				}				
			}
			
			$sender = Staff::where('staff_id', $loginid)->select('email', 'firstname')->get();
			if(count($sender) > 0) {
				$replyto = $sender[0]->email;
				$sendername = $sender[0]->firstname;
			}
			$notcontent = $content;
			if(strlen($notcontent) > 50) {
				$notcontent = substr($notcontent, 0, 50).'...';
			}
			$to[0] = '';
			$toids = str_replace(",", ' ', $toids);
			$toids = @explode(' ', $toids);
			for($i = 0; $i < count($toids); $i++)
			{
				$to = $toids[$i];				
				if($to[0] == '@')
				{
					$staff = Staff::where('personalhashtag', $to)->select('staff_id', 'email')->where('status', 0)->get();
					if($staff)
					{
						$emailids[] = $staff[0]->email;
						$msgto = $staff[0]->staff_id;
						
						DB::table('messagesinbox')->insert(['messages_id' => $messageid, 'sender_id' => $loginid, 'reciver_id' => $msgto, 'messages_subject' => $subject, 'messagesinbox_date' => $current_datetime, 'messagesinbox_priority' => $important, 'messages_isreply' => $isreply, 'timezone' => $timezonename]);
						
						$notifycontent = 'New Message<br/>by: '.$sendername.'<br/>'.$notcontent;
						
						DB::table('pushnotifications')->insert(['notify_subject' => $subject, 'notify_by' => $loginid, 'notify_to' => $msgto, 'notify_type' => 'M', 'table_id' => $messageid, 'notify_content' => $notifycontent]);
					}
				}
				else
				{
					$emailids[] = $to;
				}
			}
			
			if($emailids)
			{				
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);
		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridec.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '');
					$m->subject($data['subject']);	
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
				});
			}
		}
		
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Message sent successfully'));			
			return response()->json(['msg' => $msg]);
		}
		else {
			if($chkreply == "Reply") {
				$session->getFlashBag()->add('reply_sent','Reply Message Sent Successfully');
			}
			else {
				$session->getFlashBag()->add('forward_sent','Forward Message Sent Successfully');
			}
			return redirect('/messages');
		}
	}

	/**
	* Show the form for editing the specified resource.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function edit($id)
	{
	//
	}

	/**
	* Update the specified resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function update(Request $request, $id)
	{
	//
	}

	/**
	* Remove the specified resource from storage.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function destroy($id)
	{
		//
	}
	
	public function delete($id, $frompage)
	{
		$session = new Session();		
		$loginid = $session->get('ses_login_id');
		
		if($frompage == 'inbox') {
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $id)->delete();
			return redirect('/messages');
		}
		else {
			DB::table('messages')->where('messages_id', $id)->where('sender_id', $loginid)->update(['messages_status' => '1']);
			return redirect('/sentitems');
		}	
	}

	public function composemailattachments(Request $request)
	{
		$microtime = $request->microtimestamp;
		$isphotos = $request->isphotos;
		if (!empty($_FILES)) 
		{						
			$file = Input::file('file');
			//$destinationPath = public_path().'/attachments/'.$foldername;	
			$destinationPath = public_path().'/attachments/';		
			$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
			$filename = $timestamp."_123_".$file->getClientOriginalName();
			$filesize = $file->getClientSize();
			$upload_success = Input::file('file')->move($destinationPath, $filename);			
			if( $upload_success ) {	
				$tmpsize = $filesize;
				if($filesize > 1048576) { // MB (1024 * 1024)
					$tmpsize = round(($filesize / 1048576), 2)." MB";
				} else if($filesize > 1024) {
					$tmpsize = round(($filesize / 1024), 2)." KB";
				} else {
					$tmpsize = $filesize." B";
				}
				if($isphotos == 0)	
					DB::table('attachments')->insert(['attachment' => $filename, 'microtimestamp' => $microtime, 'isfiles' => '1', 'filesizetotal_int' => $filesize, 'filesize_int' => $filesize, 'attach_filesize' => $filesize, 'filesize_kb' => $tmpsize, 'filesizetotal_kb' => $tmpsize]);	
				else
					DB::table('attachments')->insert(['attachment' => $filename, 'microtimestamp' => $microtime, 'isphotos' => '1', 'filesizetotal_int' => $filesize, 'filesize_int' => $filesize, 'attach_filesize' => $filesize, 'filesize_kb' => $tmpsize, 'filesizetotal_kb' => $tmpsize]);				
				return Response::json('success', 200);
			} else {
			   	return Response::json('error', 400);
			}
		} 
	}
	
	public function clearexistingattachments(Request $request)
	{
		$microtime = $request->microtime;
		$type = $request->type;
		if($type == 'photos')
		{
			DB::table('attachments')->where('microtimestamp', $microtime)->where('isphotos', '1')->delete();
		}
		else
		{
			DB::table('attachments')->where('microtimestamp', $microtime)->where('isfiles', '1')->delete();
		}
		//echo 'Cleared';
	}

	public function getcomposeimages(Request $request)
	{
		$result = '';
		$microtime = $request->microtime;
		$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->where('isphotos', '1')->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$result[] = $attachment->attachment;
				DB::table('attachments')->where('attachment_id', $attachment->attachment_id)->delete();
			}
			if($result)
			{
				$result = @implode('#|#', $result);
			}
		}
		echo $result;
	}

	public function getcomposefiles(Request $request)
	{
		$result = '';
		$microtime = $request->microtime;
		$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->where('isfiles', '1')->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$result[] = $attachment->attachment_id.'-#-'.$attachment->attachment;
			}
			if($result)
			{
				$result = @implode('#|#', $result);
			}
		}
		echo $result;
	}

	public function removeattachfile(Request $request)
	{
		$result = '';
		$microtime = $request->microtime;
		$fileid = $request->fileid;
		
		DB::table('attachments')->where('attachment_id', $fileid)->delete();
		$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->where('isfiles', '1')->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$result[] = $attachment->attachment_id.'-#-'.$attachment->attachment;
			}
			if($result)
			{
				$result = @implode('#|#', $result);
			}
		}
		
		echo $result;
	}

	public function actions(Request $request)
	{
		$session = new Session();
		if($request->is_mobile == 1) {
			$loginid = $request->ses_login_id;			
			//$decodedarr = json_decode($request->messageids,true);
			//$messageids = array_column($decodedarr,'id');
			$messageids = $request->messageids;
			if($messageids) { $messageids = [$messageids]; }
		}
		else {
			$loginid = $session->get('ses_login_id');
			$messageids = $request->messageids;			 
		}
		$frompage = $request->frompage;
		
		$action = $request->actions;
		
		if($messageids)
		{
			if($action == 'Delete')
			{
				
				if($frompage == 'inbox') {
					DB::table('messagesinbox')->where('reciver_id', $loginid)->whereIn('messages_id', $messageids)->delete();
					$msg = array(array('Error' => '0','result'=>'Message deleted successfully'));
					return response()->json(['msg'=>$msg]);
				}
				else
				{
					DB::table('messages')->where('sender_id', $loginid)->whereIn('messages_id', $messageids)->update(['messages_status'=>'1']);
					$msg = array(array('Error' => '0','result'=>'Message deleted successfully'));
					return response()->json(['msg'=>$msg]);
				}
			}
			else {
				DB::table('messagesinbox')->whereIn('messages_id', $messageids)->update(['messagesinbox_status' => '0']);
				if($request->is_mobile == 1) {
					$msg = array(array('Error' => '0','result'=>'Message status changed to Unread successfully'));
					return response()->json(['msg'=>$msg]);
				}
			}				
			
			if($frompage == 'inbox') {
				
				return redirect('/messages');
			}				
			else
				return redirect('/sentitems');			
		}
	}
// Inbox Favorit- Start
	public function setfavorite(Request $request)
	{
		$favstatus = '';
		$favmsg='';
		$ismobile = $request->is_mobile;
		$messageid = $request->messageid;
		if($ismobile == 1)
		{
			$loginid = $request->loginid;
		}
		else
		{
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$chkexist = DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->where('messagesinbox_isfavaurite', '1')->get();
		if(count($chkexist) > 0)
		{
			$favstatus = 'unfav';
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->update(['messagesinbox_isfavaurite' => '0']);
		}
		else
		{
			$favstatus = 'fav';
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->update(['messagesinbox_isfavaurite' => '1']);
		}

		if($ismobile == 1)
		{
			$messagelist = DB::table('messagesinbox')->where('reciver_id', $loginid)->orderBy('messages_id', 'desc')->get();
			$messages = '';
			if($messagelist)
			{
				$i = 0;
				foreach($messagelist as $message)
				{
					$messageinbox = DB::table('messages')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_bodyhtml'] = $messageinbox[0]->messages_body;				
					$messages[$i]['message_date'] = $messageinbox[0]->messages_date;
					$messages[$i]['message_date_mobileview'] = date('d/m/Y H:i A',strtotime($messageinbox[0]->messages_date));
					
					$messages[$i]['is_favorite'] = $message->messagesinbox_isfavaurite;
					$messages[$i]['message_readstatus'] = $message->messagesinbox_status;
					$messages[$i]['message_priority'] = $message->messagesinbox_priority;
					$messages[$i]['isreply'] = $message->messages_isreply;
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo')->get();
					if($sender)
					{
						$messages[$i]['sendername'] = $sender[0]->firstname;
						$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
					}
					else
					{
						$messages[$i]['sendername'] = '';
						$messages[$i]['senderphoto'] = '';
					}
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;
					++$i;
				}
			}
			if($favstatus=='fav'){
				$favmsg='Favourite successfully';
			}else{
				$favmsg='Unfavourited successfully';
			}
			return response()->json(['msg' => array('result' => $favmsg), 'totalCount' =>$messagelist->count(), 'messages' => $messages]);			
		}
		else
			echo $favstatus;
	}
	// Inbox Favorite  - End


	// Send Item Favorie - Start
	public function setsenditemfavorite(Request $request)
	{
		$favstatus = '';
		$favmsg='';
		$ismobile = $request->is_mobile;
		$messageid = $request->messageid;
		if($ismobile == 1)
		{
			$loginid = $request->loginid;
		}
		else
		{
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$chkexist = DB::table('messages')->where('sender_id', $loginid)->where('messages_id', $messageid)->where('messages_isfavaurite', '1')->get();
		if(count($chkexist) > 0)
		{
			$favstatus = 'unfav';
			DB::table('messages')->where('sender_id', $loginid)->where('messages_id', $messageid)->update(['messages_isfavaurite' => '0']);
		}
		else
		{
			$favstatus = 'fav';
			DB::table('messages')->where('sender_id', $loginid)->where('messages_id', $messageid)->update(['messages_isfavaurite' => '1']);
		}

		if($ismobile == 1)
		{
			$messagelist = DB::table('messages')->where('sender_id', $loginid)->orderBy('messages_id', 'desc')->get();
			$messages = '';
			if($messagelist)
			{
				$i = 0;
				foreach($messagelist as $message)
				{
					$messageinbox = DB::table('messages')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_bodyhtml'] = $messageinbox[0]->messages_body;
					$messages[$i]['message_date'] = $messageinbox[0]->messages_date;
					$messages[$i]['message_date_mobileview'] = date('d/m/Y H:i A',strtotime($messageinbox[0]->messages_date));
					
					$messages[$i]['messages_isfavaurite'] = $message->messages_isfavaurite;
					//$messages[$i]['message_readstatus'] = $message->messagesinbox_status;
					//$messages[$i]['message_priority'] = $message->messagesinbox_priority;
					//$messages[$i]['isreply'] = $message->messages_isreply;
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo')->get();
					if($sender)
					{
						$messages[$i]['sendername'] = $sender[0]->firstname;
						$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
					}
					else
					{
						$messages[$i]['sendername'] = '';
						$messages[$i]['senderphoto'] = '';
					}
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;
					++$i;
				}
			}
			if($favstatus=='fav'){
				$favmsg='Favourite successfully';
			}else{
				$favmsg='Unfavourited successfully';
			}
			return response()->json(['msg' => array('result' =>$favmsg), 'totalCount' =>$messagelist->count(), 'messages' => $messages]);			
		}
		else
			echo $favstatus;
	}
	// Send Item Favorit - End

	public function messagefavorite(Request $request)
	{
		$favstatus = '';
		$favmsg='';
		$ismobile = $request->is_mobile;
		$messageid = $request->messageid;
		if($ismobile == 1)
		{
			$loginid = $request->loginid;
		}
		else
		{
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$chkexist = DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->where('messagesinbox_isfavaurite', '1')->get();
		if(count($chkexist) > 0)
		{
			$favstatus = 'unfav';
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->update(['messagesinbox_isfavaurite' => '0']);
		}
		else
		{
			$favstatus = 'fav';
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->update(['messagesinbox_isfavaurite' => '1']);
		}

		if($favstatus=='fav'){
			$favmsg='Favourite successfully';
		}else{
			$favmsg='Unfavourited successfully';
		}

			return response()->json(['msg' => array('result' => $favmsg), 'favstatus' => $favstatus]);			
		
	}


// Indivitual Sent Item Favorite
	public function sendmessagefavorite(Request $request)
	{
		$favstatus = '';
		$favmsg='';
		$ismobile = $request->is_mobile;
		$messageid = $request->messageid;
		if($ismobile == 1)
		{
			$loginid = $request->loginid;
		}
		else
		{
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$chkexist = DB::table('messages')->where('sender_id', $loginid)->where('messages_id', $messageid)->where('messages_isfavaurite', '1')->get();
		if(count($chkexist) > 0)
		{
			$favstatus = 'unfav';
			DB::table('messages')->where('sender_id', $loginid)->where('messages_id', $messageid)->update(['messages_isfavaurite' => '0']);
		}
		else
		{
			$favstatus = 'fav';
			DB::table('messages')->where('sender_id', $loginid)->where('messages_id', $messageid)->update(['messages_isfavaurite' => '1']);
		}

		if($favstatus=='fav'){
			$favmsg='Favourite successfully';
		}else{
			$favmsg='Unfavourited successfully';
		}

			return response()->json(['msg' => array('result' => $favmsg), 'favstatus' => $favstatus]);			
		
	}
	
	//Api
	function changereadunread(Request $request) {
		if($request->frompage == 'inbox') {
			$checkexists = DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('reciver_id',$request->ses_login_id)->count();
			if($checkexists > 0) {			
				DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('reciver_id',$request->ses_login_id)->update(['messagesinbox_status' => '1']);	
				return response()->json(['msg'=>array(array('Error' => '0','result'=>'Message changed to Read'))]);
			}
			else {
				
				return response()->json(['msg'=>array(array('Error' => '1'))]);
			}

		}
		else {

			$checkexists = DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('sender_id',$request->ses_login_id)->count();
			if($checkexists > 0) {
			
				DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('sender_id',$request->ses_login_id)->update(['messagesinbox_status' => '1']);	
				return response()->json(['msg'=>array(array('Error' => '0','result'=>'Message changed to Read in sent items'))]);
			}
			else {
				return response()->json(['msg'=>array(array('Error' => '1'))]);
			}


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
	
	public function getmessagedetails(Request $request) {
		$timezone = new Timezone;
		$loginid = $request->loginid;
		$messagelist = DB::table('messagesinbox')->where('messages_id', $request->messageid)->get();
		$inboxcount = DB::table('messagesinbox')->where('messages_id', $request->messageid)->count();
		if(count($messagelist) <= 0) {
			$messagelist = DB::table('messages')->where('messages_id', $request->messageid)->get();
		}
		$mtime = $request->micro_timestamp;
		$messages = $replyall = '';		
			if(count($messagelist) > 0)
			{
				$i = 0;
				foreach($messagelist as $message)
				{
					$receivernames = '';
					$messageinbox = DB::table('messages')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_body_html'] =  strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_date'] = date('d M Y h:i A',strtotime( $messageinbox[0]->messages_date));
					if( $request->input('timezoneoffset')){							
							$messages[$i]['message_date_mobileview']  = $timezone->convertUTCtoDate($messageinbox[0]->messages_date,$request->input('timezoneoffset'));			
						}else{
							$messages[$i]['message_date_mobileview'] = date('d/m/Y h:i A',strtotime( $messageinbox[0]->messages_date));
						}
					
					if($inboxcount > 0) {
						$messages[$i]['is_favorite'] = $message->messagesinbox_isfavaurite;
						$messages[$i]['message_readstatus'] = $message->messagesinbox_status;
						$messages[$i]['message_priority'] = $message->messagesinbox_priority;
						if($message->messagesinbox_priority == 1) {
							$messages[$i]['priority_image'] = "arrow_active_low.png";
						} else if($message->messagesinbox_priority == 2) {
							$messages[$i]['priority_image'] = "arrow_active_high.png";
						} else {
							$messages[$i]['priority_image'] = "";
						}
						$messages[$i]['isreply'] = $message->messages_isreply;
					} else {
						$messages[$i]['is_favorite'] = $messageinbox[0]->messages_isfavaurite;
						$messages[$i]['message_readstatus'] = $messageinbox[0]->messages_status;
						$messages[$i]['message_priority'] = $messageinbox[0]->message_priority;
						if($message->message_priority == 1) {
							$messages[$i]['priority_image'] = "arrow_active_low.png";
						} else if($message->message_priority == 2) {
							$messages[$i]['priority_image'] = "arrow_active_high.png";
						} else {
							$messages[$i]['priority_image'] = "";
						}
						$messages[$i]['isreply'] = 0;
					}
					
					$messages[$i]['time_ago'] = $this->time_elapsed_string($messageinbox[0]->messages_date);
					
					
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo','personalhashtag')->get();

					if(count($sender) > 0)
					{
						$messages[$i]['personalhashtag'] = $sender[0]->personalhashtag;
					}
					else
					{
						$messages[$i]['personalhashtag'] = '';
					}
					$receivernames = $receiversphoto= $directemails = $receiverids = '';
					$receivers = DB::table('messagesinbox')->where('messages_id', $message->messages_id)->get();

					if($receivers)
					{

						foreach($receivers as $receiver)
						{
							$staff = Staff::where('staff_id',$receiver->reciver_id)->select('firstname', 'lastname', 'photo', 'personalhashtag')->get();
							if($staff) { 
								$receivernames[] = $staff[0]->firstname.' '.$staff[0]->lastname; 
								$receiverids[] = $staff[0]->personalhashtag; 
								$receiversphoto[]=$staff[0]->photo; 
								if($receiver->reciver_id != $loginid) {
									$replyall[] = $staff[0]->personalhashtag;
								}
							} else{ $receiversphoto[]='';}
						}
					}
					
					
					
					if($message->reciver_id)
					{
						$tmpids = @explode(' ', $message->reciver_id);
						if($tmpids)
						{
							foreach($tmpids as $tmpid)
							{
								if($tmpid[0] != "@") { 
									//$receivernames[] = $tmpid;
								 } // Kannan hide for Uninitialized string offset: 0 in MessageController.php (line 241) 01-12-2017
							}
						}
					}
					if($receivernames) { 
						$receivernames = @implode(' ', $receivernames);
						if(strlen($receivernames) > 50) { $receivernames = substr($receivernames, 0, 50).'..'; }
						//$messages[$i]['receiver_id']   = '@'.$receivernames;
						if($receiverids)
							$messages[$i]['receiver_id'] = @implode(' ', $receiverids);
						else
							$messages[$i]['receiver_id'] = '';
						$messages[$i]['receiver_name'] = $receivernames;
						
						if($receiversphoto !=''){

                         			if($receiversphoto[0] == '' || $receiversphoto[0] == 'undefined' || $receiversphoto[0] == 'null') {
							$messages[$i]['recipient_photo'] = url('/') . '/images/default.png';
								
						}
						else {
							$messages[$i]['recipient_photo'] = url('/').'/staffphotos/'.$receiversphoto[0];
							
						}


					    	}  // only photo of first recipient 
					}
					else {
						$messages[$i]['receiver_id'] = '';
						$messages[$i]['receiver_name'] = url('/') . '/images/default.png';
						$messages[$i]['recipient_photo'] = url('/') . '/images/default.png';
					}
					if(count($sender) > 0) {
						$messages[$i]['sendername'] = $sender[0]->firstname;
						$replyall[] = $sender[0]->personalhashtag;
						if($sender[0]->photo != '' && $sender[0]->photo != 'NULL') {
							$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
							
						} else {
							$messages[$i]['senderphoto'] = url('/') . '/images/default.png';
						
						}
					} else {
						$messages[$i]['sendername'] = '';
					}
					if($replyall && is_array($replyall)) {
						$messages[$i]['replyall'] = @implode(' ', $replyall);
					} else {
						$messages[$i]['replyall'] = '';
					}
					$attachs = $filesizes = $resourceids =$oldnew='';
					$totalfilesize = $totalfsize = 0;
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					
					if(count($attachments) > 0)
					{
						foreach($attachments as $attachment)	
						{
							
							$attachs[] = $attachment->messageresource_filename;
							$oldnew[] = $attachment->old_new;
							$resourceids[] = $attachment->messageresource_id;
							$tmpsize = $attachment->attchment_filesize;
							if($tmpsize > 0) {
								if($tmpsize > 1048576) { // MB (1024 * 1024)
									$tmpsize = round(($tmpsize / 1048576), 2)." MB";
								} else if($tmpsize > 1024) {
									$tmpsize = round(($tmpsize / 1024), 2)." KB";
								} else {
									$tmpsize = $tmpsize." B";
								}	
							}							
							$filesizes[] = $tmpsize;
							$totalfilesize = $totalfilesize + $attachment->attchment_filesize;
						}						
							
					}					

					$attches = DB::table('attachments')->where('microtimestamp', $mtime)->get();

					if(count($attches) > 0)
					{
						foreach($attches as $attachment)
						{
							
							$filesizes[] = $attachment->filesize_kb;
							$totalfilesize = $totalfilesize + $attachment->attach_filesize;
							$oldnew[] = $attachment->old_new;

						}						
							
					}

					if($attachs)
						$attachs = @implode('#', $attachs);
					if($filesizes)
						$filesizes = @implode("#", $filesizes);
					if($resourceids)
						$resourceids = @implode("#", $resourceids);				
					if($oldnew)
						$oldnew = @implode("#", $oldnew);
					$tmpkb = $tmbk = $actfilesize = $tmpfilesize = 0;
					if($totalfilesize > 0) {
						if($totalfilesize > 1048576) { // MB (1024 * 1024)						
							$actfilesize = round(($totalfilesize / 1048576), 2)." MB";
						} else if($totalfilesize > 1024) {
							$actfilesize = round(($totalfilesize / 1024), 2)." KB";
						} else {
							$actfilesize = $totalfilesize." B";
						}					
						$totalfilesize = $actfilesize;
					}

					$messages[$i]['attachments'] = $attachs;
					$messages[$i]['resourceids'] = $resourceids;					
					$messages[$i]['filesizes'] = $filesizes;
					$messages[$i]['totalfilesize'] = $totalfilesize;
					$messages[$i]['totalfilesize'] = $totalfilesize;
					$messages[$i]['old_new'] = $oldnew;
					++$i;
				}
			} else {
				$attachs = $filesizes = $resourceids=$oldnew='';
				$totalfilesize = $totalfsize = 0;
				$attches = DB::table('attachments')->where('microtimestamp', $mtime)->get();
				if(count($attches) > 0)
				{
					$dummy = [];
					foreach($attches as $attachment)
					{
						$tmpattachfilesize = 0;
						$attachs[] = $attachment->attachment;
						$resourceids[] = $attachment->attachment_id;
						$oldnew[] = $attachment->old_new;
						//$totalfsize = $attachment->attach_filesize;
						$totalfsize = $attachment->filesize_kb;
						$tmpkb = $tmbk = $actfsize = $tmpfsize = 0;
						
						$filesizes[] = $totalfsize;
						$totalfilesize = $totalfilesize + $attachment->attach_filesize;
						
					}						
						
				}

				if($attachs)
					$attachs = @implode('#', $attachs);
				if($filesizes)
					$filesizes = @implode("#", $filesizes);
				if($resourceids)
					$resourceids = @implode("#", $resourceids);
				if($oldnew)
					$oldnew = @implode("#", $oldnew);
					
				$tmpkb = $tmbk = $actfilesize = $tmpfilesize = 0;
				if($totalfilesize > 0) {
					if($totalfilesize > 1048576) { // MB (1024 * 1024)						
						$actfilesize = round(($totalfilesize / 1048576), 2)." MB";
					} else if($totalfilesize > 1024) {
						$actfilesize = round(($totalfilesize / 1024), 2)." KB";
					} else {
						$actfilesize = $totalfilesize." B";
					}					
					$totalfilesize = $actfilesize;
				}

				$messages[0]['attachments'] = $attachs;
				$messages[0]['resourceids'] = $resourceids;	
				//$messages[0]['filetype'] =$attachment->filetype;					
				$messages[0]['filesizes'] = $filesizes;
				$messages[0]['totalfilesize'] = $totalfilesize;
				$messages[0]['old_new'] = $oldnew;
					
			}
			
			return response()->json(['msg' => array('result'=>'success'), 'messages' => $messages]);

	}
	public function removeattachment($resourceid)
	{
		$resources = DB::table('attachments')->where('attachment_id', $resourceid)->get();
		
		//$resources = DB::table('messageattachments')->where('attachment_id', $resourceid)->get();
		if(count($resources) > 0)
		{
			$filename = public_path().'/attachments/'.$resources[0]->attachment;
			DB::table('attachments')->where('attachment_id', $resourceid)->delete();			
			if(file_exists($filename))
				unlink($filename);
		}		
		
	}

	public function chkemailhashtags(Request $request) {
		$invalidusers = '';
		$toaddress = $request->toaddress;
		$ismobile = $request->ismobile;
		$type = $request->type;
		if($toaddress != '' && $type != "textarea") {
			$toarr = @explode(' ', $toaddress);
			for($i = 0; $i < count($toarr); $i++) {
				$hashtag = trim($toarr[$i]);
				if($hashtag[0] == "@") {
					$chkstaff = DB::table('staffs')->where('personalhashtag', $hashtag)->where('status', '0')->get();
					if(count($chkstaff) <= 0) {
						$invalidusers[] = $hashtag;
					}
				} else {
					if($type == "textbox") {
						if(!filter_var($hashtag, FILTER_VALIDATE_EMAIL)) {
							$invalidusers[] = $hashtag;
						}
					}	
				}
			}
		}
		if($invalidusers && is_array($invalidusers)) {
			$invalidusers = @implode(', ', $invalidusers); 
		}
		if($ismobile == 0) {
			echo $invalidusers;
		} else {
			return response()->json(['msg' => array('result'=>'success'), 'invalidusers' => $invalidusers]);
		}
	}
		
	public function onholdmessageaction(Request $request) {
		$messageids = explode(",",$request->messageids);

		
		if( $request->frompage=='inbox'){
			if( $request->actions=='Unread'){
			
				foreach ($messageids as $mid){
					DB::table('messagesinbox')
					->where('messages_id',  $mid)
					->update(['messagesinbox_status' => 1]);
				}
				$msg = array(array('Error' => '0','result'=>'Message status changed to read successfully'));
				return response()->json(['msg'=>$msg]);
			}
			if( $request->actions=='favorite'){
				$ismobile = $request->is_mobile;				
					$loginid = $request->ses_login_id;
				foreach ($messageids as $mid){					
						DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $mid)->update(['messagesinbox_isfavaurite' => '1']);
				}
				$msg = array(array('Error' => '0','result'=>'Favourite successfully'));
				return response()->json(['msg'=>$msg]);
			}

			if( $request->actions=='delete'){		
				$ismobile = $request->is_mobile;				
				$loginid = $request->ses_login_id;
				foreach ($messageids as $mid){	
					DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $mid)->delete();
				}
				$msg = array(array('Error' => '0','result'=>'Message deleted successfully'));
				return response()->json(['msg'=>$msg]);
			}

		}else{
			if( $request->actions=='favorite'){
				$ismobile = $request->is_mobile;
				$loginid = $request->ses_login_id;
				foreach ($messageids as $mid){					
					DB::table('messages')->where('sender_id', $loginid)->where('messages_id', $mid)->update(['messages_isfavaurite' => '1']);
				}
				$msg = array(array('Error' => '0','result'=>'Favourite successfully'));
				return response()->json(['msg'=>$msg]);
			}			
		}

	}	
}

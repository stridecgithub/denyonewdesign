<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service;
use App\Alarm;
use App\Staff;
use App\Unit;
use DB;
use Mail;
use App\Timezone;
use Symfony\Component\HttpFoundation\Session\Session;
use Illuminate\Html\HtmlServiceProvider;
use Yajra\Datatables\Html\Builder;
use Symfony\Component\Finder\Finder;
use LaravelFCM\Message\OptionsBuilder;
use LaravelFCM\Message\PayloadDataBuilder;
use LaravelFCM\Message\PayloadNotificationBuilder;
use FCM;

class NotificationController extends Controller {

    public function getnotification(Request $request) {
        $notify = '';
        $userid = $request->userid;

        // service notification  starts		
        $servicenotifications = DB::table('pushnotifications')->where('notify_to', $userid)->where('webstatus', '0')->where('notify_type', 'S')->get();
        if ($servicenotifications) {
            foreach ($servicenotifications as $servicenotification) {
                $unitid = 0;
                $service = Service::where('service_id', $servicenotification->table_id)->select('service_unitid')->get();
                if ($service) {
                    $unitid = $service[0]->service_unitid;
                }
                $message = trim($servicenotification->notify_content);
                $notify[] = $servicenotification->table_id . "||" . $servicenotification->notify_subject . "||" . $message . "||" . $servicenotification->notify_type . "||0||" . $unitid;
                DB::table('pushnotifications')->where('pushnotification_id', $servicenotification->pushnotification_id)->update(array('webstatus' => '1'));
            }
        }
        // service notification  end
        // alarm notification  starts		
        $alarmnotifications = DB::table('pushnotifications')->where('notify_to', $userid)->where('webstatus', '0')->where('notify_type', 'OA')->get();
        if ($alarmnotifications) {
            foreach ($alarmnotifications as $alarmnotification) {
                $unitid = $priority = 0;
                $alarm = Alarm::where('alarm_id', $alarmnotification->table_id)->select('alarm_unit_id', 'alarm_priority')->get();
                if ($alarm) {
                    $unitid = $alarm[0]->alarm_unit_id;
                    $priority = $alarm[0]->alarm_priority;
                }
                $message = trim($alarmnotification->notify_content);
                $notify[] = $alarmnotification->table_id . "||" . $alarmnotification->notify_subject . "||" . $message . "||" . $alarmnotification->notify_type . "||" . $priority . "||" . $unitid;
                DB::table('pushnotifications')->where('pushnotification_id', $alarmnotification->pushnotification_id)->update(array('webstatus' => '1'));
            }
        }

        $alarmnotifications = DB::table('pushnotifications')->where('notify_to', $userid)->where('webstatus', '0')->where('notify_type', 'A')->get();
        if ($alarmnotifications) {
            foreach ($alarmnotifications as $alarmnotification) {
                $unitid = $priority = 0;
                $alarm = Alarm::where('alarm_id', $alarmnotification->table_id)->select('alarm_unit_id', 'alarm_priority')->get();
                if ($alarm) {
                    $unitid = $alarm[0]->alarm_unit_id;
                    $priority = $alarm[0]->alarm_priority;
                }
                $message = trim($alarmnotification->notify_content);
                $notify[] = $alarmnotification->table_id . "||" . $alarmnotification->notify_subject . "||" . $message . "||" . $alarmnotification->notify_type . "||" . $priority . "||" . $unitid;
                DB::table('pushnotifications')->where('pushnotification_id', $alarmnotification->pushnotification_id)->update(array('webstatus' => '1'));
            }
        }
        // alarm notification  end
        // comment notification  starts		
        $commentnotifications = DB::table('pushnotifications')->where('notify_to', $userid)->where('webstatus', '0')->where('notify_type', 'C')->get();
        if ($commentnotifications) {
            foreach ($commentnotifications as $commentnotification) {
                $unitid = 0;
                $comment = DB::table('comments')->where('comment_id', $commentnotification->table_id)->select('comment_unit_id')->get();
                if ($comment) {
                    $unitid = $comment[0]->comment_unit_id;
                }
                $message = trim($commentnotification->notify_content);
                $notify[] = $commentnotification->table_id . "||" . $commentnotification->notify_subject . "||" . $message . "||" . $commentnotification->notify_type . "||0||" . $unitid;
                DB::table('pushnotifications')->where('pushnotification_id', $commentnotification->pushnotification_id)->update(array('webstatus' => '1'));
            }
        }
        // comment notification  end
        // message notification  starts		
        $messagenotifications = DB::table('pushnotifications')->where('notify_to', $userid)->where('webstatus', '0')->where('notify_type', 'M')->get();
        if ($messagenotifications) {
            foreach ($messagenotifications as $messagenotification) {
                $message = trim($messagenotification->notify_content);
                $notify[] = $messagenotification->table_id . "||" . $messagenotification->notify_subject . "||" . $message . "||" . $messagenotification->notify_type . "||0||0";
                DB::table('pushnotifications')->where('pushnotification_id', $messagenotification->pushnotification_id)->update(array('webstatus' => '1'));
            }
        }
        // message notification  end
        // event notification  starts		
        $eventnotifications = DB::table('pushnotifications')->where('notify_to', $userid)->where('webstatus', '0')->where('notify_type', 'E')->get();
        if ($eventnotifications) {
            foreach ($eventnotifications as $eventnotification) {
                $message = trim($eventnotification->notify_content);
                $notify[] = $eventnotification->table_id . "||" . $eventnotification->notify_subject . "||" . $message . "||" . $eventnotification->notify_type . "||0||0";
                DB::table('pushnotifications')->where('pushnotification_id', $eventnotification->pushnotification_id)->update(array('webstatus' => '1'));
            }
        }
        // event notification  end

        if ($notify)
            $notify = @implode("|#|", $notify);

        echo $notify;
    }

    public function sendnotification(Request $request) {
        // send emails
        $notifys = DB::table('notificationemails')->get();
        if ($notifys) {
            foreach ($notifys as $notify) {
                $subject = $notify->notification_subject;
                $toemails = @explode(",", $notify->notification_email);
                $content = $notify->notification_content;
                $data = array('replytoemail' => 'cip@stridececommerce.com', 'subject' => $subject, 'content' => $content);
                Mail::send('emails.service', $data, function ($m) use ($data, $toemails) {
                    $m->from('cip@stridececommerce.com', 'Denyo');
                    $m->replyTo($data['replytoemail'], $name = null);
                    $m->bcc('balamurugan@webneo.in', 'bala');
                    $m->to($toemails, '')->subject($data['subject']);
                });

                DB::table('notificationemails')->where('notification_email_id', $notify->notification_email_id)->delete();
            }
        }
    }

    public function time_elapsed_string($datetime, $full = false) {
        $now = new \DateTime;
        $ago = new \DateTime($datetime);
      //print_r($now);

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

        if (!$full)
            $string = array_slice($string, 0, 1);
        return $string ? implode(', ', $string) . ' ago' : 'just now';
    }

    /*
      public function getpushnotification_app(Request $request) {
      //
      $ses_login_id = $request->ses_login_id;
      if ($ses_login_id) {
      $username = DB::table('staffs')->where('staff_id', $ses_login_id)->select('firstname', 'lastname', 'photo')->get();
      //bell
      $unreadnotification = DB::table('pushnotifications')->where('notify_to', $ses_login_id)->orderBy('pushnotification_id', 'desc')->get();
      $notifynew = DB::table('pushnotifications')->where('notify_to', $ses_login_id)->where('notify_status', 0)->select('notify_status')->count();
      }

      if ($ses_login_id) {
      if (count($username) > 0) {
      //echo $username[0]->firstname;
      }
      }
      $url = '';
      $i   = 0;

      if (count($unreadnotification) > 0) {
      foreach ($unreadnotification as $notify) {
      $usericon = DB::table('staffs')->where('staff_id', $notify->notify_by)->select('photo')->get();
      $notificationArr[$i]['content'] = $notify->notify_content;
      $notificationArr[$i]['table_id'] = $notify->table_id;
      $notificationArr[$i]['notify_type'] = $notify->notify_type;
      if($notify->notify_by != '0') {
      $notifybyuser = DB::table('staffs')->where('staff_id',$notify->notify_by)->get();
      if(count($notifybyuser) > 0) {
      $notificationArr[$i]['notify_by_name'] = $notifybyuser[0]->firstname;
      if($notifybyuser[0]->photo != '') {
      $userimg = public_path().'/staffphotos/'.$notifybyuser[0]->photo;
      if(is_file($userimg)) {
      $notificationArr[$i]['usericon'] = $notifybyuser[0]->photo;
      }
      else {
      $notificationArr[$i]['usericon'] = '';
      }
      }
      }
      else {
      $notificationArr[$i]['notify_by_name'] = '';
      }
      }
      else {
      $notificationArr[$i]['usericon'] = '';
      }
      if ($notify->notify_type == 'OA') {
      $datetime = DB::table('alarms')->where('alarm_id', $notify->table_id)->select('alarm_received_date','alarm_unit_id')->get();

      if (count($datetime) > 0) {
      $units = Unit::where('unit_id',$datetime[0]->alarm_unit_id)->where('deletestatus',0)->get();
      if(count($units) > 0) {
      $notificationArr[$i]['date_time'] = date('d M Y',strtotime($datetime[0]->alarm_received_date));
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string($datetime[0]->alarm_received_date);

      $unreadservices = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_to', $ses_login_id)->where('notify_type', 'OA')->select('notify_to_readstatus')->get();

      if (count($unreadservices) > 0) {
      $notificationArr[$i]['notify_to_readstatus'] = $unreadservices[0]->notify_to_readstatus;
      }
      }
      else {
      $notificationArr[$i]['date_time'] = date('d M Y');
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string(date('d M Y'));
      }

      }
      else {
      $notificationArr[$i]['date_time'] = date('d M Y');
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string(date('d M Y'));
      }
      }

      if ($notify->notify_type == 'A') {
      $datetime = DB::table('alarms')->where('alarm_id', $notify->table_id)->where('alarm_status',0)->select('alarm_received_date','alarm_unit_id')->get();

      if (count($datetime) > 0) {
      $units = Unit::where('unit_id',$datetime[0]->alarm_unit_id)->where('deletestatus',0)->get();
      if(count($units) > 0) {
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string($datetime[0]->alarm_received_date);
      $notificationArr[$i]['date_time'] = date('d M Y',strtotime($datetime[0]->alarm_received_date));
      $unreadservices = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_to', $ses_login_id)->where('notify_type', 'A')->select('notify_to_readstatus')->get();

      if (count($unreadservices) > 0) {
      $notificationArr[$i]['notify_to_readstatus'] = $unreadservices[0]->notify_to_readstatus;
      }
      }
      else {
      $notificationArr[$i]['date_time'] = date('d M Y');
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string(date('d M Y'));
      }

      }
      else {
      $notificationArr[$i]['date_time'] = date('d M Y');
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string(date('d M Y'));
      }
      }

      if ($notify->notify_type == 'S') {
      $datetime = DB::table('services')->where('service_id', $notify->table_id)->select('current_datetime')->get();
      if (count($datetime) > 0) {
      $notificationArr[$i]['date_time'] = date('d M Y',strtotime($datetime[0]->current_datetime));
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string($datetime[0]->current_datetime);
      }
      $unreadservices = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_to', $ses_login_id)->where('notify_type', 'S')->select('notify_to_readstatus')->get();

      if (count($unreadservices) > 0) {
      $notificationArr[$i]['notify_to_readstatus'] = $unreadservices[0]->notify_to_readstatus;
      }
      }

      if ($notify->notify_type == 'M') {
      $unreadmsg = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_to', $ses_login_id)->where('notify_type', 'M')->select('notify_to_readstatus')->get();

      if (count($unreadmsg) > 0) {
      $notificationArr[$i]['notify_to_readstatus'] = $unreadmsg[0]->notify_to_readstatus;
      }
      // $messages = DB::table('messagesinbox')->where('messages_id', $notify->table_id)->get();
      // if (count($messages) > 0) {
      // $notificationArr[$i]['timesince'] = $this->time_elapsed_string($messages[0]->messagesinbox_date);
      // }
      //
      $messageinboxdata = DB::table('messagesinbox')->where('messages_id',$notify->table_id)->get();

      $messagedata = DB::table('messages')->where('messages_id',$notify->table_id)->get();
      if(count($messagedata) > 0 && count($messageinboxdata) > 0)
      {
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string($messagedata[0]->messages_date);
      $notificationArr[$i]['date_time'] = date('d M Y',strtotime($messagedata[0]->messages_date));
      }
      else {
      $notificationArr[$i]['timesince'] = '';
      $notificationArr[$i]['date_time'] = '';
      }
      //
      }
      if ($notify->notify_type == 'C') {
      $unreadcomm = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_to', $ses_login_id)->where('notify_type', 'C')->select('notify_to_readstatus')->get();

      if (count($unreadcomm) > 0) {
      $notificationArr[$i]['notify_to_readstatus'] = $unreadcomm[0]->notify_to_readstatus;

      }
      $commentsdata = DB::table('eventorcomments')->where('type_table_id', $notify->table_id)->get();
      if (count($commentsdata) > 0) {
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string($commentsdata[0]->dateandtime);
      $notificationArr[$i]['date_time'] = date('d M Y',strtotime($commentsdata[0]->dateandtime));
      }
      }
      if ($notify->notify_type == 'E') {
      $unreadevents = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_to', $ses_login_id)->where('notify_type', 'E')->select('notify_to_readstatus')->get();

      if (count($unreadevents) > 0) {
      $notificationArr[$i]['notify_to_readstatus'] = $unreadevents[0]->notify_to_readstatus;
      }

      $eventsdata = DB::table('events')->where('event_id',$notify->table_id)->get();
      if(count($eventsdata) > 0) {
      $notificationArr[$i]['timesince'] = $this->time_elapsed_string($eventsdata[0]->event_date);
      $notificationArr[$i]['date_time'] = date('d M Y',strtotime($eventsdata[0]->event_date));
      //$notificationArr[$i]['event_time'] = date('d M Y',strtotime($eventsdata[0]->event_time));

      //$url = 'comments/'.$notify->table_id.'-comment-'.$commentsdata[0]->event_unit_id;
      }
      else {
      $notificationArr[$i]['timesince'] = '';
      $notificationArr[$i]['date_time'] = '';
      }
      }


      ++$i;
      }
      }
      //
      return response()->json(['msg' => array('result' => 'success'), 'notification' => $notificationArr]);

      //return response()->json(['msg' => array(array('Error'=>'1','result'=>'No notification'))]);
      }
     */

    //bell notification data	
    public function getpushnotification_app(Request $request) {

        $timezone = new Timezone;

		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			date_default_timezone_set($timezonename);
		}else{
			$timezonename='Asia/Singapore';
			date_default_timezone_set($timezonename);
        }
        
        $ses_login_id = $request->ses_login_id;

        $notification = DB::table('pushnotifications')->where('notify_to', $ses_login_id)->orderBy('pushnotification_id', 'desc')->get();
	
        //$unreadnotification = DB::table('pushnotifications')->where('notify_to', $ses_login_id)->where('notify_to_readstatus', 0)->orderBy('pushnotification_id', 'desc')->get();
	$content = '';
        $notificationArr = array();
        if (count($notification) > 0) {
            $i = 0;
            foreach ($notification as $notify) {
				
                $content = '';
		$notifyby = '';
                $pushstatus = 'NO';

		if($notify->notify_by > 0) {
			$sender = DB::table('staffs')->where('staff_id', $notify->notify_by)->get();
			if(count($sender) > 0) {
				$notifyby = "<b>".$sender[0]->firstname." ".$sender[0]->lastname."</b> send you a message.";
			}
		}

                if ($notify->notify_type == 'OA') {
                    $url = 'alarmlog/' . $notify->table_id . '/edit';
                    $datetime = DB::table('alarms')->where('alarm_id', $notify->table_id)->get();
                    if (count($datetime) > 0) {
			
				$pushstatus = 'YES';
		                $units = Unit::where('unit_id', $datetime[0]->alarm_unit_id)->where('deletestatus', 0)->get();
		                if (count($units) > 0) {
                            if( $request->input('timezoneoffset')){	
                                $notificationArr[$i]['timesince'] = $timezone->timeago($datetime[0]->alarm_received_date);
                            }else{
                                $notificationArr[$i]['timesince'] = $this->time_elapsed_string($datetime[0]->alarm_received_date);
                            }
                          
                            
		                    $notificationArr[$i]['date_time'] = date('d M Y', strtotime($datetime[0]->alarm_received_date));
				    $content = '<b>'.$units[0]->unitname.'</b> | '.$units[0]->projectname.'<br>'.$datetime[0]->alarm_name;
				    $notificationArr[$i]['priority'] = $datetime[0]->alarm_priority;	
		                } else {
		                    $notificationArr[$i]['timesince'] = '';
		                    $notificationArr[$i]['date_time'] = '';
				    $content = '';
				    $notificationArr[$i]['priority'] = 0;
		                }
			
                    } else {
                        $notificationArr[$i]['timesince'] = '';
                        $notificationArr[$i]['date_time'] = '';
			$content = '';
			$notificationArr[$i]['priority'] = 0;
                    }
                }

		if ($notify->notify_type == 'A') {
                    $url = 'alarmlog/' . $notify->table_id . '/edit';
                    $datetime = DB::table('alarms')->where('alarm_id', $notify->table_id)->get();
                    if (count($datetime) > 0) {
			
				$pushstatus = 'YES';
				$assignedby = '';
		                $units = Unit::where('unit_id', $datetime[0]->alarm_unit_id)->where('deletestatus', 0)->get();
		                if (count($units) > 0) {
				    $alarmassign = DB::table('alarms')->where('alarm_id', $notify->table_id)->get();
				    if(count($alarmassign) > 0) {
					$st = DB::table('staffs')->where('staff_id', $notify->notify_by)->get();
					if(count($st) > 0) {
						$assignedby = $st[0]->firstname.' '.$st[0]->lastname;
					}
				    }
				    if($datetime[0]->alarm_assigned_time != '' && $datetime[0]->alarm_assigned_time != 'NULL'){

                        if( $request->input('timezoneoffset')){	
                            $notificationArr[$i]['timesince'] = $timezone->timeago($datetime[0]->alarm_assigned_time);
                        }else{
                            $notificationArr[$i]['timesince'] = $this->time_elapsed_string($datetime[0]->alarm_assigned_time);
                        }
                               
                    }
				    else{
                    $notificationArr[$i]['timesince'] = '';
                    }
		                    $notificationArr[$i]['date_time'] = date('d M Y', strtotime($datetime[0]->alarm_assigned_date));
				    $content = 'Alarm Assigned by '.$assignedby.'<br><b>'.$units[0]->unitname.'</b> | '.$units[0]->projectname.'<br>'.$datetime[0]->alarm_name;
				    $notificationArr[$i]['priority'] = $datetime[0]->alarm_priority;
		                } else {
		                    $notificationArr[$i]['timesince'] = '';
		                    $notificationArr[$i]['date_time'] = '';
				    $content = '';
				    $notificationArr[$i]['priority'] = 0;
		                }
			
                    } else {
                        $notificationArr[$i]['timesince'] = '';
                        $notificationArr[$i]['date_time'] = '';
			$content = '';
			$notificationArr[$i]['priority'] = 0;
                    }
                }

                if ($notify->notify_type == 'S') {
                    $url = 'services/' . $notify->table_id;
                    $datetime = DB::table('services')->where('service_id', $notify->table_id)->select('current_datetime', 'deletestatus', 'service_subject')->get();
		    
                    if (count($datetime) > 0) {
			$notificationArr[$i]['priority'] = 0;
			if($datetime[0]->deletestatus == 0) {
				$pushstatus = 'YES';
				/*$content = $datetime[0]->service_subject;
				if(strlen($content) > 50) {
					$content = substr($content, 0, 50).'...';
				}			
                $content = $notifyby."<br>".$content;	*/
                

                $servicenotifications = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_type', 'S')->get();
        
        //print_r($servicenotifications);
       // $servicenotification[0]->notify_content;
        //exit;
                //if ($servicenotifications) {
            //foreach ($servicenotifications as $servicenotification) {
                $unitid = 0;               
                $message = trim( $servicenotifications[0]->notify_content);
               // $notify[] = $servicenotification->table_id . "||" . $servicenotification->notify_subject . "||" . $message . "||" . $servicenotification->notify_type . "||0||" . $unitid;
              //  DB::table('pushnotifications')->where('pushnotification_id', $servicenotification->pushnotification_id)->update(array('webstatus' => '1'));
            //}
       // }

       $content = $message;
				if(strlen($content) > 50) {
					$content = substr($content, 0, 50).'...';
				}			
                $content = $content;


                if( $request->input('timezoneoffset')){	
		                $notificationArr[$i]['timesince'] = $timezone->timeago($datetime[0]->current_datetime);
                }else{
                    $notificationArr[$i]['timesince'] = $this->time_elapsed_string($datetime[0]->current_datetime);
          
                }
                       
                        $notificationArr[$i]['date_time'] = date('d M Y', strtotime($datetime[0]->current_datetime));
			} else {
				$pushstatus = 'NO';
			}
                    } else {
			$notificationArr[$i]['priority'] = 0;
                        $notificationArr[$i]['timesince'] = '';
                        $notificationArr[$i]['date_time'] = '';
                    }
                }

                if ($notify->notify_type == 'C') {
                    $commentsdata = DB::table('eventorcomments')->join('comments', 'comments.comment_id', '=', 'eventorcomments.type_table_id')->where('eventorcomments.event_type', 'C')->where('eventorcomments.type_table_id', $notify->table_id)->where('comments.comment_status', 0)->get();
		    
                    if (count($commentsdata) > 0) {
			$notificationArr[$i]['priority'] = 0;
            $pushstatus = 'YES';
            
            $servicenotifications = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_type', 'C')->get();
            $content = trim( $servicenotifications[0]->notify_content);

			//$content = $commentsdata[0]->comment_subject;
			if(strlen($content) > 50) {
				$content = substr($content, 0, 50).'...';
			}			
            //$content = $notifyby."<br>".$content;
            
                            if( $request->input('timezoneoffset')){	
                                $notificationArr[$i]['timesince'] = $timezone->timeago($commentsdata[0]->dateandtime);
                            }else{
                                $notificationArr[$i]['timesince'] = $this->time_elapsed_string($commentsdata[0]->dateandtime);
                            }
                        $notificationArr[$i]['date_time'] = date('d M Y', strtotime($commentsdata[0]->dateandtime));

                        $url = 'comments/' . $notify->table_id . '-comment-' . $commentsdata[0]->event_unit_id;
                    } else {
                        $notificationArr[$i]['timesince'] = '';
                        $notificationArr[$i]['date_time'] = '';
			$notificationArr[$i]['priority'] = 0;
                    }
                }
                if ($notify->notify_type == 'M') {

                    $messageinboxdata = DB::table('messagesinbox')->where('messages_id', $notify->table_id)->get();
		    
                    $messagedata = DB::table('messages')->where('messages_id', $notify->table_id)->get();
		    
                    if (count($messagedata) > 0 && count($messageinboxdata) > 0) {
			
			//if($messageinboxdata[0]->messagesinbox_status == 0) {
			$notificationArr[$i]['priority'] = 0;
			$pushstatus = 'YES';
			$content = $messagedata[0]->messages_body;
			if(strlen($content) > 50) {
				$content = substr($content, 0, 50).'...';
			}			
            $content = $notifyby."<br>".$content;
            
                        if( $request->input('timezoneoffset')){	                           
                            $notificationArr[$i]['msgdate']=$messagedata[0]->messages_date;
                            $notificationArr[$i]['timesince'] =$timezone->timeago($messagedata[0]->messages_date); //$this->get_time_ago(strtotime($messagedata[0]->messages_date));
                        }else{
                            $notificationArr[$i]['timesince'] = $this->time_elapsed_string($messagedata[0]->messages_date);
                        }
           

                            $notificationArr[$i]['date_time'] = date('d M Y', strtotime($messagedata[0]->messages_date));

                        $url = 'messages/' . $notify->table_id;
			//}
                    } else {
                        $notificationArr[$i]['timesince'] = '';
                        $notificationArr[$i]['date_time'] = '';
			$notificationArr[$i]['priority'] = 0;
                    }
			
                }

                if ($notify->notify_type == 'E') {
                    $url = 'calendar/';
		    
                    $eventsdata = DB::table('events')->where('event_id', $notify->table_id)->get();
                    if (count($eventsdata) > 0) {
			if($eventsdata[0]->event_deletestatus == 0) {
			$pushstatus = 'YES';
            //$content = $eventsdata[0]->event_title;
            $servicenotifications = DB::table('pushnotifications')->where('table_id', $notify->table_id)->where('notify_type', 'E')->get();
            $content = trim( $servicenotifications[0]->notify_content);

			if(strlen($content) > 50) {
				$content = substr($content, 0, 50).'...';
			}			
           
            
            if( $request->input('timezoneoffset')){	
                $notificationArr[$i]['timesince'] = $timezone->timeago($eventsdata[0]->created_on);
            }else{
                $notificationArr[$i]['timesince'] = $this->time_elapsed_string($eventsdata[0]->created_on);
            }
                       
                        $notificationArr[$i]['date_time'] = date('d M Y', strtotime($eventsdata[0]->event_date));
                        //$notificationArr[$i]['event_time'] = date('d M Y',strtotime($eventsdata[0]->event_time));
                        //$url = 'comments/'.$notify->table_id.'-comment-'.$commentsdata[0]->event_unit_id;
			$notificationArr[$i]['priority'] = 0;
			}
                    } else {
                        $notificationArr[$i]['timesince'] = '';
                        $notificationArr[$i]['date_time'] = '';
			$notificationArr[$i]['priority'] = 0;
                    }
                }


		if($pushstatus == 'YES') {
			$notificationArr[$i]['notify_to_readstatus'] = $notify->notify_to_readstatus;
		        //$notificationArr[$i]['content'] = $notify->notify_content;
			$notificationArr[$i]['content'] = $content;
		        $notificationArr[$i]['table_id'] = $notify->table_id;
		        $notificationArr[$i]['notify_type'] = $notify->notify_type;
		        
		        if ($notify->notify_by != '0') {
		            $notifybyuser = DB::table('staffs')->where('staff_id', $notify->notify_by)->get();
		            if (count($notifybyuser) > 0) {
		                $notificationArr[$i]['notify_by_name'] = $notifybyuser[0]->firstname;
		                if ($notifybyuser[0]->photo != '') {
		                    $userimg = public_path() . '/staffphotos/' . $notifybyuser[0]->photo;
		                    if (is_file($userimg)) {
		                        $notificationArr[$i]['usericon'] = $notifybyuser[0]->photo;
		                    } else {
		                        $notificationArr[$i]['usericon'] = '';
		                    }
		                } else {
					$notificationArr[$i]['usericon'] = '';
				}
		            } else {
		                $notificationArr[$i]['notify_by_name'] = '';
				$notificationArr[$i]['usericon'] = '';
		            }
		        } else {
		            $notificationArr[$i]['usericon'] = '';
			    $notificationArr[$i]['notify_by_name'] = '';
		        }
			++$i;
		}               
            }
		
	    if(count($notificationArr) > 1 || $notificationArr[0]['priority'] != 0 ) {
            	return response()->json(['msg' => array('result' => 'success'), 'notification' => $notificationArr]);
	    } else {
		return response()->json(['msg' => array(array('Error' => '1', 'result' => 'No notification'))]);
	    }
        } else
            return response()->json(['msg' => array(array('Error' => '1', 'result' => 'No notification'))]);
    }

    //api
    public function msgnotifycount(Request $request) {
        $loginid = $request->loginid;
        $msgcount = DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messagesinbox_status', '0')->count();        
	$notifycount = DB::table('pushnotifications')->where('notify_to', $loginid)->where('notify_to_readstatus', '0')->where('notify_status', '0')->count();
        $notifydata = DB::table('pushnotifications')->where('notify_to', $loginid)->get();
        return response()->json(['msg' => array('result' => 'success'), 'msgcount' => $msgcount, 'notifycount' => $notifycount, 'notifydata' => $notifydata]);
    }

    public function changebellnotify(Request $request) {
        $loginid = $request->loginid;
        DB::table('pushnotifications')->where('notify_to', $loginid)->update(['notify_status' => '1']);
        if($request->is_mobile == 1) {
		return response()->json(['msg' => array('result' => 'success'), 'notifycount' => 0]);
	} else {
        	echo 1;
	}
    }


    public function changestatusapibell_list(Request $request) {
        DB::table('pushnotifications')->where('table_id', $request->table_id)
                ->where('notify_to', $request->loginid)->update(['notify_to_readstatus' => '1']);
        return response()->json(['msg' => array('result' => 'success')]);
    }

    // public function servicebyid(Request $request) {
    // print_r($request);
    // }
}

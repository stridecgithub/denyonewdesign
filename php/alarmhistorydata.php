<?php
ini_set('error_reporting', E_ALL);
date_default_timezone_set("Asia/Singapore");
$db_name = 'denyodev1';//'denyoappv2';
$db_user = 'denyodev1';//'denyoappv2';
$db_pass = '51RkC3nQgXlwGyZq';//'RfS4aE4Wxq2daL0D';
$db_host = 'localhost';//'localhost';
$connect_db = new mysqli( $db_host, $db_user, $db_pass, $db_name ); 


$alarms = mysqli_query($connect_db, 'SELECT * FROM alarms WHERE alarm_priority = 0');
//$alarms = mysqli_query($connect_db, 'SELECT * FROM alarms');

if(mysqli_num_rows($alarms)) {
	while($alarmdata = mysqli_fetch_object($alarms)) {
		$alarmname = $alarmdata->alarm_name;
		$actualalarmname = preg_replace('/[^A-Za-z0-9 ><!*]/u','', $alarmname);
		
		$priority = 2;
		if($actualalarmname != '' && $actualalarmname != "*" && $actualalarmname != "??") {
			$alarmname = trim(strtolower(substr($actualalarmname, 0, 3)));
			if($alarmname == "sd" || $alarmname == "eme" || $alarmname == "boc" || $alarmname == "*sd") 			
			{
				$priority = 1;
			} else {
				$priority = 2;
			}
			mysqli_query($connect_db, "UPDATE alarms SET alarm_priority = '".$priority."', alarm_name = '".$alarmdata->alarm_name."' WHERE alarm_id = '".$alarmdata->alarm_id."'");
			
			//store data in comment list
			mysqli_query($connect_db, "INSERT INTO eventorcomments (`event_type`, `type_table_id`, `dateandtime`, `event_unit_id`) VALUES ('A', '".$alarmdata->alarm_id."', '".date("Y-m-d H:i:s")."', '".$alarmdata->alarm_unit_id."')");	

			//store data in notification list
							
			// get notify content for send push notifications
			$notifycontent = $emailcontent = '';
			$unitres = mysqli_query($connect_db, "SELECT * FROM units WHERE unit_id = '".$alarmdata->alarm_unit_id."' AND deletestatus = '0'");
			
			$unitdata = mysqli_fetch_array($unitres);
			$unitid = $unitdata["unit_id"];
			$unitname = $unitdata["unitname"];
			$projectname = $unitdata["projectname"];
			$clientid = $unitdata["companys_id"];
			$alarmemailto = $unitdata['alarmemails'];
			$alarmhashtags = $unitdata['alarmhashtags'];

			$alarmtype = "Warning";
			if($priority == 1)
				$alarmtype = "Tripped";				

			$notifysubject = 'Alarm';
			$notifycontent = '<b>'.$unitname. '</b> | '. $projectname.'<br>'.$alarmdata->alarm_name;
			$emailsubject = 'Alarm';
			$emailcontent = '<table width="100%" cellpadding="5" cellspacing="5">';
			$emailcontent .= '<tr><td>HI,</td></tr>';
			$emailcontent .= '<tr><td>'.$alarmtype.'</td></tr>';
			$emailcontent .= '<tr><td>'.$alarmdata->alarm_name.'</td></tr>';
			$emailcontent .= '<tr><td>'.$unitname.' | '.$projectname.'</td></tr>';
			$emailcontent .= '<tr><td>'.date("d M Y h:i A").'</td></tr>';
			$emailcontent .= '</table>';
			
			if($alarmemailto)
			{
				$toemails = @explode(",", $alarmemailto);
				for($i = 0; $i < count($toemails); $i++)
				{
					$actualid = $toemails[$i];
					$emailids[] = $actualid;		
				}
			}	

			if($alarmhashtags)
			{
				$hashtags = @explode(',', $alarmhashtags);
				for($i = 0; $i < count($hashtags); $i++)
				{
					$actualid = $hashtags[$i];
					$staff = mysqli_query($connect_db, "SELECT * FROM staffs WHERE personalhashtag = '".$actualid."'");
					if(mysqli_num_rows($staff) > 0)
					{
						$staffdata = mysqli_fetch_array($staff);
						$notifyto = $staffdata['staff_id'];
						mysqli_query($connect_db, "INSERT INTO pushnotifications (`notify_content`, `notify_by`, `notify_to`, `notify_type`, `table_id`, `notify_subject`) VALUES ('".$notifycontent."', '0', '".$notifyto."', 'OA', '".$alarmdata->alarm_id."', '".$notifysubject."')");										
						$emailids[] = $staffdata['email'];
					}
				}
			}
			
			if($emailids)
			{
				
				$emailids = @implode(',', $emailids);
				mysqli_query($connect_db, "INSERT INTO notificationemails (`notification_email`, `notification_content`, `notification_subject`) VALUES ('".$emailids."', '".$emailcontent."', '".$emailsubject."')");
				//echo mysqli_insert_id($connect_db);
			}
			
		} else {
			if($actualalarmname == "*" || $actualalarmname == "?" || $actualalarmname == "??" || $actualalarmname == "!*") {
				mysqli_query($connect_db, "DELETE FROM alarms WHERE alarm_id = '".$alarmdata->alarm_id."'");
			}
		}
	}
}



?>

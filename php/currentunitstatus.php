<?php
	ini_set('error_reporting', E_ALL);
	include 'library.php'; // include the library file
	include "classes/class.phpmailer.php"; // include the class name
	
	$isUTC=1;
	if($isUTC>0){
		$dmY=gmdate("dmY");
		$dMYHis=gmdate("d M Y H:i:s");
		$YmdHis=gmdate("Y-m-d H:i:s");
		$dMYHishypehen=gmdate("d-M-Y H:i:s");
		$dMYHiA=gmdate("d M Y H:i A");
		$Ymdhypehen=gmdate("Y-m-d");
		$His=gmdate("H:i:s");	
		$utc=$YmdHis;
		// $dt = new DateTime($utc);
		// $tz = new DateTimeZone('Asia/Singapore'); // or whatever zone you're after
		// $dt->setTimezone($tz);
		// echo $dt->format('Y-m-d H:i:s');

		//echo date_default_timezone_get();
	
		$dt = new DateTime($utc, new DateTimeZone('UTC'));
		$dt->setTimezone(new DateTimeZone( date_default_timezone_get()));
		 
			$dMYHiAlocal=$dt->format('d M Y h:i A');      

		
	}else{
		date_default_timezone_set("Asia/Singapore");
		$dmY=date("dmY");
		$dMYHis=date("d M Y H:i:s");
		$YmdHis=date("Y-m-d H:i:s");
		$dMYHishypehen=gmdate("d-M-Y H:i:s");
		$dMYHiA=date("d M Y H:i A");
		$Ymdhypehen=date("Y-m-d");
		$His=date("H:i:s");
	}	
	$db_name = 'denyodev1';//'denyoappv2';
	$db_user = 'denyodev1';//'denyoappv2';
	$db_pass = '51RkC3nQgXlwGyZq';//'RfS4aE4Wxq2daL0D';
	$db_host = 'localhost';//'localhost';
	$connect_db = new mysqli( $db_host, $db_user, $db_pass, $db_name ); 

	//$generatorid = "GEN0011";
	$generatorid = $_GET['gid'];	
	$hexadata = $_REQUEST['data'];	

	/* Create folder using generator name/controllerid - start */

	$foldername = $generatorid;

	/*$dummyfile = "currentunitstatus10_".date("YmdHis").".txt";
	$dummyfile = fopen($dummyfile, "w");
	fwrite($dummyfile, "This is testing exe");   
	fclose($dummyfile);*/
	

	$rawfilename = $foldername.'/rawdata/'.$dmY.".txt";
	$rawdata = $dMYHis. " - ". $hexadata."\n";
	$enginestatefilename = $foldername.'/ENGINESTATE.txt';
	$modefilename = $foldername.'/MODE.txt';
	$alarmfilename = $foldername.'/ALARM.txt';
	$alarmhistoryfilename = $foldername."/alarmhistory/ALARM_HISTORY.txt";
	if(!file_exists($foldername))
	{
		mkdir($foldername, 0777); // main folder
		mkdir($foldername.'/alarmhistory', 0777); //alarm history folder
		mkdir($foldername.'/rawdata', 0777); //alarm history folder
		
		/* Create text file with filename as current date and store the raw data - start */
		
		$rawfile = fopen($rawfilename, "w");
		fwrite($rawfile, $rawdata);   
		fclose($rawfile);

		/* Create text file with filename as current date and store the raw data - start */

		/* Create text file for manage current Engine State - Start */
		
		$enginestatefile = fopen($enginestatefilename, "w");
		fwrite($enginestatefile, '0');   
		fclose($enginestatefile);

		/* Create text file for manage current Engine State - End */

		/* Create text file for manage current Alarm - Start */
		
		$alarmfile = fopen($alarmfilename, "w");
		fwrite($alarmfile, '0');   
		fclose($alarmfile);

		$alarmhistoryfile = fopen($alarmhistoryfilename, "w");
		fwrite($alarmhistoryfile, '0');
		fclose($alarmhistoryfile);

		/* Create text file for manage current Alarm - End */
	}
	else
	{
		/* Update raw data - start */

		$rawfile = fopen($rawfilename, "a");
		fwrite($rawfile, $rawdata);   
		fclose($rawfile);

		/* Update raw data - end */
	}	
	
	/* Create folder using generator name/controllerid - end */

	
	
	/* update unit values */

	//$hexadata = '01 03 02 00 2F F9 98 ,FUELLEVEL';
	//$hexadata = '01 03 02 00 85 79 A3 ,BATTERYVOLTAGE';

	$unitres = mysqli_query($connect_db, "SELECT * FROM units WHERE controllerid = '".$generatorid."' AND deletestatus = '0'");
	
	if(mysqli_num_rows($unitres))
	{
		$unitdata = mysqli_fetch_array($unitres);
		$unitid = $unitdata["unit_id"];
		$unitname = $unitdata["unitname"];
		$projectname = $unitdata["projectname"];
		$clientid = $unitdata["companys_id"];
		$alarmemailto = $unitdata['alarmemails'];
		$alarmhashtags = $unitdata['alarmhashtags'];
		$hexavalue = 0;

		//$hexadata = "01 03 36 00 00 02 00 2A 53 64 20 44 6F 6F 72 20 53 77 69 74 63 68 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3B F3, A";
	
		$rawdata = @explode(",", $hexadata);
		
		$hexacode = $rawdata[0];
		$unitcode = trim($rawdata[1]);

		if($unitcode != "A") // if not alarm
		{
			$hexacode = substr($hexacode, 9, strlen($hexacode));
			$hexacodearr = @explode(" ", trim($hexacode));
			$hexacodearrcount = count($hexacodearr);
			$hexacontact = $hexacodearr[0].$hexacodearr[1];
			$hexacontact1 = $hexacodearr[2].$hexacodearr[3];
			if($hexacodearrcount == 4)
				$hexavalue = hexdec($hexacontact);
			else
				$hexavalue = hexdec($hexacontact).".".hexdec($hexacontact1);

			if($unitcode == "FREQ" || $unitcode == "COLLANTTEMP" || $unitcode == "BATTERYVOLTAGE" || $unitcode == "OILPRESSURE")
			{
				$hexavalue = $hexavalue / 10;	
				//if($unitcode == "COLLANTTEMP" || $unitcode == "BATTERYVOLTAGE" || $unitcode == "OILPRESSURE")
				$hexavalue = round($hexavalue, 1);
			}
			
			if($unitcode == "RUNNINGHR") {	
				if(strlen($hexavalue) >= 7) {
					$hexavalue = $hexavalue * 1000;
				} else if(strlen($hexavalue) >= 3) {
					$hexavalue = $hexavalue * 100;
				} else {
					$hexavalue = $hexavalue * 10;
				}
			}

			if($unitcode == "FUELLEVEL" || $unitcode == "VOLT1" || $unitcode == "VOLT2" || $unitcode == "VOLT3" || $unitcode == "CURRENT1" || $unitcode == "CURRENT2" || $unitcode == "CURRENT3" || $unitcode == "ENGSPEED" || $unitcode == "LOADPOWER1" || $unitcode == "LOADPOWER2" || $unitcode == "LOADPOWER3") {
				$hexavalue = round($hexavalue);			
			}
			if($unitcode == "ENGINESTATE" || $unitcode == "MODE")
			{
				$hexavalue = ceil($hexavalue);
			}		

			mysqli_query($connect_db, "UPDATE unit_currentstatus SET value='".$hexavalue."',timestamp='".$YmdHis."' WHERE code='".$unitcode."' AND generatorid='".$generatorid."'");

			/* update current engine state if unit code is enginestate - start */

			/*if($unitcode == "ENGINESTATE")
			{
				$enginestatefile = fopen($enginestatefilename, "w");
				fwrite($enginestatefile, $hexavalue);   
				fclose($enginestatefile);
			}

			if($unitcode == "MODE")
			{
				$modefile = fopen($modefilename, "a");
				fwrite($modefile, $dMYHis."-".$hexavalue."\n");   
				fclose($modefile);
			}*/

			/* update current engine state if unit code is enginestate - start */
		}
		else if($unitcode == "ALARMS") 
		{ // Alarm count - check and update in alarmtable. If alarm count 0, then update status = 1. that means fault rest from compapp.
			$hexacode = substr($hexacode, 9, strlen($hexacode));
			$hexacodearr = @explode(" ", trim($hexacode));
			$hexacontact = $hexacodearr[0].$hexacodearr[1];
			$hexavalue = hexdec($hexacontact);
			if($hexavalue == 0)
			{
				mysqli_query($connect_db, "UPDATE alarms SET alarm_status = '1' WHERE alarm_unit_id = '".$unitid."'");
			}
			$filecon = $dMYHishypehen." -- ".$hexacode." == ".$hexavalue."\n\n";
			$myfile = fopen($alarmfilename, "a");
			fwrite($myfile, $filecon);
			fclose($myfile);			
		}
		else
		{
			//remove first 8 pair, take next 14 pairs. and convert hex to str. u will get alarm text

			//Ex: 01 03 36 00 00 02 00 2A 53 64 20 44 6F 6F 72 20 53 77 69 74 63 68 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 3B F3

			//01 03 36 00 00 01 01 21 2A 57 72 6E 20 46 75 65 6C 20 4C 65 76 65 6C 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 16 A8 ,

			$alarmhexacode = substr($hexacode, 24, strlen($hexacode));

			$tmpalarmhexacodearr = @explode("00", trim($alarmhexacode));
						
			$alarmhexacode = $tmpalarmhexacodearr[0];
			
			$hexavalue = hex2bin(trim(str_replace(" ",'',$alarmhexacode)));
			
			//create alarm history in text file
			
			$alarmhistorycontent = $hexacode.", ".$dMYHiA."\n\n-------------------\n\n";
			$alarmhistoryfile = fopen($alarmhistoryfilename, "a");
			fwrite($alarmhistoryfile, $alarmhistorycontent);
			fclose($alarmhistoryfile);

			//update alarm in text file
			/*$filecontent = '';
			
			if(file_exists($alarmfilename)) 
			{
				$filecontent = file_get_contents($alarmfilename);
			}
			else //create new file if not exist
			{
				$myfile = fopen($alarmfilename, "w");
				fwrite($myfile, $hexacode);
				fclose($myfile);
				$filecontent = '';
			}*/

			if($hexavalue && strlen($hexavalue) > 2) // alarm value if not null
			{
				if(strpos($hexavalue, "SMS") !== false) { }				
				else
				{	
					$priority = 3;
					$hexavalue = str_replace("*", '', $hexavalue);
					$chkpriorityarr = @explode(" ", $hexavalue);
					if(strtolower($chkpriorityarr[0]) == "sd")
						$priority = 1;
					else if(strtolower($chkpriorityarr[0]) == "emergency")
						$priority = 1;
					else if(strtolower($chkpriorityarr[0]) == "boc")
						$priority = 1;
					else if(strtolower($chkpriorityarr[0]) == "fls")
						$priority = 1;
					else if(strtolower($chkpriorityarr[0]) == "wrn")
						$priority = 2;		
					$unitcode = "ALARM";	

					if($priority != 3) {

						$chkexist = mysqli_query($connect_db, "SELECT * FROM alarms WHERE alarm_name = '".$hexavalue."' AND alarm_unit_id = '".$unitid."' AND alarm_priority = '".$priority."' AND alarm_status = '0'");
						if(mysqli_num_rows($chkexist) <= 0)		
						{		
					
							//store alarm into alarm table				
							$chkalarmtable = mysqli_query($connect_db, "INSERT INTO alarms (`alarm_name`, `alarm_unit_id`, `alarm_priority`, `alarm_status`, `alarm_received_date`) VALUES ('".$hexavalue."', '".$unitid."', '".$priority."', '0', '".$YmdHis."')");

							//get alarmtable last insert id 
							$alarmtableid = mysqli_insert_id($connect_db);

							$emailids = '';

							if($alarmtableid)
							{										
								//update current status 
								mysqli_query($connect_db, "UPDATE unit_currentstatus SET value='".$alarmtableid."',timestamp='".$YmdHis."' WHERE code='".$unitcode."' AND generatorid='".$generatorid."'");

								//store data in comment list
								mysqli_query($connect_db, "INSERT INTO eventorcomments (`event_type`, `type_table_id`, `dateandtime`, `event_unit_id`) VALUES ('A', '".$alarmtableid."', '".$YmdHis."', '".$unitid."')");		
							
							
							
								//store data in notification list
							
								// get notify content for send push notifications
								$notifycontent = $emailcontent = '';

								$alarmtype = "Warning";
								if($priority == 1)
									$alarmtype = "Tripped";	
		
								/*$notifys = mysqli_query($connect_db, 'SELECT * FROM notification_content WHERE notification_content_id = 1');							
								if(mysqli_num_rows($notifys) > 0)
								{	
									$alarmtype = "Warning";
									if($priority == 1)
										$alarmtype = "Tripped";		
									$notify_content = $notifys[0]->notify_for.'<br>'.$notifys[0]->notify_content;
									$notify_content = str_replace('#TYPE#', $alarmtype, $notify_content);
									$notify_content = str_replace('#ALARMSUBJECT#', $hexavalue, $notify_content);
									$notify_content = str_replace('#UNITNAME#', $unitname, $notify_content);
									$notify_content = str_replace('#PROJECTNAME#', $projectname, $notify_content);
									$notifycontent = str_replace('#DATETIME#', date('d M Y h:i A'), $notify_content);	
									//$notifycontent = nl2br($notifycontent);
								}*/

								$notifysubject = 'Alarm';
								$notifycontent = $alarmtype.'<br>'.$hexavalue.'<br>'.$unitname. ' | '. $projectname.'<br>'.$dMYHiAlocal;
								$emailsubject = 'Alarm';
								$emailcontent = '<table width="100%" cellpadding="5" cellspacing="5">';
								$emailcontent .= '<tr><td>HI,</td></tr>';
								$emailcontent .= '<tr><td>'.$alarmtype.'</td></tr>';
								$emailcontent .= '<tr><td>'.$hexavalue.'</td></tr>';
								$emailcontent .= '<tr><td>'.$unitname.' | '.$projectname.'</td></tr>';
								$emailcontent .= '<tr><td>'.$dMYHiAlocal.'</td></tr>';
								$emailcontent .= '</table>';
							
								//$alarmmsg = $hexavalue."\n".$generatorid."\n".$projectname;
								if($alarmemailto)
								{
									$toemails = @explode(",", $alarmemailto);
			
									for($i = 0; $i < count($toemails); $i++)
									{
										$actualid = $toemails[$i];

										//mysqli_query($connect_db, 'INSERT INTO notificationemails (`notification_email`, `notification_content`) VALUES ("'.$actualid.'", "'.$notifycontent.'")');

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
											mysqli_query($connect_db, "INSERT INTO pushnotifications (`notify_content`, `notify_by`, `notify_to`, `notify_type`, `table_id`, `notify_subject`) VALUES ('".$notifycontent."', '0', '".$notifyto."', 'OA', '".$alarmtableid."', '".$notifysubject."')");										
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
							
								//print_r($emailids); exit;						
							}

						}					
										
					}
				}
			}
			
		}//echo "status updated";

		/* update current data value in the unit history table - start */
		//$chkhistoryexist = "SELECT * FROM unitdatahistory_".$unitid." WHERE `code` = '".$unitcode."' AND `currentval` = '".$hexavalue."' AND `hexacode` = '".$hexacode."' order by `id` desc limit 0, 1";

		$chkhistoryexist = "SELECT * FROM unitdatahistory_".$unitid." WHERE `code` = '".$unitcode."' order by `id` desc limit 0, 1";

		$chkexistres = mysqli_query($connect_db, $chkhistoryexist);
	
		if(mysqli_num_rows($chkexistres) <= 0)
		{
			mysqli_query($connect_db, "INSERT INTO unitdatahistory_".$unitid." (`genid`, `code`, `currentval`, `hexacode`, `date`, `time`, `fromdateandtime`, `todateandtime`) VALUES ('".$generatorid."', '".$unitcode."', '".$hexavalue."', '".$hexacode."', '".$Ymdhypehen."', '".$His."', '".$YmdHis."', '".$YmdHis."')");
		}
		else
		{
			$existdata = mysqli_fetch_array($chkexistres);
			if($existdata["currentval"] == $hexavalue && $existdata["hexacode"] == $hexacode) {
				mysqli_query($connect_db, "UPDATE unitdatahistory_".$unitid." SET `todateandtime` = '".$YmdHis."' WHERE `code` = '".$unitcode."' AND `currentval` = '".$hexavalue."' AND `id` = '".$existdata["id"]."'");
			}
			else {
				mysqli_query($connect_db, "INSERT INTO unitdatahistory_".$unitid." (`genid`, `code`, `currentval`, `hexacode`, `date`, `time`, `fromdateandtime`, `todateandtime`) VALUES ('".$generatorid."', '".$unitcode."', '".$hexavalue."', '".$hexacode."', '".$Ymdhypehen."', '".$His."', '".$YmdHis."', '".$YmdHis."')");
			}
		}
		/* update current data value in the unit history table - end */

	} // end unitres
	
die;


?>

<?php
ini_set('error_reporting', E_ALL);
date_default_timezone_set("Asia/Singapore");
$db_name = 'denyoappv2';
$db_user = 'denyoappv2';
$db_pass = 'RfS4aE4Wxq2daL0D';
$db_host = 'localhost';
$connect_db = new mysqli( $db_host, $db_user, $db_pass, $db_name ); 


$unitres = mysqli_query($connect_db, 'SELECT * FROM units WHERE deletestatus = 0');

if(mysqli_num_rows($unitres)) {
	
	while($unitdata = mysqli_fetch_object($unitres)) {
		//echo $unitdata->controllerid."<br>";
		
		$currentstatus = mysqli_query($connect_db,'SELECT * FROM unit_currentstatus WHERE generatorid = "'.$unitdata->controllerid.'"');
		if(mysqli_num_rows($currentstatus)) {
			while($data = mysqli_fetch_object($currentstatus)) {
				$chkhistoryexist = "SELECT * FROM unitdatahistory_".$unitdata->unit_id." WHERE `code` = '".$data->code."' AND `genid` = '".$data->generatorid."' order by `id` desc limit 0, 1";

				$chkexistres = mysqli_query($connect_db, $chkhistoryexist);

				$chkenginestate = "SELECT * FROM unitdatahistory_".$unitdata->unit_id." WHERE `code` = 'ENGINESTATE' AND `genid` = '".$data->generatorid."' order by `id` desc limit 0, 1";

				$chkenginestateres = mysqli_query($connect_db, $chkenginestate);
				$runningstatus = 0;
				if(mysqli_num_rows($chkenginestateres) > 0) {
					$statedata = mysqli_fetch_object($chkenginestateres);
					if($statedata->value > 2 && $statedata->value < 12) {
						$runningstatus = 1;
					} 
				}		
				
	
				if(mysqli_num_rows($chkexistres) <= 0)
				{
					mysqli_query($connect_db, "INSERT INTO unitdatahistory_".$unitdata->unit_id." (`genid`, `code`, `currentval`, `hexacode`, `date`, `time`, `fromdateandtime`, `todateandtime`, `runningstatus`) VALUES ('".$data->generatorid."', '".$data->code."', '".$data->value."', '".$data->actual_hexacode."', '".date("Y-m-d")."', '".date("H:i:s")."', '".$data->timestamp."', '".$data->timestamp."', '".$runningstatus."')");
				}
				else
				{
					$existdata = mysqli_fetch_array($chkexistres);
					if($existdata["currentval"] == $data->value && $existdata["hexacode"] == $data->actual_hexacode) {
						mysqli_query($connect_db, "UPDATE unitdatahistory_".$unitdata->unit_id." SET `todateandtime` = '".date("Y-m-d H:i:s")."', `runningstatus` = '".$runningstatus."' WHERE `code` = '".$data->code."' AND `currentval` = '".$data->value."' AND `id` = '".$existdata["id"]."'");
					}
					else {
						mysqli_query($connect_db, "INSERT INTO unitdatahistory_".$unitdata->unit_id." (`genid`, `code`, `currentval`, `hexacode`, `date`, `time`, `fromdateandtime`, `todateandtime`, `runningstatus`) VALUES ('".$data->generatorid."', '".$data->code."', '".$data->value."', '".$data->actual_hexacode."', '".date("Y-m-d")."', '".date("H:i:s")."', '".$data->timestamp."', '".$data->timestamp."', '".$runningstatus."')");
					}
				}
				if($data->code == "ALARMS" && $data->value == 0) {
					//DB::table('alarms')->where('alarm_unit_id', $unitdata->unit_id)->update(array('alarm_status' => 1));
					mysqli_query($connect_db, "UPDATE alarms SET alarm_status = 1 WHERE alarm_unit_id = '".$unitdata->unit_id."'");
				}
				if($data->code == 'AT$GPSACP') {
					$gpsvalue = @explode(",", $data->value);
			
					$gpslat = $gpsvalue[1];
					$gpslong = $gpsvalue[2];

					$gps_status = $gpsvalue[5];
			
					$latitude = substr($gpslat, 0, 2) + (substr($gpslat, 2, strlen($gpslat)) / 60);
					$longtitude = substr($gpslong, 0, 3) + (substr($gpslong, 3, strlen($gpslong)) / 60);

					
					$gpstime = $gpsvalue[0];
					if($gpstime) {
						$gpstmptime = @explode('.', $gpstime);
						$gpstime = $gpstmptime[0];
						
						$gpstime = chunk_split($gpstime, 2, ':');
						$gpstime = substr($gpstime, 0, strlen($gpstime) - 1);
					}
					$gpsdate = $gpsvalue[9];
					if($gpsdate) {
						$gpsdate = chunk_split($gpsdate, 2, '-');
						
						$gpsdate = substr($gpsdate, 0, strlen($gpsdate) - 1);						
						$tmp = @explode('-', $gpsdate);
						$tmpdate = array_reverse($tmp);
						$gpsdate = @implode('-', $tmpdate);
					}
					
					$gpsdatetime = date('Y-m-d H:i:s', strtotime($gpsdate.' '.$gpstime));

					$receiveddate = date('Y-m-d H:i:s', strtotime('-8 hours'));
					/*echo "<pre>";
					print_r($gpsvalue);
					echo $gpsdatetime."==".$gpsdate."==".$gpstime;*/
					//if($latitude > 0 && $longtitude > 0) {						
						$checkexits = mysqli_query($connect_db, "SELECT * FROM `unit_latlong` WHERE `latlong_unit_id` = '".$unitdata->unit_id."'");
						if(mysqli_num_rows($checkexits) > 0) {
							$existdata = mysqli_fetch_object($checkexits);
							$existgpsstatus = $existdata->gps_status;
							$existtodatetime = $existdata->todatetime;
							if($existgpsstatus == $gps_status) {
								if($existtodatetime == $gpsdatetime) {
									mysqli_query($connect_db, "UPDATE `unit_latlong` SET `latitude` = '".$latitude."', `longtitude` = '".$longtitude."', `gps_status` = '".$gps_status."', `receiveddate` = '".$receiveddate."' WHERE `latlong_unit_id` = '".$unitdata->unit_id."'");
								} else {
									mysqli_query($connect_db, "UPDATE `unit_latlong` SET `latitude` = '".$latitude."', `longtitude` = '".$longtitude."', `gps_status` = '".$gps_status."', `todatetime` = '".$gpsdatetime."', `receiveddate` = '".$receiveddate."' WHERE `latlong_unit_id` = '".$unitdata->unit_id."'");
								}
							} else {								
								mysqli_query($connect_db, "UPDATE `unit_latlong` SET `latitude` = '".$latitude."', `longtitude` = '".$longtitude."', `gps_status` = '".$gps_status."', `fromdatetime` = '".$gpsdatetime."', `todatetime` = '".$gpsdatetime."', `receiveddate` = '".$receiveddate."' WHERE `latlong_unit_id` = '".$unitdata->unit_id."'");
							}
						}
						else {
							mysqli_query($connect_db, "INSERT INTO unit_latlong (`latlongunit_id`, `latitude`, `longtitude`, `gps_status`, `fromdatetime`, `todatetime`, `receiveddate`) VALUES ('".$unitdata->unit_id."', '".$latitude."', '".$longtitude."', '".$gps_status."', '".$gpsdatetime."', '".$gpsdatetime."', '".$receiveddate."')");				
						}
						//echo $unitdata->controllerid." Lat = ".$latitude." & Long = ".$longtitude." updated!<br>";
					//}
				}
			}
		}
	}
}



?>

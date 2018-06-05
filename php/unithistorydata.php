<?php
ini_set('error_reporting', E_ALL);
date_default_timezone_set("Asia/Singapore");
$db_name = 'denyodev1';//'denyoappv2';
$db_user = 'denyodev1';//'denyoappv2';
$db_pass = '51RkC3nQgXlwGyZq';//'RfS4aE4Wxq2daL0D';
$db_host = 'localhost';//'localhost';
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
	
				if(mysqli_num_rows($chkexistres) <= 0)
				{
					mysqli_query($connect_db, "INSERT INTO unitdatahistory_".$unitdata->unit_id." (`genid`, `code`, `currentval`, `hexacode`, `date`, `time`, `fromdateandtime`, `todateandtime`) VALUES ('".$data->generatorid."', '".$data->code."', '".$data->value."', '".$data->actual_hexacode."', '".date("Y-m-d")."', '".date("H:i:s")."', '".$data->timestamp."', '".$data->timestamp."')");
				}
				else
				{
					$existdata = mysqli_fetch_array($chkexistres);
					if($existdata["currentval"] == $data->value && $existdata["hexacode"] == $data->actual_hexacode) {
						mysqli_query($connect_db, "UPDATE unitdatahistory_".$unitdata->unit_id." SET `todateandtime` = '".date("Y-m-d H:i:s")."' WHERE `code` = '".$data->code."' AND `currentval` = '".$data->value."' AND `id` = '".$existdata["id"]."'");
					}
					else {
						mysqli_query($connect_db, "INSERT INTO unitdatahistory_".$unitdata->unit_id." (`genid`, `code`, `currentval`, `hexacode`, `date`, `time`, `fromdateandtime`, `todateandtime`) VALUES ('".$data->generatorid."', '".$data->code."', '".$data->value."', '".$data->actual_hexacode."', '".date("Y-m-d")."', '".date("H:i:s")."', '".$data->timestamp."', '".$data->timestamp."')");
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
			
					$latitude = substr($gpslat, 0, 2) + (substr($gpslat, 2, strlen($gpslat)) / 60);
					$longtitude = substr($gpslong, 0, 3) + (substr($gpslong, 3, strlen($gpslong)) / 60);

					if($latitude > 0 && $longtitude > 0) {
						$checkexits = mysqli_query($connect_db, "SELECT * FROM `unit_latlong` WHERE `latlong_unit_id` = '".$unitdata->unit_id."'");
						if(mysqli_num_rows($checkexits) > 0) {
							mysqli_query($connect_db, "UPDATE `unit_latlong` SET `latitude` = '".$latitude."', `longtitude` = '".$longtitude."' WHERE `latlong_unit_id` = '".$unitdata->unit_id."'");				
						}
						else {
							mysqli_query($connect_db, "INSERT INTO unit_latlong (`latlongunit_id`, `latitude`, `longtitude`) VALUES ('".$unitdata->unit_id."', '".$latitude."', '".$longtitude."')");				
						}
						//echo $unitdata->controllerid." Lat = ".$latitude." & Long = ".$longtitude." updated!<br>";
					}
				}
			}
		}
	}
}



?>

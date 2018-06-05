<?php
header('Access-Control-Allow-Origin: *');
define( 'API_ACCESS_KEY', 'AAAAAai8Zdc:APA91bGjWJPGq8SDYbVX8_dsVbeCQIuBbCbU_hAFIz6wBuDuV6cQIYtgTIaGLtWGbbpIV-F-p08FxvaCCAhG41DdusIb8vb2YLOGYIGc1KkuvFn5HuOUmcb72waDyZPFl5y6RhJCyJjx' );
//define( 'API_ACCESS_KEY', 'AAAATe9mBac:APA91bEW3fB4ZOy1BAN2k8SqhRRgkigFCDRWQ8owmNF4n3jLAj89uxkVpkyeS6wjHeWQM-U1ZgTSiEmrAW3SUel3tDqDMxqsig_uzFcM3-7P3AvFlI9cxh_H1hiLc-AwhZn1CfNfFkfk' );
//define( 'API_ACCESS_KEY', 'AAAATe9mBac:APA91bEW3fB4ZOy1BAN2k8SqhRRgkigFCDRWQ8owmNF4n3jLAj89uxkVpkyeS6wjHeWQM-U1ZgTSiEmrAW3SUel3tDqDMxqsig_uzFcM3-7P3AvFlI9cxh_H1hiLc-AwhZn1CfNfFkfk' );// previous key : AAAAMsL3XDM:APA91bE7SEGJJDb84Rm9ZDCSyCaKzIRFNeJuLfioAFqbCJ3ulYPN9Mmn4fJzsQUHaMH8uZZuG7lm4fItlyIB_U2BV9qWvgA8zNGYly5xXWtCmRGuNJj051bjjYbvyMp_L18b15IDsXHI

// Define database connection parameters
$hn      = 'localhost';
$un      = 'denyodev1';
$pwd     = '51RkC3nQgXlwGyZq';
$db      = 'denyodev1';
$cs      = 'utf8';

// Set up the PDO parameters
$dsn  = "mysql:host=" . $hn . ";port=3306;dbname=" . $db . ";charset=" . $cs;
$opt  = array(
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
        PDO::ATTR_EMULATE_PREPARES   => false,
       );
// Create a PDO instance (connect to the database)
$pdo  = new PDO($dsn, $un, $pwd, $opt);
$data = array();
extract($_GET);
try {
      $stmt    = $pdo->query("SELECT * FROM `pushnotifications` WHERE appstatus = 0");
      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
		// Assign each row of data to associative array
		// $data[] = $row;	
		$registrationIds = '';
		$tokens = $pdo->query("SELECT * FROM `devicetokens` WHERE staffid = '".$row->notify_to."'");
		$tokendata = $tokens->fetch(PDO::FETCH_OBJ);
		if($tokendata->deviceid != "null")
		{

			$registrationIds = array($tokendata->deviceid);

			// prep the bundle
			$msg = array
			(
			    'message'   => strip_tags(nl2br($row->notify_content)),
			    'title'     => $row->notify_subject,			    
			    'tickerText'=> strip_tags(nl2br($row->notify_content)),
			    'vibrate'   => 1,
			    'sound'     => 'default',
		            'vibrate'   => 1,
    			    'sound'     => 1,
			    'arrayval'  =>  array('id' => $row->table_id, 'msg' => strip_tags(nl2br($row->notify_content)), 'sub' => $row->notify_subject, 'type' => $row->notify_type),
			    'largeIcon' => 'large_icon',
			    'smallIcon' => 'small_icon'
			    			    
			);
			$fields = array
			(
			    'registration_ids'  => $registrationIds,
			    'data'          => $msg
			);

			$headers = array
			(
			    'Authorization: key=' . API_ACCESS_KEY,
			    'Content-Type: application/json'
			);

			$ch = curl_init();
			curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
			curl_setopt( $ch,CURLOPT_POST, true );
			curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
			curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
			curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
			$result = curl_exec($ch );
			curl_close( $ch );
			echo $result;

			$pdo->query("UPDATE `pushnotifications` SET appstatus = 1 WHERE pushnotification_id  = '".$row->pushnotification_id."'");
		}
      }

      // Return data as JSON
      //echo json_encode($data);
}
catch(PDOException $e)
{
	echo $e->getMessage();
}
// API access key from Google API's Console
exit;



?>

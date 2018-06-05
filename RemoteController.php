<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;
use App\Unit;
use Response;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class RemoteController extends Controller
{
	public function remoteaction(Request $request) {
		$controllerid = $request->controllerid;
		$action = $request->controlaction;
		$ismobile = $request->ismobile;
		$status = 0;
		$url = $url1 = '';
		date_default_timezone_set("Asia/Singapore");
		$datetime = date('Y-m-d').' '.date('H:i:s');	
		

		if($action == "AUTO-MODE") {			
			$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/01%2006%200b%20cb%2000%2002%207b%20d1";			
		} else if($action == "OFF-MODE") {			
			$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/01%2006%200b%20cb%2000%2000%20fa%2010";	
		} else if($action == "MAN-MODE") {			
			$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/01%2006%200b%20cb%2000%2001%203b%20d0";	
		} else if($action == "START") {	
			$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/DEVCMD:START";
			//$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."BALA/DEVCMD:STARTBALA";
		} else if($action == "STOP") {		
			//$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."BALA/DEVCMD:STOPBALA";	
			$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/DEVCMD:STOP";
		} else if($action == "FAULT-RESET") {			
			//$url = "http://13.58.37.241/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/01%2010%2010%206f%2000%2002%2004%2008 %20f7%2000%2000%20cb%2095";	
			$url = "http://13.250.190.101/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/APPCMD:EXECUTE:FAULTRESET";
		}
		
		//echo $url;
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,  $url);
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$result = curl_exec($ch);

		//$result = exec('wget -O /dev/null '.$url);
		
		if ($result) {	
			//echo $result;				
		        curl_close($ch);			
			$status = 1;
		}

		if($action == "FAULT-RESET") {
			/*$url1 = "http://13.58.37.241/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/01%2006%2010%2071%2000%2001%201c%20d1";
			
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url1);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$result = curl_exec($ch);
			if ($result) {
			    curl_close($ch);
			    $status = 2;
			}*/
			$unitres = DB::table('units')->where('controllerid', $controllerid)->get();
			if(count($unitres) > 0) {
				DB::table('alarms')->where('alarm_unit_id', $unitres[0]->unit_id)->update(array('alarm_status' => 1));
			}
		}

		
		/*if($action == "START" || $action == "STOP") {
		//if($action == "START" || $action == "STOP" || $action == "FAULT-RESET") {
		
			
			$url1 = "http://13.58.37.241/DenyoCBWebAPI/TransactMin/MobileApp/".$controllerid."/01%2006%2010%2071%2000%2001%201c%20d1";
			
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url1);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$result = curl_exec($ch);
			if ($result) {
			    curl_close($ch);
			    $status = 2;
			}

			
			
		}*/

		if($ismobile == 0 && $status > 0) {			
			echo $action.' Success';
		}
	}

	public function index(Request $request) {

	}

		
	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function create()
	{
		
	}

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request)
	{
	//
	}

	/**
	* Display the specified resource.
	*
	* @param  \App\Companygroup  $companygroup
	* @return \Illuminate\Http\Response
	*/
	public function show($id)
	{
	//
	}

	/**
	* Show the form for editing the specified resource.
	*
	* @param  \App\Companygroup  $companygroup
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
	* @param  \App\Companygroup  $companygroup
	* @return \Illuminate\Http\Response
	*/
	public function update(Request $request, $id)
	{
	//
	}

	/**
	* Remove the specified resource from storage.
	*
	* @param  \App\Companygroup  $companygroup
	* @return \Illuminate\Http\Response
	*/
	public function destroy()
	{
	//
	}

	
}

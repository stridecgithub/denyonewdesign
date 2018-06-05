<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Unit;
use App\Unitgroup;
use App\CompanyGroup;
use App\Timezone;
use App\Service;
use DB;
use App;
use Symfony\Component\HttpFoundation\Session\Session;
use App\DataTables\UnitGroupDataTable;
use Yajra\Datatables\Datatables;

class UnitgroupController extends Controller
{
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request, UnitGroupDataTable $dataTable)
	{
		if($request->is_mobile == 1) {
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');
			$msg = array('result'=>'success');
			$company_id = $request->company_id;
			
			if($company_id == 1)
				$allunitgroup = Unitgroup::where('delete_status',0)->orderBy('unitgroup_id', 'desc')->get();
			else
				$allunitgroup = Unitgroup::where('delete_status',0)->where('company_id',$company_id)->orderBy('unitgroup_id', 'desc')->get();
			
			if($sort == 'favorite') {
				$unit_group_ids = DB::table('unitgroup_favorites')->select('unitgroups_id')->orderBy('unitgroups_id','desc')->get();

				foreach($unit_group_ids as $ug_ids) {
					$ugids[] = "'".$ug_ids->unitgroups_id."'";		
	
				}
				$comma_ids = implode(',',$ugids);
				if($company_id == 1)
					$unitgroup = Unitgroup::where('delete_status',0)->orderByRaw("FIELD(unitgroup_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();
				else
					$unitgroup = Unitgroup::where('delete_status',0)->where('company_id',$company_id)->orderByRaw("FIELD(unitgroup_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();

			} else if($sort == "date") {
				if($company_id == 1)
					$unitgroup = Unitgroup::where('delete_status',0)->orderBy("createdon", $dir)->skip($startindex)->take($results)->get();
				else
					$unitgroup = Unitgroup::where('delete_status',0)->where('company_id',$company_id)->orderBy("createdon", $dir)->skip($startindex)->take($results)->get();
			}
			else {
				if($company_id == 1)
					$unitgroup = Unitgroup::where('delete_status',0)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
				else
					$unitgroup = Unitgroup::where('delete_status',0)->where('company_id',$company_id)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			}
			$unitgroups = array();
			if(count($unitgroup) > 0 )
			{
				$i = 0;
				foreach($unitgroup as $ugroup)
				{
					$unitgroups[$i]['unitgroup_id'] = $ugroup->unitgroup_id;
					$unitgroups[$i]['unitgroup_name'] = $ugroup->unitgroup_name;
					$unitgroups[$i]['colorcode'] = $ugroup->colorcode;
					$unitgroups[$i]['company_id'] = $ugroup->company_id;
					$unitgroups[$i]['remark'] = $ugroup->remark;
					$unitgroups[$i]['createdOn'] = date("d/m/y", strtotime($ugroup->created_on));
					$chkfav = DB::table('unitgroup_favorites')->where('unitgroups_id', $ugroup->unitgroup_id)->get();
					if(count($chkfav) > 0)
						$unitgroups[$i]['favorite'] = 1;
					else
						$unitgroups[$i]['favorite'] = 0;
					$totalunits = DB::table('units')->where('unitgroups_id', $ugroup->unitgroup_id)->where('deletestatus','0')->count();
					$unitgroups[$i]['totalunits'] = $totalunits;
					++$i;
				}
			}
			return response()->json(['msg'=>$msg,'totalCount'=>$allunitgroup->count(),'unitgroups'=>$unitgroups]);			
		}
		else {
			return $dataTable->render('unitgroup.index');
		}
	}

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
    public function create()
    {
		//print_r(Session::all());
        //
					//echo Session::get('ses_company_id'); die;

		return view('unitgroup.create');
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
			$groupdata['timezone'] = $timezonename;
		}else{		
			$groupdata['timezone'] ='';
		}
		if($request->current_datetime){
			$current_datetime=$request->current_datetime;
			$groupdata['created_on'] =$current_datetime;
			$groupdata['updatedon'] =$current_datetime;
		}else{
			$current_datetime= date('Y-m-d H:i:s');
			$groupdata['created_on'] =$current_datetime;
			$groupdata['updatedon'] =$current_datetime;
		}

        $session = new Session();				
		$chkname = $request->unitgroup_name;
		//echo $chkname;
		
		$chkexist = Unitgroup::where('unitgroup_name',$chkname)->where('delete_status',0)->get();
		
		if(count($chkexist) <= 0)
		{
			if($request->is_mobile == 1)
			{
				$unitgroup = new Unitgroup;
				//$unitgroup->fill($request->all())->save();
				$groupdata['unitgroup_name'] = $request->unitgroup_name;
				$groupdata['colorcode'] = $request->colorcode;
				$groupdata['remark'] = $request->remark;
				$groupdata['company_id'] =  $request->company_id;
				$groupdata['createdby'] = $request->createdby;
				$groupdata['updatedby'] = $request->createdby;
				

				DB::table('unitgroups')->insert($groupdata);
				$msg = array(array('Error' => '0','result'=>'Unit Group name created successfully'));			
				return response()->json(['msg'=>$msg]);
			}
			else
			{
				
				$login_id = $session->get('ses_login_id');
				$company_id = $session->get('ses_company_id');
			
				$groupdata['unitgroup_name'] = $request->unitgroup_name;
				$groupdata['colorcode'] = $request->colorcode;
				$groupdata['remark'] = $request->remark;
				$groupdata['company_id'] = $company_id;
				$groupdata['createdby'] = $login_id;
				$groupdata['updatedby'] = $login_id;
				

				DB::table('unitgroups')->insert($groupdata);
				// set flash messages
				$session->getFlashBag()->add('unitgroup_created', 'Unit group created successfully');
				return redirect('/unitgroup');	
			}

		}
		else
		{
			if($request->is_mobile == 1) {
				$msg = array(array('Error' => '1','result'=>'Unit Group name alaready exist!'));			
				return response()->json(['msg'=>$msg]);
			}
		}		

//mdv
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
		$ug = Unitgroup::where('unitgroup_id',$id)->get();
			
		return view('unitgroup.edit',['unitgroup'=>$ug]);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $timezone = new Timezone;
		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			$groupdata['timezone'] = $timezonename;
		}else{		
			$groupdata['timezone'] ='';
		}
		if($request->current_datetime){
			$current_datetime=$request->current_datetime;
			$groupdata['updatedon'] =$current_datetime;
		}else{
			$current_datetime= date('Y-m-d H:i:s');
			$groupdata['updatedon'] =$current_datetime;
		}
		$session = new Session();				
		$unitgroup_upd = Unitgroup::where('unitgroup_id',$request->unitgroup_id)->get();
		if($unitgroup_upd->count() > 0 ) {
			$chkname = $request->unitgroup_name;
			$chkexist = DB::table('unitgroups')->where('unitgroup_name',$chkname)->where('delete_status',0)->where('unitgroup_id', '!=', $request->unitgroup_id)->get();
			if(count($chkexist) <= 0)
			{
				if($request->is_mobile == 1)
				{
					//Unitgroup::find($request->unitgroup_id)->update($request->all());

					$groupdata['unitgroup_name'] = $request->unitgroup_name;
					$groupdata['colorcode'] = $request->colorcode;
					$groupdata['remark'] = $request->remark;					
					$groupdata['updatedby'] = $request->createdby;

					DB::table('unitgroups')->where('unitgroup_id', $request->unitgroup_id)->update($groupdata);

				}
				else
				{
					
					$login_id = $session->get('ses_login_id');					
					$groupdata['unitgroup_name'] = $request->unitgroup_name;
					$groupdata['colorcode'] = $request->colorcode;
					$groupdata['remark'] = $request->remark;					
					$groupdata['updatedby'] = $login_id;

					DB::table('unitgroups')->where('unitgroup_id', $request->unitgroup_id)->update($groupdata);
				}				
			}
			else
			{
				if($request->is_mobile == 1) {
					$msg = array(array('Error' => '1','result'=>'Unit Group name already exist!'));
					return response()->json(['msg'=>$msg]);
				}
			}
		}
		if($request->is_mobile == 1) {
			$allunitgroup = Unitgroup::where('delete_status',0)->orderBy('unitgroup_id', 'desc')->get();
			$msg = array(array('Error' => '0','result'=>'Unit Group name updated successfully'));
			return response()->json(['msg'=>$msg,array('totalCount'=>$allunitgroup)]);
			
		}
		else {
			// set flash messages
			$session->getFlashBag()->add('unitgroup_updated', 'Unit group updated successfully');
			return redirect('/unitgroup')->with('alert','UnitGroup Updated');
		}

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($id,$ismobile)
    {
        $session = new Session();		
		//mdv
		DB::table('unitgroups')->where('unitgroup_id',$id)->update(array('delete_status' => '1'));
		$unitgroup = Unitgroup::where('delete_status',0)->orderBy("unitgroup_id","desc")->get();
		if($ismobile == 0) {
			
			// set flash messages
			$session->getFlashBag()->add('unitgroup_deleted', 'Unit group deleted successfully');
			return redirect('/unitgroup');
		}
		else {
			$unitscheck = Unit::where('unitgroups_id',$id)->get();
			if(count($unitscheck) > 0) {
				DB::table('units')->where('unitgroups_id',$id)->update(array('deletestatus' => '1'));
				DB::table('unit_contacts')->where('units_id', $id)->delete();
				DB::table('unit_favorites')->where('units_id', $id)->delete(); 
				DB::table('view_on_dashboard')->where('view_unit_id', $id)->delete(); 
				
				$ctrl_id = Unit::where('unit_id',$id)->select('controllerid')->get();		
				DB::table('unit_currentstatus')->where('generatorid',$ctrl_id[0]->controllerid)->delete();
				
				Schema::dropIfExists('unitdatahistory_'.$id);

			}
			$msg = array(array('Error' => '0','result'=>'Unit Group name deleted successfully'));
			return response()->json(['unitgroups' => $unitgroup,'msg'=>$msg]);
		}
    }
	
	//For web only
	public function delete_childunits($id,$ismobile) {
        $session = new Session();
		
		DB::table('unitgroups')->where('unitgroup_id',$id)->update(array('delete_status' => '1'));
		DB::table('units')->where('unitgroups_id',$id)->update(array('deletestatus' => '1'));
		DB::table('unit_contacts')->where('units_id', $id)->delete();
		DB::table('unit_favorites')->where('units_id', $id)->delete(); 
		DB::table('view_on_dashboard')->where('view_unit_id', $id)->delete(); 
		
		$ctrl_id = Unit::where('unit_id',$id)->select('controllerid')->get();
		if(count($ctrl_id) > 0) {		
			DB::table('unit_currentstatus')->where('generatorid',$ctrl_id[0]->controllerid)->delete();
		}
		Schema::dropIfExists('unitdatahistory_'.$id);
		$unitgroup = Unitgroup::where('delete_status',0)->orderBy("unitgroup_id","desc")->get();
		if($ismobile == 0) {
			// set flash messages
			$session->getFlashBag()->add('unitgroup_deleted', 'Unit group deleted successfully');
			return redirect('/unitgroup');
		}
	}

	public function setunitgroupfavorite(Request $request)
	{
		$result = '';
		$unitgroupid = $request->unitgroupid;		
		$is_mobile = $request->is_mobile;
		$chkexist = DB::table('unitgroup_favorites')->where('unitgroups_id', $unitgroupid)->get();
		if(count($chkexist) > 0)
		{
			DB::table('unitgroup_favorites')->where('unitgroups_id', $unitgroupid)->delete();
			$result = 'unfav';
			$msg = array(array('Error' => '1','result'=>'Unit Group successfully removed from favorites'));
		}
		else
		{
			DB::table('unitgroup_favorites')->insert(['unitgroups_id' => $unitgroupid, 'staffs_id' => '1']);
			$result = 'fav';
			$msg = array(array('Error' => '0','result'=>'Unit Group successfully added in favorites'));
		}
		if($is_mobile == 1)
		{
			$allunitgroup = Unitgroup::where('delete_status',0)->where('company_id',$request->company_id)->orderBy('unitgroup_id', 'desc')->get();
			$unitgroup = $allunitgroup;						
			$unitgroups = array();
			if($unitgroup)
			{
				$i = 0;
				foreach($unitgroup as $ugroup)
				{
					$unitgroups[$i]['unitgroup_id'] = $ugroup->unitgroup_id;
					$unitgroups[$i]['unitgroup_name'] = $ugroup->unitgroup_name;
					$unitgroups[$i]['colorcode'] = $ugroup->colorcode;
					$unitgroups[$i]['remark'] = $ugroup->remark;
					$unitgroups[$i]['createdOn'] = date("d/m/y", strtotime($ugroup->created_on));
					$chkfav = DB::table('unitgroup_favorites')->where('unitgroups_id', $ugroup->unitgroup_id)->get();
					if(count($chkfav) > 0)
						$unitgroups[$i]['favorite'] = 1;
					else
						$unitgroups[$i]['favorite'] = 0;
					$totalunits = DB::table('units')->where('unitgroups_id', $ugroup->unitgroup_id)->count();
					$unitgroups[$i]['totalunits'] = $totalunits;
					++$i;
				}
			}
			return response()->json(['totalCount'=>$allunitgroup->count(),'unitgroups' => $unitgroups, 'msg' => $msg]);
		}
		else
			echo $result;
	}
	
	function unitgroupdetails(Request $request) {		
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');
			$company_id='';
			$loginid = $request->loginid; 
			$ids = array();
			$units = array();
			$unitslist = array();
			 $unitgroups_id=$request->unitgroupid;
				 $allunits = DB::table('units')->where('unitgroups_id',$unitgroups_id)->where('deletestatus',0)->orderBy('unit_id','desc')->get();	
			 
			
			if($sort == 'companygroup_name') {						
				if($dir == 'asc') {
					$dir = 'desc';
				}
				else $dir = 'asc';
				if($company_id == 1) {
					$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->join('companygroups', 'companygroups.companygroup_id', '=', 'units.companys_id')->where('units.deletestatus',0)->orderBy('companygroups.'.$sort, $dir)->skip($startindex)->take($results)->get();
				}
				else {
					$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->join('companygroups', 'companygroups.companygroup_id', '=', 'units.companys_id')->where('units.deletestatus',0)->where('units.companys_id',$company_id)->orderBy('companygroups.'.$sort, $dir)->skip($startindex)->take($results)->get();
				}		
			}
			elseif($sort == 'favorite') {
				$unit_ids = DB::table('unit_favorites')->where('staffs_id',$loginid)->select('units_id')->orderBy('units_id','desc')->get();
				//$unit_ids = DB::table('unit_favorites')->select('units_id')->orderBy('units_id','desc')->get();
				if(count($unit_ids) > 0) {
					foreach($unit_ids as $ug_ids) {
						$ugids[] = "'".$ug_ids->units_id."'";
					}
					$comma_ids = implode(',',$ugids);
					if($company_id == 1) {
						$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();
					}
					else {
						$unitslist = Unit::where('deletestatus',0)->where('units.companys_id',$company_id)->orderByRaw("FIELD(unit_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();
					}				
				}
				else {
					$unitslist = Unit::where('deletestatus',0)->where('units.companys_id',$company_id)->skip($startindex)->take($results)->get();
				}
			}
			elseif($sort == 'unitgroup') {
				$unit_ids = DB::table('unitgroups')->select('unitgroup_id')->orderBy('unitgroup_name','asc')->get();
				foreach($unit_ids as $ug_ids) {
					$ugids[] = "'".$ug_ids->unitgroup_id."'";
				}
				$comma_ids = implode(',',$ugids);
				if($company_id == 1) {
					$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unitgroups_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();
				}
				else {
					$unitslist = Unit::where('deletestatus',0)->where('units.companys_id',$company_id)->orderByRaw("FIELD(unitgroups_id,$comma_ids)".$dir)->skip($startindex)->take($results)->get();	
				}
			}
			elseif($sort == 'tripped') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($enginestate) > 0) {
							if($enginestate[0]->value == 12) {
								$ids[] = "'".$genid->unit_id."'";
							}
						}
					}
					$ids = implode(',',$ids);
					if($ids) {
						if($company_id == 1) {
												$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
						}
						else {
					$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();							
						}

					}
				}
			}
			elseif($sort == 'running') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($enginestate) > 0) {
							if($enginestate[0]->value == 7) {
								$ids[] = "'".$genid->unit_id."'";
							}
						}
					}
					$ids = implode(',',$ids);
					
					if($ids) {
					if($company_id == 1) {
					$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
						
					}
					else {
					$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();
						
					}
					}
				}
			}
			elseif($sort == 'warning') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->where('code', 'ENGINESTATE')->get();
						if(count($enginestate) > 0) {
							if($enginestate[0]->value == 7) {
								$alarms = DB::table('alarms')->where('alarm_unit_id', $genid->unit_id)->where('alarm_status', '0')->count();
								if(count($alarms) > 0)
									$ids[] = "'".$genid->unit_id."'";
							}
						}
					}
					$ids = implode(',',$ids);
					
					if($ids) {
					if($company_id == 1) {
											$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
					}
					else {
					$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();						
					}

					}
				}
			}
			elseif($sort == 'offline') {
				$generatorid = DB::table('units')->select('controllerid','unit_id')->get();
				if(count($generatorid) > 0) {
					foreach($generatorid as $genid) {					
						$enginestate = DB::table('unit_currentstatus')->where('generatorid', $genid->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						if(count($enginestate) > 0) {
							$lastupdatetime = $enginestate[0]->timestamp;
							//echo date('Y-m-d H:i:s', strtotime('+5 minutes', strtotime('2011-04-8 08:29:49')));
							$currenttime = date('Y-m-d H:i:s');
							$addedthreemins = date('Y-m-d H:i:s',strtotime('+3 minutes',strtotime($lastupdatetime)));
							if($lastupdatetime < $addedthreemins) {
								$ids[] = "'".$genid->unit_id."'";
							}
							
						}
					}
					$ids = implode(',',$ids);
					
					if($ids) {
					if($company_id == 1) {
											$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->get();
					}
					else {
					$unitslist = Unit::where('deletestatus',0)->orderByRaw("FIELD(unit_id,$ids)".$dir)->skip($startindex)->take($results)->where('companys_id',$company_id)->get();						
					}

					}
				}
			}			
			else {
				
				$unitslist = DB::table('units')->join('unitgroups', 'unitgroups.unitgroup_id', '=', 'units.unitgroups_id')->where('units.deletestatus',0)->where('units.unitgroups_id',$unitgroups_id)->orderBy('units.'.$sort, $dir)->skip($startindex)->take($results)->get();			

			}
						
			if(count($unitslist) > 0)
			{
				$i = 0;

				foreach($unitslist as $unit)
				{
					
					$units[$i]['unit_id'] = $unit->unit_id;
					$units[$i]['unitname'] = $unit->unitname;
					$units[$i]['projectname'] = $unit->projectname;
					$units[$i]['controllerid'] = $unit->controllerid;
					$units[$i]['neaplateno'] = $unit->neaplateno;
					$units[$i]['location'] = $unit->location;
					$units[$i]['companys_id'] = $unit->companys_id;
					$units[$i]['unitgroups_id'] = $unit->unitgroups_id;
					$units[$i]['models_id'] = $unit->models_id;
					$units[$i]['timezone'] = $unit->timezone;
					$units[$i]['alarmnotificationto'] = $unit->alarmnotificationto;
					
					$chkfav = DB::table('unit_favorites')->where('units_id', $unit->unit_id)->where('staffs_id',$loginid)->get();
					
					if(count($chkfav) > 0)
					$units[$i]['favorite'] = 1;
					else
					$units[$i]['favorite'] = 0;
					
					$companygroup = CompanyGroup::where('companygroup_id', $unit->companys_id)->select('companygroup_name')->get();
					if(count($companygroup) > 0)
						$units[$i]['companygroup_name'] = $companygroup[0]->companygroup_name;
					
					$unitgroup = Unitgroup::where('unitgroup_id', $unit->unitgroups_id)->select('unitgroup_name', 'colorcode')->get();
					if(count($unitgroup) > 0)
					{
						$units[$i]['unitgroup_name'] = $unitgroup[0]->unitgroup_name;
						$units[$i]['colorcode'] = $unitgroup[0]->colorcode;
					}

					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'RUNNINGHR')->get();
					if(count($currentstatus) > 0)
					{
						$units[$i]['runninghr'] = $currentstatus[0]->value;
					}
					else
						$units[$i]['runninghr'] = 0;
					
					$currentstatus = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->where('code', 'ENGINESTATE')->get();
					if(count($currentstatus) > 0)
					{
						
						$chkstatusres = DB::table('unit_currentstatus')->where('generatorid', $unit->controllerid)->orderBy('timestamp', 'desc')->skip(0)->take(1)->get();
						//print_r($chkstatusres);
						if(count($chkstatusres) > 0)
						{
							$lastupdatestatus1 = strtotime("+3 minutes", strtotime($chkstatusres[0]->timestamp));
							$currentstatus1 = strtotime(date("Y-m-d H:i:s"));
							//echo $unit->controllerid."==".$lastupdatestatus1."=".$currentstatus1;
							//echo '<br>';
							
							if($lastupdatestatus1 < $currentstatus1)
								$units[$i]['genstatus'] = 'Offline';
							else
							{
								if($currentstatus[0]->value == 1)
									$units[$i]['genstatus'] = 'Ready';
								else if($currentstatus[0]->value == 7)
								{
									$alarms = DB::table('alarms')->where('alarm_unit_id', $unit->unit_id)->where('alarm_status', 0)->get();
									if(count($alarms) > 0) { $units[$i]['genstatus'] = 'Warning'; } else { $units[$i]['genstatus'] = 'Running'; }
								}
								else if($currentstatus[0]->value == 2) { $units[$i]['genstatus'] = 'Not_Ready'; }
								else if($currentstatus[0]->value == 12) { $units[$i]['genstatus'] = 'Tripped'; }
								else { $units[$i]['genstatus'] = 'Offline'; }
							}
						}					
						else { $units[$i]['genstatus'] = 'Offline'; }
					}
					else { $units[$i]['genstatus'] = 'Offline'; }
					
					$services = Service::where('deletestatus','0')->where('service_unitid', $unit->unit_id)->whereRaw('(service_status = ? OR (DATE(service_scheduled_date) > ? AND service_status = ?))', [0, date('Y-m-d'), 1])->orderBy('service_scheduled_date', 'asc')->skip(0)->take(1)->get();
                   			
					$todaydate=date('d M Y');
					if(count($services) > 0)
					{
						if($services[0]->service_scheduled_date != '0000-00-00') {
							$units[$i]['nextservicedate'] = date("d M Y", strtotime($services[0]->service_scheduled_date));
							$units[$i]['nextservicedate_mobileview'] = date("d/m/Y", strtotime($services[0]->service_scheduled_date));						
							
							
							if($services[0]->serviced_by == '0' && (strtotime($todaydate) > strtotime($services[0]->service_scheduled_date)))
							{
								$units[$i]['nextservicedate_status']='duedate';
								$units[$i]['duedatecolor']='#C71717';
								
							}
							else
							{
								$units[$i]['nextservicedate_status']='upcoming';
								$units[$i]['duedatecolor']='';
								
							}
							
						} else {
							if($services[0]->serviced_by == '0' && (strtotime($todaydate) > strtotime($services[0]->service_scheduled_date)))
							{						
								$units[$i]['nextservicedate_status']='duedate';
								$units[$i]['duedatecolor']='#C71717';
							}
						}
						$units[$i]['service_id']=$services[0]->service_id;
						$units[$i]['servicedeletestatus']=$services[0]->deletestatus;
					}		
					else
					{
						$units[$i]['nextservicedate'] = '';
						$units[$i]['nextservicedate_status']='';
					}
					

					$contactslist = DB::table('unit_contacts')->where('units_id', $unit->unit_id)->get();

					$tmpcontacts = array();
					$contacts = '';
					
					if($contactslist)
					{
						foreach($contactslist as $contact)
						{
							$tmpcontacts[] = $contact->contact_name.'|'.$contact->contact_number; 
						}
						if($tmpcontacts)
						{
							$contacts = @implode("#", $tmpcontacts);
						}
					}
					if($contacts != '')
					{
						$units[$i]['contacts'] = $contacts;
					}
					$unit_latlong = DB::table('unit_latlong')->where('latlong_unit_id',$unit->unit_id)->get();
					if(count($unit_latlong) > 0) {
						$units[$i]['lat'] = $unit_latlong[0]->latitude;
						$units[$i]['lng'] = $unit_latlong[0]->longtitude;
					}
					else {
						$units[$i]['lat'] = '';
						$units[$i]['lng'] = '';
					}
					
					++$i;
				}	
			}			
			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>count($allunits), 'units' => $units]);    		
	}
}

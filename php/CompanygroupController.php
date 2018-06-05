<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\CompanyGroup;
use App\Timezone;
use App\Staff;
use App\User;
use App\Unit;
use App\DataTables\CompanyGroupDataTable;
use DB;
use Yajra\Datatables\Datatables;
use Symfony\Component\HttpFoundation\Session\Session;

class CompanygroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, CompanyGroupDataTable $dataTable)
    {	
		//$companygroup = CompanyGroup::where('deletestatus',0)->orderBy('companygroup_id', 'desc')->get();
		
		if($request->is_mobile == 1) {
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');
			$companyid = $request->companyid;			
			 if($companyid == 1)
			 {
				 $allcompanygroup = CompanyGroup::where('deletestatus',0)->orderBy('companygroup_id', 'desc')->get();
				 $companygroup = CompanyGroup::where('deletestatus',0)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			 }
			 else
			 {
				$allcompanygroup = CompanyGroup::where('deletestatus',0)->orderBy('companygroup_id', 'desc')->where('companygroup_id',$companyid)->get();
				
				$companygroup = CompanyGroup::where('deletestatus',0)->where('companygroup_id',$companyid)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			 }
			$companygroups = array();
			if(count($companygroup) > 0)
			{
				$i = 0;
				foreach($companygroup as $cgroup)
				{
					$companygroups[$i]['companygroup_id'] = $cgroup->companygroup_id;
					$companygroups[$i]['companygroup_name'] = $cgroup->companygroup_name;
					$companygroups[$i]['country'] = $cgroup->country;
					$companygroups[$i]['address'] = $cgroup->address;
					$companygroups[$i]['contact'] = $cgroup->contact;
					$totalunits = DB::table('units')->where('companys_id', $cgroup->companygroup_id)->where('deletestatus','0')->count();
					$companygroups[$i]['totalunits'] = $totalunits;
					$totalusers = DB::table('staffs')->where('company_id', $cgroup->companygroup_id)->where('status','0')->count();
					$companygroups[$i]['totalusers'] = $totalusers;
					++$i;
				}
			}
			$msg = array('result'=>'success');			
			return response()->json(['msg' => $msg, 'totalCount'=>$allcompanygroup->count(), 'companygroups' => $companygroups]);
		}
		else {
			//return $dataTable->render('companygroup');
			return $dataTable->render('CompanyGroup.index');
			//return view('CompanyGroup.index',['companygroups'=>$companygroup]);
		}

    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $countries = DB::table('countries')->get();
		
		return view('CompanyGroup.create', ['countries' => $countries]);
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
		$chkname = $request->companygroup_name;
		//echo $chkname;
		
		$chkexist = CompanyGroup::where('companygroup_name',$chkname)->where('deletestatus', 0)->get();
		
		if(count($chkexist) <= 0)
		{		
			$companygroup = new Companygroup;
			if($request->is_mobile == 1) {
				$timezone = new Timezone;
				if( $request->input('timezoneoffset')){		
					$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
					$companygroupdata['timezone'] = $timezonename;
				}else{		
					$companygroupdata['timezone'] ='';
				}
				if($request->current_datetime){
					$current_datetime=$request->current_datetime;
					$companygroupdata['createdon'] =$current_datetime;
					$companygroupdata['updatedon'] =$current_datetime;
				}else{
					$current_datetime= date('Y-m-d H:i:s');
					$companygroupdata['createdon'] =$current_datetime;
					$companygroupdata['updatedon'] =$current_datetime;
				}
				$companygroupdata['usercompanyid'] = $request->usercompanyid;
				$companygroupdata['companygroup_name'] = $request->companygroup_name;
				$companygroupdata['address'] = $request->address;
				$companygroupdata['country'] =  $request->country;
				$companygroupdata['contact'] =  $request->contact;				
				$companygroupdata['createdby'] = $request->createdby;
				$companygroupdata['updatedby'] = $request->createdby;
				DB::table('companygroups')->insert($companygroupdata);
				$msg = array(array('Error' => '0','result'=>'Company Group name created successfully'));			
				return response()->json(['msg'=>$msg]);
			}
			else {
				$companygroup->fill($request->all())->save();
				// set flash messages
				$session->getFlashBag()->add('companygroup_created', 'Company Group created successfully');
				return redirect('/companygroup');	
			}
		}
		else
		{
			if($request->is_mobile == 1) {
				$msg = array(array('Error' => '1','result'=>'Company Group name alaready exist!'));			
				return response()->json(['msg'=>$msg]);
			}
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
		$companygroup = CompanyGroup::where('companygroup_id',$id)->get();
			$countries = DB::table('countries')->get();
		return view('CompanyGroup.edit',['companygroup' => $companygroup, 'countries'=>$countries]);
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
		$session = new Session();
		$companygroupUpdate = CompanyGroup::where('companygroup_id',$request->companygroup_id)->get();
		if($companygroupUpdate->count() > 0 ) {
			$chkname = $request->companygroup_name;
			$chkexist = DB::table('companygroups')->where('companygroup_name',$chkname)->where('companygroup_id', '!=', $request->companygroup_id)->where('deletestatus', 0)->get();
			if(count($chkexist) <= 0)
			{
				


				if($request->is_mobile == 1) {
				$timezone = new Timezone;
				if( $request->input('timezoneoffset')){		
					$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
					$companygroupdata['timezone'] = $timezonename;
				}else{		
					$companygroupdata['timezone'] ='';
				}
				if($request->current_datetime){
					$current_datetime=$request->current_datetime;					
					$companygroupdata['updatedon'] =$current_datetime;
				}else{
					$current_datetime= date('Y-m-d H:i:s');				
					$companygroupdata['updatedon'] =$current_datetime;
				}
				$companygroupdata['usercompanyid'] = $request->usercompanyid;
				$companygroupdata['companygroup_name'] = $request->companygroup_name;
				$companygroupdata['address'] = $request->address;
				$companygroupdata['country'] =  $request->country;
				$companygroupdata['contact'] =  $request->contact;				
				$companygroupdata['createdby'] = $request->createdby;
				$companygroupdata['updatedby'] = $request->createdby;
				//DB::table('companygroups')->insert($companygroupdata);
				DB::table('companygroups')->where('companygroup_id',$request->companygroup_id)->update($companygroupdata);
			}else{
				CompanyGroup::find($request->companygroup_id)->update($request->all());
			}


			}
			else
			{
				if($request->is_mobile == 1) {
					//$msg = array(array('result'=>'success'));
					$msg = array(array('Error' => '1','result'=>'Company Group name already exist!'));
					return response()->json(['msg'=>$msg]);
				}
			}
		}
		if($request->is_mobile == 1) {
			//$msg = array(array('result'=>'success'));
			$msg = array(array('Error' => '0','result'=>'Company Group name updated successfully'));
			return response()->json(['msg'=>$msg]);
			
		}
		else {		
			$session->getFlashBag()->add('companygroup_updated', 'Company Group updated successfully');		
			return redirect('/companygroup')->with('alert','CompanyGroup Updated');
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
        	DB::table('companygroups')->where('companygroup_id',$id)->update(array('deletestatus' => '1'));
		DB::table('staffs')->where('company_id', $id)->update(array('status' => '1'));
		$companygroup = CompanyGroup::where('deletestatus',0)->orderBy("companygroup_id","desc")->get();
		if($ismobile == 0){
			$session->getFlashBag()->add('companygroup_deleted', 'Company Group deleted successfully');
			return redirect('/companygroup');
		}
		else {
			$msg = array(array('Error' => '0','result'=>'Company Group name deleted successfully'));
			return response()->json(['companygroups' => $companygroup,'msg'=>$msg]);
		}
    }

	public function checkexists(Request $request)
	{
		$result = 0;
		$id = $request->id;
		$type = $request->type;
		$chkname = $request->companygroup_name;
		if($type == "insert")
			$chkexist = CompanyGroup::where('companygroup_name',$chkname)->where('deletestatus', 0)->get();
		else
			$chkexist = DB::table('companygroups')->where('companygroup_name',$chkname)->where('companygroup_id', $id)->where('deletestatus', 0)->get();
		if(count($chkexist) > 0)
			$result = 1;
		echo $result;
	}


    public function getCountries()
    {
	$countries = DB::table('countries')->get();
	return response()->json(['countries' => $countries]);
    }

	public function chkdatatable(CompanyGroupDataTable $dataTable)
	{
		return $dataTable->render('companygroup');
	}

	public function getdata()
	{
		
		return Datatables::of(CompanyGroup::query())->make(true);
	}
	
	public function companydetails($companyid) {
		//$staffdata = array();
		$users=array();
		$companydetails = CompanyGroup::where('companygroup_id',$companyid)->get();		
		foreach($companydetails as $details) {
			$companydetail['companygroup_id'] = $details->companygroup_id;
			$companydetail['companygroup_name'] = $details->companygroup_name;
			$companydetail['address'] = $details->address;
			$companydetail['contact'] = $details->contact;			
			$companygroup_id = $details->companygroup_id;
		}	
			//$staffdata = Staff::where('company_id',$companygroup_id)->where('status','0')->get();
			$userdata = DB::table('users')->where('staffs.company_id',$companygroup_id)->join('staffs','users.staffs_id','=','staffs.staff_id')->join('roles','roles.role_id','=','staffs.role_id')->where('staffs.status','0')->get();
			$units  = Unit::where('companys_id',$companygroup_id)->where('deletestatus','0')->get();
			if(count($userdata) > 0) {
				$companydetail['totaluser'] = count($userdata);
				foreach($userdata as $key => $user) {
					//$roles = DB::table('roles')->where('role_id',$user->role_id)->get();
					$users[$key]['staff_id'] = $user->staff_id;
					$users[$key]['username'] = $user->username;
					$users[$key]['role'] = $user->role_name;					
				}
			}
			if(count($units) > 0) {
				$companydetail['totalunit'] = count($units);
				foreach($units as $unit) {
					$unitdetail[]['unitname'] = $unit->unitname;
				}
			}
			else {
				$unitdetail=array();
			}
		//}
		$msg = array(array('Error' => '0'));
		return response()->json(['msg'=>$msg,'companydetails'=>array($companydetail),'unitdetail'=>$unitdetail,'users'=>$users]);
	}
	
}

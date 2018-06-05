<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Staff;
use App\CompanyGroup;
use App\User;
use App\Timezone;
use DB;
use Symfony\Component\HttpFoundation\Session\Session;
use App\DataTables\StaffDataTable;
use Yajra\Datatables\Datatables;
class StaffController extends Controller
{
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request, StaffDataTable $dataTable)
	{
		if($request->is_mobile == 1) {
			$startindex = $request->input('startindex'); // start limit
			$results = $request->input('results'); // end limit		
			$sort = $request->input('sort');
			$dir = $request->input('dir');
			$companyid = $request->companyid;
			$id_arr = array('0');
			if($companyid == 1)
				$allstaffs = Staff::where('status',0)->where('non_user',0)->orderBy('staff_id', 'desc')->get();		
			else
				$allstaffs = Staff::where('status',0)->where('non_user',0)->where('company_id', $companyid)->orderBy('staff_id', 'desc')->get();			
			if($sort == "companygroup_name")
			{
				if($companyid == 1) {
					$cgroup = CompanyGroup::where('deletestatus',0)->orderBy('companygroup_name','asc')->where('deletestatus', 0)->select('companygroup_id')->get();
					foreach($cgroup as $cg) {
						$id_arr[] = "'".$cg->companygroup_id."'"; 
					}
					$comma_ids = implode(',',$id_arr);
					
					$staffslist = DB::table('staffs')->join('users', 'users.staffs_id', '=', 'staffs.staff_id')
					->join('companygroups', 'companygroups.companygroup_id', '=', 'staffs.company_id')
					->where('staffs.status',0)->where('staffs.non_user',0)->where('companygroups.deletestatus', '0')->orderByRaw("FIELD(staffs.company_id , $comma_ids) ".$dir)->skip($startindex)->take($results)->get();

					
				}
				else {
					$cgroup = CompanyGroup::where('deletestatus',0)->where('companygroup_id', $companyid)->orderBy('companygroup_name','asc')->where('deletestatus', 0)->select('companygroup_id')->get();
					foreach($cgroup as $cg) {
						$id_arr[] = "'".$cg->companygroup_id."'"; 
					}
					$comma_ids = implode(',',$id_arr);
					
					$staffslist = DB::table('staffs')->join('users', 'users.staffs_id', '=', 'staffs.staff_id')
					->join('companygroups', 'companygroups.companygroup_id', '=', 'staffs.company_id')
					->where('staffs.status',0)->where('staffs.non_user',0)->where('staffs.company_id', $companyid)->where('companygroups.deletestatus', '0')->orderByRaw("FIELD(staffs.company_id , $comma_ids) ".$dir)->skip($startindex)->take($results)->get();
				}				
			}
			else
			{
				if($companyid == 1) {
					$staffslist = DB::table('staffs')->join('users', 'users.staffs_id', '=', 'staffs.staff_id')->join('companygroups', 'companygroups.companygroup_id', '=', 'staffs.company_id')->where('staffs.status',0)->where('staffs.non_user',0)->where('companygroups.deletestatus', '0')->orderBy('staffs.'.$sort, $dir)->skip($startindex)->take($results)->get();
				}
				else {
					$staffslist = DB::table('staffs')->join('users', 'users.staffs_id', '=', 'staffs.staff_id')->where('staffs.status',0)->where('staffs.non_user',0)->where('staffs.company_id', $companyid)->orderBy('staffs.'.$sort, $dir)->skip($startindex)->take($results)->get();
				}
			}
			$staffs = array();
			if($staffslist)
			{
				$i = 0;
				foreach($staffslist as $staff)
				{					
					$staffs[$i]['staff_id'] = $staff->staff_id;
					$staffs[$i]['firstname'] = $staff->firstname;
					$staffs[$i]['lastname'] = $staff->lastname;
					$companygroup_name = DB::table('companygroups')->where('companygroup_id',$staff->company_id)->select('companygroup_name')->get();
					if(count($companygroup_name) > 0)
						$staffs[$i]['companygroup_name'] = $companygroup_name[0]->companygroup_name;
				
					$staffs[$i]['contact_number'] = $staff->contact_number;
					$staffs[$i]['username'] = $staff->username;
					$staffs[$i]['email'] = $staff->email;
					$staffs[$i]['password'] = base64_decode($staff->password);
					$staffs[$i]['photo'] = $staff->photo;
					$staffs[$i]['personalhashtag'] = $staff->personalhashtag;
					$staffs[$i]['job_position'] = $staff->job_position;
					$staffs[$i]['report_to'] = $staff->report_to;
					$staffs[$i]['company_id'] = $staff->company_id;
					$staffs[$i]['role_id'] = $staff->role_id;
					$staffs[$i]['country_id'] = $staff->country_id;
					++$i; 
				}				
			}
			$msg = array('result'=>'success');	
				
			return response()->json(['msg' => $msg, 'totalCount'=>$allstaffs->count(), 'staff' => $staffs]);
		}
		else {
						
			return $dataTable->render('Staff.index');
			//return view('Staff.index',['staffs'=>$staffs]);
		}
	}

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function create()
	{		
		$session = new Session();
		$ses_company_id = $session->get('ses_company_id');
		$ses_login_id = $session->get('ses_login_id');
		$ses_role_id = $session->get('role_id');
		$countries = DB::table('countries')->get();
		if($ses_company_id == 1)
		{
			$companies = CompanyGroup::where('deletestatus', '0')->get();
			$reportto = Staff::where('status', '0')->where('non_user', '0')->get();
		}
		else
		{
			$companies = CompanyGroup::where('deletestatus', '0')->where('companygroup_id', $ses_company_id)->get();
			$reportto = Staff::where('status', '0')->where('company_id', $ses_company_id)->where('non_user', '0')->get();
		}
		if($ses_role_id == 1 || $ses_company_id == 1) {
			$roles = DB::table('roles')->where('deletestatus', '0')->get();
		} else {
			$roles = DB::table('roles')->where('deletestatus', '0')->where('role_id', '!=', '1')->get();
		}
		return view('Staff.create', ['countries' => $countries, 'ses_login_id'=>$ses_login_id,'companies' => $companies, 'reportto' => $reportto, 'companyid' => $ses_company_id, 'roles' => $roles]);
	}

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request) {
		$chkname = $request->username;
		
		$chkexist = DB::table('users')->where('deletestatus','0')->where('username', $chkname)->get();
		
		if(count($chkexist) <= 0)
		{
			$photo = '';

			$timezone = new Timezone;
			if( $request->input('timezoneoffset')){		
				$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
				$staffdata['timezone'] = $timezonename;
			}else{		
				$staffdata['timezone'] ='';
			}
			if($request->current_datetime){
				$current_datetime=$request->current_datetime;
				$staffdata['createdon'] =$current_datetime;
				$staffdata['updatedon'] =$current_datetime;
			}else{
				$current_datetime= date('Y-m-d H:i:s');
				$staffdata['createdon'] =$current_datetime;
				$staffdata['updatedon'] =$current_datetime;
			}

			$staffdata['firstname'] = $request->firstname;
			$staffdata['lastname'] = $request->lastname;
			$staffdata['email'] = $request->email;
			$staffdata['contact_number'] = $request->contact_number;
			if($request->is_mobile == 1)
				$staffdata['photo'] = $request->photo;
			else
			{
				$file = Input::file('photo');
				if($file)
				{
					//Upload staff photo
					$destinationPath = public_path().'/staffphotos';			
					$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
					$photo = $timestamp."_123_".$file->getClientOriginalName();
					$upload_success = Input::file('photo')->move($destinationPath, $photo);
				}
				$staffdata['photo'] = $photo;
			}
			$staffdata['personalhashtag'] = $request->personalhashtag;
			$staffdata['country_id'] = $request->country_id;
			$staffdata['role_id'] = $request->role_id;
			$staffdata['company_id'] = $request->company_id;
			$staffdata['job_position'] = $request->job_position;
			$staffdata['report_to'] = $request->report_to;
			
			$last_id = DB::table('staffs')->insertGetId($staffdata);
			$orgchartdata['orgchart_staff_id'] = $last_id;
			$orgchartdata['orgchart_report_to'] = $request->report_to;
			$orgchartdata['orgchart_company_id'] = $request->company_id;
			DB::table('orgchart')->insert($orgchartdata);
			$staff_id = 0;
			$lastinsres = DB::table('staffs')->where('status', '0')->orderBy('staff_id', 'desc')->skip(0)->take(1)->get();
			if($lastinsres)
			{
				$staff_id = $lastinsres[0]->staff_id;
			}
			
			$userdata['staffs_id'] = $staff_id;
			$userdata['company_id'] = $request->company_id;
			$userdata['username'] = $request->username;
			$userdata['password'] = base64_encode($request->password);
			
			DB::table('users')->insert($userdata);
			
			if($request->is_mobile == 1) {
				$msg = array(array('Error' => '0','result'=>'Staff details created successfully'));			
				return response()->json(['msg'=>$msg]);
			}
			else {
				$session = new Session();
				// set flash messages
				$session->getFlashBag()->add('staff_created', 'User details created successfully');
				return redirect('/staff');	
			}
		}
		else
		{
			if($request->is_mobile == 1) {
				$msg = array(array('Error' => '1','result'=>'Username alaready exist!'));			
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
		$session = new Session();
		$ses_company_id = $session->get('ses_company_id');
		$ses_login_id = $session->get('ses_login_id');
		$staffdetails = Staff::where('staff_id',$id)->get();
		$countries = DB::table('countries')->get();		

		
		if($ses_login_id == 1) {
			$reportto = Staff::where('status', '0')->where('non_user', '0')->get();
			$companies = CompanyGroup::where('deletestatus', '0')->get();
		}
		else {		
			$reportto = Staff::where('status', '0')->where('company_id', $staffdetails[0]->company_id)->where('non_user', '0')->where('staff_id','!=',$id)->get();		
			if(count($staffdetails) > 0) {				
				$companies = CompanyGroup::where('deletestatus', '0')->where('companygroup_id', $staffdetails[0]->company_id)->get();
			}
		}
		if($ses_company_id == 1)
			$roles = DB::table('roles')->where('deletestatus', '0')->get();
		else {
			$roles = DB::table('roles')->where('deletestatus', '0')->where('role_id','!=','1')->get();
		}
		$users = DB::table('users')->where('staffs_id', $id)->get();
		
		$realpwd = base64_decode($users[0]->password);
		
		return view('Staff.edit',['staffdetails' => $staffdetails, 'ses_login_id'=>$ses_login_id,'countries'=>$countries, 'companies' => $companies, 'reportto' => $reportto, 'companyid' => $ses_company_id, 'roles' => $roles, 'username' => $users[0]->username, 'realpwd' => $realpwd]);
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
		//print_r($request->all()); exit;
		
		$staffupdate = Staff::where('staff_id', $request->staff_id)->get();
		
		if($staffupdate->count() > 0 ) {
			
			$photo = '';
			$timezone = new Timezone;
			if( $request->input('timezoneoffset')){		
				$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
				$staffdata['timezone'] = $timezonename;
			}else{		
				$staffdata['timezone'] ='';
			}
			if($request->current_datetime){
				$current_datetime=$request->current_datetime;				
				$staffdata['updatedon'] =$current_datetime;
			}else{
				$current_datetime= date('Y-m-d H:i:s');			
				$staffdata['updatedon'] =$current_datetime;
			}
			$staffdata['staff_id'] = $request->staff_id;
			$staffdata['firstname'] = $request->firstname;
			$staffdata['lastname'] = $request->lastname;
			$staffdata['email'] = $request->email;
			$staffdata['contact_number'] = $request->contact_number;
			if($request->is_mobile == 1)
				$photo = $request->photo;
			else
			{
				$file = Input::file('photo');
				if($file)
				{
					//Upload staff photo
					$destinationPath = public_path().'/staffphotos';			
					$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
					$photo = $timestamp."_123_".$file->getClientOriginalName();
					$upload_success = Input::file('photo')->move($destinationPath, $photo);					
				}				
			}
			if($photo != '')
				$staffdata['photo'] = $photo;
			else
			{
				$staff = Staff::where('staff_id', $request->staff_id)->select('photo')->get();
				if($staff) { $staffdata['photo'] = $staff[0]->photo; }
			}
			$staffdata['personalhashtag'] = $request->personalhashtag;
			$staffdata['country_id'] = $request->country_id;
			$staffdata['role_id'] = $request->role_id;
			$staffdata['company_id'] = $request->company_id;
			$staffdata['job_position'] = $request->job_position;
			$staffdata['report_to'] = $request->report_to;
			
			DB::table('staffs')->where('staff_id', $request->staff_id)->update($staffdata);
						
			$userdata['staffs_id'] = $request->staff_id;
			$userdata['company_id'] = $request->company_id;
			$userdata['username'] = $request->username;
			$userdata['password'] = base64_encode($request->password);
			
			DB::table('users')->where('staffs_id', $request->staff_id)->update($userdata);
			
			//Staff::find($request->staff_id)->update($request->all());
			
		}
		
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Staff details updated successfully'));
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session = new Session();
			$session->getFlashBag()->add('staff_updated', 'User details updated successfully');
			return redirect('/staff')->with('alert','Staff details updated successfully');
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
        DB::table('staffs')->where('staff_id', $id)->update(array('status' => '1'));
		DB::table('users')->where('staffs_id', $id)->update(array('deletestatus' => '1'));
		$staffs = Staff::where('status', '0')->orderBy("staff_id","desc")->get();
		if($ismobile == 0) {			
			$session->getFlashBag()->add('staff_deleted','User deleted successfully');
			return redirect('/staff');
		}
		else {
			$msg = array(array('Error' => '0','result'=>'User deleted successfully'));
			return response()->json(['staffs' => $staffs, 'msg'=>$msg]);
		}
	}

	public function checkusernameexists(Request $request)
	{
		$result = 0;
		$id = $request->id;
		$type = $request->type;
		$chkname = $request->username;
		
		if($type == "insert")
			$chkexist = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.username', $chkname)->where('staffs.status', '0')->get();
		else
			$chkexist = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.username', $chkname)->where('staffs.status', '0')->where('staffs.staff_id', '!=', $id)->get();
			
		if(count($chkexist) > 0) {			
			$result = 1;
		} else {
			$chkname = strtolower($chkname);
			if($chkname == "denyo" || $chkname == "dum" || $chkname == "dsg" || $chkname == "denyo singapore") {
				$result = 1;
			}
		}
		echo $result;
	}
	
	
//report to in create staff and edit
	public function getstaffs(Request $request)
	{		
		$ses_company_id = $request->company_id;
		$ses_login_id = $request->loginid;	
		/*if($ses_company_id == 1) {	
			//$staffs = Staff::where('status', '0')->where('non_user', '0')->where('staff_id', '!=', $ses_login_id)->get();
			$staffs = Staff::where('status', '0')->where('non_user', '0')->get();
		}
		else {			
			$staffs = Staff::where('status', '0')->where('company_id', $ses_company_id)->where('non_user', '0')->get();
		}*/

		$staffs = Staff::where('status', '0')->where('company_id', $ses_company_id)->where('non_user', '0')->get();

		return response()->json(['TotalCount'=>count($staffs),'staffslist' => $staffs]);
	}

	public function getroles(Request $request)
	{
		$companyid = $request->companyid;
		if($companyid == 1)
			$roles = DB::table('roles')->where('deletestatus', '0')->get();
		else
			$roles = DB::table('roles')->where('deletestatus', '0')->where('role_id', '!=', '1')->get();
		return response()->json(['roles' => $roles]);
	}

	public function getcompanies(Request $request)
	{
		$loginid = $request->loginid;
		//$companyid = $request->companyid;
		$page = $request->pagename;
		$staffs = DB::table('staffs')->where('staff_id', $loginid)->get();
		if(count($staffs) > 0) { $companyid = $staffs[0]->company_id; }
		if($loginid == 1 || $companyid == 1)
			$companies = CompanyGroup::where('deletestatus', '0')->get();
		else
		{
			$staff = Staff::where('staff_id', $loginid)->select('company_id')->get();
			if($staff) { 
				if($page == "orgchart") {
					$companies = CompanyGroup::where('deletestatus', '0')->whereIn('companygroup_id', [1, $staff[0]->company_id])->get();
				} else {
					$companies = CompanyGroup::where('deletestatus', '0')->where('companygroup_id', $staff[0]->company_id)->get();
				}
			}
		}
		return response()->json(['companies' => $companies]);
	}

	public function checkusername(Request $request)
	{
		$chkname = $request->username;
		$id = $request->id;
		if($id != 0)
			$chkexist = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.username', $chkname)->where('staffs.status', '0')->where('staffs.staff_id', '!=', $id)->get();
		else
			$chkexist = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.username', $chkname)->where('staffs.status', '0')->get();
		if(count($chkexist) > 0)
		{
			$msg = array(array('Error' => '1','result'=>'Username already exists/Cannot be Denyo, DSG, DUM, Denyo Singapore!'));			
			return response()->json(['msg'=>$msg]);
		}
		else
		{
			$chkname = strtolower($chkname);
			if($chkname == "denyo" || $chkname == "dum" || $chkname == "dsg" || $chkname == "denyo singapore") {
				$msg = array(array('Error' => '0','result'=>'Username already exists/Cannot be Denyo, DSG, DUM, Denyo Singapore!'));			
				return response()->json(['msg'=>$msg]);
			} else {
				$msg = array(array('Error' => '0','result'=>'Username Available!'));			
				return response()->json(['msg'=>$msg]);
			}
		}
	}
	
	public function profile(Request $request) {	
		$session = new Session();
		$ses_company_id = $session->get('ses_company_id');
		$ses_login_id = $session->get('ses_login_id');

		//echo $loggedin_staff_id;
		if($request->is_mobile == 1) {
			$loggedin_staff_id = $request->loggedin_id;
		}
		else 
			$loggedin_staff_id = $ses_login_id;
		
		$destinationPath = public_path().'/staffphotos';			
		$settings = DB::table('staffs')
            ->join('users', 'users.staffs_id', '=', 'staffs.staff_id')
            ->join('roles', 'roles.role_id', '=', 'staffs.role_id')
            ->join('countries', 'countries.id', '=', 'staffs.country_id')
            ->join('companygroups','companygroup_id','=','staffs.company_id')
			->where('staff_id',$loggedin_staff_id)
			->where('status', 0)
			->select('staffs.firstname', 'staffs.lastname', 'staffs.email', 'staffs.createdby', 'staffs.job_position', 'users.username', 'users.password', 'countries.country_name', 'roles.role_name', 'staffs.photo', 'staffs.contact_number', 'staffs.country_id', 'staffs.company_id','companygroups.companygroup_name','staffs.report_to', 'staffs.personalhashtag')
            		->get();
		//$settings = DB::table('staffs')->join('roles','roles.role_id','=','staffs.role_id')->where('staff_id',$loggedin_staff_id)->get();
		$settings_arr = array();
		foreach($settings as $key => $settin) {
			//echo $settin->createdby;
			$settings_arr[$key]['firstname'] = $settin->firstname;
			$settings_arr[$key]['lastname'] = $settin->lastname;
			$settings_arr[$key]['email'] = $settin->email;
			$settings_arr[$key]['job_position'] = $settin->job_position;
			$settings_arr[$key]['username'] = $settin->username;
			$settings_arr[$key]['password'] = base64_decode($settin->password);
			$settings_arr[$key]['country_name'] = $settin->country_name;
			$settings_arr[$key]['country_id'] = $settin->country_id;
			$settings_arr[$key]['company_id'] = $settin->company_id;
			$settings_arr[$key]['role_name'] = $settin->role_name;
			$settings_arr[$key]['photo_filename'] = $settin->photo;
			$settings_arr[$key]['contact_number'] = $settin->contact_number;
			$settings_arr[$key]['personalhashtag'] = $settin->personalhashtag;
			$account_createdby = Staff::where('staffs.createdby',$settin->createdby)->select('firstname AS Account_createdby')->take(1)->get();
			$settings_arr[$key]['Account createdby'] = $account_createdby[0]->Account_createdby;
			$settings_arr[$key]['Company Group'] = $settin->companygroup_name;
			$settings_arr[$key]['company_group'] = $settin->companygroup_name;
			$settings_arr[$key]['report_to'] = $settin->report_to;

		}
		//$settings['createdby'] = Staff::where('staffs.createdby',$settings[0]->createdby)->select('firstname')->get();
		
		if($request->is_mobile == 1) {
			return response()->json(['msg'=>array('result'=>'Success!'),'settings'=>$settings_arr]);
		}
		else			
			return view('Staff.profile',['settings'=>$settings_arr,'destinationPath'=>$destinationPath]);		
	}
	
	
	public function profileupdate(Request $request) {
		$session = new Session();		
		$loggedin_staff_id = $session->get('ses_login_id');
		
		if($request->is_mobile == 1) {
			$loggedin_staff_id = $request->loggedin_id;
		}
		//mdv					
			$photo = '';
			// $staffdata['staff_id'] = $request->staff_id;
			 $staffdata['firstname'] = $request->firstname;
			 $staffdata['lastname'] = $request->lastname;
			 $staffdata['email'] = $request->email;
			 $staffdata['contact_number'] = $request->contact_number;
			if($request->is_mobile == 1)
				$staffdata['photo'] = $request->photo;
			else
			{
				$file = Input::file('photo');
				if($file)
				{
					//Upload staff photo
					$destinationPath = public_path().'/staffphotos';			
					$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
					$photo = $timestamp."_123_".$file->getClientOriginalName();
					$upload_success = Input::file('photo')->move($destinationPath, $photo);
					$staffdata['photo'] = $photo;
				}				
			}
			 $staffdata['personalhashtag'] = $request->personalhashtag;
			 if($request->country_id>0){
			 $staffdata['country_id'] = $request->country_id;
			 }

			 if($request->report_to>0){
			 $staffdata['report_to'] = $request->report_to;
			 }
			 if($request->company_id>0){
				$staffdata['company_id'] = $request->company_id;
				}
			 $staffdata['job_position'] = $request->job_position;
			 DB::table('staffs')->where('staff_id', $loggedin_staff_id)->update($staffdata);
						
			 $userdata['username'] = $request->username;
			 $userdata['password'] = base64_encode($request->password);
			
			 DB::table('users')->where('staffs_id', $loggedin_staff_id)->update($userdata);
			
			//Staff::find($request->staff_id)->update($request->all());
			
		
		//mdv
		
		// DB::table('users')
            // ->where('staffs_id', $loggedin_staff_id)
            // ->update(['username' => $request->username,'password'=>base64_encode($request->password)]);			
		//Staff::find($loggedin_staff_id)->update($request->all());
		$settings = DB::table('staffs')
            ->join('users', 'users.staffs_id', '=', 'staffs.staff_id')
            ->join('roles', 'roles.role_id', '=', 'staffs.role_id')
            ->join('countries', 'countries.id', '=', 'staffs.country_id')
			->where('staff_id',$loggedin_staff_id)
			->select('staffs.firstname','staffs.lastname','staffs.email','staffs.createdby','job_position','users.username','users.password','countries.country_name','roles.role_name','staffs.photo')
			//->select('staffs.createdby')			
            ->get();
		

		//$settings = DB::table('staffs')->join('roles','roles.role_id','=','staffs.role_id')->where('staff_id',$loggedin_staff_id)->get();
		$settings_arr = array();
		foreach($settings as $key => $settin) {
			//echo $settin->createdby;
			$settings_arr[$key]['firstname'] = $settin->firstname;
			$settings_arr[$key]['lastname'] = $settin->lastname;
			$settings_arr[$key]['email'] = $settin->email;
			$settings_arr[$key]['job_position'] = $settin->job_position;
			$settings_arr[$key]['username'] = $settin->username;
			$settings_arr[$key]['password'] = $settin->password;
			$settings_arr[$key]['country_name'] = $settin->country_name;
			$settings_arr[$key]['role_name'] = $settin->role_name;
			$settings_arr[$key]['photo_filename'] = $settin->photo;
			//$settings_arr[$key]['createdby'] = Staff::where('staffs.createdby',$settin->createdby)->select('firstname AS account createdby')->take(1)->get();
		}

		
		if($request->is_mobile == 1) {					
			$msg = array('result'=>'Success!');						
			return response()->json(['msg'=>$msg,'settings'=>$settings_arr]);
		}
		else {
			$session->getFlashBag()->add('userprofile_updated', 'Profile updated successfully');
			return redirect('/settings/profile');			
		}
    }
	
	//web 
	public function editprofile(Request $request) {
		$session = new Session();		
		$loggedin_staff_id = $session->get('ses_login_id');
			//photo upload		
			
			$photo = '';
				$file = Input::file('photo');
				if($file)
				{
					//Upload staff photo
					$destinationPath = public_path().'/staffphotos';			
					$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
					$photo = $timestamp."_123_".$file->getClientOriginalName();
					$upload_success = Input::file('photo')->move($destinationPath, $photo);
					//$staffdata['photo'] = $photo;
				}				
			//}
	
			$userdata['company_id'] = $request->company_id;
			$userdata['username'] = $request->username;
			$userdata['password'] = md5($request->password);
			
			DB::table('users')->where('staffs_id', $request->staff_id)->update($userdata);
			

		$settings = DB::table('staffs')
            ->join('users', 'users.staffs_id', '=', 'staffs.staff_id')
            ->join('roles', 'roles.role_id', '=', 'staffs.role_id')
            ->join('countries', 'countries.id', '=', 'staffs.country_id')
			->where('staff_id',$loggedin_staff_id)
			->select('staffs.firstname','staffs.lastname','staffs.email','staffs.createdby','job_position','users.username','users.password','countries.country_name','roles.role_name','staffs.photo','staffs.contact_number','staffs.country_id','staffs.personalhashtag')
			//->select('staffs.createdby')
            ->get();
		$countries = DB::table('countries')->select('id','country_name')->get();
		//$settings = DB::table('staffs')->join('roles','roles.role_id','=','staffs.role_id')->where('staff_id',$loggedin_staff_id)->get();
		$settings_arr = array();
		foreach($settings as $key => $settin) {
			//echo $settin->createdby;
			$settings_arr[$key]['staffid'] = $loggedin_staff_id;
			$settings_arr[$key]['firstname'] = $settin->firstname;
			$settings_arr[$key]['lastname'] = $settin->lastname;
			$settings_arr[$key]['email'] = $settin->email;
			$settings_arr[$key]['job_position'] = $settin->job_position;
			$settings_arr[$key]['username'] = $settin->username;
			$settings_arr[$key]['password'] = base64_decode($settin->password);
			$settings_arr[$key]['country_id'] = $settin->country_id;
			$settings_arr[$key]['country_name'] = $settin->country_name;
			$settings_arr[$key]['role_name'] = $settin->role_name;
			$settings_arr[$key]['photo_filename'] = $settin->photo;
			$settings_arr[$key]['contact_number'] = $settin->contact_number;
			$settings_arr[$key]['personalhashtag'] = $settin->personalhashtag;
			//$settings_arr[$key]['createdby'] = Staff::where('staffs.createdby',$settin->createdby)->select('firstname AS account createdby')->take(1)->get();
		}		
		return view('Staff.editprofile',['settings_arr'=>$settings_arr,'countries'=>$countries]);				
	}
	
	public function messagehashtags(Request $request)
	{
		$ses_login_id = $request->loginid;
		$company_id = $request->companyId;
		$staffids = '';
		if($company_id == 1)
			$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('company_id', $company_id)->where('staff_id', '!=', $ses_login_id)->get();
		else
			$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('company_id', $company_id)->where('staff_id', '!=', $ses_login_id)->get();
			
		if($staffs)
		{
			
			$companygroups = array();
			if(count($staffs) > 0)
			{
				$i = 0;
				foreach($staffs as $cgroup)
				{
					$companygroups[$i]['user_id'] = $cgroup->staff_id;
					$companygroups[$i]['username'] = substr($cgroup->personalhashtag, 1, strlen($cgroup->personalhashtag));
					$companygroups[$i]['name'] = " ".$cgroup->firstname." ".$cgroup->lastname;
				
					++$i;
				}
			}
		
		}
		$msg = array('result'=>'Success!');						
		return response()->json(['msg'=>$msg,'staffs'=>$companygroups]);
	}
	
	public function hashtags(Request $request) {
	
		$ses_login_id = $request->login;
		$company_id = $request->companyid;
		$staffids = '';
		
		$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('company_id', $company_id)->where('staff_id', '!=', $ses_login_id)->get();
		
		if($staffs)
		{
			
			$companygroups = array();
			if(count($staffs) > 0)
			{
				$i = 0;
				foreach($staffs as $cgroup)
				{
					$companygroups[$i]['user_id'] = $cgroup->staff_id;
					$companygroups[$i]['username'] = substr($cgroup->personalhashtag, 1, strlen($cgroup->personalhashtag));
					$companygroups[$i]['name'] = " ".$cgroup->firstname." ".$cgroup->lastname;
				
					++$i;
				}
			}
		
		}
		$msg = array('result'=>'Success!');						
		return response()->json(['msg'=>$msg,'staffs'=>$companygroups]);	
	}

	public function alarmhashtags(Request $request) {
	
		$ses_login_id = $request->login;
		$company_id = $request->companyid;
		$staffids = '';
		
		$staffs = DB::table('staffs')->where('status', 0)->where('non_user', 0)->where('company_id', $company_id)->get();
		
		if($staffs)
		{
			
			$companygroups = array();
			if(count($staffs) > 0)
			{
				$i = 0;
				foreach($staffs as $cgroup)
				{
					$companygroups[$i]['user_id'] = $cgroup->staff_id;
					$companygroups[$i]['username'] = substr($cgroup->personalhashtag, 1, strlen($cgroup->personalhashtag));
					$companygroups[$i]['name'] = " ".$cgroup->firstname." ".$cgroup->lastname;
				
					++$i;
				}
			}
		
		}
		$msg = array('result'=>'Success!');						
		return response()->json(['msg'=>$msg,'staffs'=>$companygroups]);	
	}

	public function companystaffs(Request $request)
	{
		$stafflist = '';
		$id = $request->companyid;
		$userid = $request->userid;
		$staffs = Staff::where('status', '0')->where('company_id', $id)->where('non_user', '0')->get();
		if($staffs)
		{
			foreach($staffs as $staff) {
				if($staff->staff_id == $userid && $staff->report_to == '0')
					$stafflist[] = $staff->staff_id.'|N/A';
				else
					$stafflist[] = $staff->staff_id.'|'.$staff->firstname.' '.$staff->lastname;
			}
			if($stafflist)
				$stafflist = @implode("#", $stafflist);
		}
		echo $stafflist;
	}
	
	public function staffs_orgchartreportto(Request $request)
	{
		$stafflist = '';
		$id = $request->companyid;
		$userid = $request->userid;
		$staffs = Staff::where('status', '0')->where('company_id', $id)->get();
		if($staffs)
		{
			foreach($staffs as $staff) {
				if($staff->staff_id == $userid && $staff->report_to == '0')
					$stafflist[] = $staff->staff_id.'|N/A';
				else
					$stafflist[] = $staff->staff_id.'|'.$staff->firstname.' '.$staff->lastname;
			}
			if($stafflist)
				$stafflist = @implode("#", $stafflist);
		}
		echo $stafflist;
	}

}

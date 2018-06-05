<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\User;
use App\Staff;
use Auth;
use DB;
use Mail;
use Symfony\Component\HttpFoundation\Session\Session;

class LoginController extends Controller {
	public function index()
	{
		$session = new Session();
		$ses_login_id = $session->get('ses_login_id');
		$mainmenu = $session->get('mainmenu');
		$roleaccess = DB::table('parent_module')->where('id',$mainmenu[0])->get();
		if(!$ses_login_id) {
			return view('login');
		}
		else {
			if(count($roleaccess) > 0) {
				return redirect('/'.strtolower($roleaccess[0]->name));
			}
		}		
	}
	
	public function checklogin(Request $request)
	{
		$roledata = '';
		if(!empty($request->input()))
		{
			$username = $request->input('username');
			$password = $request->input('password');
			$devicetoken = $request->input('device_token');
			$isapp = $request->input('isapp');
			if($password)
			{
				$password = base64_encode($password);
			}			
			//$staffs = DB::select('CALL checkLogin(?, ?)', array($username, $password));
			$staffs = DB::table('staffs')->join('users', 'users.staffs_id', '=', 'staffs.staff_id')->where('staffs.status','0')->join('companygroups','staffs.company_id','=','companygroups.companygroup_id')->where('users.username', $username)->where('users.password', $password)->where('companygroups.deletestatus', '0')->get();
			if(count($staffs) > 0)
			{
				$submenu = $leftmenu = $parentmenu = $childmenu = $footermenu = $roleactionpermissiondata = '';
				$parents = $childs = '';
				$staffdetails = $staffs[0];
				$session = new Session();
				//$session->set('ses_login_id', $staffdetails->staff_id);
				$session->set('ses_login_id', $staffdetails->staff_id);
				$session->set('ses_firstname', $staffdetails->firstname);
				$session->set('ses_lastname', $staffdetails->lastname);
				$session->set('ses_company_id', $staffdetails->company_id);
				$session->set('role_id', $staffdetails->role_id);
				$parentmodules = DB::table('parent_module')->get();
				if($staffdetails->role_id != 0) {
					$roledata = DB::table('role_permissions')->where('role_id',$staffdetails->role_id)->orderByRaw("FIELD(module_name, '1', '3', '2', '5', '4', '6') ASC")->get();					
				}
				if($staffdetails->company_id != 0)
				{
					 $companyname=DB::table('companygroups')->where('companygroup_id',$staffdetails->company_id)->get();
					 $session->set('company_group_name', $companyname[0]->companygroup_name);
				}
				if(count($roledata) > 0) {
					$r = 0;
					$permissiondata = '';
					foreach($roledata as $rdata) {	
						$mainmodulename = $submodulename = '';					
						$parents[] = $rdata->module_name;
						$childs[] = $rdata->page_name;
						$mainmodule = DB::table('parent_module')->where('id', $rdata->module_name)->get();
						$submodule = DB::table('child_module')->where('child_id', $rdata->page_name)->where('parent_id', $rdata->module_name)->get();
						if(count($mainmodule) > 0) {
							$mainmodulename = str_replace(' ', '', strtolower($mainmodule[0]->name));
						}
						if(count($submodule) > 0) {
							$submodulename = str_replace(' ', '', strtolower($submodule[0]->child_name));
						}
						$permissiondata[] = $mainmodulename.'_'.$submodulename.'_view:'.$rdata->view_action.','.$mainmodulename.'_'.$submodulename.'_create:'.$rdata->create_action.','.$mainmodulename.'_'.$submodulename.'_edit:'.$rdata->edit_action.','.$mainmodulename.'_'.$submodulename.'_delete:'.$rdata->delete_action.','.$mainmodulename.'_'.$submodulename.'_hide:'.$rdata->hide_action;
						//$roleactionpermissiondata[$r][] = $permissiondata;
						//$roleactionpermissiondata[$r] = $permissiondata;
						//++$r;
					}
					if($permissiondata && is_array($permissiondata)) {
						foreach($permissiondata as $data) {
							$roleactionpermissiondata[$r][] = $data;
							++$r;
						}
					}
					
					if(!$parents) { $parents = []; }
					if(!$childs) { $childs = []; }
					
					$parentpage = array_unique($parents);
					
					$m = 0;
					foreach($parentpage as $parent) {
						$parent_viewcount = DB::table('role_permissions')->where('module_name',$parent)->where('view_action','1')->where('role_id',$staffdetails->role_id)->get();	
						$submenu = '';							
						$parentm = DB::table('parent_module')->where('id', $parent)->get();
						if(count($parent_viewcount) > 0) {							
							$mainmenu[] = $parent_viewcount[0]->module_name;
							$leftmenu[$m]['title'] = $parentm[0]->name;
							$leftmenu[$m]['icon'] = str_replace(' ', '', strtolower($parentm[0]->name));
							$child = DB::table('child_module')->where('parent_id', $parent)->get();
							if(count($child) > 0 && $parentm[0]->name != "Dashboard" && $parentm[0]->name != "Calendar" && $parentm[0]->name != "Reports" && $parentm[0]->name != "Messages") {								
								$x = 0;
								foreach($child as $chd) {
									$child_viewcount = DB::table('role_permissions')->where('module_name',$parent)->where('page_name',$chd->child_id)->where('view_action', '1')->where('role_id', $staffdetails->role_id)->get();
									if(count($child_viewcount) > 0 && $chd->child_name != "Alarm" && $chd->child_name != "Servicing Info" && $chd->child_name != "Comments") {
										$submenu[$x]['title'] = $chd->child_name;
										$submenu[$x]['component'] = ucfirst(str_replace(' ', '', strtolower($chd->child_name))).'Page';
										++$x;
									}
								}
								$leftmenu[$m]['subs'] = $submenu;
							}							
							++$m;
							if($parent != 5) {
								if($parent == 6 && count($child) > 0) {
									$childview = DB::table('role_permissions')->where('module_name',$parent)->where('page_name','6')->where('view_action', '1')->where('role_id', $staffdetails->role_id)->get();
									if(count($childview) > 0) {
										$footermenu[] = 1;
									} else {
										$footermenu[] = 0;
									}
								} else {
									$footermenu[] = 1;
								}
							}
						} else {
							if($parent != 5) {
								$footermenu[] = 0;
							}
						}												
					}	
					$leftmenu[$m]['title'] = 'Logout';
					$leftmenu[$m]['icon'] = 'logout';
					$session->set('mainmenu',$mainmenu);
					if($footermenu && is_array($footermenu)) {
						$footermenu = @implode(',', $footermenu);
					}
				}
				//echo "<pre>";
				//print_r($leftmenu); exit;
				$msg = array(array('result' => 'success'));
				if($isapp == 0)
				{	
					$redirectto = $session->get('mainmenu');
					if(count($redirectto) > 0) {
						$roleaccess = DB::table('parent_module')->where('id',$redirectto[0])->get();
						return redirect(strtolower($roleaccess[0]->name));
					}
				}
				else
				{						
					if($devicetoken != '' && $devicetoken != 'null')
					{			
						$findToken = DB::table('devicetokens')->where('staffid',$staffdetails->staff_id)->get();
						if(count($findToken))
						{					
							$tokendev = DB::table('devicetokens')->where('staffid', $staffdetails->staff_id)->update(array('deviceid' => $devicetoken));
						}
						else
						{
							$tokendev = DB::table('devicetokens')->insert(array('staffid' => $staffdetails->staff_id,'deviceid' => $devicetoken));
						}
					}
					
					
					return response()->json(['msg' => $msg, 'staffdetails' => $staffs,'roledata'=>$roledata, 'leftmenu' => $leftmenu, 'footermenu' => $footermenu, 'roleactionpermissiondata' => $roleactionpermissiondata]);
				}
			}
			else
			{			
				if($isapp == 0)
				{
					$session = new Session;					
					$session->set('error', 'Invalid Login Credentials!');
					return redirect('/');
				}
				else
				{
					$staffs = array(array(''));
					$msg = array(array('Error' => '1','result'=>'Invalid Login Credentials!'));
					return response()->json(['msg' => $msg, 'staffdetails' => $staffs]);
				}
			}		
		}
		else
		{
			return redirect('/');
		}		
	}
	public function logout()
	{
		$session = new Session;
		Auth::logout();	
		$session->set('ses_login_id', '');
		$session->set('ses_company_id', '');
		$session->set('error', '');
		return redirect('/');
	}

	public function moblogout($id)
	{
		DB::table('devicetokens')->where('staffid', $id)->delete();
		$msg = array(array('Error' => '0','result'=>'Logout Success'));
		return response()->json(['msg' => $msg]);
	}
	
	function forgetpassword() {
		return view('forgetpassword');
	}
	
	function forgetpassprocess(Request $request) {
		$session = new Session;
		$username = $request->username;		
		$useremail = $request->useremail;
		
//		$checkusername = User::where('usernam',$username)->get()->count();
		$checkusername = DB::table('users')->where('username',$username)->get();
		$checkuseremail = DB::table('staffs')->where('email',$useremail)->where('status', 0)->get();	
		$chkvalid = 0;	
		if(count($checkusername) > 0 && count($checkuseremail) > 0) { //Valid user
			
			if($checkuseremail[0]->staff_id == $checkusername[0]->staffs_id) {
				$chkvalid = 1;
				$userdetails = DB::table('users')->where('username',$username)->select('password')->get();
				$subject = 'Denyo App Forget Password';
				$content = 'Welcome to denyo <br/>';
				$content .= 'Your Password: <b>' . base64_decode($userdetails[0]->password) . '</b>';
				$data = array( 'subject' => $subject, 'content' => $content );		
				Mail::send('emails.service', $data, function ($m) use ($data, $useremail)  {
					$m->from('cip@stridececommerce.com', 'Denyo');				
					$m->to($useremail, '')->subject($data['subject']);
				});
				if($request->is_mobile == 1) {
					$msg = array(array('Error'=>'0','result' => 'success'));
					return response()->json(['msg' => $msg]);
				}
				else {
					//$request->session()->flash('passwordemailsent', 'Task was successful!');
					$session->set('passwordemailsent', 'Password sent to your Email id.');
					return redirect('/');				
				}
			}
		}
		if($chkvalid == 0) {	
			
			if($request->is_mobile == 1) {				
				$msg = array(array('Error' => '1','result'=>'Invalid User!'));
				return response()->json(['msg' => $msg]);				
			}
			else {
				$session->set('invalidforgetpassword', 'Invalid username / Email');
				return redirect('/');
			}
		}
	}

	public function getrandomvalue() {
		$rand = rand(280, 440);
		return response()->json(['volt1' => $rand]);
	}

	public function changepassword(Request $request) {
		$loginid = $request->loginid;
		$oldpassword = $request->oldpassword;
		$oldpassword = base64_encode($oldpassword);
		$chkuser = DB::table('users')->where('staffs_id', $loginid)->where('password', $oldpassword)->get();
		if(count($chkuser) > 0) {
			$newpass = $request->newpassword;
			$password = base64_encode($newpass);
			DB::table('users')->where('staffs_id', $loginid)->update(array('password' => $password));
			$msg = array(array('Error' => '0','result'=>'Password successfully changed!'));
			return response()->json(['msg' => $msg]);
		} else {
			$msg = array(array('Error' => '1','result'=>'Invalid old password!'));
			return response()->json(['msg' => $msg]);
		}
		
	}

} //class
?>

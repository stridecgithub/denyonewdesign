<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\DataTables\RoleDataTable;
use App\Role;
use App\Timezone;
use Yajra\Datatables\Datatables;
use Symfony\Component\HttpFoundation\Session\Session;

class RoleController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, RoleDataTable $dataTable) {        
		$orderByDir = $request->role_name;
		
		$roles = DB::table('roles')->orderBy('role_name',$orderByDir)->where('deletestatus', 0)->get();
			
        if ($request->is_mobile == 1) {
			
            $msg = array('result'=>'success');
	    return response()->json(['msg' => $msg, 'roles' => $roles]);
        } else {
            return $dataTable->render('Role.index');
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        $parent_mod = DB::table('parent_module')->get();
        return view('Role.create', ['parent_mod' => $parent_mod]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
		$timezone = new Timezone;
		if( $request->input('timezoneoffset')){		
			$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
			$roles['timezone'] = $timezonename;
		}else{		
			$roles['timezone'] ='';
		}
		if($request->current_datetime){
			$current_datetime=$request->current_datetime;
			$roles['createdon'] =$current_datetime;
			$roles['updatedon'] =$current_datetime;
		}else{
			$current_datetime= date('Y-m-d H:i:s');
			$roles['createdon'] =$current_datetime;
			$roles['updatedon'] =$current_datetime;
		}
		$session = new Session();
		$roles['role_name'] = $request->role_name;        
        $roles['createdby'] = 1;
        $roles['updatedby'] = 1;      
        $last_insertid = DB::table('roles')->insertGetId($roles);

        $permision['role_id'] = $last_insertid;	
		
		if($request->is_mobile == 1) {
			$modules = json_decode($request->module,true);
			foreach($modules as $module) {					
				foreach($module as $parentid => $parent)
				{								
					foreach($parent as $childid => $child) {
						
						if(isset($child['action_5'])) {
							$test = $child['action_5'];
						}
						else {
							$test = 0;
						}
						DB::table('role_permissions')->insert(
							array(
								'role_id' => $permision['role_id'],
								'module_name' => substr($parentid,7), 'page_name' => substr($childid,5),
								'view_action' => ($child['action_1'] ? '1' : '0'),
								'create_action' => ($child['action_2'] ? '1' : '0'),
								'edit_action' => ($child['action_3'] ? '1' : '0'),
								'delete_action' => ($child['action_4'] ? '1' : '0'),
								//'hide_action' => (isset($child['action_5']) ? '1' : '0')
								'hide_action' => $test
							)
						);
					}
				}			
			}
			$msg = array(array('Error' => '0','result'=>'User Role created successfully'));			
			return response()->json(['msg'=>$msg]);

		}	
		else {
        //
        $parent_mod = DB::table('parent_module')->get();        
        foreach ($parent_mod as $parents) {
            $childmod = DB::table('child_module')->where('parent_id', $parents->id)->get();
            foreach ($childmod as $child) {
					DB::table('role_permissions')->insert(
							array(
								'role_id' => $permision['role_id'],
								'module_name' => $parents->id, 'page_name' => $child->child_id,
								'view_action' => (in_array('1', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'create_action' => (in_array('2', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'edit_action' => (in_array('3', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'delete_action' => (in_array('4', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'hide_action' => (in_array('5', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0')
							)
					);
					
				
            }
        }
		//die;
		$session->getFlashBag()->add('userorle_created','User Role created successfully');
        return redirect('/role');
		}
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
				
		$roles = DB::table('roles')->where('role_id',$id)->get();
		
		$parent_mod = DB::table('parent_module')->get();
        return view('Role.edit', ['parent_mod' => $parent_mod,'role_id'=>$id,'roles'=>$roles]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request) {
		
        if($request->is_mobile == 1) {
				$timezone = new Timezone;
				if( $request->input('timezoneoffset')){		
					$timezonename=$timezone->getTimeZoneName($request->input('timezoneoffset'));
					$roles['timezone'] = $timezonename;
				}else{		
					$roles['timezone'] ='';
				}
				if($request->current_datetime){
					$current_datetime=$request->current_datetime;				
					$roles['updatedon'] =$current_datetime;
				}else{
					$current_datetime= date('Y-m-d H:i:s');
					
					$roles['updatedon'] =$current_datetime;
				}
			$roles['role_name'] = $request->role_name;                
			$roles['updatedby'] = 1;        
		
			DB::table('roles')->where('role_id',$request->role_id)->update($roles);
			
			$modules = json_decode($request->module,true);			
			foreach($modules as $module) {					
				foreach($module as $parentid => $parent)
				{															
					foreach($parent as $childid => $child) {						
						if(isset($child['action_5'])) {
							$test = $child['action_5'];
						}
						else {
							$test = 0;
						}
						DB::table('role_permissions')
						->where('role_id',$request->role_id)
						->where('module_name',substr($parentid,7))
						->where('page_name',substr($childid,5))->update(
						array(						
							'view_action' => ($child['action_1'] ? '1' : '0'),
							'create_action' => ($child['action_2'] ? '1' : '0'),
							'edit_action' => ($child['action_3'] ? '1' : '0'),
							'delete_action' => ($child['action_4'] ? '1' : '0'),
							'hide_action' => $test
							));
					}
				}			
			}
					$msg = array(array('Error' => '0','result'=>'User Role Updated successfully'));			
					return response()->json(['msg'=>$msg]);

		}
		else {
			$session = new Session();

			$roles['role_name'] = $request->role_name;
        
			$roles['updatedby'] = 2;
			
			$roles['updatedon'] = '2017-06-08 10:33:50';
			DB::table('roles')->where('role_id',$request->role_id)->update($roles);

			$parent_mod = DB::table('parent_module')->get();        
			foreach ($parent_mod as $parents) {
				$childmod = DB::table('child_module')->where('parent_id', $parents->id)->get();
				foreach ($childmod as $child) {				
					DB::table('role_permissions')->where('role_id',$request->role_id)->where('module_name',$parents->id)->where('page_name',$child->child_id)->update(
							array(                                                        
								'view_action' => (in_array('1', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'create_action' => (in_array('2', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'edit_action' => (in_array('3', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'delete_action' => (in_array('4', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0'),
								'hide_action' => (in_array('5', $request->input('module_' . $parents->id . '_' . $child->child_id)) ? '1' : '0')
							)
					);
				}
			}
			$session->getFlashBag()->add('userorle_updated','User Role updated successfully');
			return redirect('/role');

		}
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($id,$ismobile) {		
        Role::where('role_id',$id)->delete();
        DB::table('role_permissions')->where('role_id',$id)->delete();
		
		if($ismobile == 1) {
			$msg = array(array('Error' => '0','result'=>'User Role Delete successfully'));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session = new Session();
			$session->getFlashBag()->add('userorle_deleted','User Role Delete successfully');
			return redirect('/role');	
		}
    }
	
	function editrole(Request $request) {
		$roledata = DB::table('roles')->join('role_permissions', 'role_permissions.role_id', '=', 'roles.role_id')->where('roles.role_id',$request->role_id)->get();
		
		$msg = array(array('Error' => '0'));			
		return response()->json(['msg'=>$msg,'roledata'=>$roledata]);
		
	}

}

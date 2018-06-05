<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use DB;
Use App\EngineModels;
use Symfony\Component\HttpFoundation\Session\Session;
use App\DataTables\EnginemodelDataTable;
use Yajra\Datatables\Datatables;

class EnginemodelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request,EnginemodelDataTable $dataTable)
    {	
		if($request->is_mobile==1) {
      $msg = array('result'=>'success');
      $allmodel =EngineModels::where('deletestatus',0)->orderBy('model_id','desc')->get();	
			$modeldata = EngineModels::where('deletestatus',0)->orderBy('model_id','desc')->get();
			return response()->json(['msg' => $msg, 'totalCount'=>$allmodel->count(), 'modeldata' => $modeldata]);
		}
		else
		return $dataTable->render('Enginemodels.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {       
		return view('Enginemodels.create');
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
		EngineModels::insert(array('model'=>$request->model,'rawhtml'=>$request->rawhtml));
		
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Model created successfully'));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			// set flash messages
			$session->getFlashBag()->add('enginemodel_created', 'Engine models created successfully');
			return redirect('/enginemodel');
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
		$modeldetails = EngineModels::where('model_id',$id)->get();
		//echo htmlentities($modeldetails[0]->rawhtml); 
		//$formatdata = strip_tags($modeldetails[0]->rawhtml); 
		//die;
		return view('Enginemodels.show',['modeldetails'=>$modeldetails]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
		$modeldatas = EngineModels::where('model_id',$id)->get();
        return view('Enginemodels.edit',['modeldatas'=>$modeldatas]);
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
		DB::table('engine_models')->where('model_id',$request->model_id)->update(['model'=>$request->model,'rawhtml'=>$request->rawhtml]);
		if($request->is_mobile==1) {
			$msg = array(array('Error' => '0','result'=>'Model updated successfully'));
			return response()->json(['msg'=>$msg]);
		}
		else {
			// set flash messages
			$session->getFlashBag()->add('enginemodel_updated', 'Engine models updated successfully');			
			return redirect('/enginemodel');					
		}
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function destroy($id)
    // {
        // //
    // }
	
	function delete($id,$ismobile) {		
		$session = new Session();
		DB::table('engine_models')->where('model_id',$id)->update(['deletestatus'=>'1']);		
		if($ismobile == 0) {
			// set flash messages
			$session->getFlashBag()->add('enginemodel_deleted', 'Engine models deleted successfully');			
			return redirect('/enginemodel');
		}
		else {
			$modeldata = EngineModels::where('deletestatus',0)->get();
			$msg = array(array('Error' => '0','result'=>'Engine model deleted successfully'));
			return response()->json(['msg'=>$msg,'modeldata' => $modeldata]);
		}
	}
	
	function webview_enginedetails($id) {
		$modeldetails = EngineModels::where('model_id',$id)->get();
		return view('Enginemodels.webview_enginedetails',['modeldetails'=>$modeldetails]);
	}
	
}

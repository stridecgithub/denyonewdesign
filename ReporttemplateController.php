<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Reporttemplate;
use DB;
use Symfony\Component\HttpFoundation\Session\Session;

class ReporttemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
		//
		
		$session = new Session();	
		if($request->is_mobile == 1) {
			$companyid=$request->companyid;
		}else{
			$companyid=$session->get('ses_company_id');
			
		}
		$availabletemp = Reporttemplate::select('id','templatename','availableheading')->where('delete_status','0')->where('companygroupid',$companyid)->orderBy('id','desc')->get();
		
		if($request->is_mobile == 1) {
			$msg = array('result'=>'success');	
				
			return response()->json(['msg' => $msg,'availabletemp' => $availabletemp]);
		}
				else {
		return view('Reporttemplate.index',['availabletemp'=>$availabletemp]);			
				}
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
		$templatedatas = DB::table('reporttemplatedata')->select('availabledata')->get();
		
		return view('Reporttemplate.create',['templatedatas'=>$templatedatas]);
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
		$reporttemplate = new Reporttemplate;
		$reporttemplate->userid = $session->get('ses_login_id');
        $reporttemplate->date = date("Y-m-d H:i:s");		
		$reporttemplate->templatename = $request->templatename;
		
		 //$testarr = json_decode('[{"contact_name":"Kannan","contact_number":"9443976954"},{"contact_name":"Krishanth","contact_number":"9443976955"},{"contact_name":"Thibishanth","contact_number":"9443976956"},{"contact_name":"Logesh","contact_number":"9443976957"}]');
		
		if($request->is_mobile == 1) {
			$reporttemplate->companygroupid = $request->companygroupid;		
			$reporttemplate->userid = $request->ses_login_id;
			$arrAvailabledata = json_decode($request->data);	
			//if(count($arrAvailabledata) > 0) {
				foreach($arrAvailabledata as $key => $availabledata) {
					$arr_data[] = $arrAvailabledata[$key]->availabledata;
				}
				$reporttemplate->availableheading = implode('#',$arr_data);		
			//}
		}
		else
			$reporttemplate->availableheading = implode('#',$request->availabledata);	
			$reporttemplate->companygroupid = $session->get('ses_company_id');			
        
		$reporttemplate->save();				
		if($request->is_mobile == 1) {
			
			$msg = array(array('Error' => '0','result'=>'Report Template created successfully'));						
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session->getFlashBag()->add('reporttemplate_created','Report Template created successfully');
			return redirect('/reporttemplate');
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
        $availabletemp = Reporttemplate::select('id','templatename','availableheading')->where('delete_status','0')->where('id', $id)->get();
	return view('Reporttemplate.show',['availabletemp'=>$availabletemp]);			
	
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {		
		$reportdata = DB::table('reporttemplate')->where('id',$id)->get();
		$templatedatas = DB::table('reporttemplatedata')->select('availabledata')->get();
		return view('Reporttemplate.edit',['reportdata'=>$reportdata,'templatedatas'=>$templatedatas]);
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
	
		$reporttemplate = Reporttemplate::find($request->id);
		$reporttemplate->userid = $session->get('ses_login_id');
		if($request->is_mobile == 1) {
			$reporttemplate->userid = $request->ses_login_id;					
		}		

		
        $reporttemplate->date = date("Y-m-d H:i:s");		
		$reporttemplate->templatename = $request->templatename;
		$reporttemplate->id = $request->id;
		
		if($request->is_mobile == 1) {
			$arrAvailabledata = json_decode($request->data);
			foreach($arrAvailabledata as $key => $availabledata) {
				$arr_data[] = $arrAvailabledata[$key]->availabledata;
			}
			
			$reporttemplate->availableheading = implode('#',$arr_data);		
			
		}
		else
		$reporttemplate->availableheading = implode('#',$request->availabledata);		
        
		$reporttemplate->save();			

		//mdv
		
				if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Report details updated successfully'));
			return response()->json(['msg'=>$msg]);

				}
				else {
					$session->getFlashBag()->add('reporttemplate_updated','Report Template updated successfully');
		return redirect('/reporttemplate');
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
	
	public function delete($id,$ismobile) {
		$session = new Session();
		Reporttemplate::where('id', $id)->update(array('delete_status' => '1'));
		$reporttemp = Reporttemplate::where('delete_status', '0')->orderBy("id","desc")->get();
		
		if($ismobile == 0) {
			$session->getFlashBag()->add('template_deleted','Report Template deleted successfully');
			return redirect('/reporttemplate');
		}
		else {
			$msg = array('Error' => '0','result'=>'Template deleted successfully');
			return response()->json(['reporttemp' => $reporttemp, 'msg'=>$msg]);
		}

	}
	
	function getavailableheading() {
		$availableheading = DB::table('reporttemplatedata')->select('id', 'availabledata')->get();
		
		/*foreach($availableheading as $each) {
			$datas[] = $each->availabledata;			
		}
		$comm_datas = array(implode(',',$datas));*/
		$msg = array('result'=>'Success');
		return response()->json(['msg'=>$msg,'templatedata' => $availableheading]);			
	}
	
	public function reporttemplate_edit(Request $request) {
		$reporttemplate = Reporttemplate::find($request->id);
		// echo '<pre>';
// print_r($reporttemplate);
// die;
		$msg = array('result'=>'Success');
		return response()->json(['msg'=>$msg,'reporttemplate' => $reporttemplate]);			
	}
}

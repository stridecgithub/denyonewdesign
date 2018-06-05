<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reporttemplate extends Model
{
    //
	protected $table = 'reporttemplate';
//	protected $primaryKey = 'staff_id';
	
	// The attributes that are mass assignable	
	protected $fillable = ['userid','templatename','availableheading','companygroupid'];
		
	const CREATED_AT = 'createdon';
	const UPDATED_AT = 'updatedon';	

}

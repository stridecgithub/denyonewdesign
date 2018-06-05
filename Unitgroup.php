<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Unitgroup extends Model
{
    //
	protected $table = 'unitgroups';
	
	protected $primaryKey = 'unitgroup_id';
		
    // The attributes that are mass assignable
    protected $fillable = ['unitgroup_name', 'colorcode', 'company_id','remark','createdby','updatedby'];
	
	
    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'updatedon';

}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    public $table = 'outlet_table';
    public $timestamps = false;

    protected $hidden = [
        'outlet_id',
        'table_layout_id',
        'table_layout_name',
        'created_timestamp',
        'sync_timestamp',
        'modified_timestamp',
        'content_width',
        'content_height'
    ];
    
    protected $fillable = ["*"];

    protected $casts = [
        'id' => 'string'
    ];
}

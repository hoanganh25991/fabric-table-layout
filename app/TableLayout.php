<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TableLayout extends Model
{
    public $table = 'outlet_table_layout';
    public $timestamps = false;

    protected $fillable = [
        "id",
        "name"
    ];
    
    public function canvas(){
        return $this->hasMany(Table::class, 'table_layout_id', 'canvasId');
    }

    public static function transform($layout){
        $canvas = $layout->canvas;
        foreach($canvas as $c){
            $c->left = $c->left_margin;
            $c->top = $c->top_margin;
            $c->width = $c->layout_width;
            $c->height = $c->layout_height;
            unset($c->left_margin, $c->top_margin, $c->layout_width, $c->layout_height);
        }
    }
}

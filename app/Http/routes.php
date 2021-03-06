<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
use App\TableLayout;
use App\Table;
use Illuminate\Http\Request;

Route::get('why', function(){
    return 'tell me why?';
});

Route::get('/', function (){
    return view('layout');
});

Route::get('layouts', function (){
    $tableLayouts = TableLayout::with('canvas')
                    ->selectRaw('layout_name as name, id as canvasId')
                    ->get();
    foreach($tableLayouts as $layout){
        TableLayout::transform($layout);
    }
    return $tableLayouts;
});
Route::get('save', function(){
    return "hello";
});
Route::post('save', function (Request $request){
    $msg = [];
    $payload = $request->get('payload');
    if(!$payload){
        $payload = file_get_contents('php://input');
    }


    $layouts = @json_decode($payload, true);

    if(!is_array($layouts)){
        return false;
    }
    $layoutId = explode(" ", microtime())[1];
    $tableId = $layoutId;
    DB::statement('DELETE FROM outlet_table_layout');
    DB::statement('DELETE FROM outlet_table');
    foreach($layouts as &$layout){
        $tableLayout = new TableLayout();
        $tableLayout->id = $layoutId;

        $tableLayout->layout_name = $layout["name"];
        $tableLayout->save();

        $canvas = @json_decode($layout["canvas"], true);

        if(!is_array($canvas)){
            return false;
        }

        $tables = &$canvas["objects"];
        $msg[] = 'table-id';
        foreach($tables as $tableInfo){
            //id
            $shape = $tableInfo["objects"][0];
            $msg[] = $tableId;
            $table = new Table();
            $table->id = $tableId;
            $table->table_layout_id = $layoutId;
//            $table->table_layout_id = $tableLayout->id;
            //modify props
            $table->name = $tableInfo["objects"][1]["text"];
            $table->top_margin = $tableInfo["top"];
            $table->left_margin = $tableInfo["left"];
            $table->layout_width = $shape["width"];
            $table->layout_height = $shape["height"];
            $table->rotation = $tableInfo["angle"];
            $table->shape = $tableInfo["shape"];
            if(isset($tableInfo["enabled"])){
                $table->enabled = $tableInfo["enabled"];
            }
            $table->save();
            $tableId++;
        }
        $layoutId++;
    }
//    $tableLayout = new TableLayout();


    echo implode("\n,", $msg);
});
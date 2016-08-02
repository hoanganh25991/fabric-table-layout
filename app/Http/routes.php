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

Route::post('save', function (Request $request){
    $msg = [];
    $payload = $request->get('payload');

    $layouts = @json_decode($payload, true);

    if(!is_array($layouts)){
        return false;
    }

    foreach($layouts as &$layout){
        //update $tableLayout if exist
        $tableLayout = TableLayout::find($layout["canvasId"]);

        if(!$tableLayout){
            $tableLayout = new TableLayout([
                "id" => $layout["canvasId"]
            ]);
        }

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
            $msg[] = $tableInfo["id"];
            //find table > update
            $table = Table::find($tableInfo["id"]);
            //find ko thay > insert
            if(!$table){
                $table = new Table();
                $table->id = $tableInfo["id"];
            }
//            var_dump($table);
            //map
            $table->table_layout_id = $layout["canvasId"];

            $table->name = $tableInfo["objects"][1]["text"];
            $table->top_margin = $tableInfo["top"];
            $table->left_margin = $tableInfo["left"];
            $table->layout_width = $tableInfo["width"];
            $table->layout_height = $tableInfo["height"];
            $table->rotation = $tableInfo["angle"];
            $table->shape = $tableInfo["shape"];

            $table->save();

        }
    }
//    $tableLayout = new TableLayout();


    echo implode("\n,", $msg);
});
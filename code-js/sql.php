<?php
header('content-type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "ifrc";
$database = "table_management";

$pdo = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

// set the PDO error mode to exception
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(isset($_GET['share'])){
    date_default_timezone_set('Asia/Saigon');
    $payload = file_get_contents('php://input');
    
    $layouts = json_decode($payload, true);
    //fast update by delete first
    $listIds = [];
    foreach($layouts as &$layout){
        $listIds[] = $layout["canvasId"];
    }
    
    $in = implode(",", $listIds);
    $whereIn = "where id in ({$in})";
    if(count($listIds) == 0){
        $whereIn =  ";DELETE FROM `outlet_table`;";
    }
    $deleteQuery = "DELETE FROM `outlet_table_layout` {$whereIn}";
    $statement = $pdo->prepare($deleteQuery);
    $statement->execute();
    $created = date("Y-m-d H:i:s");
    foreach($layouts as $layout){
        $insertQuery =
            "INSERT INTO `table_management`.`outlet_table_layout` (`id`, `layout_name`, `created_timestamp`) VALUES ('{$layout["canvasId"]}', '{$layout["name"]}', '{$created}');";
        $statement = $pdo->prepare($insertQuery);
        $statement->execute();

        $canvas = json_decode($layout["canvas"], true);
        $tables = $canvas["objects"];
//        var_dump($tables);
        $tableId = explode(" ", microtime())[1];

        $whereIn = "where table_layout_id = {$layout["canvasId"]}";
        $deleteQuery = "DELETE FROM `outlet_table` {$whereIn}";
        $statement = $pdo->prepare($deleteQuery);
        $statement->execute();
        $log = ['table-shape'];
        foreach($tables as $table){
//            var_dump($table);
            $txt = $table["objects"][1];
            $name = $txt["text"];
//            $log[] = $shape;
            $log[] = $table["shape"];
            $rotation = $table["angle"];
            $left = $table["left"];
            $top = $table["top"];
            $width = $table["width"] * $table["scaleX"];
            $height = $table["height"] * $table["scaleY"];
            $insertQuery =
                "INSERT INTO `outlet_table` (`id`, `outlet_id`, `name`, `table_layout_id`, `created_timestamp`, `shape`, `rotation`, `left_margin`, `top_margin`, `layout_height`, `layout_width`) VALUES ('{$tableId}', '1', '{$name}','{$layout["canvasId"]}', '{$created}', '{$table["shape"]}','{$rotation}','{$left}', '{$top}', '{$height}', '{$width}');";
            $statement = $pdo->prepare($insertQuery);
            $statement->execute();
            $tableId++;
        }
    }
    echo implode(",", $log);
    die;
}

try{
    //query layout
    $queryLayouts = "SELECT id, layout_name as `name` FROM outlet_table_layout;";
    $statement = $pdo->prepare($queryLayouts);
    $statement->execute();
    $layouts = $statement->fetchAll(PDO::FETCH_ASSOC);

    $canvasId = explode(" ", microtime())[1];

    foreach($layouts as &$layout){
        //query tables in layout
        $queryTablesInLayout =
            "SELECT outlet_table.name, outlet_table.max_pax, outlet_table.shape, outlet_table.rotation, outlet_table.top_margin as top, outlet_table.left_margin as `left`, outlet_table.layout_height as height, outlet_table.layout_width as width FROM outlet_table_layout LEFT JOIN outlet_table ON outlet_table_layout.id =outlet_table.table_layout_id WHERE outlet_table_layout.id = {$layout["id"]};";
        $statement = $pdo->prepare($queryTablesInLayout);
        $statement->execute();
        $tables = $statement->fetchAll(PDO::FETCH_ASSOC);

        $layout["canvasId"] = $layout["id"];

        unset($layout["id"]);

        $canvasId++;

        $layout["canvas"] = $tables;
    }

    echo json_encode($layouts);
}catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
}
?>
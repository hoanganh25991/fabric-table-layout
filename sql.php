<?php
header('content-type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "ifrc";
$database = "table_management";

if(isset($_GET['share'])){
    $payload = file_get_contents('php://input');
    $canvasObj = json_decode($payload, false);
    echo $canvasObj;
    die;
}

try{
    $pdo = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

    // set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //query layout
    $queryLayouts = "SELECT id, layout_name as `name` FROM outlet_table_layout";
    $statement = $pdo->prepare($queryLayouts);
    $statement->execute();
    $layouts = $statement->fetchAll(PDO::FETCH_ASSOC);

    $canvasId = explode(" ", microtime())[1];

    foreach($layouts as &$layout){
        //query tables in layout
        $queryTablesInLayout =
            "SELECT outlet_table.name, outlet_table.max_pax, outlet_table.shape, outlet_table.rotation, outlet_table.top_margin as top, outlet_table.left_margin as `left`, outlet_table.layout_height as height, outlet_table.layout_width as width FROM outlet_table_layout LEFT JOIN outlet_table ON outlet_table_layout.id =outlet_table.table_layout_id WHERE outlet_table_layout.id = {$layout["id"]}";
        $statement = $pdo->prepare($queryTablesInLayout);
        $statement->execute();
        $tables = $statement->fetchAll(PDO::FETCH_ASSOC);

        unset($layout["id"]);

        $canvasId++;

        $layout["canvasId"] = $canvasId;

        $layout["canvas"] = $tables;
    }
    
    echo json_encode($layouts);
}catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
}
?>
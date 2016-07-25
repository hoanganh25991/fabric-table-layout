<?php
$servername = "localhost";
$username = "root";
$password = "ifrc";
$database = "table_management";

try{
    $pdo = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

    // set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query =
        "SELECT outlet_table_layout.layout_name, outlet_table.name, outlet_table.max_pax, outlet_table.shape, outlet_table.rotation, outlet_table.top_margin as top, outlet_table.left_margin as `left`, outlet_table.layout_height as height, outlet_table.layout_width as width FROM outlet_table_layout LEFT JOIN outlet_table ON outlet_table_layout.id =outlet_table.table_layout_id WHERE outlet_table_layout.id = 10011453293172613";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $tables = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    foreach($tables as &$table){
        $table["type"] = "group";
        $rect = [
            "type" => "rect",
            "originX" => "center",
            "originY" => "center",
            "left" => $table["left"],
            "top" => $table["top"],
            "width" => $table["width"],
            "height" => $table["height"],
        ];
        $text = [
            "type" => "text",
            "originX" => "center",
            "originY" => "center",
            "left" => $table["left"],
            "top" => $table["top"],
            "width" => $table["width"],
            "height" => $table["height"],
            "text" => $table["name"]
        ];
        $table["objects"] = [
            $rect,
            $text
        ];
    }

    $canvas = [];
    $canvas["objects"] = $tables;
    
    $layout = [
        "name" => $tables[0]["layout_name"],
        "canvas" => $canvas
    ];

    $layouts = [$layout];

    echo json_encode($layouts);

}catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
}
?>
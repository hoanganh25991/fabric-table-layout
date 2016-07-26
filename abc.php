<?php
header('content-type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "ifrc";
$database = "table_management";

try{
    $pdo = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

    // set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $queryTableInLayout =
        "SELECT outlet_table_layout.layout_name, outlet_table.name, outlet_table.max_pax, outlet_table.shape, outlet_table.rotation, outlet_table.top_margin as top, outlet_table.left_margin as `left`, outlet_table.layout_height as height, outlet_table.layout_width as width FROM outlet_table_layout LEFT JOIN outlet_table ON outlet_table_layout.id =outlet_table.table_layout_id WHERE outlet_table_layout.id = 10011453293172613";
    $statement = $pdo->prepare($queryTableInLayout);
    $statement->execute();
    $tables = $statement->fetchAll(PDO::FETCH_ASSOC);

    foreach($tables as &$table){
        $table["type"] = "group";

        $table["fill"] = "rgb(0;0;0)";
        $table["stroke"] = null;
        $table["strokeWidth"] = 0;
        $table["strokeDashArray"] = null;
        $table["strokeLineCap"] = "butt";
        $table["strokeLineJoin"] = "miter";
        $table["strokeMiterLimit"] = 10;
        $table["scaleX"] = 1;
        $table["scaleY"] = 1;
        $table["angle"] = 0;
        $table["flipX"] = false;
        $table["flipY"] = false;
        $table["opacity"] = 1;
        $table["shadow"] = null;
        $table["visible"] = true;
        $table["clipTo"] = null;
        $table["backgroundColor"] = "";
        $table["fillRule"] = "nonzero";
        $table["globalCompositeOperation"] = "source-over";
        $table["transformMatrix"] = null;
        $table["skewX"] = 0;
        $table["skewY"] = 0;
        $rect = [
            "type" => "rect",
            "originX" => "center",
            "originY" => "center",
            "left" => $table["left"],
            "top" => $table["top"],
            "width" => $table["width"],
            "height" => $table["height"],

            "fill" => "#E5E5E5",
            "stroke" => "#555E65",
            "strokeWidth" => 4,
            "strokeDashArray" => null,
            "strokeLineCap" => "butt",
            "strokeLineJoin" => "miter",
            "strokeMiterLimit" => 10,
            "scaleX" => 1,
            "scaleY" => 1,
            "angle" => 0,
            "flipX" => false,
            "flipY" => false,
            "opacity" => 1,
            "shadow" => null,
            "visible" => true,
            "clipTo" => null,
            "backgroundColor" => "",
            "fillRule" => "nonzero",
            "globalCompositeOperation" => "source-over",
            "transformMatrix" => null,
            "skewX" => 0,
            "skewY" => 0,
            "rx" => 0,
            "ry" => 0
        ];
        $text = [
            "type" => "text",
            "originX" => "center",
            "originY" => "center",
            "left" => $table["left"],
            "top" => $table["top"],
            "width" => $table["width"],
            "height" => $table["height"],
            "text" => $table["name"],

            "fill" => "rgb(0,0,0)",
            "stroke" => null,
            "strokeWidth" => 1,
            "strokeDashArray" => null,
            "strokeLineCap" => "butt",
            "strokeLineJoin" => "miter",
            "strokeMiterLimit" => 10,
            "scaleX" => 1,
            "scaleY" => 1,
            "angle" => 0,
            "flipX" => false,
            "flipY" => false,
            "opacity" => 1,
            "shadow" => null,
            "visible" => true,
            "clipTo" => null,
            "backgroundColor" => "",
            "fillRule" => "nonzero",
            "globalCompositeOperation" => "source-over",
            "transformMatrix" => null,
            "skewX" => 0,
            "skewY" => 0,
            "fontSize" => 30,
            "fontWeight" => "normal",
            "fontFamily" => "Times New Roman",
            "fontStyle" => "",
            "lineHeight" => 1.16,
            "textDecoration" => "",
            "textAlign" => "left",
            "textBackgroundColor" => ""
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
        "canvasId" => time(),
        "canvas" => json_encode($canvas)
    ];

    $layouts = [$layout];


    echo json_encode($layouts);

}catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
}
?>
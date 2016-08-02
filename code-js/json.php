<?php
header('content-type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
$payload = file_get_contents("php://input");

if($payload){
    $layouts = $payload;
    $jsonFile = fopen("layouts.json", "w");
    fwrite($jsonFile, $layouts);
    fclose($jsonFile);
    
    echo "success";
    die;
}

$layouts = file_get_contents("layouts.json");
if($layouts){
    echo $layouts;
    die;
}

echo "";
die;

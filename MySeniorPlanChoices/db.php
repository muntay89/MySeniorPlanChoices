<?php
$host = "sql100.infinityfree.com";
$dbname = "if0_40299660_MySeniorPlanChoices";
$user = "if0_40299660";
$pass = "Zuzsufsoil00";

$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, $options);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => "DB connection failed"]);
  exit;
}

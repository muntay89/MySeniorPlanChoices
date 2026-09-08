<?php
header("Content-Type: application/json");
require_once "db.php";

$date = $_GET["date"] ?? null;
if (!$date) {
  http_response_code(400);
  echo json_encode(["error" => "date is required"]);
  exit;
}

$weekday = (int) date("w", strtotime($date));

$timeframesByDay = [
  0 => [],
  1 => ["09:00:00","10:00:00","11:00:00","13:00:00"],
  2 => ["09:00:00","10:00:00","11:00:00","13:00:00"],
  3 => ["12:00:00","13:00:00","14:00:00"],
  4 => ["09:00:00","10:00:00","11:00:00"],
  5 => ["13:00:00","14:00:00","15:00:00"],
  6 => ["10:00:00","11:00:00"],
];

$all = $timeframesByDay[$weekday] ?? [];

$stmt = $pdo->prepare("SELECT service_time FROM bookings WHERE service_date = :d");
$stmt->execute([":d" => $date]);

$bookedTimes = array_map(fn($r) => $r["service_time"], $stmt->fetchAll());
$available = array_values(array_diff($all, $bookedTimes));

echo json_encode([
  "date" => $date,
  "weekday" => $weekday,
  "available" => $available
]);

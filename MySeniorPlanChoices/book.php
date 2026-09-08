<?php
header("Content-Type: application/json");
require_once "db.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$date  = $data["date"]  ?? null;
$time  = $data["time"]  ?? null;
$name  = trim($data["name"]  ?? "");
$email = trim($data["email"] ?? "");
$phone = trim($data["phone"] ?? ""); // ✅ phone

// Basic validation
if (!$date || !$time || !$name || !$email) {
  http_response_code(400);
  echo json_encode(["error" => "Missing required fields."]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid email address."]);
  exit;
}

try {
  // ✅ INSERT uses phone (not notes)
  $stmt = $pdo->prepare("
    INSERT INTO bookings (service_date, service_time, name, email, phone)
    VALUES (:d, :t, :n, :e, :p)
  ");

  $stmt->execute([
    ":d" => $date,
    ":t" => $time,
    ":n" => $name,
    ":e" => $email,
    ":p" => $phone ?: null
  ]);

  // ---------- EMAIL CONFIRMATION ----------
  try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'ultimatespartan45@gmail.com';
    $mail->Password   = 'cfio qnum yriy ydhs';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom('ultimatespartan45@gmail.com', 'Booking Confirmation');
    $mail->addAddress($email, $name);
    $mail->addCC('ultimatespartan45@gmail.com'); // Admin copy

    $mail->isHTML(true);
    $mail->Subject = 'Your booking is confirmed';
    $mail->Body = "
      <h3>Booking Confirmed !</h3>
      <p>Hi " . htmlspecialchars($name) . ",</p>
      <p>Your appointment has been booked.</p>
      <p><b>Date:</b> " . htmlspecialchars($date) . "</p>
      <p><b>Time:</b> " . htmlspecialchars($time) . "</p>
      <p><b>Phone:</b> " . htmlspecialchars($phone) . "</p>
    ";

    $mail->AltBody = "Booking confirmed. Date: $date Time: $time Phone: $phone";

    $mail->send();
  } catch (Exception $e) {
    // Do NOT fail booking if email fails
    error_log("Email failed: " . $e->getMessage());
  }

  echo json_encode(["ok" => true, "message" => "Booked!"]);
  exit;

} catch (PDOException $e) {
  if ($e->getCode() === "23000") {
    http_response_code(409);
    echo json_encode(["error" => "That time slot is already booked."]);
  } else {
    http_response_code(500);
    echo json_encode([
      "error"  => "Server error.",
      "detail" => $e->getMessage() // 🔴 remove after confirming it works
    ]);
  }
}

<?php
require_once __DIR__ . "/db.php";

$USER = "admin";
$PASS = "OCEAN#!1983";

if (
  !isset($_SERVER['PHP_AUTH_USER']) ||
  !isset($_SERVER['PHP_AUTH_PW']) ||
  $_SERVER['PHP_AUTH_USER'] !== $USER ||
  $_SERVER['PHP_AUTH_PW'] !== $PASS
) {
  header('WWW-Authenticate: Basic realm="Appointments"');
  header('HTTP/1.0 401 Unauthorized');
  echo "Unauthorized";
  exit;
}

// Load appointments
$stmt = $pdo->query("
  SELECT service_date, service_time, name, email, phone, created_at
  FROM bookings
  ORDER BY service_date DESC, service_time DESC
  LIMIT 500
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointments</title>
  <style>
    body{font-family:system-ui;margin:20px}
    table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #ddd;padding:10px;text-align:left}
    th{background:#f3f3f3}
  </style>
</head>
<body>
  <h2>Appointments</h2>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Booked At</th>
      </tr>
    </thead>
    <tbody>
      <?php if (!$rows): ?>
        <tr><td colspan="6">No appointments yet.</td></tr>
      <?php endif; ?>

      <?php foreach ($rows as $r): ?>
        <tr>
          <td><?= htmlspecialchars($r["service_date"]) ?></td>
          <td><?= htmlspecialchars(substr($r["service_time"], 0, 5)) ?></td>
          <td><?= htmlspecialchars($r["name"]) ?></td>
          <td><?= htmlspecialchars($r["email"]) ?></td>
          <td><?= htmlspecialchars($r["phone"] ?? "") ?></td>
          <td><?= htmlspecialchars($r["created_at"]) ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</body>
</html>

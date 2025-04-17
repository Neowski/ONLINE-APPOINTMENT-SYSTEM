<?php
require 'db.php';

$sql = "SELECT * FROM appointments ORDER BY appointment_date, appointment_time";
$result = $conn->query($sql);

$appointments = [];

while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);
?>

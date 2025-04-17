<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$srCode = $data['srCode'];
$appointmentDate = $data['appointmentDate'];
$appointmentTime = $data['appointmentTime'];
$adviserId = $data['adviserId']; // assuming each appointment is tied to an adviser

$sql = "INSERT INTO appointments (sr_code, appointment_date, appointment_time, adviser_id) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $srCode, $appointmentDate, $appointmentTime, $adviserId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
?>

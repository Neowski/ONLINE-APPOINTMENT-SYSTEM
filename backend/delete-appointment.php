<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$srCode = $data['srCode'];
$appointmentDate = $data['appointmentDate'];
$appointmentTime = $data['appointmentTime'];

$sql = "DELETE FROM appointments WHERE sr_code = ? AND appointment_date = ? AND appointment_time = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $srCode, $appointmentDate, $appointmentTime);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
?>

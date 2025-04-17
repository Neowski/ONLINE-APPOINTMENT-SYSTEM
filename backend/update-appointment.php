<?php
$conn = new mysqli("localhost", "root", "", "appointments_db");
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

$data = json_decode(file_get_contents("php://input"), true);

$srCode = $data['srCode'];
$newDate = $data['newDate'];
$newTime = $data['newTime'];

$sql = "UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE sr_code = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $newDate, $newTime, $srCode);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}

$stmt->close();
$conn->close();
?>

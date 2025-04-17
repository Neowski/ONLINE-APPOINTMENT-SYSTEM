<?php
// Connect to DB
$host = "localhost";
$user = "root";
$password = ""; // your DB password
$dbname = "appointments_db"; // change as needed

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

$data = json_decode(file_get_contents("php://input"), true);
$srCode = $data['srCode']; // Assuming you use SR-Code as unique identifier

$sql = "DELETE FROM appointments WHERE sr_code = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $srCode);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to cancel appointment.']);
}

$stmt->close();
$conn->close();
?>

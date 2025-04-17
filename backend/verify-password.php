<?php
session_start();

// Dummy password for demo. Replace with a real password check from DB.
$correctPassword = "adviser123"; // Ideally, you'd hash this and store it in a DB.

$data = json_decode(file_get_contents("php://input"), true);
$enteredPassword = $data['password'];

if ($enteredPassword === $correctPassword) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Incorrect password.']);
}
?>

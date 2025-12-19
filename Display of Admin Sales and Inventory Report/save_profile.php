<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['role'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

$host = "localhost"; $user = "root"; $pass = ""; $db = "micomms_database";
$conn = new mysqli($host, $user, $pass, $db);

if (isset($_SESSION['role']) && $_SESSION['role'] === 'user' && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $user_name = $_POST['user_name'] ?? '';
    $user_bio = $_POST['user_bio'] ?? '';
    
    $sql = "UPDATE user_tb SET user_name = ?, user_bio = ? WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $user_name, $user_bio, $user_id);
    $success = $stmt->execute();
    
    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid user']);
}
?>

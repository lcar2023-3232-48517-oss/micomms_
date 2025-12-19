<?php
session_start();
header('Content-Type: application/json');

$host = "localhost"; $user = "root"; $pass = ""; $db = "micomms_database";
$conn = new mysqli($host, $user, $pass, $db);

if (isset($_GET['admin_id'])) {
    $admin_id = $_GET['admin_id'];
    $sql = "SELECT admin_name, admin_bio, admin_profile_pic FROM admin_tb WHERE admin_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $admin_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    echo json_encode([
        'success' => true, 
        'admin_name' => $data['admin_name'] ?? 'Admin', 
        'admin_bio' => $data['admin_bio'] ?? '', 
        'admin_profile_pic' => $data['admin_profile_pic'] ?? null
    ]);
} else if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];
    $sql = "SELECT user_name, user_bio, user_profile_pic FROM user_tb WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    echo json_encode([
        'success' => true, 
        'user_name' => $data['user_name'] ?? 'User', 
        'user_bio' => $data['user_bio'] ?? '', 
        'user_profile_pic' => $data['user_profile_pic'] ?? null
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'No ID provided']);
}
?>

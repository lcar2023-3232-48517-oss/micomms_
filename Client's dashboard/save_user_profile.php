<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'user') {
    echo json_encode(['success' => false, 'error' => 'Not logged in as user']);
    exit;
}

$host = "localhost"; $user = "root"; $pass = ""; $db = "micomms_database";
$conn = new mysqli($host, $user, $pass, $db);

$user_id = $_SESSION['user_id'];
$user_name = $_POST['user_name'] ?? '';
$user_bio = $_POST['user_bio'] ?? '';

$sql = "UPDATE user_tb SET user_name = ?, user_bio = ? WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $user_name, $user_bio, $user_id);
$stmt->execute();

$filename = null;

// HANDLE PROFILE PIC UPLOAD
if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
    $target_dir = "uploads/profiles/";
    $file_extension = pathinfo($_FILES["profile_pic"]["name"], PATHINFO_EXTENSION);
    $filename = 'user_' . $user_id . '_' . time() . '.' . $file_extension;
    $target_file = $target_dir . $filename;
    
    if (move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $target_file)) {
        $sql = "UPDATE user_tb SET user_profile_pic = ? WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $filename, $user_id);
        $stmt->execute();
    }
}

echo json_encode(['success' => true, 'filename' => $filename]);
?>

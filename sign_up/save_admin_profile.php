<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'micomms_database';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $admin_id = (int)$_POST['admin_id'];
    $admin_name = $_POST['admin_name'] ?? 'Seller/Admin';
    $admin_bio = $_POST['admin_bio'] ?? '';
    
    if (!isset($_SESSION['admin_id']) || $_SESSION['admin_id'] != $admin_id) {
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit();
    }
    
    // Save name/bio FIRST
    $stmt = $pdo->prepare("UPDATE admin_tb SET admin_name = ?, admin_bio = ? WHERE admin_id = ?");
    $stmt->execute([$admin_name, $admin_bio, $admin_id]);
    
    $success = true;
    
    // Handle profile image upload
    // Handle profile image upload - FIXED
if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/profiles/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
    
    // CRITICAL: Delete old image FIRST (even if failed, try anyway)
    $oldImgStmt = $pdo->prepare("SELECT admin_profile_pic FROM admin_tb WHERE admin_id = ?");
    $oldImgStmt->execute([$admin_id]);
    $oldImg = $oldImgStmt->fetchColumn();
    if ($oldImg && file_exists($uploadDir . $oldImg)) {
        unlink($uploadDir . $oldImg); // FORCE DELETE
    }
    
    // Save new image with UNIQUE name + timestamp
    $fileName = uniqid() . '_' . time() . '.png';
    $filePath = $uploadDir . $fileName;
    
    if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $filePath)) {
        $stmt = $pdo->prepare("UPDATE admin_tb SET admin_profile_pic = ? WHERE admin_id = ?");
        $stmt->execute([$fileName, $admin_id]);
        echo json_encode(['success' => true, 'new_filename' => $fileName]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Image upload failed']);
    }
    exit(); // Exit after image upload
}
}
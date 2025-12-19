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
    
    $admin_id = (int)($_GET['id'] ?? $_SESSION['admin_id'] ?? 0);
    
    if (!isset($_SESSION['admin_id']) || $_SESSION['admin_id'] != $admin_id) {
        echo json_encode([
            'admin_name' => 'Seller/Admin', 
            'admin_bio' => 'Write something about you...', 
            'admin_profile_pic' => ''
        ]);
        exit();
    }
    
    $stmt = $pdo->prepare("SELECT admin_name, admin_bio, admin_profile_pic FROM admin_tb WHERE admin_id = ?");
    $stmt->execute([$admin_id]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'admin_name' => $profile['admin_name'] ?? 'Seller/Admin',
        'admin_bio' => $profile['admin_bio'] ?? 'Write something about you...',
        'admin_profile_pic' => $profile['admin_profile_pic'] ?? ''
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'admin_name' => 'Seller/Admin', 
        'admin_bio' => 'Write something about you...', 
        'admin_profile_pic' => ''
    ]);
}
?>

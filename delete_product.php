<?php
session_start();
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$product_id = (int)($input['product_id'] ?? 0);  
$admin_id = (int)($input['admin_id'] ?? 0);      

if (!isset($_SESSION['admin_id']) || $_SESSION['admin_id'] != $admin_id) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit();
}

$host = 'localhost';
$dbname = 'micomms_database';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
    
    $stmt = $pdo->prepare("SELECT product_img FROM product_tb WHERE product_id=? AND admin_id=?");
    $stmt->execute([$product_id, $admin_id]);
    $img = $stmt->fetchColumn();
    
    $stmt = $pdo->prepare("DELETE FROM product_tb WHERE product_id=? AND admin_id=?");
    $stmt->execute([$product_id, $admin_id]);
    
    if ($img && file_exists("uploads/products/$img")) {
        unlink("uploads/products/$img");
    }
    
    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

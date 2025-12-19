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
    
    // FIXED: Use session first, then GET param, with integer casting
    $admin_id = (int)($_GET['admin_id'] ?? $_SESSION['admin_id'] ?? 0);
    
    // Security: Verify session exists
    if (!$admin_id || !isset($_SESSION['admin_id']) || $_SESSION['admin_id'] != $admin_id) {
        echo json_encode([]);
        exit();
    }
    
    $stmt = $pdo->prepare("SELECT * FROM product_tb WHERE admin_id=? ORDER BY product_dateadd DESC");
    $stmt->execute([$admin_id]);
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
    
} catch (Exception $e) {
    echo json_encode([]);
}
?>

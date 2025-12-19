<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'micomms_database';
$username = 'root';
$password = '';

$admin_id = (int)($_GET['admin_id'] ?? $_SESSION['admin_id'] ?? 0);

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    if (!$admin_id || !isset($_SESSION['admin_id']) || $_SESSION['admin_id'] != $admin_id) {
        echo json_encode([]);
        exit;
    }
    
    $stmt = $pdo->prepare("
        SELECT p.*, 
               (SELECT SUM(oi.order_item_quantity) FROM order_item_tb oi 
                JOIN order_tb o ON oi.order_id = o.order_id 
                WHERE oi.product_id = p.product_id AND o.order_status != 'cancelled') as total_sold
        FROM product_tb p 
        WHERE p.admin_id = ? 
        ORDER BY p.product_dateadd DESC
    ");
    $stmt->execute([$admin_id]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
} catch (Exception $e) {
    echo json_encode([]);
}
?>

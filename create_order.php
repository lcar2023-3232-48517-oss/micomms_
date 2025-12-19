<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
session_start();
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'error' => 'POST only']);
    exit;
}

$host = 'localhost'; $dbname = 'micomms_database'; $username = 'root'; $password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $user_id = $_SESSION['user_id'] ?? $_SESSION['admin_id'] ?? 0;
    if (!$user_id) {
        echo json_encode(['success' => false, 'error' => 'Not logged in']);
        exit;
    }
    
    $order_items = json_decode($_POST['order_items'], true);
    $total = floatval($_POST['total'] ?? 0);
    
    $stmt = $pdo->prepare("INSERT INTO order_tb (user_id, order_date, order_total, order_payment_stat, order_status) VALUES (?, CURDATE(), ?, 'Pending', 'tracking')");
    $stmt->execute([$user_id, $total]);  
    $order_id = $pdo->lastInsertId();
    

    $stmt_item = $pdo->prepare("INSERT INTO order_item_tb (order_id, product_id, order_item_quantity, order_item_price_each, order_item_subtotal) VALUES (?, ?, ?, ?, ?)");
    
    $stmt_item->execute([$order_id, 1, 2, 100, 200]);
 
    $stmt_item->execute([$order_id, 1, 1, 220, 220]);
    
    echo json_encode(['success' => true, 'order_id' => $order_id]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

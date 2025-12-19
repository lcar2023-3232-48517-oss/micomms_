<?php
session_start();
header('Content-Type: application/json'); // ✅ FORCE JSON

$host = 'localhost';
$dbname = 'micomms_database'; 
$username = 'root'; 
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $order_id = (int)($_GET['order_id'] ?? 0);
    if (!$order_id) {
        echo json_encode(['error' => 'No order ID']);
        exit;
    }
    
    // Get order
    $stmt = $pdo->prepare("SELECT * FROM order_tb WHERE order_id = ?");
    $stmt->execute([$order_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        echo json_encode(['error' => 'Order not found']);
        exit;
    }
    
    // Get items
    $stmt = $pdo->prepare("SELECT * FROM order_item_tb WHERE order_id = ?");
    $stmt->execute([$order_id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // ✅ PURE JSON RESPONSE
    echo json_encode([
        'order' => $order,
        'items' => $items
    ]);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

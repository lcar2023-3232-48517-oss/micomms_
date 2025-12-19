<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'micomms_database'; 
$username = 'root'; 
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $order_id = (int)($_GET['order_id'] ?? 0);
    
    $stmt = $pdo->prepare("
        SELECT o.*, u.user_name as client_name, u.user_email as client_email 
        FROM order_tb o 
        LEFT JOIN user_tb u ON o.user_id = u.user_id 
        WHERE o.order_id = ?
    ");
    $stmt->execute([$order_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        echo json_encode(['error' => 'Order not found']);
        exit;
    }
    
    $stmt_items = $pdo->prepare("SELECT * FROM order_item_tb WHERE order_id = ?");
    $stmt_items->execute([$order_id]);
    $items = $stmt_items->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'order' => $order,
        'seller_name' => 'MiCOMMS Store',
        'seller_email' => 'support.center@miccoms.co',
        'client_name' => $order['client_name'] ?? 'User #' . $order['user_id'],
        'client_email' => $order['client_email'] ?? 'user@miccomms.com',
        'items' => $items
    ]);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>

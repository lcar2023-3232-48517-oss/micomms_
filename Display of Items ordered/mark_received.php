<?php
session_start();
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$order_id = (int)($input['order_id'] ?? 0);

$host = 'localhost'; $dbname = 'micomms_database'; $username = 'root'; $password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Update order status + received date
    $stmt = $pdo->prepare("
        UPDATE order_tb 
        SET order_status = 'received', received_date = NOW() 
        WHERE order_id = ? AND user_id = ?
    ");
    $stmt->execute([$order_id, $_SESSION['user_id']]);
    
    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

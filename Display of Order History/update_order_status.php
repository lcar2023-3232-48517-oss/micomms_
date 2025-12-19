<?php
header('Content-Type: application/json');
ob_clean();

$input = json_decode(file_get_contents('php://input'), true);
$order_id = $input['order_id'] ?? 0;

$pdo = @new PDO('mysql:host=localhost;dbname=micomms_database', 'root', '');
if ($pdo) {
    $stmt = $pdo->prepare("UPDATE order_tb SET order_status='received' WHERE order_id=?");
    $stmt->execute([$order_id]);
}
echo json_encode(['success' => true]);
?>

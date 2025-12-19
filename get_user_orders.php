<?php
header('Content-Type: application/json');
ob_clean(); 

$user_id = $_GET['user_id'] ?? 1;
$status = $_GET['status'] ?? 'tracking';

$pdo = @new PDO('mysql:host=localhost;dbname=micomms_database', 'root', '');
if ($pdo) {
    $stmt = $pdo->prepare("SELECT * FROM order_tb WHERE user_id=? AND order_status=?");
    $stmt->execute([$user_id, $status]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} else {
    echo json_encode([]);
}
?>

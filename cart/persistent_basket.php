<?php
session_start();
header('Content-Type: application/json');

$user_id = $_SESSION['user_id'] ?? 0;
if (!$user_id) echo json_encode([]);

$pdo = new PDO("mysql:host=localhost;dbname=micomms_database", 'root', '');
$stmt = $pdo->prepare("SELECT * FROM basket_tb WHERE user_id = ?");
$stmt->execute([$user_id]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>

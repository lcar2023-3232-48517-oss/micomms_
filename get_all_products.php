<?php

header('Content-Type: application/json');
$pdo = new PDO("mysql:host=localhost;dbname=micomms_database", 'root', '');
$stmt = $pdo->query("SELECT * FROM product_tb WHERE product_stock > 0 ORDER BY product_dateadd DESC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>

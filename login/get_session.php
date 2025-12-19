<?php
session_start();
header('Content-Type: application/json');
echo json_encode([
    'admin_id' => $_SESSION['admin_id'] ?? 0,
    'user_id' => $_SESSION['user_id'] ?? 0,
    'user_name' => $_SESSION['email'] ?? 'User'
]);
?>


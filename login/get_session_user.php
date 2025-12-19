<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['role']) && $_SESSION['role'] === 'user' && isset($_SESSION['user_id'])) {
    echo json_encode(['user_id' => $_SESSION['user_id']]);
} else {
    echo json_encode(['user_id' => null]);
}
?>

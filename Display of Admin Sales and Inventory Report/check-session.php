<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['role'])) {
    echo json_encode([
        'loggedIn' => true,
        'role' => $_SESSION['role']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
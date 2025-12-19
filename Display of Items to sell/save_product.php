<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'micomms_database';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // SECURITY: Verify session admin_id matches POST admin_id
    $session_admin_id = $_SESSION['admin_id'] ?? 0;
    $admin_id = (int)$_POST['admin_id'];
    if ($session_admin_id != $admin_id) {
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit();
    }
    
    $action = $_POST['action'] ?? 'create';
    
    if ($action === 'create') {
        $stmt = $pdo->prepare("INSERT INTO product_tb (admin_id, product_name, product_desc, product_price, product_stock, category_id, product_img) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $imgPath = null;
        
        if (isset($_FILES['product_img']) && $_FILES['product_img']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/products/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            
            $fileName = uniqid() . '_' . basename($_FILES['product_img']['name']);
            $filePath = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES['product_img']['tmp_name'], $filePath)) {
                $imgPath = $fileName;
            }
        }
        
        $stmt->execute([
            $admin_id,
            $_POST['product_name'],
            $_POST['product_desc'],
            $_POST['product_price'],
            $_POST['product_stock'],
            $_POST['category_id'],
            $imgPath
        ]);
        
    } elseif ($action === 'update') {
        $product_id = (int)$_POST['product_id'];
        
        // Handle image update BEFORE main update
        if (isset($_FILES['product_img']) && $_FILES['product_img']['error'] === UPLOAD_ERR_OK) {
            // Get old image path
            $oldImgStmt = $pdo->prepare("SELECT product_img FROM product_tb WHERE product_id = ? AND admin_id = ?");
            $oldImgStmt->execute([$product_id, $admin_id]);
            $oldImg = $oldImgStmt->fetchColumn();
            
            if ($oldImg && file_exists("uploads/products/$oldImg")) {
                unlink("uploads/products/$oldImg");
            }
            
            // Upload new image
            $uploadDir = 'uploads/products/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $fileName = uniqid() . '_' . basename($_FILES['product_img']['name']);
            $filePath = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES['product_img']['tmp_name'], $filePath)) {
                // Update with image
                $stmt = $pdo->prepare("UPDATE product_tb SET product_name=?, product_desc=?, product_price=?, product_stock=?, category_id=?, product_img=? WHERE product_id=? AND admin_id=?");
                $stmt->execute([
                    $_POST['product_name'], 
                    $_POST['product_desc'], 
                    $_POST['product_price'],
                    $_POST['product_stock'], 
                    $_POST['category_id'], 
                    $fileName, 
                    $product_id, 
                    $admin_id
                ]);
            } else {
                // Image upload failed - update without image
                $stmt = $pdo->prepare("UPDATE product_tb SET product_name=?, product_desc=?, product_price=?, product_stock=?, category_id=? WHERE product_id=? AND admin_id=?");
                $stmt->execute([
                    $_POST['product_name'], $_POST['product_desc'], $_POST['product_price'],
                    $_POST['product_stock'], $_POST['category_id'], $product_id, $admin_id
                ]);
            }
        } else {
            // No image - regular update
            $stmt = $pdo->prepare("UPDATE product_tb SET product_name=?, product_desc=?, product_price=?, product_stock=?, category_id=? WHERE product_id=? AND admin_id=?");
            $stmt->execute([
                $_POST['product_name'], $_POST['product_desc'], $_POST['product_price'],
                $_POST['product_stock'], $_POST['category_id'], $product_id, $admin_id
            ]);
        }
    }
    
    echo json_encode(['success' => true]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

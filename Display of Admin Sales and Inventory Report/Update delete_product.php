$stmt = $conn->prepare("DELETE FROM product_tb WHERE product_id = ? AND admin_id = ?");
$stmt->bind_param("ii", $product_id, $admin_id);
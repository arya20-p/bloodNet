<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Get inventory
    $query = "SELECT i.*, b.bank_name 
              FROM blood_inventory i
              JOIN blood_banks b ON i.bank_id = b.bank_id
              WHERE i.status = 'Available' AND i.expiry_date > CURDATE()";
    
    if(isset($_GET['blood_group'])) {
        $query .= " AND i.blood_group = :blood_group";
    }

    $stmt = $db->prepare($query);
    
    if(isset($_GET['blood_group'])) {
        $stmt->bindParam(':blood_group', $_GET['blood_group']);
    }

    $stmt->execute();
    $inventory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get summary stats
    $stats_query = "SELECT blood_group, 
                           COUNT(*) as count, 
                           SUM(quantity_ml) as total_ml 
                    FROM blood_inventory 
                    WHERE status = 'Available' AND expiry_date > CURDATE()
                    GROUP BY blood_group";
    $stats_stmt = $db->prepare($stats_query);
    $stats_stmt->execute();
    $stats = $stats_stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "inventory" => $inventory,
        "stats" => $stats
    ]);

} elseif ($method == 'POST') {
    // Add stock
    $data = json_decode(file_get_contents("php://input"));

    if(!empty($data->bank_id) && !empty($data->blood_group) && !empty($data->quantity_ml)) {
        $query = "INSERT INTO blood_inventory 
                  SET bank_id = :bank_id,
                      blood_group = :blood_group,
                      component_type = :component_type,
                      quantity_ml = :quantity_ml,
                      collection_date = :collection_date,
                      expiry_date = :expiry_date,
                      status = 'Available'";

        $stmt = $db->prepare($query);

        // Calculate default expiry if not provided (42 days for whole blood)
        $collection_date = $data->collection_date ?? date('Y-m-d');
        $expiry_date = $data->expiry_date ?? date('Y-m-d', strtotime($collection_date . ' + 42 days'));
        $component_type = $data->component_type ?? 'Whole Blood';

        $stmt->bindParam(":bank_id", $data->bank_id);
        $stmt->bindParam(":blood_group", $data->blood_group);
        $stmt->bindParam(":component_type", $component_type);
        $stmt->bindParam(":quantity_ml", $data->quantity_ml);
        $stmt->bindParam(":collection_date", $collection_date);
        $stmt->bindParam(":expiry_date", $expiry_date);

        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Stock added successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to add stock."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}
?>

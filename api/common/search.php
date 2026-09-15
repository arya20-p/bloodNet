<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/donor.php';

$database = new Database();
$db = $database->getConnection();
$donor = new Donor($db);

// Get search parameters
$filters = [
    'blood_group' => isset($_GET['blood_group']) ? $_GET['blood_group'] : '',
    'city' => isset($_GET['city']) ? $_GET['city'] : '',
    'radius' => isset($_GET['radius']) ? $_GET['radius'] : ''
];

$donors = $donor->searchDonors($filters);

// Get blood banks with same blood group
if(!empty($filters['blood_group'])) {
    $bank_query = "SELECT b.bank_name, b.address, b.city, b.phone,
                          SUM(i.quantity_ml) as available_ml
                   FROM blood_banks b
                   JOIN blood_inventory i ON b.bank_id = i.bank_id
                   WHERE i.blood_group = :blood_group
                     AND i.status = 'Available'
                     AND i.expiry_date > CURDATE()
                   GROUP BY b.bank_id
                   LIMIT 10";

    $bank_stmt = $db->prepare($bank_query);
    $bank_stmt->bindParam(':blood_group', $filters['blood_group']);
    $bank_stmt->execute();
    $blood_banks = $bank_stmt->fetchAll(PDO::FETCH_ASSOC);
} else {
    $blood_banks = [];
}

$response = [
    "donors" => $donors,
    "blood_banks" => $blood_banks,
    "count" => count($donors),
    "filters" => $filters
];

http_response_code(200);
echo json_encode($response);
?>
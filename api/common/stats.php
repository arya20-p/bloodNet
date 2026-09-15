<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
$database = new Database();
$db = $database->getConnection();

$donor_id = $_GET['donor_id'] ?? null;

// Total Lives Impacted (Rough Estimate: 1 donation = 3 lives)
$lives_impacted_query = "SELECT COUNT(*) as total_donations FROM donation_records";
if ($donor_id) {
    $lives_impacted_query .= " WHERE donor_id = :donor_id";
}
$stmt = $db->prepare($lives_impacted_query);
if ($donor_id) $stmt->bindParam(':donor_id', $donor_id);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);
$total_donations = $row['total_donations'];
$lives_impacted = $total_donations * 3;

// Recent Activities (Donations & Requests)
$activities = [];

// Get recent donations
$donations_query = "SELECT donation_date as date, 'Donation' as type, 'Blood Donation Completed' as description 
                    FROM donation_records 
                    ORDER BY donation_date DESC LIMIT 5";
if ($donor_id) {
    $donations_query = "SELECT donation_date as date, 'Donation' as type, 'Blood Donation Completed' as description 
                        FROM donation_records 
                        WHERE donor_id = :donor_id 
                        ORDER BY donation_date DESC LIMIT 5";
}
$stmt = $db->prepare($donations_query);
if ($donor_id) $stmt->bindParam(':donor_id', $donor_id);
$stmt->execute();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $activities[] = $row;
}

// Get recent requests (Assuming user can see fulfilled requests)
$requests_query = "SELECT fulfilled_date as date, 'Request' as type, CONCAT('Request Fulfilled for ', hospital_name) as description 
                   FROM blood_requests 
                   WHERE request_status = 'Fulfilled' 
                   ORDER BY fulfilled_date DESC LIMIT 3";
$stmt = $db->prepare($requests_query);
$stmt->execute();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $activities[] = $row;
}

// Sort combined activities by date
usort($activities, function($a, $b) {
    return strtotime($b['date']) - strtotime($a['date']);
});

echo json_encode([
    "donation_stats" => [
        "total" => $total_donations,
        "lives_impacted" => $lives_impacted
    ],
    "recent_activities" => array_slice($activities, 0, 5)
]);
?>

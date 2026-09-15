<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$status = isset($_GET['status']) ? $_GET['status'] : 'Upcoming';
$city = isset($_GET['city']) ? $_GET['city'] : '';

$query = "SELECT d.*, 
                 COUNT(DISTINCT a.donor_id) as registered_donors,
                 COUNT(DISTINCT dr.donation_id) as actual_donations
          FROM donation_drives d
          LEFT JOIN donation_appointments a ON d.drive_id = a.drive_id AND a.status = 'Scheduled'
          LEFT JOIN donation_records dr ON d.drive_id = dr.drive_id
          WHERE d.status = :status";

$params = [':status' => $status];

if(!empty($city)) {
    $query .= " AND d.city LIKE :city";
    $params[':city'] = "%$city%";
}

$query .= " GROUP BY d.drive_id ORDER BY d.drive_date ASC";

$stmt = $db->prepare($query);
foreach($params as $key => $value) {
    $stmt->bindValue($key, $value);
}

$stmt->execute();
$drives = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get upcoming drives for calendar
$calendar_query = "SELECT drive_id, drive_name, drive_date, start_time, end_time, city
                   FROM donation_drives 
                   WHERE drive_date >= CURDATE() 
                     AND status = 'Upcoming'
                   ORDER BY drive_date 
                   LIMIT 10";

$calendar_stmt = $db->prepare($calendar_query);
$calendar_stmt->execute();
$calendar_drives = $calendar_stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "drives" => $drives,
    "calendar_drives" => $calendar_drives,
    "count" => count($drives)
]);
?>
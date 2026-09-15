<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // List drives (for blood bank dashboard)
    $bank_id = $_GET['bank_id'] ?? null;
    $status = $_GET['status'] ?? 'Upcoming';
    
    $query = "SELECT * FROM donation_drives WHERE status = :status";
    if($bank_id) {
        $query .= " AND bank_id = :bank_id";
    }
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':status', $status);
    if($bank_id) {
        $stmt->bindParam(':bank_id', $bank_id);
    }
    
    $stmt->execute();
    $drives = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["drives" => $drives]);

} elseif ($method == 'POST') {
    // Schedule a new drive
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->drive_name) && !empty($data->drive_date) && !empty($data->location)) {
        
        $query = "INSERT INTO donation_drives 
                  SET bank_id = :bank_id,
                      drive_name = :drive_name,
                      drive_date = :drive_date,
                      start_time = :start_time,
                      end_time = :end_time,
                      location = :location,
                      city = :city,
                      organizer = :organizer,
                      contact_number = :contact_number,
                      status = 'Upcoming',
                      target_donors = :target_donors"; // Optional
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(":bank_id", $data->bank_id);
        $stmt->bindParam(":drive_name", $data->drive_name);
        $stmt->bindParam(":drive_date", $data->drive_date);
        $stmt->bindParam(":start_time", $data->start_time);
        $stmt->bindParam(":end_time", $data->end_time);
        $stmt->bindParam(":location", $data->location);
        $stmt->bindParam(":city", $data->city);
        $stmt->bindParam(":organizer", $data->organizer);
        $stmt->bindParam(":contact_number", $data->contact_number);
        $stmt->bindParam(":target_donors", $data->target_donors);
        
        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Drive scheduled successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to schedule drive."]);
        }
    }
}
?>

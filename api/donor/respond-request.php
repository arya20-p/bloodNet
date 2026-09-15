<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../../config/database.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));
$donor_id = 1; // From Auth Token (Mock for now)

if(!empty($data->request_id)) {
    // Log the response
    $query = "INSERT INTO notifications (user_id, donor_id, title, message, type)
              VALUES (NULL, :donor_id, 'Request Response', :message, 'Request Update')";
    
    $stmt = $db->prepare($query);
    $message = "Donor #$donor_id has responded to help with Request #$data->request_id";
    
    $stmt->bindParam(':donor_id', $donor_id);
    $stmt->bindParam(':message', $message);
    
    if($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Response recorded."]);
    } else {
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Failed to record response."]);
    }
}
?>

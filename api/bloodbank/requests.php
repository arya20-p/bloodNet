<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get blood requests
        $status = isset($_GET['status']) ? $_GET['status'] : 'Pending';
        $bank_id = isset($_GET['bank_id']) ? $_GET['bank_id'] : null;
        
        $query = "SELECT r.*, b.bank_name as fulfilled_by_name 
                  FROM blood_requests r
                  LEFT JOIN blood_banks b ON r.fulfilled_by_bank = b.bank_id
                  WHERE 1=1";
        
        $params = [];
        
        if($bank_id) {
            $query .= " AND (r.fulfilled_by_bank = :bank_id OR r.fulfilled_by_bank IS NULL)";
            $params[':bank_id'] = $bank_id;
        }
        
        if($status != 'All') {
            $query .= " AND r.request_status = :status";
            $params[':status'] = $status;
        }
        
        $query .= " ORDER BY 
            CASE r.urgency_level 
                WHEN 'Critical' THEN 1
                WHEN 'High' THEN 2
                WHEN 'Medium' THEN 3
                WHEN 'Low' THEN 4
            END, r.request_date DESC";
        
        $stmt = $db->prepare($query);
        foreach($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(["requests" => $requests]);
        break;
        
    case 'POST':
        // Create new blood request
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO blood_requests 
                  SET patient_name = :patient_name,
                      patient_age = :patient_age,
                      blood_group = :blood_group,
                      component_type = :component_type,
                      quantity_required = :quantity_required,
                      hospital_name = :hospital_name,
                      hospital_address = :hospital_address,
                      urgency_level = :urgency_level,
                      required_date = :required_date,
                      contact_person = :contact_person,
                      contact_number = :contact_number,
                      email = :email,
                      notes = :notes,
                      request_status = 'Pending'";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(":patient_name", $data->patient_name);
        $stmt->bindParam(":patient_age", $data->patient_age);
        $stmt->bindParam(":blood_group", $data->blood_group);
        $stmt->bindParam(":component_type", $data->component_type);
        $stmt->bindParam(":quantity_required", $data->quantity_required);
        $stmt->bindParam(":hospital_name", $data->hospital_name);
        $stmt->bindParam(":hospital_address", $data->hospital_address);
        $stmt->bindParam(":urgency_level", $data->urgency_level);
        $stmt->bindParam(":required_date", $data->required_date);
        $stmt->bindParam(":contact_person", $data->contact_person);
        $stmt->bindParam(":contact_number", $data->contact_number);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":notes", $data->notes);
        
        if($stmt->execute()) {
            $request_id = $db->lastInsertId();
            
            // Check immediate availability
            $availability_query = "SELECT b.bank_name, b.address, b.city, b.phone,
                                          SUM(i.quantity_ml) as available_ml
                                   FROM blood_banks b
                                   JOIN blood_inventory i ON b.bank_id = i.bank_id
                                   WHERE i.blood_group = :blood_group
                                     AND i.status = 'Available'
                                     AND i.expiry_date > CURDATE()
                                   GROUP BY b.bank_id
                                   HAVING available_ml >= :required_ml
                                   LIMIT 5";
            
            $avail_stmt = $db->prepare($availability_query);
            $avail_stmt->bindParam(':blood_group', $data->blood_group);
            $required_ml = $data->quantity_required * 450;
            $avail_stmt->bindParam(':required_ml', $required_ml);
            $avail_stmt->execute();
            $available_banks = $avail_stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                "message" => "Blood request submitted successfully.",
                "request_id" => $request_id,
                "available_banks" => $available_banks,
                "status" => "success"
            ]);
        } else {
            echo json_encode([
                "message" => "Unable to submit request.",
                "status" => "error"
            ]);
        }
        break;
        
    case 'PUT':
        // Update request status
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE blood_requests 
                  SET request_status = :status,
                      fulfilled_date = CASE WHEN :status = 'Fulfilled' THEN CURDATE() ELSE NULL END,
                      fulfilled_by_bank = :bank_id
                  WHERE request_id = :request_id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":bank_id", $data->bank_id);
        $stmt->bindParam(":request_id", $data->request_id);
        
        if($stmt->execute()) {
            echo json_encode(["message" => "Request updated successfully.", "status" => "success"]);
        } else {
            echo json_encode(["message" => "Update failed.", "status" => "error"]);
        }
        break;
}
?>
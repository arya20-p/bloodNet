<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/donor.php';

$database = new Database();
$db = $database->getConnection();
$donor = new Donor($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    if($donor->login($data->email, $data->password)) {
        // Create JWT token (simplified version)
        $token = base64_encode(json_encode([
            "donor_id" => $donor->donor_id,
            "email" => $donor->email,
            "exp" => time() + (24 * 60 * 60) // 24 hours
        ]));

        http_response_code(200);
        echo json_encode([
            "message" => "Login successful.",
            "token" => $token,
            "donor" => [
                "donor_id" => $donor->donor_id,
                "full_name" => $donor->full_name,
                "email" => $donor->email,
                "blood_group" => $donor->blood_group,
                "is_verified" => $donor->is_verified
            ],
            "status" => "success"
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "message" => "Invalid email or password.",
            "status" => "error"
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "message" => "Email and password are required.",
        "status" => "error"
    ]);
}
?>
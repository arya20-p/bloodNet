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

if(
    !empty($data->full_name) &&
    !empty($data->email) &&
    !empty($data->phone) &&
    !empty($data->password) &&
    !empty($data->blood_group) &&
    !empty($data->date_of_birth)
) {
    $donor->full_name = $data->full_name;
    $donor->email = $data->email;
    $donor->phone = $data->phone;
    $donor->password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    $donor->blood_group = $data->blood_group;
    $donor->date_of_birth = $data->date_of_birth;
    $donor->gender = $data->gender ?? null;
    $donor->weight = $data->weight ?? null;
    $donor->address = $data->address ?? null;
    $donor->city = $data->city ?? null;
    $donor->state = $data->state ?? null;
    $donor->zip_code = $data->zip_code ?? null;
    $donor->health_conditions = $data->health_conditions ?? null;

    if($donor->create()) {
        http_response_code(201);
        echo json_encode([
            "message" => "Donor registered successfully.",
            "donor_id" => $donor->donor_id,
            "status" => "success"
        ]);
    } else {
        http_response_code(503);
        echo json_encode([
            "message" => "Unable to register donor.",
            "status" => "error"
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "message" => "Incomplete data provided.",
        "status" => "error"
    ]);
}
?>
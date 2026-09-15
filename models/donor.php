<?php
class Donor {
    private $conn;
    private $table_name = "donors";

    public $donor_id;
    public $full_name;
    public $email;
    public $phone;
    public $password_hash;
    public $blood_group;
    public $date_of_birth;
    public $gender;
    public $weight;
    public $address;
    public $city;
    public $state;
    public $zip_code;
    public $health_conditions;
    public $last_donation_date;
    public $is_available;
    public $is_verified;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Register new donor
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    full_name = :full_name,
                    email = :email,
                    phone = :phone,
                    password_hash = :password_hash,
                    blood_group = :blood_group,
                    date_of_birth = :date_of_birth,
                    gender = :gender,
                    weight = :weight,
                    address = :address,
                    city = :city,
                    state = :state,
                    zip_code = :zip_code,
                    health_conditions = :health_conditions,
                    is_available = :is_available,
                    is_verified = :is_verified";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->blood_group = htmlspecialchars(strip_tags($this->blood_group));
        $this->date_of_birth = htmlspecialchars(strip_tags($this->date_of_birth));
        $this->gender = htmlspecialchars(strip_tags($this->gender ?? ""));
        $this->weight = htmlspecialchars(strip_tags($this->weight ?? ""));
        $this->address = htmlspecialchars(strip_tags($this->address ?? ""));
        $this->city = htmlspecialchars(strip_tags($this->city ?? ""));
        $this->state = htmlspecialchars(strip_tags($this->state ?? ""));
        $this->zip_code = htmlspecialchars(strip_tags($this->zip_code ?? ""));
        $this->health_conditions = htmlspecialchars(strip_tags($this->health_conditions ?? ""));
        
        // Default values
        $this->is_available = $this->is_available ?? 1;
        $this->is_verified = $this->is_verified ?? 0;

        // Bind values
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":password_hash", $this->password_hash);
        $stmt->bindParam(":blood_group", $this->blood_group);
        $stmt->bindParam(":date_of_birth", $this->date_of_birth);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":weight", $this->weight);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":state", $this->state);
        $stmt->bindParam(":zip_code", $this->zip_code);
        $stmt->bindParam(":health_conditions", $this->health_conditions);
        $stmt->bindParam(":is_available", $this->is_available);
        $stmt->bindParam(":is_verified", $this->is_verified);

        if($stmt->execute()) {
            $this->donor_id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Login donor
    public function login($email, $password) {
        $query = "SELECT donor_id, full_name, password_hash, blood_group, is_verified 
                  FROM " . $this->table_name . "
                  WHERE email = :email LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($email));
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $row['password_hash'])) {
                $this->donor_id = $row['donor_id'];
                $this->full_name = $row['full_name'];
                $this->blood_group = $row['blood_group'];
                $this->is_verified = $row['is_verified'];
                return true;
            }
        }
        return false;
    }

    // Check if email exists
    public function emailExists() {
        $query = "SELECT donor_id, full_name, password_hash
                FROM " . $this->table_name . "
                WHERE email = ?
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }
}
?>

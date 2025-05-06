<?php
$host = 'localhost';
$dbname = 'campus_hub';
$username = 'root';
$password = ''; // Leave blank if you're using default XAMPP setup

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    // Enable PDO exceptions for better error handling
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Exit with error message if connection fails
    die("Connection failed: " . $e->getMessage());
}
?>

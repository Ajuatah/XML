<?php
require 'db_config.php';

$page = $_POST['page'];
$title = $_POST['title'];
$body = $_POST['body'];

$stmt = $conn->prepare("INSERT INTO page_content (page, title, body) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $page, $title, $body);
$stmt->execute();
$stmt->close();
$conn->close();
?>
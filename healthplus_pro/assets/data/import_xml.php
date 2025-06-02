<?php
require '../../db_config.php'; // DB connection ($conn)

// Load and parse the XML file
$xml = simplexml_load_file('content.xml') or die("Failed to load XML");

// Loop through each page in XML
foreach ($xml->children() as $page => $content) {
    $title = $content->title;
    $body = $content->body;

    // Prepare SQL insert
    $stmt = $conn->prepare("INSERT INTO page_content (page, title, body) VALUES (?, ?, ?)
                            ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body)");
    $stmt->bind_param("sss", $page, $title, $body);
    $stmt->execute();
    $stmt->close();
}

$conn->close();

echo "XML content successfully imported to database.";
?>
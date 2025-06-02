<?php
require 'db_config.php'; // Include database config

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = hash('sha256', $_POST['password']);
    $role = 'user'; // Default role

    $stmt = $conn->prepare("INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $username, $password, $role);

    if ($stmt->execute()) {
        echo "<script>alert('Registration successful!'); window.location='login.php';</script>";
    } else {
        echo "<script>alert('Error during registration.');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register | HealthPlus Pro</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/script.js" defer></script>
</head>
<body data-page="register">
  <header>
    <h1 id="title">Register</h1>
  </header>
  <nav>
    <a href="index.php">Home</a>
    <a href="register.php">Register</a>
    <a href="login.php">Login</a>
    <a href="blog.php">Blog</a>
    <a href="contact.php">Contact</a>
  </nav>
  <div class="container">
    <div id="content">Loading content...</div>
    <form action="register.php" method="post">
      <label>Name:</label><br>
      <input type="text" name="name" required><br><br>

      <label>Email:</label><br>
      <input type="email" name="email" required><br><br>

      <label>Username:</label><br>
      <input type="text" name="username" required><br><br>

      <label>Password:</label><br>
      <input type="password" name="password" required><br><br>

      <input type="submit" name="submit" value="Register">
    </form>
  </div>
  <footer>© 2025 HealthPlus Pro. All rights reserved.</footer>
</body>
</html>
<?php
session_start();
require 'db_config.php';  // includes $conn for DB connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = hash('sha256', $_POST['password']);

    $stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND password=?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        if ($user['role'] === 'admin') {
            header("Location: admin_dashboard.php");
        } else {
            header("Location: user_dashboard.php");
        }
        exit();
    } else {
        $error = "Invalid username or password!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Login | HealthPlus Pro</title>
  <link rel="stylesheet" href="assets/css/style.css" />
  <script src="assets/js/script.js" defer></script>
</head>
<body data-page="login">
  <header>
    <h1 id="title">HealthPlus Pro</h1>
  </header>

  <nav>
    <a href="index.php">Home</a>
    <a href="about.php">About</a>
    <a href="blog.php">Blog</a>
    <a href="contact.php">Contact</a>
    <a href="register.php">Register</a>
    <a href="login.php" class="active">Login</a>
  </nav>

  <div class="container">
    <h2>Login to Your Account</h2>
    
    <?php if (!empty($error)) : ?>
      <p style="color: red;"><?php echo $error; ?></p>
    <?php endif; ?>

    <form action="login.php" method="post">
      <label for="username">Username:</label><br />
      <input type="text" id="username" name="username" required /><br /><br />

      <label for="password">Password:</label><br />
      <input type="password" id="password" name="password" required /><br /><br />

      <input type="submit" value="Login" />
    </form>
    <p>Don't have an account? <a href="register.php">Register here</a>.</p>
  </div>

  <footer>
    <p>&copy; 2025 HealthPlus Pro. All rights reserved.</p>
  </footer>
</body>
</html>
<?php
session_start();

// Check if user is logged in and is a regular user
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'user') {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>User Dashboard | HealthPlus Pro</title>
  <link rel="stylesheet" href="../assets/css/style.css" />
</head>
<body>
  <header>
    <h1>User Dashboard</h1>
  </header>
  <nav>
    <a href="user_dashboard.php">Dashboard</a>
    <a href="blog.php">Blog</a>
    <a href="logout.php">Logout</a>
  </nav>

  <main>
    <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
    <p>This is your user dashboard.</p>
    <!-- Add user-specific content here -->
  </main>

  <footer>© 2025 HealthPlus Pro. All rights reserved.</footer>
</body>
</html>
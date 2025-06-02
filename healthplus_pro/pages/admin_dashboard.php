<?php
session_start();

// Check if user is logged in and is admin
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Admin Dashboard | HealthPlus Pro</title>
  <link rel="stylesheet" href="../assets/css/style.css" />
</head>
<body>
  <header>
    <h1>Admin Dashboard</h1>
  </header>
  <nav>
    <a href="admin_dashboard.php">Dashboard</a>
    <a href="manage_users.php">Manage Users</a>
    <a href="blog.php">Blog</a>
    <a href="logout.php">Logout</a>
  </nav>

  <main>
    <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
    <p>This is the admin dashboard where you can manage the site.</p>
    <!-- Add admin-specific content here -->
  </main>

  <footer>© 2025 HealthPlus Pro. All rights reserved.</footer>
</body>
</html>
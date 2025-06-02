<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

require 'db_config.php';

// Handle delete request
if (isset($_GET['delete'])) {
    $delete_id = intval($_GET['delete']);

    // Prevent admin from deleting themselves (optional)
    if ($delete_id !== $_SESSION['user_id']) {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $delete_id);
        $stmt->execute();
        $stmt->close();
    }

    header("Location: manage_users.php");
    exit();
}

$result = $conn->query("SELECT id, name, email, username, role FROM users");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manage Users | Admin Dashboard</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <header>
        <h1>Manage Users</h1>
        <nav>
            <a href="admin_dashboard.php">Dashboard</a> |
            <a href="logout.php">Logout</a>
        </nav>
    </header>
    <main>
        <table border="1" cellpadding="8" cellspacing="0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows > 0): ?>
                    <?php while ($user = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?= htmlspecialchars($user['id']) ?></td>
                            <td><?= htmlspecialchars($user['name']) ?></td>
                            <td><?= htmlspecialchars($user['email']) ?></td>
                            <td><?= htmlspecialchars($user['username']) ?></td>
                            <td><?= htmlspecialchars($user['role']) ?></td>
                            <td>
                                <a href="edit_user.php?id=<?= $user['id'] ?>">Edit</a> |
                                <?php if ($user['id'] !== $_SESSION['user_id']): ?>
                                    <a href="manage_users.php?delete=<?= $user['id'] ?>" onclick="return confirm('Are you sure you want to delete this user?');">Delete</a>
                                <?php else: ?>
                                    <!-- No delete link for self -->
                                    <em>Cannot delete self</em>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr><td colspan="6">No users found.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </main>
</body>
</html>
async function validateLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Send login request to backend API
        const response = await fetch('http://localhost:3001/api/doctors/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const doctorData = await response.json();
        
        // Store doctor information in localStorage
        localStorage.setItem('loggedDoctor', JSON.stringify({
            id: doctorData.id,
            name: doctorData.name
        }));

        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to registration page after short delay
        setTimeout(() => {
            window.location.href = 'index.html?load=registration';
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Invalid username or password', 'error');
    }
}

// Add this to your DOMContentLoaded event listener
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    validateLogin();
});
// ========================
// PATIENT REGISTRATION SYSTEM
// ========================

async function registerPatient() {
    // Get the logged-in doctor from localStorage
    const doctor = JSON.parse(localStorage.getItem('loggedDoctor'));
    if (!doctor) {
        showNotification("Please log in before registering patients.", "error");
        return false;
    }

    // Get form data
    const form = document.getElementById("registration-form");
    const formData = new FormData(form);
    
    // Prepare patient data
    const patientData = {
        name: formData.get("name"),
        age: formData.get("age"),
        room: formData.get("room"),
        sickness: formData.get("sickness"),
        doctor_id: doctor.id
    };

    // Validate required fields
    if (!patientData.name || !patientData.age || !patientData.room || !patientData.sickness) {
        showNotification("Please fill in all required fields.", "error");
        return false;
    }

    try {
        // Send data to backend API
        const response = await fetch('http://localhost:3001/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        // Show success message and redirect
        showNotification(`Patient ${patientData.name} registered successfully!`, "success");
        setTimeout(() => {
            window.location.href = "index.html?load=home";
        }, 1500);

        return true;
    } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message || "Failed to register patient", "error");
        return false;
    }
}

// ========================
// FORM INITIALIZATION
// ========================

document.addEventListener("DOMContentLoaded", function() {
    const regForm = document.getElementById("registration-form");
    if (regForm) {
        regForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            await registerPatient();
        });
    }

    // Check if doctor is logged in
    const doctor = JSON.parse(localStorage.getItem('loggedDoctor'));
    if (!doctor) {
        showNotification("Please log in to access patient registration.", "error");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
});

// ========================
// UTILITY FUNCTIONS
// ========================

function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}
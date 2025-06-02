// ========================
// MAIN PAGE LOADING SYSTEM
// ========================

async function loadPage(xmlFile, xslFile) {
    try {
        // Load XML content
        const xmlResponse = await fetch(xmlFile);
        if (!xmlResponse.ok) throw new Error(`Failed to load XML file: ${xmlFile}`);
        const xmlText = await xmlResponse.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        // Load XSL content
        const xslResponse = await fetch(xslFile);
        if (!xslResponse.ok) throw new Error(`Failed to load XSL file: ${xslFile}`);
        const xslText = await xslResponse.text();
        const xsl = parser.parseFromString(xslText, "text/xml");

        // Apply transformation
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        const resultFragment = xsltProcessor.transformToFragment(xml, document);

        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = "";
        contentDiv.appendChild(resultFragment);

        // Special handling for home page
        if (xslFile.includes("home.xsl")) {
            await loadPatients();
            attachTableEvents();
        }
        if (xslFile.includes("registration.xsl")) {
            const form = document.getElementById("registration-form");
            if (form) {
                form.onsubmit = function (e) {
                    e.preventDefault();
                    registerPatient();
                };
            }
        }
        if (xslFile.includes("signin.xsl")) {
            const form = document.getElementById("signin-form");
            if (form) {
                form.onsubmit = function (e) {
                    e.preventDefault();
                    signInDoctor();
                };
            }
        }
    } catch (error) {
        console.error(error);
        showNotification(error.message, "error");
    }
}

// ========================
// PATIENT MANAGEMENT SYSTEM
// ========================

async function loadPatients() {
    try {
        const doctor = JSON.parse(localStorage.getItem("loggedDoctor"));
        if (!doctor) {
            showNotification("Please log in to view patients", "error");
            return;
        }

        // Fetch patients from backend API
        const response = await fetch(`/api/patients/${doctor.id}`);
        if (!response.ok) throw new Error("Failed to load patients");

        const patients = await response.json();

        // Generate XML for XSLT processing
        let xmlContent = `<?xml version="1.0"?>
            <Hospital>
                <Patients>
                    ${patients.map(patient => `
                    <Patient>
                        <Name>${escapeXml(patient.name)}</Name>
                        <Age>${escapeXml(patient.age)}</Age>
                        <Room>${escapeXml(patient.room)}</Room>
                        <Sickness>${escapeXml(patient.sickness)}</Sickness>
                        <Doctor>${escapeXml(patient.doctor_name || patient.doctor_id)}</Doctor>
                        <Id>${patient.id}</Id>
                    </Patient>
                    `).join('')}
                </Patients>
            </Hospital>`;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
        loadXSLT(xmlDoc, "home.xsl");
    } catch (error) {
        console.error("Error loading patients:", error);
        showNotification("Failed to load patients", "error");
    }
}

function showNotification(message, type = "success") {
    let notification = document.createElement("div");
    notification.className = "notification " + type;
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
}

function checkAuth() {
    const doctor = JSON.parse(localStorage.getItem("loggedDoctor"));
    if (!doctor) {
        loadPage("signin.xml", "signin.xsl");
        return false;
    }
    return true;
}

function signInDoctor() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("loggedDoctor", JSON.stringify(data.doctor));
            showNotification("Sign in successful!", "success");
            loadPage("home.xml", "home.xsl");
        } else {
            showNotification("Invalid credentials.", "error");
        }
    });
}

function registerPatient() {
    if (!checkAuth()) return;
    const doctor = JSON.parse(localStorage.getItem("loggedDoctor"));
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const room = document.getElementById("room").value;
    const sickness = document.getElementById("sickness").value;
    fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, room, sickness, doctor_id: doctor.id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification("Patient registered!", "success");
            loadPage("home.xml", "home.xsl");
        } else {
            showNotification("Registration failed.", "error");
        }
    });
}

function deletePatient(id) {
    if (!checkAuth()) return;
    fetch(`/api/patients/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification("Patient deleted.", "success");
            loadPage("home.xml", "home.xsl");
        } else {
            showNotification("Delete failed.", "error");
        }
    });
}

// Attach event listeners after XSLT loads
function attachTableEvents() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => deletePatient(btn.getAttribute("data-id"));
    });
}

// Utility function for XSLT rendering
async function loadXSLT(xmlDoc, xslFile) {
    try {
        const xslResponse = await fetch(xslFile);
        if (!xslResponse.ok) throw new Error(`Failed to load XSL file: ${xslFile}`);

        const xslText = await xslResponse.text();
        const parser = new DOMParser();
        const xsl = parser.parseFromString(xslText, "text/xml");

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        const resultFragment = xsltProcessor.transformToFragment(xmlDoc, document);

        const contentDiv = document.getElementById("content");
        contentDiv.innerHTML = "";
        contentDiv.appendChild(resultFragment);

        attachTableEvents();
    } catch (error) {
        console.error("XSLT Processing Error:", error);
        showNotification("Failed to process page content", "error");
    }
}

// ========================
// INITIALIZATION
// ========================

window.addEventListener("DOMContentLoaded", function() {
    // Load appropriate page
    const params = new URLSearchParams(window.location.search);
    const pageToLoad = params.get("load") || "home";

    if (pageToLoad === "registration") {
        loadPage("registration.xml", "registration.xsl");
    } else if (pageToLoad === "signin") {
        loadPage("signin.xml", "signin.xsl");
    } else {
        loadPage("signin.xml", "signin.xsl");
    }
});

// Utility for XML escaping
function escapeXml(unsafe) {
    if (!unsafe) return "";
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
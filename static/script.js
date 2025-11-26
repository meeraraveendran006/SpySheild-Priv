function logMessage(message, type = 'safe') {
    const logContainer = document.getElementById('activityLog');
    const logEntry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    
    // Create the log entry with timestamp and content
    logEntry.className = 'log-message log-' + type; // e.g., 'log-alert', 'log-safe'
    logEntry.textContent = `[${timestamp}] ${message}`;
    
    // Add the new message to the top of the log
    logContainer.prepend(logEntry);

    // Keep the log length manageable (e.g., max 50 entries)
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

function downloadLog() {
    const logContainer = document.getElementById('activityLog');
    let logContent = "Privacy Guard Activity Log\n";
    logContent += "--------------------------------------\n";

    // Read log entries from bottom up (oldest to newest) to save them in chronological order
    const messages = Array.from(logContainer.children).reverse();
    
    messages.forEach(entry => {
        logContent += entry.textContent + "\n";
    });

    // Create a Blob (Binary Large Object) and a temporary link to trigger download
    const blob = new Blob([logContent], { type: 'text/plain' });
    const a = document.createElement('a');
    
    a.href = URL.createObjectURL(blob);
    a.download = `PrivacyGuard_Log_${new Date().toISOString().slice(0, 10)}.txt`; // Filename with today's date
    
    // Append link, click it, and remove it immediately
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function fetchAlerts() {
    fetch("/get_alerts")
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("alertTable");
        table.innerHTML = ""; // clear previous alerts
        
        // Update the "Last checked" timestamp
        const lastCheckedElement = document.getElementById("last-checked");
        if (lastCheckedElement) {
            const now = new Date();
            lastCheckedElement.textContent = now.toLocaleTimeString();
        }
        
        // Log the overall status first
        const overallStatus = document.getElementById('overall-status').textContent;
        const isCritical = document.getElementById('status-box').classList.contains('status-red');
        
        // Log the overall security status (e.g., "System Safe" or "CRITICAL ALERT")
        logMessage(overallStatus, isCritical ? 'critical' : 'safe');


        if(data.length === 0){
            // Log a safe status and display it in the table
            table.innerHTML = `<tr><td colspan="2" class="safe-status">No app is accessing camera/mic</td></tr>`;
        } else {
            // Log and display the specific alerts
            data.forEach(item => {
                logMessage(`[ALERT] ${item.app}: ${item.alert}`, 'alert');
                
                const row = document.createElement("tr");
                row.innerHTML = `<td>${item.app}</td><td class="danger">${item.alert}</td>`;
                table.appendChild(row);
            });
        }
    });
}

// Fetch alerts every 2 seconds
setInterval(fetchAlerts, 2000);
fetchAlerts(); // initial load

setInterval(fetchAlerts, 2000);
setInterval(fetchLogs, 2000);

fetchAlerts();
fetchLogs();



function fetchAlerts() {
    fetch("/get_alerts")
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("alertTable");
        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML = `<tr><td colspan="2" style="color: #0f0;">No app is accessing camera/mic</td></tr>`;
        } else {
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${item.app}</td><td class="danger">${item.alert}</td>`;
                table.appendChild(row);
            });
        }
    });
}

function fetchLogs() {
    fetch("/get_logs")
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("logTable");
        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML = `<tr><td colspan="2" style="color: #999;">No logs yet</td></tr>`;
        } else {
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${item.time}</td><td>${item.log}</td>`;
                table.appendChild(row);
            });
        }
    });
}

setInterval(fetchAlerts, 2000);
setInterval(fetchLogs, 2000);

fetchAlerts();
fetchLogs();



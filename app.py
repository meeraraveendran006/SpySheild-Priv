from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

apps_list = ["Zoom", "Skype", "CameraApp", "Teams", "Discord", "Slack"]

# --- CRITICAL ALERT LOGIC (Added previously) ---
# Function to determine the overall security status for the dashboard
def get_security_status():
    # Simulate a critical threat detection (e.g., 1 out of 5 times)
    if random.randint(1, 5) == 1:
        status_data = {
            "status": "CRITICAL ALERT: Unauthorized Access Detected!",
            "status_color": "red"
        }
    else:
        status_data = {
            "status": "Monitoring Active: System Safe",
            "status_color": "green"
        }
    return status_data
# --- END CRITICAL ALERT LOGIC ---

@app.route('/')
def welcome():
    return render_template("welcome.html")

@app.route('/dashboard')
def home():
    # Pass the critical status variables to the index.html template
    security_status = get_security_status()
    
    return render_template(
        "index.html",
        apps=apps_list,
        status=security_status["status"],          
        status_color=security_status["status_color"]
    )

@app.route('/get_alerts')
def get_alerts():
    # Logic for generating random access alerts for the table
    alerts = []
    for app_name in apps_list:
        cam_access = random.choice([True, False])
        mic_access = random.choice([True, False])
        if cam_access or mic_access:
            text = f"{app_name} is accessing "
            if cam_access:
                text += "Camera"
            if cam_access and mic_access:
                text += " & "
            if mic_access:
                text += "Microphone"
            alerts.append({"app": app_name, "alert": text})
    return jsonify(alerts)

if __name__ == "__main__":
    app.run(debug=True)
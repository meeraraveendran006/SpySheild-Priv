from flask import Flask, render_template, jsonify
import random
import datetime

app = Flask(__name__)

apps_list = ["Zoom", "Skype", "CameraApp", "Teams", "Discord", "Slack"]
logs = []   # store logs globally

@app.route('/')
def welcome():
    return render_template("welcome.html")

@app.route('/dashboard')
def dashboard():
    return render_template("index.html", apps=apps_list)

@app.route('/get_alerts')
def get_alerts():
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
            
            # store log entry
            logs.append({
                "time": datetime.datetime.now().strftime("%H:%M:%S"),
                "log": text
            })

            alerts.append({"app": app_name, "alert": text})

    return jsonify(alerts)

@app.route('/get_logs')
def get_logs():
    return jsonify(logs[-10:])   # return only last 10 logs

if __name__ == "__main__":
    app.run(debug=True)




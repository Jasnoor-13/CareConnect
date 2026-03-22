from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app) # Allows React to communicate with Flask

# Simulated Database (Replace with MongoDB connection later)
hospitals = [
    {"id": 1, "name": "City General", "lat": 28.6139, "lng": 77.2090, "occupancy": "High"},
    {"id": 2, "name": "Care Clinic", "lat": 28.6200, "lng": 77.2100, "occupancy": "Low"}
]

@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    # Provides data for the Proximity-based Discovery [cite: 92]
    return jsonify(hospitals)

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    # AI-powered First Aid & Medicine Assistance logic [cite: 91, 116]
    user_msg = request.json.get('message', '').lower()
    if "burn" in user_msg:
        reply = "Run cool water over the area for 10 minutes. Do not apply ice."
    elif "fever" in user_msg:
        reply = "Stay hydrated and rest. Consult a doctor if temperature exceeds 102°F."
    else:
        reply = "I am connecting you to a professional. Please stay calm."
    return jsonify({"reply": reply})

@app.route('/api/queue-status', methods=['GET'])
def queue_status():
    # Real-time OPD & Emergency Room Queue Visibility [cite: 89]
    return jsonify({
        "opd_wait": random.randint(10, 60), 
        "emergency_priority": "High"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
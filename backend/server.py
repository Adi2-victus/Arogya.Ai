
# This file represents a simplified backend server (Python/Flask) implementation
# For a real production application, it would need proper error handling, security, etc.

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json
import os
from datetime import datetime
import threading
import time

# Import ML libraries
# In a production environment, you would use proper ML frameworks like PyTorch, TensorFlow, etc.
try:
    import torch
    import transformers
    from transformers import pipeline
    HAS_ML_LIBS = True
except ImportError:
    HAS_ML_LIBS = False
    print("ML libraries not found. Running in mock mode.")

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Mock database (in a real app, use MongoDB or similar)
users_db = {}
health_records_db = {}
appointments_db = {}
medications_db = {}

# Mock NLP model for symptom analysis
class MockSymptomAnalyzer:
    def __init__(self):
        # These would be learned embeddings in a real model
        self.condition_keywords = {
            "cold": ["cough", "sneeze", "runny nose", "sore throat", "congestion"],
            "flu": ["fever", "body ache", "fatigue", "headache", "chills"],
            "covid": ["fever", "cough", "shortness of breath", "loss of taste", "loss of smell"],
            "allergies": ["sneezing", "itchy eyes", "runny nose", "congestion"],
            "migraine": ["headache", "nausea", "sensitivity to light", "aura"],
            "food poisoning": ["nausea", "vomiting", "diarrhea", "stomach cramps"],
            "anxiety": ["worry", "restlessness", "rapid heartbeat", "trouble sleeping"]
        }
    
    def analyze(self, symptoms_text):
        symptoms_text = symptoms_text.lower()
        results = []
        
        for condition, keywords in self.condition_keywords.items():
            score = 0
            matched_keywords = []
            
            for keyword in keywords:
                if keyword in symptoms_text:
                    score += 1
                    matched_keywords.append(keyword)
            
            if matched_keywords:
                confidence = min(90, (score / len(keywords)) * 100)
                results.append({
                    "condition": condition.title(),
                    "confidence": round(confidence + np.random.uniform(-10, 10), 1),  # Add some randomness
                    "matched_symptoms": matched_keywords
                })
        
        # Sort by confidence
        results = sorted(results, key=lambda x: x["confidence"], reverse=True)
        
        if not results:
            results.append({
                "condition": "Unknown",
                "confidence": 20.0,
                "matched_symptoms": []
            })
        
        return results[:3]  # Return top 3 conditions

# Initialize mock symptom analyzer
symptom_analyzer = MockSymptomAnalyzer()

# Mock mental health chatbot
class MockMentalHealthChatbot:
    def __init__(self):
        # Simple rule-based responses for demo purposes
        self.responses = {
            "anxiety": [
                "I understand you're feeling anxious. Deep breathing can help - try taking slow, deep breaths for a few minutes.",
                "Anxiety is common, and there are ways to manage it. Have you tried mindfulness techniques?",
                "I hear that you're experiencing anxiety. Sometimes, focusing on the present moment can help reduce anxious thoughts."
            ],
            "depression": [
                "I'm sorry to hear you're feeling down. Remember that your feelings are valid, and help is available.",
                "Depression can be really challenging. Have you spoken to anyone else about how you're feeling?",
                "Thank you for sharing that with me. It takes courage to talk about feelings of depression."
            ],
            "stress": [
                "Stress can be overwhelming. Taking short breaks throughout the day might help you manage it better.",
                "Managing stress is important for your wellbeing. Regular physical activity can help reduce stress levels.",
                "It sounds like you're under a lot of pressure. Remember to prioritize self-care during stressful periods."
            ],
            "sleep": [
                "Sleep problems can affect your mental health significantly. Establishing a regular sleep routine might help.",
                "Having trouble sleeping can be frustrating. Limiting screen time before bed could improve your sleep quality.",
                "I understand sleep issues can be challenging. Creating a calm environment before bedtime might help you sleep better."
            ]
        }
        self.default_responses = [
            "Thank you for sharing that with me. How long have you been feeling this way?",
            "I appreciate you opening up about this. Would you like to explore some coping strategies together?",
            "I'm here to listen and support you. Could you tell me more about what you're experiencing?",
            "That sounds challenging. Remember that seeking help is a sign of strength, not weakness.",
            "Your feelings are valid. Would it help to talk about specific situations that trigger these feelings?"
        ]
    
    def get_response(self, user_input):
        user_input = user_input.lower()
        
        for topic, responses in self.responses.items():
            if topic in user_input:
                return np.random.choice(responses)
        
        return np.random.choice(self.default_responses)

# Initialize mock mental health chatbot
mental_health_chatbot = MockMentalHealthChatbot()

# Routes
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "server_time": datetime.now().isoformat(),
        "ml_libraries_available": HAS_ML_LIBS
    })

@app.route("/api/analyze-symptoms", methods=["POST"])
def analyze_symptoms():
    data = request.json
    symptoms_text = data.get("symptoms", "")
    user_info = data.get("userInfo", {})
    
    if not symptoms_text:
        return jsonify({"error": "No symptoms provided"}), 400
    
    analysis_results = symptom_analyzer.analyze(symptoms_text)
    
    response = {
        "results": analysis_results,
        "user_risk_factors": {
            "age": "medium" if user_info.get("age", 0) > 50 else "low",
            "region": "medium" if user_info.get("region") in ["Mumbai", "Delhi", "Bangalore"] else "low",
            "history": "high" if user_info.get("has_chronic_conditions", False) else "low"
        }
    }
    
    return jsonify(response)

@app.route("/api/mental-health/chat", methods=["POST"])
def mental_health_chat():
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # Simulate processing delay
    time.sleep(1)
    
    response = mental_health_chatbot.get_response(user_message)
    
    return jsonify({
        "response": response,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/users/register", methods=["POST"])
def register_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")  # In real app, would be hashed
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    if email in users_db:
        return jsonify({"error": "User already exists"}), 409
    
    user_id = f"user_{len(users_db) + 1}"
    users_db[email] = {
        "id": user_id,
        "email": email,
        "password": password,  # Would be hashed in real app
        "profile": data.get("profile", {})
    }
    
    return jsonify({
        "message": "User registered successfully",
        "user_id": user_id
    })

@app.route("/api/users/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    if email not in users_db or users_db[email]["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    
    return jsonify({
        "message": "Login successful",
        "user_id": users_db[email]["id"],
        "token": f"mock_token_{users_db[email]['id']}"  # In real app, would be a JWT
    })

@app.route("/api/health-records", methods=["POST"])
def save_health_record():
    data = request.json
    user_id = data.get("user_id")
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    record_id = f"record_{len(health_records_db) + 1}"
    health_records_db[record_id] = {
        "id": record_id,
        "user_id": user_id,
        "vital_signs": data.get("vital_signs", {}),
        "medications": data.get("medications", []),
        "conditions": data.get("conditions", []),
        "timestamp": datetime.now().isoformat()
    }
    
    return jsonify({
        "message": "Health record saved",
        "record_id": record_id
    })

@app.route("/api/medications", methods=["GET"])
def get_medications():
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    user_medications = []
    for med_id, med in medications_db.items():
        if med["user_id"] == user_id:
            user_medications.append(med)
    
    return jsonify({"medications": user_medications})

@app.route("/api/health-alerts", methods=["GET"])
def get_health_alerts():
    region = request.args.get("region", "national")
    
    # Mock health alerts
    alerts = [
        {
            "id": "alert_1",
            "title": "Influenza Outbreak",
            "description": "Increased cases of influenza reported in your area.",
            "severity": "medium",
            "region": "Maharashtra",
            "date": "2023-07-15"
        },
        {
            "id": "alert_2",
            "title": "Heat Wave Warning",
            "description": "Extreme temperatures expected. Stay hydrated and avoid outdoor activities during peak hours.",
            "severity": "high",
            "region": "national",
            "date": "2023-07-20"
        },
        {
            "id": "alert_3",
            "title": "Dengue Prevention",
            "description": "Mosquito-borne disease season. Remove standing water sources around homes.",
            "severity": "medium",
            "region": "Karnataka",
            "date": "2023-07-10"
        }
    ]
    
    # Filter alerts by region if specified
    if region != "national":
        alerts = [alert for alert in alerts if alert["region"] == region or alert["region"] == "national"]
    
    return jsonify({"alerts": alerts})

# This would run in a production environment
if __name__ == "__main__":
    print("Starting ArogyaAI+ Backend Server...")
    print(f"ML Libraries Available: {HAS_ML_LIBS}")
    
    # In a real app, you would initialize ML models here
    if HAS_ML_LIBS:
        print("Loading NLP models...")
        # Example:
        # symptom_analyzer = pipeline("text-classification", model="healthcare/symptom-analysis")
        # mental_health_model = pipeline("text-generation", model="healthcare/mental-health-support")
    
    app.run(debug=True, port=5000)

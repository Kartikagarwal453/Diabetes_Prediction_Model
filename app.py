from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)

# Global variables for model and scaler
model = None
scaler = None



def load_saved_model():
    """Load the saved model and scaler if they exist"""
    global model, scaler
    
    if os.path.exists('Models/model.pkl') and os.path.exists('Models/scaler.pkl'):
        model = joblib.load('Models/model.pkl')
        scaler = joblib.load('Models/scaler.pkl')
        print("Loaded saved model and scaler")
        return True
    return False

@app.route('/')
def home():
    """Render the main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Predict diabetes based on input features"""
    try:
        # Ensure model and scaler are loaded
        if model is None or scaler is None:
            return jsonify({'error': 'Model not loaded. Ensure model.pkl and scaler.pkl are present.'}), 500
        # Get input data
        data = request.get_json()
        
        # Extract features in the correct order
        features = [
            float(data['pregnancies']),
            float(data['glucose']),
            float(data['bloodPressure']),
            float(data['skinThickness']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['diabetesPedigree']),
            float(data['age'])
        ]
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Scale the features
        features_scaled = scaler.transform(features_array)
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]

        # Debug logging to help diagnose always-negative predictions
        print("[DEBUG] Raw features:", features)
        print("[DEBUG] Scaled features:", features_scaled.tolist())
        print("[DEBUG] Predicted class:", int(prediction))
        print("[DEBUG] Probabilities [class 0, class 1]:", probability.tolist())
        
        # Return result
        result = {
            'prediction': 'Diabetic' if prediction == 1 else 'Not Diabetic',
            'probability': float(probability[1] if prediction == 1 else probability[0]),
            'confidence': f"{max(probability) * 100:.1f}%",
            'probabilities': {
                '0': float(probability[0]),
                '1': float(probability[1])
            },
            'class_order': model.classes_.tolist() if hasattr(model, 'classes_') else [0, 1]
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/model_info')
def model_info():
    """Return information about the model"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    feature_names = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
                    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
    
    # Get feature importance
    importance = model.feature_importances_
    feature_importance = dict(zip(feature_names, importance))
    
    return jsonify({
        'feature_importance': feature_importance,
        'n_estimators': model.n_estimators,
        'model_type': 'Decision Tree Classifier'
    })

if __name__ == '__main__':
    # Try loading saved artifacts before starting the server
    if not load_saved_model():
        print("Warning: model.pkl/scaler.pkl not found. Place them in the project root.")
    print("Starting Flask app...")
    app.run(debug=True, host='0.0.0.0', port=5000) 
# Diabetes Prediction Model Web Application

A complete web application for predicting diabetes risk using a Support Vector Machine (SVC) model. The application provides a user-friendly interface for healthcare professionals to input patient data and receive instant diabetes risk predictions.

## Features

- **Machine Learning Model**: Support Vector Classifier (linear kernel) trained on the diabetes dataset
- **Web Interface**: Modern, responsive web form with real-time validation
- **API Endpoint**: RESTful API for predictions
- **Model Persistence**: Pre-trained artifacts loaded via joblib
- **Input Validation**: Client-side and server-side validation
- **Loading Animations**: Smooth user experience with loading states
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## File Structure

```
/project-root
├── app.py                 # Flask backend application
├── templates/
│   └── index.html        # Frontend HTML template
├── static/
│   ├── style.css         # CSS styles
│   └── script.js         # JavaScript functionality
├── Models/
│   ├── model.pkl         # Trained SVC model file
│   └── scaler.pkl        # Feature scaler file (StandardScaler)
├── diabetes.csv          # Dataset
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Dataset

The application uses the diabetes dataset (`diabetes.csv`) with the following features:
- **Pregnancies**: Number of times pregnant
- **Glucose**: Plasma glucose concentration (mg/dL)
- **BloodPressure**: Diastolic blood pressure (mm Hg)
- **SkinThickness**: Triceps skin fold thickness (mm)
- **Insulin**: 2-Hour serum insulin (mu U/ml)
- **BMI**: Body mass index (kg/m²)
- **DiabetesPedigreeFunction**: Diabetes pedigree function
- **Age**: Age in years
- **Outcome**: Target variable (0 = Not Diabetic, 1 = Diabetic)

## Installation

1. **Clone or download the project files**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure model artifacts are present**:
   - Confirm `Models/model.pkl` and `Models/scaler.pkl` exist
   - If retraining, place new artifacts in the `Models/` directory

## Usage

1. **Start the application**:
   ```bash
   python app.py
   ```

2. **Access the web interface**:
   - Open your browser and go to `http://localhost:5000`
   - The application loads the pre-trained model and scaler on startup

3. **Make predictions**:
   - Fill in the patient information form
   - Click "Predict Diabetes Risk"
   - View the prediction result and confidence level

## API Usage

The application provides a REST API endpoint for programmatic access:

**Endpoint**: `POST /predict`

**Request Body** (JSON):
```json
{
    "pregnancies": 6,
    "glucose": 148,
    "bloodPressure": 72,
    "skinThickness": 35,
    "insulin": 0,
    "bmi": 33.6,
    "diabetesPedigree": 0.627,
    "age": 50
}
```

**Response** (JSON):
```json
{
    "prediction": "Diabetic",
    "probability": 0.85,
    "confidence": "85.0%"
}
```

## Model Information

- **Algorithm**: Support Vector Classifier (SVC)
- **Kernel**: Linear
- **Feature Scaling**: StandardScaler
- **Probability Estimates**: Enabled via Platt scaling (`probability=True`)
- **Model Persistence**: Saved using joblib

## Technical Details

### Backend (Flask)
- **Framework**: Flask 2.3.3
- **Machine Learning**: scikit-learn 1.3.0
- **Data Processing**: pandas 2.1.1, numpy 1.24.3
- **Model Persistence**: joblib 1.3.2

### Frontend
- **HTML5**: Semantic markup with form validation
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: ES6+ with async/await for API calls
- **Responsive Design**: Mobile-first approach

### Features
- **Input Validation**: Real-time validation with helpful error messages
- **Loading States**: Visual feedback during API calls
- **Keyboard Navigation**: Tab and Enter key support
- **Accessibility**: ARIA labels and focus management
- **Error Handling**: Graceful error display and recovery

## Development

### Adding New Features
1. **Backend**: Modify `app.py` to add new endpoints or model improvements
2. **Frontend**: Update HTML, CSS, or JavaScript files in their respective directories
3. **Model**: Update the exported artifacts to evolve the prediction pipeline

### Customizing the Model
- Update your training pipeline to retrain the SVC (or alternative model) and export new `model.pkl` / `scaler.pkl`
- Replace `Models/model.pkl` and `Models/scaler.pkl` with the newly trained artifacts
- Adjust frontend or backend logic if feature engineering steps change

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the port in `app.py`: `app.run(debug=True, host='0.0.0.0', port=5001)`

2. **Model not loading**:
   - Ensure `Models/model.pkl` and `Models/scaler.pkl` are present and readable
   - Check that the artifacts were created with scikit-learn 1.3.x-compatible versions

3. **Frontend not loading**:
   - Verify Flask is running on the correct port
   - Check browser console for JavaScript errors

### Performance Optimization
- The pre-trained SVC and scaler load once at startup and remain cached in memory
- For production deployments, consider using a WSGI server (e.g., Gunicorn or uWSGI) behind a reverse proxy
- Monitor inference latency if you replace the model with a more complex estimator



---

**Note**: This application is for educational purposes and should not be used for actual medical diagnosis without proper validation and clinical oversight. 
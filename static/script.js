// DOM elements
const predictionForm = document.getElementById('predictionForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const loadingSpinner = document.querySelector('.loading-spinner');
const resultContainer = document.getElementById('resultContainer');
const predictionResult = document.getElementById('predictionResult');
const confidenceLevel = document.getElementById('confidenceLevel');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');

// Form validation function
function validateForm() {
    const inputs = predictionForm.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value || input.value.trim() === '') {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Show loading state
function showLoading() {
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'flex';
}

// Hide loading state
function hideLoading() {
    submitBtn.disabled = false;
    btnText.style.display = 'block';
    loadingSpinner.style.display = 'none';
}

// Show result
function showResult(result) {
    // Hide any existing error
    errorContainer.style.display = 'none';
    
    // Set prediction result
    predictionResult.textContent = result.prediction;
    predictionResult.className = `prediction-result ${result.prediction.toLowerCase().replace(' ', '-')}`;
    
    // Set confidence level
    confidenceLevel.textContent = result.confidence;
    
    // Show result container
    resultContainer.style.display = 'block';
    
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show error
function showError(message) {
    // Hide result container
    resultContainer.style.display = 'none';
    
    // Set error message
    errorMessage.textContent = message;
    
    // Show error container
    errorContainer.style.display = 'block';
    
    // Scroll to error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Format form data
function formatFormData(formData) {
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = parseFloat(value);
    }
    return data;
}

// Make prediction API call
async function makePrediction(formData) {
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        return result;
    } catch (error) {
        console.error('Prediction error:', error);
        throw new Error('Failed to get prediction. Please try again.');
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showError('Please fill in all required fields with valid values.');
        return;
    }
    
    // Get form data
    const formData = new FormData(predictionForm);
    const data = formatFormData(formData);
    
    // Show loading state
    showLoading();
    
    try {
        // Make prediction
        const result = await makePrediction(data);
        
        // Show result
        showResult(result);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Add input validation on blur
function addInputValidation() {
    const inputs = predictionForm.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && (!input.value || input.value.trim() === '')) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error') && input.value && input.value.trim() !== '') {
                input.classList.remove('error');
            }
        });
    });
}

// Add keyboard navigation
function addKeyboardNavigation() {
    const inputs = predictionForm.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                
                // If it's the last input, submit the form
                if (index === inputs.length - 1) {
                    predictionForm.dispatchEvent(new Event('submit'));
                } else {
                    // Focus next input
                    inputs[index + 1].focus();
                }
            }
        });
    });
}

// Add form reset functionality
function addFormReset() {
    // Add a reset button or clear form functionality
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = 'Clear Form';
    resetBtn.className = 'reset-btn';
    resetBtn.style.cssText = `
        background: #6b7280;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        margin-left: 10px;
        transition: all 0.3s ease;
    `;
    
    resetBtn.addEventListener('click', () => {
        predictionForm.reset();
        resultContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        
        // Remove error classes
        const inputs = predictionForm.querySelectorAll('input');
        inputs.forEach(input => input.classList.remove('error'));
    });
    
    // Add reset button next to submit button
    const formActions = document.querySelector('.form-actions');
    formActions.appendChild(resetBtn);
}

// Initialize the application
function init() {
    // Add event listeners
    predictionForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    addInputValidation();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    // Add form reset functionality
    addFormReset();
    
    // Add hover effects for better UX
    const inputs = predictionForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    console.log('Diabetes Prediction App initialized successfully!');
}

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', init);

// Add some helpful tooltips or hints
function addHelpfulHints() {
    const hints = {
        'glucose': 'Normal fasting glucose is 70-100 mg/dL',
        'bmi': 'Normal BMI range is 18.5-24.9',
        'bloodPressure': 'Normal blood pressure is below 120/80 mm Hg',
        'age': 'Enter age in years'
    };
    
    Object.entries(hints).forEach(([field, hint]) => {
        const input = document.getElementById(field);
        if (input) {
            input.title = hint;
        }
    });
}

// Call helpful hints function
document.addEventListener('DOMContentLoaded', addHelpfulHints); 
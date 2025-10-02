import sys, json, joblib, pandas as pd
import os
# Load trained model + scaler + features
BASE_DIR = os.path.dirname(__file__)

# Load model from the same folder
model_path = os.path.join(BASE_DIR, "yield_model.pkl")
model_data = joblib.load(model_path)
model = model_data["model"]
scaler = model_data["scaler"]
features = model_data["features"]

# Read input JSON from Node backend
input_json = json.loads(sys.argv[1])

# Convert input into DataFrame
df = pd.DataFrame([input_json])

# One-hot encode categorical variables
df = pd.get_dummies(df)

# Align DataFrame columns with training features
df = df.reindex(columns=features, fill_value=0)

# Scale features
X_scaled = scaler.transform(df)

# Make prediction
prediction = model.predict(X_scaled)[0]

# Return result
print(json.dumps(float(prediction)))
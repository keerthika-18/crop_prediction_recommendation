import sys
import json
import joblib
import numpy as np
import pandas as pd
from pytorch_tabnet.tab_model import TabNetClassifier

# === Load Artifacts ===
scaler = joblib.load("C:\\Users\\Keethika P\\crop-prediction-system\\backend\\backend\\tabnet_scaler.pkl")
label_encoder = joblib.load("C:\\Users\\Keethika P\\crop-prediction-system\\backend\\backend\\tabnet_label_encoder.pkl")
feature_encoders = joblib.load("C:\\Users\\Keethika P\\crop-prediction-system\\backend\\backend\\tabnet_feature_encoders.pkl")
clf = TabNetClassifier()
clf.load_model("C:\\Users\\Keethika P\\crop-prediction-system\\backend\\backend\\tabnet_model.zip.zip")

# === Read Input from Node.js ===
input_data = json.loads(sys.stdin.read())

# Convert to DataFrame
df = pd.DataFrame([input_data])
# Convert input keys to lowercase to match training dataset

# --- Align column names with training ---
expected_features = scaler.feature_names_in_  # features used during training
# Map lowercase/uppercase differences
rename_map = {col.lower(): col for col in expected_features}
df.columns = [rename_map.get(c.lower(), c) for c in df.columns]

# --- Apply categorical encoders ---
for col, encoder in feature_encoders.items():
    if col in df.columns:
        df[col] = encoder.transform(df[col].astype(str))

# --- Ensure correct column order & fill missing ---
df = df.reindex(columns=expected_features, fill_value=0)

# --- Scale numeric features ---
num_cols = [col for col in expected_features if col not in feature_encoders]
df[num_cols] = scaler.transform(df[num_cols])

# --- Predict ---
X_final = df.values
pred = clf.predict(X_final)
pred_crop = label_encoder.inverse_transform(pred)[0]

print(json.dumps({"recommended_crop": pred_crop}))
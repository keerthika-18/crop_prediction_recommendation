import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor
from sklearn.ensemble import RandomForestRegressor, VotingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Load dataset
data = pd.read_csv("C:\\Users\\Keethika P\\crop-prediction-system\\backend\\crop_dataset.csv")

# Check columns
print("Columns:", data.columns)

# Define features (X) and target (y)
X = data.drop(columns=["Yield","Production"])
y = data["Yield"]


# Handle categorical data if any
X = pd.get_dummies(X, drop_first=True)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features for MLP
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define models
mlp = MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=1000, random_state=42)
rf = RandomForestRegressor(n_estimators=200, random_state=42)

# Combine models using Voting Regressor
model = VotingRegressor(estimators=[("mlp", mlp), ("rf", rf)])

# Train model
model.fit(X_train_scaled, y_train)

# Predictions
y_pred = model.predict(X_test_scaled)

# Evaluate
print("MSE:", mean_squared_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))

# Save model and scaler
joblib.dump({"model": model, "scaler": scaler, "features": X.columns.tolist()}, "yield_model.pkl")
print("Model saved as yield_model.pkl")

import numpy as np
import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from pytorch_tabnet.tab_model import TabNetClassifier
import joblib
import os

# === Settings ===
SEED = 42
np.random.seed(SEED)
torch.manual_seed(SEED)

# === Load dataset ===
FILE_PATH = "C:\\Users\\Keethika P\\crop-prediction-system\\backend\\Crop_recommendation_5000.csv"
df = pd.read_csv(FILE_PATH)
print("Dataset shape:", df.shape)

# === Features & Target ===
target_col = "label"  # make sure your dataset has this column
X = df.drop(columns=[target_col])
y = df[target_col].astype(str)

# === Encode target ===
label_encoder = LabelEncoder()
y_enc = label_encoder.fit_transform(y)
n_classes = len(label_encoder.classes_)
print("Classes:", n_classes, label_encoder.classes_)

# === Identify categorical & numeric columns ===
categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()
numeric_cols = X.select_dtypes(exclude=["object"]).columns.tolist()
print("Categorical:", categorical_cols)
print("Numeric:", numeric_cols)

# === Encode categorical features ===
encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    encoders[col] = le

# === Scale numeric features ===
scaler = StandardScaler()
X[numeric_cols] = scaler.fit_transform(X[numeric_cols])

# === Final numpy arrays for TabNet ===
X_final = X.values

# === Train-test split ===
X_train, X_test, y_train, y_test = train_test_split(
    X_final, y_enc,
    test_size=0.2,
    random_state=SEED,
    stratify=y_enc
)

# === TabNet model ===
clf = TabNetClassifier(
    seed=SEED,
    n_d=16, n_a=16, n_steps=5,
    gamma=1.5, lambda_sparse=1e-3,
    optimizer_params=dict(lr=2e-2),
    scheduler_params={"step_size": 10, "gamma": 0.9},
    scheduler_fn=torch.optim.lr_scheduler.StepLR,
    mask_type="entmax"
)

# === Train model ===
clf.fit(
    X_train, y_train,
    eval_set=[(X_train, y_train), (X_test, y_test)],
    eval_name=["train", "valid"],
    eval_metric=["accuracy"],
    max_epochs=200,
    patience=20,
    batch_size=256,
    virtual_batch_size=64,
    num_workers=0,
    drop_last=False
)

# === Evaluate ===
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"✅ TabNet Test Accuracy: {acc*100:.2f}%")
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# === Save artifacts ===
os.makedirs("backend/models", exist_ok=True)
joblib.dump(scaler, "backend/tabnet_scaler.pkl")
joblib.dump(label_encoder, "backend/tabnet_label_encoder.pkl")
joblib.dump(encoders, "backend/tabnet_feature_encoders.pkl")
clf.save_model("backend/tabnet_model.zip")  # save as zip

print("💾 Model, scaler, and encoders saved in backend/models/")

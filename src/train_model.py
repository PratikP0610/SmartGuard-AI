import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

import pickle


# Load data
data = pd.read_csv("data/machine_sensor_data.csv")


# Features and target

X = data.drop("Machine_Failure", axis=1)

y = data["Machine_Failure"]


# Split dataset

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create model

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# Train model

model.fit(X_train, y_train)


# Test model

predictions = model.predict(X_test)


accuracy = accuracy_score(
    y_test,
    predictions
)


print("Model Accuracy:", accuracy)

print(classification_report(
    y_test,
    predictions
))


# Save model

with open("models/failure_prediction_model.pkl", "wb") as file:
    pickle.dump(model, file)


print("Model saved successfully!")
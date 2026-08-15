import pickle
import numpy as np


# Load trained model

with open("models/failure_prediction_model.pkl", "rb") as file:
    model = pickle.load(file)


def predict_failure(
    temperature,
    vibration,
    pressure,
    rpm,
    operating_hours
):

    input_data = np.array(
        [[
            temperature,
            vibration,
            pressure,
            rpm,
            operating_hours
        ]]
    )

    prediction = model.predict(input_data)

    probability = model.predict_proba(input_data)


    if prediction[0] == 1:
        result = "High Risk - Machine Failure Possible"
    else:
        result = "Low Risk - Machine Healthy"


    confidence = round(
        max(probability[0]) * 100,
        2
    )


    return result, confidence
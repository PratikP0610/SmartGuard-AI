import pandas as pd
import numpy as np

# Make results reproducible
np.random.seed(42)

# Number of machine records
samples = 1000

temperature = np.random.normal(70, 15, samples)
vibration = np.random.normal(0.5, 0.2, samples)
pressure = np.random.normal(120, 20, samples)
rpm = np.random.normal(3000, 500, samples)
operating_hours = np.random.randint(100, 5000, samples)

# Failure logic (simulating real-world behaviour)
failure = (
    (temperature > 90) |
    (vibration > 0.8) |
    (operating_hours > 4000)
).astype(int)

# Create dataframe
data = pd.DataFrame({
    "Temperature": temperature,
    "Vibration": vibration,
    "Pressure": pressure,
    "RPM": rpm,
    "Operating_Hours": operating_hours,
    "Machine_Failure": failure
})

# Save dataset
data.to_csv("data/machine_sensor_data.csv", index=False)

print("Dataset created successfully!")
print(data.head())
def calculate_performance(temp, rain, wind, humidity, base_lap=90):
    # Grip from temperature
    grip = 100 - max(0, (temp - 25) * 1.5)
    # Rain reduces grip
    grip -= min(rain * 10, 50)

    # Downforce loss from wind
    downforce = 100 - min(wind * 1.2, 25)

    # Engine power loss from humidity
    power = 100 - max(0, (humidity - 50) * 0.3)

    # Lap time calculation
    lap_delta = base_lap * (1 + ((100 - grip) + (100 - downforce) + (100 - power)) / 300)

    return {
        "grip": round(grip, 1),
        "downforce": round(downforce, 1),
        "engine_power": round(power, 1),
        "lap_time": round(lap_delta, 2)
    }

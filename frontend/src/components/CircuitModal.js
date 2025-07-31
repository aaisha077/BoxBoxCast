import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CircuitModal = ({ circuit, onClose }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [drsEnabled, setDrsEnabled] = useState(false); //  DRS state

  // Tire Data
  const tireData = {
    Soft: {
      advantages: ["Maximum grip", "Fast warm-up"],
      disadvantages: ["Overheats quickly", "High degradation"],
      notes: "Best for qualifying or short aggressive stints."
    },
    Medium: {
      advantages: ["Balanced performance", "Prevents overheating"],
      disadvantages: ["Not as grippy as Soft", "Slower than Soft"],
      notes: "Ideal for mixed strategies, good race tire."
    },
    Hard: {
      advantages: ["Very durable", "Handles high temps well"],
      disadvantages: ["Low initial grip", "Long warm-up period"],
      notes: "Used for long stints in hot races."
    },
    Intermediate: {
      advantages: ["Good in damp conditions", "Flexible in changing weather"],
      disadvantages: ["Wears quickly on dry track"],
      notes: "Used when track is wet but not fully soaked."
    },
    FullWet: {
      advantages: ["Maximum water dispersion", "Safe in heavy rain"],
      disadvantages: ["Very slow on dry track"],
      notes: "Only for extreme wet races."
    }
  };

  // Fetch Weather and reset UI states when circuit changes
  useEffect(() => {
    if (!circuit) return;
    setPerformance(null);
    setActiveSection(null); // close all sections when circuit changes
    setDrsEnabled(false); // reset DRS toggle when circuit changes
    fetchWeather();
  }, [circuit]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/weather/coords?lat=${circuit.lat}&lon=${circuit.lon}`
      );
      const data = await res.json();
      const { performance: _, ...cleaned } = data;
      setWeather(cleaned);
    } catch (err) {
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tire Recommendation
  const getRecommendedTire = () => {
    if (!weather) return { name: "N/A", data: {} };
    if (weather.rain > 0) return { name: "FullWet", data: tireData.FullWet };
    if (weather.temp < 15) return { name: "Soft", data: tireData.Soft };
    if (weather.temp > 35) return { name: "Hard", data: tireData.Hard };
    return { name: "Medium", data: tireData.Medium };
  };

  // Performance Simulation including DRS
  const simulatePerformance = () => {
    if (!weather) return;
    const { temp, rain, wind, humidity } = weather;

    let grip = 100 - Math.max(0, (temp - 25) * 1.5);
    grip -= Math.min(rain * 10, 50);

    let downforce = 100 - Math.min(wind * 1.2, 25);
    let power = 100 - Math.max(0, (humidity - 50) * 0.3);

    let lap_time = 90 * (1 + ((100 - grip) + (100 - downforce) + (100 - power)) / 300);

    // Apply DRS effect if enabled and dry conditions
    let drsEffect = 0;
    if (drsEnabled && rain === 0) {
      drsEffect = lap_time * 0.03; // 3% reduction
      lap_time -= drsEffect;
    }

    setPerformance({
      grip: grip.toFixed(1),
      downforce: downforce.toFixed(1),
      engine_power: power.toFixed(1),
      lap_time: lap_time.toFixed(2),
      drsEffect: drsEffect.toFixed(2)
    });
  };

  // Pit Stop & Fuel Strategies
  const pitStrategies = [
    { name: "Soft → Medium → Medium", benefit: "Fast start, balanced wear", stops: 2 },
    { name: "Medium → Hard", benefit: "Less pit time, stable performance", stops: 1 },
    { name: "Soft → Soft → Medium", benefit: "High pace early, risk overheating", stops: 2 }
  ];

  const fuelStrategies = [
    { load: "High Fuel", effect: "Slower start but fewer pit stops" },
    { load: "Medium Fuel", effect: "Balanced lap times & pit frequency" },
    { load: "Low Fuel", effect: "Faster lap times but requires more stops" }
  ];

  if (!circuit) return null;

  const toggleSection = (section) =>
    setActiveSection(activeSection === section ? null : section);

  const recommendedTire = getRecommendedTire();

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-6 rounded-2xl w-[90%] max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl"
        >
          ✖
        </button>

        {/* Circuit Info */}
        <img src={circuit.image} alt={circuit.name} className="rounded-lg mb-4 w-full" />
        <h2 className="text-2xl font-bold text-red-400">{circuit.name}</h2>
        <p className="text-sm text-gray-400">Lat: {circuit.lat} | Lon: {circuit.lon}</p>

        {/* Sections */}
        <div className="mt-4 space-y-2">

          {/* Weather */}
          <div>
            <div
              onClick={() => toggleSection("weather")}
              className="p-3 bg-gray-800 text-red-400 rounded-lg cursor-pointer font-semibold"
            >
              Current Weather
            </div>
            <AnimatePresence>
              {activeSection === "weather" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-700 p-3 rounded-lg"
                >
                  {loading ? (
                    <p className="text-white">Fetching weather...</p>
                  ) : weather ? (
                    <>
                      <p className="text-white">Temperature: {weather.temp}°C</p>
                      <p className="text-white">Humidity: {weather.humidity}%</p>
                      <p className="text-white">Wind: {weather.wind?.speed ?? weather.wind} km/h</p>
                      <p className="text-white">Rain: {weather.rain} mm</p>
                    </>
                  ) : (
                    <p className="text-white">No weather data</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tire Strategy */}
          <div>
            <div
              onClick={() => toggleSection("tire")}
              className="p-3 bg-gray-800 text-red-400 rounded-lg cursor-pointer font-semibold"
            >
              Tire Strategy
            </div>
            <AnimatePresence>
              {activeSection === "tire" && weather && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-700 p-3 rounded-lg"
                >
                  <h4 className="font-bold text-white mb-2">{recommendedTire.name} Tire</h4>

                  <h5 className="text-red-400 font-bold">Advantages:</h5>
                  <ul className="list-disc pl-5">
                    {recommendedTire.data.advantages?.map((a, i) => (
                      <li key={i} className="text-white font-semibold">
                        {a}
                      </li>
                    ))}
                  </ul>

                  <h5 className="text-red-400 font-bold mt-2">Disadvantages:</h5>
                  <ul className="list-disc pl-5">
                    {recommendedTire.data.disadvantages?.map((d, i) => (
                      <li key={i} className="text-white font-semibold">
                        {d}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-2 text-gray-300 italic">{recommendedTire.data.notes}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Performance Simulation */}
          <div>
            <div
              onClick={() => toggleSection("performance")}
              className="p-3 bg-gray-800 text-red-400 rounded-lg cursor-pointer font-semibold"
            >
              Performance Simulation
            </div>
            <AnimatePresence>
              {activeSection === "performance" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-700 p-3 rounded-lg text-white"
                >
                  {/*  DRS Toggle */}
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={drsEnabled}
                      onChange={() => setDrsEnabled(!drsEnabled)}
                      className="mr-2"
                    />
                    Enable DRS (only works in dry conditions)
                  </label>

                  <button
                    onClick={simulatePerformance}
                    disabled={!weather}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg mb-2 disabled:opacity-40"
                  >
                    Run Simulation
                  </button>

                  {performance && (
                    <div>
                      <p>Grip: {performance.grip}</p>
                      <p>Downforce: {performance.downforce}</p>
                      <p>Engine Power: {performance.engine_power}</p>
                      <p>Estimated Lap Time: {performance.lap_time} sec</p>
                      {performance.drsEffect > 0 && (
                        <p className="text-green-400">DRS saved: {performance.drsEffect} sec</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pit Stop Strategy */}
          <div>
            <div
              onClick={() => toggleSection("pit")}
              className="p-3 bg-gray-800 text-red-400 rounded-lg cursor-pointer font-semibold"
            >
              Pit Stop Strategy & Fuel Load
            </div>
            <AnimatePresence>
              {activeSection === "pit" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-700 p-3 rounded-lg"
                >
                  <h4 className="font-bold mb-2 text-red-400">Recommended Pit Strategies:</h4>
                  {pitStrategies.map((s, i) => (
                    <p key={i} className="text-white">
                      • {s.name} – {s.benefit} ({s.stops} stops)
                    </p>
                  ))}

                  <h4 className="font-bold mt-3 mb-2 text-red-400">Fuel Load Effects:</h4>
                  {fuelStrategies.map((f, i) => (
                    <p key={i} className="text-white">
                      • {f.load} – {f.effect}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CircuitModal;

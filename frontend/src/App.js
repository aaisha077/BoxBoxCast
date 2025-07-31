import React, { useState } from "react";
import circuits from "./data/circuits";
import CircuitCard from "./components/CircuitCard";
import CircuitModal from "./components/CircuitModal";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(circuits.length / itemsPerPage);

  const handlePrev = () => {
    if (currentIndex > 0 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalPages - 1 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAnimating(false);
      }, 300);
    }
  };

  const handleCircuitClick = (circuit) => {
    setSelectedCircuit(circuit);
  };

  const closeModal = () => {
    setSelectedCircuit(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-gray-900">
      
      {/*  F1-Themed Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black">
        {/*  Moving Racing Lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"
              style={{
                top: `${i * 10}%`,
                animation: `trackMove ${3 + i}s linear infinite`,
              }}
            />
          ))}
        </div>

        {/*  Circuit Track Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url('/images/f1-track-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "300px 300px",
          }}
        ></div>

        {/*  F1 Car Background */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-20"
          style={{
            backgroundImage: "url('/images/f1car.jpg')",
            backgroundSize: "1400px auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            width: "100%",
            height: "750px",
          }}
        ></div>
      </div>

      {/*  Content Container */}
      <div className="relative z-10 w-full p-6 flex flex-col items-center">
        
        {/*  Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-2 text-red-400 tracking-tight"
              style={{ textShadow: "0 0 8px rgba(233, 0, 0, 0.5)", fontFamily: "'Titillium Web', sans-serif" }}>
            BOX<span className="text-red-600">BOX</span>CAST
          </h1>
          <h2 className="text-2xl font-semibold text-gray-300 uppercase tracking-wider"
              style={{ fontFamily: "'Titillium Web', sans-serif" }}>
            F1 Circuits
          </h2>
        </div>

        {/*  Slider */}
        <div className="relative w-full max-w-6xl overflow-hidden flex justify-center items-center border-t-2 border-b-2 border-red-600 py-8">
          
          {/* Left Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || animating}
            className="absolute left-0 bg-red-600 text-white w-12 h-12 rounded-full hover:bg-red-700 disabled:opacity-40 z-10 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
            style={{ border: "2px solid white", boxShadow: "0 0 0 2px #e90000" }}
          >
            ◀
          </button>

          {/*  Sliding Track */}
          <div className="flex transition-transform duration-300 ease-in-out"
               style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${totalPages * 100}%` }}>
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 w-full flex-shrink-0 px-4" style={{ width: "100%" }}>
                {circuits.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage)
                  .map((c) => (
                    <CircuitCard key={c.id} circuit={c} onSelect={handleCircuitClick} />
                  ))}
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === totalPages - 1 || animating}
            className="absolute right-0 bg-red-600 text-white w-12 h-12 rounded-full hover:bg-red-700 disabled:opacity-40 z-10 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
            style={{ border: "2px solid white", boxShadow: "0 0 0 2px #e90000" }}
          >
            ▶
          </button>
        </div>

        {/*  Page Indicators */}
        <div className="flex items-center mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div key={index} className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index ? "bg-red-600" : "bg-gray-600"} transition-all`}></div>
          ))}
        </div>
      </div>

      {/*  Fullscreen Modal */}
      <CircuitModal circuit={selectedCircuit} onClose={closeModal} />
    </div>
  );
}

export default App;

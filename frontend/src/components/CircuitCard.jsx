import React from "react";

const CircuitCard = ({ circuit, onSelect }) => {
  return (
    <div
      className="bg-gray-900 rounded-2xl shadow-lg p-3 cursor-pointer hover:scale-105 hover:shadow-red-500/40 transition duration-300"
      onClick={() => onSelect(circuit)}
    >
      <img
        src={circuit.image}
        alt={circuit.name}
        className="rounded-xl mb-2 w-full h-40 object-cover"
      />
      <h3 className="text-white text-lg font-semibold text-center">{circuit.name}</h3>
    </div>
  );
};

export default CircuitCard;

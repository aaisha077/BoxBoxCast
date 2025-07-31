export default function PerformanceCard({ condition, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-60 text-center hover:scale-105 transition">
      <h3 className="text-xl font-bold text-gray-700">{condition}</h3>
      <p className="text-2xl text-red-500 font-semibold">{value}</p>
    </div>
  );
}

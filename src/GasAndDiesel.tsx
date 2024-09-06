import './Components.css';
import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";

type FuelType = "gas" | "diesel";

interface DailyData {
  inventoryStock: string;
  openingStock: string;
  todaySale: string;
  newStock: string;
  monthlySale: string;
  [key: number]: any;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const GasAndDiesel: React.FC = () => {
  const { fuelData, updateFuelData, updateViewData } = useGasStation();
  const [fuelType, setFuelType] = useState<FuelType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [currentDayData, setCurrentDayData] = useState<DailyData>({
    inventoryStock: "",
    openingStock: "",
    todaySale: "",
    newStock: "",
    monthlySale: "",
  });
  const [monthlySale, setMonthlySale] = useState("");

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, new Date().getFullYear());

  useEffect(() => {
    if (fuelType) {
      const savedMonthData = fuelData[fuelType][selectedMonth + 1];
      if (savedMonthData) {
        const currentDay = new Date().getDate();
        const savedDayData = savedMonthData[currentDay];
        if (savedDayData) {
          setCurrentDayData(savedDayData);
        } else {
          setCurrentDayData({
            inventoryStock: "",
            openingStock: "",
            todaySale: "",
            newStock: "",
            monthlySale: "",
          });
        }
      } else {
        setCurrentDayData({
          inventoryStock: "",
          openingStock: "",
          todaySale: "",
          newStock: "",
          monthlySale: "",
        });
      }
    }
  }, [fuelType, selectedMonth, fuelData]);

  const handleFuelTypeSelect = (type: FuelType) => {
    setFuelType(type.toLowerCase() as FuelType);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDayData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMonthlyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlySale(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    if (fuelType) {
      const currentDay = new Date().getDate();
      const updatedData = {
        ...currentDayData,
        monthlySale: monthlySale,
        [currentDay]: {
          ...currentDayData,
          monthlySale: monthlySale,
        },
      };
      updateFuelData(fuelType, selectedMonth + 1, currentDay, updatedData);
      updateViewData(fuelType, selectedMonth + 1, {
        [currentDay]: updatedData,
      });
      setCurrentDayData(updatedData);
    }
  };

  const handleFinalSubmit = () => {
    if (fuelType) {
      const currentDay = new Date().getDate();
      const updatedData = {
        ...currentDayData,
        monthlySale: monthlySale,
      };
      updateFuelData(fuelType, selectedMonth + 1, currentDay, updatedData);
      setCurrentDayData(updatedData);
      setMonthlySale("");
    }
  };

  const calculateTotal = () => {
    const opening = parseFloat(currentDayData.openingStock) || 0;
    const sale = parseFloat(currentDayData.todaySale) || 0;
    const newStock = parseFloat(currentDayData.newStock) || 0;
    return (opening - sale + newStock).toFixed(2);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gas and Diesel</h2>
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => handleFuelTypeSelect("gas")}
          className={`px-4 py-2 rounded ${
            fuelType === "gas"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Gas
        </button>
        <button
          onClick={() => handleFuelTypeSelect("diesel")}
          className={`px-4 py-2 rounded ${
            fuelType === "diesel"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Diesel
        </button>
      </div>
      {fuelType && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
          </h3>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Select Month:</label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border rounded p-2 w-full md:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Inventory Stock:</label>
              <input
                type="number"
                name="inventoryStock"
                value={currentDayData.inventoryStock}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Opening Stock:</label>
              <input
                type="number"
                name="openingStock"
                value={currentDayData.openingStock}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Today's Sale:</label>
              <input
                type="number"
                name="todaySale"
                value={currentDayData.todaySale}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">New Stock:</label>
              <input
                type="number"
                name="newStock"
                value={currentDayData.newStock}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Monthly Sale:</label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={monthlySale}
                onChange={handleMonthlyInputChange}
                className="flex-grow border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Total:</label>
            <input
              type="text"
              value={calculateTotal()}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <button
            onClick={handleFinalSubmit}
            className="mb-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Submit All Data
          </button>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`border p-2 text-center rounded ${
                  currentDayData[day]?.monthlySale
                    ? "bg-blue-100 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="font-bold text-gray-700">{day}</div>
                <div className="text-sm text-gray-600">{currentDayData[day]?.monthlySale || ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GasAndDiesel;

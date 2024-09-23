import "./Components.css";
import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";

type FuelType = "gas" | "diesel";

interface DailyData {
  openingStock: string;
  todaySale: string;
  newStock: string;
  monthlySale: string;
  cumulativeMonthlySale: string;
  [key: string]: string;
}

type MonthlyData = { [day: number]: DailyData };

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
  const { updateFuelData, updateViewData } = useGasStation();
  const [fuelType, setFuelType] = useState<FuelType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [currentDayData, setCurrentDayData] = useState<DailyData>({
    openingStock: "",
    todaySale: "",
    newStock: "",
    monthlySale: "",
    cumulativeMonthlySale: "",
  });
  const [monthlySale, setMonthlySale] = useState("");
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({});

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    const savedFuelType = localStorage.getItem(
      "selectedFuelType"
    ) as FuelType | null;
    const savedMonth = localStorage.getItem("selectedMonth");
    const savedDay = localStorage.getItem("selectedDay");

    if (savedFuelType) {
      setFuelType(savedFuelType);
      if (savedMonth) setSelectedMonth(parseInt(savedMonth));
      if (savedDay) setSelectedDay(parseInt(savedDay));
      loadMonthlyData(
        savedFuelType,
        parseInt(savedMonth || "0"),
        new Date().getFullYear()
      );
    }
  };

  const loadMonthlyData = (type: FuelType, month: number, year: number) => {
    const currentMonth = month + 1;
    const savedData = localStorage.getItem(
      `fuelData_${type}_${currentMonth}_${year}`
    );
    if (savedData) {
      const parsedData: MonthlyData = JSON.parse(savedData);
      setMonthlyData(parsedData);
      if (parsedData[selectedDay]) {
        setCurrentDayData(parsedData[selectedDay]);
      }
    }
  };

  useEffect(() => {
    if (fuelType) {
      localStorage.setItem("selectedFuelType", fuelType);
      localStorage.setItem("selectedMonth", selectedMonth.toString());
      localStorage.setItem("selectedDay", selectedDay.toString());
      loadMonthlyData(fuelType, selectedMonth, new Date().getFullYear());
    }
  }, [fuelType, selectedMonth, selectedDay]);

  const handleFuelTypeSelect = (type: FuelType) => {
    setFuelType(type);
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

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = parseInt(e.target.value);
    if (day >= 1 && day <= 31) {
      setSelectedDay(day);
    }
  };

  const handleSubmit = () => {
    if (fuelType) {
      const currentMonth = selectedMonth + 1;
      const currentYear = new Date().getFullYear();
      const updatedMonthlyData: MonthlyData = { ...monthlyData };

      let cumulativeSale = 0;
      for (let i = 1; i <= selectedDay; i++) {
        if (updatedMonthlyData[i] && updatedMonthlyData[i].monthlySale) {
          cumulativeSale += parseFloat(updatedMonthlyData[i].monthlySale) || 0;
        }
      }
      cumulativeSale += parseFloat(monthlySale) || 0;

      const updatedDayData: DailyData = {
        ...currentDayData,
        monthlySale: monthlySale,
        cumulativeMonthlySale: cumulativeSale.toFixed(2),
      };

      updatedMonthlyData[selectedDay] = updatedDayData;

      updateFuelData(fuelType, currentMonth, selectedDay, updatedDayData);
      updateViewData(fuelType, currentMonth, updatedMonthlyData);

      setCurrentDayData(updatedDayData);
      setMonthlyData(updatedMonthlyData);
      setMonthlySale("");

      localStorage.setItem(
        `fuelData_${fuelType}_${currentMonth}_${currentYear}`,
        JSON.stringify(updatedMonthlyData)
      );
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
          <div className="mb-6 flex space-x-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Month:
              </label>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Day:
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={selectedDay}
                onChange={handleDayChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Opening Stock:
              </label>
              <input
                type="number"
                name="openingStock"
                value={currentDayData.openingStock}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Today's Sale:
              </label>
              <input
                type="number"
                name="todaySale"
                value={currentDayData.todaySale}
                onChange={handleInputChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                New Stock:
              </label>
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Monthly Sale:
            </label>
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Total:
            </label>
            <input
              type="text"
              value={calculateTotal()}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Monthly Summary</h4>
            <p>
              Date: {months[selectedMonth]} {selectedDay},{" "}
              {new Date().getFullYear()}
            </p>
            <p>Monthly Sale: {currentDayData.monthlySale || "N/A"}</p>
            <p>
              Cumulative Monthly Sale:{" "}
              {currentDayData.cumulativeMonthlySale || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GasAndDiesel;

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
  const [gasMonthlyData, setGasMonthlyData] = useState<MonthlyData>({});
  const [dieselMonthlyData, setDieselMonthlyData] = useState<MonthlyData>({});
  const [currentDayData, setCurrentDayData] = useState<DailyData>({
    openingStock: "",
    todaySale: "",
    newStock: "",
    monthlySale: "",
    cumulativeMonthlySale: "",
  });
  const [monthlySale, setMonthlySale] = useState("");
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    const savedFuelType = localStorage.getItem(
      "selectedFuelType"
    ) as FuelType | null;
    const savedMonth = localStorage.getItem("selectedMonth");

    if (savedFuelType) {
      setFuelType(savedFuelType);
      if (savedMonth) {
        const month = parseInt(savedMonth);
        setSelectedMonth(month);
        loadMonthlyData(savedFuelType, month);
      }
    }
  };

  const loadMonthlyData = (type: FuelType, month: number) => {
    const currentMonth = month + 1;
    const savedData = localStorage.getItem(`fuelData_${type}_${currentMonth}`);
    if (savedData) {
      const parsedData: MonthlyData = JSON.parse(savedData);
      if (type === "gas") {
        setGasMonthlyData(parsedData);
      } else {
        setDieselMonthlyData(parsedData);
      }
      const currentDay = new Date().getDate();
      if (parsedData[currentDay]) {
        setCurrentDayData(parsedData[currentDay]);
      }
    }
  };

  useEffect(() => {
    if (fuelType) {
      localStorage.setItem("selectedFuelType", fuelType);
      localStorage.setItem("selectedMonth", selectedMonth.toString());
      loadMonthlyData(fuelType, selectedMonth);
    }
  }, [fuelType, selectedMonth]);

  const handleFuelTypeSelect = (type: FuelType) => {
    setFuelType(type);
    setMonthlySale("");
    setCurrentDayData({
      openingStock: "",
      todaySale: "",
      newStock: "",
      monthlySale: "",
      cumulativeMonthlySale: "",
    });
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
      const currentMonth = selectedMonth + 1;
      const updatedMonthlyData =
        fuelType === "gas" ? { ...gasMonthlyData } : { ...dieselMonthlyData };

      let cumulativeSale = 0;
      for (let i = 1; i <= currentDay; i++) {
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

      updatedMonthlyData[currentDay] = updatedDayData;

      updateFuelData(fuelType, currentMonth, currentDay, updatedDayData);
      updateViewData(fuelType, currentMonth, updatedMonthlyData);

      setCurrentDayData(updatedDayData);
      if (fuelType === "gas") {
        setGasMonthlyData(updatedMonthlyData);
      } else {
        setDieselMonthlyData(updatedMonthlyData);
      }
      setMonthlySale("");

      localStorage.setItem(
        `fuelData_${fuelType}_${currentMonth}`,
        JSON.stringify(updatedMonthlyData)
      );
    }
  };

  const handleFinalSubmit = () => {
    if (fuelType) {
      handleSubmit();
    }
  };

  const calculateTotal = () => {
    const opening = parseFloat(currentDayData.openingStock) || 0;
    const sale = parseFloat(currentDayData.todaySale) || 0;
    const newStock = parseFloat(currentDayData.newStock) || 0;
    return (opening - sale + newStock).toFixed(2);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, new Date().getFullYear());

  const handleEdit = (day: number) => {
    setEditingDay(day);
    const monthlyData = fuelType === "gas" ? gasMonthlyData : dieselMonthlyData;
    setEditValue(monthlyData[day]?.monthlySale || "");
  };

  const handleEditSubmit = () => {
    if (editingDay && fuelType) {
      const currentMonth = selectedMonth + 1;
      const updatedMonthlyData =
        fuelType === "gas" ? { ...gasMonthlyData } : { ...dieselMonthlyData };

      updatedMonthlyData[editingDay] = {
        ...updatedMonthlyData[editingDay],
        monthlySale: editValue,
        openingStock: updatedMonthlyData[editingDay]?.openingStock || "",
        todaySale: updatedMonthlyData[editingDay]?.todaySale || "",
        newStock: updatedMonthlyData[editingDay]?.newStock || "",
        cumulativeMonthlySale: "0",
      };

      let cumulativeSale = 0;
      for (let i = 1; i <= daysInMonth; i++) {
        if (updatedMonthlyData[i] && updatedMonthlyData[i].monthlySale) {
          cumulativeSale += parseFloat(updatedMonthlyData[i].monthlySale) || 0;
          updatedMonthlyData[i] = {
            ...updatedMonthlyData[i],
            cumulativeMonthlySale: cumulativeSale.toFixed(2),
          };
        }
      }

      if (fuelType === "gas") {
        setGasMonthlyData(updatedMonthlyData);
      } else {
        setDieselMonthlyData(updatedMonthlyData);
      }
      updateViewData(fuelType, currentMonth, updatedMonthlyData);

      localStorage.setItem(
        `fuelData_${fuelType}_${currentMonth}`,
        JSON.stringify(updatedMonthlyData)
      );

      setEditingDay(null);
      setEditValue("");
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const monthlyData = fuelType === "gas" ? gasMonthlyData : dieselMonthlyData;

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
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Month:
            </label>
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
          <button
            onClick={handleFinalSubmit}
            className="mb-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Submit All Data
          </button>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Days to Display:
            </label>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => (
                  <button
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    className={`p-2 text-center rounded ${
                      selectedDays.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {day}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {selectedDays.map((day) => (
              <div
                key={day}
                className={`border p-2 text-center rounded ${
                  monthlyData[day]?.monthlySale
                    ? "bg-blue-100 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="font-bold text-gray-700">{day}</div>
                {editingDay === day ? (
                  <div>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full p-1 mb-1 text-sm"
                    />
                    <button
                      onClick={handleEditSubmit}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600">
                      {monthlyData[day]?.cumulativeMonthlySale || ""}
                    </div>
                    <button
                      onClick={() => handleEdit(day)}
                      className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      {monthlyData[day]?.monthlySale ? "Edit" : "Add"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GasAndDiesel;

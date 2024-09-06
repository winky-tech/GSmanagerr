import React, { useState } from "react";
import { useGasStation } from "./GasStationContext";
import './Components.css';

const InHandCalculations: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"cash" | "check" | null>(
    null
  );
  const [cashValues, setCashValues] = useState({
    cashOnHand: "",
    cashToBank: "",
    cashFromStore: "",
    extraCash: "",
  });
  const [checkValues, setCheckValues] = useState({
    checkOnHand: "",
    checkToBank: "",
    checkFromStore: "",
    instantBook: "",
  });

  const handleCashInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCashValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckValues((prev) => ({ ...prev, [name]: value }));
  };

  const calculateCashBalance = () => {
    const { cashOnHand, cashToBank, cashFromStore, extraCash } = cashValues;
    return (
      (parseFloat(cashOnHand) || 0) +
      (parseFloat(cashFromStore) || 0) -
      (parseFloat(cashToBank) || 0) -
      (parseFloat(extraCash) || 0)
    ).toFixed(2);
  };

  const calculateCheckBalance = () => {
    const { checkOnHand, checkToBank, checkFromStore } = checkValues;
    return (
      (parseFloat(checkOnHand) || 0) +
      (parseFloat(checkFromStore) || 0) -
      (parseFloat(checkToBank) || 0)
    ).toFixed(2);
  };

  const { updateAllData } = useGasStation();

  const handleSubmitAll = () => {
    updateAllData({
      inHandCalculations: {
        cash: {
          ...cashValues,
          cashBalance: calculateCashBalance(),
        },
        check: {
          ...checkValues,
          checkBalance: calculateCheckBalance(),
        },
      },
    });
  };

  const handleClearAllData = () => {
    const clearedCashValues = Object.fromEntries(
      Object.keys(cashValues).map((key) => [key, ""])
    ) as typeof cashValues;

    const clearedCheckValues = Object.fromEntries(
      Object.keys(checkValues).map((key) => [key, ""])
    ) as typeof checkValues;

    setCashValues(clearedCashValues);
    setCheckValues(clearedCheckValues);
    updateAllData({
      inHandCalculations: {
        cash: clearedCashValues,
        check: clearedCheckValues,
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        In Hand Calculations
      </h2>
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setActiveSection("cash")}
          className={`px-4 py-2 rounded ${
            activeSection === "cash"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setActiveSection("check")}
          className={`px-4 py-2 rounded ${
            activeSection === "check"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Check
        </button>
      </div>

      {activeSection === "cash" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Cash on Hand
            </label>
            <input
              type="number"
              name="cashOnHand"
              value={cashValues.cashOnHand}
              onChange={handleCashInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Cash to Bank
            </label>
            <input
              type="number"
              name="cashToBank"
              value={cashValues.cashToBank}
              onChange={handleCashInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Cash from Store
            </label>
            <input
              type="number"
              name="cashFromStore"
              value={cashValues.cashFromStore}
              onChange={handleCashInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Extra Cash
            </label>
            <input
              type="number"
              name="extraCash"
              value={cashValues.extraCash}
              onChange={handleCashInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Cash Balance
            </label>
            <input
              type="text"
              value={calculateCashBalance()}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
        </div>
      )}

      {activeSection === "check" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check on Hand
            </label>
            <input
              type="number"
              name="checkOnHand"
              value={checkValues.checkOnHand}
              onChange={handleCheckInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check to Bank
            </label>
            <input
              type="number"
              name="checkToBank"
              value={checkValues.checkToBank}
              onChange={handleCheckInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check from Store
            </label>
            <input
              type="number"
              name="checkFromStore"
              value={checkValues.checkFromStore}
              onChange={handleCheckInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Instant Book
            </label>
            <input
              type="number"
              name="instantBook"
              value={checkValues.instantBook}
              onChange={handleCheckInputChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Check Balance
            </label>
            <input
              type="text"
              value={calculateCheckBalance()}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSubmitAll}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Submit All In Hand Calculations Data
        </button>
        <button
          onClick={handleClearAllData}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition duration-300"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default InHandCalculations;

import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";
import "./Components.css";

const SalesManagement: React.FC = () => {
  const {
    calculateLotterySubtotal,
    salesManagementData,
    updateSalesManagementData,
    updateAllData,
  } = useGasStation();
  const [newFieldName, setNewFieldName] = useState("");
  const [total, setTotal] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSalesManagementData({ [name]: value });
  };

  const handleSubmitAll = () => {
    updateAllData({
      salesManagement: {
        ...salesManagementData,
      },
    });
  };

  const handleAddExtraField = () => {
    if (
      newFieldName &&
      !salesManagementData.hasOwnProperty(newFieldName.toLowerCase())
    ) {
      const formattedFieldName =
        newFieldName.charAt(0).toLowerCase() + newFieldName.slice(1);
      updateSalesManagementData({ [formattedFieldName]: "" });
      setNewFieldName("");
    }
  };

  useEffect(() => {
    const calculatedTotal =
      Object.values(salesManagementData).reduce(
        (sum, value) => sum + (parseFloat(value) || 0),
        0
      ) + calculateLotterySubtotal();
    setTotal(calculatedTotal);
  }, [salesManagementData, calculateLotterySubtotal]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Sales Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(salesManagementData).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleInputChange}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              step="0.01"
              min="0"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        <input
          type="text"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          placeholder="New field name"
          className="flex-grow border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAddExtraField}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Extra Field
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">Total</h3>
        <p className="text-2xl font-bold text-green-600">${total.toFixed(2)}</p>
      </div>
      <button
        onClick={handleSubmitAll}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
      >
        Submit All Sales Management Data
      </button>
    </div>
  );
};

export default SalesManagement;

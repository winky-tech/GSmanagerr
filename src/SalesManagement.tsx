import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";
import "./Components.css";

interface SalesManagementData {
  gasSales: string;
  taxGrocerySales: string;
  nonTaxGrocerySales: string;
  deliSales: string;
  lottoSales: string;
  lotterySales: string;
  salesTaxSales: string;
  groceryPurchaseSales: string;
  paidIn: string;
  cashIn: string;
  [key: string]: string; // This allows for additional string properties
}

interface CustomField {
  [key: string]: string;
}

const SalesManagement: React.FC = () => {
  const {
    calculateLotterySubtotal,
    salesManagementData,
    updateSalesManagementData,
    updateAllData,
  } = useGasStation();
  const [newFieldName, setNewFieldName] = useState("");
  const [total, setTotal] = useState(0);
  const [localSalesData, setLocalSalesData] = useState<SalesManagementData>(
    () => {
      const savedData = localStorage.getItem("salesManagementData");
      return savedData ? JSON.parse(savedData) : salesManagementData;
    }
  );
  const [customFields, setCustomFields] = useState<CustomField>(() => {
    const savedCustomFields = localStorage.getItem(
      "salesManagementCustomFields"
    );
    return savedCustomFields ? JSON.parse(savedCustomFields) : {};
  });

  const defaultFields = [
    "gasSales",
    "taxGrocerySales",
    "nonTaxGrocerySales",
    "deliSales",
    "lottoSales",
    "lotterySales",
    "salesTaxSales",
    "groceryPurchaseSales",
    "paidIn",
    "cashIn",
  ];

  useEffect(() => {
    localStorage.setItem("salesManagementData", JSON.stringify(localSalesData));
  }, [localSalesData]);

  useEffect(() => {
    localStorage.setItem(
      "salesManagementCustomFields",
      JSON.stringify(customFields)
    );
  }, [customFields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (defaultFields.includes(name)) {
      setLocalSalesData((prev) => ({ ...prev, [name]: value }));
      updateSalesManagementData({ [name]: value });
    } else {
      setCustomFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitAll = () => {
    const allData = { ...localSalesData, ...customFields };
    updateAllData({
      salesManagement: allData,
    });
    updateSalesManagementData(allData);
    localStorage.setItem("salesManagementAllData", JSON.stringify(allData));
  };

  const handleAddExtraField = () => {
    if (newFieldName && !(newFieldName.toLowerCase() in customFields)) {
      const formattedFieldName =
        newFieldName.charAt(0).toLowerCase() + newFieldName.slice(1);
      setCustomFields((prev) => ({ ...prev, [formattedFieldName]: "" }));
      setNewFieldName("");
    }
  };

  const handleDeleteField = (fieldName: string) => {
    setCustomFields((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  useEffect(() => {
    const calculatedTotal =
      Object.values({ ...localSalesData, ...customFields }).reduce(
        (sum: number, value: string) => sum + (parseFloat(value) || 0),
        0
      ) + calculateLotterySubtotal();
    setTotal(calculatedTotal);
  }, [localSalesData, customFields, calculateLotterySubtotal]);

  const handleClearAllData = () => {
    const clearedValues: SalesManagementData = {
      gasSales: "",
      taxGrocerySales: "",
      nonTaxGrocerySales: "",
      deliSales: "",
      lottoSales: "",
      lotterySales: "",
      salesTaxSales: "",
      groceryPurchaseSales: "",
      paidIn: "",
      cashIn: "",
    };
    setLocalSalesData(clearedValues);
    setCustomFields({});
    updateSalesManagementData(clearedValues);
    localStorage.removeItem("salesManagementData");
    localStorage.removeItem("salesManagementCustomFields");
    localStorage.removeItem("salesManagementAllData");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Sales Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(localSalesData).map(([key, value]) => (
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
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              step="0.01"
              min="0"
            />
          </div>
        ))}
        {Object.entries(customFields).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <div className="flex">
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleInputChange}
                className="flex-grow border rounded-l p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                step="0.01"
                min="0"
              />
              <button
                onClick={() => handleDeleteField(key)}
                className="bg-red-500 text-white px-2 py-1 rounded-r hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
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
      <button
        onClick={handleClearAllData}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
      >
        Clear All Data
      </button>
    </div>
  );
};

export default SalesManagement;

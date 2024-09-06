import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";
import "./Components.css";

const SalesTotals: React.FC = () => {
  const {
    salesManagementData,
    lotterySubtotal,
    salesTotalsData,
    updateSalesTotalsData,
  } = useGasStation();
  const [values, setValues] = useState({
    gas: "",
    lotto: "",
    taxGrocery: "",
    nontaxGrocery: "",
    deli: "",
    salesTax: "",
    groceryPurchase: "",
  });

  const [totals, setTotal] = useState({
    gasTotal: 0,
    lottoTotal: 0,
    taxGroceryTotal: 0,
    nontaxGroceryTotal: 0,
    deliTotal: 0,
    salesTaxTotal: 0,
    groceryPurchaseTotal: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSalesTotalsData({ [name]: value });
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { updateAllData } = useGasStation();

  const handleSubmitAll = () => {
    updateAllData({
      salesTotals: {
        ...values,
      },
    });
  };

  useEffect(() => {
    setTotal({
      gasTotal:
        parseFloat(values.gas || "0") +
        (parseFloat(salesManagementData.gasSales) || 0),
      lottoTotal:
        parseFloat(values.lotto || "0") +
        (parseFloat(salesManagementData.lottoSales) || 0) +
        parseFloat(String(lotterySubtotal) || "0"),
      taxGroceryTotal:
        parseFloat(values.taxGrocery || "0") +
        (parseFloat(salesManagementData.taxGrocerySales) || 0),
      nontaxGroceryTotal:
        parseFloat(values.nontaxGrocery || "0") +
        (parseFloat(salesManagementData.nonTaxGrocerySales) || 0),
      deliTotal:
        parseFloat(values.deli || "0") +
        (parseFloat(salesManagementData.deliSales) || 0),
      salesTaxTotal:
        parseFloat(values.salesTax || "0") +
        (parseFloat(salesManagementData.salesTaxSales) || 0),
      groceryPurchaseTotal:
        parseFloat(values.groceryPurchase || "0") +
        (parseFloat(salesManagementData.groceryPurchaseSales) || 0),
    });
  }, [values, salesManagementData, lotterySubtotal]);

  const handleClearAllData = () => {
    const clearedValues = Object.fromEntries(
      Object.keys(values).map((key) => [key, ""])
    ) as typeof values;

    setValues(clearedValues);
    updateSalesTotalsData(clearedValues);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sales Totals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(salesTotalsData).map(([key, value]) => (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {Object.entries(totals).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="number"
              value={value.toFixed(2)}
              readOnly
              className="border rounded p-2 bg-gray-100"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleSubmitAll}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Submit All Sales Management Data
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

export default SalesTotals;

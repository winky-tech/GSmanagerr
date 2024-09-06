import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";
import './Components.css';

const MoneyManagement: React.FC = () => {
  const [values, setValues] = useState({
    creditDebit: "",
    storeCredit: "",
    groceryPurchaseSales: "",
    lotteryPaidOut: "",
    lottoPaidOut: "",
    cashInRegister: "",
    cash: "",
    check: "",
    ebt: "",
    cashToATM: "",
  });

  const { moneyManagementData, updateMoneyManagementData } = useGasStation();
  const [total, setTotal] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateMoneyManagementData({ [name]: value });
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { updateAllData } = useGasStation();

  const handleSubmitAll = () => {
    updateAllData({
      moneyManagement: {
        ...values,
      },
    });
  };

  useEffect(() => {
    const newTotal = Object.values(values).reduce((acc: number, curr) => {
      return acc + (parseFloat(curr as string) || 0);
    }, 0);
    setTotal(newTotal);
  }, [values]);

  const handleClearAllData = () => {
    const clearedValues = Object.fromEntries(
      Object.keys(values).map((key) => [key, ""])
    ) as typeof values;

    setValues(clearedValues);
    updateMoneyManagementData(clearedValues);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Money Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(moneyManagementData).map(([key, value]) => (
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
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Money Management Total
        </h3>
        <p className="text-2xl font-bold text-green-600">${total.toFixed(2)}</p>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSubmitAll}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Submit All Money Management Data
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

export default MoneyManagement;

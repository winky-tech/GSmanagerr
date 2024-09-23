import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";
import "./Components.css";

interface SalesTotalsData {
  gas: string;
  lotto: string;
  lottery: string;
  taxGrocery: string;
  nontaxGrocery: string;
  deli: string;
  salesTax: string;
  groceryPurchase: string;
  [key: string]: string;
}

interface CustomField {
  [key: string]: string;
}

const SalesTotals: React.FC = () => {
  const {
    salesManagementData,
    lotterySubtotal,
    salesTotalsData,
    updateAllData,
    updateSalesTotalsData,
  } = useGasStation();
  const [isLoading, setIsLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState("");
  const [localSalesData, setLocalSalesData] = useState(salesTotalsData);

  const [customFields, setCustomFields] = useState<CustomField>(() => {
    const savedCustomFields = localStorage.getItem("customSalesTotalsFields");
    return savedCustomFields ? JSON.parse(savedCustomFields) : {};
  });
  const [totals, setTotals] = useState({
    gasTotal: 0,
    lottoTotal: 0,
    lotteryTotal: 0,
    taxGroceryTotal: 0,
    nontaxGroceryTotal: 0,
    deliTotal: 0,
    salesTaxTotal: 0,
    groceryPurchaseTotal: 0,
  });

  const defaultFields = [
    "gas",
    "lottery",
    "lotto",
    "taxGrocery",
    "nontaxGrocery",
    "deli",
    "salesTax",
    "groceryPurchase",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (defaultFields.includes(name)) {
      setLocalSalesData((prev) => ({ ...prev, [name]: value }));
      updateSalesTotalsData({ [name]: value });
    } else {
      setCustomFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitAll = () => {
    updateAllData({
      salesTotals: { ...localSalesData, ...customFields },
    });
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
    const calculateTotal = (
      salesTotalValue: string,
      salesManagementValue: string,
      additionalValue: string = "0"
    ) => {
      return (
        parseFloat(salesTotalValue || "0") +
        parseFloat(salesManagementValue || "0") +
        parseFloat(additionalValue || "0")
      );
    };

    setTotals({
      gasTotal: calculateTotal(
        salesTotalsData.gas,
        salesManagementData.gasSales
      ),
      lottoTotal: calculateTotal(
        salesTotalsData.lotto,
        salesManagementData.lottoSales,
        lotterySubtotal
      ),
      lotteryTotal: calculateTotal(
        salesTotalsData.lottery,
        salesManagementData.lotterySales,
        lotterySubtotal
      ),
      taxGroceryTotal: calculateTotal(
        salesTotalsData.taxGrocery,
        salesManagementData.taxGrocerySales
      ),
      nontaxGroceryTotal: calculateTotal(
        salesTotalsData.nontaxGrocery,
        salesManagementData.nonTaxGrocerySales
      ),
      deliTotal: calculateTotal(
        salesTotalsData.deli,
        salesManagementData.deliSales
      ),
      salesTaxTotal: calculateTotal(
        salesTotalsData.salesTax,
        salesManagementData.salesTaxSales
      ),
      groceryPurchaseTotal: calculateTotal(
        salesTotalsData.groceryPurchase,
        salesManagementData.groceryPurchaseSales
      ),
    });
  }, [salesTotalsData, salesManagementData, lotterySubtotal]);

  const handleClearAllData = () => {
    const clearedValues: SalesTotalsData = Object.fromEntries(
      Object.keys(salesTotalsData).map((key) => [key, ""])
    ) as SalesTotalsData;
    updateSalesTotalsData(clearedValues);
  };

  useEffect(() => {
    setLocalSalesData(salesTotalsData);
    setIsLoading(false);
  }, [salesTotalsData]);

  useEffect(() => {
    localStorage.setItem(
      "customSalesTotalsFields",
      JSON.stringify(customFields)
    );
  }, [customFields]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>Loading sales totals data...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sales Totals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="border rounded p-2 bg-black-100"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleSubmitAll}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Submit All Sales Totals Data
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

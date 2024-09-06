import React, { createContext, useContext, useState, ReactNode } from "react";

type FuelType = "gas" | "diesel";

interface DailyData {
  inventoryStock: string;
  openingStock: string;
  todaySale: string;
  newStock: string;
  monthlySale: string;
  [key: number]: any;
}

interface AllData {
  gasAndDiesel?: {
    fuelType: string;
    month: number;
    data: DailyData;
  };
  salesManagement: SalesManagementData;
  salesTotals: SalesTotalsData;
  moneyManagement: MoneyManagementData;
  inHandCalculations: {
    cash: {
      /* ... */
    };
    check: {
      /* ... */
    };
  };
}

interface LotteryTicket {
  open: string;
  close: string;
  totalSold: number;
  total: number;
}

interface LotteryData {
  [amount: string]: {
    tickets: { [ticket: string]: LotteryTicket };
    absTotal: number;
  };
}

interface FuelData {
  gas: { [month: number]: { [day: number]: DailyData } };
  diesel: { [month: number]: { [day: number]: DailyData } };
}

interface SalesManagementData {
  gasSales: string;
  taxGrocerySales: string;
  nonTaxGrocerySales: string;
  deliSales: string;
  lottoSales: string;
  salesTaxSales: string;
  groceryPurchaseSales: string;
  paidIn: string;
  cashIn: string;
}

interface SalesTotalsData {
  gas: string;
  lotto: string;
  taxGrocery: string;
  nontaxGrocery: string;
  deli: string;
  salesTax: string;
  groceryPurchase: string;
  totals?: {
    [key: string]: number;
  };
}

interface MoneyManagementData {
  creditDebit: string;
  storeCredit: string;
  groceryPurchaseSales: string;
  lotteryPaidOut: string;
  lottoPaidOut: string;
  cashInRegister: string;
  cash: string;
  check: string;
  ebt: string;
  cashToATM: string;
}

interface GasStationContextType {
  lotteryData: LotteryData;
  updateLotteryData: (
    amount: string,
    ticket: string,
    open: string,
    close: string
  ) => void;
  calculateLotterySubtotal: () => number;
  fuelData: FuelData;
  allData: AllData;
  updateAllData: (newData: Partial<AllData>) => void;
  salesManagementData: SalesManagementData;
  salesTotalsData: SalesTotalsData;
  moneyManagementData: MoneyManagementData;
  viewData: {
    gas: { [month: number]: { [day: number]: DailyData } };
    diesel: { [month: number]: { [day: number]: DailyData } };
  };
  updateFuelData: (
    fuelType: "gas" | "diesel",
    month: number,
    day: number,
    data: DailyData
  ) => void;
  updateSalesManagementData: (data: Partial<SalesManagementData>) => void;
  updateSalesTotalsData: (data: Partial<SalesTotalsData>) => void;
  updateMoneyManagementData: (data: Partial<MoneyManagementData>) => void;
  updateViewData: (
    fuelType: FuelType,
    month: number,
    data: { [day: number]: DailyData }
  ) => void;
  lotterySubtotal: string; // Change this to string
  updateLotteryAbsTotal: (amount: string) => void;
}

const GasStationContext = createContext<GasStationContextType | undefined>(
  undefined
);

export const GasStationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allData, setAllData] = useState<AllData>({
    salesManagement: {} as SalesManagementData,
    salesTotals: {} as SalesTotalsData,
    moneyManagement: {} as MoneyManagementData,
    inHandCalculations: {
      cash: {},
      check: {},
    },
  });
  const [lotteryData, setLotteryData] = useState<LotteryData>({});
  const [fuelData, setFuelData] = useState<FuelData>({
    gas: {},
    diesel: {},
  });
  const [viewData, setViewData] = useState<{
    gas: { [month: number]: { [day: number]: DailyData } };
    diesel: { [month: number]: { [day: number]: DailyData } };
  }>({
    gas: {},
    diesel: {},
  });
  const [salesManagementData, setSalesManagementData] =
    useState<SalesManagementData>({
      gasSales: "",
      taxGrocerySales: "",
      nonTaxGrocerySales: "",
      deliSales: "",
      lottoSales: "",
      salesTaxSales: "",
      groceryPurchaseSales: "",
      paidIn: "",
      cashIn: "",
    });

  const [salesTotalsData, setSalesTotalsData] = useState<SalesTotalsData>({
    gas: "",
    lotto: "",
    taxGrocery: "",
    nontaxGrocery: "",
    deli: "",
    salesTax: "",
    groceryPurchase: "",
  });
  const [moneyManagementData, setMoneyManagementData] =
    useState<MoneyManagementData>({
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

  const [lotterySubtotal, setLotterySubtotal] = useState("0");

  const calculateTotalSold = (
    amount: string,
    open: number,
    close: number
  ): number => {
    if (amount === "$2") {
      // Logic for $2 tickets (remains the same)
      if (close >= open) {
        return 150 - (close - open);
      } else {
        return 150 - (300 - open + close);
      }
    } else if (amount === "$3" || amount === "$5" || amount === "$10") {
      // Logic for $3, $5, and $10 tickets
      if (close >= open) {
        return close - open;
      } else {
        return 60 - (open - close);
      }
    } else if (amount === "$20" || amount === "$30" || amount === "$50") {
      // Logic for $20 and $30 tickets
      if (close >= open) {
        return close - open;
      } else {
        return 30 - (open - close);
      }
    } else {
      // Default logic for other tickets
      if (close >= open) {
        return close - open;
      } else {
        return 300 - open + close;
      }
    }
  };

  const updateLotteryData = (
    amount: string,
    ticket: string,
    open: string,
    close: string
  ) => {
    const totalSold = calculateTotalSold(
      amount,
      parseInt(open),
      parseInt(close)
    );
    const total = Math.abs(totalSold * parseInt(amount.replace("$", "")));

    setLotteryData((prevData) => {
      const newData = { ...prevData };
      if (!newData[amount]) {
        newData[amount] = { tickets: {}, absTotal: 0 };
      }
      newData[amount].tickets[ticket] = { open, close, totalSold, total };

      // Recalculate absTotal for this amount
      newData[amount].absTotal = Object.values(newData[amount].tickets).reduce(
        (sum, ticket) => sum + ticket.total,
        0
      );

      return newData;
    });
  };

  const calculateLotterySubtotal = (): number => {
    return Object.values(lotteryData).reduce(
      (sum, amountData) => sum + amountData.absTotal,
      0
    );
  };

  const updateFuelData = (
    fuelType: "gas" | "diesel",
    month: number,
    day: number,
    data: DailyData
  ) => {
    setFuelData((prev) => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        [month]: {
          ...prev[fuelType][month],
          [day]: {
            ...prev[fuelType][month]?.[day],
            ...data,
          },
        },
      },
    }));
  };

  const updateViewData = (
    fuelType: FuelType,
    month: number,
    data: { [day: number]: DailyData }
  ) => {
    setViewData((prev) => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType as keyof typeof prev],
        [month]: data,
      },
    }));
  };

  const updateSalesManagementData = (data: Partial<SalesManagementData>) => {
    setSalesManagementData((prev) => ({ ...prev, ...data }));
  };

  const updateSalesTotalsData = (data: Partial<SalesTotalsData>) => {
    setSalesTotalsData((prev) => ({ ...prev, ...data }));
  };

  const updateMoneyManagementData = (data: Partial<MoneyManagementData>) => {
    setMoneyManagementData((prev) => ({ ...prev, ...data }));
  };

  const updateAllData = (newData: Partial<AllData>) => {
    setAllData((prevData) => ({ ...prevData, ...newData }));
  };

  const updateLotteryAbsTotal = (amount: string) => {
    setLotterySubtotal(amount);
  };

  return (
    <GasStationContext.Provider
      value={{
        lotteryData,
        updateLotteryData,
        fuelData,
        allData,
        updateAllData,
        salesManagementData,
        salesTotalsData,
        moneyManagementData,
        viewData,
        updateFuelData,
        updateSalesManagementData,
        updateSalesTotalsData,
        updateMoneyManagementData,
        updateViewData,
        lotterySubtotal,
        updateLotteryAbsTotal,
        calculateLotterySubtotal,
      }}
    >
      {children}
    </GasStationContext.Provider>
  );
};

export const useGasStation = () => {
  const context = useContext(GasStationContext);
  if (context === undefined) {
    throw new Error("useGasStation must be used within a GasStationProvider");
  }
  return context;
};

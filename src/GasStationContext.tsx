import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type FuelType = "gas" | "diesel";

interface DailyData {
  openingStock: string;
  todaySale: string;
  newStock: string;
  monthlySale: string;
  cumulativeMonthlySale: string;
  [key: string]: string; // Change this from number to string
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

interface MonthlyData {
  [day: number]: DailyData;
}

interface FuelData {
  gas: { [month: number]: MonthlyData };
  diesel: { [month: number]: MonthlyData };
}

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
}

interface SalesTotalsData {
  gas: string;
  lotto: string;
  lottery: string;
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
    gas: { [month: number]: MonthlyData };
    diesel: { [month: number]: MonthlyData };
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
    data: MonthlyData
  ) => void;
  lotterySubtotal: string; // Change this to string
  updateLotteryAbsTotal: (amount: string) => void;

  user: string | null;
  login: (username: string) => void;
  logout: () => void;
  clearAllData: () => void;
  clearLotteryData: () => void;
}

const GasStationContext = createContext<GasStationContextType | undefined>(
  undefined
);

export const GasStationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allData, setAllData] = useState<AllData>(() => {
    const savedData = localStorage.getItem("gasStationData");
    return savedData
      ? JSON.parse(savedData)
      : {
          salesManagement: {} as SalesManagementData,
          salesTotals: {} as SalesTotalsData,
          moneyManagement: {} as MoneyManagementData,
          inHandCalculations: { cash: {}, check: {} },
        };
  });

  const clearLotteryData = () => {
    setLotteryData({});
    localStorage.removeItem("lotteryData");
  };

  const [lotteryData, setLotteryData] = useState<LotteryData>(() => {
    const savedLotteryData = localStorage.getItem("lotteryData");
    return savedLotteryData ? JSON.parse(savedLotteryData) : {};
  });

  const [fuelData, setFuelData] = useState<FuelData>(() => {
    const savedFuelData = localStorage.getItem("fuelData");
    return savedFuelData ? JSON.parse(savedFuelData) : { gas: {}, diesel: {} };
  });

  const [viewData, setViewData] = useState<{
    gas: { [month: number]: MonthlyData };
    diesel: { [month: number]: MonthlyData };
  }>({
    gas: {},
    diesel: {},
  });

  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("user");
  });

  useEffect(() => {
    localStorage.setItem("gasStationData", JSON.stringify(allData));
  }, [allData]);

  useEffect(() => {
    localStorage.setItem("lotteryData", JSON.stringify(lotteryData));
  }, [lotteryData]);

  useEffect(() => {
    localStorage.setItem("fuelData", JSON.stringify(fuelData));
  }, [fuelData]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const [salesManagementData, setSalesManagementData] =
    useState<SalesManagementData>(() => {
      const savedData = localStorage.getItem("salesManagementAllData");
      return savedData
        ? JSON.parse(savedData)
        : {
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
    });

  const [salesTotalsData, setSalesTotalsData] = useState<SalesTotalsData>(
    () => {
      const savedData = localStorage.getItem("salesTotalsData");
      return savedData
        ? JSON.parse(savedData)
        : {
            gas: "",
            lotto: "",
            lottery: "",
            taxGrocery: "",
            nontaxGrocery: "",
            deli: "",
            salesTax: "",
            groceryPurchase: "",
          };
    }
  );
  const [moneyManagementData, setMoneyManagementData] =
    useState<MoneyManagementData>(() => {
      const savedData = localStorage.getItem("moneyManagementData");
      return savedData
        ? JSON.parse(savedData)
        : {
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
          };
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
    setFuelData((prev) => {
      const newData = {
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
      };
      localStorage.setItem("fuelData", JSON.stringify(newData));
      return newData;
    });
  };

  const updateViewData = (
    fuelType: FuelType,
    month: number,
    data: MonthlyData
  ) => {
    setViewData((prev) => ({
      ...prev,
      [fuelType]: {
        ...prev[fuelType],
        [month]: data,
      },
    }));
  };

  useEffect(() => {
    localStorage.setItem("salesTotalsData", JSON.stringify(salesTotalsData));
  }, [salesTotalsData]);

  const updateSalesManagementData = (data: Partial<SalesManagementData>) => {
    setSalesManagementData((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem("salesManagementAllData", JSON.stringify(updated));
      return updated;
    });
  };

  const updateSalesTotalsData = (data: Partial<SalesTotalsData>) => {
    setSalesTotalsData((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem("salesTotalsData", JSON.stringify(updated));
      return updated;
    });
  };

  const updateMoneyManagementData = (data: Partial<MoneyManagementData>) => {
    setMoneyManagementData((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem("moneyManagementData", JSON.stringify(updated));
      return updated;
    });
  };

  const updateAllData = (newData: Partial<AllData>) => {
    setAllData((prevData) => ({ ...prevData, ...newData }));
  };

  const updateLotteryAbsTotal = (amount: string) => {
    setLotterySubtotal(amount);
  };

  const clearAllData = () => {
    setAllData({
      salesManagement: {} as SalesManagementData,
      salesTotals: {} as SalesTotalsData,
      moneyManagement: {} as MoneyManagementData,
      inHandCalculations: { cash: {}, check: {} },
    });
    setLotteryData({});
    setFuelData({ gas: {}, diesel: {} });
    localStorage.removeItem("gasStationData");
    localStorage.removeItem("lotteryData");
    localStorage.removeItem("fuelData");
  };

  const login = (username: string) => {
    setUser(username);
    localStorage.setItem("user", username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    clearAllData();
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
        user,
        login,
        logout,
        clearAllData,
        clearLotteryData,
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

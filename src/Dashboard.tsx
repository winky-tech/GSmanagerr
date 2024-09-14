import React, { useState, useEffect } from "react";
import { useGasStation } from "./GasStationContext";
import MoneyManagement from "./MoneyManagement";
import SalesManagement from "./SalesManagement";
import SalesTotals from "./SalesTotals";
import InHandCalculations from "./InHandCalculations";
import GasAndDiesel from "./GasAndDiesel";
import SignIn from "./SignIn";
import "./Dashboard.css";

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

interface UserInterface {
  [key: string]: string[];
}

const userInterfaces: UserInterface = {
  admin: [
    "Lottery Management",
    "Gas and Diesel",
    "Money Management",
    "Sales Management",
    "Sales Totals",
    "In Hand Calculations",
    "View Data",
    "Download",
  ],
  admin2: [
    "Money Management",
    "Sales Management",
    "Sales Totals",
    "In Hand Calculations",
    "View Data",
    "Download",
  ],
};

const LotteryManagement: React.FC = () => {
  const { updateLotteryData, lotteryData } = useGasStation();
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [openNumber, setOpenNumber] = useState("");
  const [closeNumber, setCloseNumber] = useState("");
  const [newTicketNumber, setNewTicketNumber] = useState("");
  const [localTicketLists, setLocalTicketLists] = useState<{
    [key: string]: string[];
  }>({
    $1: ["1544", "7026", "1536"],
    $2: ["1510", "1541", "7027", "1594", "1537", "1530", "1533", "1545"],
    $3: ["1531", "1516", "1497"],
    $5: [
      "7023",
      "5054",
      "1514",
      "1499",
      "1511",
      "1521",
      "1522",
      "7020",
      "5052",
      "1524",
      "1527",
      "1534",
      "1538",
      "1542",
      "1546",
    ],
    $10: [
      "1547",
      "7025",
      "1528",
      "5053",
      "1508",
      "1508",
      "5028",
      "1454",
      "1512",
      "5049",
      "1535",
    ],
    $20: ["1543", "1501", "1513", "1457", "1539"],
    $30: ["5048"],
    $50: ["1529", "1529"],
  });

  const [openNumbers, setOpenNumbers] = useState<{
    [key: string]: { [ticket: string]: string };
  }>({});

  const ticketAmounts = ["$1", "$2", "$3", "$5", "$10", "$20", "$30", "$50"];

  useEffect(() => {
    // Load ticket lists from localStorage on component mount
    const savedTicketLists = localStorage.getItem("lotteryTicketLists");
    if (savedTicketLists) {
      const parsedTicketLists = JSON.parse(savedTicketLists);
      // Merge saved ticket lists with default lists
      const mergedTicketLists = { ...localTicketLists };
      Object.keys(parsedTicketLists).forEach((amount) => {
        if (mergedTicketLists[amount]) {
          // Add unique tickets from saved list
          parsedTicketLists[amount].forEach((ticket: string) => {
            if (!mergedTicketLists[amount].includes(ticket)) {
              mergedTicketLists[amount].push(ticket);
            }
          });
        } else {
          mergedTicketLists[amount] = parsedTicketLists[amount];
        }
      });
      setLocalTicketLists(mergedTicketLists);
    }

    const savedOpenNumbers = localStorage.getItem("lotteryOpenNumbers");
    if (savedOpenNumbers) {
      setOpenNumbers(JSON.parse(savedOpenNumbers));
    }
  }, []);

  useEffect(() => {
    // Save ticket lists to localStorage whenever they change
    localStorage.setItem("lotteryOpenNumbers", JSON.stringify(openNumbers));
  }, [openNumbers]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmount = e.target.value;
    setSelectedAmount(newAmount);
    setSelectedTicket(null);
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTicket = e.target.value;
    setSelectedTicket(newTicket);
    if (selectedAmount && newTicket) {
      setOpenNumber(openNumbers[selectedAmount]?.[newTicket] || "");
    }
    setCloseNumber("");
  };

  const handleSubmit = () => {
    if (selectedAmount && selectedTicket && openNumber && closeNumber) {
      updateLotteryData(
        selectedAmount,
        selectedTicket,
        openNumber,
        closeNumber
      );
      setOpenNumbers((prev) => ({
        ...prev,
        [selectedAmount]: {
          ...(prev[selectedAmount] || {}),
          [selectedTicket]: closeNumber,
        },
      }));
      setOpenNumber(closeNumber);
      setCloseNumber("");
    }
  };

  const addCustomTicket = () => {
    if (newTicketNumber && selectedAmount) {
      setLocalTicketLists((prev) => {
        const updatedList = {
          ...prev,
          [selectedAmount]: [
            ...new Set([...prev[selectedAmount], newTicketNumber]),
          ],
        };
        localStorage.setItem("lotteryTicketLists", JSON.stringify(updatedList));
        return updatedList;
      });
      setNewTicketNumber("");
    }
  };

  const deleteTicket = (ticketToDelete: string) => {
    if (selectedAmount) {
      setLocalTicketLists((prev) => {
        const updatedList = {
          ...prev,
          [selectedAmount]: prev[selectedAmount].filter(
            (ticket) => ticket !== ticketToDelete
          ),
        };
        localStorage.setItem("lotteryTicketLists", JSON.stringify(updatedList));
        return updatedList;
      });
      if (selectedTicket === ticketToDelete) {
        setSelectedTicket(null);
        setOpenNumber("");
        setCloseNumber("");
      }
      setOpenNumbers((prev) => {
        const updatedOpenNumbers = { ...prev };
        if (updatedOpenNumbers[selectedAmount]) {
          delete updatedOpenNumbers[selectedAmount][ticketToDelete];
        }
        return updatedOpenNumbers;
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lottery Management</h2>
      <div className="mb-4">
        <label htmlFor="amountSelect" className="block mb-2">
          Select Amount:
        </label>
        <select
          id="amountSelect"
          value={selectedAmount || ""}
          onChange={handleAmountChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select an amount</option>
          {ticketAmounts.map((amount) => (
            <option key={amount} value={amount}>
              {amount}
            </option>
          ))}
        </select>
      </div>

      {selectedAmount && (
        <div className="mb-4">
          <label htmlFor="ticketSelect" className="block mb-2">
            Select Ticket:
          </label>
          <select
            id="ticketSelect"
            value={selectedTicket || ""}
            onChange={handleTicketChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a ticket</option>
            {localTicketLists[selectedAmount].map((ticket) => (
              <option key={ticket} value={ticket}>
                {ticket}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={newTicketNumber}
          onChange={(e) => setNewTicketNumber(e.target.value)}
          placeholder="New ticket number"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={addCustomTicket}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!selectedAmount}
        >
          Add Custom Ticket
        </button>
      </div>

      {selectedAmount && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Ticket List:</h3>
          <ul className="space-y-2">
            {localTicketLists[selectedAmount].map((ticket) => (
              <li
                key={ticket}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>{ticket}</span>
                <button
                  onClick={() => deleteTicket(ticket)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTicket && (
        <div className="mb-4">
          <input
            type="number"
            placeholder="Open Number"
            value={openNumber}
            onChange={(e) => setOpenNumber(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            placeholder="Close Number"
            value={closeNumber}
            onChange={(e) => setCloseNumber(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      )}

      {/* Display submitted data */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Submitted Data:</h3>
        {Object.entries(lotteryData).map(([amount, data]) => (
          <div key={amount} className="mb-4">
            <h4 className="text-lg font-semibold">{amount} Tickets</h4>
            {Object.entries(data.tickets).map(([ticket, ticketData]) => (
              <div key={ticket} className="p-2 border rounded mb-2">
                <p>Ticket: {ticket}</p>
                <p>Open: {ticketData.open}</p>
                <p>Close: {ticketData.close}</p>
                <p>Total Sold: {ticketData.totalSold}</p>
                <p>Total: ${ticketData.total}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewData: React.FC = () => {
  const { lotteryData, fuelData, allData, calculateLotterySubtotal } =
    useGasStation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">View Data</h2>

      {/* Sales Management Data */}
      <div className="mb-4">
        <button
          onClick={() => toggleDropdown("salesManagement")}
          className="w-full text-left bg-blue-500 text-white p-2 rounded"
        >
          Sales Management Data {openDropdown === "salesManagement" ? "▲" : "▼"}
        </button>
        {openDropdown === "salesManagement" && (
          <div className="mt-2 p-2 border rounded">
            {Object.entries(allData.salesManagement).map(([key, value]) => (
              <div key={key} className="mb-2">
                <p>
                  <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sales Totals Data */}
      <div className="mb-4">
        <button
          onClick={() => toggleDropdown("salesTotals")}
          className="w-full text-left bg-blue-500 text-white p-2 rounded"
        >
          Sales Totals Data {openDropdown === "salesTotals" ? "▲" : "▼"}
        </button>
        {openDropdown === "salesTotals" && (
          <div className="mt-2 p-2 border rounded">
            {Object.entries(allData.salesTotals)
              .filter(([key]) => key !== "totals")
              .map(([key, value]) => (
                <div key={key} className="mb-2">
                  <p>
                    <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
                    {value}
                  </p>
                </div>
              ))}
            {allData.salesTotals.totals && (
              <div>
                <h4>Totals</h4>
                {Object.entries(allData.salesTotals.totals).map(
                  ([key, value]) => (
                    <div key={key} className="mb-2">
                      <p>
                        <strong>
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </strong>{" "}
                        {String(value)}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Money Management Data */}
      <div className="mb-4">
        <button
          onClick={() => toggleDropdown("moneyManagement")}
          className="w-full text-left bg-blue-500 text-white p-2 rounded"
        >
          Money Management Data {openDropdown === "moneyManagement" ? "▲" : "▼"}
        </button>
        {openDropdown === "moneyManagement" && (
          <div className="mt-2 p-2 border rounded">
            {Object.entries(allData.moneyManagement).map(([key, value]) => (
              <div key={key} className="mb-2">
                <p>
                  <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In Hand Calculations Data */}
      <div className="mb-4">
        <button
          onClick={() => toggleDropdown("inHandCalculations")}
          className="w-full text-left bg-blue-500 text-white p-2 rounded"
        >
          In Hand Calculations Data{" "}
          {openDropdown === "inHandCalculations" ? "▲" : "▼"}
        </button>
        {openDropdown === "inHandCalculations" && (
          <div className="mt-2 p-2 border rounded">
            <h4>Cash</h4>
            {Object.entries(allData.inHandCalculations.cash).map(
              ([key, value]) => (
                <div key={key} className="mb-2">
                  <p>
                    <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
                    {String(value)}
                  </p>
                </div>
              )
            )}
            <h4>Check</h4>
            {Object.entries(allData.inHandCalculations.check).map(
              ([key, value]) => (
                <div key={key} className="mb-2">
                  <p>
                    <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
                    {String(value)}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Lottery Data */}
      <div className="mb-4">
        <button
          onClick={() => toggleDropdown("lotteryData")}
          className="w-full text-left bg-blue-500 text-white p-2 rounded"
        >
          Lottery Data {openDropdown === "lotteryData" ? "▲" : "▼"}
        </button>
        {openDropdown === "lotteryData" && (
          <div className="mt-2 p-2 border rounded">
            {Object.entries(lotteryData).map(([amount, data]) => (
              <div key={amount} className="mb-4">
                <h4 className="font-bold">{amount} Tickets</h4>
                {Object.entries(data.tickets).map(([ticket, ticketData]) => (
                  <div key={ticket} className="ml-4 mb-2">
                    <p>Ticket: {ticket}</p>
                    <p>Open: {ticketData.open}</p>
                    <p>Close: {ticketData.close}</p>
                    <p>Total Sold: {Math.abs(ticketData.totalSold)}</p>
                    <p>Total: ${Math.abs(ticketData.total).toFixed(2)}</p>
                  </div>
                ))}
                <p className="font-semibold">
                  ABS Total: ${data.absTotal.toFixed(2)}
                </p>
              </div>
            ))}
            <h3 className="text-xl font-bold mt-4">
              Lottery Subtotal: ${calculateLotterySubtotal().toFixed(2)}
            </h3>
          </div>
        )}
      </div>

      {/* Fuel Data */}
      <div className="mb-4">
        <button
          onClick={() => toggleDropdown("fuelData")}
          className="w-full text-left bg-blue-500 text-white p-2 rounded"
        >
          Fuel Data {openDropdown === "fuelData" ? "▲" : "▼"}
        </button>
        {openDropdown === "fuelData" && (
          <div className="mt-2 p-2 border rounded">
            {["gas", "diesel"].map((fuelType) => (
              <div key={fuelType}>
                <h4>{fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}</h4>
                {Object.entries(
                  fuelData[fuelType as keyof typeof fuelData]
                ).map(([month, monthData]) => (
                  <div key={month}>
                    <h5>{months[parseInt(month) - 1]}</h5>
                    <div className="grid grid-cols-7 gap-2">
                      {Object.entries(monthData).map(([day, dayData]) => (
                        <div key={day} className="border p-2 text-center">
                          <div className="font-bold">{day}</div>
                          <div>Opening Stock: {dayData.openingStock}</div>
                          <div>Today's Sale: {dayData.todaySale}</div>
                          <div>New Stock: {dayData.newStock}</div>
                          <div>Monthly Sale: {dayData.monthlySale}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  const { lotteryData, fuelData, allData, updateLotteryAbsTotal } =
    useGasStation();

  useEffect(() => {
    Object.keys(lotteryData).forEach((amount) => updateLotteryAbsTotal(amount));
  }, [lotteryData, updateLotteryAbsTotal]);

  const handleDownload = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Helper function to add a section to the CSV
    const addSection = (title: string, data: any[][]) => {
      csvContent += `${title}\n`;
      data.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });
      csvContent += "\n";
    };

    // Add Lottery Management Data
    const lotteryRows = Object.entries(lotteryData).flatMap(
      ([amount, tickets]) =>
        Object.entries(tickets).map(([ticket, data]) => [
          amount,
          ticket,
          ...(typeof data === "object" && "open" in data
            ? [data.open, data.close, data.totalSold, data.total]
            : []),
        ])
    );
    addSection("Lottery Management Data", [
      ["Amount", "Ticket", "Open", "Close", "Total Sold", "Total"],
      ...lotteryRows,
    ]);

    // Add Gas and Diesel Data
    const fuelRows = ["gas", "diesel"].flatMap((fuelType) =>
      Object.entries(fuelData[fuelType as keyof typeof fuelData]).flatMap(
        ([month, monthData]) =>
          Object.entries(monthData).map(([day, dayData]) => [
            fuelType,
            month,
            day,
            dayData.openingStock,
            dayData.todaySale,
            dayData.newStock,
            dayData.monthlySale,
          ])
      )
    );
    addSection("Gas and Diesel Data", [
      [
        "Fuel Type",
        "Month",
        "Day",
        "Inventory Stock",
        "Opening Stock",
        "Today's Sale",
        "New Stock",
        "Monthly Sale",
      ],
      ...fuelRows,
    ]);

    // Add Sales Management Data
    const salesManagementRows = Object.entries(allData.salesManagement).map(
      ([key, value]) => [key.replace(/([A-Z])/g, " $1").trim(), value]
    );
    addSection("Sales Management Data", [
      ["Field", "Value"],
      ...salesManagementRows,
    ]);

    // Add Sales Totals Data
    const salesTotalsRows = Object.entries(allData.salesTotals)
      .filter(([key]) => key !== "totals")
      .map(([key, value]) => [key.replace(/([A-Z])/g, " $1").trim(), value]);
    if (allData.salesTotals.totals) {
      salesTotalsRows.push(
        ...Object.entries(allData.salesTotals.totals).map(([key, value]) => [
          `Total ${key.replace(/([A-Z])/g, " $1").trim()}`,
          value,
        ])
      );
    }
    addSection("Sales Totals Data", [["Field", "Value"], ...salesTotalsRows]);

    // Add Money Management Data
    const moneyManagementRows = Object.entries(allData.moneyManagement).map(
      ([key, value]) => [key.replace(/([A-Z])/g, " $1").trim(), value]
    );
    addSection("Money Management Data", [
      ["Field", "Value"],
      ...moneyManagementRows,
    ]);

    // Add In Hand Calculations Data
    const inHandCalcRows = [
      ...Object.entries(allData.inHandCalculations.cash).map(([key, value]) => [
        "Cash",
        key.replace(/([A-Z])/g, " $1").trim(),
        value,
      ]),
      ...Object.entries(allData.inHandCalculations.check).map(
        ([key, value]) => [
          "Check",
          key.replace(/([A-Z])/g, " $1").trim(),
          value,
        ]
      ),
    ];
    addSection("In Hand Calculations Data", [
      ["Type", "Field", "Value"],
      ...inHandCalcRows,
    ]);

    // Create a download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gas_station_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleSignIn = (username: string) => {
    setUser(username);
  };

  if (!user) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  const sections = userInterfaces[user] || [];

  return (
    <div className="dashboard">
      <h1>Gas Station Management Dashboard</h1>
      <main className="container">
        <div className="dashboard-sidebar">
          {sections.map((section) => (
            <button key={section} onClick={() => setActiveSection(section)}>
              {section}
            </button>
          ))}
        </div>
        <div className="dashboard-main">
          {activeSection === "Lottery Management" && <LotteryManagement />}
          {activeSection === "Gas and Diesel" && <GasAndDiesel />}
          {activeSection === "Money Management" && <MoneyManagement />}
          {activeSection === "Sales Management" && <SalesManagement />}
          {activeSection === "Sales Totals" && <SalesTotals />}
          {activeSection === "In Hand Calculations" && <InHandCalculations />}
          {activeSection === "View Data" && <ViewData />}
          {activeSection === "Download" && (
            <button onClick={handleDownload}>Download CSV</button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

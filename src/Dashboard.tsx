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
  const { updateLotteryData, lotteryData, clearLotteryData } = useGasStation();
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [openNumber, setOpenNumber] = useState("");
  const [closeNumber, setCloseNumber] = useState("");
  const [newTicketNumber, setNewTicketNumber] = useState("");
  const [localTicketLists, setLocalTicketLists] = useState<{
    [key: string]: string[];
  }>({
    $1: ["1565", "1570", "1563"],
    $2: ["1571", "1566", "5057", "1556", "1297", "1530", "1560"],
    $3: ["1564", "1516", "1497"],
    $5: [
      "1561",
      "5054",
      "1514",
      "1499",
      "1557",
      "1521",
      "1567",
      "7020",
      "1534",
      "1524",
      "1527",
      "5058",
      "5059",
    ],
    $10: [
      "1572",
      "1572",
      "5053",
      "1550",
      "1550",
      "1547",
      "1454",
      "1558",
      "1535",
      "1554",
      "1568",
      "1528",
    ],
    $20: ["1562", "1501", "1543", "1539", "1569", "1569"],
    $30: ["5048"],
    $50: ["1529", "1555", "1555"],
  });

  const [openNumbers] = useState<{
    [key: string]: { [ticket: string]: string };
  }>({});

  const ticketAmounts = ["$1", "$2", "$3", "$5", "$10", "$20", "$30", "$50"];

  useEffect(() => {
    // Load ticket lists from localStorage
    const savedTicketLists = localStorage.getItem("lotteryTicketLists");
    if (savedTicketLists) {
      setLocalTicketLists(JSON.parse(savedTicketLists));
    }
  }, []);

  useEffect(() => {
    // Save ticket lists to localStorage whenever they change
    localStorage.setItem(
      "lotteryTicketLists",
      JSON.stringify(localTicketLists)
    );
  }, [localTicketLists]);

  useEffect(() => {
    // Load open number when a ticket is selected
    if (selectedAmount && selectedTicket) {
      const savedOpenNumbers = localStorage.getItem("lotteryOpenNumbers");
      if (savedOpenNumbers) {
        const openNumbers = JSON.parse(savedOpenNumbers);
        const savedOpenNumber = openNumbers[selectedAmount]?.[selectedTicket];
        if (savedOpenNumber) {
          setOpenNumber(savedOpenNumber);
        }
      }
    }
  }, [selectedAmount, selectedTicket]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmount = e.target.value;
    setSelectedAmount(newAmount);
    setSelectedTicket(null);
    setOpenNumber("");
    setCloseNumber("");
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTicket = e.target.value;
    setSelectedTicket(newTicket);
    if (selectedAmount && newTicket) {
      const savedOpenNumber = openNumbers[selectedAmount]?.[newTicket] || "";
      setOpenNumber(savedOpenNumber);
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
      // Update the open number for this specific ticket
      const savedOpenNumbers = localStorage.getItem("lotteryOpenNumbers");
      const openNumbers = savedOpenNumbers ? JSON.parse(savedOpenNumbers) : {};
      openNumbers[selectedAmount] = openNumbers[selectedAmount] || {};
      openNumbers[selectedAmount][selectedTicket] = closeNumber;
      localStorage.setItem("lotteryOpenNumbers", JSON.stringify(openNumbers));
      setOpenNumber(closeNumber);
      setCloseNumber("");
    }
  };

  const addCustomTicket = () => {
    if (newTicketNumber && selectedAmount) {
      setLocalTicketLists((prev) => ({
        ...prev,
        [selectedAmount]: [
          ...new Set([...prev[selectedAmount], newTicketNumber]),
        ],
      }));
      setNewTicketNumber("");
    }
  };

  const deleteTicket = (ticketToDelete: string) => {
    if (selectedAmount) {
      setLocalTicketLists((prev) => ({
        ...prev,
        [selectedAmount]: prev[selectedAmount].filter(
          (ticket) => ticket !== ticketToDelete
        ),
      }));
      if (selectedTicket === ticketToDelete) {
        setSelectedTicket(null);
        setOpenNumber("");
        setCloseNumber("");
      }

      // Remove open number from localStorage
      const savedOpenNumbers = localStorage.getItem("lotteryOpenNumbers");
      if (savedOpenNumbers) {
        const openNumbers = JSON.parse(savedOpenNumbers);
        if (openNumbers[selectedAmount]) {
          delete openNumbers[selectedAmount][ticketToDelete];
          localStorage.setItem(
            "lotteryOpenNumbers",
            JSON.stringify(openNumbers)
          );
        }
      }
    }
  };

  const handleClearSubmittedData = () => {
    clearLotteryData();
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
                className="flex justify-between items-center bg-black-50 p-2 rounded"
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
            placeholder="Close Number"
            value={closeNumber}
            onChange={(e) => setCloseNumber(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            placeholder="Open Number"
            value={openNumber}
            onChange={(e) => setOpenNumber(e.target.value)}
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Submitted Data:</h3>
          <button
            onClick={handleClearSubmittedData}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Submitted Data
          </button>
        </div>
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
                          <div>
                            Monthly Sale: {dayData.cumulativeMonthlySale || "0"}
                          </div>
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
  const { user, login, logout } = useGasStation();

  const {
    lotteryData,
    fuelData,
    allData,
    updateLotteryAbsTotal,
    calculateLotterySubtotal,
  } = useGasStation();

  useEffect(() => {
    Object.keys(lotteryData).forEach((amount) => updateLotteryAbsTotal(amount));
  }, [lotteryData, updateLotteryAbsTotal]);

  const handleDownloadLotteryCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header
    csvContent += "Amount,Ticket Number,Open,Close,Total Sold,Total\n";

    // Add lottery data
    Object.entries(lotteryData).forEach(([amount, data]) => {
      Object.entries(data.tickets).forEach(([ticket, ticketData]) => {
        csvContent += `${amount},${ticket},${ticketData.open},${
          ticketData.close
        },${Math.abs(ticketData.totalSold)},${Math.abs(
          ticketData.total
        ).toFixed(2)}\n`;
      });
      // Add ABS Total for each amount
      csvContent += `${amount},ABS Total,,,,${data.absTotal.toFixed(2)}\n`;
      csvContent += "\n"; // Add a blank line between amounts
    });

    // Add Subtotal
    csvContent += `Lottery Subtotal,,,,,${calculateLotterySubtotal().toFixed(
      2
    )}\n`;

    // Create a download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lottery_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadLotteryWord = () => {
    let content = `<html xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta charset="utf-8">
        <title>Lottery Data</title>
      </head>
      <body>
        <h1>Lottery Data</h1>`;

    Object.entries(lotteryData).forEach(([amount, data]) => {
      content += `
            <h2>${amount} Tickets</h2>
            <table border="1" style="border-collapse: collapse;">
              <tr>
                <th>Ticket Number</th>
                <th>Open</th>
                <th>Close</th>
                <th>Total Sold</th>
                <th>Total</th>
              </tr>`;

      Object.entries(data.tickets).forEach(([ticket, ticketData]) => {
        content += `
                  <tr>
                    <td>${ticket}</td>
                    <td>${ticketData.open}</td>
                    <td>${ticketData.close}</td>
                    <td>${Math.abs(ticketData.totalSold)}</td>
                    <td>$${Math.abs(ticketData.total).toFixed(2)}</td>
                  </tr>`;
      });

      // Add ABS Total for each amount
      content += `
   <tr>
     <td colspan="4"><strong>ABS Total</strong></td>
     <td><strong>$${data.absTotal.toFixed(2)}</strong></td>
   </tr>
 </table>`;
    });

    // Add Subtotal
    content += `
<h2>Lottery Subtotal</h2>
<p><strong>$${calculateLotterySubtotal().toFixed(2)}</strong></p>
</body>
</html>`;

    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lottery_data.doc";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadRestCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Helper function to add a section to the CSV
    const addSection = (title: string, data: any[][]) => {
      csvContent += `${title}\n`;
      data.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });
      csvContent += "\n";
    };

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

    // Add Fuel Data
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
    addSection("Fuel Data", [
      [
        "Fuel Type",
        "Month",
        "Day",
        "Opening Stock",
        "Today's Sale",
        "New Stock",
        "Monthly Sale",
      ],
      ...fuelRows,
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

  const handleDownloadRestWord = () => {
    let content = `<html xmlns:w="urn:schemas-microsoft-com:office:word">
      <head>
        <meta charset="utf-8">
        <title>Gas Station Data</title>
      </head>
      <body>`;

    // Helper function to add a section to the Word document
    const addSection = (title: string, data: any[][]) => {
      content += `<h2>${title}</h2>
        <table border="1" style="border-collapse: collapse;">
          <tr>
            ${data[0].map((header) => `<th>${header}</th>`).join("")}
          </tr>
          ${data
            .slice(1)
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
            )
            .join("")}
        </table>`;
    };

    // Add Sales Management Data
    const salesManagementRows = [
      ["Field", "Value"],
      ...Object.entries(allData.salesManagement).map(([key, value]) => [
        key.replace(/([A-Z])/g, " $1").trim(),
        value,
      ]),
    ];
    addSection("Sales Management Data", salesManagementRows);

    // Add Sales Totals Data
    const salesTotalsRows = [
      ["Field", "Value"],
      ...Object.entries(allData.salesTotals)
        .filter(([key]) => key !== "totals")
        .map(([key, value]) => [key.replace(/([A-Z])/g, " $1").trim(), value]),
    ];
    if (allData.salesTotals.totals) {
      salesTotalsRows.push(
        ...Object.entries(allData.salesTotals.totals).map(([key, value]) => [
          `Total ${key.replace(/([A-Z])/g, " $1").trim()}`,
          value,
        ])
      );
    }
    addSection("Sales Totals Data", salesTotalsRows);

    // Add Money Management Data
    const moneyManagementRows = [
      ["Field", "Value"],
      ...Object.entries(allData.moneyManagement).map(([key, value]) => [
        key.replace(/([A-Z])/g, " $1").trim(),
        value,
      ]),
    ];
    addSection("Money Management Data", moneyManagementRows);

    // Add In Hand Calculations Data
    const inHandCalcRows = [
      ["Type", "Field", "Value"],
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
    addSection("In Hand Calculations Data", inHandCalcRows);

    // Add Fuel Data
    const fuelRows = [
      [
        "Fuel Type",
        "Month",
        "Day",
        "Opening Stock",
        "Today's Sale",
        "New Stock",
        "Monthly Sale",
      ],
      ...["gas", "diesel"].flatMap((fuelType) =>
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
      ),
    ];
    addSection("Fuel Data", fuelRows);

    content += `
      </body>
    </html>`;

    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gas_station_data.doc";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSignIn = (username: string) => {
    login(username);
  };

  const handleSignOut = () => {
    logout();
  };

  if (!user) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  const sections = userInterfaces[user] || [];

  return (
    <div className="dashboard">
      <h1>Gas Station Management Dashboard</h1>
      <button onClick={handleSignOut}>Sign Out</button>
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
            <div className="download-buttons">
              <h2>Download Options</h2>
              <div>
                <h3>Lottery Information</h3>
                <button onClick={handleDownloadLotteryCSV}>
                  Download Lottery CSV
                </button>
                <button onClick={handleDownloadLotteryWord}>
                  Download Lottery Word Document
                </button>
              </div>
              <div>
                <h3>Other Information</h3>
                <button onClick={handleDownloadRestCSV}>
                  Download Other Information CSV
                </button>
                <button onClick={handleDownloadRestWord}>
                  Download Other Information Word Document
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

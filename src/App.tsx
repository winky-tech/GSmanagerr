import React from "react";
import { GasStationProvider } from "./GasStationContext";
import Dashboard from "./Dashboard";

const App: React.FC = () => {
  return (
    <GasStationProvider>
      <Dashboard />
    </GasStationProvider>
     );
    };
export default App;

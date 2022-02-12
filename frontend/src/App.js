import logo from './logo.svg';
import './App.css';
import TabelShips from './components/Ships';
import FormularShip from "./components/FormularShip";
import TabelCrewMembers from './components/CrewMembers';
import FormularCrewMember from "./components/FormularCrewMember";

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<TabelShips />} />
          <Route path="/formularShip" element={<FormularShip />} />
          <Route path="/crewMembers" element={<TabelCrewMembers />} />
          <Route path="/formularCrewMember" element={<FormularCrewMember />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

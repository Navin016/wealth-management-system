import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Investments from "./pages/Investments";
import Goals from "./pages/Goals";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Account from "./pages/Account";

function App() {
  return (
    <Routes>
      {/* 🌐 PUBLIC ROUTES */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <Login />
          </>
        }
      />

      <Route
        path="/register"
        element={
          <>
            <Navbar />
            <Register />
          </>
        }
      />

      <Route
        path="/contact"
        element={
          <>
            <Navbar />
            <Contact />
          </>
        }
      />

      {/* 🔐 PRIVATE ROUTES */}
      <Route
        path="/dashboard"
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />

      <Route
        path="/portfolio"
        element={
          <PrivateLayout>
            <Portfolio />
          </PrivateLayout>
        }
      />

      <Route
        path="/investments"
        element={
          <PrivateLayout>
            <Investments />
          </PrivateLayout>
        }
      />

      <Route
        path="/goals"
        element={
          <PrivateLayout>
            <Goals />
          </PrivateLayout>
        }
      />

      <Route
        path="/transactions"
        element={
          <PrivateLayout>
            <Transactions />
          </PrivateLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <PrivateLayout>
            <Analytics />
          </PrivateLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateLayout>
            <Reports />
          </PrivateLayout>
        }
      />

      <Route
        path="/account"
        element={
          <PrivateLayout>
            <Account />
          </PrivateLayout>
        }
      />
    </Routes>
  );
}

/* 🔐 PRIVATE LAYOUT */
function PrivateLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default App;

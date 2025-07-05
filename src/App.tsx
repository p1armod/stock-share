import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import authService from "./appwrite/auth";

function App() {
  return (
    <AuthProvider authService={authService}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
    </AuthProvider>
  )
}

export default App

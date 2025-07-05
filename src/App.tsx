import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import authService from "./appwrite/auth";
import useDocumentTitle from "./hooks/useDocumentTitle";

function App() {
  // Set dynamic document title based on the current route
  useDocumentTitle();

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

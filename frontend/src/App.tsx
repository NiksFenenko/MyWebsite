import { Route, Routes, Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import ProductPage from "./pages/ProductPage";
import EditProductPage from "./pages/EditProductPage";
import CreatePage from "./pages/CreatePage";
import ProfilePage from "./pages/ProfilePage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppContent() {
  useUserSync();

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { isClerkLoaded } = useAuthReq();

  if (!isClerkLoaded) return null;

  return <AppContent />;
}

export default App;
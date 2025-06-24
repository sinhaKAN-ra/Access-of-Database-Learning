import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DatabasesPage from "./pages/DatabasesPage";
import DatabaseDetail from "./pages/DatabaseDetail";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetail from "./pages/CategoryDetail";
import AddDatabasePage from "./pages/AddDatabasePage";
import AboutPage from "./pages/AboutPage";
import ContributePage from "./pages/ContributePage";
import SearchPage from "./pages/SearchPage";
import EditDatabase from "./pages/EditDatabase";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import { Analytics } from "@vercel/analytics/next"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/databases" element={<DatabasesPage />} />
          <Route path="/database/:slug" element={<DatabaseDetail />} />
          <Route path="/edit-database/:slug" element={<EditDatabase />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/add-database" element={<AddDatabasePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { HeroSection } from "@/components/HeroSection";
import { AsteroidCards } from "@/components/AsteroidCards";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Footer } from "@/components/Footer";
import CustomCursor from "../components/CustomCursor";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <HeroSection />
      <AsteroidCards />
      <Footer />
    </div>
  );
};

export default Index;

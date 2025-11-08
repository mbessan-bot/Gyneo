import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Stethoscope, User } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm mb-6 shadow-2xl glow-purple animate-glow">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
            Gyneo
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-2">
            Connecting Women with Compassionate Care
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Whether you're seeking the perfect gynecologist or providing expert care, we're here to help
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Patient Card */}
          <Card className="p-8 backdrop-blur-sm bg-white/95 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl glow-purple-hover group cursor-pointer animate-in fade-in slide-in-from-left duration-700"
                onClick={() => navigate("/find-doctor")}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                I'm a Patient
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Find the perfect gynecologist tailored to your needs and preferences
              </p>
              <Button 
                size="lg" 
                variant="glow"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/find-doctor");
                }}
              >
                Find a Doctor
              </Button>
            </div>
          </Card>

          {/* Doctor Card */}
          <Card className="p-8 backdrop-blur-sm bg-white/95 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl glow-purple-hover group cursor-pointer animate-in fade-in slide-in-from-right duration-700"
                onClick={() => navigate("/doctor/login")}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/80 mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                I'm a Doctor
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Join our network and connect with patients who need your expertise
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/doctor/login");
                }}
              >
                Doctor Portal
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/80 animate-in fade-in duration-1000" style={{ animationDelay: "300ms" }}>
          <p className="text-sm">Secure • Confidential • Personalized</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

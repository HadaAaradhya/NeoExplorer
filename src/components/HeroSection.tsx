import { Button } from "@/components/ui/button";
import asteroidOrbit from "@/assets/asteroid-orbit.png";
import { useAuth } from "../hooks/useAuth";

/**
 * HeroSection component
 * Displays the main landing section with animated particles, orbit, and call-to-action buttons.
 */
export const HeroSection = () => {
  const { signInWithGoogle } = useAuth();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating Particles (decorative dots) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Orbit Animation (decorative asteroid orbit) */}
      <div className="absolute top-20 right-20 w-32 h-32 animate-orbit opacity-20">
        <div className="relative w-full h-full">
          <img 
            src={asteroidOrbit} 
            alt="Asteroid orbit illustration" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge for real-time NASA NEO tracking */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse-glow"></div>
            <span className="text-sm font-inter text-muted-foreground">
              Real-time NASA NEO tracking
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-orbitron font-black text-5xl md:text-7xl lg:text-8xl mb-6 text-gradient animate-fade-in">
            NEO Explorer
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl font-inter font-light text-muted-foreground mb-12 leading-relaxed animate-fade-in">
            Track and explore Near-Earth Objects with cutting-edge space technology.
            <br />
            <span className="text-primary">Discover the cosmos</span> and monitor celestial threats in real-time.
          </p>

          {/* CTA Buttons (Sign in, etc.) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg font-orbitron font-bold glow-violet hover:animate-pulse-glow transition-cosmic min-w-48 bg-accent/10 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={signInWithGoogle}
            >
              Sign in with Google
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            {[
              { number: "34,000+", label: "Tracked Objects" },
              { number: "99.9%", label: "Accuracy Rate" },
              { number: "24/7", label: "Real-time Updates" }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fade-in">
                <div className="text-2xl md:text-3xl font-orbitron font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-inter">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
    </section>
  );
};
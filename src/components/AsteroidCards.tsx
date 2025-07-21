import { Card } from "@/components/ui/card";

export const AsteroidCards = () => {
  const asteroids = [
    {
      id: "2023 DW",
      name: "Asteroid 2023 DW",
      distance: "4.2 million km",
      diameter: "50m",
      velocity: "28,000 km/h",
      hazardous: false,
      lastObserved: "2024-01-15"
    },
    {
      id: "2024 BX1",
      name: "Asteroid 2024 BX1", 
      distance: "1.8 million km",
      diameter: "120m",
      velocity: "32,500 km/h",
      hazardous: true,
      lastObserved: "2024-01-20"
    },
    {
      id: "Apophis",
      name: "99942 Apophis",
      distance: "31 million km", 
      diameter: "340m",
      velocity: "30,700 km/h",
      hazardous: true,
      lastObserved: "2024-01-18"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient mb-4">
            Live NEO Data
          </h2>
          <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
            Real-time tracking of Near-Earth Objects powered by NASA's comprehensive database
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {asteroids.map((asteroid, index) => (
            <Card 
              key={asteroid.id} 
              className="glass-card hover:glow-blue transition-cosmic animate-fade-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        asteroid.hazardous ? 'bg-destructive' : 'bg-primary'
                      } animate-pulse`}
                    ></div>
                    <span className="text-xs font-inter text-muted-foreground">
                      {asteroid.hazardous ? 'POTENTIALLY HAZARDOUS' : 'SAFE TRAJECTORY'}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-orbitron font-bold mb-4 group-hover:text-primary transition-cosmic">
                  {asteroid.name}
                </h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Distance</div>
                    <div className="font-orbitron font-semibold text-primary">
                      {asteroid.distance}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Diameter</div>
                    <div className="font-orbitron font-semibold">
                      {asteroid.diameter}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Velocity</div>
                    <div className="font-orbitron font-semibold">
                      {asteroid.velocity}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Last Seen</div>
                    <div className="font-orbitron font-semibold">
                      {asteroid.lastObserved}
                    </div>
                  </div>
                </div>

                {/* Orbit Visualization */}
                <div className="h-16 relative overflow-hidden rounded-lg bg-muted/20 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-orbit"></div>
                    <div className="absolute w-12 h-12 border border-primary/30 rounded-full"></div>
                    <div className="absolute w-8 h-8 border border-accent/30 rounded-full"></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-xs text-muted-foreground font-inter">
                  ID: {asteroid.id} • Updated 2 min ago
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
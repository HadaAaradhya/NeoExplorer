import { Card } from "@/components/ui/card";
import dashboardMockup from "@/assets/dashboard-mockup.png";

/**
 * DashboardPreview component
 * Shows a preview of the analytics dashboard with mock chart cards and a dashboard image.
 */
export const DashboardPreview = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Glow for visual effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-gradient mb-4">
            Advanced Analytics
          </h2>
          <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
            Comprehensive dashboards with interactive charts, orbital predictions, and real-time threat assessment
          </p>
        </div>

        {/* Chart cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {/* Mock bar chart card */}
          <div className="space-y-6">
            <Card className="glass-card animate-fade-in">
              <div className="p-6">
                <h3 className="text-lg font-orbitron font-semibold mb-4 text-primary">
                  Distance Distribution
                </h3>
                <div className="h-32 bg-muted/10 rounded-lg relative overflow-hidden">
                  {/* Mock Bar Chart */}
                  <div className="absolute bottom-0 left-0 w-full h-full flex items-end gap-2 p-4">
                    {[40, 65, 30, 80, 45, 75, 55, 90].map((height, i) => (
                      <div
                        key={i}
                        className="bg-primary/60 rounded-t flex-1 animate-fade-in"
                        style={{ 
                          height: `${height}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Mock pie chart card */}
            <Card className="glass-card animate-fade-in">
              <div className="p-6">
                <h3 className="text-lg font-orbitron font-semibold mb-4 text-accent">
                  Risk Assessment
                </h3>
                <div className="h-32 bg-muted/10 rounded-lg relative overflow-hidden flex items-center justify-center">
                  {/* Mock Pie Chart */}
                  <div className="w-20 h-20 relative">
                    <div className="w-full h-full rounded-full border-8 border-primary/30"></div>
                    <div className="absolute inset-0 w-full h-full rounded-full border-8 border-primary border-l-transparent animate-orbit"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-orbitron font-bold">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Dashboard Preview */}
          <Card className="glass-card animate-fade-in overflow-hidden">
            <div className="relative">
              <img 
                src={dashboardMockup}
                alt="NEO Explorer Dashboard"
                className="w-full h-auto opacity-80 hover:opacity-100 transition-cosmic"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-orbitron font-semibold text-primary mb-2">
                  Interactive Dashboard
                </h3>
                <p className="text-sm text-muted-foreground font-inter">
                  Real-time monitoring with customizable views, orbital tracking, and predictive analysis
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: "📊", title: "Live Charts", desc: "Real-time data visualization" },
            { icon: "🛰️", title: "Orbital Tracking", desc: "Precise trajectory monitoring" },
            { icon: "⚠️", title: "Threat Analysis", desc: "AI-powered risk assessment" },
            { icon: "🔄", title: "Auto Updates", desc: "Continuous data synchronization" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="text-center p-4 glass-card hover:glow-blue transition-cosmic animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="font-orbitron font-semibold text-sm mb-1">{feature.title}</div>
              <div className="text-xs text-muted-foreground font-inter">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
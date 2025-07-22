import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

/**
 * Footer component
 * Displays site branding, features, and resource links with a modern, space-themed design.
 */
export const Footer = () => {
  return (
    <footer className="relative py-20 px-4 mt-20">
      {/* Background gradient and effects for footer */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand section */}
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-gradient mb-4">
                NEO Explorer
              </h3>
              <p className="text-muted-foreground font-inter mb-6">
                Advanced near-Earth asteroid tracking powered by NASA's comprehensive database and cutting-edge space technology.
              </p>
              {/* Social/resource buttons */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="glass border-primary/30 hover:border-primary hover:glow-blue transition-cosmic"
                  asChild
                >
                  <a 
                    href="https://github.com/HadaAaradhya?tab=repositories" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="glass border-accent/30 hover:border-accent hover:glow-violet transition-cosmic"
                  asChild
                >
                  <a 
                    href="https://api.nasa.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="NASA NEO API"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Features section */}
            <div>
              <h4 className="font-orbitron font-semibold text-lg mb-4 text-primary">
                Features
              </h4>
              <ul className="space-y-2 font-inter text-muted-foreground">
                <li>Real-time NEO tracking</li>
                <li>Interactive dashboards</li>
                <li>Orbital predictions</li>
                <li>Threat assessment</li>
                <li>Historical data analysis</li>
                <li>Custom alerts</li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-orbitron font-semibold text-lg mb-4 text-accent">
                Resources
              </h4>
              <ul className="space-y-2 font-inter">
                <li>
                  <a 
                    href="https://api.nasa.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-cosmic inline-flex items-center gap-1"
                  >
                    NASA NEO API
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://cneos.jpl.nasa.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-cosmic inline-flex items-center gap-1"
                  >
                    JPL CNEOS
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://firebase.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-cosmic inline-flex items-center gap-1"
                  >
                    Firebase Auth
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/HadaAaradhya?tab=repositories" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-cosmic inline-flex items-center gap-1"
                  >
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground font-inter">
                  © 2025 NEO Explorer. Powered by NASA's Near Earth Object Web Service.
                </p>
                <p className="text-xs text-muted-foreground font-inter mt-1">
                  Built with cutting-edge space technology for asteroid monitoring and research.
                </p>
                <p className="text-xs font-bold text-neon-blue font-inter mt-1">
                  By Aaradhya Hada
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs font-inter text-muted-foreground">
                    Real-time data sync
                  </span>
                </div>
                <div className="text-xs font-orbitron text-primary">
                  34,847 objects tracked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Search, BookOpen, Users, Award, MapPin } from "lucide-react";
const HeroSection = () => {
  return <section className="relative bg-gradient-hero pt-28 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Gateway to 
            <span className="block md:inline text-white font-bold"> Global Universities</span>
          </h1>
          <p className="text-xl mb-12 leading-relaxed max-w-3xl mx-auto text-white/90">
            Access world-class education opportunities across 105+ countries. Connect with top universities worldwide, 
            explore diverse programs at the best prices, and start your journey towards academic excellence.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-card rounded-3xl p-8 shadow-elegant border border-border mb-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="netherlands">Netherlands</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="turkey">Turkey</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harvard">Harvard University</SelectItem>
                <SelectItem value="oxford">University of Oxford</SelectItem>
                <SelectItem value="mit">MIT</SelectItem>
                <SelectItem value="cambridge">University of Cambridge</SelectItem>
                <SelectItem value="stanford">Stanford University</SelectItem>
                <SelectItem value="tu-munich">Technical University of Munich</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Study Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bachelor">Bachelor's</SelectItem>
                <SelectItem value="master">Master's</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Major" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="arts">Arts & Humanities</SelectItem>
                <SelectItem value="computer-science">Computer Science</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="multiple">Multiple Languages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size="lg" className="w-full md:w-auto bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft px-12 h-12">
            <Search className="h-5 w-5 mr-2" />
            Search Programs
          </Button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border hover:shadow-glow transition-shadow">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-xl mb-4">10,000+ Programs</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Explore thousands of degree programs across 105+ countries, from engineering to arts, all at competitive prices with world-class facilities.
            </p>
            <Button variant="outline" className="group">
              Explore Programs
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border hover:shadow-glow transition-shadow">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-xl mb-4">2,000+ Universities</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Partner with top-ranked institutions across 105+ countries worldwide, from prestigious European universities to leading American colleges.
            </p>
            <Button variant="outline" className="group">
              View Universities
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border hover:shadow-glow transition-shadow">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-xl mb-4">Best Prices Guaranteed</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Get the best tuition rates and scholarship opportunities worldwide, with transparent pricing and no hidden fees for quality education.
            </p>
            <Button variant="outline" className="group">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft px-10 py-4 text-lg">
            Start Your Application Journey
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>;
};
export default HeroSection;
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-6">
            Ready to Start Your
            <span className="block text-primary-glow">Academic Journey?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-background/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of international students who have successfully enrolled in Turkish universities. 
            Your dream education is just one click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-background/30 text-background hover:bg-background/10 text-lg px-8 py-4"
            >
              Schedule Consultation
            </Button>
          </div>

          <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-8 border border-background/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-background mb-4">
              Need Help Getting Started?
            </h3>
            <p className="text-background/80 mb-6">
              Our education consultants are here to help you every step of the way. Get personalized guidance for free.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-background/10">
                <Phone className="h-5 w-5 text-background" />
                <div className="text-left">
                  <div className="text-background font-medium">Call Us</div>
                  <div className="text-background/70 text-sm">+1 (555) 123-4567</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-background/10">
                <Mail className="h-5 w-5 text-background" />
                <div className="text-left">
                  <div className="text-background font-medium">Email Us</div>
                  <div className="text-background/70 text-sm">info@univgates.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-background/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-2xl"></div>
    </section>
  );
};

export default CTASection;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import ContactForm from "@/components/ContactForm";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback and check for existing session
    const handleAuth = async () => {
      // Check for existing session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Always redirect to onboarding for new users, let onboarding component handle completion check
        navigate('/onboarding');
        return;
      }
    };

    // Set up auth state listener for real-time updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user && event === 'SIGNED_IN') {
          // Always redirect to onboarding for new users, let onboarding component handle completion check
          navigate('/onboarding');
        }
      }
    );

    handleAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        
        {/* Contact Section */}
        <section id="contact" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get Started Today
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ready to begin your journey? Fill out our contact form and our team will get back to you within 24 hours.
              </p>
            </div>
            <div className="flex justify-center">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

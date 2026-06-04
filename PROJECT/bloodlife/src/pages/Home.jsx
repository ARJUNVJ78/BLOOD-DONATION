import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Activity, ChevronRight, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden mx-4 my-8 rounded-[40px]">
        <img 
          src="/src/assets/hero.png" 
          alt="Blood Bank Hero" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1615461066159-fea0960485d5?auto=format&fit=crop&q=80&w=2000";
          }}
        />
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Give Blood, <span className="text-[var(--primary)]">Save Lives</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200">
              Your contribution can bring back a smile. Join our community of life-savers today and make a difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="btn btn-primary px-10 py-4 text-lg rounded-full">
                Become a Donor <ChevronRight size={20} />
              </Link>
              <Link to="/login" className="btn glass px-10 py-4 text-lg rounded-full text-white hover:bg-white hover:text-[var(--primary)]">
                Find Blood
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx="true">{`
        .min-h-screen { min-height: 100vh; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .object-cover { object-fit: cover; }
        .brightness-50 { filter: brightness(0.5); }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .h-\[80vh\] { height: 80vh; }
      `}</style>
    </div>
  );
};

export default Home;

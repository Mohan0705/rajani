import React, { useEffect } from 'react';
import { Sparkles, Award, HeartHandshake, ShieldCheck, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { updateMetaTags } from '../lib/seo';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  useEffect(() => {
    updateMetaTags({
      title: `About Our Weaving Heritage`,
      description: `Learn about ${settings.business_name || 'Rajani Sarees'}. Master weavers crafting pure Kanchipuram silk, Banarasi brocades, and fine handloom sarees.`,
      settings
    });
  }, [settings]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-800 tracking-widest uppercase">
          Handloom Heritage & Craftsmanship
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          About {settings.business_name}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Preserving the timeless tradition of Indian handloom weaving. Curating pure silk and artisanal sarees direct from master weaving clusters.
        </p>
      </div>

      {/* Editorial Image Banner */}
      <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-stone-100 shadow-lg border border-amber-200/60 relative">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
          alt="Handloom Saree Weaving"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Story Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-xs sm:text-sm text-stone-700 leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Our Commitment to Authentic Weaves
          </h2>
          <p>
            At {settings.business_name}, every saree represents hours of patient handloom craftsmanship. We partner directly with master weavers across Kanchipuram, Varanasi, Chanderi, and Gadwal to bring you uncompromised quality without middleman markups.
          </p>
          <p>
            Whether you are choosing a crimson bridal Kanchipuram silk saree for your wedding day or a lightweight sheer organza saree for a festive gathering, we ensure every detail meets rigorous standards of pure silk weight and authentic zari work.
          </p>
        </div>

        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-950">
            Why Choose Our Boutique?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>100% Silk Mark Authenticity:</strong> All silk sarees are certified for pure mulberry silk purity.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>Weaver-Direct Pricing:</strong> Fair compensation to traditional weaving families and direct savings for you.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <HeartHandshake className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span><strong>Direct WhatsApp Support:</strong> Instant video drapes, color matching, and personal advice.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PaymentModal } from "@/components/PaymentModal";
import { Check, Star, Zap } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Pricing = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    credits: number;
    price: number;
  } | null>(null);
  const { user } = useUser();

  const pricingTiers = [
    {
      id: "starter",
      name: "Starter",
      credits: 100,
      price: 5,
      popular: false,
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      description: "Perfect for trying out AI music generation",
      features: [
        "100 Music Generations",
        "Standard Quality Audio",
        "Basic Support",
        "Download MP3 Files",
        "Save to Profile"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      credits: 500,
      price: 20,
      popular: true,
      icon: <Star className="w-8 h-8 text-green-400" />,
      description: "Best value for regular creators",
      features: [
        "500 Music Generations",
        "High Quality Audio",
        "Priority Support",
        "Extended Track Length",
        "Advanced Audio Controls",
        "Commercial Usage Rights"
      ]
    },
    {
      id: "creator",
      name: "Creator",
      credits: 1000,
      price: 35,
      popular: false,
      icon: <Star className="w-8 h-8 text-purple-400" />,
      description: "For serious music creators and professionals",
      features: [
        "1000 Music Generations",
        "Ultra Quality Audio",
        "VIP Support",
        "Longest Track Length",
        "Full Commercial License",
        "API Access",
        "Custom Model Training"
      ]
    }
  ];

  const handleSelectPackage = (tier: { credits: number; price: number }) => {
    setSelectedPackage(tier);
    setShowPayment(true);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">Creative Plan</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the power of AI music generation with our flexible credit system. 
              Generate unlimited tracks, save your favorites, and bring your musical ideas to life.
            </p>
            
            {/* Current Credits Display */}
            {user && (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 mb-8">
                <span className="text-3xl">🎵</span>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{user.credits}</div>
                  <div className="text-sm text-gray-400">Current Credits</div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 hover:scale-105 ${
                  tier.popular 
                    ? "border-green-500/50 ring-2 ring-green-500/20 lg:scale-105" 
                    : "border-purple-500/20"
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{tier.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-white">{tier.credits}</span>
                    <span className="text-gray-400 ml-2">credits</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    ${tier.price}
                    <span className="text-base text-gray-400 font-normal ml-1">one-time</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={() => handleSelectPackage({ credits: tier.credits, price: tier.price })}
                  className={`w-full h-12 font-medium transition-all ${
                    tier.popular
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  }`}
                >
                  Get {tier.name} Plan
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">How do credits work?</h3>
                <p className="text-gray-300">Each music generation costs 1 credit. Credits never expire and can be used anytime. Generate as many tracks as you want!</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">What audio quality do I get?</h3>
                <p className="text-gray-300">All plans include high-quality MP3 downloads. Pro and Creator plans offer enhanced audio processing and longer track lengths.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">Can I use the music commercially?</h3>
                <p className="text-gray-300">Pro and Creator plans include commercial usage rights. Starter plan is for personal use only.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-white font-semibold mb-3">Is there a subscription?</h3>
                <p className="text-gray-300">No! We use a simple credit system. Buy credits once and use them whenever you want. No recurring charges.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={showPayment}
        onClose={handlePaymentClose}
        selectedPackage={selectedPackage || undefined}
      />
    </div>
  );
};

export default Pricing;

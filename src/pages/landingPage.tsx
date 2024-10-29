import { LogoTicker } from "@/components/logoTicker";
import {LandPageNavBar} from "../components/LandingPageHeader"
import {Hero} from "@/components/hero";
import ProductShowCase from "@/components/productShowCase";
import Pricing from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import CallToAction from "@/components/callToAction";
import Footer from "@/components/footer";
const LandingPage = () => {
  return (
    <div className="bg-[#EAEEFE]">
      {/* Navbar */}
    <LandPageNavBar />

      {/* Hero Section */}
      <Hero />
      {/* logo ticket */}
      <LogoTicker />
      {/* Product show case */}
      <ProductShowCase />

      {/* Pricing */}
      <Pricing />
      {/* testimonials */}
      <Testimonials />

      {/* call to action */}
      <CallToAction />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

import Authentication from "@/components/authentication";
import Footer from "@/components/footer";
import { LandPageNavBar } from "@/components/LandingPageHeader";

export default function GetStarted() {
  return (
    <div className="bg-[#EAEEFE]">
        {/* header */}
        <LandPageNavBar />
        {/* authentication */}
        <Authentication />
        {/* footer */}
        <Footer />
    </div>
  )
}
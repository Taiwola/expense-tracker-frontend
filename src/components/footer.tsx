import Logo from "@/assets/logo.jpeg";
import { InstagramLogoIcon, TwitterLogoIcon, LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-[#bcbcbc] text-sm py-10 text-center">
        <div className="container mx-auto">
            <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:blur before:w-full before:bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] before:absolute">
            <img src={Logo} alt="logo" height={40}  width={70} className="relative"/>
            </div>
            <nav className="flex flex-col md:flex-row justify-center gap-6 mt-6">
                <Link to={"#about"}>About</Link>
                <Link to={"#feature"}>Features</Link>
                <Link to={"#customers"}>Customers</Link>
                <Link to={"#pricing"}>Pricing</Link>
                <Link to={"#help"}>Help</Link>
                <Link to={"#career"}>Careers</Link>
            </nav>
            <div className="flex justify-center gap-6 mt-6">
                <InstagramLogoIcon className="cursor-pointer"/>
                <TwitterLogoIcon className="cursor-pointer"/>
                <LinkedInLogoIcon className="cursor-pointer"/>
                <GitHubLogoIcon className="cursor-pointer"/>
            </div>
            <p className="mt-6">&copy; 2024, All right reserved.</p>
        </div>
    </footer>
  )
}
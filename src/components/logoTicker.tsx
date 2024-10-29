
import acmeLogo from "@/assets/logo-acme.png";
import quantumLogo from "@/assets/logo-quantum.png";
import echoLogo from "@/assets/logo-echo.png";
import celestialLogo from "@/assets/logo-celestial.png";
import pulseLogo from "@/assets/logo-pulse.png";
import apexLogo from "@/assets/logo-apex.png";
import {motion} from "framer-motion";

export const LogoTicker = () => {
    return (
        <div className="py-8 md:py-12 bg-white">
             <div className="container">
                <div className="flex overflow-hidden items-center [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
                <motion.div className="flex gap-14 flex-none pr-14" animate={{
                    translateX: "-50%"
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
                >
                    <img src={acmeLogo} alt="achme logo"  className="logoTicker"/>
                    <img src={quantumLogo} alt="quantum logo"  className="logoTicker" />
                    <img src={echoLogo} alt="echo logo"  className="logoTicker" />
                    <img src={celestialLogo} alt="celestial logo"  className="logoTicker" />
                    <img src={pulseLogo} alt="pulse logo"  className="logoTicker" />
                    <img src={apexLogo} alt="apex logo"   className="logoTicker"/>
                            {/* second set of logo for animation */}
                    <img src={acmeLogo} alt="achme logo"  className="logoTicker"/>
                    <img src={quantumLogo} alt="quantum logo"  className="logoTicker" />
                    <img src={echoLogo} alt="echo logo"  className="logoTicker" />
                    <img src={celestialLogo} alt="celestial logo"  className="logoTicker" />
                    <img src={pulseLogo} alt="pulse logo"  className="logoTicker" />
                    <img src={apexLogo} alt="apex logo"   className="logoTicker"/>
                </motion.div>
                </div>
               
             </div>
        </div>
    )
}
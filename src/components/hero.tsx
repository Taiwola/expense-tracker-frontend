import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import cogImage from "@/assets/cog.png" ;
import cylinderImage from "@/assets/cylinder 1.png";
import noddleImage from "@/assets/half-torus 1.png";
import {motion, useScroll, useTransform} from "framer-motion";
import { useRef } from "react";

export const Hero = () => {
    const heroRef = useRef(null);
    const {scrollYProgress} = useScroll({
        target: heroRef,
        offset: ["start end", "end start"]
    });
    const translateY = useTransform(scrollYProgress, [0,1], [150, -150]);
    
    return (
        <section ref={heroRef} className="relative pt-8 pb-20 md:pt-5 md:pb-10 bg-custom-gradient overflow-x-clip">
            <div className="container mx-auto">
                <div className="md:flex items-center justify-between">
                <div className="md:w-[608px] lg:w-[700px]">
                    <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
                        Version 1.0 is here
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001e80] text-transparent bg-clip-text">Track Your Expenses Effortlessly</h1>
                    <p className="text-xl text-[#010d3e] tracking-tight mt-6">Manage your finances with ease, set budgets, and monitor your spending in real-time.</p>
                    <div>
                        <div className="flex gap-2 items-center mt-[30px]">
                        <Button onClick={() =>  window.location.replace('/get-started')} >Get for free</Button>
                        <Button variant={"link"} className="text-[#010d3E] gap-1"><span>
                            Learn more</span>
                            <ArrowRight size={20}/>
                            </Button>
                        </div>
                    </div>
                    
                </div>
                <div className="mt-20 md:mt-0 md:h-[648px] md:w-full md:flex-1 relative">
                    <motion.img 
                    src={cogImage} 
                    alt="cog image" 
                    className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0" 
                    animate={{
                        translateY: [-30,30]
                    }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 5,
                        ease: "easeInOut"
                    }}
                    />
                    <motion.img src={cylinderImage} alt="cylinder" width={220} height={220} className="hidden md:block -top-4 -left-32 md:absolute" 
                    style={{
                        translateY: translateY
                    }}
                    />
                    <motion.img src={noddleImage} alt="noddle image" width={220} height={220} className="absolute
                     top-[524px] left-[448px] hidden lg:block rotate-[30deg]" 
                     style={{
                        rotate: 30,
                        translateY: translateY
                    }}
                     />
            </div>
                </div>
            </div>
        </section>
    );
}
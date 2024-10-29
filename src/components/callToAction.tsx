import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import starImage from "@/assets/star.png";
import springImage from "@/assets/spring.png";
import {motion, useScroll, useTransform} from "framer-motion";
import { useRef } from "react";

export default function CallToAction() {
    const sectionRef = useRef(null);
    const {scrollYProgress} = useScroll({
        target:sectionRef,
        offset: ['start end', 'end start']
    }
    );
    const translateY = useTransform(scrollYProgress, [0,1], [150,-150])
  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-hidden">
        <div className="container mx-auto">
        <div className="section-heading">
        <h2 className="section-title">Sign up for free today</h2>
            <p className="section-description mt-5">
                Celebrate the joy of accomplishment with an app designed to track your progress and motivate your efforts.
            </p>
            <motion.img
             style={{
                translateY: translateY
            }}
            src={starImage} width={360} alt="star image" className="absolute -left-[250px] -top-[137px]" />
            <motion.img src={springImage} 
            alt="spring"
            className="absolute -right-[200px] -top-[-19px]"
            width={360}
            style={{
                translateY: translateY
            }}
             />
        </div>
            <div className="flex gap-2 mt-10 justify-center">
            <Button onClick={() =>  window.location.replace('/get-started')} >
            Get For Free
        </Button>
        <Button variant={"link"} className="text-[#010d3E] gap-1">
            <span>Learn more</span>
            <ArrowRight size={20}/>
        </Button>
            </div>
        </div>
    </section>
  )
}
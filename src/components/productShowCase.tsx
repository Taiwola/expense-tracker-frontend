import productImage from "@/assets/product-image.png";
import pyramid from "@/assets/pyramid 1.png";
import tubeImage from "@/assets/tube.png";
import {motion,useScroll, useTransform} from "framer-motion";
import { useRef } from "react";


export default function ProductShowCase() {
  const sectionRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  const translateY = useTransform(scrollYProgress, [0,1], [150,-150]);
  return (
    <section ref={sectionRef} id="about" className="bg-gradient-to-b from-[#ffff] to-[#D2DCFF] py-24 overflow-x-clip">
        <div className="container mx-auto">
            <div className="max-w-[540px] mx-auto">
            <div className="flex justify-center">
            <div className="tag">Boast your ability to save</div>
            </div>
            <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">Track your daily, monthly and yearly expenses</h2>
            <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
            Expense Buddy is your ultimate tool to manage finances efficiently. From tracking daily expenses to analyzing spending patterns, Expense Buddy helps you stay in control of your budget.
            </p>
            </div>
            <div className="relative">
            <img src={productImage} alt="Product image" className="mt-10" />
            <motion.img src={pyramid} alt="pyramid image" className="hidden md:block absolute -right-32 -top-32" height={263} width={262}
            style={{
              translateY: translateY
            }}
            />
            <motion.img src={tubeImage} alt="tube image" className="absolute bottom-24 hidden md:block -left-36" height={248} width={248} 
            style={{
              translateY: translateY
            }}
            />
            </div>
        </div>
    </section>
  )
}
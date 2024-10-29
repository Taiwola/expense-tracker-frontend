import {ArrowRight, MenuIcon, X} from "lucide-react";
import Logo from "@/assets/logo.jpeg";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export const LandPageNavBar = () => {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(true)
    const openNav = async (value: boolean) => {
        setOpen(value)
    }
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/') {
            setShow(false);
        }
    },[show]);
    console.log(show);
    return (
        <header className="sticky z-20 top-0 backdrop-blur-sm ">

{
                show && (
                    <div className="flex gap-3 justify-center items-center py-3 bg-black text-sm text-white">
            <p className="text-white/60 hidden md:block">Streamline your ability to track your expenses effectively</p>
            <div className="inline-flex justify-center gap-1 items-center">
            <p>Get started for free</p>
            <ArrowRight height={16} width={16} className="inline-flex justify-center items-center" />
            </div>
        </div>
                )
            }

        <div className="py-5 bg-[#EAEEFE]/40">
            <div className="container mx-auto sm:pl-4 sm:pr-4">
                <div className="flex items-center justify-between">
                <Link to={"/"}><img src={Logo} alt="Expense logo" height={40} width={40}/></Link>
                <MenuIcon size={30} onClick={() => openNav(true)} className="md:hidden cursor-pointer"/>
                <nav className="hidden md:flex items-center gap-10 text-black/60">
                    <Link to='#about'>About</Link>
                    <Link to='#feature'>Feature</Link>
                    <Link to='#contact'>Contact us</Link>
                    <Button onClick={() =>  window.location.replace('/get-started')} className="tracking-tight font-medium">Get for free</Button>
                </nav>
                </div>
                {open ?
                 <div className="h-svh w-full bg-[#EAEEFE] flex flex-col gap-12 p-5 z-50 absolute top-0 left-0">
                    <div className="flex justify-end">
                 <X className="cursor-pointer" size={40} onClick={() => openNav(false)}/>
                    </div>
                 <nav className="flex flex-col gap-3">
                 <Link to='#about'>About</Link>
                 <Link to='#feature'>Feature</Link>
                 <Link to='#contact'>Contact us</Link>
                 <Button onClick={() =>  window.location.replace('/get-started')}  className="tracking-tight font-medium">Get for free</Button>
                 </nav>
             </div> : null }
            </div>
        </div>

        </header>
    );
}
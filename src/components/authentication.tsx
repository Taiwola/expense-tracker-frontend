import starImage from "@/assets/star.png";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Register from "./register";
import Login from "./login";
import {motion} from "framer-motion"
export default function Authentication() {
  return (
    <section className="container mx-auto">
        <div className="relative">
            <motion.img src={starImage} alt="" className="hidden md:block" 
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

            <div className="block md:absolute top-9 max-w-[500px] h-full w-full right-[20px]">
                <Tabs 
                defaultValue="register"
                >
                    <TabsList
                    className="bg-transparent border-b-1 h-16 w-full justify-between mb-4">
                        <div>
                            <TabsTrigger value="register">
                                <h1 className="leading-3 tracking-tight">register</h1>
                            </TabsTrigger>
                            <TabsTrigger value="login">
                                <h1 className="leading-3 tracking-tight">login</h1>
                            </TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent value="register">
                       <Register />
                    </TabsContent>
                    <TabsContent value="login">
                        <Login />
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    </section>
  )
}
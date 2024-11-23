import Image from "next/image";
import Navbar from "./components/Navbar";
import doctor from './Assets/doctor3.jpg';
import { Button } from "@/components/ui/button";
import { FaMicrophone } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="flex items-center justify-center pt-[60px]">
        <div className="w-[180vh] h-[87vh] p-[2.5vh] m-[2vh] grid grid-cols-14 gap-4 ">
          <div className="flex col-start-1 col-end-14 bg-white rounded-[20px]">
            <div className="h-[100%] w-[45%] rounded-l-[20px]">
              <Image 
                  className="h-[100%] w-[100%] rounded-l-[20px]" 
                  src={doctor} 
                  alt="Doctor"
              />
              <Button className="fixed text-[10px] bottom-[60px] h-[40px] w-[180px] left-[24%] items-center justify-center px-6 text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse">
                <FaMicrophone/>
                Start Recording
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

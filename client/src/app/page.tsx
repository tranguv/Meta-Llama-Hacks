"use client"

import Image from "next/image";
import Navbar from "./components/Navbar";
import doctor from './Assets/doctor3.jpg';
import { Button } from "@/components/ui/button";
import { FaMicrophone } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { useState } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const startRecording = () => {
    setIsRecording(true);
  }

  const stopRecording = () => {
    setIsRecording(!isRecording);
  }

  return (
    <div>
      <Navbar/>
      <div className="flex items-center justify-center pt-[60px]">
        <div className="w-[180vh] h-[87vh] p-[2.5vh] m-[2vh] grid grid-cols-14 gap-4 ">
          <div className="col-start-1 col-end-14 bg-white rounded-[20px]">
            <div className="h-[100%] w-[45%] rounded-l-[20px]">
              <Image 
                  className="h-[100%] w-[100%] rounded-l-[20px]" 
                  src={doctor} 
                  alt="Doctor"
              />
              {isRecording ? 
                (<Button onClick={stopRecording} className="fixed rounded-full bottom-[60px] h-[100px] w-[100px] left-[26.3%] items-center justify-center px-6 text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse">
                  <FaPause size={20}/>
                </Button>)
                :
                (<Button onClick={startRecording} className="fixed rounded-full bottom-[60px] h-[100px] w-[100px] left-[26.3%] items-center justify-center px-6 text-base font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse">
                  <FaMicrophone size={20}/>
                </Button>)
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import doctor from '../../public/doctor.webp';
import { Button } from "@/components/ui/button";
import { FaMicrophone } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { useState } from "react";

export default function HomePage() {
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    return (
        <div className="flex items-center justify-center py-[9%]">
            <div className="w-[90vw] h-[75vh] grid gap-4 bg-white rounded-[20px]">
                {/* Left Section - Doctor Image */}
                <div className="w-1/2 h-full">
                    <Image
                        className="h-full w-full rounded-l-[20px] object-cover"
                        src={doctor}
                        alt="Doctor"
                    />
                    {isRecording ? (
                        <Button
                            onClick={stopRecording}
                            className="fixed rounded-full bottom-[40px] h-[80px] w-[80px] left-[20%] items-center justify-center text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse"
                        >
                            <FaPause size={20} />
                        </Button>
                    ) : (
                        <Button
                            onClick={startRecording}
                            className="fixed rounded-full bottom-[40px] h-[80px] w-[80px] left-[20%] items-center justify-center text-base font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse"
                        >
                            <FaMicrophone size={20} />
                        </Button>
                    )}
                </div>

                {/* Right Section - Black Div */}
                <div className="w-1/2 h-full bg-black flex items-center justify-center text-white rounded-r-[20px]">
                    hello
                </div>
            </div>
        </div>
    );
}

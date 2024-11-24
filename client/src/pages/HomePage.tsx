"use client";

import Image from "next/image";
import doctor from '../../public/doctor.webp';
import { Button } from "@/components/ui/button";
import { FaMicrophone } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { use, useEffect, useState } from "react";
import ChatPage from "./ChatPage";
import { useVoiceToText } from "react-speakup";

export default function HomePage() {
    const { startListening, stopListening, transcript, reset } = useVoiceToText({
        continuous: true,
        lang: "en-US",
    });
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    useEffect(() => {
        console.log("transcript", transcript);
    }, [transcript]);

    return (
        <div className="flex items-center justify-center py-[8%]">
            <div className="flex flex-row w-[90vw] h-[75vh] bg-white rounded-[20px]">
                {/* Left Section - Doctor Image */}
                <div className="w-1/3 h-full">
                    <Image
                        className="h-full w-full rounded-l-[20px] object-contain"
                        src={doctor}
                        alt="Doctor"
                    />
                    {isRecording ? (
                        <Button
                            onClick={() => {
                                console.log("Stop Listening");
                                stopListening();
                                stopRecording();
                            }}
                            className="fixed rounded-full bottom-[80px] h-[80px] w-[80px] left-[20%] items-center justify-center text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse"
                        >
                            <FaPause size={20} />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                console.log("Start Listening");
                                startListening();
                                startRecording();
                            }}
                            className="fixed rounded-full bottom-[80px] h-[80px] w-[80px] left-[20%] items-center justify-center text-base font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse"
                        >
                            <FaMicrophone size={20} />
                        </Button>
                    )}
                </div>

                {/* Right Section - Black Div */}
                <div className="w-2/3 h-full flex items-center justify-center text-white rounded-r-[20px]">
                    {transcript}
                    <ChatPage />
                </div>
            </div>
        </div>
    );
}

"use client";

import Image from "next/image";
import doctor from "../../public/doctor.webp";
import { Button } from "@/components/ui/button";
import { FaMicrophone, FaPause } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ChatPage from "./ChatPage";
import { useVoiceToText, useTextToVoice } from "react-speakup";

export default function HomePage() {
    const { startListening, stopListening, transcript, reset } = useVoiceToText({
        continuous: true,
        lang: "en-US",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { speak } = useTextToVoice();

    interface Chat {
        variant: boolean;
        message: string;
    }

    const [data, setData] = useState<Chat[]>([
        {
            variant: false,
            message: "Hello! I am Llama Care, how can I help you? Tap the microphone to start speaking. Click again to stop recording.",
        },
    ]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isUser, setIsUser] = useState<boolean>(true);
    const messageEndRef = useRef<HTMLDivElement>(null); // Ref to track the end of messages

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
        }
    }, [transcript]);
    // useEffect(() => {
    //     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [transcript]);

    const startRecording = () => {
        setIsRecording(true);
        startListening();
    };

    const stopRecording = () => {
        setIsRecording(false);
        stopListening();
    };

    const sendToApi = async (message: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://195.242.13.143:8000/ask-all/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: message }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const apiResponse = await response.json();

            const cleanResponse = apiResponse.response.replace(/\*\*/g, "").trim();
            setIsLoading(false);
            setData((prevData) => [
                ...prevData,
                { variant: false, message: cleanResponse || "No response" },
            ]);

            // Speak the response using text-to-voice
            speak();
        } catch (error) {
            console.error("Error sending transcript to API:", error);
        }
    };

    useEffect(() => {
        if (!isRecording && transcript) {
            setData((prevData) => [
                ...prevData,
                { variant: isUser, message: transcript },
            ]);

            sendToApi(transcript);
            reset();
        }
    }, [transcript, isRecording]);

    useEffect(() => {
        console.log("Chat data updated:", data);
    }, [data]);

    return (
        <div className="flex items-center justify-center py-[8%] bg-[#8AA2D4]">
            <div className="flex flex-row w-[90vw] h-[75vh] bg-[#e9eaf6] rounded-[20px]">
                {/* Left Section - Doctor Image */}
                <div className="w-1/3 h-full">
                    <Image
                        className="h-full w-full rounded-l-[20px] object-contain"
                        src={doctor}
                        alt="Doctor"
                    />
                    {isRecording ? (
                        <Button
                            onClick={stopRecording}
                            className="fixed rounded-full bottom-[80px] h-[80px] w-[80px] left-[20%] items-center justify-center text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse"
                        >
                            <FaPause size={20} />
                        </Button>
                    ) : (
                        <Button
                            onClick={startRecording}
                            className="fixed rounded-full bottom-[80px] h-[80px] w-[80px] left-[20%] items-center justify-center text-base font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse"
                        >
                            <FaMicrophone size={20} />
                        </Button>
                    )}
                </div>

                {/* Right Section - Chat Page */}
                <div className="w-2/3 h-full flex items-center justify-center text-white rounded-r-[20px]">
                    <ChatPage data={data} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

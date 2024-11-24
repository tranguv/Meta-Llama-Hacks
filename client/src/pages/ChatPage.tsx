import React from 'react';
import { useVoiceToText } from "react-speakup";

const ChatPage = () => {
    const { transcript } = useVoiceToText();
    return (
        <div>
            <h1>Chat Page</h1>
            <p>{transcript}</p>
        </div>
    );
};

export default ChatPage


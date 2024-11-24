import React, { useState } from 'react';
import { ChatInput } from '../ui/chat/chat-input';
import { MdAttachFile } from "react-icons/md";

interface InputFieldProps {
    onSend: (text: string) => void;
    onUploadFile?: (e: any) => void;
}

const InputField = ({ onSend, onUploadFile }: InputFieldProps) => {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            onSend(inputText);
            setInputText('');
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleUploadFile = (e: any) => {
        if (onUploadFile) {
            onUploadFile(e);
        }
    };

    return (
        <div className='flex flex-row'>
            <ChatInput
                value={inputText}
                placeholder='Your message here'
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <div className='flex items-center -translate-x-10'>
                <MdAttachFile color='black' size={25} onClick={handleUploadFile} type='file' />
            </div>
        </div>
    );
};

export default InputField;

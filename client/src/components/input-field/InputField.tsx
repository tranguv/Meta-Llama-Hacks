import React, { useState } from 'react';

interface InputFieldProps {
    onSend: (text: string) => void;
}

const InputField = ({ onSend }: InputFieldProps) => {
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

    return (
        <div className="input-group">
            <textarea
                className="form-control"
                placeholder="Type your message here"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary" onClick={handleSend}>
                Send
            </button>
        </div>
    );
};

export default InputField;

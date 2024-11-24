import React from 'react';

interface MessageProps {
    text: String,
    isUser: boolean,
}

const Message = ({ text, isUser }: MessageProps) => {
    return (
        <div className={`d-flex ${isUser ? 'justify-content-end' : ''} mb-3`}>
            <div className={`p-3 rounded ${isUser ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '70%' }}>
                <p style={{ whiteSpace: 'pre-line' }}>{text}</p>
            </div>
        </div>
    );
};

export default Message


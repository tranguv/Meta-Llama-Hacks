import React from 'react';
import { useVoiceToText } from "react-speakup";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { ChatInput } from '@/components/ui/chat/chat-input';
import InputField from '@/components/input-field/InputField';

const ChatPage = () => {
    const { transcript } = useVoiceToText();
    const [files, setFiles] = React.useState<File[]>([]);

    const handleUploadFile = (e: EventTarget) => {
        if (e instanceof Event) {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const fileList = Array.from(target.files);
                setFiles([...e.target.files]);
            }
        }
    };

    return (
        <div className='flex flex-col'>
            <ChatMessageList>
                <ChatBubble variant='sent'>
                    <ChatBubbleAvatar fallback='US' />
                    <ChatBubbleMessage variant='sent'>
                        Hello, how has your day been? I hope you are doing well.
                    </ChatBubbleMessage>
                </ChatBubble>

                <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>

                <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage isLoading />
                </ChatBubble>
            </ChatMessageList>
            <InputField onSend={(text) => console.log(text)} onUploadFile={handleUploadFile} />
        </div>
    );
};

export default ChatPage


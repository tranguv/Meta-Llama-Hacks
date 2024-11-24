import React from 'react';
import { useVoiceToText } from "react-speakup";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'

const ChatPage = () => {
    const { transcript } = useVoiceToText();
    return (
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
    );
};

export default ChatPage


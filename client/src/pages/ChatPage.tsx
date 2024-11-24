import React from "react";
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

interface Chat {
    variant: boolean;
    message: string;
}

interface ChatPageProps {
    data: Chat[];
    isLoading: boolean;
}

const ChatPage: React.FC<ChatPageProps> = ({ data, isLoading }) => {
    return (
        <ChatMessageList>
            {data.map((chat: Chat, index: number) => (
                <ChatBubble key={index} variant={chat.variant ? "sent" : "received"}>
                    <ChatBubbleAvatar fallback={chat.variant ? "US" : "AI"} />
                    <ChatBubbleMessage variant={chat.variant ? "sent" : "received"}>
                        {chat.message}
                    </ChatBubbleMessage>
                </ChatBubble>
            ))}
            {isLoading && (
                <ChatBubble layout="ai">
                    <ChatBubbleAvatar src="/avatar.png" fallback="L" />
                    <ChatBubbleMessage variant="received" isLoading>
                        Loading...
                    </ChatBubbleMessage>
                </ChatBubble>
            )}
        </ChatMessageList>
    );
};

export default ChatPage;

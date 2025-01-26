export type MessageDto = {
    chatId: string
    senderId: string
    text: string
    answeredToMessageId?: string
};
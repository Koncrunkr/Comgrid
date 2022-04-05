import {Topic} from "./Topic";

export class MessageIn {
    id!: number
    x!: number
    y!: number
    chatId!: number
    time!: Date
    senderId!: string
    text!: string
}
export class MessageOut {
    x!: number
    y!: number
    chatId!: number
    text!: string
}

export class TableTopic extends Topic<MessageIn, MessageOut>{
    constructor(readonly tableId: number) {
        super("/connection/table_message/{id}", "/connection/table_message/edit_or_send", tableId);
    }

    proceedMessage(message): MessageIn {
        return JSON.parse(message) as MessageIn;
    }
}
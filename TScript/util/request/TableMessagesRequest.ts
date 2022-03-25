import {RequestWrapper} from "./Request";
import {MethodType} from "../HttpClient";

export class MessageResponse{
    readonly id!: number
    readonly x!: number
    readonly y!: number
    readonly chatId!: number
    readonly time!: Date
    readonly senderId!: string
    readonly text!: string
}

export class TableMessagesRequest implements RequestWrapper<MessageResponse[]>{
    constructor(readonly body: {
        chatid: number,
        xcoordLeftTop: number,
        ycoordLeftTop: number,
        xcoordRightBottom: number,
        ycoordRightBottom: number,
        sinceDateTimeMillis?: number,
        untilDateTimeMillis?: number,
    }) {}
    readonly endpoint: string = '/messages/list';
    readonly headers: HeadersInit = {
        "Content-Type": "application/json"
    };
    readonly methodType: MethodType = MethodType.POST;

    async proceedRequest(response: Response): Promise<MessageResponse[]> {
        const text = await response.text();
        return JSON.parse(text) as MessageResponse[];
    }

}
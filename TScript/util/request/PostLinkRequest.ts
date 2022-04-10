import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";

export class ChatIdKeeper {
    chatId!: number;
}

export class PostLinkRequest implements RequestWrapper<ChatIdKeeper> {
    readonly body: any;
    constructor(body: { code: string }) {
        this.body = JSON.stringify(body);
    }

    readonly endpoint: string = "/table/invitation_link";
    readonly headers: HeadersInit = {
        "Content-Type": "application/json"
    };
    readonly methodType: MethodType = MethodType.POST;

    async proceedRequest(response: Response): Promise<ChatIdKeeper> {
        const text = await response.text();
        return JSON.parse(text) as ChatIdKeeper;
    }
}
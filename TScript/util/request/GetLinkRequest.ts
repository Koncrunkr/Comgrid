import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";

export class LinkGet {
    code!: string;
}

export class GetLinkRequest implements RequestWrapper<LinkGet> {
    readonly parameters: Record<string, string>;
    constructor(parameters: { chatId: number }) {
        this.parameters = {
            chatId: parameters.chatId.toString()
        }
    }

    readonly endpoint: string = "/table/invitation_link";
    readonly headers: HeadersInit = {
        "Content-Type": "application/json"
    };
    readonly methodType: MethodType = MethodType.GET;

    async proceedRequest(response: Response): Promise<LinkGet> {
        const text = await response.text();
        return JSON.parse(text) as LinkGet;
    }
}
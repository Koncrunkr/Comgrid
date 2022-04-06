import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";

export class AddParticipantRequest implements RequestWrapper<number> {
    readonly body: string;
    constructor(body: { chatId: number, userId: string }) {
        this.body = JSON.stringify(body)
    }

    readonly endpoint: string = "/table/add_participant";
    readonly headers: HeadersInit = {
        "Content-Type": "application/json"
    };
    readonly methodType: MethodType = MethodType.POST;

    async proceedRequest(response: Response): Promise<number> {
        return response.status;
    }
}
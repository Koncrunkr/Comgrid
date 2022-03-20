import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";

export class TableInfoRequest implements RequestWrapper {
    readonly body: string;

    constructor(
        body: {
            chatId: number,
            includeParticipants?: boolean
        }
    ) {
        this.body = JSON.stringify(body)
    }

    readonly endpoint: string = "/table/info";
    readonly methodType: MethodType = MethodType.GET;

}
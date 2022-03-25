import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";
import {TableResponse} from "./CreateTableRequest";

export class TableInfoRequest implements RequestWrapper<TableResponse> {
    readonly parameters: Record<string, string>;

    constructor(
        parameters: {
            chatId: number,
            includeParticipants?: boolean
        }
    ) {
        this.parameters = {
            chatId: parameters.chatId.toString(),
            includeParticipants: parameters.includeParticipants?.toString(),
        };
    }

    readonly endpoint: string = "/table/info";
    readonly methodType: MethodType = MethodType.GET;

    async proceedRequest(response: Response): Promise<TableResponse> {
        const text = await response.text()
        return JSON.parse(text) as TableResponse
    }

}
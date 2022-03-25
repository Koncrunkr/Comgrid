import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";
import {TableResponse} from "./CreateTableRequest";

export class TableInfoRequest implements RequestWrapper<TableResponse> {
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

    async proceedRequest(response: Response): Promise<TableResponse> {
        const text = await response.text()
        return JSON.parse(text) as TableResponse
    }

}
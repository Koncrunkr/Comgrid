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
        let params: any = {}
        params.chatId = parameters.chatId.toString()
        if(parameters.includeParticipants)
            params.includeParticipants = parameters.includeParticipants?.toString()

        this.parameters = params;
    }

    readonly endpoint: string = "/table/info";
    readonly methodType: MethodType = MethodType.GET;

    async proceedRequest(response: Response): Promise<TableResponse> {
        const text = await response.text()
        return JSON.parse(text) as TableResponse
    }

}
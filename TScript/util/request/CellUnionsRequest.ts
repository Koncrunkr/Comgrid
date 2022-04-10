import {RequestWrapper} from "./Request";
import {MethodType} from "../HttpClient";

export class UnionResponse{
    readonly id!: number
    readonly xcoordLeftTop!: number
    readonly ycoordLeftTop!: number
    readonly xcoordRightBottom !: number
    readonly ycoordRightBottom !: number
    readonly chatId!: number
    readonly creatorId!: string
}

export class CellUnionsRequest implements RequestWrapper<UnionResponse[]>{
    readonly parameters: Record<string, string>;

    constructor(parameters: {
        chatId: number,
        xcoordLeftTop: number,
        ycoordLeftTop: number,
        xcoordRightBottom: number,
        ycoordRightBottom: number
    }) {
        this.parameters = {
            chatId: parameters.chatId.toString(),
            xcoordLeftTop: parameters.xcoordLeftTop.toString(),
            ycoordLeftTop: parameters.ycoordLeftTop.toString(),
            xcoordRightBottom: parameters.xcoordRightBottom.toString(),
            ycoordRightBottom: parameters.ycoordRightBottom.toString()
        }
    }
    readonly endpoint: string = '/message/unions';
    readonly headers: HeadersInit = {
        "Content-Type": "application/json"
    };
    readonly methodType: MethodType = MethodType.GET;

    async proceedRequest(response: Response): Promise<UnionResponse[]> {
        const text = await response.text();
        return JSON.parse(text) as UnionResponse[];
    }

}
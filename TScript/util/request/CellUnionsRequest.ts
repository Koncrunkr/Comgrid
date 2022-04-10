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
    readonly body: any
    constructor(body: {
        chatId: number,
        xcoordLeftTop: number,
        ycoordLeftTop: number,
        xcoordRightBottom: number,
        ycoordRightBottom: number
    }) {
        this.body = JSON.stringify(body)
    }
    readonly endpoint: string = '/message/list';
    readonly headers: HeadersInit = {
        "Content-Type": "application/json"
    };
    readonly methodType: MethodType = MethodType.POST;

    async proceedRequest(response: Response): Promise<UnionResponse[]> {
        const text = await response.text();
        return JSON.parse(text) as UnionResponse[];
    }

}
import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";

export class UserResponse{
    readonly id!: string
    readonly name!: string
    readonly email!: string
    readonly avatar!: string
    readonly created!: Date
    readonly chats?: TableResponse[]
}

export class TableResponse {
    readonly id!: number
    readonly name!: string
    readonly creator!: number
    readonly width!: number
    readonly height!: number
    readonly avatar!: number
    readonly created!: Date
    readonly lastMessageId?: number
    readonly participants?: UserResponse[]
}

export class CreateTableRequest implements RequestWrapper<TableResponse> {
    readonly body?: FormData

    constructor(body: {
        name: string,
        width: number,
        height: number,
        avatarFile?: File,
        avatarLink?: string
    }) {
        this.body = new FormData()
        this.body.append('name', body.name)
        this.body.append('width', body.width.toString())
        this.body.append('height', body.height.toString())
        if (body.avatarLink == undefined && body.avatarFile == undefined)
            throw new TypeError("Cannot send request with no avatar")
        if (body.avatarFile != undefined)
            this.body.append('avatarFile', body.avatarFile)
        if (body.avatarLink != undefined)
            this.body.append('avatarLink', body.avatarLink)
    }

    async proceedRequest(response: Response): Promise<TableResponse> {
        const text = await response.text()
        return JSON.parse(text) as TableResponse
    }

    endpoint: string = "/table/create";
    headers?: HeadersInit = {
        "Content-Types": "application/json"
    };
    methodType: MethodType = MethodType.POST;
}
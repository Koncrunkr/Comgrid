import {MethodType} from "../HttpClient";
import {RequestWrapper} from "./Request";

export class CreateTableRequest implements RequestWrapper {
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

    endpoint: string = "/table/create";
    headers?: HeadersInit = null;
    methodType: MethodType = MethodType.POST;
}
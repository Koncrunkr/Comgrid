import {RequestWrapper} from "./Request";
import {TableResponse} from "./CreateTableRequest";
import {MethodType} from "../HttpClient";

export class UserResponse{
    readonly id!: string
    readonly name!: string
    readonly email?: string
    readonly avatar!: {
        link: string;
    }
    readonly created!: Date
    readonly chats?: TableResponse[]
}

export class UserInfoRequest implements RequestWrapper<UserResponse>{
    readonly parameters: Record<string, string>

    constructor(parameters: { includeChats?: boolean, userId?: string }) {
        let params: any = {}
        if(parameters.includeChats)
            params.includeChats = parameters.includeChats?.toString()
        if(parameters.userId)
            params.userId = parameters.userId;

        this.parameters = params
    }

    readonly endpoint: string = "/user/info";
    readonly methodType: MethodType = MethodType.GET;

    async proceedRequest(response: Response): Promise<UserResponse> {
        const text = await response.text();
        const user = JSON.parse(text) as UserResponse;
        // @ts-ignore
        user.created = new Date(user.created);
        return user;
    }
}
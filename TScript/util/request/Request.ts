import {MethodType} from "../HttpClient";


export abstract class RequestWrapper<T> {
    readonly requiresAuthentication?: boolean = true
    readonly endpoint: string
    readonly headers?: HeadersInit
    readonly parameters?: Record<string, string> | undefined
    readonly body?: any
    readonly methodType: MethodType
    abstract proceedRequest(response: Response): Promise<T>
}


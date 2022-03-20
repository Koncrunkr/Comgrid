import {MethodType} from "../HttpClient";


export interface RequestWrapper {
    readonly endpoint: string
    readonly headers?: HeadersInit
    readonly parameters?: Record<string, string> | undefined
    readonly body?: any
    readonly methodType: MethodType
}


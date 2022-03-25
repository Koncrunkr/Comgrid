import {RequestWrapper} from "./request/Request";


export class HttpClient {
    constructor(private readonly apiLink: string) {}

    async proceedRequest<T>(
        request: RequestWrapper<T>,
        onFailure: (code: number, errorText: string) => unknown =
            (code, errorText) => alert(`code: ${code}, error: ${errorText}`),
        onNetworkFailure: (reason) => unknown =
            (reason) => alert(`network error: ${reason}`)
    ): Promise<T>{
        const finalLink = new URL(this.apiLink + request.endpoint)
        if(request.parameters != undefined)
            finalLink.search = new URLSearchParams(request.parameters).toString()

        return fetch(
            finalLink.toString(),
            {
                credentials: "include",
                method: request.methodType,
                headers: request.headers,
                body: request.body
            }
        ).then((response) => {
            if(response.status === 200){
                return request.proceedRequest(response)
                // if(response.headers.get("Content-Type").startsWith("image")) {
                //     response.blob().then(blob => {
                //         onSuccess(blob)
                //     })
                // }else {
                //     response.text().then(text => {
                //         onSuccess(text)
                //     })
                // }
            }else{
                response.text().then(text => {
                    onFailure(response.status, text)
                    return Promise.reject(text)
                })
            }
        })
    }
}

export enum MethodType{
    POST="POST",
    GET="GET",
    PATCH="PATCH",
    PUT="PUT",
}
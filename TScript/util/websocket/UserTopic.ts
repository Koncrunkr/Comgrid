import {Topic} from "./Topic";


export class UserTopic extends Topic<any, unknown>{
    proceedMessage(message): any {
        return message
    }
    constructor(userId: string) {
        super("/connection/user/{id}", "", userId);
    }
}
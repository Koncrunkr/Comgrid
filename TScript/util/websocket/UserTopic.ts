import {Topic} from "./Topic";


export class UserTopic extends Topic{
    constructor(userId: string) {
        super("/connection/user/{id}", userId);
    }
}
import {Topic} from "./Topic";


export class TableTopic extends Topic{
    constructor(tableId: number) {
        super("/connection/table_message/{id}", tableId);
    }
}
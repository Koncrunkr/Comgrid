import {Topic} from "./Topic";

export class UnionIn {
    id!: string;
    chatId!: string;
    creatorId!: string;
    xcoordLeftTop!: number;
    ycoordLeftTop!: number;
    xcoordRightBottom!: number;
    ycoordRightBottom!: number;
}

export class UnionOut {
    chatId!: string;
    xcoordLeftTop!: number;
    ycoordLeftTop!: number;
    xcoordRightBottom!: number;
    ycoordRightBottom!: number;
}

export class CellUnionTopic extends Topic<UnionIn, UnionOut> {
    constructor(readonly tableId: number) {
        super("/connection/table_cell_union/{id}", "/connection/table_cell_union/edit", tableId);
    }

    proceedMessage(message): UnionIn {
        return JSON.parse(message) as UnionIn;
    }

}
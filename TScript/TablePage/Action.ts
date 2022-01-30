
export enum ActionType {
    write,
    writeWithSpace,
    delete,
    union
}

export type Action = [actionType: ActionType, cellX: number, cellY: number, info?: any];
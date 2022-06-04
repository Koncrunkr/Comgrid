import { Topic } from './Topic';

export class UnionIn {
  id!: number;
  chatId!: number;
  creatorId!: string;
  xcoordLeftTop!: number;
  ycoordLeftTop!: number;
  xcoordRightBottom!: number;
  ycoordRightBottom!: number;
}

export class UnionOut {
  id?: number;
  chatId!: number;
  xcoordLeftTop!: number;
  ycoordLeftTop!: number;
  xcoordRightBottom!: number;
  ycoordRightBottom!: number;
}

export function size(union: UnionOut): number {
  return (
    (union.xcoordRightBottom - union.xcoordLeftTop + 1) *
    (union.ycoordRightBottom - union.ycoordLeftTop + 1)
  );
}

export class CellUnionTopic extends Topic<UnionIn, UnionOut> {
  private readonly editPath = '/connection/table_cell_union/edit';

  constructor(readonly tableId: number) {
    super('/queue/table_cell_union.{id}', '/connection/table_cell_union', tableId);
  }

  sendDestination(message?: UnionOut): string {
    if (message?.id !== undefined) {
      return this.editPath;
    }
    return super.sendDestination(message);
  }

  proceedMessage(message: any): UnionIn {
    return JSON.parse(message) as UnionIn;
  }
}

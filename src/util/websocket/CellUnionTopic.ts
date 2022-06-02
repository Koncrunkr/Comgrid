import { Topic } from './Topic';

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
  id?: number;
  chatId!: string;
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
    super('/connection/table_cell_union/{id}', '/connection/table_cell_union', tableId);
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

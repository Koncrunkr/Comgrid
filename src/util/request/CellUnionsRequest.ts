import { RequestWrapper } from './Request';
import { MethodType } from '../HttpClient';
import { UnionIn } from '../websocket/CellUnionTopic';

export class CellUnionsRequest implements RequestWrapper<UnionIn[]> {
  readonly parameters: Record<string, string>;
  readonly endpoint: string = '/message/unions';
  readonly headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  readonly methodType: MethodType = MethodType.GET;

  constructor(parameters: {
    chatId: number;
    xcoordLeftTop: number;
    ycoordLeftTop: number;
    xcoordRightBottom: number;
    ycoordRightBottom: number;
  }) {
    this.parameters = {
      chatId: parameters.chatId.toString(),
      xcoordLeftTop: parameters.xcoordLeftTop.toString(),
      ycoordLeftTop: parameters.ycoordLeftTop.toString(),
      xcoordRightBottom: parameters.xcoordRightBottom.toString(),
      ycoordRightBottom: parameters.ycoordRightBottom.toString(),
    };
  }

  async proceedRequest(response: Response): Promise<UnionIn[]> {
    const text = await response.text();
    return JSON.parse(text) as UnionIn[];
  }
}

import { RequestWrapper } from './Request';
import { MethodType } from '../HttpClient';
import { MessageIn } from '../websocket/MessageTopic';

export class TableMessagesRequest implements RequestWrapper<MessageIn[]> {
  readonly body: any;
  constructor(body: {
    chatId: number;
    xcoordLeftTop: number;
    ycoordLeftTop: number;
    xcoordRightBottom: number;
    ycoordRightBottom: number;
    sinceDateTimeMillis?: number;
    untilDateTimeMillis?: number;
  }) {
    this.body = JSON.stringify(body);
  }
  readonly endpoint: string = '/message/list';
  readonly headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  readonly methodType: MethodType = MethodType.POST;

  async proceedRequest(response: Response): Promise<MessageIn[]> {
    const text = await response.text();
    const messages = JSON.parse(text) as MessageIn[];
    messages.forEach(m => {
      m.created = new Date(m.created);
      m.edited = new Date(m.edited);
    });
    return messages;
  }
}

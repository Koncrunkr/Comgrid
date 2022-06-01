import { RequestWrapper } from './Request';
import { MessageIn } from '../websocket/MessageTopic';
import { MethodType } from '../HttpClient';

export class MessageRequest extends RequestWrapper<MessageIn> {
  readonly parameters: Record<string, string>;
  readonly endpoint: string = '/message/';
  readonly methodType: MethodType = MethodType.GET;

  constructor(parameters: { chatId: number; x: number; y: number }) {
    super();
    this.parameters = {
      chatId: parameters.chatId + '',
      x: parameters.x + '',
      y: parameters.y + '',
    };
  }

  async proceedRequest(response: Response): Promise<MessageIn> {
    const text = await response.text();
    const message = JSON.parse(text) as MessageIn;
    message.created = new Date(message.created);
    message.edited = new Date(message.edited);
    return message;
  }
}

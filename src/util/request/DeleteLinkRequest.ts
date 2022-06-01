import { MethodType } from '../HttpClient';
import { RequestWrapper } from './Request';

export class DeleteLinkRequest implements RequestWrapper<number> {
  readonly parameters: any;
  readonly endpoint: string = '/table/invitation_link';
  readonly headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  readonly methodType: MethodType = MethodType.DELETE;

  constructor(parameters: { chatId: number }) {
    this.parameters = {
      chatId: parameters.chatId.toString(),
    };
  }

  async proceedRequest(response: Response): Promise<number> {
    return response.status;
  }
}

import { MethodType } from '../HttpClient';
import { RequestWrapper } from './Request';

export class AddParticipantRequest implements RequestWrapper<number> {
  readonly body: string;
  readonly endpoint: string = '/table/add_participant';
  readonly headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  readonly methodType: MethodType = MethodType.POST;

  constructor(body: { chatId: number; userId: string }) {
    this.body = JSON.stringify(body);
  }

  async proceedRequest(response: Response): Promise<number> {
    return response.status;
  }
}

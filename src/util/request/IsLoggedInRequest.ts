import { RequestWrapper } from './Request';
import { MethodType } from '../HttpClient';

export class IsLoggedInRequest implements RequestWrapper<number> {
  readonly endpoint: string = '/user/login';
  readonly methodType: MethodType = MethodType.GET;

  async proceedRequest(response: Response): Promise<number> {
    return response.status;
  }
}

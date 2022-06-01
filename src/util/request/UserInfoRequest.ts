import { RequestWrapper } from './Request';
import { MethodType } from '../HttpClient';
import { User } from '../State';

// export class UserResponse {
//   readonly id!: string;
//   readonly name!: string;
//   readonly email?: string;
//   readonly avatar!: {
//     link: string;
//   };
//   readonly created!: Date;
//   readonly chats?: TableResponse[];
//   readonly color!: string;
// }

export class UserInfoRequest implements RequestWrapper<User> {
  readonly parameters: Record<string, string>;

  constructor(parameters: { includeChats?: boolean; userId?: string }) {
    let params: any = {};
    if (parameters.includeChats)
      params.includeChats = parameters.includeChats?.toString();
    if (parameters.userId) params.userId = parameters.userId;

    this.parameters = params;
  }

  readonly endpoint: string = '/user/info';
  readonly methodType: MethodType = MethodType.GET;

  async proceedRequest(response: Response): Promise<User> {
    const text = await response.text();
    const user = JSON.parse(text) as User;
    // @ts-ignore
    user.created = new Date(user.created);
    return user;
  }
}

import { Topic } from './Topic';

export class UserTopic extends Topic<any, unknown> {
  constructor(userId: string) {
    super('/queue/user.{id}', '', userId);
  }

  proceedMessage(message: any): any {
    return message;
  }
}

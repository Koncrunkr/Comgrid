export abstract class Topic<MessageIn, MessageOut> {
  constructor(
    readonly receivePath: string,
    readonly sendPath: string,
    readonly identifier: any,
  ) {}

  receiveDestination(): string {
    return this.receivePath.replace('{id}', this.identifier);
  }

  sendDestination(): string {
    return this.sendPath.replace('{id}', this.identifier);
  }

  proceedMessage(message: any): MessageIn {
    return undefined as unknown as MessageIn;
  }
}

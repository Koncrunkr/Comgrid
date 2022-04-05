export abstract class Topic<ReceivedMessage, SentMessage> {
    constructor(
        readonly destinationPath: string,
        readonly receivePath: string,
        readonly identifier: any
    ) {}

    destination(): string {
        return this.destinationPath.replace("{id}", this.identifier)
    }
    receive(): string{
        return this.receivePath;
    }

    abstract proceedMessage(message): ReceivedMessage
}
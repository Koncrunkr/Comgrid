export abstract class Topic<ReceivedMessage, SentMessage> {
    constructor(
        readonly destinationPath: string,
        readonly receivePath: string,
        readonly identifier: any
    ) {}

    destination(): string {
        return this.destinationPath.replace("{id}", this.identifier)
    }

    abstract proceedMessage(message): ReceivedMessage
}
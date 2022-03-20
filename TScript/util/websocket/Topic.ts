export abstract class Topic {
    constructor(
        readonly path: string,
        readonly identifier: any
    ) {}

    destination(): string {
        return this.path.replace("{id}", this.identifier)
    }
}
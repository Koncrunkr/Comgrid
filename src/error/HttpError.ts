export class HttpError extends TypeError {
  constructor(error: { status: number; errorText: string }) {
    super(JSON.stringify(error));
  }
}

import { RequestWrapper } from "./Request";
import { MessageIn } from "../websocket/MessageTopic";
import { MethodType } from "../HttpClient";


export class SearchMessagesRequest extends RequestWrapper<MessageIn[]>{
  readonly endpoint: string = "/message/search";
  readonly headers: HeadersInit = {
    "Content-Type": "application/json"
  };
  readonly body: string = undefined;
  readonly methodType: MethodType = MethodType.GET;

  parameters?: Record<string, string> | undefined

  constructor(
    parameters: {
      text: string,
      chatId?: number,
      sinceTimeMillis?: number,
      untilTimeMillis?: number,
      chunkNumber?: number,
      exactMatch: boolean,
    }
  ){
    super();
    this.parameters = {
      "text": parameters.text,
      "chatId": (parameters.chatId ?? 0) + "",
      "sinceTimeMillis": (parameters.sinceTimeMillis ?? 0) + "",
      "untilTimeMillis": (parameters.untilTimeMillis ?? 0) + "",
      "chunkNumber": (parameters.chunkNumber ?? 0) + "",
      "exactMatch": (parameters.exactMatch !== undefined) + "",
    }
  }

  async proceedRequest(response: Response): Promise<MessageIn[]> {
    const text = await response.text()
    const messages = JSON.parse(text) as MessageIn[]
    messages.forEach(m => {
      m.created = new Date(m.created);
      m.edited = new Date(m.edited);
    });
    return messages;
  }
}
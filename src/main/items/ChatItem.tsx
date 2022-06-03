import { useTheme } from '../../theme/Theme';
import { useStrings } from '../../assets/localization/localization';
import { formatDateTime, resolveUser } from '../../util/Util';
import { createResource, Suspense } from 'solid-js';
import { TableResponse } from '../../util/request/CreateTableRequest';
import { getHttpClient } from '../../util/HttpClient';
import { MessageRequest } from '../../util/request/MessageRequest';
import { apiLink } from '../../util/Constants';
import { Link } from 'solid-app-router';

export const imgOnLoad = (props: { currentTarget: EventTarget & HTMLImageElement }) => {
  const width = props.currentTarget.getBoundingClientRect().width;
  props.currentTarget.style.setProperty('height', `${width}px`);
  props.currentTarget.style.setProperty('width', `${width}px`);
};

export const ChatItem = (props: { table: TableResponse }) => {
  const [theme] = useTheme();
  const [getString] = useStrings();
  const [lastMessage] = createResource(async () => {
    if (props.table.lastMessageX != null) {
      const lastMessage = await getHttpClient().proceedRequest(
        new MessageRequest({
          chatId: props.table.id,
          x: props.table.lastMessageX!,
          y: props.table.lastMessageY!,
        }),
      );
      return {
        ...lastMessage,
        sender: await resolveUser(lastMessage.senderId),
      };
    } else {
      return Promise.resolve(undefined);
    }
  });

  return (
    <div
      class="chat card container mt-lg-1 mt-2"
      role="button"
      style={{
        background: theme().colors.secondaryBackground,
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Link
          href={`/table?id=${props.table.id}`}
          class="text-decoration-none"
          style={{
            background: theme().colors.secondaryBackground,
            color: theme().colors.secondaryText,
          }}
        >
          <div class="card-body row p-2 media align-items-center">
            <div class="col-lg-1 p-1 m-n1">
              <img
                class="img-fluid rounded-circle"
                src={
                  props.table.avatar.link.startsWith('/')
                    ? apiLink + props.table.avatar.link
                    : props.table.avatar.link
                }
                onload={imgOnLoad}
              />
            </div>
            <div class="col-lg-7">
              <h5 class="card-title chat-name text-truncate w-100">{props.table.name}</h5>
              <div class="text-truncate">
                <span
                  class="text-secondary chat-sender"
                  style={{
                    'margin-right': '2px',
                  }}
                >
                  {lastMessage()?.sender.name}
                  {lastMessage() ? ':' : ''}
                </span>
                <span class="chat-text">{lastMessage()?.text}</span>
              </div>
            </div>
            <div class="col-lg align-self-end text-truncate">
              <small>
                {getString('size')}:
                <span class="chat-size">
                  {props.table.width}x{props.table.height}
                </span>
              </small>
            </div>
            <div class="col-lg-2 text-right align-self-start ">
              <div>
                <small class="chat-time">
                  {lastMessage() ? formatDateTime(lastMessage()!.created) : ''}
                </small>
              </div>
              <div class="badge badge-dark mt-2 chat-unread">54</div>
            </div>
          </div>
        </Link>
      </Suspense>
    </div>
  );
};

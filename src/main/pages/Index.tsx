import { useTheme } from '../../theme/Theme';
import { SimpleButton } from '../../common/SimpleButton';
import { useStrings } from '../../assets/localization/localization';
import { createResource, For } from 'solid-js';
import { TableResponse } from '../../util/request/CreateTableRequest';
import { ChatItem } from '../ChatItem';
import { getHttpClient } from '../../util/HttpClient';
import { UserInfoRequest } from '../../util/request/UserInfoRequest';

export const IndexPage = () => {
  const [theme] = useTheme();
  const [getString] = useStrings();

  return (
    <main>
      <div class="container w-75 h-100 my-w-lg-50">
        <div
          class="no-deletable card container mt-2"
          style={{
            'background-color': theme().colors.invertedBackground,
            color: theme().colors.invertedText,
          }}
        >
          <div class="card-body row p-2 align-items-center">
            <div class="ml-1 pl-0 col">{getString('my_chats')}</div>
            <div class="col text-right">
              <SimpleButton onClick={() => null}>
                <i class="fas fa-plus"></i>
              </SimpleButton>
            </div>
          </div>
        </div>
        <ChatContainer />
      </div>
    </main>
  );
};

const ChatContainer = () => {
  const [chatList] = createResource<TableResponse[]>(() =>
    getHttpClient()
      .proceedRequest(new UserInfoRequest({ includeChats: true }))
      .then(value => value.chats!)
      .catch(() => []),
  );
  return (
    <div class="chat-container scrolling-element overflow-auto">
      <For each={chatList()}>
        {item => {
          return <ChatItem table={item} />;
        }}
      </For>
    </div>
  );
};

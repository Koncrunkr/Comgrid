import { useTheme } from '../../theme/Theme';
import { SimpleButton } from '../../common/SimpleButton';
import { useStrings } from '../../assets/localization/localization';
import { createMemo, For } from 'solid-js';
import { ChatItem } from '../items/ChatItem';
import { useRouteData } from 'solid-app-router';
import { TableResponse } from '../../util/request/CreateTableRequest';
import { AlertItem, AlertType } from '../../common/AlertItem';
import { If } from '../../common/If';

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
  const chatList: () => TableResponse[] = useRouteData();
  const error = createMemo(() => {
    const error = chatList() as unknown as { code: number; errorText: string };
    if (error === undefined) return undefined;
    if (error.code !== undefined) {
      return error;
    } else {
      return undefined;
    }
  });
  return (
    <div class="chat-container scrolling-element overflow-auto">
      <If
        condition={!error()}
        onTrue={
          <For each={chatList()}>
            {item => {
              return <ChatItem table={item} />;
            }}
          </For>
        }
        onFalse={<AlertItem type={AlertType.Error} message={'You are wrong!'} />}
      />
    </div>
  );
};

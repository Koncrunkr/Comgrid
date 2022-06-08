import { useTheme } from '../../theme/Theme';
import { SimpleButton } from '../../common/SimpleButton';
import { useStrings } from '../../assets/localization/localization';
import { createMemo, For } from 'solid-js';
import { ChatItem } from '../items/ChatItem';
import { useRouteData } from 'solid-app-router';
import { TableResponse } from '../../util/request/CreateTableRequest';
import { AlertItem, AlertType } from '../../common/AlertItem';
import { If } from '../../common/If';
import { Header } from '../header/Header';
import { IndexPageInfo } from '../../App';

export const IndexPage = () => {
  const [theme] = useTheme();
  const [getString] = useStrings();

  return (
    <>
      <Header currentPage={IndexPageInfo} pages={[IndexPageInfo]} />
      <main>
        <div
          class="container h-100 my-w-lg-50"
          id="chat-container-div"
          style={{
            width: '75%',
            transition: 'all .5s',
          }}
        >
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
    </>
  );
};

const ChatContainer = () => {
  const [getString] = useStrings();
  const chatList: () => TableResponse[] = useRouteData();
  const error = createMemo(() => {
    const response = chatList() as any;
    if (!response) return undefined;
    const message = response.message;
    try {
      const error = JSON.parse(message) as { code: number; errorText: string };
      if (error === undefined) return undefined;
      if (error.code !== undefined) {
        return error;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  });
  return (
    <div
      id="chat-container"
      class="chat-container scrolling-element overflow-auto"
      style={{
        'max-height': '78vh',
      }}
    >
      <If
        condition={!error()}
        onTrue={
          <For each={chatList()}>
            {item => {
              return <ChatItem table={item} />;
            }}
          </For>
        }
        onFalse={
          <AlertItem
            type={AlertType.Error}
            message={() => {
              const err = error()!;
              if (err.code === 401) {
                return getString('sign_in_first')();
              }
              return getString('unknown_error')();
            }}
          />
        }
      />
    </div>
  );
};

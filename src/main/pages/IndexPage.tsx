import { useTheme } from '../../theme/Theme';
import { useStrings } from '../../assets/localization/localization';
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import { ChatItem } from '../items/ChatItem';
import { useRouteData } from 'solid-app-router';
import { TableResponse } from '../../util/request/CreateTableRequest';
import { AlertType, makeAlert } from '../../common/AlertItem';
import { Header } from '../header/Header';
import { IndexPageInfo } from '../../App';
import { CreateTableItem } from '../items/CreateTableItem';

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
            class="card container mt-2"
            style={{
              'background-color': theme().colors.invertedBackground,
              color: theme().colors.invertedText,
            }}
          >
            <div class="card-body row p-2 align-items-center">
              <div class="ml-1 pl-0 col">{getString('my_chats')}</div>
              <div class="col text-right">
                <button
                  class="btn"
                  data-toggle="modal"
                  data-target="#create_table_menu"
                  style={{
                    'background-color': theme().colors.button.background,
                    color: theme().colors.button.text,
                    'margin-left': '1rem',
                  }}
                >
                  <i class="fas fa-plus"></i>
                </button>
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
  const chatListData: () => TableResponse[] = useRouteData();
  const [chatList, setChatList] = createSignal<TableResponse[]>([]);
  const error = createMemo(() => {
    const response = chatListData() as any;
    if (!response) return undefined;
    const message = response.message;
    try {
      const error = JSON.parse(message) as { code: number; errorText: string };
      if (error === undefined) return undefined;
      if (error.code !== undefined) {
        makeAlert({
          type: AlertType.Error,
          message: () => {
            if (error.code === 401) {
              return getString('sign_in_first')();
            }
            return getString('unknown_error')();
          },
        });
        return error;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  });
  createEffect(() => {
    setChatList(chatListData());
  });
  return (
    <>
      <CreateTableItem chatList={chatList} setChatList={setChatList} />
      <div
        id="chat-container"
        class="chat-container scrolling-element overflow-auto"
        style={{
          'max-height': '78vh',
        }}
      >
        <Show when={!error()}>
          <For each={chatList()}>
            {item => {
              return <ChatItem table={item} />;
            }}
          </For>
        </Show>
      </div>
    </>
  );
};

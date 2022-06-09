import { useStrings } from '../../assets/localization/localization';
import { useTheme } from '../../theme/Theme';
import { createEffect, createMemo, createResource, createSignal, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { SimpleButton } from '../../common/SimpleButton';
import { useLocation } from 'solid-app-router';
import { MessageIn } from '../../util/websocket/MessageTopic';
import { formatDateTime, getParam, resolveUser } from '../../util/Util';
import { apiLink } from '../../util/Constants';
import { getHttpClient } from '../../util/HttpClient';
import { SearchMessagesRequest } from '../../util/request/SearchMessagesRequest';
import { AlertType, makeAlert } from '../../common/AlertItem';

export const SearchItem = () => {
  const [getString] = useStrings();
  const [theme] = useTheme();

  const [opened, setOpened] = createSignal();
  createEffect(() => {
    const currentPage = useLocation().pathname;
    console.log(currentPage);
    if (currentPage === '/table') {
      const tableContainer = document.getElementById('table-container')!;
      if (opened()) {
        tableContainer.style.marginLeft = 'calc(300px + 1vw)';
        tableContainer.style.width = 'calc(98vw - 300px)';
      } else {
        tableContainer.style.marginLeft = '1vw';
        tableContainer.style.width = '98vw';
      }
    } else if (currentPage !== '/') {
      setOpened(false);
    }
  });

  const [searchResults, setSearchResults] = createSignal<MessageIn[]>([]);
  const [searchString, setSearchString] = createSignal('');
  const [searchExact, setSearchExact] = createSignal(false);

  let searchDiv: HTMLDivElement;
  return (
    <>
      <Portal>
        <form id="search-messages-form">
          <div
            id="search-messages-sidenav"
            ref={ref => (searchDiv = ref)}
            style={{
              height: '100%' /* 100% Full-height */,
              width: opened()
                ? '300px'
                : '0px' /* 0 width - change this with JavaScript */,
              position: 'fixed' /* Stay in place */,
              'z-index': 1 /* Stay on top */,
              top: 0,
              left: 0,
              'background-color': theme().colors.background,
              color: theme().colors.text,
              'overflow-x': 'hidden' /* Disable horizontal scroll */,
              'padding-top': '60px' /* Place content 60px from the top */,
              transition: '0.5s',
            }}
          >
            <div
              class="modal-header"
              style={{
                'background-color': theme().colors.secondaryBackground,
                color: theme().colors.secondaryText,
              }}
            >
              <h5 class="modal-title">{getString('search_label')}</h5>
              <button
                id="close-search-button"
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                onclick={() => {
                  setOpened(false);
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    color: theme().colors.text,
                  }}
                >
                  &times;
                </span>
              </button>
            </div>
            <div class="modal-body container">
              <div class="form-row row">
                <div class="form-group col-md-12 col-12">
                  <label for="message-text-input">{getString('search_text')}</label>
                  <input
                    id="message-text-input"
                    type="text"
                    class="form-control"
                    placeholder={getString('search_text_placeholder')()}
                    style={{
                      'background-color': theme().colors.background,
                      color: theme().colors.text,
                    }}
                    oninput={({ target }) => {
                      console.log('Input');
                      console.log((target as HTMLInputElement).value);
                      setSearchString((target as HTMLInputElement).value ?? '');
                    }}
                    required
                  />
                </div>
              </div>
              <div class="form-group form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="exact-match-input"
                  style={{
                    'background-color': theme().colors.background,
                  }}
                  oninput={({ target }) => {
                    setSearchExact((target as HTMLInputElement).checked);
                    console.log('Input');
                  }}
                />
                <label class="form-check-label" for="exact-match-input" id="">
                  {getString('search_exact_match')}
                </label>
              </div>
            </div>
            <div class="modal-footer text-right p-1">
              <button
                type="reset"
                style={{
                  'background-color': theme().colors.button.background,
                  color: theme().colors.button.text,
                }}
                class="btn btn-dark mr-1"
                onclick={() => {
                  setSearchExact(false);
                  setSearchString('');
                }}
              >
                {getString('search_clear_button')}
              </button>
              <button
                type="button"
                class="btn mr-1"
                style={{
                  'background-color': theme().colors.button.background,
                  color: theme().colors.button.text,
                }}
                onclick={() => {
                  console.log('Clicked');
                  if (searchString() === '') {
                    makeAlert({
                      type: AlertType.Error,
                      message: getString('input_any_text'),
                    });
                    return;
                  }
                  getHttpClient()
                    .proceedRequest(
                      new SearchMessagesRequest({
                        text: searchString(),
                        chatId: parseInt(getParam('id')!),
                        exactMatch: searchExact(),
                        chunkNumber: 0,
                      }),
                    )
                    .then(messages => {
                      console.log('messages!');
                      setSearchResults(messages);
                    });
                }}
              >
                {getString('search_button')}
              </button>
            </div>
            <div class="search-message-container scrolling-element overflow-auto">
              <For each={searchResults()}>
                {message => <SearchResultItem message={message} />}
              </For>
            </div>
          </div>
        </form>
      </Portal>
      <SimpleButton
        onClick={() => {
          setOpened(!opened());
        }}
      >
        {getString('search')}
      </SimpleButton>
    </>
  );
};

export const SearchResultItem = (props: { message: MessageIn }) => {
  const [user] = createResource(() => resolveUser(props.message.senderId));
  const avatarLink = createMemo(() => {
    const link = user()?.avatar.link;
    if (link?.startsWith('/')) return apiLink + link;
    return link;
  });
  console.log('Message!');
  return (
    <div class="search-item card container bg-light mt-lg-1 mt-2" role="button">
      <a href="#" class="text-dark text-decoration-none">
        <div class="card-body p-2 align-items-center">
          <div class="row">
            <div class="col-lg-3 col-3 p-1 m-n1">
              <img
                class="img-fluid rounded-circle"
                referrerpolicy="no-referrer"
                src={avatarLink()}
              />
            </div>
            <div class="col-lg-9 col-9 align-middle">
              <h5 class="card-title message-sender text-truncate w-100">
                {user()?.name}
              </h5>
            </div>
          </div>
          <div class="col-lg-12 col-12">
            <div class="text-truncate">
              <small class="message-text">{props.message.text}</small>
            </div>
          </div>
          <div class="col-lg-12 text-right align-self-start ">
            <div>
              <small class="message-time" style="font-size: 60%">
                {formatDateTime(props.message.created)}
              </small>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

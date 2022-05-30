import { useTheme } from '../theme/Theme';
import { useStrings } from '../assets/localization/localization';

import { PageInfo, TablesPageInfo } from '../App';
import { Link } from 'solid-app-router';
import { SimpleButton } from '../common/SimpleButton';
import { Portal } from 'solid-js/web';
import { getState } from '../util/State';
import { JSX } from 'solid-js';

export const Header = (props: { currentPage: PageInfo; pages: PageInfo[] }) => {
  const [theme] = useTheme();
  return (
    <header>
      <nav
        class="navbar navbar-expand justify-content-between"
        style={{
          'background-color': theme().colors.secondaryBackground,
        }}
      >
        <div class="navbar-nav mx-2">
          <LogoItem />
          <HeaderPageItem page={TablesPageInfo} />
        </div>
        <div class="navbar-nav">
          <SearchItem />
        </div>
        <div class="navbar-nav">
          <ChangeThemeItem />
        </div>
        <div class="navbar-nav">
          <AuthorizationItem />
        </div>
      </nav>
    </header>
  );
};

export const LogoItem = () => {
  const [theme] = useTheme();
  return (
    <Link
      class="navbar-brand"
      href="#"
      style={{
        color: theme().colors.text,
      }}
    >
      <i
        class="fas fa-table"
        style={{
          'margin-right': '10px',
        }}
      ></i>
      Comgrid
    </Link>
  );
};

const HeaderPageItem = (props: { page: PageInfo }) => {
  const [getString] = useStrings();
  const [theme] = useTheme();
  return (
    <div class="navbar-elem ml-3">
      <Link
        id={'page-item-' + props.page.name}
        class="nav-link active"
        href={props.page.path}
        style={{ color: theme().colors.text }}
      >
        {getString(props.page.name)()}
      </Link>
    </div>
  );
};

export const SearchItem = () => {
  const [getString] = useStrings();

  return <SimpleButton onClick={() => null}>{getString('search')}</SimpleButton>;
};

export const ChangeThemeItem = () => {
  const [_, __, changeTheme] = useTheme();
  const [getString] = useStrings();
  return <SimpleButton onClick={changeTheme}>{getString('change_theme')}</SimpleButton>;
};

export const AuthorizationItem = () => {
  const [getString] = useStrings();
  const [theme] = useTheme();
  return (
    <>
      <div class="clickable navbar-elem mx-3" id="sign-in-div">
        <button
          class="btn"
          data-toggle="modal"
          data-target="#sign_in_menu"
          style={{
            'background-color': theme().colors.button.background,
            color: theme().colors.button.text,
          }}
        >
          {getString('sign_in')}
        </button>
      </div>
      <div
        class="clickable navbar-elem mx-3 d-none"
        onclick={() =>
          getState()
            .whenReady()
            .then(state => {
              state.revokeAuthorization();
              window.location.reload();
            })
        }
        style={{
          'background-color': theme().colors.button.background,
          color: theme().colors.button.text,
        }}
      >
        <a class="nav-link" id="sign-out" href="#">
          {getString('sign_out')}
        </a>
      </div>
      <ModalItem formId="sign_in">
        <div class="form-row row d-flex justify-content-center">
          <div class="form-group col-md-4 col-12">
            <button
              type="button"
              class="btn btn-light mr-1"
              onClick={() =>
                getState()
                  .whenReady()
                  .then(state => state.authorize(undefined, 'google'))
              }
            >
              <img
                width="32"
                height="32"
                style={{ 'margin-right': '5px' }}
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              />
              Sign in with Google
            </button>
          </div>
          <div class="form-group col-md-4 col-12">
            <button
              type="button"
              class="btn btn-light mr-1"
              onClick={() =>
                getState()
                  .whenReady()
                  .then(state => state.authorize(undefined, 'google'))
              }
            >
              <img
                width="32"
                height="32"
                style={{ 'margin-right': '5px' }}
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/VK.com-logo.svg"
              />
              Sign in with VK
            </button>
          </div>
        </div>
      </ModalItem>
    </>
  );
};

export const ModalItem = (props: { formId: string; children: JSX.Element }) => {
  const [theme] = useTheme();
  const [getString] = useStrings();
  return (
    <Portal>
      <form id={props.formId}>
        <div
          id={props.formId + '_menu'}
          class="modal"
          role="dialog"
          tabIndex="-1"
          data-keyboard="false"
        >
          <div class="modal-dialog modal-lg" role="document">
            <div
              class="modal-content border-0"
              style={{
                'background-color': theme().colors.secondaryBackground,
                color: theme().colors.secondaryText,
              }}
            >
              <div
                class="modal-header"
                style={{
                  'background-color': theme().colors.invertedBackground,
                  color: theme().colors.invertedText,
                }}
              >
                <h5 class="modal-title">{getString(props.formId + '_form')()}</h5>
                <button
                  id={'close-button-' + props.formId}
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true" class="text-light">
                    &times;
                  </span>
                </button>
              </div>
              <div class="modal-body container">{props.children}</div>
            </div>
          </div>
        </div>
      </form>
    </Portal>
  );
};

import { useStrings } from '../../assets/localization/localization';
import { useTheme } from '../../theme/Theme';
import { getState } from '../../util/State';
import { ModalItem } from '../../common/ModalItem';

export const AuthorizationItem = () => {
  const [getString] = useStrings();
  const [theme] = useTheme();
  return (
    <>
      <div class="clickable navbar-elem" id="sign-in-div">
        <button
          class="btn"
          data-toggle="modal"
          data-target="#sign_in_menu"
          style={{
            'background-color': theme().colors.button.background,
            color: theme().colors.button.text,
            'margin-left': '1rem',
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
                  .then(state => state.authorize(undefined, 'vk'))
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

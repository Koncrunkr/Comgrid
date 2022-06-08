import { useStrings } from '../../../assets/localization/localization';
import { createResource } from 'solid-js';
import { getHttpClient } from '../../../util/HttpClient';
import { GetLinkRequest } from '../../../util/request/GetLinkRequest';
import { getParam } from '../../../util/Util';
import { If } from '../../../common/If';
import { useTheme } from '../../../theme/Theme';

export const InvitationLinkItem = () => {
  const [getString] = useStrings();
  const [theme] = useTheme();
  const [code] = createResource(() => {
    return getHttpClient()
      .proceedRequest(
        new GetLinkRequest({
          chatId: parseInt(getParam('id')!),
        }),
        () => {},
      )
      .then(res => res.code)
      .catch(() => 'null');
  });
  return (
    <If
      condition={code() !== 'null'}
      onTrue={
        <div class="row">
          <div class="col-2">
            <b>{getString('invitation_link')}</b>
          </div>
          <div class="col-6">
            <span id="invitation-link-keeper">
              {window.location.protocol +
                '//' +
                window.location.host +
                '/invite?code=' +
                code()}
            </span>
          </div>
          <div class="col-4 text-right">
            <button
              type="button"
              id="invitation-create-button"
              class="btn"
              style={{
                'background-color': theme().colors.button.background,
                color: theme().colors.button.text,
              }}
            >
              {getString('create_invitation_link')}
            </button>
            <button
              type="button"
              id="invitation-disable-button"
              class="btn"
              style={{
                'background-color': theme().colors.button.background,
                color: theme().colors.button.text,
              }}
            >
              {getString('revoke_invitation_link')}
            </button>
          </div>
        </div>
      }
      onFalse={<></>}
    />
  );
};

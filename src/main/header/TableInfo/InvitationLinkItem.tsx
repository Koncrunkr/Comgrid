import { useStrings } from '../../../assets/localization/localization';
import { createEffect, createResource, createSignal } from 'solid-js';
import { getHttpClient } from '../../../util/HttpClient';
import { GetLinkRequest } from '../../../util/request/GetLinkRequest';
import { getParam } from '../../../util/Util';
import { If } from '../../../common/If';
import { useTheme } from '../../../theme/Theme';
import { DeleteLinkRequest } from '../../../util/request/DeleteLinkRequest';

export const InvitationLinkItem = () => {
  const chatId = parseInt(getParam('id')!);

  const [getString] = useStrings();
  const [theme] = useTheme();
  const [code] = createResource(() => {
    return getHttpClient()
      .proceedRequest(
        new GetLinkRequest({
          chatId: chatId,
          createIfNone: false,
        }),
        () => {},
      )
      .then(res => res.code)
      .catch(() => 'null');
  });

  const [link, setLink] = createSignal('');

  createEffect(() => {
    if (code() !== 'null')
      setLink(
        window.location.protocol + '//' + window.location.host + '/invite?code=' + code(),
      );
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
            <span id="invitation-link-keeper">{link()}</span>
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
              onclick={() => {
                getHttpClient()
                  .proceedRequest(
                    new GetLinkRequest({ chatId: chatId, createIfNone: true }),
                    (code, errorText) => {
                      alert('Error happened: ' + errorText);
                    },
                  )
                  .then(value => {
                    setLink(
                      window.location.protocol +
                        '//' +
                        window.location.host +
                        '/invite?code=' +
                        value.code,
                    );
                  });
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
              onclick={() => {
                getHttpClient()
                  .proceedRequest(new DeleteLinkRequest({ chatId: chatId }))
                  .then(() => {
                    setLink('');
                  });
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

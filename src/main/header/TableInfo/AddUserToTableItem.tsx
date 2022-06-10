import { useStrings } from '../../../assets/localization/localization';
import { useTheme } from '../../../theme/Theme';
import { createSignal } from 'solid-js';
import { getHttpClient } from '../../../util/HttpClient';
import { AddParticipantRequest } from '../../../util/request/AddParticipantRequest';
import { getParam } from '../../../util/Util';
import { AlertType, makeAlert } from '../../../common/AlertItem';

export const AddUserToTableItem = () => {
  const [getString] = useStrings();
  const [theme] = useTheme();

  const [id, setId] = createSignal('');
  return (
    <>
      <div class="form-row row mt-2">
        <div class="form-group col-md-6 col-12">
          <label for="id-input">{getString('user_id')}</label>
          <input
            style={{
              'background-color': theme().colors.background,
              color: theme().colors.text,
            }}
            id="id-input"
            type="text"
            class="form-control"
            placeholder="100000000000000000000"
            value={id()}
            onclick={({ target }) => {
              setId((target as HTMLInputElement).value);
            }}
            required
          />
        </div>
      </div>
      <div class="modal-footer text-right p-1">
        <button
          type="button"
          class="btn mr-1"
          style={{
            'background-color': theme().colors.button.background,
            color: theme().colors.button.text,
          }}
          onclick={() => {
            getHttpClient()
              .proceedRequest(
                new AddParticipantRequest({
                  chatId: parseInt(getParam('id')!),
                  userId: id(),
                }),
                (code, errorText) =>
                  makeAlert({ type: AlertType.Error, message: () => errorText }),
              )
              .then(code => {
                makeAlert({
                  type: AlertType.Success,
                  message: getString('table_participant_added'),
                });
              });
          }}
        >
          {getString('add_user_button')}
        </button>
      </div>
    </>
  );
};

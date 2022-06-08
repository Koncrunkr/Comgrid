import { useStrings } from '../../../assets/localization/localization';
import { useTheme } from '../../../theme/Theme';

export const AddUserToTableItem = () => {
  const [getString] = useStrings();
  const [theme] = useTheme();
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
            required
          />
        </div>
      </div>
      <div class="modal-footer text-right p-1">
        <button
          type="submit"
          class="btn mr-1"
          style={{
            'background-color': theme().colors.button.background,
            color: theme().colors.button.text,
          }}
        >
          {getString('add_user_button')}
        </button>
      </div>
    </>
  );
};

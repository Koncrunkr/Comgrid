import { createSignal } from 'solid-js';
import { useStrings } from '../../assets/localization/localization';
import { useTheme } from '../../theme/Theme';
import { ModalItem } from '../../common/ModalItem';
import { CreateTableRequest, TableResponse } from '../../util/request/CreateTableRequest';
import { getHttpClient } from '../../util/HttpClient';
import { AlertType, makeAlert } from '../../common/AlertItem';
import { closeModal } from '../../util/Util';

export const CreateTableItem = (props: {
  chatList: () => TableResponse[];
  setChatList: (tables: TableResponse[]) => unknown;
}) => {
  let [name, setName] = createSignal('');
  let [width, setWidth] = createSignal(50);
  let [height, setHeight] = createSignal(50);
  let [imageLink, setImageLink] = createSignal('');
  let [imageFile, setImageFile] = createSignal<File>();

  const [getString] = useStrings();
  const [theme] = useTheme();

  let modalRef: HTMLDivElement;

  return (
    <ModalItem modalRef={ref => (modalRef = ref)} formId="create_table">
      <div class="form-row row">
        <div class="form-group col-md-6 col-12">
          <label for="table-name-input">{getString('table_name_label')}</label>
          <input
            id="table-name-input"
            type="text"
            class="form-control"
            placeholder={getString('table_name_label')()}
            oninput={({ target }) => {
              setName((target as HTMLInputElement).value ?? '');
            }}
            value={name()}
            style={{
              'background-color': theme().colors.background,
              color: theme().colors.text,
              border: theme().colors.borderColor,
            }}
            required
          />
        </div>
        <div class="form-group col-md-3 col-6">
          <label for="table-width-input">{getString('table_width_label')}</label>
          <input
            id="table-width-input"
            type="number"
            class="form-control"
            placeholder="50"
            value={width()}
            oninput={({ target }) => {
              try {
                setWidth(parseInt((target as HTMLInputElement).value ?? '50'));
              } catch (e) {}
            }}
            style={{
              'background-color': theme().colors.background,
              color: theme().colors.text,
              border: theme().colors.borderColor,
            }}
            required
          />
        </div>
        <div class="form-group col-md-3 col-6">
          <label for="table-height-input">{getString('table_height_label')}</label>
          <input
            id="table-height-input"
            type="number"
            class="form-control"
            placeholder="100"
            value={height()}
            oninput={({ target }) => {
              try {
                setHeight(parseInt((target as HTMLInputElement).value ?? '50'));
              } catch (e) {}
            }}
            style={{
              'background-color': theme().colors.background,
              color: theme().colors.text,
              border: theme().colors.borderColor,
            }}
            required
          />
        </div>
        <div class="form-group col-md-6 col-6">
          <label for="table-image-link-input">{getString('table_link_label')}</label>
          <input
            id="table-image-link-input"
            type="text"
            class="form-control"
            placeholder="https://image.png"
            value={imageLink()}
            oninput={({ target }) => {
              if ((target as HTMLInputElement).value) {
                setImageLink((target as HTMLInputElement).value);
                setImageFile(undefined);
              }
            }}
            style={{
              'background-color': theme().colors.background,
              color: theme().colors.text,
              border: theme().colors.borderColor,
            }}
          />
        </div>
        <div class="form-group col-md-6 col-6">
          <label for="table-image-file-input">{getString('table_file_label')}</label>
          <br />
          <label for="table-image-file-input" class="">
            <a
              type="button"
              class="btn"
              style={{
                'background-color': theme().colors.button.background,
                color: theme().colors.button.text,
              }}
            >
              {getString('table_file_button')}
            </a>
          </label>
          <input
            id="table-image-file-input"
            type="file"
            class="d-none"
            oninput={({ target }) => {
              const input = target as HTMLInputElement;
              if (input) {
                const files = input.files;
                if (files) {
                  setImageFile(files[0]);
                  setImageLink('');
                }
              }
            }}
          />
        </div>
      </div>
      <div
        class="modal-footer text-right p-1"
        style={{
          'border-top': theme().colors.borderColor,
        }}
      >
        <button
          type="button"
          class="btn mr-1"
          style={{
            'background-color': theme().colors.button.background,
            color: theme().colors.button.text,
          }}
          onclick={() => {
            if (name().length === 0) {
              makeAlert({
                type: AlertType.Error,
                message: getString('table_name_empty'),
              });
              return;
            }

            if (height() * width() > 10000) {
              makeAlert({
                type: AlertType.Error,
                message: () => getString('table_size_too_high')() + height() * width(),
              });
              return;
            }

            if (height() <= 0 || width() <= 0) {
              makeAlert({
                type: AlertType.Error,
                message: getString('negative_size'),
              });
              return;
            }

            if (imageLink() === '' && imageFile() === undefined) {
              makeAlert({
                type: AlertType.Error,
                message: getString('table_image_empty'),
              });
              return;
            }

            getHttpClient()
              .proceedRequest(
                new CreateTableRequest({
                  name: name(),
                  width: width(),
                  height: height(),
                  avatarLink: imageLink(),
                  avatarFile: imageFile(),
                }),
                (code, errorText) =>
                  makeAlert({
                    type: AlertType.Error,
                    message: () => errorText,
                  }),
              )
              .then(newTable => {
                props.setChatList([newTable, ...props.chatList()]);
                makeAlert({
                  type: AlertType.Success,
                  message: () => 'Chat is created!',
                });
              });
            makeAlert({
              type: AlertType.Info,
              message: () => 'Chat is being created',
            });
            closeModal(modalRef);
            return false;
          }}
        >
          {getString('table_create_button')}
        </button>
        <button
          type="reset"
          class="btn mr-1"
          style={{
            'background-color': theme().colors.button.background,
            color: theme().colors.button.text,
          }}
        >
          {getString('table_reset_button')}
        </button>
      </div>
    </ModalItem>
  );
};

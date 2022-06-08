import { createSignal } from 'solid-js';
import { useStrings } from '../../assets/localization/localization';
import { useTheme } from '../../theme/Theme';
import { ModalItem } from '../../common/ModalItem';

export const CreateTableItem = () => {
  let [name, setName] = createSignal('');
  let [width, setWidth] = createSignal(50);
  let [height, setHeight] = createSignal(50);
  let [imageLink, setImageLink] = createSignal('');
  let [imageFile, setImageFile] = createSignal<File>();

  const [getString] = useStrings();
  const [theme] = useTheme();

  return (
    <ModalItem formId="create_table">
      <div class="form-row row">
        <div class="form-group col-md-6 col-12">
          <label for="table-name-input">{getString('table_name_label')}</label>
          <input
            id="table-name-input"
            type="text"
            class="form-control"
            placeholder={getString('table_name_label')()}
            oninput={({ target }) => {
              setName(target.textContent ?? '');
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
                setWidth(parseInt(target.textContent ?? '50'));
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
                setHeight(parseInt(target.textContent ?? '50'));
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
              setImageLink(target.textContent ?? '');
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
          type="submit"
          class="btn mr-1"
          style={{
            'background-color': theme().colors.button.background,
            color: theme().colors.button.text,
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

import { JSX } from 'solid-js';
import { useTheme } from '../theme/Theme';
import { useStrings } from '../assets/localization/localization';
import { Portal } from 'solid-js/web';

export const ModalItem = (props: {
  formId: string;
  modalRef?: (ref: HTMLDivElement) => unknown;
  children: JSX.Element;
}) => {
  const [theme] = useTheme();
  const [getString] = useStrings();
  return (
    <Portal>
      <form id={props.formId}>
        <div
          ref={props.modalRef}
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

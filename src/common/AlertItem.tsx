import { Portal } from 'solid-js/web';
import { createSignal } from 'solid-js';

export enum AlertType {
  Error = 'rgba(253,94,94,0.9)',
  Info = 'rgba(99, 94, 94, 0.9)',
  Success = 'rgba(56, 237, 43, 0.9)',
}

export const AlertItem = (props: { type: AlertType; message: string }) => {
  const [visible, setVisible] = createSignal(true);
  setTimeout(() => {
    setVisible(false);
  }, 3000);
  return (
    <Portal>
      <div
        style={{
          'background-color': props.type,
          color: 'black',
          width: '250px',
          height: 'fit-content',
          padding: '15px 20px',
          visibility: visible() ? 'visible' : 'hidden',
          transition: '1s',
          'border-radius': '25px',
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          'word-wrap': 'normal',
          'overflow-wrap': 'break-word',
        }}
      >
        {props.message}
      </div>
    </Portal>
  );
};

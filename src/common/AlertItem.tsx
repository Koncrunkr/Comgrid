import { Portal } from 'solid-js/web';
import { For, onMount, untrack } from 'solid-js';
import { createStore } from 'solid-js/store';

export enum AlertType {
  Error = 'rgba(253,94,94,0.9)',
  Info = 'rgba(99, 94, 94, 0.9)',
  Success = 'rgba(56, 237, 43, 0.9)',
}

const [alertItems, setAlertItems] = createStore<
  Array<{ type: AlertType; message: () => string }>
>([]);

export const makeAlert = (alert: { type: AlertType; message: () => string }) => {
  setAlertItems(prev => [...prev, alert]);
};

export const AlertItems = () => {
  let ref: HTMLDivElement;
  return (
    <Portal>
      <div
        style={{
          'flex-direction': 'column-reverse',
          transition: 'all .3s',
          position: 'fixed',
          bottom: '25px',
          right: '25px',
        }}
        ref={div => (ref = div)}
      >
        <For each={alertItems}>
          {item => {
            console.log('Is something wrong');
            let itemRef: HTMLDivElement;
            onMount(() => {
              setTimeout(() => {
                itemRef.style.height = 'fit-content';
                itemRef.style.opacity = '1';
                itemRef.style.marginTop = '10px';
                itemRef.style.padding = '15px 20px';
                setTimeout(() => {
                  itemRef.style.opacity = '0';
                  setTimeout(() => {
                    itemRef.remove();
                  }, 300);
                }, 3000);
              }, 300);
            });
            return untrack(() => {
              return (
                <>
                  <div
                    ref={ref => (itemRef = ref)}
                    style={{
                      'background-color': item.type,
                      color: 'black',
                      width: '250px',
                      height: '0',
                      opacity: 0,
                      'transition-property': 'all',
                      'transition-duration': '.3s',
                      'border-radius': '25px',
                      'word-wrap': 'normal',
                      'overflow-wrap': 'break-word',
                    }}
                  >
                    {item.message()}
                  </div>
                </>
              );
            });
          }}
        </For>
      </div>
    </Portal>
  );
};

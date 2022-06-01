import { createResource, Index } from 'solid-js';
import { getHttpClient } from '../../util/HttpClient';
import { TableInfoRequest } from '../../util/request/TableInfoRequest';
import { useSearchParams } from 'solid-app-router';
import { CellUnionsRequest } from '../../util/request/CellUnionsRequest';
import { TableMessagesRequest } from '../../util/request/TableMessagesRequest';
import { getState } from '../../util/State';
import { Table } from '../../table/Table';
import { resolveUser } from '../../util/Util';
import { HttpError } from '../../error/HttpError';
import { useTheme } from '../../theme/Theme';

export const TablePage = () => {
  const [searchParams] = useSearchParams();
  const [table] = createResource<Table>(async () => {
    let http = getHttpClient();
    const state = await getState().whenReady();
    if (!state.authorized) {
      throw new HttpError({ status: 403, errorText: 'Unauthorized' });
    }

    const table = await http.proceedRequest(
      new TableInfoRequest({
        chatId: parseInt(searchParams.id),
      }),
    );
    const unions = await http.proceedRequest(
      new CellUnionsRequest({
        chatId: parseInt(searchParams.id),
        xcoordLeftTop: 0,
        ycoordLeftTop: 0,
        xcoordRightBottom: table.width - 1,
        ycoordRightBottom: table.height - 1,
      }),
    );
    const messages = await http.proceedRequest(
      new TableMessagesRequest({
        chatId: parseInt(searchParams.id),
        xcoordLeftTop: 0,
        ycoordLeftTop: 0,
        xcoordRightBottom: table.width - 1,
        ycoordRightBottom: table.height - 1,
      }),
    );
    await Promise.all(messages.map(message => resolveUser(message.senderId)));
    await Promise.all(unions.map(union => resolveUser(union.creatorId)));

    return new Table(table, unions, messages);
  });

  const [theme] = useTheme();
  return (
    <>
      <main
        class="scrolling-element mt-3 mx-3 overflow-auto"
        style={{
          'max-height': '83vh',
          'flex-direction': 'column',
          width: '98vw',
          display: 'flex',
          flex: '1 0',
        }}
      >
        <Index each={table()?.cells}>
          {(column, x) => {
            return (
              <div
                style={{
                  width: 'fit-content',
                  display: 'flex',
                  'flex-direction': 'row',
                  'min-height': '32px',
                  'max-height': '32px',
                }}
              >
                <Index each={column()}>
                  {(cell, y) => {
                    return (
                      <div
                        style={{
                          'min-width': '32px',
                          'max-width': '32px',
                          'line-height': '28px', // 32 - 2(for borders) - 2
                          'border-color': 'rgba(10, 10, 10, 1)',
                          cursor: 'context-menu',
                          'background-color': 'inherit',
                          color: theme().colors.secondaryText,
                          ...cell().css(),
                        }}
                      >
                        <span
                          class="no-show-focus user-select-none"
                          style={{
                            'white-space': 'nowrap',
                            'z-index': (table()?.cells?.length ?? 0) - y,
                            'min-height': '100%',
                            'min-width': '100%',
                            'background-color': cell().sender()?.color ?? 'inherit',
                            width: 'fit-content',
                            position: 'relative',
                            height: '100%',
                            display: 'inline-block',
                          }}
                          oninput={({ target }) => {
                            console.log('Hello');
                          }}
                          contenteditable={true}
                        >
                          {cell().text()}
                        </span>
                      </div>
                    );
                  }}
                </Index>
              </div>
            );
          }}
        </Index>
      </main>
    </>
  );
};

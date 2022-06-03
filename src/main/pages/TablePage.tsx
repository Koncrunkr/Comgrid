import { createResource, Index } from 'solid-js';
import { useSearchParams } from 'solid-app-router';
import { Table } from '../../table/Table';
import { useTheme } from '../../theme/Theme';
import { cellHeight } from '../../util/Constants';
import { CellItem } from '../items/CellItem';

export const TablePage = () => {
  const [searchParams] = useSearchParams();
  const [table] = createResource<Table>(
    async () => await Table.load(parseInt(searchParams.id)),
  );

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
          {(column, y) => {
            return (
              <div
                style={{
                  width: 'fit-content',
                  display: 'flex',
                  'flex-direction': 'row',
                  'min-height': cellHeight + 'px',
                  'max-height': cellHeight + 'px',
                }}
              >
                <Index each={column()}>{(cell, x) => CellItem(cell, x, y, table)}</Index>
              </div>
            );
          }}
        </Index>
      </main>
    </>
  );
};

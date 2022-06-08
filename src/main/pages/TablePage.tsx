import { Index } from 'solid-js';
import { useRouteData } from 'solid-app-router';
import { Table } from '../../table/Table';
import { cellHeight } from '../../util/Constants';
import { CellItem } from '../items/CellItem';
import { Header } from '../header/Header';
import { IndexPageInfo, TablePageInfo } from '../../App';

export const TablePage = () => {
  const table: () => Table = useRouteData();

  return (
    <>
      <Header currentPage={TablePageInfo} pages={[IndexPageInfo]} />
      <main
        id="table-container"
        class="scrolling-element overflow-auto"
        style={{
          'max-height': '83vh',
          'flex-direction': 'column',
          margin: '1vw',
          width: '98vw',
          display: 'flex',
          transition: 'all .5s',
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

import { Cell } from '../../table/Cell';
import { createEffect, Resource } from 'solid-js';
import { Table } from '../../table/Table';
import { useTheme } from '../../theme/Theme';
import { cellHeight, cellWidth } from '../../util/Constants';
import { recoverCaretPosition } from '../../util/Util';

export const CellItem = (
  cell: () => Cell,
  x: number,
  y: number,
  table: Resource<Table | undefined>,
) => {
  const [theme] = useTheme();
  let previousValue: string = '';
  // @ts-ignore
  let span: HTMLSpanElement = undefined;
  createEffect(() => {
    const selection = document.getSelection()!;
    if (selection.rangeCount) {
      const offset = selection.getRangeAt(0).startOffset;
      // @ts-ignore
      span.textContent = cell().text();
      recoverCaretPosition(span, offset);
    } else {
      // @ts-ignore
      span.textContent = cell().text();
    }
  });
  return (
    <div
      id={x + ', ' + y}
      style={{
        'min-width': cellWidth + 'px',
        'max-width': cellWidth + 'px',
        'line-height': cellHeight - 2 - 2 + 'px', // 32 - 2(for borders) - 2
        'border-color': 'rgba(10, 10, 10, 1)',
        cursor: 'context-menu',
        'background-color': 'inherit',
        color: theme().colors.secondaryText,
        ...cell().css()(),
      }}
    >
      <span
        id={x + ', ' + y + ', span'}
        ref={span}
        class="no-show-focus user-select-none"
        style={{
          'white-space': 'nowrap',
          'z-index': (table()?.cells?.length ?? 0) - x,
          'min-height': '100%',
          'min-width': '100%',
          'background-color': cell().sender()?.color ?? 'inherit',
          width: 'fit-content',
          position: 'relative',
          height: '100%',
          display: 'inline-block',
        }}
        oninput={({ target }) => {
          const currentCaretPosition = document.getSelection()!.getRangeAt(0).startOffset;
          if (
            table()?.updateMessage(
              x,
              y,
              target.clientWidth,
              target.textContent ?? previousValue,
            )
          ) {
            previousValue = target.textContent ?? previousValue;
          } else {
            target.textContent = previousValue;
          }
          const span = target as HTMLSpanElement;

          // recover caret position
          recoverCaretPosition(span, currentCaretPosition);
        }}
        onkeydown={event => {
          if (event.code === 'ArrowUp') {
            document.getElementById(x + ', ' + (y - 1) + ', span')?.focus();
          } else if (event.code === 'ArrowDown' || event.code === 'Enter') {
            document.getElementById(x + ', ' + (y + 1) + ', span')?.focus();
          } else if (event.code === 'ArrowLeft') {
            const contiguousCell = table()?.getContiguousCellToLeft(x, y);
            document
              .getElementById(contiguousCell?.x + ', ' + contiguousCell?.y + ', span')
              ?.focus();
          } else if (event.code === 'ArrowRight') {
            const contiguousCell = table()?.getContiguousCellToRight(x, y);
            document
              .getElementById(contiguousCell?.x + ', ' + contiguousCell?.y + ', span')
              ?.focus();
          }
          return false;
        }}
        contenteditable={true}
      />
    </div>
  );
};

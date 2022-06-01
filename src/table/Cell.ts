import { createSignal } from 'solid-js';
import { User } from '../util/State';
import { Union } from './Union';
import { useTheme } from '../theme/Theme';
// @ts-ignore
import { CSSProperties } from 'solid-js/types/jsx';

export class Cell {
  public readonly setText: (message: string) => unknown;
  public readonly text: () => string | undefined;

  public readonly setSender: (User: User) => unknown;
  public readonly sender: () => User | undefined;

  public readonly css: () => CSSProperties | undefined;
  private readonly setCss: (css: CSSProperties) => unknown;

  private union: Union | undefined;

  constructor(readonly x: number, readonly y: number) {
    [this.text, this.setText] = createSignal();
    [this.sender, this.setSender] = createSignal();
    const [theme] = useTheme();
    [this.css, this.setCss] = createSignal<CSSProperties>({
      'border-left': theme().colors.borderColor,
      'border-right': theme().colors.borderColor,
      'border-bottom': theme().colors.borderColor,
      'border-top': theme().colors.borderColor,
    });
  }

  setMessage(text: string, sender: User) {
    this.setText(text);
    this.setSender(sender);
  }

  makeUnion(union: Union) {
    let left = true;
    let right = true;
    let top = true;
    let bottom = true;
    for (let cell of union.iterateOverCells()) {
      if (cell.x === this.x + 1 && cell.y === this.y) {
        right = false;
      } else if (cell.x === this.x - 1 && cell.y === this.y) {
        left = false;
      } else if (cell.x === this.x && cell.y === this.y + 1) {
        bottom = false;
      } else if (cell.x === this.x && cell.y === this.y - 1) {
        top = false;
      }
    }
    const [theme] = useTheme();
    this.setCss({
      ...(left && {
        'border-left': theme().colors.borderColor,
      }),
      ...(right && {
        'border-right': theme().colors.borderColor,
      }),
      ...(top && {
        'border-top': theme().colors.borderColor,
      }),
      ...(bottom && {
        'border-bottom': theme().colors.borderColor,
      }),
    });
    this.union = union;
  }
}

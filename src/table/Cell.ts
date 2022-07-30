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

  public readonly css: () => () => CSSProperties;
  private readonly setCss: (css: () => () => CSSProperties) => unknown;

  constructor(readonly x: number, readonly y: number) {
    [this.text, this.setText] = createSignal();
    [this.sender, this.setSender] = createSignal();
    const [theme] = useTheme();
    [this.css, this.setCss] = createSignal(() => ({
      'border-left': theme().colors.borderColor,
      'border-right': theme().colors.borderColor,
      'border-bottom': theme().colors.borderColor,
      'border-top': theme().colors.borderColor,
    }));
  }

  setMessage(text: string, sender: User) {
    this.setText(text);
    this.setSender(sender);
  }

  /**
   *
   * @param union
   * @param bottom if bottom border should be shown
   * @param top if top border should be shown
   * @param left if left border should be shown
   * @param right if right border should be shown
   */
  makeUnion(
    union: Union,
    {
      bottom,
      top,
      left,
      right,
    }: { bottom: boolean; top: boolean; left: boolean; right: boolean },
  ) {
    const [theme] = useTheme();
    this.setCss(() => () => ({
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
    }));
  }
}

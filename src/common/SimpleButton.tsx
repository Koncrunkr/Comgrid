import { JSXElement } from 'solid-js';
import { useTheme } from '../theme/Theme';

export const SimpleButton = (props: {
  onClick: () => unknown;
  children?: JSXElement;
}) => {
  const [theme] = useTheme();
  return (
    <button
      type="button"
      class="btn"
      onclick={() => props.onClick()}
      style={{
        background: theme().colors.button.background,
        color: theme().colors.button.text,
      }}
    >
      {props.children}
    </button>
  );
};

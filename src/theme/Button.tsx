import { JSX } from 'solid-js/jsx-runtime';

export const PrimaryButton = (props: {
  onClick: () => unknown;
  children: JSX.Element;
}) => {
  return (
    <button type="button" class="btn" onclick={props.onClick}>
      {props.children}
    </button>
  );
};

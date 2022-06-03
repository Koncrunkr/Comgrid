import { JSXElement } from 'solid-js';

export const If = (props: {
  condition: boolean;
  onTrue: JSXElement;
  onFalse: JSXElement;
}) => {
  return <>{props.condition ? props.onTrue : props.onFalse}</>;
};

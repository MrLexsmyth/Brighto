// types/lordicon.d.ts
export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        trigger?: string;
        delay?: string;
        colors?: string;
        stroke?: string;
        state?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

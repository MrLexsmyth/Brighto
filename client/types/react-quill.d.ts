declare module "react-quill" {
  import * as React from "react";

  export interface ReactQuillProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    theme?: string;
    readOnly?: boolean;
  }

  const ReactQuill: React.FC<ReactQuillProps>;
  export default ReactQuill;
}

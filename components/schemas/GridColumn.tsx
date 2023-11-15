import { nanoid } from "nanoid";

export const schema = {
  id: nanoid(),
  type: "GridColumn",
  props: {
    span: 6,
    bg: "white",
    style: {
      height: "auto",
      minHeight: "50px",
      border: "2px dotted #ddd",
    },
  },
};

import { nanoid } from "nanoid";

export const schema = {
  id: nanoid(),
  type: "Grid",
  props: {
    gutter: "md",
    bg: "white",
    m: 0,
    p: "xs",
    style: {
      width: "100%",
      height: "auto",
      minHeight: "50px",
      border: "2px dotted #ddd",
    },
  },
  children: [
    {
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
    },
    {
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
    },
  ],
};

import { GRID_SIZE } from "@/utils/config";
import { nanoid } from "nanoid";

export const schema = {
  id: nanoid(),
  type: "Grid",
  props: {
    bg: "white",
    m: 0,
    p: 0,
    gridSize: GRID_SIZE,
    style: {
      width: "100%",
      height: "auto",
      minHeight: "50px",
    },
  },
  children: [
    {
      id: nanoid(),
      type: "GridColumn",
      props: {
        span: GRID_SIZE / 2,
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
        span: GRID_SIZE / 2,
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

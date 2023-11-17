import { GRID_SIZE } from "@/utils/config";
import { nanoid } from "nanoid";

export const schema = {
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
};

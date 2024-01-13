import { nanoid } from "nanoid";

export const schema = {
  id: nanoid(),
  type: "Button",
  props: {
    children: "New Button",
    gridX: 2,
    gridY: 4,
  },
};

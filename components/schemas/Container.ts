import { nanoid } from "nanoid";

export const schema = {
  id: nanoid(),
  type: "Container",
  props: {
    h: "100px",
    w: "100%",
    miw: "100px",
    bg: "white",
    style: {
      border: "1px solid gray",
    },
  },
};

import crawl from "tree-crawl";
import { Component } from "@/utils/editor";

export const calculateGridSizes = (tree: Component) => {
  crawl(
    tree,
    (node, context) => {
      if (node.type === "Grid") {
        const parent = context.parent as Component;
        if (parent.type === "GridColumn") {
          node.props!.gridSize = Math.floor(
            parent.props!.span / ((parent.children ?? []).length ?? 1)
          );
        }
      } else if (node.type === "GridColumn") {
        const parent = context.parent as Component;
        if (parent.type === "Grid") {
          node.props!.span = Math.floor(
            parent.props!.gridSize / ((parent.children ?? []).length ?? 1)
          );
        }
      }
    },
    { order: "pre" }
  );

  // TODO: Do this in a single pass
  crawl(
    tree,
    (node) => {
      if (node.type === "Grid") {
        const sum = (node.children ?? []).reduce((acc, child) => {
          return acc + (child.props?.span ?? 0);
        }, 0);

        if (sum < node.props?.gridSize) {
          const firstColumn = node.children?.find((child) => {
            return child.type === "GridColumn";
          })!;

          if (firstColumn) {
            firstColumn.props!.span =
              firstColumn.props!.span + node.props?.gridSize - sum;
          }
        }
      }
    },
    { order: "pre" }
  );
};

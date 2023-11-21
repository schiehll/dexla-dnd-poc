import { nanoid } from "nanoid";
import crawl from "tree-crawl";
import cloneDeep from "lodash.clonedeep";
import { GRID_SIZE } from "./config";

export type Component = {
  id?: string;
  type: string;
  blockDroppingChildrenInside?: boolean;
  children?: Component[];
  props?: { [key: string]: any };
};

export type Edge = "left" | "right" | "top" | "bottom" | "center";

export type DropTarget = {
  id: string;
  edge: Edge;
};

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );

  return newArray;
}

export const replaceIdsDeeply = (treeRoot: Component) => {
  crawl(
    treeRoot,
    (node) => {
      const newId = nanoid();
      node.id = newId;
    },
    { order: "bfs" }
  );
};

export const addComponent = (
  treeRoot: Component,
  componentToAdd: Component,
  dropTarget: DropTarget,
  dropIndex?: number
): string => {
  const copy = cloneDeep(componentToAdd);
  replaceIdsDeeply(copy);

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === dropTarget.id) {
        node.children = node.children ?? [];

        const parent = context.parent as Component;

        const size = GRID_SIZE;
        // @ts-ignore
        const parentSpan = parent.props.gridSize ?? size;
        const childSpan = GRID_SIZE / ((parent.children ?? []).length + 1);
        // calculate new size which should be proportional to the parentSpan, for example:
        // if the parent span is 6 and the grid size is 12, the new size should be porportional to 6/12
        const newSize = parentSpan;
        const newSpan =
          parentSpan === size ? childSpan : (childSpan * newSize) / size;

        // if dropTarget.edge is left or right add a new GridColumn and add the component to it
        // if dropTarget.edge is top or bottom add a new Grid with a GridColumn child and add the component to it
        // if dropTarget.edge is center add the component to the parent
        if (dropTarget.edge === "left") {
          const grid = {
            id: nanoid(),
            type: "GridColumn",
            props: {
              span: newSpan,
              bg: "white",
              style: {
                height: "auto",
                minHeight: "50px",
                border: "2px dotted #ddd",
              },
            },
            children: [copy],
          } as Component;

          parent.children?.splice(
            dropIndex ?? context.index - 1 < 0 ? 0 : context.index - 1,
            0,
            grid
          );

          parent.children?.forEach((child) => {
            if (child.type === "GridColumn") {
              child.props.span = newSpan;
            }
          });
        } else if (dropTarget.edge === "right") {
          const grid = {
            id: nanoid(),
            type: "GridColumn",
            props: {
              span: newSpan,
              bg: "white",
              style: {
                height: "auto",
                minHeight: "50px",
                border: "2px dotted #ddd",
              },
            },
            children: [copy],
          } as Component;

          parent.children?.splice(dropIndex ?? context.index + 1, 0, grid);

          parent.children?.forEach((child) => {
            if (child.type === "GridColumn") {
              child.props.span = newSpan;
            }
          });
        } else if (dropTarget.edge === "top") {
          const grid = {
            id: nanoid(),
            type: "Grid",
            props: {
              bg: "white",
              m: 0,
              p: 0,
              gridSize: parentSpan,
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
                  span: parentSpan,
                  bg: "white",
                  style: {
                    height: "auto",
                    minHeight: "50px",
                    border: "2px dotted #ddd",
                  },
                },
                children: [copy],
              },
            ],
          } as Component;

          let target = parent;
          if (node.type === "GridColumn") {
            target = getComponentParent(treeRoot, parent.id);
            dropIndex = getComponentIndex(target, parent.id);
            dropIndex = dropIndex === -1 ? 0 : dropIndex;
          }

          target.children?.splice(
            dropIndex ?? context.index - 1 < 0 ? 0 : context.index - 1,
            0,
            grid
          );

          target.children?.forEach((child) => {
            if (child.type === "GridColumn") {
              child.props.span = newSpan;
            }
          });
        } else if (dropTarget.edge === "bottom") {
          const grid = {
            id: nanoid(),
            type: "Grid",
            props: {
              bg: "white",
              m: 0,
              p: 0,
              gridSize: parentSpan,
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
                  span: parentSpan,
                  bg: "white",
                  style: {
                    height: "auto",
                    minHeight: "50px",
                    border: "2px dotted #ddd",
                  },
                },
                children: [copy],
              },
            ],
          } as Component;

          let target = parent;
          if (node.type === "GridColumn") {
            target = getComponentParent(treeRoot, parent.id);
            dropIndex = getComponentIndex(target, parent.id) + 1;
          }

          target.children?.splice(dropIndex ?? context.index + 1, 0, grid);

          target.children?.forEach((child) => {
            if (child.type === "GridColumn") {
              child.props.span = newSpan;
            }
          });
        } else if (dropTarget.edge === "center") {
          node.children = [...(node.children || []), copy];
        }

        /* if (dropTarget.edge === "left" || dropTarget.edge === "top") {
          const index = dropIndex ?? context.index - 1;
          node.children.splice(index, 0, copy);
        } else if (["right", "bottom"].includes(dropTarget.edge)) {
          const index = dropIndex ?? context.index + 1;
          node.children.splice(index, 0, copy);
        } else if (dropTarget.edge === "center") {
          node.children = [...(node.children || []), copy];
        } */

        context.break();
      }
    },
    { order: "bfs" }
  );

  return copy.id as string;
};

export const getComponentParent = (
  treeRoot: Component,
  id: string
): Component | null => {
  let parent: Component | null = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        parent = context.parent;
        context.break();
      }
    },
    { order: "bfs" }
  );

  return parent;
};

export const getComponentNextSibiling = (
  treeRoot: Component,
  id: string
): Component | null => {
  let sibiling: Component | null = null;
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        sibiling = context.parent?.children?.[context.index + 1] as Component;
        context.break();
      }
    },
    { order: "bfs" }
  );

  return sibiling;
};

export const getComponentById = (
  treeRoot: Component,
  id: string
): Component | null => {
  let found: Component | null = null;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        found = node as Component;
        context.break();
      }
    },
    { order: "bfs" }
  );

  return found;
};

export const getComponentIndex = (parent: Component, id: string) => {
  return (
    parent.children?.findIndex((child: Component) => child.id === id) ?? -1
  );
};

export const moveComponent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget
) => {
  console.log("move component");
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        const parent = context.parent;
        const items = (parent?.children?.map((c) => c.id) ?? []) as string[];
        const oldIndex = items.indexOf(id);
        let newIndex = items.indexOf(dropTarget.id);

        if (["top", "left"].includes(dropTarget.edge) && oldIndex < newIndex) {
          newIndex = Math.max(newIndex - 1, 0);
        } else if (
          ["right", "bottom", "center"].includes(dropTarget.edge) &&
          newIndex < oldIndex
        ) {
          newIndex = Math.min(newIndex + 1, items.length);
        }

        if (oldIndex !== newIndex) {
          const newPositions = arrayMove(items, oldIndex, newIndex);
          parent!.children = parent?.children?.sort((a, b) => {
            const aIndex = newPositions.indexOf(a.id as string);
            const bIndex = newPositions.indexOf(b.id as string);
            return aIndex - bIndex;
          });
        }

        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const moveComponentToDifferentParent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget,
  newParentId: string
) => {
  console.log("move component to different parent");
  const _componentToAdd = getComponentById(treeRoot, id) as Component;
  const componentToAdd = cloneDeep(_componentToAdd);

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === newParentId) {
        if (dropTarget.edge === "left" || dropTarget.edge === "top") {
          const dropIndex = node.children?.findIndex(
            (c) => c.id === dropTarget.id
          );
          node.children?.splice(Math.max(dropIndex || 0, 0), 0, componentToAdd);
        } else if (
          dropTarget.edge === "right" ||
          dropTarget.edge === "bottom" ||
          dropTarget.edge === "center"
        ) {
          if (!node.children) {
            node.children = [];
          }

          const dropIndex = node.children.findIndex(
            (c) => c.id === dropTarget.id
          );
          node.children.splice(
            Math.min((dropIndex || 0) + 1, node.children.length),
            0,
            componentToAdd
          );
        }

        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const removeComponentFromParent = (
  treeRoot: Component,
  id: string,
  parentId: string
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id && context.parent?.id === parentId) {
        context.parent?.children?.splice(context.index, 1);
        context.remove();
        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const removeComponent = (treeRoot: Component, id: string) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        context.parent?.children?.splice(context.index, 1);
        context.remove();
        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const updateTreeComponentChildren = (
  treeRoot: Component,
  id: string,
  children: Component[]
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        node.children = children;
        context.break();
      }
    },
    { order: "bfs" }
  );
};

export const updateTreeComponentProps = (
  treeRoot: Component,
  id: string,
  props: { [key: string]: any }
) => {
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        node.props = {
          ...node.props,
          ...props,
        };
        context.break();
      }
    },
    { order: "bfs" }
  );
};

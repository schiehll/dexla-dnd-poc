import { nanoid } from "nanoid";
import crawl from "tree-crawl";
import cloneDeep from "lodash.clonedeep";
import { GRID_SIZE } from "./config";
import { calculateGridSizes } from "./grid";

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

const addNodeToTarget = (
  treeRoot: Component,
  targetNode: Component,
  copy: Component,
  context: crawl.Context<Component>,
  dropTarget: DropTarget,
  isMoving?: boolean,
  forceTarget?: boolean,
  dropIndex?: number
) => {
  const parent = context.parent as Component;
  const isAddingToXAxis =
    dropTarget.edge === "left" || dropTarget.edge === "right";
  const isAddingToYAxis =
    dropTarget.edge === "top" || dropTarget.edge === "bottom";
  let target =
    isAddingToXAxis || isAddingToYAxis
      ? forceTarget
        ? targetNode
        : parent
      : targetNode;

  if (dropTarget.edge === "center") {
    targetNode.children = [...(targetNode.children || []), copy];
    return;
  }

  if (dropTarget.edge === "top") {
    if (targetNode.type === "GridColumn" && !forceTarget) {
      target = getComponentParent(treeRoot, parent.id!)!;
      dropIndex = getComponentIndex(target, parent.id!);
    }

    if (isMoving) {
      const dropTargetParent = getComponentParent(treeRoot, dropTarget.id!);
      const items = (target?.children?.map((c) => c.id) ?? []) as string[];
      const oldIndex = items.indexOf(copy.id!);
      let newIndex = items.indexOf(dropTargetParent?.id!);

      if (newIndex > oldIndex) {
        newIndex = Math.max(newIndex - 1, 0);
      }

      if (oldIndex !== newIndex) {
        const newPositions = arrayMove(items, oldIndex, newIndex);
        target!.children = parent?.children?.sort((a, b) => {
          const aIndex = newPositions.indexOf(a.id as string);
          const bIndex = newPositions.indexOf(b.id as string);
          return aIndex - bIndex;
        });
      }
    } else {
      let i = dropIndex;
      if (typeof dropIndex === "undefined") {
        i = context.index;
      }

      // @ts-ignore
      target.children?.splice(i, 0, copy);
    }

    return;
  }

  if (dropTarget.edge === "bottom") {
    if (targetNode.type === "GridColumn" && !forceTarget) {
      target = getComponentParent(treeRoot, parent.id!)!;
      dropIndex = getComponentIndex(target, parent.id!) + 1;
    }

    if (isMoving) {
      const dropTargetParent = getComponentParent(treeRoot, dropTarget.id!);
      const items = (target?.children?.map((c) => c.id) ?? []) as string[];
      const oldIndex = items.indexOf(copy.id!);
      let newIndex = items.indexOf(dropTargetParent?.id!);

      if (newIndex < oldIndex) {
        newIndex = Math.min(newIndex + 1, items.length);
      }

      if (oldIndex !== newIndex) {
        const newPositions = arrayMove(items, oldIndex, newIndex);
        target!.children = parent?.children?.sort((a, b) => {
          const aIndex = newPositions.indexOf(a.id as string);
          const bIndex = newPositions.indexOf(b.id as string);
          return aIndex - bIndex;
        });
      }
    } else {
      let i = dropIndex;
      if (typeof dropIndex === "undefined") {
        i = context.index + 1;
      }

      target.children?.splice(i!, 0, copy);
    }

    return;
  }

  const gridColumn = {
    id: nanoid(),
    type: "GridColumn",
    props: {
      span: GRID_SIZE,
      bg: "white",
      style: {
        height: "auto",
        minHeight: "50px",
        border: "2px dotted #ddd",
      },
    },
    children: [copy],
  } as Component;

  if (dropTarget.edge === "left") {
    let i = dropIndex;
    if (typeof dropIndex === "undefined") {
      i = context.index - 1 < 0 ? 0 : context.index;
    }
    // @ts-ignore
    target.children?.splice(i, 0, gridColumn);
  } else if (dropTarget.edge === "right") {
    let i = dropIndex;
    if (typeof dropIndex === "undefined") {
      i = context.index + 1;
    }
    // @ts-ignore
    target.children?.splice(i, 0, gridColumn);
  }
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
        addNodeToTarget(
          treeRoot,
          node,
          copy,
          context,
          dropTarget,
          false,
          false,
          dropIndex
        );
        context.break();
      }
    },
    { order: "bfs" }
  );

  calculateGridSizes(treeRoot);

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
  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        const isGrid = node.type === "Grid";
        if (isGrid) {
          addNodeToTarget(
            treeRoot,
            context.parent!,
            node,
            context,
            dropTarget,
            true,
            true
          );
        } else {
          const parent = context.parent;
          const items = (parent?.children?.map((c) => c.id) ?? []) as string[];
          const oldIndex = items.indexOf(id);
          let newIndex = items.indexOf(dropTarget.id);

          if (
            ["top", "left"].includes(dropTarget.edge) &&
            oldIndex < newIndex
          ) {
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
        }

        context.break();
      }
    },
    { order: "bfs" }
  );

  calculateGridSizes(treeRoot);
};

export const moveComponentToDifferentParent = (
  treeRoot: Component,
  id: string,
  dropTarget: DropTarget,
  newParentId: string
) => {
  const componentToAdd = getComponentById(treeRoot, id) as Component;
  const isGrid = componentToAdd.type === "Grid";

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === newParentId) {
        if (isGrid) {
          const isHorizontalAxis =
            dropTarget.edge === "right" || dropTarget.edge === "left";
          const dropIndex = node.children?.findIndex(
            (c) => c.id === dropTarget.id
          ) as number;

          addNodeToTarget(
            treeRoot,
            node,
            componentToAdd,
            context,
            dropTarget,
            false,
            isHorizontalAxis,
            isHorizontalAxis
              ? dropTarget.edge === "right"
                ? dropIndex + 1
                : dropIndex
              : undefined
          );
        } else {
          if (dropTarget.edge === "left" || dropTarget.edge === "top") {
            const dropIndex = node.children?.findIndex(
              (c) => c.id === dropTarget.id
            );
            node.children?.splice(
              Math.max(dropIndex || 0, 0),
              0,
              componentToAdd
            );
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
        }

        context.break();
      }
    },
    { order: "bfs" }
  );

  calculateGridSizes(treeRoot);
};

export const removeComponentFromParent = (
  treeRoot: Component,
  id: string,
  parentId: string
) => {
  let shouldRecalculate = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id && context.parent?.id === parentId) {
        context.parent?.children?.splice(context.index, 1);
        shouldRecalculate = node.type === "GridColumn" || node.type === "Grid";
        context.remove();
        context.break();
      }
    },
    { order: "bfs" }
  );

  if (shouldRecalculate) {
    calculateGridSizes(treeRoot);
  }
};

export const removeComponent = (treeRoot: Component, id: string) => {
  let shouldRecalculate = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === id) {
        context.parent?.children?.splice(context.index, 1);
        shouldRecalculate = node.type === "GridColumn" || node.type === "Grid";
        context.remove();
        context.break();
      }
    },
    { order: "bfs" }
  );

  if (shouldRecalculate) {
    calculateGridSizes(treeRoot);
  }
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

export const checkIfIsChild = (treeRoot: Component, childId: string) => {
  let isChild = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === childId) {
        isChild = true;
        context.break();
      }
    },
    { order: "bfs" }
  );

  return isChild;
};

export const checkIfIsChildDeep = (
  treeRoot: Component,
  childId: string
): boolean => {
  let isChild = checkIfIsChild(treeRoot, childId);

  if (!isChild && (treeRoot.children ?? [])?.length > 0) {
    const length = (treeRoot.children ?? []).length;
    for (let i = 0; i < length; i++) {
      if (isChild) {
        break;
      }
      // @ts-ignore
      isChild = checkIfIsChildDeep(treeRoot.children[i], childId);
    }
  }

  return isChild;
};

export const checkIfIsDirectAncestor = (
  treeRoot: Component,
  childId: string,
  possibleAncestorId: string
) => {
  let possibleAncestorDepth = null;
  let childDepth = 0;
  let isDirectChild = false;

  crawl(
    treeRoot,
    (node, context) => {
      if (node.id === possibleAncestorId) {
        possibleAncestorDepth = context.depth;
        isDirectChild = checkIfIsChildDeep(node, childId);
      } else if (node.id === childId) {
        childDepth = context.depth;
        context.break();
      }
    },
    { order: "pre" }
  );

  return (
    possibleAncestorDepth && possibleAncestorDepth < childDepth && isDirectChild
  );
};

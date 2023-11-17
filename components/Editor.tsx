import {
  Component,
  getComponentById,
  getComponentParent,
  removeComponent,
  updateTreeComponentChildren,
} from "@/utils/editor";
import { Droppable } from "./Droppable";
import { Paper } from "@mantine/core";
import { componentMapper } from "@/utils/componentMapper";
import { useEditorStore } from "@/stores/editor";
import { DroppableDraggable } from "./DroppableDraggable";
import { useHotkeys } from "@mantine/hooks";
import cloneDeep from "lodash.clonedeep";
import { useCallback } from "react";
import { GRID_SIZE } from "@/utils/config";
import { Grid } from "./mapper/Grid";

export const Editor = () => {
  const tree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const selectedComponentId = useEditorStore((state) => state.selectedId);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);

  const deleteComponent = useCallback(() => {
    if (selectedComponentId) {
      const copy = cloneDeep(tree);

      const comp = getComponentById(copy, selectedComponentId);
      const parent = getComponentParent(copy, selectedComponentId);
      removeComponent(copy, selectedComponentId);

      if (comp?.type === "GridColumn") {
        const childs = (parent?.children ?? [])?.map((child) => {
          return {
            ...child,
            props: {
              ...child.props,
              span: Math.floor(GRID_SIZE / (parent?.children?.length ?? 1)),
            },
          };
        });
        updateTreeComponentChildren(copy, parent?.id!, childs);
      }

      setEditorTree(copy);
      setSelectedId(undefined);
    }
  }, [tree, selectedComponentId, setEditorTree, setSelectedId]);

  useHotkeys([
    ["backspace", deleteComponent],
    ["delete", deleteComponent],
  ]);

  const renderTree = (component: Component) => {
    if (component.id === "root") {
      return (
        <Droppable id={component.id} m={0} p={2}>
          <Paper shadow="xs" bg="gray.0" display="flex" mih="200px">
            {component.children?.map((child) => renderTree(child))}
          </Paper>
        </Droppable>
      );
    }

    const componentToRender = componentMapper[component.type];

    if (!componentToRender) {
      return (
        <DroppableDraggable
          key={component.id}
          id={component.id!}
          component={component}
        >
          {component.children?.map((child) => renderTree(child))}
        </DroppableDraggable>
      );
    }

    return (
      <DroppableDraggable
        key={component.id}
        id={component.id!}
        component={component}
      >
        {componentToRender?.Component({ component, renderTree })}
      </DroppableDraggable>
    );
  };

  return <>{renderTree(tree)}</>;
};

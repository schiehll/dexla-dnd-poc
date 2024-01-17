import {
  Component,
  getComponentById,
  getComponentParent,
  removeComponent,
} from "@/utils/editor";
import { Droppable } from "@/components/Droppable";
import { DroppableDraggable } from "@/components/DroppableDraggable";
import { Box, Paper } from "@mantine/core";
import { componentMapper } from "@/utils/componentMapper";
import { GRID_SIZE_X, GRID_SIZE_Y, useEditorStore } from "@/stores/editor";
import { useHotkeys } from "@mantine/hooks";
import cloneDeep from "lodash.clonedeep";
import { useCallback } from "react";

export const Editor = () => {
  const tree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const selectedComponentId = useEditorStore((state) => state.selectedId);
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const previewPosition = useEditorStore((state) => state.previewPosition);
  const componentToAdd = useEditorStore((state) => state.componentToAdd);

  const deleteComponent = useCallback(() => {
    if (selectedComponentId) {
      const copy = cloneDeep(tree);

      const comp = getComponentById(copy, selectedComponentId);
      const parent = getComponentParent(copy, selectedComponentId);
      const grantParent = getComponentParent(copy, parent!.id!);

      if (
        comp?.type === "GridColumn" &&
        parent?.type === "Grid" &&
        parent.children?.length === 1 &&
        grantParent?.id === "root"
      ) {
        return;
      }

      removeComponent(copy, selectedComponentId);

      if (
        comp?.type === "GridColumn" &&
        parent?.type === "Grid" &&
        parent.children?.length === 0
      ) {
        removeComponent(copy, parent.id!);
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

  const comp = componentToAdd
    ? componentToAdd
    : selectedComponentId
    ? getComponentById(tree, selectedComponentId!)
    : null;

  return (
    <>
      {renderTree(tree)}
      {previewPosition && comp && (
        <Box
          w={`${comp.props?.gridX * GRID_SIZE_X}px`}
          h={`${comp.props?.gridY * GRID_SIZE_Y}px`}
          bg="blue"
          pos="absolute"
          top={`${previewPosition.top}px`}
          left={`${previewPosition.left}px`}
          sx={{
            zIndex: 100,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};

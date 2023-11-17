import { useEditorStore } from "@/stores/editor";
import { GRID_SIZE } from "@/utils/config";
import {
  getComponentNextSibiling,
  getComponentParent,
  updateTreeComponentProps,
} from "@/utils/editor";
import { Box, useMantineTheme } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import { PropsWithChildren, forwardRef, useEffect, useState } from "react";

export const GridColumn = forwardRef(
  ({ children, style, span, ...props }: PropsWithChildren<any>, ref) => {
    const [columnSize, setColumnSize] = useState(span);
    const theme = useMantineTheme();
    const setIsResizing = useEditorStore((state) => state.setIsResizing);
    const tree = useEditorStore((state) => state.tree);
    const setTree = useEditorStore((state) => state.setTree);

    useEffect(() => {
      const copy = cloneDeep(tree);
      updateTreeComponentProps(copy, props.id, { span: columnSize });
      setTree(copy);
    }, [columnSize]);

    useEffect(() => {
      setColumnSize(span);
    }, [span]);

    return (
      <>
        <Box
          ref={ref}
          p="xs"
          display="grid"
          style={{
            ...(style ?? {}),
            gridColumn: `span ${columnSize}`,
            gap: theme.spacing.xs,
          }}
          pos="relative"
          {...props}
        >
          {children}
          <Box
            bg="transparent"
            w="4px"
            h="100%"
            pos="absolute"
            top={0}
            right={-4}
            draggable
            onDragStart={() => setIsResizing(true)}
            onDragEnd={() => setIsResizing(false)}
            onDrag={(e) => {
              // @ts-ignore
              if (ref?.current && e.clientX > 0) {
                // @ts-ignore
                const rect = ref.current.getBoundingClientRect();
                const distance = e.clientX - rect.right;
                const steps = Math.floor(Math.abs(distance) / 20);
                if (steps > 0) {
                  setColumnSize((prev: any) =>
                    distance < 0
                      ? prev - steps
                      : distance > 0
                      ? prev + steps
                      : prev
                  );
                }
              }
            }}
            style={{
              cursor: "col-resize",
            }}
          />
        </Box>
      </>
    );
  }
);

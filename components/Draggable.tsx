import { useDraggable } from "@/hooks/useDraggable";
import { useEditorStore } from "@/stores/editor";
import { Box, BoxProps, Card, Group, useMantineTheme } from "@mantine/core";
import { PropsWithChildren } from "react";

type Props = {
  id: string;
  data: any;
  isDeletable: boolean;
} & BoxProps;

export const Draggable = ({
  id,
  children,
  style,
  data,
  isDeletable,
  ...props
}: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();
  const setSelectedId = useEditorStore((state) => state.setSelectedId);
  const setComponentToAdd = useEditorStore((state) => state.setComponentToAdd);
  const setIsDragging = useEditorStore((state) => state.setIsDragging);

  const draggable = useDraggable({
    id,
    onDragStart: (id: string) => {
      setSelectedId(id);
      setComponentToAdd(data);
      setIsDragging(true);
    },
  });

  const styles = {
    ...style,
    cursor: "move",
  };

  return (
    <Box id={id} pos="relative" w="100%" {...props} style={{ ...styles }}>
      <Card
        w="100%"
        withBorder
        pos="relative"
        sx={{
          ":hover": {
            boxShadow: theme.shadows.sm,
          },
        }}
      >
        <Group position="apart" noWrap sx={{ textAlign: "center" }}>
          <Box {...draggable} w="100%">
            {children}
          </Box>
        </Group>
      </Card>
    </Box>
  );
};

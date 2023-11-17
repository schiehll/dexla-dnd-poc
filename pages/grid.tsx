import { GRID_SIZE } from "@/utils/config";
import { Box, useMantineTheme } from "@mantine/core";
import { useRef, useState } from "react";

const GridColumn = ({ children }: any) => {
  const elRef = useRef(null);
  const [columnSize, setColumnSize] = useState(GRID_SIZE / 2);

  return (
    <>
      <Box
        ref={elRef}
        p="lg"
        bg="blue.3"
        style={{
          gridColumn: `span ${columnSize}`,
        }}
        pos="relative"
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
          onDrag={(e) => {
            if (elRef.current && e.clientX > 0) {
              // @ts-ignore
              const rect = elRef.current.getBoundingClientRect();
              const distance = e.clientX - rect.right;
              const steps = Math.floor(Math.abs(distance) / 20);
              if (steps > 0) {
                setColumnSize((prev) =>
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
};

export default function GridPage() {
  const theme = useMantineTheme();

  return (
    <Box
      display="grid"
      style={{
        gap: theme.spacing.xs,
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
      }}
    >
      <GridColumn>1</GridColumn>
      <GridColumn>2</GridColumn>
    </Box>
  );
}

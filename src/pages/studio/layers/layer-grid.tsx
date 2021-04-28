import React, { useEffect, useRef, useState } from "react";

import { EmulatorsUi } from "emulators-ui";
import { LayerConfig, LayerPosition } from "emulators-ui/dist/types/controls/layers-config";

import { EditorStackProps } from "./layers-editor";
import { IResizeEntry, ResizeSensor } from "@blueprintjs/core";

declare const emulatorsUi: EmulatorsUi;
const getGrid = emulatorsUi.controls.getGrid;

const aspect = 200 / 320;

export function LayerGrid(props: EditorStackProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [containerRect, setContainerRect] = useState<IResizeEntry | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [resizeCount, setResizeCount] = useState<number>(0);
    const layer = props.config.layers[props.breadCrumbs.layer || 0];

    function handleResize(entries: IResizeEntry[]) {
        setContainerRect(entries[0]);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            return;
        }

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        if (context === null) {
            return;
        }

        setContext(context);

        function onClick(e: MouseEvent) {
            var rect = (e.target as any).getBoundingClientRect();
            const width = context.canvas.width;
            const height = context.canvas.height;
            const x = (e.clientX - rect.left) / rect.width * width;
            const y = (e.clientY - rect.top) / rect.height * height;
            const { cells, columnWidth, rowHeight } =
                getGrid(layer.grid).getConfiguration(width, height);

            let row = 0;
            while (row < cells.length) {
                const centerY = cells[row][0].centerY;
                if (y >= centerY - rowHeight / 2 && y <= centerY + rowHeight / 2) {
                    break;
                }
                ++row;
            }

            if (row === cells.length) {
                return;
            }

            const cellsRow = cells[row];
            let column = 0;
            while (column < cellsRow.length) {
                const centerX = cellsRow[column].centerX;
                if (x >= centerX - columnWidth / 2 && x <= centerX + columnWidth / 2) {
                    break;
                }
                ++column;
            }

            if (column === cellsRow.length) {
                return;
            }

            const breadCrumbs = {...props.breadCrumbs};
            if (breadCrumbs.layerControlMove === true) {
                const position = breadCrumbs.layerControl as LayerPosition;
                let controlIndex = 0;
                for (const next of layer.controls) {
                    if (next.column === position.column && next.row === position.row) {
                        break;
                    }
                    ++controlIndex;
                }
                if (controlIndex === layer.controls.length) {
                    return;
                }
                layer.controls[controlIndex].row = row;
                layer.controls[controlIndex].column = column;
                delete breadCrumbs.layerControl;
                delete breadCrumbs.layerControlMove;
                props.setBreadCrumbs(breadCrumbs);
            } else {
                breadCrumbs.layerControl = {
                    row,
                    column,
                };
                props.setBreadCrumbs(breadCrumbs);
            }
        }

        canvas.addEventListener("click", onClick);

        return () => {
            canvas.removeEventListener("click", onClick);
        };
    }, [canvasRef,
        layer,
        props.breadCrumbs.layerControlMove,
        props.breadCrumbs.layerControl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null || containerRect === null) {
            return;
        }

        // dpi == 2
        const pWidth = containerRect.contentRect.width - 4;
        const pHeight = containerRect.contentRect.height - 4;

        let cssWidth = pWidth;
        let cssHeight = cssWidth * aspect;

        if (cssHeight > pHeight) {
            cssHeight = pHeight;
            cssWidth = cssHeight / aspect;
        }

        canvas.width = cssWidth * 2;
        canvas.height = cssHeight * 2;
        canvas.style.width = cssWidth + "px";
        canvas.style.height = cssHeight + "px";
        setResizeCount(resizeCount + 1);
    }, [canvasRef, containerRect])

    if (context !== null && layer !== undefined) {
        render(context, layer, props.breadCrumbs.layerControl);
    }

    return <ResizeSensor onResize={handleResize}>
        <div className="layer-grid">
            <canvas className="layer-grid-canvas" ref={canvasRef} />
        </div>
    </ResizeSensor>;
}

function render(context: CanvasRenderingContext2D, layer: LayerConfig, selected?: LayerPosition) {
    const width = context.canvas.width;
    const height = context.canvas.height;
    const { columnsPadding, rowsPadding, cells, columnWidth, rowHeight } =
        getGrid(layer.grid).getConfiguration(width, height);
    const radius = Math.min(columnWidth, rowHeight) / 2 - 2;

    context.lineWidth = 3;
    context.fillStyle = "#555";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#000";
    context.fillRect(columnsPadding, rowsPadding, width - columnsPadding * 2, height - rowsPadding * 2);

    context.strokeStyle = "#558";
    for (let row = 0; row < cells.length; ++row) {
        const cellsRow = cells[row];
        for (let column = 0; column < cellsRow.length; ++ column) {
            const { centerX, centerY } = cellsRow[column];
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            context.stroke();
        }
    }

    context.fillStyle = "#558";
    for (const next of layer.controls) {
        const column = next.column;
        const row = next.row;
        const { centerX, centerY } = cells[row][column];
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.fill();
    }

    context.fillStyle = "#FFF";
    context.font = rowHeight * 0.75 + "px serif";
    for (const next of layer.controls) {
        const column = next.column;
        const row = next.row;
        const { centerX, centerY } = cells[row][column];
        const metrics = context.measureText(next.symbol[0]);
        context.fillText(next.symbol[0], centerX - metrics.width / 2, centerY + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2);
    }

    context.strokeStyle = "#F00";
    if (selected !== undefined) {
        const row = Math.min(selected.row, cells.length - 1);
        const column = Math.min(selected.column, cells[row].length - 1);
        const { centerX, centerY } = cells[row][column];
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
    }
}

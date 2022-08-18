import React, { useLayoutEffect } from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";

export const VIEWER_LAYOUT_OPTIONS = ["1x1", "1x2", "2x1", "2x2"];
export const getViewCountFromLayout = layout => {
    const [rows, cols] = layout.split("x");
    return parseInt(rows, 10) * parseInt(cols, 10);
};

const layoutStyleMap = {
    "1x1": css({ gridTemplateRows: "auto", gridTemplateColumns: "auto" }),
    "1x2": css({ gridTemplateRows: "50% 50%", gridTemplateColumns: "auto" }),
    "2x1": css({ gridTemplateRows: "auto", gridTemplateColumns: "auto" }),
    "2x2": css({ gridTemplateRows: "50% 50%", gridTemplateColumns: "50% 50%" })
};

export const ViewerLayout = ({ layout = "1x1", cornerstone, ...props }) => {
    useLayoutEffect(
        () => {
            // We need to resize all elements when the layout changes
            const els = cornerstone.getEnabledElements();
            console.log("resizing after layout change");
            els.forEach(el => cornerstone.resize(el.element));
        },
        [layout]
    );
    return (
        <div
            css={[
                {
                    position: "relative",
                    display: "grid",
                    width: "100%",
                    height: "100%",
                    gridGap: 4,
                    backgroundColor: "pink"
                },
                layoutStyleMap[layout]
            ]}
            {...props}
        />
    );
};

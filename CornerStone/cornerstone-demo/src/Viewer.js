import React, { createRef, useEffect } from "react";

export const Viewer = ({ index, cornerstone, imageId }) => {
    const elementRef = createRef();
    useEffect(
        () => {
            console.log("Enabling element", index);
            cornerstone.enable(elementRef.current);
            return () => cornerstone.disable(elementRef.current);
        },
        [index]
    );

    // Handle Window resize
    useEffect(() => {
        const onResize = () => {
            console.log("onresize", index);
            cornerstone.resize(elementRef.current);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Handle image loading
    useEffect(
        () => {
            let mounted = true;
            if (!imageId) {
                // we should not load the image
            }
            cornerstone.loadImage(imageId).then(image => {
                if (mounted) {
                    cornerstone.displayImage(elementRef.current, image);
                }
            });
        },
        [imageId]
    );

    return <div ref={elementRef} style={{ background: "#000", height: "400px", width: "400px" }} />;
};

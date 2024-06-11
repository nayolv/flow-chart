/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReactFlow, getRectOfNodes, getTransformForBounds } from "reactflow";
import { toPng } from "html-to-image";

function downloadImage(dataUrl: any) {
    const a = document.createElement("a");

    a.setAttribute("download", "reactflow.png");
    a.setAttribute("href", dataUrl);
    a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
    const { getNodes } = useReactFlow();
    const onClick = () => {
        // we calculate a transform for the nodes so that all nodes are visible
        // we then overwrite the transform of the `.react-flow__viewport` element
        // with the style option of the html-to-image library
        const nodesBounds = getRectOfNodes(getNodes());
        const transform = getTransformForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2
        );

        const viewport = document.querySelector(".react-flow__viewport");
        if (viewport instanceof HTMLElement) {
            toPng(viewport, {
                backgroundColor: "#1a365d",
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: imageWidth.toString(),
                    height: imageHeight.toString(),
                    transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
                },
            }).then(downloadImage);
        } else {
            console.error(
                "No se pudo encontrar el elemento .react-flow__viewport o no es un HTMLElement"
            );
        }
    };

    return (


        <button className="download-btn" onClick={onClick}>
            <svg
            style={{ height: 20}}
                onClick={onClick}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
            </svg>
        </button>
    );
}

export default DownloadButton;

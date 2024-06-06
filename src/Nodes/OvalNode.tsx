/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, Position, ReactFlowStore, useStore } from "reactflow";
import "./ovalNode.css";

const connectionNodeIdSelector = (state: ReactFlowStore) =>
    state.connectionNodeId;

export const OvalNode = ({ data }: any) => {
    const connectionNodeId = useStore(connectionNodeIdSelector);
    const isConnecting = !!connectionNodeId;

    const { label } = data || {};
    const ovalType: { [key: string]: string } = {
        inicio: "init",
        fin: "end",
    };
    const styleClass = label != null ? ovalType[label.toLowerCase()] : "";

    return (
        <div className={`ovalnode handle ${styleClass} `}>
             {!isConnecting && (
                <Handle
                    className="customHandle right"
                    position={Position.Top}
                    type="source"
                />
            )}
            <Handle
                className="customHandle left"
                position={Position.Bottom}
                type="target"
                isConnectableStart={false}
            />
            <div>{data.label}</div>

            {/* <Handle
                type="target"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Left}
                id="b"
                isConnectable={isConnectable}
            /> */}
        </div>
    );
};

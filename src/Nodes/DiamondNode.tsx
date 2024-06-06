/* eslint-disable @typescript-eslint/no-explicit-any */
import { Handle, Position, ReactFlowStore, useStore } from "reactflow";
import './diamondNode.css';

const connectionNodeIdSelector = (state: ReactFlowStore) =>
    state.connectionNodeId;

function DiamondNode({ data }: any) {
    const connectionNodeId = useStore(connectionNodeIdSelector);
    const isConnecting = !!connectionNodeId;

    return (
        <div className="customdiamond ">
            <div className="diamondnode diamond" />
            {!isConnecting && (
                <Handle
                    className="customDiamondHandle right"
                    position={Position.Bottom}
                    type="source"
                />
            )}
            <Handle
                className="customDiamondHandle left"
                position={Position.Top}
                type="target"
                isConnectableStart={false}
            />
            <div className="diamondlabel">
                {data.label}
            </div>
        </div>
    );
}

export default DiamondNode;

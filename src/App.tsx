import { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  Node,
  Edge,
  ReactFlowInstance,
  Panel,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { ProcessNode } from "./Nodes/ProcessNode";
import DiamondNode from "./Nodes/DiamondNode";
import { OvalNode } from "./Nodes/OvalNode";
import "./App.css";
import FloatingEdge from "./Edges/FloatingEdge";
import CustomConnectionLine from "./Connections/CustomConnection";
import DownloadButton from "./DownloadButton";

const nodeTypes = {
  processNode: ProcessNode,
  diamondNode: DiamondNode,
  ovalNode: OvalNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// const edgeTypes = {
//   customedge: CustomEdge,
// };

const edgeTypes = {
  floating: FloatingEdge,
};

const connectionLineStyle = {
  strokeWidth: 2,
  stroke: "black",
};

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: "black" },
  type: "simplebezier",
  animated: true,
  // markerEnd: {
  //   // type: MarkerType.ArrowClosed,
  //   color: 'black',
  // },
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState<{ [key: string]: string }>({
    processNode: "",
    diamondNode: "",
    ovalNode: "",
  });
  // const [searchFlow, setSearchFlow] = useState("");
  const [flowKey, setFlowKey] = useState("");
  // const [edgeText, setEdgeText] = useState("");
  const [url, setUrl] = useState("");
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [savedFlows, setSavedFlows] = useState<string[]>([]);

  const saveFlows = useCallback(() => {
    setSavedFlows((prev) => [...prev, flowKey]);
  }, [flowKey]);

  const cleanBoard = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setFlowKey("");
    setIsEditable(false);
  };

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [flowKey, rfInstance]);

  // const onRestore = useCallback(() => {
  //   const restoreFlow = async () => {
  //     const flow = JSON.parse(localStorage.getItem(searchFlow) || "null");
  //     if (flow == null || flow === "null")
  //       return setFlowKey("Flow doesnt exists");
  //     setNodes(flow.nodes || []);
  //     setEdges(flow.edges || []);
  //     setFlowKey(searchFlow);
  //   };
  //   restoreFlow();
  // }, [searchFlow, setEdges, setNodes]);

  const settingNameNode = (key: string, value: string) => {
    setNodeName((prev) => {
      const data = {
        ...prev,
        [key]: value,
      };
      return data;
    });
  };
  const randomId = Math.floor(Math.random() * Date.now());

  const addNode = useCallback(
    (nodeType: string) => {
      const newNode: Node = {
        id: randomId.toString(),
        type: nodeType,
        data: {
          label: nodeName[nodeType],
          url: url,
        },
        position: { x: 0, y: 50 },
      };
      setNodes((nds) => nds.concat(newNode));
      settingNameNode(nodeType, "");
      setUrl("");
    },
    [randomId, nodeName, url, setNodes]
  );

  const addSimpleNode = useCallback(
    (nodeType: string, nodeLabel: string) => {
      const newNode: Node = {
        id: randomId.toString(),
        type: nodeType,
        data: {
          label: nodeLabel,
        },
        position: { x: 300, y: 100 },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [randomId, setNodes]
  );

  // const searchEdge = (id: string | undefined, edges: Edge[]) => {
  //   const searchingEdge = edges.find((edge) => {
  //     edge.id === id;
  //   });
  //   return searchingEdge;
  // };

  // const defaultEdgeOptions = {
  //   // id: Math.floor(Math.random() * Date.now()),
  //   animated: true,
  //   // type: "customedge",
  // };

  // const onConnect = useCallback(
  //   (params: Edge | Connection) =>
  //     setEdges((eds) => {
  //       console.log(eds)
  //       return addEdge(
  //         {...params,
  //           label:
  //            searchEdge(params.id, eds) == null && edgeText != ""
  //               ? edgeText
  //               : ""},
  //         eds
  //       );
  //     }),
  //   [edgeText, setEdges]
  // );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlowProvider>
      <div style={{ height: "100vh" }}>
        {/* <h1>Flujo: {flowKey}</h1> */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onInit={setRfInstance}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-right">
            <div className="panelfigures">
              <div className="node ovalnode init">
                <button
                  className="nodebutton"
                  onClick={() => addSimpleNode("ovalNode", "Inicio")}
                >
                  Inicio
                </button>
              </div>
              <div className="node ovalnode end">
                <button
                  className="nodebutton"
                  onClick={() => addSimpleNode("ovalNode", "Fin")}
                >
                  Fin
                </button>
              </div>
              <div className="node tasknode">
                <input
                  className="nodeinput"
                  type="text"
                  value={nodeName.processNode}
                  onChange={(e) =>
                    settingNameNode("processNode", e.target.value)
                  }
                />
                <button
                  className="nodebutton"
                  disabled={nodeName.processNode === "" ? true : false}
                  onClick={() => addNode("processNode")}
                >
                  Añadir
                </button>
              </div>

              <div className="diamondnode-container">
                <div className="node diamondnode">
                  <div className="actions">
                    <input
                      className="nodeinput"
                      type="text"
                      value={nodeName.diamondNode}
                      onChange={(e) =>
                        settingNameNode("diamondNode", e.target.value)
                      }
                    />
                    <button
                      className="nodebutton"
                      disabled={nodeName.diamondNode === "" ? true : false}
                      onClick={() => addNode("diamondNode")}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
          <Panel position="top-center">
            <div style={{ display: "flex" }}>
              
              {isEditable ? (
                <h1>{flowKey.toUpperCase()}</h1>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h2>Nombre del flujo:</h2>
                  <input
                    style={{
                      height: 35,
                      maxWidth: 150,
                      border: "1px solid #e2e2e2",
                      outline: "none",
                      marginLeft: 10,
                      fontSize: 25,
                    }}
                    type="text"
                    value={flowKey}
                    onChange={(e) => setFlowKey(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      setIsEditable(true);
                      saveFlows();
                    }}
                  >
                    <svg
                      style={{ height: 28 }}
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
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </Panel>
          <Panel position="top-left">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button onClick={onSave}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
                  />
                </svg>
              </button>
              <DownloadButton />
              <button onClick={cleanBoard}>
                <svg
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
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default App;

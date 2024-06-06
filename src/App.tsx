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
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { ProcessNode } from "./Nodes/ProcessNode";
import CustomEdge from "./Edges/CustomEdge";
import DiamondNode from "./Nodes/DiamondNode";
import { OvalNode } from "./Nodes/OvalNode";
import "./App.css";
import FloatingEdge from "./Edges/FloatingEdge";
import CustomConnectionLine from "./CustomConnection";

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
  stroke: 'black',
};

const defaultEdgeOptions = {
  style: { strokeWidth: 2, stroke: 'black' },
  type: 'simplebezier',
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

  // const onSave = useCallback(() => {
  //   if (rfInstance) {
  //     const flow = rfInstance.toObject();
  //     localStorage.setItem(flowKey, JSON.stringify(flow));
  //     location.reload();
  //   }
  // }, [flowKey, rfInstance]);

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
        position: { x: 0, y: 50 },
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
        <h1>Flujo: {flowKey}</h1>
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
            {/* <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 150,
              }}
            >
              <div>
                Nombre del Flujo:
                <input
                  type="text"
                  value={flowKey}
                  onChange={(evt) => setFlowKey(evt.target.value)}
                  placeholder="Enter node label"
                />
              </div>
              Nombre nodo:
              <input
                type="text"
                value={nodeName}
                onChange={(evt) => setNodeName(evt.target.value)}
                placeholder="Enter node label"
              />
              Url:
              <input
                type="text"
                value={url}
                onChange={(evt) => setUrl(evt.target.value)}
                placeholder="Enter node url"
              />
              <div>
                Desición:
                <input
                  type="text"
                  value={edgeText}
                  onChange={(e) => setEdgeText(e.target.value)}
                />
              </div>
              Añadir nodo:
              <button
                disabled={nodeName === "" ? true : false}
                onClick={addNode}
              >
                Add Node
              </button>
            </div>
            Guardar flujo:
            <button onClick={onSave}>save</button>
            <div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                Buscar flujo:
                <input
                  type="text"
                  value={searchFlow}
                  onChange={(evt) => setSearchFlow(evt.target.value)}
                  placeholder="Search flow"
                />
                <button
                  disabled={searchFlow === "" ? true : false}
                  onClick={onRestore}
                >
                  restore
                </button>
              </div>
            </div>
           <button onClick={onRestore}>restore</button>
        <button onClick={onAdd}>add node</button> */}
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default App;

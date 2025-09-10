import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Clock, Target, Sparkles } from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  NodeTypes,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { useToast } from "@/hooks/use-toast";

interface RoadmapNodeData {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  category: "foundation" | "intermediate" | "advanced" | "specialization";
}

interface Roadmap {
  title: string;
  description: string;
  duration: string;
  totalNodes: number;
  nodes: RoadmapNodeData[];
}

// Minimal, vertical node component with light/dark responsive text
const CustomRoadmapNode = ({ data }: { data: RoadmapNodeData }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const set = (val: boolean) => setIsDark(val);
    if (mq) {
      set(mq.matches);
      const handler = (e: MediaQueryListEvent) => set(e.matches);
      // cross-browser attach
      if (mq.addEventListener) mq.addEventListener("change", handler);
      else mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", handler);
        else mq.removeListener(handler);
      };
    }
  }, []);

  const borderColorHex =
    {
      foundation: isDark ? "#7c3aed" : "#6366f1",
      intermediate: isDark ? "#f59e0b" : "#f59e0b",
      advanced: isDark ? "#38bdf8" : "#0ea5e9",
      specialization: isDark ? "#34d399" : "#10b981",
    }[data.category] || (isDark ? "#94a3b8" : "#94a3b8");

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "transparent",
          border: "2px solid rgba(255,255,255,0.05)",
          width: 0,
          height: 0,
          top: -6,
          borderRadius: 0,
          zIndex: 10,
        }}
      />
      <div
        style={{
          width: 300,
          overflow: "visible", // <--- prevent clipping of arrowheads/markers
          borderLeft: `10px solid ${borderColorHex}`,
          borderRadius: 8,
          background: isDark ? "#0f172a" : "#ffffff",
          color: isDark ? "#fff" : "#0f172a",
          padding: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 6,
                background: isDark ? "#0b1220" : "#f1f5f9",
                color: isDark ? "#fff" : "#0f172a",
              }}
            >
              {data.id}
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{data.duration}</div>
          </div>
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 6,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            fontSize: 12,
            opacity: 0.85,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {data.description}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "transparent",
          border: "2px solid rgba(255,255,255,0.05)",
          width: 0,
          height: 0,
          bottom: -6,
          borderRadius: 0,
          zIndex: 10,
        }}
      />
    </>
  );
};

const nodeTypes: NodeTypes = {
  roadmapNode: CustomRoadmapNode,
};

const mockRoadmaps: { [key: string]: Roadmap } = {
  "react-developer": {
    title: "Full Stack React Developer Roadmap",
    description:
      "This roadmap provides a structured path to becoming a proficient Full Stack React Developer. It covers essential front-end concepts with React, back-end technologies, databases, and deployment strategies.",
    duration: "12-18 Months",
    totalNodes: 8,
    nodes: [
      {
        id: "1",
        title: "React Component Lifecycle",
        description:
          "Grasp how components are created, updated, and unmounted...",
        duration: "2-3 weeks",
        completed: false,
        category: "foundation",
      },
      {
        id: "2",
        title: "State Management (Redux/Context)",
        description:
          "Learn to manage application state effectively using Redux or React Context...",
        duration: "3-4 weeks",
        completed: false,
        category: "foundation",
      },
      {
        id: "3",
        title: "React Hooks",
        description:
          "Master the use of React Hooks (useState, useEffect, useContext...)...",
        duration: "2-3 weeks",
        completed: false,
        category: "intermediate",
      },
      {
        id: "4",
        title: "Frontend Testing (Jest/RTL)",
        description: "Write unit and integration tests for React components...",
        duration: "2-3 weeks",
        completed: false,
        category: "intermediate",
      },
      {
        id: "5",
        title: "React Router",
        description:
          "Implement client-side routing to create single-page applications...",
        duration: "1-2 weeks",
        completed: false,
        category: "intermediate",
      },
      {
        id: "6",
        title: "Backend Fundamentals (Node.js/Express)",
        description: "Learn Node.js for server-side JavaScript development...",
        duration: "4-6 weeks",
        completed: false,
        category: "advanced",
      },
      {
        id: "7",
        title: "API Integration (REST/GraphQL)",
        description: "Build and consume REST and GraphQL APIs...",
        duration: "3-4 weeks",
        completed: false,
        category: "advanced",
      },
      {
        id: "8",
        title: "Database Management",
        description:
          "Choose and implement database solutions like PostgreSQL, MySQL, or MongoDB...",
        duration: "4-5 weeks",
        completed: false,
        category: "specialization",
      },
    ],
  },
  "python-developer": {
    title: "Python Full Stack Developer Roadmap",
    description:
      "Comprehensive path to becoming a skilled Python developer covering web development, data science fundamentals, and deployment.",
    duration: "10-15 Months",
    totalNodes: 8,
    nodes: [
      {
        id: "1",
        title: "Python Fundamentals",
        description:
          "Master Python syntax, data types, control structures, and OOP concepts...",
        duration: "3-4 weeks",
        completed: false,
        category: "foundation",
      },
      {
        id: "2",
        title: "Django/Flask Framework",
        description: "Learn web development with Django or Flask frameworks...",
        duration: "4-6 weeks",
        completed: false,
        category: "foundation",
      },
      {
        id: "3",
        title: "Database Integration",
        description:
          "Work with SQL databases using SQLAlchemy or Django ORM...",
        duration: "2-3 weeks",
        completed: false,
        category: "intermediate",
      },
      {
        id: "4",
        title: "REST API Development",
        description:
          "Build RESTful APIs using Django REST Framework or FastAPI...",
        duration: "3-4 weeks",
        completed: false,
        category: "intermediate",
      },
      {
        id: "5",
        title: "Frontend Integration",
        description:
          "Connect Python backend with React, Vue, or vanilla JavaScript...",
        duration: "2-3 weeks",
        completed: false,
        category: "intermediate",
      },
      {
        id: "6",
        title: "Testing & Documentation",
        description:
          "Implement unit testing with pytest and create comprehensive documentation...",
        duration: "2-3 weeks",
        completed: false,
        category: "advanced",
      },
      {
        id: "7",
        title: "Data Science Basics",
        description: "Introduction to pandas, numpy, and data visualization...",
        duration: "4-5 weeks",
        completed: false,
        category: "advanced",
      },
      {
        id: "8",
        title: "Deployment & DevOps",
        description: "Deploy applications using Docker, AWS, or Heroku...",
        duration: "3-4 weeks",
        completed: false,
        category: "specialization",
      },
    ],
  },
};

export const RoadmapGenerator = () => {
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<RoadmapNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Simple vertical stacking: one node below another
  const calculateNodePosition = (index: number) => {
    const x = 300; // fixed x to center the column
    const verticalSpacing = 160;
    const paddingTop = 24;
    return { x, y: index * verticalSpacing + paddingTop };
  };

  const generateRoadmap = async () => {
    const selectedRole = role === "custom" ? customRole : role;
    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select or enter a role to generate roadmap",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    let generatedRoadmap: Roadmap | null = null;

    if (role === "custom") {
      try {
        const res = await fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const payload = await res.json();
        console.log("API Response:", payload);

        if (!payload.ok) {
          throw new Error(payload.error || "API returned error");
        }

        generatedRoadmap = payload.roadmap as Roadmap;
        console.log("Generated Roadmap:", generatedRoadmap);
      } catch (err) {
        console.error("Roadmap generation failed:", err);
        toast({
          title: "Error",
          description: "Failed to generate roadmap. Using fallback.",
          variant: "destructive",
        });
        // Use mock data as fallback
        generatedRoadmap = mockRoadmaps["react-developer"];
      }
    } else {
      // existing mock fallback
      await new Promise((r) => setTimeout(r, 400));
      generatedRoadmap = mockRoadmaps[role];
    }

    setRoadmap(generatedRoadmap);
    if (
      !generatedRoadmap ||
      !generatedRoadmap.nodes ||
      generatedRoadmap.nodes.length === 0
    ) {
      console.error("Invalid roadmap data:", generatedRoadmap);
      setNodes([]);
      setEdges([]);
      setIsGenerating(false);
      return;
    }

    const flowNodes: Node<RoadmapNodeData>[] = generatedRoadmap.nodes.map(
      (node, index) => ({
        id: node.id,
        type: "roadmapNode",
        position: calculateNodePosition(index),
        data: node,
        style: { width: 300 },
        draggable: true,
      }),
    );

    const edgeStroke = "#60a5fa";
    const flowEdges: Edge[] = [];
    for (let i = 0; i < flowNodes.length - 1; i++) {
      flowEdges.push({
        id: `e${flowNodes[i].id}-${flowNodes[i + 1].id}`,
        source: flowNodes[i].id,
        target: flowNodes[i + 1].id,
        type: "smoothstep",
        style: {
          stroke: edgeStroke,
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeStroke,
          width: 18,
          height: 18,
        },
        animated: false,
      });
    }

    console.log("Setting nodes:", flowNodes);
    console.log("Setting edges:", flowEdges);

    setNodes(flowNodes);
    setEdges(flowEdges);
    setIsGenerating(false);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <div className="mb-4 text-center">
        <h2 className="mb-1 text-2xl font-bold">Learning Roadmap Generator</h2>
      </div>

      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Select Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react-developer">React Developer</SelectItem>
                <SelectItem value="python-developer">
                  Python Developer
                </SelectItem>
                <SelectItem value="custom">Custom Role</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "custom" && (
            <Input
              placeholder="e.g., Mobile App Developer"
              value={customRole}
              onChange={(e) =>
                setCustomRole((e.target as HTMLInputElement).value)
              }
            />
          )}

          <Button
            onClick={generateRoadmap}
            disabled={isGenerating}
            className="bg-primary"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Generate Roadmap
              </>
            )}
          </Button>
        </div>
      </Card>

      {roadmap && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-start justify-evenly">
              <div className="max-w-1/3 space-y-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {roadmap.title}
                </h3>
                <p className="text-sm text-slate-600 opacity-80 dark:text-slate-300">
                  {roadmap.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {roadmap.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {roadmap.totalNodes} modules
                </div>
              </div>
            </div>
          </Card>

          <div className="h-[700px] w-full overflow-auto rounded-lg border border-border bg-transparent">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="top-right"
              nodesDraggable={false}
              nodesConnectable={false}
              panOnScroll
            >
              <Background gap={16} size={1} />
              <Controls />
              <MiniMap nodeColor="#60a5fa" maskColor="rgba(0, 0, 0, 0.08)" />
            </ReactFlow>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;

export type AgentArea = "marketing" | "produto" | "presidente";

export interface AgentInput {
  area: AgentArea;
  studentId: string;
  metrics: MetricData[];
  stage: string;
}

export interface MetricData {
  name: string;
  value: number;
  area: string;
}

export interface BottleneckReport {
  title: string;
  description: string;
  severity: number;
  suggestedActions: string[];
}

export interface AgentActionResponse {
  type: string;
  description: string;
}

export interface AgentOutput {
  bottlenecks: BottleneckReport[];
  actions: AgentActionResponse[];
}

export interface DashboardData {
  students: number;
  bottlenecks: number;
  resolved: number;
  openBottlenecks: BottleneckReport[];
  metricsByArea: Record<string, number>;
}

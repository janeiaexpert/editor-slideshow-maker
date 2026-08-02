import { MarketingAgent } from "./marketing-agent";
import { ProductAgent } from "./product-agent";
import { PresidentAgent } from "./president-agent";
import type { AgentArea } from "@/types";

export const agents = {
  marketing: new MarketingAgent(),
  produto: new ProductAgent(),
  presidente: new PresidentAgent(),
} as const;

export function getAgent(area: AgentArea) {
  return agents[area];
}

export function getAllAgents() {
  return Object.values(agents);
}

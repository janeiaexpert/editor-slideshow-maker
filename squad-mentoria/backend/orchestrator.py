import asyncio
from typing import Optional, List
from agents import (
    CEOAgent, COOAgent, IncubatorAgent, LearningAgent,
    TelegramAgent, EventAgent, AccelerationAgent, SupportAgent,
    ChurnAgent, AuditorAgent, RenewalAgent, StudentSuccessAgent,
)
from agents.base_agent import BaseAgent
from event_bus import event_bus, EventBus
from tools.database_tools import db_tools
from tasks.task_engine import task_engine
from models import AgentType


class Orchestrator:
    def __init__(self):
        self.agents: dict[AgentType, BaseAgent] = {
            AgentType.CEO: CEOAgent(),
            AgentType.COO: COOAgent(),
            AgentType.INCUBATOR: IncubatorAgent(),
            AgentType.LEARNING: LearningAgent(),
            AgentType.TELEGRAM: TelegramAgent(),
            AgentType.EVENT: EventAgent(),
            AgentType.ACCELERATION: AccelerationAgent(),
            AgentType.SUPPORT: SupportAgent(),
            AgentType.CHURN: ChurnAgent(),
            AgentType.AUDITOR: AuditorAgent(),
            AgentType.RENEWAL: RenewalAgent(),
            AgentType.STUDENT_SUCCESS: StudentSuccessAgent(),
        }
        self._running = False

    async def handle_event(self, event: dict):
        event_type = event["type"]
        data = event.get("data", {})

        # Save event to database
        await db_tools.save_event(event_type, data)

        # Route to relevant agents
        if event_type == "student_joined":
            await self.run_agent(AgentType.INCUBATOR, f"New student: {data}")
        elif event_type in ("student_inactive", "student_risk"):
            await self.run_agent(AgentType.CHURN, f"Student risk: {data}")
            await self.run_agent(AgentType.STUDENT_SUCCESS, f"Student needs help: {data}")
        elif event_type == "lesson_completed":
            await self.run_agent(AgentType.LEARNING, f"Lesson progress: {data}")
        elif event_type in ("event_registered", "event_attended"):
            await self.run_agent(AgentType.EVENT, f"Event activity: {data}")
        elif event_type == "contract_expiring":
            await self.run_agent(AgentType.RENEWAL, f"Contract expiring: {data}")
        elif event_type == "support_ticket":
            await self.run_agent(AgentType.SUPPORT, f"Support ticket: {data}")
        elif event_type == "telegram_message":
            await self.run_agent(AgentType.TELEGRAM, f"Telegram message: {data}")

        # CEO gets all important events
        if event_type in ("student_joined", "student_risk", "contract_expiring"):
            await self.run_agent(AgentType.CEO, f"Event: {event}")

    async def run_agent(self, agent_type: AgentType, context: str = "") -> dict:
        agent = self.agents.get(agent_type)
        if not agent:
            return {"error": f"Agent {agent_type} not found"}
        try:
            return await agent.run(context)
        except Exception as e:
            await db_tools.log_agent_action(
                agent_name=agent.name,
                area=agent_type.value,
                action=f"Error: {str(e)}",
                details=str(e),
            )
            return {"error": str(e)}

    async def run_all_agents(self) -> list[dict]:
        results = []
        for agent_type, agent in self.agents.items():
            result = await self.run_agent(agent_type)
            results.append({"agent": agent.name, "result": result})
        return results

    async def run_squad_cycle(self):
        """Full autonomous cycle: observe -> analyze -> decide -> act -> learn"""
        await db_tools.log_agent_action("Orchestrator", "system", "Starting squad cycle")

        # Phase 1: Observe (run monitoring agents)
        await self.run_agent(AgentType.INCUBATOR)
        await self.run_agent(AgentType.LEARNING)
        await self.run_agent(AgentType.TELEGRAM)
        await self.run_agent(AgentType.EVENT)
        await self.run_agent(AgentType.ACCELERATION)

        # Phase 2: Analyze (run analytical agents)
        await self.run_agent(AgentType.CHURN)
        await self.run_agent(AgentType.COO)
        await self.run_agent(AgentType.SUPPORT)
        await self.run_agent(AgentType.RENEWAL)

        # Phase 3: Cross-reference
        await self.run_agent(AgentType.AUDITOR)

        # Phase 4: Strategic decisions
        await self.run_agent(AgentType.CEO)

        # Phase 5: Execute tasks
        await self._process_pending_tasks()

        await db_tools.log_agent_action("Orchestrator", "system", "Completed squad cycle")

    async def _process_pending_tasks(self):
        tasks = await db_tools.get_pending_tasks()
        for task in tasks:
            agent_type_str = task.agent_type
            try:
                agent_type = AgentType(agent_type_str)
                agent = self.agents.get(agent_type)
                if agent:
                    await agent.run(json.dumps(task.metadata_json or {}))
                    await task_engine.complete_task(task.id)
                else:
                    await task_engine.escalate_task(task.id, f"No agent for {agent_type_str}")
            except Exception:
                await task_engine.escalate_task(task.id, "Execution failed")

    async def start_autonomous_loop(self, interval_minutes: int = 30):
        self._running = True
        while self._running:
            await self.run_squad_cycle()
            await asyncio.sleep(interval_minutes * 60)

    def stop(self):
        self._running = False


import json
orchestrator = Orchestrator()

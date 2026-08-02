import json
from typing import Optional
from groq_client import call_groq, call_groq_json
from tools.database_tools import db_tools
from tasks.task_engine import task_engine
from memory.student_memory import student_memory
from event_bus import event_bus
from models import AgentType


class BaseAgent:
    def __init__(self, name: str, agent_type: AgentType, system_prompt: str):
        self.name = name
        self.agent_type = agent_type
        self.system_prompt = system_prompt

    async def think(self, context: str) -> dict:
        result = await call_groq_json(self.system_prompt, context, temperature=0.3)
        if "error" in result:
            await self.log(f"Groq error: {result.get('error')} - {result.get('note', '')}", context[:200])
            return {"error": result.get("error"), "bottlenecks": [], "actions": []}
        return result

    async def log(self, action: str, details: str = None):
        await db_tools.log_agent_action(
            agent_name=self.name,
            area=self.agent_type.value,
            action=action,
            details=details,
        )

    async def create_task(self, title: str, description: str, priority: int = 5,
                          student_id: Optional[int] = None, metadata: dict = None):
        return await task_engine.create_task(
            title=title, description=description,
            agent_type=self.agent_type.value,
            priority=priority, student_id=student_id,
            metadata_json=metadata,
        )

    async def emit_event(self, event_type: str, data: dict):
        await event_bus.emit(event_type, data)

    async def analyze_student(self, student_id: int) -> dict:
        profile = await student_memory.get_full_profile(student_id)
        ctx = json.dumps(profile, indent=2)
        result = await self.think(f"Analyze this student profile:\n\n{ctx}")
        await self.log(f"Analyzed student {profile.get('name', student_id)}", str(result))
        return result

    async def run(self, context: str = "") -> dict:
        raise NotImplementedError

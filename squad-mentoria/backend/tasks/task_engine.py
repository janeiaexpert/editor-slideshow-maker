from typing import Optional, List
from models import TaskStatus
from tools.database_tools import db_tools
from datetime import datetime


class TaskEngine:
    async def create_task(self, title: str, description: str, agent_type: str,
                          priority: int = 5, student_id: Optional[int] = None,
                          metadata_json: dict = None) -> dict:
        task = await db_tools.create_task({
            "title": title,
            "description": description,
            "agent_type": agent_type,
            "priority": priority,
            "status": TaskStatus.PENDING,
            "student_id": student_id,
            "metadata_json": metadata_json,
        })
        return {"id": task.id, "title": task.title, "status": task.status}

    async def get_next_task(self, agent_type: Optional[str] = None) -> Optional[dict]:
        tasks = await db_tools.get_pending_tasks(agent_type)
        if not tasks:
            return None
        task = tasks[0]
        await db_tools.update_task(task.id, {"status": TaskStatus.IN_PROGRESS})
        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "agent_type": task.agent_type,
            "priority": task.priority,
            "student_id": task.student_id,
            "metadata": task.metadata_json,
        }

    async def complete_task(self, task_id: int, result: str = None):
        await db_tools.update_task(task_id, {
            "status": TaskStatus.COMPLETED,
            "completed_at": datetime.utcnow(),
        })

    async def escalate_task(self, task_id: int, reason: str = None):
        await db_tools.update_task(task_id, {
            "status": TaskStatus.ESCALATED,
            "escalated": True,
        })

    async def get_pending_count(self, agent_type: Optional[str] = None) -> int:
        tasks = await db_tools.get_pending_tasks(agent_type)
        return len(tasks)


task_engine = TaskEngine()

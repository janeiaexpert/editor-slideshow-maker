from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models import (
    Student, Contract, Metric, Bottleneck, Task, AgentLog, Event,
    AgentType, EventType, TaskStatus, ChurnRisk, RenewalProbability
)
from database import async_session
from datetime import datetime, timedelta
import json


class DatabaseTools:
    async def get_student(self, student_id: int) -> Optional[Student]:
        async with async_session() as session:
            result = await session.execute(select(Student).where(Student.id == student_id))
            return result.scalar_one_or_none()

    async def get_student_by_ref(self, ref: str) -> Optional[Student]:
        async with async_session() as session:
            result = await session.execute(
                select(Student).where((Student.student_id == ref) | (Student.email == ref))
            )
            return result.scalar_one_or_none()

    async def get_all_students(self, status: Optional[str] = None) -> List[Student]:
        async with async_session() as session:
            query = select(Student)
            if status:
                query = query.where(Student.status == status)
            result = await session.execute(query.order_by(Student.entry_date.desc()))
            return result.scalars().all()

    async def create_student(self, data: dict) -> Student:
        async with async_session() as session:
            student = Student(**data)
            session.add(student)
            await session.commit()
            await session.refresh(student)
            return student

    async def update_student(self, student_id: int, data: dict) -> Optional[Student]:
        async with async_session() as session:
            student = await session.get(Student, student_id)
            if not student:
                return None
            for key, value in data.items():
                setattr(student, key, value)
            await session.commit()
            await session.refresh(student)
            return student

    async def save_metric(self, student_id: int, name: str, value: float, area: str) -> Metric:
        async with async_session() as session:
            metric = Metric(student_id=student_id, name=name, value=value, area=area)
            session.add(metric)
            await session.commit()
            return metric

    async def save_bottleneck(self, data: dict) -> Bottleneck:
        async with async_session() as session:
            b = Bottleneck(**data)
            session.add(b)
            await session.commit()
            await session.refresh(b)
            return b

    async def get_bottlenecks(self, status: Optional[str] = None, area: Optional[str] = None) -> List[Bottleneck]:
        async with async_session() as session:
            query = select(Bottleneck)
            if status:
                query = query.where(Bottleneck.status == status)
            if area:
                query = query.where(Bottleneck.area == area)
            result = await session.execute(query.order_by(Bottleneck.detected_at.desc()))
            return result.scalars().all()

    async def create_task(self, data: dict) -> Task:
        async with async_session() as session:
            task = Task(**data)
            session.add(task)
            await session.commit()
            await session.refresh(task)
            return task

    async def get_pending_tasks(self, agent_type: Optional[str] = None) -> List[Task]:
        async with async_session() as session:
            query = select(Task).where(Task.status == TaskStatus.PENDING)
            if agent_type:
                query = query.where(Task.agent_type == agent_type)
            result = await session.execute(query.order_by(Task.priority.desc(), Task.created_at.asc()))
            return result.scalars().all()

    async def update_task(self, task_id: int, data: dict) -> Optional[Task]:
        async with async_session() as session:
            task = await session.get(Task, task_id)
            if not task:
                return None
            for key, value in data.items():
                setattr(task, key, value)
            await session.commit()
            await session.refresh(task)
            return task

    async def log_agent_action(self, agent_name: str, area: str, action: str, details: str = None):
        async with async_session() as session:
            log = AgentLog(agent_name=agent_name, area=area, action=action, details=details)
            session.add(log)
            await session.commit()

    async def save_event(self, event_type: str, data: dict):
        async with async_session() as session:
            event = Event(event_type=event_type, data=data)
            session.add(event)
            await session.commit()

    async def get_recent_logs(self, limit: int = 20) -> List[AgentLog]:
        async with async_session() as session:
            result = await session.execute(
                select(AgentLog).order_by(AgentLog.created_at.desc()).limit(limit)
            )
            return result.scalars().all()

    async def get_dashboard_stats(self) -> dict:
        async with async_session() as session:
            total = await session.execute(select(func.count(Student.id)))
            total_students = total.scalar()

            active = await session.execute(
                select(func.count(Student.id)).where(Student.status.in_(["active", "new", "vip"]))
            )
            active_students = active.scalar()

            healthy = await session.execute(
                select(func.count(Student.id)).where(Student.health_score >= 80)
            )
            attention = await session.execute(
                select(func.count(Student.id)).where(Student.health_score.between(60, 79))
            )
            risk = await session.execute(
                select(func.count(Student.id)).where(Student.health_score.between(40, 59))
            )
            critical = await session.execute(
                select(func.count(Student.id)).where(Student.health_score < 40)
            )

            open_b = await session.execute(
                select(func.count(Bottleneck.id)).where(Bottleneck.status == "open")
            )
            total_b = await session.execute(select(func.count(Bottleneck.id)))

            # Expiring contracts
            now = datetime.utcnow()
            expire_30 = await session.execute(
                select(func.count(Student.id)).where(
                    Student.contract_end_date <= now + timedelta(days=30),
                    Student.contract_end_date >= now,
                )
            )
            expire_15 = await session.execute(
                select(func.count(Student.id)).where(
                    Student.contract_end_date <= now + timedelta(days=15),
                    Student.contract_end_date >= now,
                )
            )

            return {
                "total_students": total_students,
                "active_students": active_students,
                "healthy": healthy.scalar() or 0,
                "attention": attention.scalar() or 0,
                "risk": risk.scalar() or 0,
                "critical": critical.scalar() or 0,
                "open_bottlenecks": open_b.scalar() or 0,
                "total_bottlenecks": total_b.scalar() or 0,
                "expiring_30_days": expire_30.scalar() or 0,
                "expiring_15_days": expire_15.scalar() or 0,
            }


db_tools = DatabaseTools()

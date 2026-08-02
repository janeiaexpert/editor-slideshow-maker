import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from config import settings
from orchestrator import orchestrator
from event_bus import event_bus
from tools.database_tools import db_tools
from schemas import *

from telegram_listener import telegram_listener


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    asyncio.create_task(event_bus.start())
    event_bus.subscribe_all(orchestrator.handle_event)
    asyncio.create_task(telegram_listener.start())
    yield
    orchestrator.stop()
    telegram_listener.stop()
    event_bus.stop()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === STUDENTS ===

@app.get("/api/students")
async def list_students(status: str = None):
    students = await db_tools.get_all_students(status)
    return [StudentResponse.model_validate(s) for s in students]


@app.post("/api/students")
async def create_student(data: StudentCreate):
    import uuid
    student_id = str(uuid.uuid4())[:8]
    student = await db_tools.create_student({
        "student_id": student_id,
        "full_name": data.full_name,
        "email": data.email,
        "telegram_id": data.telegram_id,
        "current_plan": data.current_plan,
        "contract_duration": data.contract_duration,
        "current_stage": data.current_stage,
        "status": data.status,
    })
    await event_bus.emit("student_joined", {"student_id": student.id, "name": student.full_name})
    return StudentResponse.model_validate(student)


@app.get("/api/students/{student_id}")
async def get_student(student_id: int):
    student = await db_tools.get_student(student_id)
    if not student:
        raise HTTPException(404, "Student not found")
    return StudentResponse.model_validate(student)


@app.patch("/api/students/{student_id}")
async def update_student(student_id: int, data: StudentUpdate):
    student = await db_tools.update_student(student_id, data.model_dump(exclude_none=True))
    if not student:
        raise HTTPException(404, "Student not found")
    return StudentResponse.model_validate(student)


# === METRICS ===

@app.post("/api/metrics")
async def create_metric(data: MetricCreate):
    metric = await db_tools.save_metric(data.student_id, data.name, data.value, data.area)
    return {"id": metric.id, "status": "created"}


# === BOTTLENECKS ===

@app.get("/api/bottlenecks")
async def list_bottlenecks(status: str = None, area: str = None):
    bottlenecks = await db_tools.get_bottlenecks(status, area)
    return bottlenecks


# === AGENTS ===

@app.post("/api/agents/run")
async def run_agent(req: AgentRunRequest):
    if req.agent_type:
        from models import AgentType
        result = await orchestrator.run_agent(AgentType(req.agent_type))
    else:
        result = await orchestrator.run_all_agents()
    return {"status": "completed", "result": result}


@app.post("/api/agents/run-all")
async def run_all_agents():
    results = await orchestrator.run_all_agents()
    return {"processed": len(results), "results": results}


@app.get("/api/agents/status")
async def agent_status():
    logs = await db_tools.get_recent_logs(20)
    stats = await db_tools.get_dashboard_stats()
    return {
        "openBottlenecks": stats["open_bottlenecks"],
        "totalBottlenecks": stats["total_bottlenecks"],
        "recentLogs": [
            {"id": l.id, "agentName": l.agent_name, "area": l.area,
             "action": l.action, "createdAt": l.created_at.isoformat()}
            for l in logs
        ],
    }


@app.post("/api/agents/squad-cycle")
async def run_squad_cycle():
    asyncio.create_task(orchestrator.run_squad_cycle())
    return {"status": "started", "message": "Squad cycle started in background"}


# === EVENTS ===

@app.post("/api/events")
async def create_event(data: EventCreate):
    await event_bus.emit(data.event_type, data.data)
    return {"status": "emitted", "event_type": data.event_type}


# === DASHBOARD ===

@app.get("/api/dashboard")
async def dashboard():
    stats = await db_tools.get_dashboard_stats()
    bottlenecks = await db_tools.get_bottlenecks(status="open")

    biggest = None
    if bottlenecks:
        biggest = sorted(bottlenecks, key=lambda b: b.severity, reverse=True)[0]
        biggest = {"title": biggest.title, "impact": biggest.estimated_impact}

    students = await db_tools.get_all_students()
    predicted_renewals = sum(1 for s in students if s.renewal_probability in ("high", "very_high"))
    predicted_churn = sum(1 for s in students if s.churn_risk in ("high", "critical"))
    avg_lifetime = sum(s.total_time_inside for s in students) / max(len(students), 1)

    return {
        "total_students": stats["total_students"],
        "active_students": stats["active_students"],
        "healthy_count": stats["healthy"],
        "attention_count": stats["attention"],
        "risk_count": stats["risk"],
        "critical_count": stats["critical"],
        "total_bottlenecks": stats["total_bottlenecks"],
        "open_bottlenecks": stats["open_bottlenecks"],
        "biggest_bottleneck": biggest,
        "expiring_30_days": stats["expiring_30_days"],
        "expiring_15_days": stats["expiring_15_days"],
        "average_lifetime": round(avg_lifetime, 1),
        "predicted_renewals": predicted_renewals,
        "predicted_churn": predicted_churn,
    }


@app.get("/api/telegram/status")
async def telegram_status():
    pending = await db_tools.get_pending_tasks("telegram")
    recent = await db_tools.get_recent_logs(10)
    return {
        "bot_ativo": True,
        "escalares_pendentes": len(pending),
        "mensagens_recentes": [
            {"agente": l.agent_name, "acao": l.action, "data": l.created_at.isoformat()}
            for l in recent if l.area == "telegram"
        ],
    }


@app.get("/api/telegram/mensagens")
async def telegram_mensagens():
    logs = await db_tools.get_recent_logs(50)
    msgs = [l for l in logs if l.area == "telegram"]
    tasks = await db_tools.get_pending_tasks("telegram")
    return {
        "mensagens": [
            {"id": l.id, "agente": l.agent_name, "acao": l.action,
             "detalhes": l.details, "data": l.created_at.isoformat()}
            for l in msgs
        ],
        "escalamentos": [
            {"id": t.id, "titulo": t.title, "descricao": t.description,
             "prioridade": t.priority, "data": t.created_at.isoformat()}
            for t in tasks
        ],
    }


@app.post("/api/telegram/responder")
async def telegram_responder(req: TelegramResponderRequest):
    from telegram_listener import telegram_listener
    ok = await telegram_listener.send_message(req.chat_id, req.mensagem)
    if req.task_id:
        from tasks.task_engine import task_engine
        await task_engine.complete_task(req.task_id, f"Humano respondeu: {req.mensagem[:100]}")
    return {"status": "enviado" if ok else "erro"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

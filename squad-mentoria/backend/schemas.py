from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StudentCreate(BaseModel):
    full_name: str
    email: str
    telegram_id: Optional[str] = None
    current_plan: str = "1_month"
    contract_duration: str = "1_month"
    current_stage: str = "incubator"
    status: str = "new"


class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    telegram_id: Optional[str] = None
    current_plan: Optional[str] = None
    contract_duration: Optional[str] = None
    current_stage: Optional[str] = None
    status: Optional[str] = None
    health_score: Optional[int] = None
    churn_risk: Optional[str] = None
    renewal_probability: Optional[str] = None


class StudentResponse(BaseModel):
    id: int
    student_id: str
    full_name: str
    email: str
    telegram_id: Optional[str]
    entry_date: datetime
    current_plan: str
    contract_duration: str
    contract_end_date: Optional[datetime]
    renewal_count: int
    total_time_inside: int
    lifetime_value: float
    health_score: int
    renewal_probability: str
    churn_risk: str
    current_stage: str
    status: str
    incubator_progress: float
    learning_progress: float
    telegram_activity: int
    event_attendance: int
    mentor_notes: Optional[str]

    class Config:
        from_attributes = True


class MetricCreate(BaseModel):
    student_id: int
    name: str
    value: float
    area: str


class EventCreate(BaseModel):
    event_type: str
    data: dict


class AgentRunRequest(BaseModel):
    agent_type: Optional[str] = None
    student_id: Optional[int] = None


class TelegramResponderRequest(BaseModel):
    chat_id: int
    mensagem: str
    task_id: Optional[int] = None


class BottleneckResponse(BaseModel):
    id: int
    title: str
    description: str
    area: str
    severity: int
    status: str
    estimated_impact: Optional[str]
    recommendation: Optional[str]
    detected_by: str
    detected_at: datetime

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    total_students: int
    active_students: int
    new_this_month: int
    renewals_this_month: int
    healthy_count: int
    attention_count: int
    risk_count: int
    critical_count: int
    total_bottlenecks: int
    open_bottlenecks: int
    biggest_bottleneck: Optional[dict]
    expiring_30_days: int
    expiring_15_days: int
    average_lifetime: float
    predicted_renewals: int
    predicted_churn: int
    estimated_revenue_impact: str

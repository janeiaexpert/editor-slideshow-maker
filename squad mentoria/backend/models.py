import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum


class ContractType(str, enum.Enum):
    ONE_MONTH = "1_month"
    THREE_MONTHS = "3_months"
    SIX_MONTHS = "6_months"
    TWELVE_MONTHS = "12_months"
    LIFETIME = "lifetime"
    CUSTOM = "custom"


class StudentStatus(str, enum.Enum):
    NEW = "new"
    ACTIVE = "active"
    RENEWAL_PENDING = "renewal_pending"
    RENEWED = "renewed"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    VIP = "vip"


class StudentStage(str, enum.Enum):
    INCUBATOR = "incubator"
    RECORDED_LESSONS = "recorded_lessons"
    COMMUNITY = "community"
    ACCELERATION = "acceleration"
    CEO_MENTORING = "ceo_mentoring"
    ADVANCED = "advanced"
    FINISHED = "finished"


class ChurnRisk(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RenewalProbability(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"


class AgentType(str, enum.Enum):
    CEO = "ceo"
    COO = "coo"
    INCUBATOR = "incubator"
    LEARNING = "learning"
    TELEGRAM = "telegram"
    EVENT = "event"
    ACCELERATION = "acceleration"
    SUPPORT = "support"
    CHURN = "churn"
    AUDITOR = "auditor"
    RENEWAL = "renewal"
    STUDENT_SUCCESS = "student_success"


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ESCALATED = "escalated"
    CANCELLED = "cancelled"


class EventType(str, enum.Enum):
    STUDENT_JOINED = "student_joined"
    LESSON_COMPLETED = "lesson_completed"
    TELEGRAM_MESSAGE = "telegram_message"
    EVENT_REGISTERED = "event_registered"
    EVENT_ATTENDED = "event_attended"
    SUPPORT_TICKET = "support_ticket"
    MENTOR_SESSION = "mentor_session"
    GOAL_COMPLETED = "goal_completed"
    STUDENT_INACTIVE = "student_inactive"
    STUDENT_RISK = "student_risk"
    CONTRACT_EXPIRING = "contract_expiring"
    RENEWAL_COMPLETED = "renewal_completed"


# --- TABLES ---

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    telegram_id = Column(String, nullable=True)
    entry_date = Column(DateTime, default=datetime.datetime.utcnow)
    current_plan = Column(String)
    contract_duration = Column(String)  # months
    contract_end_date = Column(DateTime, nullable=True)
    renewal_count = Column(Integer, default=0)
    total_time_inside = Column(Integer, default=0)  # days
    lifetime_value = Column(Float, default=0.0)
    health_score = Column(Integer, default=100)
    renewal_probability = Column(String, default="medium")
    churn_risk = Column(String, default="low")
    current_stage = Column(String, default="incubator")
    status = Column(String, default="new")
    incubator_progress = Column(Float, default=0.0)
    learning_progress = Column(Float, default=0.0)
    telegram_activity = Column(Integer, default=0)
    event_attendance = Column(Integer, default=0)
    acceleration_status = Column(String, nullable=True)
    mentor_notes = Column(Text, nullable=True)

    contracts = relationship("Contract", back_populates="student", order_by="Contract.start_date")
    metrics = relationship("Metric", back_populates="student", order_by="Metric.recorded_at")
    tasks = relationship("Task", back_populates="student")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    contract_type = Column(String)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime)
    value = Column(Float, default=0.0)
    renewed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)

    student = relationship("Student", back_populates="contracts")


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    name = Column(String)
    value = Column(Float)
    area = Column(String)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="metrics")


class Bottleneck(Base):
    __tablename__ = "bottlenecks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    description = Column(Text)
    area = Column(String)
    severity = Column(Integer, default=5)
    status = Column(String, default="open")
    estimated_impact = Column(String, nullable=True)
    recommendation = Column(Text, nullable=True)
    detected_by = Column(String)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)

    actions = relationship("AgentAction", back_populates="bottleneck")


class AgentAction(Base):
    __tablename__ = "agent_actions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    agent_name = Column(String)
    action_type = Column(String)
    description = Column(Text)
    result = Column(Text, nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    bottleneck_id = Column(Integer, ForeignKey("bottlenecks.id"), nullable=True)

    bottleneck = relationship("Bottleneck", back_populates="actions")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    description = Column(Text)
    agent_type = Column(String)
    priority = Column(Integer, default=5)
    status = Column(String, default="pending")
    assigned_to = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    escalated = Column(Boolean, default=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    metadata_json = Column(JSON, nullable=True)

    student = relationship("Student", back_populates="tasks")


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    agent_name = Column(String)
    area = Column(String)
    action = Column(String)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_type = Column(String)
    data = Column(JSON)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

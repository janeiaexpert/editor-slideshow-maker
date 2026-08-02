import datetime
from typing import Optional
from tools.database_tools import db_tools
from models import ChurnRisk, RenewalProbability


class StudentMemory:
    async def get_full_profile(self, student_id: int) -> dict:
        student = await db_tools.get_student(student_id)
        if not student:
            return {}
        return {
            "id": student.id,
            "student_id": student.student_id,
            "name": student.full_name,
            "email": student.email,
            "entry_date": student.entry_date.isoformat() if student.entry_date else None,
            "current_plan": student.current_plan,
            "contract_duration": student.contract_duration,
            "contract_end": student.contract_end_date.isoformat() if student.contract_end_date else None,
            "renewal_count": student.renewal_count,
            "total_days": student.total_time_inside,
            "lifetime_value": student.lifetime_value,
            "health_score": student.health_score,
            "renewal_probability": student.renewal_probability,
            "churn_risk": student.churn_risk,
            "current_stage": student.current_stage,
            "status": student.status,
            "incubator_progress": student.incubator_progress,
            "learning_progress": student.learning_progress,
            "telegram_activity": student.telegram_activity,
            "event_attendance": student.event_attendance,
            "acceleration_status": student.acceleration_status,
            "mentor_notes": student.mentor_notes,
        }

    async def update_health_score(self, student_id: int, adjustments: list) -> int:
        student = await db_tools.get_student(student_id)
        if not student:
            return 0

        score = 100
        for adj in adjustments:
            score += adj

        score = max(0, min(100, score))
        await db_tools.update_student(student_id, {"health_score": score})

        # Auto-classify churn risk
        if score >= 80:
            risk = ChurnRisk.LOW
        elif score >= 60:
            risk = ChurnRisk.MEDIUM
        elif score >= 40:
            risk = ChurnRisk.HIGH
        else:
            risk = ChurnRisk.CRITICAL

        await db_tools.update_student(student_id, {"churn_risk": risk.value})
        return score

    async def calculate_renewal_probability(self, student_id: int) -> str:
        student = await db_tools.get_student(student_id)
        if not student:
            return "low"

        score = student.health_score
        score += student.telegram_activity * 2
        score += student.event_attendance * 3
        if student.learning_progress > 50:
            score += 10
        if student.incubator_progress > 50:
            score += 10

        if score >= 120:
            prob = RenewalProbability.VERY_HIGH
        elif score >= 90:
            prob = RenewalProbability.HIGH
        elif score >= 60:
            prob = RenewalProbability.MEDIUM
        else:
            prob = RenewalProbability.LOW

        await db_tools.update_student(student_id, {"renewal_probability": prob.value})
        return prob.value


student_memory = StudentMemory()

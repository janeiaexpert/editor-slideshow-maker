from datetime import datetime, timezone, timedelta

BRAZIL_TZ = timezone(timedelta(hours=-3))

def now_brazil() -> datetime:
    return datetime.now(BRAZIL_TZ)

def utc_to_brazil(dt: datetime) -> datetime:
    if dt is None:
        return dt
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(BRAZIL_TZ)

def format_brazil(dt: datetime) -> str:
    if dt is None:
        return ""
    return utc_to_brazil(dt).strftime("%d/%m/%Y %H:%M:%S")

import asyncio
from typing import Callable, Dict, Any, List
from datetime import datetime


class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}
        self._queue: asyncio.Queue = asyncio.Queue()
        self._running = False

    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(callback)

    def subscribe_all(self, callback: Callable):
        self.subscribe("*", callback)

    async def emit(self, event_type: str, data: dict = None):
        event = {
            "type": event_type,
            "data": data or {},
            "timestamp": datetime.utcnow().isoformat(),
        }
        await self._queue.put(event)

    async def _process_event(self, event: dict):
        event_type = event["type"]
        # Notify specific subscribers
        for cb in self._subscribers.get(event_type, []):
            try:
                await cb(event)
            except Exception as e:
                print(f"[EventBus] Error in {event_type} handler: {e}")
        # Notify wildcard subscribers
        for cb in self._subscribers.get("*", []):
            try:
                await cb(event)
            except Exception as e:
                print(f"[EventBus] Error in * handler: {e}")

    async def start(self):
        self._running = True
        while self._running:
            try:
                event = await asyncio.wait_for(self._queue.get(), timeout=1.0)
                await self._process_event(event)
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                print(f"[EventBus] Error: {e}")

    def stop(self):
        self._running = False


event_bus = EventBus()

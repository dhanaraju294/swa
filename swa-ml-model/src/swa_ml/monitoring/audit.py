from datetime import datetime, timezone
from uuid import uuid4
from .models import AuditEvent


class AuditLogger:
    def __init__(self):
        self.events = []

    def record(self, action, model_version=None, actor="system", reason=None):
        event = AuditEvent(event_id=str(uuid4()), timestamp=datetime.now(timezone.utc), action=action, model_version=model_version, actor=actor, reason=reason)
        self.events.append(event)
        return event

    def summary(self):
        return [event.model_dump(mode="json") for event in self.events]
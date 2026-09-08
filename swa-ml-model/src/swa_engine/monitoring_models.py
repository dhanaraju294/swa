from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field


class MonitoringAlert(BaseModel):
    model_config = ConfigDict(extra="forbid")
    alert_type: str
    severity: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metric: str
    threshold: float | None = None
    actual_value: float | None = None
    model_version: str | None = None
    description: str


class AuditEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")
    event_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    action: str
    model_version: str | None = None
    actor: str = "system"
    reason: str | None = None
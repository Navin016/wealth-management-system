import sys
import os
from celery import Celery
from celery.schedules import crontab

# Ensure app path
sys.path.append(os.path.dirname(__file__))

# Redis URL from environment
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "wealth_management",
    broker=REDIS_URL,
    backend=REDIS_URL
)

# Config
celery_app.conf.update(
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    broker_connection_retry_on_startup=True,
)

# Auto-discover tasks
celery_app.autodiscover_tasks(["app.tasks"])

# Force import
celery_app.conf.imports = [
    "app.tasks.price_tasks"
]

# Beat schedule
celery_app.conf.beat_schedule = {
    "refresh-prices-every-1-minute": {
        "task": "app.tasks.price_tasks.refresh_prices_task",
        "schedule": crontab(minute="*/1"),
    },
}

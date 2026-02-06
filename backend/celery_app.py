import sys
import os
from celery import Celery
from celery.schedules import crontab

sys.path.append(os.path.dirname(__file__))

celery_app = Celery(
    "wealth_management",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.timezone = "Asia/Kolkata"

# Auto-discover
celery_app.autodiscover_tasks(["app.tasks"])

# Force import (important)
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

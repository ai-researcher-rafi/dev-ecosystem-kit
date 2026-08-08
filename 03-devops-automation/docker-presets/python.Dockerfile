### --- Build Stage ---

FROM python:3.11-slim AS builder
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential 

COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt 

### --- Production Stage ---

FROM python:3.11-slim AS runner
WORKDIR /app 

RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 && rm -rf /var/lib/apt/lists/* 

COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache /wheels/* 

COPY . . 

### Security: Run as non-root user

RUN useradd -u 8888 appuser && chown -R appuser:appuser /app
USER appuser 

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
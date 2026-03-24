FROM python:3.12-slim

WORKDIR /app

# install dependencies
RUN apt-get update && apt-get install -y ffmpeg

# copy files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# create directories
RUN mkdir -p uploads outputs

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
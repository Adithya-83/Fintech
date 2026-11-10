# 1. Use the official lightweight Python image
FROM python:3.9-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the local code to the container
COPY . /app

# 4. Install required dependencies
RUN pip install fastapi uvicorn

# 5. Expose the port FastAPI runs on
EXPOSE 8000

# 6. Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

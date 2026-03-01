#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

CONTAINER_NAME="quick-notes-api-smoke-test"
IMAGE_NAME="quick-notes-api-test"
PORT=3000

# Cleanup function to run when the script exits
cleanup() {
  echo "Cleaning up..."
  docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
  docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
}

# Trap exits and errors to always run cleanup
trap cleanup EXIT

echo "Building Docker image..."
docker build -t $IMAGE_NAME .

echo "Starting Docker container..."
docker run --name $CONTAINER_NAME -p $PORT:3000 -d $IMAGE_NAME

echo "Waiting for container to start..."
# Allow some time for the Node server to start inside the container
sleep 3

echo "Pinging health endpoint..."
MAX_RETRIES=5
RETRY_COUNT=0
HEALTH_OK=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://localhost:$PORT/health | grep -q '"ok":true'; then
    HEALTH_OK=true
    break
  fi
  echo "Endpoint not ready, retrying in 2 seconds..."
  sleep 2
  RETRY_COUNT=$((RETRY_COUNT+1))
done

if [ "$HEALTH_OK" = true ]; then
  echo "Smoke test passed successfully! Container is up and responding."
  exit 0
else
  echo "Smoke test failed! Container did not respond as expected."
  echo "Container logs:"
  docker logs $CONTAINER_NAME
  exit 1
fi

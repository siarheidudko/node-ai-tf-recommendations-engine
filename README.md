# The recommendation engine is based on AI TensorFlow

## Docker Compose

Run `docker compose up -d --force-recreate`, when you has been added `docker-compose.yml` file:

```yaml
name: tensorflow
services:
  webservice:
    image: sergdudko/node-ai-tf-recommendations-engine
    container_name: "node-ai-tf-recommendations-engine"
    environment:
      CLIENT_TOKEN: 00000000-0000-0000-0000-000000000000
      SERVER_TOKEN: 00000000-0000-0000-0000-000000000000
    ports:
      - "8013:8013"
    stdin_open: true
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    volumes:
      - matrix_tensor_storage:/app/tmp
volumes:
  matrix_tensor_storage:
```

Or just run commands:

```sh
docker volume create matrix_tensor_storage && \
docker run -d \
  --name node-ai-tf-recommendations-engine \
  --restart unless-stopped \
  --security-opt no-new-privileges:true \
  --env CLIENT_TOKEN=00000000-0000-0000-0000-000000000000 \
  --env SERVER_TOKEN=00000000-0000-0000-0000-000000000000 \
  --publish 8013:8013 \
  --volume matrix_tensor_storage:/app/tmp \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  sergdudko/node-ai-tf-recommendations-engine
```

For more information, see Swagger UI [http://localhost:8013](http://localhost:8013)

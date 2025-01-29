# The recommendation engine is based on AI TensorFlow

## Docker Compose

Run `docker compose build && docker compose up`, when you has been added `docker-compose.yml` file:

```yaml
version: "3.9"
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

For more information, see Swagger UI [http://localhost:10000](http://localhost:10000)

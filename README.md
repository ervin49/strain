# strain

Spring Boot project for managing a workout tracking application.

## Technologies used

- Spring Boot
- Spring Data JPA
- Spring Security for securing endpoints using cookie-based JWT authentication
- Gradle for building project
- Rest Assured + Testcontainers for integration tests
- Swagger for API documentation
- Lombok
- Dockerized PostgreSQL
- React for frontend
- Axios for fetching data from API
- Bootstrap for CSS styling

## Build & Run

```
docker compose up -d && ./gradlew bootRun
cd ./frontend/ && npm run dev
```

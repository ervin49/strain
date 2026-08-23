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
- React for web frontend
- React Native for mobile frontend
- Axios for fetching data from API
- Bootstrap for web styling
- Nativewind for mobile styling

## Build & Run

### Backend

```bash
docker compose up -d 
./gradlew bootRun
```


### Web

```bash

cd ./web/ && npm run dev
```


### Mobile

```bash

cd ./mobile/ && npx expo start
```

# Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# Make wrapper executable and download dependencies
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S fintracker && adduser -S fintracker -G fintracker

COPY --from=builder /app/target/*.jar app.jar

RUN chown fintracker:fintracker app.jar
USER fintracker

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

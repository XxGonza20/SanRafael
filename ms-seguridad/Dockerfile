# ==========================
#       BUILDER
# ==========================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn -q -B dependency:go-offline

COPY src ./src

RUN mvn -q -B clean package -DskipTests


# ==========================
#       RUNTIME
# ==========================
FROM eclipse-temurin:17-jre-jammy AS runtime

WORKDIR /app

COPY --from=builder /app/target/ms-seguridad-*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

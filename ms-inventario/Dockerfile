# =====================
#       BUILDER
# =====================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src

RUN mvn -B -q clean package -DskipTests


# =====================
#       RUNTIME
# =====================
FROM eclipse-temurin:17-jre-jammy AS runtime

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

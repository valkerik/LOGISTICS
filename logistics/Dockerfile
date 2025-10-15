# ---------- build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

# ---------- run stage ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Опционально: маленькие лимиты памяти как у тебя локально
ENV JAVA_TOOL_OPTIONS="-Xms128m -Xmx256m -XX:+UseSerialGC -XX:MetaspaceSize=96m -XX:MaxMetaspaceSize=128m -XX:CompressedClassSpaceSize=64m -XX:ReservedCodeCacheSize=64m -XX:MaxDirectMemorySize=64m"
# Переменные подключения можно переопределить из compose
ENV SPRING_PROFILES_ACTIVE=default
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]

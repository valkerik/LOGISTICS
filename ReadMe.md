# Транспортная компания - учебный проект (DB(PostgreSQL) + Back (RestAPI) + Front(JS + React))

**Стек**: Java 17, Spring Boot 3.5, Liquibase, Spring Security, Lombok, Docker Compose, NodeJS-22.20.0.

> Репозиторий предназначен для обучения: демонстрирует создание БД и хранение\отображение и обработка персональных данных в отдельных сервисах.

---

## Содержание

* Состав репозитория
* Быстрый старт
* Ручной запуск 
* Порты и сервисы
* Конфигурация


---

---------------------------------------------------------------------------

## Состав репозитория

```
LOGISTIC/
├─ logistic/                       # backend folder
│  ├─ src/main/java/net/proselyte/api/
│  │  ├─ rest/AuthRestControllerV1.java         # /v1/auth/* (login/refresh/me/registration)
│  │  ├─ service/{UserService,TokenService}.java
│  │  ├─ client/KeycloakClient.java             # вызовы в Keycloak
│  │  ├─ mapper/{TokenResponseMapper, ...}.java # MapStruct маппинги
│  │  ├─ aspect/LoginMetricAspect.java          # инкремент метрики логина
│  │  ├─ metric/LoginCountTotalMetric.java
│  │  └─ config/{SecurityConfig, KeycloakProperties, ...}.java
│  ├─ src/main/resources/{application.yml,logback.xml}
│  ├─ openapi/{individual-api.yaml,keycloak-api.yaml}
│  ├─ src/test/... (Testcontainers: Keycloak, WireMock, Postgres)
│  ├─ Dockerfile
│  └─ .env (переменные доступа к Nexus snapshots)
│
├─ architecture/                                # архитектурные артефакты
│
├─ person-service/            # Persons Service (Spring MVC + JPA)
│  ├─ src/main/java/net/proselyte/personservice/
│  │  ├─ rest/IndividualRestControllerV1.java   # /v1/persons
│  │  ├─ service/IndividualService.java
│  │  └─ util/DateTimeUtil.java
│  ├─ src/main/resources/{application.yml,logback.xml}
│  ├─ openapi/person-api.yaml                   # спецификация API
│  ├─ build.gradle.kts                          # включает openapi-generator и публикацию SDK
│  └─ Dockerfile                                # билд + publish в локальный Nexus
│
├─ infrastructure/
│  ├─ keycloak/realm-config.json                # импорт realm "individual"
│  ├─ grafana/provisioning/{datasources,dashboards}
│  ├─ prometheus/prometheus.yml
│  ├─ tempo/tempo.yaml
│  └─ loki/loki-config.yaml
│
├─ postman/
│  ├─ individuals_api_postman_collection.json       # postman коллекция для тестирования individuals-api
│  └─ persons_api_postman_collection.json           # postman коллекция для тестирования persons-api
├─ docker-compose.yml
└─ Makefile
```

---

## Быстрый старт

> Требуется: **Docker** (compose), **JDK 17**. Порты по умолчанию: 8080 (BackEnd), 80 (Front),5432 (PostgreSQL).

### Вариант A - через `Docker-compose` (рекомендуется)

```bash
# В корне репозитория

docker compose up --build
```

Что делает:

* поднимает создает и поднимает три контейнера (Postgres, BackEnd, Front);
* заполняет БД, публикует локально;
* стартует сервисы.

Проверка:

```bash
http://localhost:80/         
```

---

## Ручной запуск 

1. **Инфраструктура (только БД в Docker)**


   ```bash
   docker run -d --hostname logistic_db --name logistic_db -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=logistic -v postgres_data:/var/lib/postgresql/data --restart=unless-stopped postgres:16-alpine
   ```

   Дождитесь готовности.
2. **Запуск BackEND**

* Соберите приложение Spring boot с помощью  команды
```bash
    mvn -DskipTests package
```

* Запустите приложение Spring boot с помощью  команды
```bash
    java -jar target/logistics-0.0.1-SNAPSHOT.jar
```


3. **Запуск FrontEND**

*  Запустите Фронтовое приложение из корня фронта:
   ```bash
    npm run build
    ```
   
## Порты и сервисы


| Сервис   | Порт (host) | Описание       |
|----------|----------|----------------|
| BackEnd  | 8080     | Spring WEB App |
| Frontend | 80       | Front JS+React |



Ключевые параметры (дефолты):

* `datasource.username=postgres`
* `datasource.password=postgres`
* `spring.datasource.url=jdbc:postgresql://localhost:5432/logistic`



## Автор

* [Eugene Suleimanov](https://github.com/proselytear)
* [Vladislav Kolyago](https://github.com/kolyago-vladislav)
* [Software Engineering Telegram](https://t.me/esuleimanov)

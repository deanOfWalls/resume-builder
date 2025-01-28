# Build Stage
FROM amazoncorretto:17-alpine as build
WORKDIR /workspace/app

# Copy Maven Wrapper and project files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Make the Maven wrapper executable and install dependencies
RUN chmod +x ./mvnw
RUN ./mvnw install -DskipTests

# Extract the dependencies from the built JAR file
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Final Stage
FROM amazoncorretto:17-alpine

# Set up the working directory and arguments
WORKDIR /app
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency

# Copy dependencies and classes from the build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Create a non-root user for security (optional but recommended)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Entry point for running the application
ENTRYPOINT ["java", "-cp", "app:app/lib/*", "com.yourname.CRUD_TEMPLATE.MainApplication"]

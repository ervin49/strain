plugins {
    id("org.springframework.boot") version "4.0.6"
    id("io.spring.dependency-management") version "1.1.6"
    java
}

group = "com.fitnesslab"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

val mockitoAgent = configurations.create("mockitoAgent")
dependencies {
    mockitoAgent("org.mockito:mockito-core") { isTransitive = false }

    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("io.jsonwebtoken:jjwt-api:0.13.0")
    implementation("org.modelmapper:modelmapper:3.2.6")
    implementation("org.json:json:20251224")
    implementation("org.mapstruct:mapstruct:1.7.0.Beta1")
    implementation("org.mapstruct:mapstruct-processor:1.7.0.Beta1")
    annotationProcessor("org.mapstruct:mapstruct-processor:1.7.0.Beta1")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf:4.1.0-RC1")

    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.13.0")
    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("org.springframework.boot:spring-boot-devtools")

    compileOnly("org.projectlombok:lombok")
    testCompileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")

    testImplementation("org.testcontainers:testcontainers:2.0.5")
    implementation("org.springframework.boot:spring-boot-testcontainers:4.1.0-RC1")
    testImplementation("org.testcontainers:postgresql:1.21.4")
    testImplementation("org.testcontainers:testcontainers-junit-jupiter:2.0.5")
    testImplementation("org.junit.jupiter:junit-jupiter-api:6.0.3")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("io.rest-assured:rest-assured:6.0.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<Test> {
    jvmArgs("-javaagent:${mockitoAgent.asPath}")
}
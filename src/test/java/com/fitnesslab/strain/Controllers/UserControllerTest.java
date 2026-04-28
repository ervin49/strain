package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Repositories.UserRepository;
import com.fitnesslab.strain.Security.JwtUtils;
import com.fitnesslab.strain.Services.UserService;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.parsing.Parser;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public class UserControllerTest{

    @LocalServerPort
    private Integer port;

    private String jwt;

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @Autowired
    public UserControllerTest(UserRepository userRepository, UserService userService, JwtUtils jwtUtils){
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @BeforeEach
    public void setUp(){
        RestAssured.baseURI = "http://localhost:" + this.port;
        RestAssured.defaultParser = Parser.JSON;
        userRepository.deleteAll();
    }

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            "postgres:latest"
    );

    @BeforeAll
    static void beforeAll(){
        postgres.start();
    }

    @AfterAll
    static void afterAll(){
        postgres.stop();
    }

    @Test
    public void when_email_taken_return_message(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("password")
                .build();

        userRepository.save(user);
        given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/register")
                .then()
                .statusCode(400)
                .body(equalTo("User with this email already exists!"));
    }

    @Test
    public void when_short_password_return_bad_request(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("pass")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/register")
                .then()
                .statusCode(400)
                .body(equalTo("Password must be at least 8 characters long!"));
    }

    @Test
    public void when_no_uppercase_letters_return_bad_request(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("password!")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/register")
                .then()
                .statusCode(400)
                .body(equalTo("Password must have at least one uppercase letter and one special character!"));
    }

    @Test
    public void when_no_special_characters_return_bad_request(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("Password")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/register")
                .then()
                .statusCode(400)
                .body(equalTo("Password must have at least one uppercase letter and one special character!"));
    }

    @Test
    public void should_register(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("Password!")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/register")
                .then()
                .statusCode(201)
                .body(equalTo("Registration successful!"));
    }

    @Test
    public void when_login_with_wrong_email_return_bad_request(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("Password!")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/register")
                .then()
                .statusCode(201)
                .body(equalTo("Registration successful!"));
    }

    @Test
    public void when_login_with_wrong_password_return_bad_request(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("Password!")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/register")
                .then()
                .statusCode(201)
                .body(equalTo("Registration successful!"));
    }

    @Test
    public void should_login(){
        User user = User.builder()
                .email("user@example.com")
                .lastName("user")
                .firstName("user")
                .password("Password!")
                .build();
        userRepository.save(user);

        String result = given()
                .contentType(ContentType.JSON)
                .body(user)
                .port(port)
                .when()
                .post("/login")
                .then()
                .extract().response().path("jwt");

        assertThat(jwtUtils.isValidJWT(result)).isEqualTo(true);
    }

    
}

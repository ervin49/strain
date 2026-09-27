package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.dtos.requests.AuthRequest;
import com.fitnesslab.strain.model.dtos.requests.RegisterRequest;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.security.JwtUtils;
import com.fitnesslab.strain.service.UserService;
import io.jsonwebtoken.security.JwkThumbprint;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public class UserControllerTest{

    @LocalServerPort
    private Integer port;

    private Cookie tokenCookie;

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @Autowired
    public UserControllerTest(UserRepository userRepository, JwtUtils jwtUtils, UserService userService){
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @BeforeEach
    public void setUp(){
        RestAssured.baseURI = "http://localhost:" + port;
        userRepository.deleteAll();

        RegisterRequest admin = RegisterRequest.builder()
                .email("admin@admin.com")
                .firstName("admin")
                .lastName("admin")
                .password("AdminPassword!")
                .build();
        userService.register(admin);

        AuthRequest adminDTO = AuthRequest.builder()
                .email("admin@admin.com")
                .password("AdminPassword!")
                .build();
        String jwt = userService.login(adminDTO);

        tokenCookie = new Cookie.Builder("token", jwt).build();
    }

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            "postgres:latest"
    );

    @Test
    public void when_email_taken_return_message() throws Exception {
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("password")
                .build();

        userRepository.save(user);
        given().cookie(tokenCookie);
    }

    @Test
    public void when_short_password_return_error_message() {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("email","user@user.com");
        params.add("password","User!");
        params.add("firstName","user");
        params.add("lastName","user");
    }

    @Test
    public void when_no_uppercase_letters_return_bad_request() {
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("password!")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .when()
                .post("/register")
                .then()
                .statusCode(400)
                .body("[0]",equalTo(
                        "Password must have at least one uppercase letter " +
                                "and one special character."
                ));
    }

    @Test
    public void when_no_special_characters_return_bad_request(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(user)
                .when()
                .post("/register")
                .then()
                .statusCode(400)
                .body("[0]",equalTo(
                        "Password must have at least one uppercase letter " +
                                "and one special character."
                ));
    }

    @Test
    public void should_register(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password!")
                .build();

        Response response = given()
                .contentType(ContentType.JSON)
                .body(user)
                .when()
                .post("/register");

        assertThat(response.getStatusCode()).isEqualTo(201);
        assertThat(jwtUtils.isJWT(response.getCookie("token"))).isEqualTo(true);
    }

    @Test
    public void when_login_with_wrong_email_return_bad_request(){
        AuthRequest request = AuthRequest.builder()
                .email("user@user.com")
                .password("Password!")
                .build();

        given()
                .body(request)
                .contentType(ContentType.JSON)
                .when()
                .post("/login")
                .then()
                .statusCode(400)
                .body(equalTo("Email is wrong."));
    }

    @Test
    public void when_login_with_wrong_password_return_bad_request(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password!")
                .build();
        userRepository.save(user);

        AuthRequest userWithBadPass = AuthRequest.builder()
                .email("user@user.com")
                .password("badPassword")
                .build();

        given()
                .body(userWithBadPass)
                .contentType(ContentType.JSON)
                .when()
                .post("/login")
                .then()
                .statusCode(400)
                .body(equalTo("Password is wrong."));
    }

    @Test
    public void should_login(){
        RegisterRequest user = RegisterRequest.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password!")
                .build();
        userService.register(user);

        AuthRequest authRequest = AuthRequest.builder()
                .email("user@user.com")
                .password("Password!")
                .build();

        Response response = given()
                .contentType(ContentType.JSON)
                .body(authRequest)
                .when()
                .post("/login");

        assertThat(response.getStatusCode()).isEqualTo(200);
        assertThat(jwtUtils.isJWT(response.getCookie("token"))).isEqualTo(true);
    }

    @Test
    public void should_return_personal_details_of_user(){
        RegisterRequest user = RegisterRequest.builder()
                .email("user@user.com")
                .firstName("John")
                .lastName("John")
                .password("Password!")
                .build();
        userService.register(user);
        String userJwt = userService.login(new AuthRequest(user.getEmail(),user.getPassword()));
        Cookie cookie = new Cookie.Builder("token",userJwt).build();

        given()
                .cookie(cookie)
                .when()
                .get("/my-details")
                .then()
                .body("email",equalTo("user@user.com"),
                        "firstName",equalTo("John"));
    }
}

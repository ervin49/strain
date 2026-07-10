package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.model.dtos.requests.AuthRequest;
import com.fitnesslab.strain.model.entity.Role;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.security.JwtUtils;
import com.fitnesslab.strain.service.UserService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

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

    private String jwt;

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @Autowired
    UserControllerTest(UserRepository userRepository, JwtUtils jwtUtils, UserService userService){
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @BeforeEach
    public void setUp(){
        userRepository.deleteAll();

        User admin = User.builder()
                .email("admin@admin.com")
                .firstName("admin")
                .lastName("admin")
                .password("AdminPassword!")
                .role(Role.ADMIN)
                .build();
        userService.register(admin);

        AuthRequest adminDTO = AuthRequest.builder()
                .email("admin@admin.com")
                .password("AdminPassword!")
                .build();
        jwt = userService.login(adminDTO);
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
    public void when_email_taken_return_message() throws Exception {
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("password")
                .build();

        userRepository.save(user);
    }

    @Test
    public void when_short_password_return_error_message() throws Exception {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("email","user@user.com");
        params.add("password","User!");
        params.add("firstName","user");
        params.add("lastName","user");

    }

    @Test
    public void when_no_uppercase_letters_return_bad_request() throws Exception {
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("password!")
                .build();

    }

    @Test
    public void when_no_special_characters_return_bad_request(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password")
                .build();

    }

    @Test
    public void should_register(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password!")
                .build();

    }

    @Test
    public void when_login_with_wrong_email_return_bad_request(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password!")
                .build();

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

        User userWithBadPass = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("badPassword")
                .build();

    }

    @Test
    public void should_login(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("user")
                .lastName("user")
                .password("Password!")
                .build();
        userService.register(user);

        AuthRequest authRequest = new AuthRequest("user@user.com", "Password!");

    }

    @Test
    public void should_return_all_users(){
//        given()
//                .contentType(ContentType.JSON)
//                .header(new Header("Authorization","Bearer " + jwt))
//                .port(port)
//                .when()
//                .get("/users")
//                .then()
//                .body();
    }

    @Test
    public void should_return_personal_details_of_user(){
        User user = User.builder()
                .email("user@user.com")
                .firstName("John")
                .lastName("John")
                .password("Password!")
                .build();
        userService.register(user);
        String userJwt = userService.login(new AuthRequest(user.getEmail(),user.getPassword()));

//        given()
//                .contentType(ContentType.JSON)
//                .header(new Header("Authorization","Bearer " + userJwt))
//                .port(port)
//                .when()
//                .get("/my-account")
//                .then()
//                .body();
    }
}

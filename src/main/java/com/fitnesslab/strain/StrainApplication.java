package com.fitnesslab.strain;

import com.fitnesslab.strain.Services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class StrainApplication {
    public static void main(String[] args) {
        SpringApplication.run(StrainApplication.class, args);
    }

}

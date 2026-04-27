package com.fitnesslab.strain;

import com.fitnesslab.strain.Services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@SpringBootApplication
public class StrainApplication {
    @Autowired
    private EmailService service;

    public static void main(String[] args) {
        SpringApplication.run(StrainApplication.class, args);
    }

}

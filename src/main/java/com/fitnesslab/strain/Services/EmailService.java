package com.fitnesslab.strain.Services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailService {
    private final JavaMailSenderImpl mailSender;

    public EmailService(JavaMailSenderImpl mailSender){
        this.mailSender = mailSender;
    }

    public void sendEmail(String email, String subject, String body){
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom("noreply@strain.com");
        mail.setTo(email);
        mail.setSubject(subject);
        mail.setText(body);
        mailSender.send(mail);
    }
}

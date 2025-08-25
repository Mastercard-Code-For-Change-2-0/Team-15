package org.mastercard.backend.MailPipeLine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.mastercard.backend.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String body, String subject) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false); // false -> No attachment

        mimeMessageHelper.setFrom("3e76c7f4279e21");
        mimeMessageHelper.setTo(toEmail);
        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(body, true); // Set true if the body contains HTML
        System.out.println("here");
        mailSender.send(mimeMessage);
        System.out.println("Email sent successfully!");
    }

    public Boolean sendingMailToStudents(List<Student> students, String subject, String bodyTemplate) {
        try {
            for (Student student : students) {
                String email = student.getEmail();
                String name = student.getFirstName() + " " + student.getMiddleName() + " " + student.getLastName();
                String username = student.getEmail();
                String password = student.getPassword();

                // ✅ Replace placeholders dynamically
                String personalizedBody = bodyTemplate
                        .replace("{studentName}", name)
                        .replace("{username}", username)
                        .replace("{password}", password);

                sendEmail(email, personalizedBody, subject);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
package org.mastercard.backend.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.mastercard.backend.MailPipeLine.EmailSenderService;
import org.mastercard.backend.model.Student;
import org.mastercard.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CSVService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    @Transactional
    public void saveUsersFromCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            List<Student> students = new ArrayList<>();

            for (CSVRecord record : csvParser) {

                Student student = Student
                        .builder()
                        .rollNo(Integer.parseInt(record.get("rollNo")))
                        .firstName(record.get("firstName"))
                        .middleName(record.get("middleName"))
                        .lastName(record.get("lastName"))
                        .email(record.get("email"))
                        .password(record.get("password"))
                        .experience(record.get("experience"))
                        .skills(Arrays.asList(record.get("skills").split(","))) // assuming comma-separated skills
                        .education(record.get("education"))
                        .description(record.get("description"))
                        .activated(Boolean.parseBoolean(record.get("activated")))
                        .build();
                students.add(student);
            }
            studentRepository.saveAll(students);
            String subject = "Your Student Portal Credentials";
            String body = "<p>Dear <b>{studentName}</b>,</p>" +
                    "<p>Welcome to our Student Portal.</p>" +
                    "<p>Your login credentials are:</p>" +
                    "<ul>" +
                    "<li>Username: <b>{username}</b></li>" +
                    "<li>Password: <b>{password}</b></li>" +
                    "</ul>" +
                    "<p>Please keep this information secure.</p>" +
                    "<br><p>Best regards,<br>Admin Team</p>";
            emailSenderService.sendingMailToStudents(students, subject, body);

        } catch (Exception e) {
            throw new RuntimeException("Error while processing CSV file: " + e.getMessage());
        }
    }
}

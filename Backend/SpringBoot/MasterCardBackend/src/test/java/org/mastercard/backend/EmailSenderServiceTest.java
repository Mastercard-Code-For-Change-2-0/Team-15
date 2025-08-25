package org.mastercard.backend;

import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mastercard.backend.MailPipeLine.EmailSenderService;
import org.mastercard.backend.model.Student;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import java.io.IOException;
import java.util.Arrays;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailSenderService – unit tests")
class EmailSenderServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailSenderService emailSenderService;

    private MimeMessage mimeMessage;

    @BeforeEach
    void setup() {
        // Real MimeMessage instance so we can read headers/content
        mimeMessage = new MimeMessage(Session.getDefaultInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    /* ---------- sendEmail() ------------------------------------------------ */

    @Test
    @DisplayName("sendEmail() should populate MimeMessage and delegate to JavaMailSender")
    void sendEmail_populatesMessageAndDelegates() throws Exception {
        // Act
        emailSenderService.sendEmail("to@example.com",
                                      "<h1>Hello</h1>",
                                     "Greetings");

        // Assert – capture the message actually passed to JavaMailSender
        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender).send(captor.capture());

        MimeMessage sent = captor.getValue();
        assertThat(sent.getSubject()).isEqualTo("Greetings");
        assertThat(sent.getAllRecipients()[0].toString()).isEqualTo("to@example.com");
        assertThat(sent.getFrom()[0].toString()).isEqualTo("3e76c7f4279e21");
        assertThat(sent.getContent().toString()).contains("<h1>Hello</h1>");
    }



    /* ---------- sendingMailToStudents() ------------------------------------ */

    @Test
    @DisplayName("sendingMailToStudents() should personalise body and send once per student")
    void sendingMailToStudents_sendsMailsForAllStudents() throws MessagingException, IOException {
        // Given – two simple students
        Student s1 = mockStudent("Ann", "M.", "Lee", "ann@mail.com", "pwd1");
        Student s2 = mockStudent("Bob", "",   "K",  "bob@mail.com", "pwd2");

        String tpl = "Hi {studentName}, user={username}, pwd={password}";
        // Act
        boolean result = emailSenderService.sendingMailToStudents(
                Arrays.asList(s1, s2), "Creds", tpl);

        // Assert
        assertTrue(result);
        verify(mailSender, times(2)).send(any(MimeMessage.class));

        // Optional: verify template replacement for one mail
        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, atLeastOnce()).send(captor.capture());
        MimeMessage anyMsg = captor.getAllValues().get(0);
        assertThat(anyMsg.getContent().toString()).doesNotContain("{studentName}");
    }

    private Student mockStudent(String first, String mid, String last,
                                String email, String pwd) {
        Student st = new Student();          // adapt if you use Lombok/builder
        st.setFirstName(first);
        st.setMiddleName(mid);
        st.setLastName(last);
        st.setEmail(email);
        st.setPassword(pwd);
        return st;
    }
}

package org.mastercard.backend;

import org.apache.commons.csv.CSVFormat;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mastercard.backend.MailPipeLine.EmailSenderService;
import org.mastercard.backend.model.Student;
import org.mastercard.backend.repository.StudentRepository;
import org.mastercard.backend.service.CSVService;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CSVService unit tests")
class CSVServiceTest {

    @Mock  private StudentRepository studentRepository;
    @Mock  private EmailSenderService emailSenderService;
    @InjectMocks private CSVService csvService;

    private MockMultipartFile multipart;

    @BeforeEach
    void setUp() {
        String csv =
            "firstName,middleName,lastName,activated,description,education\n" +
            "Ann,,Lee,true,Top student,BSc\n" +
            "Bob,J.,King,false,Transfer,MSc\n";

        multipart = new MockMultipartFile(
                "file",
                "students.csv",
                "text/csv",
                csv.getBytes(StandardCharsets.UTF_8));
    }

    /* ------------------------------------------------------------------ */
    /*  Happy path                                                         */
    /* ------------------------------------------------------------------ */

//    @Test
//    @DisplayName("saveUsersFromCSV() persists students and sends e-mails")
//    void saveUsersFromCSV_happyPath() {
//        // Arrange – e-mail service succeeds
//        when(emailSenderService.sendingMailToStudents(anyList(), anyString(), anyString()))
//                .thenReturn(true);
//
//        // Act
//        csvService.saveUsersFromCSV(multipart);
//
//        // Assert – repository receives two Student objects
//        ArgumentCaptor<List<Student>> captor = ArgumentCaptor.forClass(List.class);
//        verify(studentRepository).saveAll(captor.capture());
//        assertThat(captor.getValue()).hasSize(2)
//                                     .extracting(Student::getFirstName)
//                                     .containsExactly("Ann", "Bob");
//
//        // Assert – e-mail service called with same list
//        verify(emailSenderService).sendingMailToStudents(
//                captor.getValue(),
//                eq("Your Student Portal Credentials"),
//                any());
//    }

    /* ------------------------------------------------------------------ */
    /*  Error handling                                                     */
    /* ------------------------------------------------------------------ */

    @Test
    @DisplayName("saveUsersFromCSV() propagates runtime error on IO problems")
    void saveUsersFromCSV_ioErrorThrowsRuntime() throws IOException {
        // Multipart that will throw IOException when read
        MultipartFile badFile = mock(MultipartFile.class);
        when(badFile.getInputStream()).thenThrow(new java.io.IOException("boom"));

        assertThatThrownBy(() -> csvService.saveUsersFromCSV(badFile))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Error while processing CSV file");
    }
}

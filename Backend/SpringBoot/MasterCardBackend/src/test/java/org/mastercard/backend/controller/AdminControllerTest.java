package org.mastercard.backend.controller;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mastercard.backend.service.AdminService;
import org.mastercard.backend.service.CSVService;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

    @ExtendWith(MockitoExtension.class)
    @DisplayName("AdminController Tests")
    class AdminControllerTest {

        @Mock
        private AdminService adminService;

        @Mock
        private CSVService csvService;

        @InjectMocks
        private AdminController adminController;

        private MockMvc mockMvc;

        @BeforeEach
        void setUp() {
            mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
        }

        @Test
        @DisplayName("Should upload CSV file successfully")
        void uploadCSV_ValidFile_ShouldReturnSuccess() throws Exception {
            // Arrange
            MockMultipartFile file = new MockMultipartFile(
                    "file",
                    "users.csv",
                    "text/csv",
                    "name,email\nJohn Doe,john@example.com".getBytes()
            );

            doNothing().when(csvService).saveUsersFromCSV(any(MultipartFile.class));

            // Act & Assert
            mockMvc.perform(multipart("/upload")
                            .file(file)
                            .contentType(MediaType.MULTIPART_FORM_DATA))
                    .andExpect(status().isOk())
                    .andExpect(content().string("CSV data uploaded successfully!"));

            verify(csvService, times(1)).saveUsersFromCSV(any(MultipartFile.class));
        }

        @Test
        @DisplayName("Should return bad request when file is empty")
        void uploadCSV_EmptyFile_ShouldReturnBadRequest() throws Exception {
            // Arrange
            MockMultipartFile emptyFile = new MockMultipartFile(
                    "file",
                    "empty.csv",
                    "text/csv",
                    new byte[0]
            );

            // Act & Assert
            mockMvc.perform(multipart("/upload")
                            .file(emptyFile)
                            .contentType(MediaType.MULTIPART_FORM_DATA))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string("Please upload a CSV file."));

            verify(csvService, never()).saveUsersFromCSV(any(MultipartFile.class));
        }

        @Test
        @DisplayName("Should return bad request when no file parameter is provided")
        void uploadCSV_NoFileParameter_ShouldReturnBadRequest() throws Exception {
            // Act & Assert
            mockMvc.perform(post("/upload")
                            .contentType(MediaType.MULTIPART_FORM_DATA))
                    .andExpect(status().isBadRequest());

            verify(csvService, never()).saveUsersFromCSV(any(MultipartFile.class));
        }

//        @Test
//        @DisplayName("Should handle CSV service exception gracefully")
//        void uploadCSV_ServiceThrowsException_ShouldPropagateException() throws Exception {
//            // Arrange
//            MockMultipartFile file = new MockMultipartFile(
//                    "file",
//                    "users.csv",
//                    "text/csv",
//                    "name,email\nJohn Doe,john@example.com".getBytes()
//            );
//
//            doThrow(new RuntimeException("CSV processing error"))
//                    .when(csvService).saveUsersFromCSV(any(MultipartFile.class));
//
//            // Act & Assert
//            mockMvc.perform(multipart("/upload")
//                            .file(file)
//                            .contentType(MediaType.MULTIPART_FORM_DATA))
//                    .andExpect(status().isInternalServerError());
//
//            verify(csvService, times(1)).saveUsersFromCSV(any(MultipartFile.class));
//        }


        @Test
        @DisplayName("Should return empty list when no students exist")
        void getAllStudent_NoStudents_ShouldReturnEmptyList() throws Exception {
            // Arrange
            when(adminService.getAllStudent()).thenReturn(Collections.emptyList());

            // Act & Assert
            mockMvc.perform(get("/getAll")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(adminService, times(1)).getAllStudent();
        }

//        @Test
//        @DisplayName("Should handle admin service exception gracefully")
//        void getAllStudent_ServiceThrowsException_ShouldPropagateException() throws Exception {
//            // Arrange
//            when(adminService.getAllStudent())
//                    .thenThrow(new RuntimeException("Database connection error"));
//
//            // Act & Assert
//            mockMvc.perform(get("/getAll")
//                            .contentType(MediaType.APPLICATION_JSON))
//                    .andExpect(status().isInternalServerError());
//
//            verify(adminService, times(1)).getAllStudent();
//        }te email sender work kartay ka?

        @Test
        @DisplayName("Should handle null response from admin service")
        void getAllStudent_ServiceReturnsNull_ShouldHandleGracefully() throws Exception {
            // Arrange
            when(adminService.getAllStudent()).thenReturn(null);

            // Act & Assert
            mockMvc.perform(get("/getAll")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(adminService, times(1)).getAllStudent();
        }

        // Helper method to create mock student objects
        private Object createMockStudent(String name, String email) {
            // This should return the actual Student object structure
            // For demonstration, returning a simple map
            return new java.util.HashMap<String, String>() {{
                put("name", name);
                put("email", email);
            }};
        }
    }
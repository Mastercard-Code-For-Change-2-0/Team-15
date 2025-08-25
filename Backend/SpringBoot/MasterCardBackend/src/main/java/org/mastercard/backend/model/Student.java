package org.mastercard.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "students")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Student {
    @Id
    private String id;

    private Integer rollNo;

    private String firstName;
    private String middleName;
    private String lastName;

    private String email;
    private String password;

    private String experience;
    private List<String> skills;
    private String education;
    private String description;

    private Boolean activated;
}

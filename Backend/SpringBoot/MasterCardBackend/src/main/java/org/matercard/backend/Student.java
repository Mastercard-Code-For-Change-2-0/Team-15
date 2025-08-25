package org.matercard.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    @Id
    private String id;   // MongoDB will auto-generate _id
    private Integer rollNo;
    private String firstName;
    private String middleName;
    private String lastName;
    private Boolean activated;
    private String adminId;
}

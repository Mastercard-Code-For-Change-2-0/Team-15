package org.mastercard.backend.repository;

import org.mastercard.backend.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudentRepository extends MongoRepository<Student , String> {
}

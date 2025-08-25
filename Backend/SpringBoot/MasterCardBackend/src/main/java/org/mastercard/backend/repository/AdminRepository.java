package org.mastercard.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.mastercard.backend.model.Admin;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends MongoRepository<Admin,String> {
    Admin findAdminByEmail(String email);

}

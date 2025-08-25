package org.mastercard.backend.service;

import org.mastercard.backend.model.Admin;
import org.mastercard.backend.model.Student;
import org.mastercard.backend.repository.AdminRepository;
import org.mastercard.backend.repository.StudentRepository;
import org.mastercard.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtService jwtService;
    @Autowired
    private AdminRepository adminRepository;
    public List<Student> getAllStudent() {
        return studentRepository.findAll();
    }

    public String validate(String username, String password) {
        try{
//            String username = aesUtil.encryptPlainText(u.getUsername());
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username, password
                    )
            );
            System.out.println(2);
            if (authenticate.isAuthenticated()) {
                System.out.println(3);
                //after login send the token
                return jwtService.generateToken(username);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    public Object addAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
}
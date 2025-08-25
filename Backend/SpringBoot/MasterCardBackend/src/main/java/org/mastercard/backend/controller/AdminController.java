package org.mastercard.backend.controller;

import org.mastercard.backend.model.Admin;
import org.mastercard.backend.service.AdminService;
import org.mastercard.backend.service.CSVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin
public class AdminController {


    @Autowired
    private AdminService adminService;

    @Autowired
    private CSVService csvService;


    // Adding user in bulk using csv file
    @PostMapping("/upload")
    public ResponseEntity<String> uploadCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a CSV file.");
        }
        csvService.saveUsersFromCSV(file);
        return ResponseEntity.ok("CSV data uploaded successfully!");
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> GetAllStudent(){
        return ResponseEntity.status(HttpStatus.OK).body(adminService.getAllStudent());
    }

    @PostMapping("/adminLogin")
    public ResponseEntity<?> Login(@RequestParam("username") String username  ,@RequestParam("password") String password) {
        return ResponseEntity.status(HttpStatus.OK).body(adminService.validate(username , password));
    }

    @PostMapping("/adminRegister")
    public ResponseEntity<?> register(@RequestBody Admin admin) {
        return ResponseEntity.status(HttpStatus.OK).body(adminService.addAdmin(admin));
    }
}

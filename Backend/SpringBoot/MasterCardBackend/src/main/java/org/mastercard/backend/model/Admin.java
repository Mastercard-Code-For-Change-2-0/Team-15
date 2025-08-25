package org.mastercard.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document
public class Admin {
    @Id
    private String adminId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean isExpired;

//    @Override
//    Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of("ADMIN");
//    }
//    @Override
//    public String getUsername(){
//        return email;
//    }
//
//    @Override
//    public String getUsername() {
//        return email;
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return isExpired;
//    }
}

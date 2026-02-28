package com.rozgaarsetu.security;

import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Loads user-specific data during authentication.
 * Supports login by phone number OR email address.
 * If the identifier contains '@' it is treated as email; otherwise as phone.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user;
        if (identifier != null && identifier.contains("@")) {
            // Email-based lookup
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + identifier));
        } else {
            // Phone-based lookup (default)
            user = userRepository.findByPhone(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + identifier));
        }

        // Use the stored phone as the principal username for JWT consistency
        String principalId = (user.getPhone() != null) ? user.getPhone() : user.getEmail();

        return org.springframework.security.core.userdetails.User.builder()
                .username(principalId)
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())))
                .disabled(false)
                .accountExpired(false)
                .accountLocked("TERMINATED".equals(user.getAccountStatus()))
                .credentialsExpired(false)
                .build();
    }
}

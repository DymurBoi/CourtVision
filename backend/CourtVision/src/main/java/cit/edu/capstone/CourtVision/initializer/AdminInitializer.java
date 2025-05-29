package cit.edu.capstone.CourtVision.initializer;

import cit.edu.capstone.CourtVision.entity.Admin;
import cit.edu.capstone.CourtVision.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {

    private final AdminRepository adminRepository;

    // Constructor injection
    public AdminInitializer(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Bean
    public CommandLineRunner runOnFirstStart() {
        return args -> {
            // Check if an Admin with the specified email exists
            String defaultAdminEmail = "admin@gmail.com";
            if (adminRepository.findByEmail(defaultAdminEmail) == null) {
                // Create the default admin if not already present
                Admin admin = new Admin();
                admin.setEmail(defaultAdminEmail);

                // Hash the password before saving (using BCrypt)
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                String hashedPassword = passwordEncoder.encode("password123");
                admin.setPassword(hashedPassword);

                admin.setIsAdmin(true);
                admin.setIsCoach(false); // Adjust this depending on your logic

                // Save the Admin entity
                adminRepository.save(admin);
                System.out.println("Inserted default Admin record!");
            }
        };
    }
}

 package cit.edu.capstone.CourtVision;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableMethodSecurity
@SpringBootApplication
public class CourtVisionApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourtVisionApplication.class, args);
	}

}

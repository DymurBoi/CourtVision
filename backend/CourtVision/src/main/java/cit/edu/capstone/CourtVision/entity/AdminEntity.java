package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Admin")
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int adminId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private boolean isCoach;
    private boolean isAdmin;

    // Constructors
    public AdminEntity() {}

    public AdminEntity(int adminId, String email, String password, boolean isCoach, boolean isAdmin) {
        this.adminId = adminId;
        this.email = email;
        this.password = password;
        this.isCoach = isCoach;
        this.isAdmin = isAdmin;
    }

    // Getters and Setters
    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isCoach() {
        return isCoach;
    }

    public void setCoach(boolean coach) {
        isCoach = coach;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}

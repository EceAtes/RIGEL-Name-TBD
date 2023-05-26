package com.example.rigel_v1.domain;

import com.example.rigel_v1.controllers.UsersController;
import com.example.rigel_v1.domain.enums.CourseName;
import com.example.rigel_v1.domain.enums.Role;
import com.example.rigel_v1.service.UsersService;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

//@Document("Administrations")
@Component
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Secretary extends Users{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToMany
    @JoinColumn(name = "secretary_id")
    private Map<Integer, GradeForm> gradeForms;

    public Secretary(String name, String email, String password, boolean notificationToMail, Department department) {
        super(name, email, password, notificationToMail, Role.SECRETARY, department);
        this.gradeForms = new HashMap<>();
    }

    /*public Secretary(Map<Integer, CriteriaReport> criteriaReports, File eSignature, Map<Integer, EvaluationForm> EvaluationForm, Map<Integer, GradeForm> gradeForms) {//, Statistics statistics
        super(criteriaReports, eSignature);//, statistics
        this.EvaluationForm = EvaluationForm;
        this.gradeForms = gradeForms;
    }*/

    /*ublic Secretary(String name, String email, String password, boolean notificationToMail, Department department, Map<Integer, CriteriaReport> criteriaReports, File eSignature, Map<Integer, EvaluationForm> EvaluationForm, Map<Integer, GradeForm> gradeForms) {//, Statistics statistics
        super(name, email, password, notificationToMail, Role.SECRETARY, department, criteriaReports, eSignature);//, statistics
        this.gradeForms = gradeForms;
    }*/

    /*public Secretary(String name, String email, String password, boolean notificationToMail, Department department, Set<Notification> notification, Map<Integer, CriteriaReport> criteriaReports, File eSignature, Map<Integer, EvaluationForm> EvaluationForm, Map<Integer, GradeForm> gradeForms) {//, Statistics statistics
        super(name, email, password, notificationToMail, Role.SECRETARY, department, notification, criteriaReports, eSignature);//, statistics
        this.EvaluationForm = EvaluationForm;
        this.gradeForms = gradeForms;
    }*/

    public void addUser(UsersService usersService, String name, String email, String password, boolean notifToMail, Role role, int studentId, CourseName[] courseTypes){
        Users newUser = usersService.createUser(name, email, password, notifToMail, role, this.getDepartment(), studentId);
        if(role == Role.STUDENT){   ///equals()??
            for(int i = 0; i < courseTypes.length; i++){
                StudentCourse studentCourse = new StudentCourse((Student) newUser, courseTypes[i]);
                ((Student) newUser).getCourses().add(studentCourse);
            }
        }
    }

    public void automatch(UsersService usersService){
        HashMap<Long, Student> allStudents = new HashMap<>();
        allStudents.putAll(this.getDepartment().getStudents_299());
        allStudents.putAll(this.getDepartment().getStudents_399());
        usersService.automatch(this.getDepartment());
    }

    public void rematchStudent(UsersService usersService, Long instructorId, Long courseId){
        usersService.rematchStudent(instructorId, courseId);
    }

    //hardcoded path
    public void createStudentsFromFile(UsersService usersService){
        String basePath = System.getProperty("user.dir");
        String filePath = basePath + "\\users.txt";

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                Scanner scanner = new Scanner(line);
                scanner.useDelimiter(",(?![^\\[]*\\])"); // Delimiter to split the line

                int studentId = 0;
                CourseName[] courseNames = new CourseName[2];

                String name = scanner.next().trim();
                String email = scanner.next().trim();
                String password = scanner.next().trim();
                boolean notifToMail = Boolean.parseBoolean(scanner.next().trim());
                Role role = Role.valueOf(scanner.next().trim());
                if(scanner.hasNext()){
                    studentId = Integer.parseInt(scanner.next().trim());
                }
                if(scanner.hasNext()){
                    String arrayString = scanner.next();
                    String[] array = arrayString.replaceAll("\\[|\\]", "").split(",");
                    for(int i = 0; i < array.length; i++){
                        array[i] = array[i].trim();
                        CourseName courseName = CourseName.valueOf(array[i]);
                        courseNames[i] = courseName;
                    }
                }

                scanner.close();
                addUser(usersService, name, email, password, notifToMail, role, studentId, courseNames);

                    // Print the extracted values


                }
            } catch (IOException e) {
                e.printStackTrace();
            }
    }
}



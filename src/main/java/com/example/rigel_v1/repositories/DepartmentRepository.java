package com.example.rigel_v1.repositories;

import com.example.rigel_v1.domain.Department;
import org.springframework.data.repository.CrudRepository;

public interface DepartmentRepository extends CrudRepository<Department, Long> {

}
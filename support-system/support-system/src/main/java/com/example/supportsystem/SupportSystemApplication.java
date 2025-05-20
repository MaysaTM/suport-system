package com.example.supportsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.example.supportsystem.model")
public class SupportSystemApplication {
	public static void main(String[] args) {
		SpringApplication.run(SupportSystemApplication.class, args);
	}
}
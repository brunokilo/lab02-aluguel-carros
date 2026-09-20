package com.alucar.alucar;

import org.springframework.boot.SpringApplication;

public class TestAlucarApplication {

	public static void main(String[] args) {
		SpringApplication.from(AlucarApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}

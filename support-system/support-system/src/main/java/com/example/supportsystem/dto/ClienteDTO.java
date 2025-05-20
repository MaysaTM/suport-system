package com.example.supportsystem.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ClienteDTO {
    private Long id;

    @NotBlank(message = "Nome completo/Razão Social é obrigatório")
    private String nomeCompleto;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    private String tipo;
    private String status;

    @Size(min = 11, max = 18, message = "Documento inválido")
    private String documento;
}
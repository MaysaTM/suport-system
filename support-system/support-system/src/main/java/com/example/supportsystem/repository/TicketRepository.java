package com.example.supportsystem.repository;

import com.example.supportsystem.model.Ticket;
import com.example.supportsystem.model.Ticket.Status;
import com.example.supportsystem.model.Ticket.Prioridade;
import com.example.supportsystem.model.Ticket.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Consulta para buscar tickets com cliente carregado (JOIN FETCH)
    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente")
    List<Ticket> findAllWithCliente();

    // Consulta para buscar tickets por cliente
    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente WHERE t.cliente.id = :clienteId")
    List<Ticket> findByCliente_Id(Long clienteId);

    // Consulta para buscar os 5 tickets mais recentes com cliente
    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente ORDER BY t.dataCriacao DESC LIMIT 5")
    List<Ticket> findTop5ByOrderByDataCriacaoDesc();

    // Consultas para filtros com JOIN FETCH
    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente WHERE t.status = :status")
    List<Ticket> findByStatus(Status status);

    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente WHERE t.prioridade = :prioridade")
    List<Ticket> findByPrioridade(Prioridade prioridade);

    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente WHERE t.categoria = :categoria")
    List<Ticket> findByCategoria(Categoria categoria);

    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente WHERE t.status = :status AND t.prioridade = :prioridade")
    List<Ticket> findByStatusAndPrioridade(Status status, Prioridade prioridade);

    // Consulta para filtrar por período
    @Query("SELECT t FROM Ticket t JOIN FETCH t.cliente WHERE t.dataCriacao BETWEEN :dataInicio AND :dataFim")
    List<Ticket> findByDataCriacaoBetween(LocalDateTime dataInicio, LocalDateTime dataFim);

    // Consulta para dashboard - contagem de tickets por status
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = :status")
    Long countByStatus(Status status);
}
package com.matienzoShop.celulares.celular.repository;

import com.matienzoShop.celulares.celular.model.Celular;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CelularRepository extends JpaRepository<Celular, Long> {

    @Query(
            value = """
        SELECT *
        FROM celulares c
        WHERE (:marca IS NULL OR c.marca = :marca)
          AND (:minBateria IS NULL OR c.bateria >= :minBateria)
          AND (:maxBateria IS NULL OR c.bateria <= :maxBateria)
          AND (:almacenamiento IS NULL OR c.almacenamiento = :almacenamiento)
          AND (
              :search IS NULL
              OR c.modelo ILIKE '%' || CAST(:search AS text) || '%'
          )
        """,
            countQuery = """
        SELECT count(*)
        FROM celulares c
        WHERE (:marca IS NULL OR c.marca = :marca)
          AND (:minBateria IS NULL OR c.bateria >= :minBateria)
          AND (:maxBateria IS NULL OR c.bateria <= :maxBateria)
          AND (:almacenamiento IS NULL OR c.almacenamiento = :almacenamiento)
          AND (
              :search IS NULL
              OR c.modelo ILIKE '%' || CAST(:search AS text) || '%'
          )
        """,
            nativeQuery = true
    )
    Page<Celular> buscarConFiltros(
            @Param("marca") String marca,
            @Param("minBateria") Integer minBateria,
            @Param("maxBateria") Integer maxBateria,
            @Param("almacenamiento") Integer almacenamiento,
            @Param("search") String search,
            Pageable pageable
    );

}

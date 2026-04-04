package com.matienzoShop.celulares.celular.service;

import com.matienzoShop.celulares.celular.model.Celular;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CelularService {
    List<Celular> listarTodos();
    Page<Celular> obtenerCelularesFiltrados(String marca, Integer minBat, Integer maxBat, Integer almacenamiento, String search, Pageable pageable);
    Celular guardar(Celular celular);
    Celular buscarPorId(Long id);
    void eliminar (Long Id);
    void guardarTodos(List<@Valid Celular> listaCelulares);
}

package com.matienzoShop.celulares.celular.service;

import com.matienzoShop.celulares.celular.model.Celular;
import com.matienzoShop.celulares.celular.repository.CelularRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CelularServiceImpl implements CelularService{

    private final CelularRepository celularRepository;

    public CelularServiceImpl (CelularRepository celularRepository){
        this.celularRepository = celularRepository;
    }

    @Override
    public List<Celular> listarTodos() {
        return celularRepository.findAll();
    }

    @Override
    public Celular guardar(Celular celular) {
        return celularRepository.save(celular);
    }

    @Override
    public Celular buscarPorId (Long id){
        return celularRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Celular no encontrado"));
    }

    @Override
    public void eliminar(Long id) {
        celularRepository.deleteById(id);
    }

    @Override
    public void guardarTodos(List<@Valid Celular> listaCelulares) {
        celularRepository.saveAll(listaCelulares);
    }

    @Override
    public Page<Celular> obtenerCelularesFiltrados (String marca, Integer minBat, Integer maxBat, Integer almacenamiento, String search, Pageable pageable){
        if (marca != null && marca.trim().isEmpty()) marca = null;

        if (search != null && search.trim().isEmpty()) {
            search = null;
        }

        return celularRepository.buscarConFiltros(marca, minBat, maxBat, almacenamiento, search, pageable);
    }

}

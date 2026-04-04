package com.matienzoShop.celulares.celular.controller;

import com.matienzoShop.celulares.celular.model.Celular;
import com.matienzoShop.celulares.celular.service.CelularService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins= "http://localhost:5173")
@RestController
@RequestMapping("/celulares")
public class CelularController {

    private final CelularService celularService;

    public CelularController (CelularService celularService){
        this.celularService = celularService;
    }

    @GetMapping
    public ResponseEntity<Page<Celular>> obtenerCelulares (
            @RequestParam (required = false) String marca,
            @RequestParam (required = false) Integer minBateria,
            @RequestParam (required = false) Integer maxBateria,
            @RequestParam (required = false) Integer almacenamiento,
            @RequestParam (required = false) String search,

            @RequestParam (defaultValue = "0") int page,
            @RequestParam (defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page,size);

        Page<Celular> paginaCelulares = celularService.obtenerCelularesFiltrados(
                marca, minBateria, maxBateria, almacenamiento, search, pageable
        );
        return ResponseEntity.ok(paginaCelulares);
    }

    @GetMapping("/{id}")
    public Celular obtenerCelular (@PathVariable Long id){
        return celularService.buscarPorId(id);
    }

    @PostMapping("/añadirCel")
    public ResponseEntity<?> guardarCelular(@Valid @RequestBody Celular celular){
        Celular celularNuevo = celularService.guardar(celular);

        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "¡Celular cargado correctamente!");
        response.put("celular", celularNuevo);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/cargaMasiva")
    public ResponseEntity<?> guardarListaCelulares (@RequestBody List<@Valid Celular> listaCelulares){
        celularService.guardarTodos(listaCelulares);

        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Se han cargado " + listaCelulares.size() + " celulares exitosamente.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarCelular (@PathVariable Long id){
        celularService.eliminar(id);
    }
}

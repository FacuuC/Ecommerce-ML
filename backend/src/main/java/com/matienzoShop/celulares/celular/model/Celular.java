package com.matienzoShop.celulares.celular.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

@Entity
@Table(name="celulares")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@ToString
public class Celular {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La marca no puede estar vacía")
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    @Column(columnDefinition = "VARCHAR(255)", nullable = false)
    private String modelo;

    @Column(columnDefinition = "VARCHAR(50)")
    private String color;

    @Min(value =0, message = "El almacenamiento no puede ser negativo")
    @Column(nullable = false)
    private Integer almacenamiento;

    @Min(value=0, message = "La batería no puede ser negativa")
    @Max(value = 100, message = "La batería no puede tener más del 100%")
    @Column(nullable = false)
    private Integer bateria;

    @Positive(message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private BigDecimal precio;

    private Integer stock = 1;

    @Size(max=255, message = "La descripción no puede superar los 255 caracteres")
    @Column(name="descripcion", columnDefinition = "TEXT")
    private String descripcion;

    public Celular (){}

    public Celular(Long id, String marca, String modelo, String color, Integer almacenamiento, Integer bateria, BigDecimal precio, Integer stock, String descripcion) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.color = color;
        this.almacenamiento = almacenamiento;
        this.bateria = bateria;
        this.precio = precio;
        this.stock = stock;
        this.descripcion = descripcion;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "La marca no puede estar vacía") String getMarca() {
        return marca;
    }

    public void setMarca(@NotBlank(message = "La marca no puede estar vacía") String marca) {
        this.marca = marca;
    }

    public @NotBlank(message = "El modelo es obligatorio") String getModelo() {
        return modelo;
    }

    public void setModelo(@NotBlank(message = "El modelo es obligatorio") String modelo) {
        this.modelo = modelo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public @Min(value = 0, message = "El almacenamiento no puede ser negativo") Integer getAlmacenamiento() {
        return almacenamiento;
    }

    public void setAlmacenamiento(@Min(value = 0, message = "El almacenamiento no puede ser negativo") Integer almacenamiento) {
        this.almacenamiento = almacenamiento;
    }

    public @Min(value = 0, message = "La batería no puede ser negativa") @Max(value = 100, message = "La batería no puede tener más del 100%") Integer getBateria() {
        return bateria;
    }

    public void setBateria(@Min(value = 0, message = "La batería no puede ser negativa") @Max(value = 100, message = "La batería no puede tener más del 100%") Integer bateria) {
        this.bateria = bateria;
    }

    public @Positive(message = "El precio debe ser mayor a 0") BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(@Positive(message = "El precio debe ser mayor a 0") BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public @Size(max = 255, message = "La descripción no puede superar los 255 caracteres") String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(@Size(max = 255, message = "La descripción no puede superar los 255 caracteres") String descripcion) {
        this.descripcion = descripcion;
    }

    @PrePersist
    public void prePersist(){
        if (this.stock == null){
            this.stock = 1;
        }
    }
}

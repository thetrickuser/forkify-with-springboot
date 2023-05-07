package com.forkify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.forkify.backend.entity.Ingredients;

@Repository
public interface IngredientsRepository extends JpaRepository<Ingredients, Long> {

}

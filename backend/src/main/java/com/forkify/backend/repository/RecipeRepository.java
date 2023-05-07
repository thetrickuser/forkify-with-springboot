package com.forkify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.forkify.backend.entity.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, String> {

}

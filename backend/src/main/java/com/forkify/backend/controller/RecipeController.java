package com.forkify.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.forkify.backend.entity.Recipe;
import com.forkify.backend.service.RecipeService;

@RestController
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @PostMapping("/recipes")
    @CrossOrigin
    public long saveRecipe(@RequestBody Recipe recipe) {
        try {
            recipe.getIngredients().stream().forEach(ingredient -> ingredient.setRecipe(recipe));
            recipeService.saveRecipe(recipe);
        } catch (Exception e) {
            logger.error("Post failed. Error -> {}", e.getMessage());
        }
        return recipe.getId();
    }

}

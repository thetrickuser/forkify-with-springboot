import { API_KEY, API_URL, SEARCH_RESULTS_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: SEARCH_RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (recipeData) {
  let { recipe } = recipeData.data;
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (recipeId) {
  try {
    const recipeResponse = await AJAX(`${API_URL}${recipeId}`);
    createRecipeObject(recipeResponse);

    if (state.bookmarks.some(bookmark => bookmark.id === recipeId))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const searchResponse = await AJAX(`${API_URL}?search=${query}`);
    if (!searchResponse) throw new Error('Unable to fetch search results');
    state.search.results = searchResponse.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  if (newServings > 0) {
    state.recipe.ingredients.forEach(ing => {
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
  }
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // make current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (recipe) {
  const index = state.bookmarks.findIndex(el => el.id === recipe.id);
  state.bookmarks.splice(index, 1);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = newRecipe
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format!'
          );
        let [quantity, unit, description] = ingArr;
        return {
          quantity: quantity === '' ? null : Number(quantity),
          unit,
          description,
        };
      });
    const newRecipeData = Object.fromEntries(newRecipe);
    newRecipeData.ingredients = ingredients;
    // const recipe = {
    //   title: newRecipeData.title,
    //   publisher: newRecipeData.publisher,
    //   source_url: newRecipeData.sourceUrl,
    //   image_url: newRecipeData.image,
    //   servings: Number(newRecipeData.servings),
    //   cooking_time: Number(newRecipeData.cookingTime),
    //   ingredients: newRecipeData.ingredients,
    // };
    const recipe = {
      title: newRecipeData.title,
      publisher: newRecipeData.publisher,
      sourceUrl: newRecipeData.sourceUrl,
      imageUrl: newRecipeData.image,
      servings: Number(newRecipeData.servings),
      cookingTime: Number(newRecipeData.cookingTime),
      ingredients: newRecipeData.ingredients,
      apiKey: API_KEY,
    };
    const data = await AJAX(`http://localhost:8080/recipes`, recipe);
    // await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    console.log(data);

    createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));
  if (storage) state.bookmarks = storage;
};

init();

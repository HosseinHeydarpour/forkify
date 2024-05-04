import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/serachView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import AddReciperView from './views/addRecipeView.js';

import 'core-js/stable'; // Polyfilling everything else
import 'regenerator-runtime/runtime'; // This is for pollyfilling async await
import addRecipeView from './views/addRecipeView.js';

///////////////////////////////////////

//# sourceMappingURL=index.62406edb.js.map

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  //1) Loading Recipe

  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update resluts view to mark selected search
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    //2) Loading Recipe
    // * We need to use await because an async function returns a promise
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    // TEST
    // controlSavings();
  } catch (err) {
    // console.log(error);
    recipeView.renderError();
    console.error(err);
  }
};

controlRecipes();

const controlSearchResults = async function () {
  // 1) Get Search Quert
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // 2) Load search results
    await model.loadSerachResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render new results
  // resultsView.render(model.state.search.results);

  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // 1) Add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) uodate recipe view
  recipeView.update(model.state.recipe);

  // 3) render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // render rceipe
    recipeView.render(model.state.recipe);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Success message
    addRecipeView.renderMessage();

    // Render Bookmark view (we use render here because we want to insert something new here)
    bookmarksView.render(model.state.bookmarks);

    // Chnage ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    // Change id in the url
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  AddReciperView.addHandlerUpload(controlAddRecipe);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

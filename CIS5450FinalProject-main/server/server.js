const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

console.log(routes.recipes);

process.on("uncaughtException", (err, origin)=>{
  console.error(err)
  process.exit(1)
})

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/recipes', routes.recipes);
app.get('/search_ingredients', routes.search_ingredients);
app.get('/get_low_carb', routes.get_low_carb);
app.get('/get_keto', routes.get_keto);
app.get('/get_high_protein', routes.get_high_protein);
app.get('/recipe/:rid', routes.recipe);
app.get('/get_balanced_meal_plan', routes.get_balanced_meal_plan);
app.get('/get_nutrition', routes.get_nutrition);
app.get('/get_top_ten_most_similar', routes.get_top_ten_most_similar);
app.get('/create_pantry', routes.create_pantry);
app.get('/drop_pantry', routes.drop_pantry);
app.get('/insert_pantry_item', routes.insert_pantry_item);
app.get('/show_pantry', routes.show_pantry);
app.get('/get_recipes_by_ingredients_in_pantry', routes.get_recipes_by_ingredients_in_pantry);
app.get('/get_top_five_ingredients', routes.get_top_five_ingredients);
app.get('/get_recipes_by_parameters', routes.get_recipes_by_parameters);
app.get('/get_meal_plan_few_ingredients', routes.get_meal_plan_few_ingredients);
app.get('/create_minimal_meal_plan', routes.create_minimal_meal_plan);



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;

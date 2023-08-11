const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));



// Route /recipe/:rid
/*
No optimizations needed
*/
const recipe = async function(req, res) {
  const rid = req.params.rid
  connection.query(`
    SELECT *
    FROM recipes
    WHERE rid = '${rid}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route: /get_nutrition
/*
No optimizations needed
*/
const get_nutrition = async function(req, res) {
  const rid = req.query.rid ?? '';
  connection.query(`
    SELECT name, unit_name, total_ntr_per_recipe from total_ntr_per_recipe
    WHERE rid = '${rid}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      var recipes = [];
      for (var i = 0; i < data.length; i++) {
        recipes.push(data[i]);
      }
      res.json(recipes)
   }
  });
}



// Route: get_balanced_meal_plan
/*
(1) added a limit on the first part of CTE 
Query time went from 15 seconds to about 3
*/
const get_balanced_meal_plan = async function(req, res) {
    connection.query(`
    with rids as (
      SELECT distinct *
      from all_meal_plans_with_nutrition
      where total_meal_protein * 4 >= total_meal_calories * .20 AND total_meal_protein * 4 <= total_meal_calories * .40
      AND total_meal_fat * 9 >= total_meal_calories * .20 AND total_meal_fat * 9 <= total_meal_calories * .40
      AND total_meal_carbs * 4 >= total_meal_calories * .40 AND total_meal_carbs * 4 <= total_meal_calories * .50
      ORDER BY RAND()
      LIMIT 7
  ), breakfastTitle as (
      select ri.*, r.title as breakfast_title
      from rids ri join recipes r on ri.breakfast_rid = r.rid
  ), lunchTitle as (
      select bt.*, r.title as lunch_title
      from breakfastTitle bt join recipes r on bt.lunch_rid = r.rid
  )
  select lt.*, r.title as dinner_title
  from lunchTitle lt join recipes r on lt.dinner_rid = r.rid;
      
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });
}


// Route: /get_top_ten_most_similar
/*
No optimizations needed
*/
const get_top_ten_most_similar = async function(req, res) {
  const rid = req.query.rid ?? '';
  connection.query(`
  select recipes.rid, recipes.title
  from (select rid, title from recipes) as recipes
      natural join (select rid
     from used_in
     where iid in (select iid from used_in where rid = ${rid})
     and rid != ${rid}
     group by rid
     order by count(*) desc)
          as top_ten_similar
 group by title
 limit 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      var recipes = [];
      for (var i = 0; i < data.length; i++) {
        recipes.push(data[i]);
      }
      res.json(recipes)
   }
  });
}





// Route: /search_ingredients
/*
Ended up not using this query
*/
const search_ingredients = async function(req, res) {
  const ingredient = req.query.ingredient ?? '';
  const page = parseInt(req.query.page);
  const pageSize = req.query.page_size ? parseInt(req.query.page_size) : 10;
  const offset = (page -1) * (pageSize)
  if (!page) {
    connection.query(`
      WITH ingredientID as (
        SELECT id
        FROM ingredient_names
        WHERE ingredient LIKE '${ingredient}%'
        limit 20
      ), rids as (
      SELECT u.rid
      FROM ingredientID n JOIN used_in u
      ON n.id = u.iid
      )
      SELECT ri.rid as rid, title, ingredients, instructions
      FROM rids ri JOIN recipes r ON ri.rid = r.rid
      LIMIT 10
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  } else {
    connection.query(`
      WITH ingredientID as (
        SELECT id
        FROM ingredient_names
        WHERE ingredient LIKE '${ingredient}%'
        limit 10
      ), rids as (
      SELECT u.rid
      FROM ingredientID n JOIN used_in u
      ON n.id = u.iid
      )
      SELECT ri.rid as rid, title, ingredients, instructions
      FROM rids ri JOIN recipes r ON ri.rid = r.rid
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  }
}

// Route: create_pantry
/*
Splt this into its own query. Not sure if I had to, but I believe having it separate made the implementation easier
*/
const create_pantry = async function(req, res) {
  connection.query(`
  CREATE TEMPORARY TABLE  IF NOT EXISTS pantry
  (ingredient varchar(255),
    UNIQUE (ingredient))

  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.json({message: 'pantry_created'});
   }
  });
}

//Route: drop_pantry
/*
added this query to clear out the pantry
*/
const drop_pantry = async function(req, res) {
  connection.query(`
  DROP TABLE IF EXISTS pantry;
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({message: 'An error occurred'});
    } else {
      res.status(200).json({message: 'pantry dropped'});
    }
  });
}

// Route: insert_pantry_item
/*
No optimizations needed
*/
const insert_pantry_item = async function(req, res) {
  const ingredient = req.query.ingredient?? '';
  connection.query(`
  INSERT INTO pantry (ingredient)
  VALUE ('${ingredient}');
  `, (err, data) => {
    console.log('data', data)
    console.log('data_all', data)
    if (err || data.length === 0) {
      console.log(err);
      res.json({err: "You already have this in your pantry!"});
    } else {
      var recipes = [];
      for (var i = 0; i < data.length; i++) {
        recipes.push(data[i]);
      }
      res.json(recipes)
   }
  });
}


//Route: show_pantry
/*
added this query to display the ingredients list
*/
const show_pantry = async function(req, res) {
  connection.query(`
    select *
    from pantry;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.json({message: 'Nothing in Pantry'});
    } else {
      var recipes = [];
      for (var i = 0; i < data.length; i++) {
        recipes.push(data[i]);
      }
      res.json(recipes)
   }
  });
}



// Route: get_recipes_by_ingredients_in_pantry
/*
No optimizations needed
*/
const get_recipes_by_ingredients_in_pantry = async function(req, res) {
  connection.query(`
    SELECT recipes.rid as rid, recipes.title as title, recipes.ingredients, recipes.instructions, recipes.ner
    FROM recipes NATURAL JOIN (
    SELECT rid, count(*)
    FROM used_in
    WHERE iid IN (select id from pantry natural join ingredient_names)
    GROUP BY rid
    ORDER BY count(*) desc
    LIMIT 10)
    as recipes_with_pantry_ingred;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.json({message: 'Nothing in Pantry'});
    } else {
      var recipes = [];
      for (var i = 0; i < data.length; i++) {
        recipes.push(data[i]);
      }
      res.json(recipes)
   }
  });
}





// Route: /recipes
/*
didn't use this query
*/
const recipes = async function(req, res) {
  const page = req.query.page ? parseInt(req.query.page) : false;
  const pageSize = req.query.page_size ? parseInt(req.query.page_size) : 10;
  const offset = (page -1) * (pageSize)
  if (!page) {

    connection.query(`
      SELECT *
      FROM recipes
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  } else {
    connection.query(`
      SELECT *
      FROM recipes
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  }
}

// Route: get_low_carb
/*
(1) made total_ntr_per_recipe a table instead of a view
(2) removed rand() function because it was adding a lot of time to the query
Query time went from 45+ seconds to about 3 seconds
*/
const get_low_carb = async function(req, res) {
  const page = parseInt(req.query.page);
  const pageSize = req.query.page_size ? parseInt(req.query.page_size) : 10;
  const offset = (page -1) * (pageSize)
  if (!page) {

    connection.query(`
    SELECT recipes.rid, recipes.title
    FROM recipes
    NATURAL JOIN (
        SELECT DISTINCT rid
        FROM total_ntr_per_recipe_table
        WHERE total_ntr_per_recipe_table.carbs_ratio<= 0.25
        LIMIT 75
    ) AS low_carb
    WHERE title NOT LIKE '%dressing%'
    order by rand()
    LIMIT 10;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  } else {
    connection.query(`
    SELECT recipes.rid, recipes.title
    FROM recipes
    NATURAL JOIN (
        SELECT DISTINCT rid
        FROM total_ntr_per_recipe_table
        WHERE total_ntr_per_recipe_table.carbs_ratio<= 0.25
        LIMIT 75
    ) AS low_carb
    WHERE title NOT LIKE '%dressing%'
    order by rand()
    LIMIT 10;
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  }
}






// Route: get_keto
/*
(1) made total_ntr_per_recipe a table instead of a view
(2) removed rand() function because it was adding a lot of time to the query
Query time went from 45+ seconds to about 3 seconds
*/
const get_keto = async function(req, res) {
  const page = parseInt(req.query.page);
  const pageSize = req.query.page_size ? parseInt(req.query.page_size) : 10;
  const offset = (page -1) * (pageSize)
  if (!page) {

    connection.query(`
    select title, rid
    from recipes
        natural join (select distinct rid
                        from total_ntr_per_recipe_table
                        where total_ntr_per_recipe_table.fat_ratio>= .70 AND total_ntr_per_recipe_table.fat_ratio<= .80
                        limit 50
    ) as high_fat
     WHERE title NOT LIKE '%cookie%' AND title NOT LIKE '%cake%'
    order by rand()
    limit 10;
      
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  } else {
    connection.query(`
    select title, rid
    from recipes
        natural join (select distinct rid
                        from total_ntr_per_recipe_table
                        where total_ntr_per_recipe_table.fat_ratio>= .70 AND total_ntr_per_recipe_table.fat_ratio<= .80
                        limit 50
    ) as high_fat
     WHERE title NOT LIKE '%cookie%' AND title NOT LIKE '%cake%'
    order by rand()
    limit 10;
      LIMIT ${pageSize}
      OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  }
}


// Route: get_high_protein
/*
(1) made total_ntr_per_recipe a table instead of a view
(2) removed rand() function because it was adding a lot of time to the query
Query time went from 45+ seconds to about 3 seconds
*/
const get_high_protein = async function(req, res) {
  const page = parseInt(req.query.page);
  const pageSize = req.query.page_size ? parseInt(req.query.page_size) : 10;
  const offset = (page -1) * (pageSize)
  if (!page) {

    connection.query(`
    select title, rid
    from recipes
        natural join (select distinct rid
                        from total_ntr_per_recipe_table
                        where total_ntr_per_recipe_table.protein_ratio>= .30
    order by total_protein desc
    limit 30) as high_protein
    order by rand()
    limit 10;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  } else {
    connection.query(`
    select title, rid
    from recipes
        natural join (select distinct rid
                        from total_ntr_per_recipe_table
                        where total_ntr_per_recipe_table.protein_ratio>= .30
    order by total_protein desc
    limit 30) as high_protein
    order by rand()
    limit 10;
        LIMIT ${pageSize}
        OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  }
}

// Route: /get_recipes_by_parameters
/*
No optimizations needed
*/
const get_recipes_by_parameters = async function(req, res) {
  const title = req.query.title ?? '';
  const ingredient1 = req.query.ingredient1 ?? '';
  const ingredient2 = req.query.ingredient2 ?? '';
  const ingredient3 = req.query.ingredient3 ?? '';
  const calories_low = req.query.calories_low  ?? '';
  const calories_high= req.query.calories_high ?? '';
  const carbs_low = req.query.carbs_low  ?? '';
  const carbs_high= req.query.carbs_high ?? '';
  const fat_low = req.query.fats_low  ?? '';
  const fat_high= req.query.fats_high ?? '';
  const protein_low = req.query.protein_low  ?? '';
  const protein_high = req.query.protein_high ?? '';
  const page = parseInt(req.query.page);
  const pageSize = req.query.page_size ? parseInt(req.query.page_size) : 10;
  const offset = (page -1) * (pageSize)
  if (!page) {

    connection.query(`
    SELECT distinct r.rid, r.title, r.ingredients, r.instructions, r.ner
    FROM recipes r natural join total_ntr_per_recipe_table n
    WHERE title LIKE '%${title}%' AND ner LIKE '%${ingredient1}%' AND
    ner LIKE '%${ingredient2}%' AND
    ner LIKE '%${ingredient3}%'
    and rid in (select rid from total_ntr_per_recipe_table where total_calories BETWEEN ${calories_low} and ${calories_high})
    and rid in (select rid from total_ntr_per_recipe_table  where total_carbs BETWEEN  ${carbs_low} AND  ${carbs_high})
    and rid in (select rid from total_ntr_per_recipe_table  where total_protein BETWEEN  ${protein_low} AND  ${protein_high})
    and rid in (select rid from total_ntr_per_recipe_table  where total_fat BETWEEN  ${fat_low} and  ${fat_high})
    ORDER BY title;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  } else {
    connection.query(`
    SELECT distinct r.rid, r.title, r.ingredients, r.instructions, r.ner
    FROM recipes r natural join total_ntr_per_recipe_table n
    WHERE title LIKE '%${title}%' AND ner LIKE '%${ingredient1}%' AND
    ner LIKE '%${ingredient2}%' AND
    ner LIKE '%${ingredient3}%'
    and rid in (select rid from total_ntr_per_recipe_table where total_calories BETWEEN ${calories_low} and ${calories_high})
    and rid in (select rid from total_ntr_per_recipe_table  where total_carbs BETWEEN  ${carbs_low} AND  ${carbs_high})
    and rid in (select rid from total_ntr_per_recipe_table  where total_protein BETWEEN  ${protein_low} AND  ${protein_high})
    and rid in (select rid from total_ntr_per_recipe_table  where total_fat BETWEEN  ${fat_low} and  ${fat_high})
    ORDER BY title;
        LIMIT ${pageSize}
        OFFSET ${offset}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        var recipes = [];
        for (var i = 0; i < data.length; i++) {
          recipes.push(data[i]);
        }
        res.json(recipes)
     }
    });

  }
}

// Route: /get_top_five_ingredients
/*
No optimizations needed
*/
const get_top_five_ingredients = async function(req, res) {
  connection.query(`
  select ingredient
  from (select iid from used_in) as used_in join (select id, ingredient from ingredient_names) as ingredient_names
      on ingredient_names.id = used_in.iid
  group by iid
  order by count(*) desc
  limit 5;
  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      var recipes = [];
      for (var i = 0; i < data.length; i++) {
        recipes.push(data[i]);
      }
      res.json(recipes)
   }
  });
}

// Route: /get_meal_plan_few_ingredients
/*
No optimizations needed
*/
const get_meal_plan_few_ingredients = async function(req, res) {
  connection.query(`

  with rids as (
    SELECT distinct breakfast_rid, lunch_rid, dinner_rid
    from minimal_meal_plan
    LIMIT 7
), breakfastTitle as (
    select ri.*, r.title as breakfast_title
    from rids ri join recipes r on ri.breakfast_rid = r.rid
), lunchTitle as (
    select bt.*, r.title as lunch_title
    from breakfastTitle bt join recipes r on bt.lunch_rid = r.rid
)
select lt.*, r.title as dinner_title
from lunchTitle lt join recipes r on lt.dinner_rid = r.rid;
  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      var recipes = [];
      for (var i = 0; i < data.length; i++) {
        recipes.push(data[i]);
      }
      res.json(recipes)
   }
  });
}

// Route: create_minimal_meal_plan
/*
ended up not using this query
*/
const create_minimal_meal_plan = async function(req, res) {
  connection.query(`
  DROP temporary table IF EXISTS minimal_meal_plan;
  create temporary table minimal_meal_plan (
  breakfast_rid int unique,
  lunch_rid int unique,
  dinner_rid int unique);
  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.json({message: 'minimal_plan_created'});
   }
  });
}

module.exports = {
  recipe,
  get_nutrition,
  get_balanced_meal_plan,
  get_top_ten_most_similar,
  recipes,
  search_ingredients,
  create_pantry,
  drop_pantry,
  insert_pantry_item,
  show_pantry,
  get_recipes_by_ingredients_in_pantry,
  recipe,
  get_low_carb,
  get_keto,
  get_high_protein,
  get_recipes_by_parameters,
  get_top_five_ingredients,
  get_meal_plan_few_ingredients,
  create_minimal_meal_plan
}


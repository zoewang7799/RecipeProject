import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import recipeBook from './recipe_book.png';
import text from './cooltext440581641256686.gif';

const config = require('../config.json');

export default function HomePage() {

  useEffect(() => {

  


  }, []);



  return (
    <Container>
      <Divider />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {/* <h1>The Recipe Database</h1> */}
      {/* <img src={recipeBook} alt="Recipe Book" /> */}
      <img style = {{marginTop : 60, width: 1200}}src={text} alt="gif" />
     </div>
      <h2 style={{fontSize: 35}}><NavLink href="/" style={{color:"#311b92"}} to={`/AboutPage`}>About Page</NavLink></h2>
      <p style={{fontSize: "20px"}}>Our goal was to create a recipe database that can be easily searched, provides nutritional facts,
       and has additional features that promote healthy eating. We built our application using a Kaggle dataset of over 2,000,000 recipes joined with nutritional data from the USDA.</p>

      <h2 style={{fontSize: 35}}><NavLink href="/" style={{color:"#5e35b1"}} to={`/SearchPage`}>Search Recipes</NavLink></h2>
      <p style={{fontSize: "20px"}}>Search our recipes using a variety of parameters including nutritional content</p>

      <h2 style={{fontSize: 35}}><NavLink href="/" style={{color:"#7e57c2"}} to={`/RecipesByDietPage`}>Trending Diets</NavLink></h2>
       <p style={{fontSize: "20px"}}>You can easily find low carb, high protein, and keto friendly recipes here</p>
    
       <h2 style={{fontSize: 35}}><NavLink href="/" style={{color:"#5e35b1"}} to={`/BalancedMealPlanPage`}>Recommended Meal Plans </NavLink></h2> 
       <p style={{fontSize: "20px"}}>Get a meal plan for the week that optmizes your calorie and macronutrient intanke</p>
    
       <h2 style={{fontSize: 35}}><NavLink href="/" style={{color:"#311b92"}} to={`/PantryPage`}>Pantry Search</NavLink></h2>      
       <p style={{fontSize: "20px"}}>Create a list of items already in your pantry and fridge and matching recipes</p>
    
    </Container>
  );
  
};


//https://api.unsplash.com/photos/?client_id=V2FPhcwdEcRLKzTe48a2uEbCLBFcXGAlx7eFxLxukqA

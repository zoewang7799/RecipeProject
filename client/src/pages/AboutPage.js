import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import recipeBook from './recipe_book.png';

import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function AboutPage() {

  useEffect(() => {

  


  }, []);



  return (
    <Container>
        <h1 style ={{color: '#c62828', fontSize: 50}}> About Page </h1>

        <h2 style = {{color: '#3f51b5', fontSize: 30}}> Goals </h2>
        <ul style={{fontSize: 18}}>
          <li>Create an application that helped the user find healthy recipes</li>
          <li>Make the recipes easily searchable by title, ingredients, and nutrtiional facts</li>
          <li>Give recipe recommendations based on popular diets</li>
          <li>Provide balanced meal plans for an entire week</li>
          <li>Allow the user to search for recipes based off of the food already in their pantry/fridge</li>
        </ul>

        <h2 style = {{color: '#3f51b5', fontSize: 30}}> Datasets </h2>
        <ul style={{fontSize: 18}}>
          <li>A Kaggle recipe dataset with over 2,000,000 recipes</li>
          <li>A USDA nutritional facts dataset</li>
        </ul>
        <h2 style = {{color: '#3f51b5', fontSize: 30}}> Features </h2>
        <ul style={{fontSize: 18}}>
          <li>Recipe search by title, up to three ingredients, and by amount of calories, protein, fats, and carbs</li>
          <li>Recommended recipes for high protein, low carb, and low fat diets</li>
          <li>Meal plan reocommendations including meal plans that use as few ingredients as possible</li>
          <li>Provide balanced meal plans for an entire week</li>
          <li>Recipe Details Page that contain the directions, ingredients, nutritional facts, other similar recipes, and an image obtained from the upsplash API</li>
          <li>A Pantry search that allows the user to search for recipes using ingredients that they already have </li>

        </ul>




    </Container>
  );
  
};


//https://api.unsplash.com/photos/?client_id=V2FPhcwdEcRLKzTe48a2uEbCLBFcXGAlx7eFxLxukqA

import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField ,CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatDuration } from '../helpers/formatter';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function SearchPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredient1, setIngredient1] = useState('');
  const [ingredient2, setIngredient2] = useState('');
  const [ingredient3, setIngredient3] = useState('');
  const [calories, setCalories] = useState([0, 2000]);
  const [carbs, setCarbs] = useState([0, 100]);
  const [fats, setFats] = useState([0, 100]);
  const [protein, setProtein] = useState([0, 100]);

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const [ingredient, setIngredient] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {

  }, []);
  const search = () => {
    setLoading(true);
    fetch(`http://${config.server_host}:${config.server_port}/get_recipes_by_parameters?title=${title}` +
      `&ingredient1=${ingredient1}` + `&ingredient2=${ingredient2}` + `&ingredient3=${ingredient3}`+ 
      `&calories_low=${calories[0]}&calories_high=${calories[1]}` +      
       `&carbs_low=${carbs[0]}&carbs_high=${carbs[1]}` +
       `&protein_low=${protein[0]}&protein_high=${protein[1]}` +
       `&fats_low=${fats[0]}&fats_high=${fats[1]}`

    )
      .then(res => res.json())
      .then(resJson => {
       
        const recipesWithId = resJson.map((recipe) => ({ id: recipe.rid, ...recipe }));
        setData(recipesWithId);
        setLoading(false);
      });
  }

  function cleanString(input) {
    return input.replace(/["'\[\]{}]/g, '');
  }

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 350,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          <NavLink href="/"
                        style={{
                          color: "#424242",
                          fontFamily: "Monospace",
                          fontWeight: "bold",
                          fontSize: 15,
                        }} to={`/recipe/${params.row.rid}`}>{params.row.title}</NavLink>
        </div>
      ),
      
      
    },
    {
      field: 'ner',
      headerName: 'Ingredients',
      width: 350,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {cleanString(params.value)}
        </div>
      ),
    },
    
    {
      field: 'instructions',
      headerName: 'Instructions',
      width: 350,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {cleanString(params.value)}
        </div>
      ),

    }
    
  ];

  return (
    <Container>
        {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      )}
      {selectedRecipeId}
      <h2 style={{letterSpacing: '.1rem'}}>Search by Title</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
         <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '5%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2 style={{letterSpacing: '.1rem'}}>Search by Ingredients</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
         <TextField label='First Ingredient' value={ingredient1} onChange={(e) => setIngredient1(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={8}>
         <TextField label='Second Ingredient' value={ingredient2} onChange={(e) => setIngredient2(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={8}>
         <TextField label='Third Ingredient' value={ingredient3} onChange={(e) => setIngredient3(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '5%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2 style={{letterSpacing: '.1rem'}}>Filter by Nutrition</h2>

      <Grid container spacing={3}>
      <Grid item xs={6}>
        <p>Calories (kCAL)</p>
        <Slider
          style={{ width: 300 }} 
          value={calories}
          min={0}
          max={2000}
          step={100}
          onChange={(e, newValue) => setCalories(newValue)}
          valueLabelDisplay='auto'
          valueLabelFormat={value => <div>{value}</div>}
        />
      </Grid>

      <Grid item xs={6}>
        <p>Carbohydrates (g)</p>
        <Slider
          style={{ width: 300 }} 
          value={carbs}
          min={0}
          max={100}
          step={10}
          onChange={(e, newValue2) => setCarbs(newValue2)}
          valueLabelDisplay='auto'
          valueLabelFormat={value2 => <div>{value2}</div>}
        />
      </Grid>

      <Grid item xs={6}>
        <p>Protein (g)</p>
        <Slider
          style={{ width: 300 }} 
          value={protein}
          min={0}
          max={100}
          step={10}
          onChange={(e, newValue3) => setProtein(newValue3)}
          valueLabelDisplay='auto'
          valueLabelFormat={value3 => <div>{value3}</div>}
        />
      </Grid>

      <Grid item xs={6}>
        <p>Fat (g)</p>
        <Slider
          style={{ width: 300 }} 
          value={fats}
          min={0}
          max={100}
          step={10}
          onChange={(e, newValue4) => setFats(newValue4)}
          valueLabelDisplay='auto'
          valueLabelFormat={value4 => <div>{value4}</div>}
        />
      </Grid>
    </Grid>

      <Button onClick={() => search() } style={{ left: '5%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        rowHeight={300}
      />
    </Container>
  );
}
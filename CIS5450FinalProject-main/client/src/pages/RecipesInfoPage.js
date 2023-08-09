import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { NavLink } from 'react-router-dom';

//import SongCard from '../components/SongCard';
import { formatDuration, formatReleaseDate } from '../helpers/formatter';
const config = require('../config.json');
export default function RecipesInfoPage() {
  const { rid } = useParams();

  //const [songData, setSongData] = useState([{}]); // default should actually just be [], but empty object element added to avoid error in template code
  const [recipeData, setRecipeData] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [nutritionData, setNutritionImageData] = useState([]);
  const [top_ten_similar, setTopTen] = useState([]);

  const [ingredientsArray, setIngredientsArray] = useState([]);
  const [instructionsArray, setInstructionsArray] = useState([]);

  const [data, setData] = useState([]);

  //const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/recipe/${rid}`)
      .then(res => res.json())
      .then(resJson => {
        setRecipeData(resJson); 
        //setIngredientsArray(JSON.parse(resJson.ingredients));
        //setInstructionsArray(JSON.parse(resJson.instructions));

        //food collection ids 4466406, 8613861, 1424340

        // fetch the image data after the recipe data has been fetched and state updated
        fetch(`https://api.unsplash.com/search/photos?page=1&per_page=1&collections=4466406,8613861,1424340&query=${resJson.title}&client_id=V2FPhcwdEcRLKzTe48a2uEbCLBFcXGAlx7eFxLxukqA`)
          .then(res => res.json())
          .then(imageResJson => setImageData(imageResJson));
      });
    
      fetch(`http://${config.server_host}:${config.server_port}/get_nutrition?rid=${rid}`)
      .then(res => res.json())
      .then(nutritionResJson => setNutritionImageData(nutritionResJson));

      fetch(`http://${config.server_host}:${config.server_port}/get_top_ten_most_similar?rid=${rid}`)
      .then(res => res.json())
      .then(topTen => setTopTen(topTen));
      
    
  }, [rid]);
  return (
    <Container>

      <Stack direction='column' justify='center' alignItems='center'>
        <Stack justify='center'>
          <h1 style={{ fontSize: 64 }}>{recipeData.title}</h1>
        </Stack>
        <img
            src={imageData.results && imageData.results[0] && imageData.results[0].urls ? imageData.results[0].urls.regular : ''}
            width='500'
            height='400'
            style={{
                marginTop: '40px',
                marginRight: '40px',
                marginBottom: '40px'
            }}
            />
        <Stack justify='center'>
          <h2 style={{ fontSize: 32 , color:'#b71c1c' }}>Ingredients</h2>
          <ul>
            {recipeData.ingredients && JSON.parse(recipeData.ingredients).map((ingredient, index) => (
            <li  key={index} style={{ fontSize: 24 }}>{ingredient}</li>
            ))}
          </ul>

          <h2 style={{ fontSize: 32 , color:'#b71c1c' }}>Instructions</h2>
          <ol>
            {recipeData.instructions && JSON.parse(recipeData.instructions).map((ingredient, index) => (
            <li  key={index} style={{ fontSize: 24 }}>{ingredient}</li>
            ))}
          </ol>

          <h2 style={{ color: "#b71c1c", fontSize: 32 }}>Nutritional Data</h2>
          <table style={{ textAlign: 'left', width: '100%' }}>
            <tbody>
              {Array.isArray(nutritionData) && nutritionData.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontSize: 24, color:'#616161',fontFamily: "Monospace", fontWeight: 'bold', minWidth: '75px', display: 'inline-block' }}>{item.name}</td>
                  <td style={{ fontSize: 24,fontFamily: "Monospace" }}>{`${item.total_ntr_per_recipe} ${item.unit_name}`}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ fontSize: 32, color:'#b71c1c' }}>Find Similar Recipes</h2>
          <table style={{ textAlign: 'left', width: '100%' }}>
            <tbody>
              {top_ten_similar && top_ten_similar.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontSize: 24, minWidth: '0px', display: 'inline-block' }}>{item.name}</td>
                  <td style={{ fontSize: 24 }}>
                    <NavLink href="/"
                        style={{
                          color: "#424242",
                          fontFamily: "Monospace",
                          fontWeight: "bold",
                          fontSize: 25,
                        }} to={`/recipe/${item.rid}`}>{item.title}</NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </Stack>
      </Stack>

    </Container>
  );
}


/*



    fetch('https://api.unsplash.com/photos/random/?client_id=V2FPhcwdEcRLKzTe48a2uEbCLBFcXGAlx7eFxLxukqA')
      .then(res => res.json())
      .then(resJson => setImageData(resJson))
      .then(function (resJson) {
        console.log(resJson);
      })
        <img
          key={albumData.album_id}
          src={albumData.thumbnail_url}
          alt={`${albumData.title} album art`}
          style={{
            marginTop: '40px',
            marginRight: '40px',
            marginBottom: '40px'
          }}
        />


      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='#'>#</TableCell>
              <TableCell key='Title'>Title</TableCell>
              <TableCell key='Plays'>Plays</TableCell>
              <TableCell key='Duration'>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // TODO (TASK 23): render the table content by mapping the songData array to <TableRow> elements
              // Hint: the skeleton code for the very first row is provided for you. Fill out the missing information and then use a map function to render the rest of the rows.
              // Hint: it may be useful to refer back to LazyTable.js
              songData.map(song => (
              <TableRow key={song.song_id}>
                <TableCell key='#'>{song.number}</TableCell>
                <TableCell key='Title'>
                  <Link onClick={() => setSelectedSongId(song.song_id)}>
                    {song.title}
                  </Link>
                </TableCell>
                <TableCell key='Plays'>{song.plays}</TableCell>
                <TableCell key='Duration'>{formatDuration(song.duration)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


*/
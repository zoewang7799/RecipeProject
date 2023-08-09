import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Slider,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { formatDuration } from "../helpers/formatter";
import { NavLink } from "react-router-dom";
import { Label } from "recharts";

const config = require("../config.json");

export default function PantryPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [pantryData, setPantryData] = useState([]);
  const [createMessage, setCreateMessage] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [topFiveData, setTopFiveData] = useState([]);

  const [addMessage, setAddMessage] = useState([]);

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const [ingredient, setIngredient] = useState("");
  const [error, setError] = useState(false);

  var message = "";
if (error) {
  message = 'duplicate ingredient!'
} else {
  message = ''
}

 
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/create_pantry`)
      .then((res) => res.json())
      .then((createJson) => setCreateMessage(createJson));

    fetch(
      `http://${config.server_host}:${config.server_port}/get_top_five_ingredients`
    )
      .then((res) => res.json())
      .then((topFiveJson) => setTopFiveData(topFiveJson));
  }, []);

  const add = () => {
    fetch(
      `http://${config.server_host}:${config.server_port}/insert_pantry_item?ingredient=${ingredient}`
    )
      .then((res) => res.json())
      .then((addJson) => {
        if (addJson.err) {
          // window.alert(addJson.err);
          setError(true);
          return;
        }
        setError(false);
        console.log("Ingredient added: ", addJson);

        // Fetch pantry data only after the ingredient has been added
        fetch(`http://${config.server_host}:${config.server_port}/show_pantry`)
          .then((res) => res.json())
          .then((pantryJson) => {
            setPantryData(pantryJson);

            fetch(
              `http://${config.server_host}:${config.server_port}/get_recipes_by_ingredients_in_pantry`
            )
              .then((res) => res.json())
              .then((recipeJson) => setRecipeData(recipeJson));
          });
      });
  };

  const clear = () => {
    fetch(`http://${config.server_host}:${config.server_port}/drop_pantry`)
      .then((res) => res.json())
      .then((addJson) => {
        setPantryData([]);

        // Fetch pantry data only after the ingredient has been added
        fetch(`http://${config.server_host}:${config.server_port}/show_pantry`)
          .then((res) => res.json())
          .then((pantryJson) => {
            setPantryData(pantryJson);

            fetch(
              `http://${config.server_host}:${config.server_port}/create_pantry`
            )
              .then((res) => res.json())
              .then((createJson) => setCreateMessage(createJson));
          });
      });
  };

  return (
    <Container style={{ display: "flex" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        <br />
        <h2 style={{ letterSpacing: ".1rem" }}>
          Add Ingredients to Your Pantry
        </h2>

          <label style={{fontSize:12, marginLeft:24, color: "#c62828"}}> {message} </label>
<br></br>

        <TextField
          label="ingredient"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          style={{ width: "30%" }}
        />
        <br></br>
                  {/* <label style={{fontSize:12, marginLeft:24}}> {message} </label>
<br></br> */}
        <Button onClick={() => add()}>Add Ingredient</Button>
        <br />
        <br />
        <h2 style={{ letterSpacing: ".1rem" }}>Items in your pantry:</h2>
        <table style={{ textAlign: "left", width: "100%" }}>
          <tbody>
            {Array.isArray(pantryData) &&
              pantryData.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      fontSize: 24,
                      minWidth: "0px",
                      display: "inline-block",
                    }}
                  >
                    {}
                  </td>
                  <td style={{ fontSize: 24 }}>{`${item.ingredient}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <Button onClick={() => clear()}>Clear Pantry </Button>
        <h2 style={{ color: "#c62828", letterSpacing: ".05rem", fontSize: 25 }}>
          Check out the 5 most popular <br></br> ingredients in our database!
        </h2>
        <table style={{ textAlign: "left", width: "100%" }}>
          <tbody>
            {Array.isArray(topFiveData) &&
              topFiveData.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      fontSize: 24,
                      minWidth: "0px",
                      display: "inline-block",
                    }}
                  >
                    {}
                  </td>
                  <td style={{ fontSize: 24 }}>{`${item.ingredient}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1 }}>
        <br></br>
        <h2 style={{ letterSpacing: ".1rem", color: "#3f51b5", fontSize: 35 }}>
          Pantry Recipes
        </h2>
        <table style={{ textAlign: "left", width: "100%" }}>
          <tbody>
            {Array.isArray(recipeData) &&
              recipeData.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      fontSize: 24,
                      minWidth: "0px",
                      display: "inline-block",
                    }}
                  >
                    {}
                  </td>
                  <td style={{ fontSize: 24 }}>
                    {" "}
                    <NavLink
                      href="/"
                      style={{ color: "#424242" ,fontFamily: "Monospace", fontWeight:'bold'}}
                      to={`/recipe/${item.rid}`}
                    >
                      {item.title}
                    </NavLink>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

/*

  <h1>Pantry Page </h1>
        <p>Add the food ingredients that you currently have in your pantry or fridge and we'll find recipes for using what you got!</p>
        */

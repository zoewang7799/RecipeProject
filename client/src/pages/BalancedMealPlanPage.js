import { useEffect, useState } from "react";
import {
  Container,
  Divider,
  Link,
  Grid,
  CircularProgress,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  Line,
  Label,
  LabelList,
  LabelProps,
} from "recharts";

const config = require("../config.json");

export default function BalancedMealPlanPage() {
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const macros = ["carbs", "fat", "protein", "calories"];
  const [balancedMealData, setBalancedMealData] = useState([]);
  console.log("balanced log", balancedMealData);
  const [balancedMealSimpleData, setBalancedMealSimpleData] = useState([]);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // const CustomizedLabel = React.createClass({
  //   render () {
  //     const {x, y, stroke, value} = this.props;

  //      return <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{value}</text>
  //   }
  // });

  const nutrition = balancedMealData?.map((item, index) => {
    return {
      name: dayNames[index],
      total_calories:
        Math.round(
          (item.total_meal_calories / item.total_meal_calories) * 100
        ) || 0,
      breakfast_carbs:
        Math.round((item.breakfast_carbs * 4) / item.total_meal_calories) *
          100 || 0,
      lunch_carbs:
        Math.round(((item.lunch_carbs * 4) / item.total_meal_calories) * 100) ||
        0,
      dinner_carbs:
        Math.round(
          ((item.dinner_carbs * 4) / item.total_meal_calories) * 100
        ) || 0,
      breakfast_fat:
        Math.round(
          ((item.breakfast_fat * 9) / item.total_meal_calories) * 100
        ) || 0,
      lunch_fat:
        Math.round(((item.lunch_fat * 9) / item.total_meal_calories) * 100) ||
        0,
      dinner_fat:
        Math.round(((item.dinner_fat * 9) / item.total_meal_calories) * 100) ||
        0,
      breakfast_protein:
        Math.round(
          ((item.breakfast_protein * 4) / item.total_meal_calories) * 100
        ) || 0,
      lunch_protein:
        Math.round(
          ((item.lunch_protein * 4) / item.total_meal_calories) * 100
        ) || 0,
      dinner_protein:
        Math.round(
          ((item.dinner_protein * 4) / item.total_meal_calories) * 100
        ) || 0,
      carbs: macros[0],
      fat: macros[1],
      protein: macros[2],
      calories: macros[3],
    };
    // return {
    //   name: dayNames[index],
    //   total_calories: item.total_meal_calories|| 0,
    //   breakfast_carbs: item.breakfast_carbs * 4 || 0,
    //   lunch_carbs: item.lunch_carbs * 4 || 0,
    //   dinner_carbs: item.dinner_carbs * 4 || 0,
    //   breakfast_fat: item.breakfast_fat * 9 || 0,
    //   lunch_fat: item.lunch_fat * 9|| 0,
    //   dinner_fat: item.dinner_fat * 9|| 0,
    //   breakfast_protein: item.breakfast_protein * 4|| 0,
    //   lunch_protein: item.lunch_protein * 4|| 0,
    //   dinner_protein: item.dinner_protein * 4 || 0,
    //   carbs: macros[0],
    //   fat: macros[1],
    //   protein: macros[2],
    //   calories: macros[3]
    // };
  });

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://${config.server_host}:${config.server_port}/get_balanced_meal_plan`
    )
      .then((res) => res.json())
      .then((balancedJson) => {
        if (Array.isArray(balancedJson)) setBalancedMealData(balancedJson);
        setLoading(false);
      });

    fetch(
      `http://${config.server_host}:${config.server_port}/get_meal_plan_few_ingredients`
    )
      .then((res) => res.json())
      .then((simpleJson) => {
        setBalancedMealSimpleData(simpleJson);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      )}
      {isCheckboxChecked ? (
        // Simple Balanced Meal Plan
        <div>
          <h1
            style={{
              fontSize: "50px",
              textAlign: "center",
              letterSpacing: ".2rem",
              color: "#c2185b",
            }}
          >
            Using Minimal Ingredients
          </h1>
          <p
            style={{ fontSize: "15px", textAlign: "center", marginBottom: 50 }}
          >
            This weekly meal plan was generated to help you minimize ingredient
            preparations... save your time and money!
          </p>
          <table
            style={{
              width: "90%",
              textAlign: "center",
              borderCollapse: "collapse",
              marginLeft: 70,
            }}
          >
            <thead>
              <tr>
                <th></th>
                <th style={{ fontSize: "21px", fontFamily: "Monospace" }}>
                  Breakfast
                </th>
                <th style={{ fontSize: "21px", fontFamily: "Monospace" }}>
                  Lunch
                </th>
                <th style={{ fontSize: "21px", fontFamily: "Monospace" }}>
                  Dinner
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(balancedMealSimpleData) &&
                balancedMealSimpleData.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        fontWeight: "bold",
                        fontSize: "21px",
                        fontFamily: "Monospace",
                      }}
                    >
                      {dayNames[index]}
                    </td>
                    <td style={{ fontSize: "16px", padding: "20px 10px" }}>
                      <NavLink
                        href="/"
                        style={{
                          fontWeight:"bold",
                          color: "#424242",
                          fontFamily: "Monospace",
                          backgroundColor: "#c5cae9",
                        }}
                        to={`/recipe/${item.breakfast_rid}`}
                      >
                        {item.breakfast_title}
                      </NavLink>
                    </td>
                    <td style={{ fontSize: "16px", padding: "20px 10px" }}>
                      <NavLink
                        href="/"
                        style={{
                          fontWeight:"bold",
                          color: "#424242",
                          fontFamily: "Monospace",
                          backgroundColor: "#a5d6a7",
                        }}
                        to={`/recipe/${item.lunch_rid}`}
                      >
                        {item.lunch_title}
                      </NavLink>
                    </td>
                    <td style={{ fontSize: "16px", padding: "20px 10px" }}>
                      <NavLink
                        href="/"
                        style={{
                          fontWeight:"bold",
                          color: "#424242",
                          fontFamily: "Monospace",
                          backgroundColor: "#fda4ba",
                        }}
                        to={`/recipe/${item.dinner_rid}`}
                      >
                        {item.dinner_title}
                      </NavLink>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Balanced Meal Plan
        <div>
          <h1
            style={{
              fontSize: "50px",
              textAlign: "center",
              letterSpacing: ".2rem",
              color: "#c62828",
            }}
          >
            Balanced Meal Plan
          </h1>
          <p
            style={{ fontSize: "15px", textAlign: "center", marginBottom: 50 }}
          >
            This recommended meal plan was generated to provide you with a
            balanced diet for each meal in terms of calories, carbohydrates,
            fat, and protein intake. In general your daily diet is balanced if your
            caloric intake is roughly 2000 kcal, carbohydrate intake is 30-50%,
            fat intake is 20-40% and protein intake is 20-40% of your total
            caloric intake.
          </p>
          <table
            style={{
              width: "90%",
              textAlign: "center",
              borderCollapse: "collapse",
              marginLeft: 70,
            }}
          >
            <thead>
              <tr>
                <th></th>
                <th style={{ fontSize: "21px", fontFamily: "Monospace" }}>
                  Breakfast
                </th>
                <th style={{ fontSize: "21px", fontFamily: "Monospace" }}>
                  Lunch
                </th>
                <th style={{ fontSize: "21px", fontFamily: "Monospace" }}>
                  Dinner
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(balancedMealData) &&
                balancedMealData.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        fontWeight: 900,
                        fontSize: "21px",
                        fontFamily: "Monospace",
                      }}
                    >
                      {dayNames[index]}
                    </td>
                    <td
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        padding: "20px 10px",
                      }}
                    >
                      <NavLink
                        href="/"
                        style={{
                          color: "#424242",
                          fontFamily: "Monospace",
                          backgroundColor: "#c5cae9",
                        }}
                        to={`/recipe/${item.breakfast_rid}`}
                      >
                        {item.breakfast_title}
                      </NavLink>
                    </td>
                    <td
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        padding: "20px 10px",
                      }}
                    >
                      <NavLink
                        href="/"
                        style={{
                          color: "#424242",
                          fontFamily: "Monospace",
                          backgroundColor: "#a5d6a7",
                        }}
                        to={`/recipe/${item.lunch_rid}`}
                      >
                        {item.lunch_title}
                      </NavLink>
                    </td>
                    <td
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        padding: "20px 10px",
                      }}
                    >
                      <NavLink
                        href="/"
                        style={{
                          color: "#424242",
                          fontFamily: "Monospace",
                          backgroundColor: "#fc94af",
                        }}
                        to={`/recipe/${item.dinner_rid}`}
                      >
                        {item.dinner_title}
                      </NavLink>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Grid item>
            <BarChart
              width={1200}
              height={500}
              data={nutrition}
              margin={{
                top: 20,
                right: 50,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" dy={40} fontWeight={'bold'}  fontSize={20}></XAxis>

              <YAxis
                type="number"
                domain={[0, 100]}
                tickCount={22}
                label={{
                  fill: "#c62828",
                  fontWeight: "bold",
                  value: "% of caloric intake",
                  angle: -90,
                  position: "insideLeft",
                  dy: -50,
                }}
              />
              <Tooltip />
              <Bar
                isAnimationActive={false}
                dataKey="total_calories"
                fill="#ffc658"
              >
                <LabelList
                  dataKey="calories"
                  position="bottom"
                  angle={-30}
                  fontSize={12}
                  dy={10}
                  dx={-15}
                  fontWeight={"bold"}
                />
                
              </Bar>
              <Bar isAnimationActive={false} dataKey="breakfast_carbs" stackId="a" fill="#8884d8">
              <LabelList
                  dataKey="carbs"
                  position="bottom"
                  angle={-30}
                  fontSize={12}
                  dy={10}
                  dx={-15}
                  fontWeight={"bold"}
                />
              </Bar>

              <Bar dataKey="lunch_carbs" stackId="a" fill="#82ca9d" />
              <Bar
                dataKey="dinner_carbs"
                stackId="a"
                fill="#ec407a"
              >
              </Bar>
              <Bar isAnimationActive={false} dataKey="breakfast_fat" stackId="b" fill="#8884d8">
              <LabelList
                  dataKey="fat"
                  position="bottom"
                  angle={-30}
                  fontSize={12}
                  dy={10}
                  dx={-15}
                  fontWeight={"bold"}
                />
              </Bar>
              <Bar dataKey="lunch_fat" stackId="b" fill="#82ca9d" />
              <Bar
                dataKey="dinner_fat"
                stackId="b"
                fill="#ec407a"
              >
              </Bar>
              <Bar isAnimationActive={false} dataKey="breakfast_protein" stackId="c" fill="#8884d8">
              <LabelList
                  dataKey="protein"
                  position="bottom"
                  angle={-30}
                  fontSize={12}
                  dy={10}
                  dx={-15}
                  fontWeight={"bold"}
                />
              </Bar>
              <Bar dataKey="lunch_protein" stackId="c" fill="#82ca9d" />
              <Bar
                isAnimationActive={false}
                dataKey="dinner_protein"
                stackId="c"
                fill="#ec407a"
              >
              </Bar>
            </BarChart>
            <Grid item>
              <p
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  marginTop: 15,
                  color: "#c62828",
                  fontWeight: "bold",
                }}
              >
                **In general your diet is balanced if your daily caloric intake is
                roughly 2000 kcal, carbohydrate intake is 30-50%,<br></br> fat intake is
                20-40% and protein intake is 20-40% of your total caloric
                intake**
              </p>
            </Grid>
          </Grid>
        </div>
      )}
      <Grid container alignItems="center">
        <Grid item>
          <Checkbox
            checked={isCheckboxChecked}
            onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
            style={{
              transform: "scale(1.5)",
              marginBottom:60,
            }}
          />
        </Grid>
        <Grid item>
          <h2 style={{
                  fontSize: "20px",
                  marginBottom:75}}>
            Click the checkbox to show a simple meal plan using as few
            ingredients as possible
          </h2>
        </Grid>
      </Grid>
    </Container>
  );
}

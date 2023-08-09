import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Divider,
  Button,
  TextField,
  Link,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  tableStyling,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import LazyTable from "../components/LazyTable";
const config = require("../config.json");

export default function RecipesByDietPage() {
  const [ingredient, setIngredient] = useState("chicken");
  const [highProtein, setHighProtein] = useState([]);
  const [lowFat, setLowFat] = useState([]);
  const [lowCarb, setLowCarb] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_high_protein`)
      .then((res) => res.json())
      .then((proteinJson) => setHighProtein(proteinJson));

    fetch(`http://${config.server_host}:${config.server_port}/get_keto`)
      .then((res) => res.json())
      .then((fatJson) => setLowFat(fatJson));

    fetch(`http://${config.server_host}:${config.server_port}/get_low_carb`)
      .then((res) => res.json())
      .then((carbJson) => setLowCarb(carbJson));
  }, []);

  const search = () => {};

  function mappingTables() {
    const rows = highProtein.map((item, index) => {
      return {
        highProtein: item,
        lowFat: lowFat[index],
        lowCarb: lowCarb[index],
      };
    });
    return rows;
  }

  return (
    <Container>
      <TableContainer>
        <Table style={{marginTop: 35}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', fontSize: 50, fontWeight: 'bold', color: '#1a237e' , width : 300, letterSpacing: '.1rem'}}>High Protein</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: 50, fontWeight: 'bold', color: '#1a237e', width : 300, letterSpacing: '.1rem'   }}>Low Carb</TableCell>
              <TableCell sx={{ textAlign: 'center', fontSize: 50, fontWeight: 'bold', color: '#1a237e', width : 300, letterSpacing: '.1rem'  }}>Keto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappingTables().map((row) => {
              return (
                <TableRow>
                  <TableCell sx={{ textAlign: 'center', fontSize: 21, fontFamily: 'Monospace', backgroundColor: '#e8eaf6' }}><NavLink href="/" style={{color:"#424242"}} to={`/recipe/${row.highProtein?.rid}`}>{row.highProtein?.title}</NavLink></TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: 21, fontFamily: 'Monospace', backgroundColor: '#f5f5f5' }}><NavLink href="/" style={{color:"#424242"}} to={`/recipe/${row.lowCarb?.rid}`}>{row.lowCarb?.title}</NavLink></TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: 21, fontFamily: 'Monospace', backgroundColor : '#e8eaf6'}}><NavLink href="/" style={{color:"#424242"}} to={`/recipe/${row.lowFat?.rid}`}>{row.lowFat?.title}</NavLink></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
   );
          }

//       {/* <h2 style={{ fontSize: 32 }}>High Protein Recipes</h2>
//       <table style={{ textAlign: "left", width: "100%" }}>
//         <tbody>
//           {highProtein &&
//             highProtein.map((item, index) => (
//               <tr key={index}>
//                 <td
//                   style={{
//                     fontSize: 24,
//                     minWidth: "0px",
//                     display: "inline-block",
//                   }}
//                 >
//                   {item.name}
//                 </td>
//                 <td style={{ fontSize: 24 }}>
//                   <NavLink to={`/recipe/${item.rid}`}>{item.title}</NavLink>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//       <h2 style={{ fontSize: 32 }}>Low Carb Recipes</h2>
//       <table style={{ textAlign: "left", width: "100%" }}>
//         <tbody>
//           {lowCarb &&
//             lowCarb.map((item, index) => (
//               <tr key={index}>
//                 <td
//                   style={{
//                     fontSize: 24,
//                     minWidth: "0px",
//                     display: "inline-block",
//                   }}
//                 >
//                   {item.name}
//                 </td>
//                 <td style={{ fontSize: 24 }}>
//                   <NavLink to={`/recipe/${item.rid}`}>{item.title}</NavLink>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>

//       <h2 style={{ fontSize: 32 }}>Low Fat Recipes</h2>
//       <table style={{ textAlign: "left", width: "100%" }}>
//         <tbody>
//           {lowFat &&
//             lowFat.map((item, index) => (
//               <tr key={index}>
//                 <td
//                   style={{
//                     fontSize: 24,
//                     minWidth: "0px",
//                     display: "inline-block",
//                   }}
//                 >
//                   {item.name}
//                 </td>
//                 <td style={{ fontSize: 24 }}>
//                   <NavLink to={`/recipe/${item.rid}`}>{item.title}</NavLink>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </Container>
//   );
// } */}

/*

   <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Ingredient' value={ingredient} onChange={(e) => setIngredient(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>


      */

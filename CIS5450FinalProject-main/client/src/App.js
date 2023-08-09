import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SearchPage from "./pages/SearchPage";
import RecipesByDietPage from "./pages/RecipesByDietPage";
import RecipesInfoPage from "./pages/RecipesInfoPage";
import BalancedMealPlanPage from "./pages/BalancedMealPlanPage";
import PantryPage from "./pages/PantryPage";


// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
    background: {
      // default: "#efebe9"
    }
  },
  typography: {
    fontFamily: ['Georgia', 'sans-serif'].join(','),
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AboutPage" element={<AboutPage />} />
          <Route path="/RecipesByDietPage" element={<RecipesByDietPage />} />
          <Route path="/SearchPage" element={<SearchPage />} />
          <Route path="/recipe/:rid" element={<RecipesInfoPage />} />
          <Route path="/BalancedMealPlanPage" element={<BalancedMealPlanPage />} />
          <Route path="/PantryPage" element={<PantryPage />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
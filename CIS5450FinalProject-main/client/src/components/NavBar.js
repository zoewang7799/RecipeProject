import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h3' : 'h6'}
      noWrap
      style={{
        marginRight: '60px',
        fontFamily: 'Passion One',
        fontWeight: 400,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static' sx={{ background: '#3f51b5' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='The Recipe Database' isMain />
          <NavText href='/AboutPage' text='About' />
          <NavText href='/SearchPage' text='Search for Recipes' />
          <NavText href='/RecipesByDietPage' text='Trending' />
          <NavText href='/BalancedMealPlanPage' text='Meal Plans' />
          <NavText href='/PantryPage' text='Pantry' />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

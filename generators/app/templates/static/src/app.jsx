import React from 'react';

const App = ({page, changePage}) => {
  return (
    <div>
      <h1>The current page is {page}</h1>
      <button type='button' onClick={changePage('home')}> Home </button>
      <button type='button' onClick={changePage('dashboard')}> Dashboard </button>
    </div>
  );
};

export default App;

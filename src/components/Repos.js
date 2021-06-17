import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

/* sample data for ExampleChart component */
const chartData = [
  {
    label: "HTML",
    value: "13"
  },
  {
    label: "CSS",
    value: "23"
  },
  {
    label: "JavaScript",
    value: "80"
  }
];

const Repos = () => {
  const {repos} = React.useContext(GithubContext);
  // console.log('repos:', repos);

  const languages = repos.reduce((accum, item) => {
    const {language, stargazers_count} = item;

    if (!language) {
      return accum;
    }

    /* if this language hasn't been tallied before, create it here */
    if (!accum[language]) {
      accum[language] = {
        label: language,
        value: 1,
        numStars: stargazers_count
      };
    }
    else {
      /* increment the number of repos for this language */
      ++accum[language].value;
      ++accum[language].numStars;
    }

    return accum;
  }, {});

  const NUM_LANGUAGES = 5;

  /* sort the language objects in descending order number of repos */
  const mostUsed = Object.values(languages)
  .sort((a, b) => b.value - a.value)
  /* use slice to get up to the top N languages, excluding the last index */
  .slice(0, NUM_LANGUAGES);

  // console.log('mostUsed:', mostUsed);


  /* most stars per language */
  const mostPopular = Object.values(languages)
  .sort((a, b) => b.numStars - a.numStars)
  /* assign numStars to the value property because Fusion Charts
    expects the value to be displayed to be in the value property */
  .map(item => ({...item, value: item.numStars }))
  .slice(0, NUM_LANGUAGES);

  // console.log('mostPopular:', mostPopular);


  let {stars, forks} = repos.reduce((accum, item) => {
    
    const {stargazers_count, name, forks} = item;

    /* use stargazers_count as a key; the higher numbered keys will be
      added at the end of the object so we can easily determine which
      repos have the most stars */
    accum.stars[stargazers_count] = {
      label: name,
      value: stargazers_count
    };

    accum.forks[forks] = {
      label: name,
      value: forks
    };

    return accum;
  }, {stars: {}, forks: {}});

  /* get the repos with the most stars then reverse the array
    so the largest repos are first */
  stars = Object.values(stars).slice(-5).reverse();

  // console.log('stars:', stars);

  /* get the repos that were forked the most then reverse the array
    so the largest repos are first */
  forks = Object.values(forks).slice(-5).reverse();

  // console.log('forks:', forks);

  return <section className='section'>
    <Wrapper className='section-center'>
      <Pie3D data={mostUsed} />
      <Column3D data={stars} />

      {/* <ExampleChart data={chartData} /> */}

      <Doughnut2D data={mostPopular} />
      <Bar3D data={forks} />
    </Wrapper>
  </section>
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  /* one use case for !important is to override third-party
    inline styles */
  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;

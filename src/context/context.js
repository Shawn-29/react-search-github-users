import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

/* returns an object with Provider and Consumer properties
    although Consumer is not used because of the useContext hook */
const GithubContext = React.createContext();

/* this component wraps around the rest of the app's components */
const GithubProvider = ({children}) => {

    // console.log('child components:', children);

    /* state variables */
    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);

    const [requestsRemain, setRequestsRemain] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = React.useState({show: false, msg: ''});


    const searchGithubUser = async (username) => {

        /* reset error message before each search */
        toggleError();

        setIsLoading(true);

        const response = await axios(`${rootUrl}/users/${username}`).
            catch(err => console.log(err));

        console.log('response:', response);

        if (response) {
            /* user data will be on the response's data property */
            setGithubUser(response.data);

            /* Github API stores the username on the login property */
            const {login: username, followers_url} = response.data;

            /* wait for two asynchronous axios requests to settle;
                success or error is considered settled */
            await Promise.allSettled([
            // await Promise.all([
                axios(`${rootUrl}/users/${username}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`)
            ])
            .then(results => {
                console.log('results:', results);

                /* results contains an array with the results of each settled promise */
                const [reposData, followersData] = results;

                console.log('reposData:', reposData);
                if (reposData?.status === 'fulfilled') {
                    /* the actual data that was retrieved from the axio response will be
                        on the value object and its data property */
                    setRepos(reposData.value.data);
                }

                console.log('followersData:', followersData);
                if (followersData?.status === 'fulfilled') {
                    setFollowers(followersData.value.data);
                }
            })
            .catch(error => console.log(error));
        }
        else {
            toggleError(true, 'There is no user with that username.');
        }

        /* check how many API requests remain after this one */
        checkRequests();

        setIsLoading(false);
    };

    const toggleError = (show = false, msg = '') => {
        setError({show, msg});
    };

    const checkRequests = () => {
        /* unlike the fetch API, axio already returns a JSON object
            so we don't need to call the JSON method on it */
        axios(`${rootUrl}/rate_limit`)
        /* destructure out the data property from the response */
        .then(({data}) => {

            let {rate: {remaining}} = data;
            // remaining = 0; /* debug - show error message */

            setRequestsRemain(remaining);
            if (remaining === 0) {
                toggleError(true, 'Sorry, you have exceeded your hourly rate limit.');
            }
        })
        .catch(error => console.log(error));
    };

    useEffect(() => {
        checkRequests();
    }, []);

    /* the value given to the value prop will be accessible
        throughout the app */
    return <GithubContext.Provider value={{
        githubUser,
        repos,
        followers,
        requestsRemain,
        error,
        searchGithubUser,
        isLoading
    }}>
        {/* render the app's child components */}
        {children}
    </GithubContext.Provider>
};

export {GithubContext, GithubProvider};
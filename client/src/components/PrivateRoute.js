import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import API from '../utils/API.js';

/** Vérification de l'authentification de l'user **/
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(
        props) => {
        // Si l'user n'est pas connecté
        if (API.isAuth() === false) {
            return (<Redirect to='/' />)
        }
        else {
            return (<Component {...props} />);

        }
    }
    } />
)

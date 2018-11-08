import React from 'react';
import API from '../utils/API.js';
import { Route, Redirect } from 'react-router-dom';

/** Vérification de l'authentification de l'user **/
export const PublicRoute = ({ component: Component, ...rest }) => (
          <Route {...rest} render={(
                  props) => {
                    console.log(props.location.pathname);
                      var path = props.location.pathname;
                      // Si l'user n'est pas connecté
                      if(API.isAuth()===true){
                          return(<Redirect to='/Dashboard' />)
                      }else{
                          return( <Component {...props} /> );

                      }
                  }
                } />
              )

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import LoginScreen from './components/LoginScreen';
import {Toaster} from"react-hot-toast"

const App = () => (
  <>
  <ApolloProvider client={client}>
    <LoginScreen />
  </ApolloProvider>
  <Toaster />
  </>
);

export default App;
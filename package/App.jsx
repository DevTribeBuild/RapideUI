import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import LoginScreen from './components/LoginScreen';

const App = () => (
  <ApolloProvider client={client}>
    <LoginScreen />
  </ApolloProvider>
);

export default App;
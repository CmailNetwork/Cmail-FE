import React from 'react';
import { Provider as JotaiProvider } from 'jotai'
import {ChakraProvider} from "@chakra-ui/react";
import {Routers} from "./route";
import {theme} from "./ui/theme";

function App() {
  return (
      <JotaiProvider>
        <ChakraProvider theme={theme}>
          <Routers />
        </ChakraProvider>
      </JotaiProvider>
  );
}

export default App;

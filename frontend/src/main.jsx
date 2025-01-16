import React from "react";
import ReactDOM from "react-dom/client";
import "../src/styles/index.css";
import { Provider } from "react-redux";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import store from "./store";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </Provider>
);

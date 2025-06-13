import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    // 指向你的 Java 后端 GraphQL API 地址
    uri: "/graphql", 
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
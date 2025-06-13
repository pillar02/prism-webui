"use client";

import { ApolloProvider } from "@apollo/client";
import createApolloClient from "./apollo-client";

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  // createApolloClient() 返回一个 ApolloClient 实例
  // 我们将它传递给 ApolloProvider
  return (
    <ApolloProvider client={createApolloClient()}>{children}</ApolloProvider>
  );
}
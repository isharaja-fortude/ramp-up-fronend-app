import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, createHttpLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';

const uri = 'http://localhost:3001/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: createHttpLink({
      uri
    }),
    cache: new InMemoryCache({
       addTypename: false
    })
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

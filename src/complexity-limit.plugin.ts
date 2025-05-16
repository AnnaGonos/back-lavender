import { ApolloServerPlugin } from '@apollo/server';
import { getComplexity, fieldExtensionsEstimator, simpleEstimator } from 'graphql-query-complexity';

export const complexityLimitPlugin = (maxComplexity: number): ApolloServerPlugin => ({
  async requestDidStart() {
    return {
      async didResolveOperation({ request, document, schema }) {
        const complexity = getComplexity({
          schema,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        if (complexity > maxComplexity) {
          throw new Error(`Query is too complex: ${complexity}. Maximum allowed complexity is ${maxComplexity}.`);
        }

        console.log(`Query complexity: ${complexity}`);
      },
    };
  },
});
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: ['src/graphql/typeDefs/**/*.graphql', 'src/graphql/typeDefs/**/*.gql'],
    generates: {
        'src/graphql/generated/types.generated.ts': {
            plugins: ['typescript', 'typescript-resolvers']
        }
    }
};

export default config;

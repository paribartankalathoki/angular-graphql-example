const express = require("express");
const cors = require("cors");
const {graphqlHTTP} = require("express-graphql");
const {GraphQLSchema, GraphQLNonNull, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList} = require("graphql");


const DailyTasks = [
    {id: 1, name: 'Cook Meals', description: 'Need to cook meals'},
    {id: 2, name: 'Wash Clothes', description: 'Need to put the clothes in WM'},
    {id: 3, name: 'Go to Office', description: 'Need to go to office to work'},
]

const DailyTasksType = new GraphQLObjectType({
    name: 'DailyTask',
    description: 'This is a daily task schedule',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        dailyTasks: {
            type: new GraphQLList(DailyTasksType),
            description: 'List of All Daily Tasks',
            resolve: () => DailyTasks
        },
        dailyTask: {
            type: DailyTasksType,
            description: 'Single Daily Task',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
            },
            resolve: (root, args) => {
                return DailyTasks.find(todo => todo.id === args.id)
            }
        }
    })
})


const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addDailyTask: {
            type: DailyTasksType,
            description: 'Add a new daily task items',
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString)
                },
            },
            resolve: (root, args) => {
                const newDailyTask = {
                    id: DailyTasks.length + 1,
                    name: args.name,
                    description: args.description,
                }
                DailyTasks.push(newDailyTask)
                return newDailyTask;
            }
        },
        deleteDailyTask: {
            type: DailyTasksType,
            description: 'Delete a daily task',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
            },
            resolve: (root, args) => {
                const dailyTask = DailyTasks.find(todo => todo.id === args.id)
                if (dailyTask) {
                    DailyTasks.splice(DailyTasks.indexOf(dailyTask), 1)
                    return dailyTask;
                }
                return null
            }
        },
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

const app = express();

app.use(cors());
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        graphiql: true
    })
);
app.listen(4000);

console.log("Running a GraphQL API server at localhost:4000/graphql");

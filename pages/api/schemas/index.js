import {gql} from "apollo-server-micro";

export const typeDefs = gql`
  type Set {
      weight: Int
      repetitions: Int
      time: Int
      oneRepMax: Int!
      volume: Int!
  }
  type Exercise {
      name: String!
      sets: [Set]
      bestSet1RM: Int!
      bestSetVolume: Int!
  }
  type Workout {
      title: String!
      date: String!
      bodyWeight: Float!
      note: String!
      exercises: [Exercise!]
      totalVolume: Int!
  }
  type AllTimeExerciseRecord {
    name: String!
    sets: Int!
    volume: Int!
    repetitions: Int!
    duration: Int!
    oneRepMax: Int!
    oneRepMaxDate: String!
    bestSet: Int!
    bestSetDate: String!
  }

  
  type Query {
    getWorkouts: [Workout!]
    getWorkout(date: String!): Workout!
    getExerciseRecords(name: String!): AllTimeExerciseRecord!
  }
`
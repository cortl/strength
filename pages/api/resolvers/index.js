import SetResolver from './set';
import ExerciseResolver from './exercise';
import WorkoutResolver from './workout'
import QueryResolver from './query'

export const resolvers = {
    Set: SetResolver,
    Exercise: ExerciseResolver,
    Workout: WorkoutResolver,
    Query: QueryResolver
};
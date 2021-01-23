
import workouts from '../../../data/workouts.json'
import exerciseService from './exercise-service';

const exerciseToName = exercise => exercise.name
const sortByDates = (workoutA, workoutB) => (workoutA.date > workoutB.date) ? -1 : 1;

const getBestOneRepForGivenExercise = (exerciseName, workout) => {
    const exercisesInWorkout = workout.exercises.map(exerciseToName);
    const exerciseIndex = exercisesInWorkout.findIndex(exercise => exercise === exerciseName);

    return exerciseService.getOneRepMaxFromSets(workout.exercises[exerciseIndex].sets);
}
const workoutContainsExercise = exerciseName => workout => workout.exercises.map(exerciseToName).includes(exerciseName);
const getLastOneRepMax = (exerciseName, fromDate) => {
    const previousWorkouts = workouts
        .filter(workout => new Date(workout.date) < fromDate)
        .filter(workoutContainsExercise(exerciseName))
        .sort(sortByDates);

    const previousBest = previousWorkouts.map(workout => {
        return getBestOneRepForGivenExercise(exerciseName, workout)
    }).reduce((best, current) => current > best ? current : best, -1)

    return previousBest;
}

const getBestWeightForGivenExercise = (exerciseName, workout) => {
    const exercisesInWorkout = workout.exercises.map(exerciseToName);
    const exerciseIndex = exercisesInWorkout.findIndex(exercise => exercise === exerciseName);

    return exerciseService.getBestWeightFromSets(workout.exercises[exerciseIndex].sets);
}
const getLastHeaviestWeight = (exerciseName, fromDate) => {
    const previousWorkouts = workouts
        .filter(workout => new Date(workout.date) < fromDate)
        .filter(workoutContainsExercise(exerciseName))
        .sort(sortByDates);

    const previousBest = previousWorkouts.map(workout => {
        return getBestWeightForGivenExercise(exerciseName, workout)
    }).reduce((best, current) => current > best ? current : best, -1);

    return previousBest

}

export default {
    getLastOneRepMax,
    getLastHeaviestWeight
}
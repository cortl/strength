import workouts from '../../../data/workouts.json'

import exerciseService from './exercise-service';
import {formatDate} from '../utils/date';

const sum = (a, b) => a + b;
const getLargestOf = (a, b) => Math.max(a, b);

const getVolumeFromExercise = (exerciseName) => workouts
    .map(workout => {
        const exercise = workout.exercises.find(exercise => exercise.name === exerciseName);
        return exercise
            ? exercise.sets.map(set => set.weight * set.repetitions).reduce(sum, 0)
            : 0;
    }).reduce(sum, 0);

const getDuration = (exerciseName) => workouts
    .map(workout => {
        const exercise = workout.exercises.find(exercise => exercise.name === exerciseName);
        return exercise
            ? exercise.sets.map(({time}) => time).reduce(sum, 0)
            : 0;
    }).reduce(sum, 0);

const getRepitions = (exerciseName) => workouts
    .map(workout => {
        const exercise = workout.exercises.find(exercise => exercise.name === exerciseName);
        return exercise
            ? exercise.sets.map(({repetitions}) => repetitions).reduce(sum, 0)
            : 0;
    }).reduce(sum, 0);

const getSets = (exerciseName) => {
    const allExercises = workouts
        .flatMap(workout => workout.exercises.map(exercise => exercise.name))
        .reduce((exercises, exercise) => {
            if (exercise in exercises) {
                exercises[exercise] += 1;
            } else {
                exercises[exercise] = 1;
            }
            return exercises;
        }, {})
    return allExercises[exerciseName];
}

const getOneRepMax = (exerciseName) => {
    const best = workouts.map(workout => {
        const relevantExercises = workout.exercises.filter(exercise => exercise.name === exerciseName);
        const bestSet = relevantExercises.map(exercise => exerciseService.getOneRepMaxFromSets(exercise.sets)).reduce(getLargestOf, 0);
        return {date: workout.date, number: bestSet};
    }).reduce((previous, current) => (previous.number > current.number) ? previous : current);

    return {
        ...best,
        date: formatDate(best.date),
    }
};

const getBestVolume = (exerciseName) => {
    const best = workouts.map(workout => {
        const relevantExercises = workout.exercises.filter(exercise => exercise.name === exerciseName);
        const bestSet = relevantExercises.map(exercise => exerciseService.getVolumeFromSets(exercise.sets)).reduce(getLargestOf, 0);
        return {date: workout.date, number: bestSet};
    }).reduce((previous, current) => (previous.number > current.number) ? previous : current);

    return {
        ...best,
        date: formatDate(best.date),
    }
}

const allExercises = Array.from(new Set(workouts.flatMap(workout => workout.exercises.map(exercise => exercise.name))));
const recordsByExercise = allExercises.map(exercise => {
    const oneRepMax = getOneRepMax(exercise);
    const bestVolume = getBestVolume(exercise);
    return {
        name: exercise,
        sets: getSets(exercise),
        volume: getVolumeFromExercise(exercise),
        duration: getDuration(exercise),
        repetitions: getRepitions(exercise),
        oneRepMax: oneRepMax.number,
        oneRepMaxDate: oneRepMax.date,
        bestSet: bestVolume.number,
        bestSetDate: bestVolume.date
    }
}).reduce((records, exercise) => {
    records[exercise.name] = exercise;
    return records;
}, {});

const getAllReps = () => {
    return workouts.map(workout => {
        return workout.exercises.map(exercise => {
            return exercise.sets.map(set => set.repetitions).reduce(sum, 0)
        }).reduce(sum, 0)
    }).reduce(sum, 0)
}

const getAllVolume = () =>
    workouts.map(workout => exerciseService.getTotalVolume(workout.exercises))
        .reduce(sum, 0);

const getRecordsForExercise = name => {
    return recordsByExercise[name];
}

export default {
    getRecordsForExercise,
    getAllVolume,
    getAllReps
}
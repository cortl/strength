import workoutService from './workouts-service';

const getLargestOf = (a, b) => Math.max(a, b);
const getBrzycki1RM = ({weight, repetitions}) => weight / (1.0278 - (0.0278 * repetitions));

const getOneRepMax = (set) => Math.ceil(getBrzycki1RM(set))
const getOneRepMaxFromSets = (sets) => Math.ceil(sets.map(getBrzycki1RM).reduce(getLargestOf, 0));

const getVolume = ({weight, repetitions}) => weight * repetitions
const getVolumeFromSets = (sets) => sets.map(getVolume).reduce(getLargestOf, 0);

const getWeight = ({weight}) => weight;
const getBestWeightFromSets = (sets) => sets.map(getWeight).reduce(getLargestOf, 0);

const sum = (a, b) => a + b
const getTotalVolume = (exercises) => {
    return exercises.map(exercise => exercise.sets.map(getVolume).reduce(sum, 0)).reduce(sum, 0)
}

const getBestSetIndex = (sets) => {
    return sets.reduce((bestSet, set, i) => {
        const {reps, weight} = set;
        if (weight > bestSet.weight) {
            return {index: i, reps, weight}
        } else if (weight === bestSet.weight && reps > bestSet.reps) {
            return {index: i, reps, weight}
        } else {
            return bestSet;
        }
    }, {index: -1, reps: -1, weight: -1}).index;
}

const withBestSet = (bestSetIndex) => (set, i) => {
    return {
        ...set,
        isBest: bestSetIndex === i
    }
}

const mapWithBestSet = sets => {
    const bestSetIndex = getBestSetIndex(sets);
    return sets.map(withBestSet(bestSetIndex));
}

const isOneRepMaxPr = exercise => {
    const bestOneRepMax = getOneRepMaxFromSets(exercise.sets);
    const previousOneRepMax = workoutService.getLastOneRepMax(exercise.name, new Date(exercise.date));

    return bestOneRepMax > previousOneRepMax;
}

const isWeightPr = exercise => {
    const bestWeight = getBestWeightFromSets(exercise.sets);
    const bestPreviousWeight = workoutService.getLastHeaviestWeight(exercise.name, new Date(exercise.date));

    return bestWeight > bestPreviousWeight;
}

export default {
    getOneRepMax,
    getOneRepMaxFromSets,

    getVolume,
    getVolumeFromSets,

    getBestWeightFromSets,

    getTotalVolume,
    mapWithBestSet,

    isOneRepMaxPr,
    isWeightPr
}
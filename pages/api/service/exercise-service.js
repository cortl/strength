const getLargestOf = (a, b) => Math.max(a, b);
const getBrzycki1RM = ({weight, repetitions}) => weight / (1.0278 - (0.0278 * repetitions));

const getOneRepMax = (set) => Math.ceil(getBrzycki1RM(set))
const getOneRepMaxFromSets = (sets) => Math.ceil(sets.map(getBrzycki1RM).reduce(getLargestOf, 0));

const getVolume = ({weight, repetitions}) => weight * repetitions
const getVolumeFromSets = (sets) => sets.map(getVolume).reduce(getLargestOf, 0);

const sum = (a, b) => a + b
const getTotalVolume = (exercises) => {
    return exercises.map(exercise => exercise.sets.map(getVolume).reduce(sum)).reduce(sum)
}

export default {
    getOneRepMax,
    getOneRepMaxFromSets,

    getVolume,
    getVolumeFromSets,

    getTotalVolume
}
import exerciseService from '../service/exercise-service';

const withBestSet = (bestSetIndex) => (set, i) => {
    return {
        ...set,
        isBest: bestSetIndex === i
    }
}

export default {
    bestSet1RM: (parent, args, context, info) => {
        return exerciseService.getOneRepMaxFromSets(parent.sets);
    },
    bestSetVolume: (parent, args, context, info) => {
        return exerciseService.getVolumeFromSets(parent.sets);
    },
    sets: (parent, args, context, info) => {
        const {index: bestSetIndex} = parent.sets.reduce((bestSet, set, i) => {
            const {reps, weight} = set;
            if (weight > bestSet.weight) {
                return {index: i, reps, weight}
            } else if (weight === bestSet.weight && reps > bestSet.reps) {
                return {index: i, reps, weight}
            } else {
                return bestSet;
            }
        }, {index: -1, reps: -1, weight: -1})

        return parent.sets.map(withBestSet(bestSetIndex));
    }
}

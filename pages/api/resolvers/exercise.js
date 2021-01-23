import exerciseService from '../service/exercise-service';

export default {
    bestSet1RM: (parent, args, context, info) => {
        return exerciseService.getOneRepMaxFromSets(parent.sets);
    },
    bestSetVolume: (parent, args, context, info) => {
        return exerciseService.getBestVolumeFromSets(parent.sets);
    },
    sets: (parent, args, context, info) => {
        return exerciseService.mapWithBestSet(parent.sets);
    },
    is1RMPr: (parent, args, context, info) => {
        return exerciseService.isOneRepMaxPr(parent);
    },
    isWeightPr: (parent, args, context, info) => {
        return exerciseService.isWeightPr(parent);
    }
}

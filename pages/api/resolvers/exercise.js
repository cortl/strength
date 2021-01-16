import exerciseService from '../service/exercise-service';

export default {
    bestSet1RM: (parent, args, context, info) => {
        return exerciseService.getOneRepMaxFromSets(parent.sets);
    },
    bestSetVolume: (parent, args, context, info) => {
        return exerciseService.getVolumeFromSets(parent.sets);
    }
}

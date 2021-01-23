import exerciseService from '../service/exercise-service';

export default {
    oneRepMax: (parent, args, context, info) => {
        return exerciseService.getOneRepMax(parent);
    },
    volume: (parent, args, context, info) => {
        return exerciseService.getVolume(parent)
    },
    weight: (parent, args, context, info) => {
        return parent.weight ?? 0;
    }
}
import {formatDate} from '../utils/date';
import exerciseService from '../service/exercise-service';

export default {
    date: (parent, args, context, info) => {
        return formatDate(parent.date);
    },
    totalVolume: (parent, args, context, info) => {
        return exerciseService.getTotalVolume(parent.exercises);
    }
}
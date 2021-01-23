import {formatDate} from '../utils/date';
import exerciseService from '../service/exercise-service';

const withDate = (date) => (exercise) => ({
    ...exercise,
    date
})

export default {
    date: (parent, args, context, info) => {
        return formatDate(parent.date);
    },
    totalVolume: (parent, args, context, info) => {
        return exerciseService.getTotalVolume(parent.exercises);
    },
    exercises: (parent, args, context, info) => {
        return parent.exercises.map(withDate(parent.date))
    }
}
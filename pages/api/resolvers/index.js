import workouts from '../../../data/workouts.json'
import exerciseService from '../service/exercise-service';
import recordsService from '../service/records-service';
import {formatDate} from '../utils/date';

export const resolvers = {
    Set: {
        oneRepMax: (parent, args, context, info) => {
            return exerciseService.getOneRepMax(parent);
        },
        volume: (parent, args, context, info) => {
            return exerciseService.getVolume(parent)
        }
    },
    Exercise: {
        bestSet1RM: (parent, args, context, info) => {
            return exerciseService.getOneRepMaxFromSets(parent.sets);
        },
        bestSetVolume: (parent, args, context, info) => {
            return exerciseService.getVolumeFromSets(parent.sets);
        }
    },
    Workout: {
        date: (parent, args, context, info) => {
            return formatDate(parent.date);
        },
        totalVolume: (parent, args, context, info) => {
            return exerciseService.getTotalVolume(parent.exercises);
        }
    },
    Query: {
        getWorkouts: async () => {
            try {
                return workouts;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        getWorkout: (parent, args, context, info) => {
            try {
                const compareDate = new Date(args.date);
                const record = workouts.find(workout => {
                    const workoutDate = new Date(workout.date);
                    return workoutDate.getFullYear() === compareDate.getFullYear()
                        && workoutDate.getMonth() === compareDate.getMonth()
                        && workoutDate.getDate() === compareDate.getDate();
                });
                return record;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        getExerciseRecords: (parent, args, context, info) => {
            try {
                const record = recordsService.getRecordsForExercise(args.name);
                return record;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
};
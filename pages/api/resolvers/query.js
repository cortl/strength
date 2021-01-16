import workouts from '../../../data/workouts.json'
import recordsService from '../service/records-service';

export default {
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
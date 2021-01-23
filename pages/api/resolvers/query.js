import workouts from '../../../data/workouts.json'
import recordsService from '../service/records-service';
import workoutService from '../service/workouts-service';

const byYear = (years, workout) => {
    const year = new Date(workout.date).getFullYear();
    if (year in years) {
        years[year].push(workout);
    } else {
        years[year] = [workout];
    }
    return years;
}

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
    },
    getWorkoutRecord: (parent, args, context, info) => {
        try {
            const workoutsByYears = workouts.reduce(byYear, {});
            return {
                numberOfWorkouts: workouts.length,
                durationOfYears: Object.keys(workoutsByYears).length,
                repetitions: recordsService.getAllReps(),
                volume: recordsService.getAllVolume()
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getOneRepMaxOverTime: (parent, args, context, info) => {
        try {
            const {name: exercise} = args;
            return workoutService.getOneRepMaxByDateForExercise(exercise);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    getVolumeOverTime: (parent, args, context, info) => {
        try {
            const {name: exercise} = args;
            return workoutService.getVolumeByDateForExercise(exercise);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../styles/Home.module.css'

export default function Exercise(props) {
    return (
        <div className={styles.container}>
            <Head>
                <title>{props.name} | Strength Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    {props.name}
                </h1>
                <h2 className={styles.subtitle}>{'Total Metrics'}</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3>{'Total Volume'}</h3>
                        <p>{`${props.volume.toLocaleString()}lbs`}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>{'Total Sets'}</h3>
                        <p>{props.sets.toLocaleString()}</p>
                    </div>
                    <div className={styles.card}>
                        <h3>{'Total Repetitions'}</h3>
                        <p>{props.repetitions.toLocaleString()}</p>
                    </div>
                </div>
                <h2 className={styles.subtitle}>{'PRs'}</h2>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3>{'One Rep Max'}</h3>
                        <p>{`${props.oneRepMax.toLocaleString()}lbs`}</p>
                        <p>{'achieved on '}<a href={`/dates/${props.oneRepMaxDate}`}>{props.oneRepMaxDate}</a></p>
                    </div>
                    <div className={styles.card}>
                        <h3>{'Best Set'}</h3>
                        <p>{`${props.bestSet.toLocaleString()}lbs`}</p>
                        <p>{'achieved on '}<a href={`/dates/${props.bestSetDate}`}>{props.bestSetDate}</a></p>
                    </div>
                </div>
            </main>
        </div>
    );
}

const toExerciseName = {
    'squat': 'Squat (Barbell)',
    'bench-press': 'Bench Press (Barbell)',
    'deadlift': 'Deadlift (Barbell)',
    'overhead-press': 'Strict Military Press (Barbell)'
}

export async function getServerSideProps(context) {
    const {exercise} = context.query;
    const client = new ApolloClient({
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache()
    });

    const readableExercise = toExerciseName[exercise];

    const {data} = await client.query({
        query: gql`
        query GetExerciseRecords($exercise: String!) {
                    getExerciseRecords(name: $exercise) {
                name
                volume
                sets
                repetitions
                oneRepMax
                oneRepMaxDate
                bestSet
                bestSetDate
            }
        }
    `,
        variables: {
            exercise: readableExercise
        }
    });

    return {
        props: data.getExerciseRecords
    }
}
import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../styles/Home.module.css'
import Grid from '../components/grid';
import Card from '../components/card';
import Chart from '../components/chart';

const Exercise = ({records, oneRepMaxData, volumeData}) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>{records.name} | Strength Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {records.name}
                </h1>

                <h2 className={styles.subtitle}>{'Total Metrics'}</h2>
                <Grid>
                    <Card half>
                        <h3>{'Total Volume'}</h3>
                        <p>{`${records.volume.toLocaleString()}lbs`}</p>
                    </Card>
                    <Card half>
                        <h3>{'Total Reps'}</h3>
                        <p>{`${records.repetitions.toLocaleString()}`}</p>
                    </Card>
                </Grid>

                <h2 className={styles.subtitle}>{'PRs'}</h2>
                <Grid>
                    <Card half>
                        <h3>{'One Rep Max'}</h3>
                        <p>{`${records.oneRepMax.toLocaleString()}lbs`}</p>
                        <p>{'achieved on '}<a href={`/dates/${records.oneRepMaxDate}`}>{records.oneRepMaxDate}</a></p>
                    </Card>
                    <Card half>
                        <h3>{'Best Volume'}</h3>
                        <p>{`${records.bestSet.toLocaleString()}lbs`}</p>
                        <p>{'achieved on '}<a href={`/dates/${records.bestSetDate}`}>{records.bestSetDate}</a></p>
                    </Card>
                </Grid>
                <Grid>
                    <Card full>
                        <h3>{'1RM Progression Over Time'}</h3>
                        <Chart data={oneRepMaxData} />
                    </Card>
                    <Card full>
                        <h3>{'Volume Over Time'}</h3>
                        <Chart data={volumeData} />
                    </Card>
                </Grid>
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
            getOneRepMaxOverTime(name: $exercise) {
                date
                value
            }
            getVolumeOverTime(name: $exercise) {
                date
                value
            }
        }
    `,
        variables: {
            exercise: readableExercise
        }
    });

    return {
        props: {
            records: data.getExerciseRecords,
            oneRepMaxData: data.getOneRepMaxOverTime,
            volumeData: data.getVolumeOverTime
        }
    }
}

export default Exercise
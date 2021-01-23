import Head from 'next/head';
import {useRouter} from 'next/router';
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../../styles/Home.module.css';
import table from '../../styles/Table.module.css';
import Grid from '../../components/grid';
import Card from '../../components/card';

const buildCardForExercise = (exercise, i) => (
    <Card key={`exercise${i}`}>
        <h3>{exercise.name}</h3>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th className={`${table.head} ${table.number}`}>{'Set'}</th>
                    <th className={table.head}>{exercise.name}</th>
                    <th className={`${table.head} ${table.number}`}>{'Volume'}</th>
                    <th className={`${table.head} ${table.number}`}>{'1RM'}</th>
                </tr>
            </thead>
            <tbody>
                {exercise.sets.map((set, i) => (
                    <tr key={`set${i}`} className={set.isBest ? styles.highlight : ''}>
                        <td>{i + 1}</td>
                        <td>{`${set.weight} x ${set.repetitions}`}</td>
                        <td>{set.volume.toLocaleString()}</td>
                        <td>{set.oneRepMax.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
)

const Date = (props) => {
    const router = useRouter();
    const {date} = router.query
    return (
        <div className={styles.container}>
            <Head>
                <title>{`${date} | Strength Tracker`}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    {props.title}
                </h1>
                <p className={styles.description}>
                    {date}
                </p>
                <Grid>
                    <Card half>
                        <h3>{'Total Volume'}</h3>
                        <p>{`${props.totalVolume.toLocaleString()}lbs`}</p>
                    </Card>
                    <Card half>
                        <h3>{'PRs'}</h3>
                        {
                            props.exercises
                                .filter(exercise => exercise.is1RMPr).length
                            + props.exercises
                                .filter(exercise => exercise.isWeightPr).length
                        }
                    </Card>
                </Grid>
                <Grid>
                    {props.exercises.map(buildCardForExercise)}
                </Grid>
            </main>
        </div>
    );
}

export async function getServerSideProps(context) {
    const {date} = context.query;
    const client = new ApolloClient({
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache()
    });

    const {data} = await client.query({
        query: gql`
        query GetWorkout($date: String!) {
            getWorkout(date: $date) {
                title
                bodyWeight
                totalVolume
                exercises {
                    name
                    is1RMPr
                    isWeightPr
                    sets {
                        weight
                        repetitions
                        oneRepMax
                        volume
                        isBest
                    }
                }
            }
        }
    `,
        variables: {
            date
        }
    });
    return {
        props: data.getWorkout
    }
}

export default Date
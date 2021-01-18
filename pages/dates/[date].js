import Head from 'next/head'
import {useRouter} from 'next/router'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../../styles/Home.module.css'
import Grid from '../../components/grid';
import Card from '../../components/card';

const buildCardForExercise = (exercise, i) => (
    <Card full key={`exercise${i}`}>
        <h3>{exercise.name}</h3>
        <table className={styles.table}>
            <thead>
                <th></th>
                <th>{exercise.name}</th>
                <th>{'Volume'}</th>
                <th>{'1RM'}</th>
            </thead>
            <tbody>
                {exercise.sets.map((set, i) => (
                    <tr key={`set${i}`}>
                        <td>{i}</td>
                        <td>{`${set.weight} x ${set.repetitions}`}</td>
                        <td>{set.volume}</td>
                        <td>{set.oneRepMax}</td>
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
                exercises {
                    name
                    sets {
                        weight
                        repetitions
                        oneRepMax
                        volume
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
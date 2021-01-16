import Head from 'next/head'
import {useRouter} from 'next/router'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../../styles/Home.module.css'


const buildCardForExercise = (exercise, i) => (
    <div className={styles.card} key={`exercise${i}`}>
        <h3>{exercise.name}</h3>
        <ol>
            {exercise.sets.map((set, i) => (
                <li key={`set${i}`}>
                    {`${set.weight} x ${set.repetitions}`}
                </li>
            ))}
        </ol>
    </div>
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
                <div className={styles.grid}>
                    {props.exercises.map(buildCardForExercise)}
                </div>
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
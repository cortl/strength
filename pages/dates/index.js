import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../../styles/Home.module.css'

const byYear = (years, workout) => {
    const year = new Date(workout.date).getFullYear();

    if (year in years) {
        years[year].push(workout);
    } else {
        years[year] = [workout];
    }
    return years;
}

const buildCardsFor = workouts => {
    return workouts.map(workout => {
        return (
            <a href={`/dates/${workout.date}`} className={`${styles.card} ${styles.quarter}`}>
                <h3>{workout.title}</h3>
                <p>{workout.date}</p>
            </a>
        );
    });
}

export default function Dates(props) {
    return (
        <div className={styles.container}>
            <Head>
                <title>History | Strength Tracker</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    {'History'}
                </h1>

                {Object.keys(props.years).map(year => {
                    return (
                        <>
                            <h2 className={styles.subtitle}>{year}</h2>
                            <div className={styles.grid}>
                                {buildCardsFor(props.years[year])}
                            </div>
                        </>
                    )
                })}

            </main>
        </div>
    )
}

export async function getStaticProps() {
    const client = new ApolloClient({
        uri: 'http://localhost:3000/api/graphql',
        cache: new InMemoryCache()
    });

    const {data} = await client.query({
        query: gql`
        query GetWorkouts {
            getWorkouts {
                title
                date
                exercises {
                    name
                }
            }
        }
    `
    });
    return {
        props: {years: data.getWorkouts.reduce(byYear, {})}
    }
}
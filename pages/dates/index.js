import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import Card from '../../components/card'
import Grid from '../../components/grid'
import styles from '../../styles/Home.module.css'
import table from '../../styles/Table.module.css';

import {Fragment} from 'react';

const byYear = (years, workout) => {
    const year = new Date(workout.date).getFullYear();

    if (year in years) {
        years[year].push(workout);
    } else {
        years[year] = [workout];
    }
    return years;
}

const hasBest = exercise => {
    return Boolean(exercise.sets.filter(set => set.isBest).length)
}

const buildCardsFor = workouts => {
    return workouts.map((workout, i) => {
        return (
            <Card key={`workout${i}`} half link to={`/dates/${workout.date}`}>
                <h3>{workout.title}</h3>
                <p>{workout.date}</p>
                <table className={styles.table}>
                    <thead>
                        <th className={table.head}>{'Exercise'}</th>
                        <th className={`${table.head} ${table.bignum}`}>{'Best Set'}</th>
                    </thead>
                    <tbody>
                        {
                            workout.exercises.filter(hasBest).map(exercise => {
                                console.log(exercise)
                                const bestSet = exercise.sets.find(set => set.isBest);
                                return (
                                    <tr>
                                        <td>{exercise.name}</td>
                                        <td>{`${bestSet.weight} x ${bestSet.repetitions ?? `${bestSet.time}s`}`}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </Card>
        );
    });
}

const Dates = (props) => {
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

                {Object.keys(props.years).map(year => (
                    <Fragment key={year}>
                        <h2 className={styles.subtitle}>{year}</h2>
                        <Grid>
                            {buildCardsFor(props.years[year])}
                        </Grid>
                    </Fragment>
                )
                )}
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
                    sets {
                        weight
                        repetitions
                        time
                        isBest
                    }
                }
            }
        }
    `
    });
    return {
        props: {years: data.getWorkouts.reduce(byYear, {})}
    }
}

export default Dates;
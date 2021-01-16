import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../styles/Home.module.css'

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Strength Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {'Strength Tracker'}
        </h1>

        <p className={styles.description}>
          {`Consolidated views of all ${props.numberOfWorkouts} of `}<a className={styles.link} href='https://www.cortlan.dev/'>my</a>{` workout progress over ${props.durationOfYears} years.`}
        </p>

        <h2 className={styles.subtitle}>{'Exercises'}</h2>
        <div className={styles.grid}>
          <a href="/squat" className={styles.card}>
            <h3>{`Squat`}</h3>
          </a>
          <a href="/bench-press" className={styles.card}>
            <h3>{`Bench Press`}</h3>
          </a>
          <a href="/deadlift" className={styles.card}>
            <h3>{`Deadlift`}</h3>
          </a>
          <a href="/overhead-press" className={styles.card}>
            <h3>{`Overhead Press`}</h3>
          </a>
        </div>
        <h2 className={styles.subtitle}>{'Exercises'}</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>{`Total Volume`}</h3>
            <p>{`${props.volume.toLocaleString()}lbs`}</p>
          </div>
          <div className={styles.card}>
            <h3>{`Total Reps`}</h3>
            <p>{`${props.repetitions.toLocaleString()}`}</p>
          </div>
        </div>
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
        query GetWorkoutRecord {
            getWorkoutRecord {
                numberOfWorkouts
                durationOfYears
                repetitions
                volume
            }
        }
    `
  });
  return {
    props: data.getWorkoutRecord
  }
}
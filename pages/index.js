import Head from 'next/head'
import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

import styles from '../styles/Home.module.css'
import Card from '../components/Card';
import Grid from '../components/Grid';

const Home = (props) => {
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
          {`Consolidated views of all `}{<a className={styles.link} href="/dates">{props.numberOfWorkouts}</a>}{` of `}<a className={styles.link} href='https://www.cortlan.dev/'>my</a>{` workout progress over ${props.durationOfYears} years.`}
        </p>

        <h2 className={styles.subtitle}>{'Exercises'}</h2>
        <Grid>
          <Card half link to='/squat'>
            <h3>{`Squat`}</h3>
          </Card>
          <Card half link to='/bench-press'>
            <h3>{`Bench Press`}</h3>
          </Card>
          <Card half link to='/deadlift'>
            <h3>{`Deadlift`}</h3>
          </Card>
          <Card half link to='/overhead-press'>
            <h3>{`Overhead Press`}</h3>
          </Card>
        </Grid>

        <h2 className={styles.subtitle}>{'Lifetime Stats'}</h2>
        <Grid>
          <Card half>
            <h3>{`Total Volume`}</h3>
            <p>{`${props.volume.toLocaleString()}lbs`}</p>
          </Card>
          <Card half>
            <h3>{`Total Reps`}</h3>
            <p>{`${props.repetitions.toLocaleString()}`}</p>
          </Card>
        </Grid>
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

export default Home;
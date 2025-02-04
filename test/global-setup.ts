import { GenericContainer, StartedTestContainer } from 'testcontainers';

export function startMongo() {
  let _mongoContainer: StartedTestContainer | null = null;

  beforeAll(async () => {
    do {
      try {
        _mongoContainer = await new GenericContainer('mongo')
          .withExposedPorts({
            container: 27017,
            host: 27017,
          })
          .withReuse()
          .start();
        break;
      } catch (error) {
        if (!error.message.includes('port is already allocated')) {
          throw error;
        }
      }
    } while (true);
  }, 20000);
  return {
    get mongoContainer() {
      return _mongoContainer;
    },
  };
}

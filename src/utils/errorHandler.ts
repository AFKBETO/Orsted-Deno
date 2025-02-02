export function errorHandler(error: Error) {
  console.log(`[${new Date()}] - Error: ${error.name}`);
  console.log(error);
}


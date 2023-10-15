export const prepareResponse = (statusCode: number, requestOrigin: string, response: Record<string, unknown>) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': requestOrigin,
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  },
    body: JSON.stringify(response)
  }
}
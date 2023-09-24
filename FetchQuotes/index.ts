import { AzureFunction, Context, HttpRequest } from '@azure/functions'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    context.log('HTTP trigger function processed a request.')
    const name = (req.query.name || (req.body && req.body.name))
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
  
    context.res = {
      body: responseMessage
    }
  } catch(error) {
    context.log.error(`FetchQuotes: An error occured -  ${error.message}`)
    context.res = {
      status: 500,
      body: error.message
    }
  }
}

export default httpTrigger
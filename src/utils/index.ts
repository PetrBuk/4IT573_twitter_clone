import { Request, RequestHandler } from 'express'
import { ZodSchema } from 'zod'

// ToDo: General RequestHandler type with auth context

/**
 * Request handler with schema validation for request params, body and query
 *
 * @param schemas Validation schemas for request params, body and query
 * @param handler Request handler
 * @returns Safe request handler
 */
export const safeRequestHandler = <TParams, TBody, TQuery>(
  schemas: {
    params?: ZodSchema<TParams>
    body?: ZodSchema<TBody>
    query?: ZodSchema<TQuery>
  },
  handler: RequestHandler<TParams, any, TBody, TQuery>
): RequestHandler<TParams, any, TBody, TQuery> => {
  return (req, res, next) => {
    try {
      // Validate request data
      schemas.body?.parse(req.body)
      schemas.params?.parse(req.params)
      schemas.query?.parse(req.query)

      handler(req, res, next)
    } catch (error: any) {
      // ToDo: Format this error properly
      console.error('Validation error:', error.errors)
      res.status(400).json({ error: error.errors })
    }
  }
}

/** Check if we need to return the html type */
export const htmlResponseType = (
  req: Request<unknown, unknown, unknown, unknown>
) => {
  return !req.headers.accept?.includes('application/json')
}

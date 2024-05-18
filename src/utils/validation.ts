import z from 'zod'

/** Use to validate that id in url params is uuid type */
export const idParamSchema = z.object({ id: z.string().uuid() })

/* eslint-disable @typescript-eslint/no-shadow */
import { dedupe, throttlingCache } from '../utils/middlewares'
import wretch from 'wretch'

const BaseService = (url: string, token?: string) => {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  console.log('data', token)
  if (token !== '') {
    headers.append('Authorization', 'Bearer ' + token)
  }
  headers.append('Content-Type', 'application/json')
  return wretch('http://localhost:5173/api/' + url)
    .errorType('json')
    .headers(headers)
    .middlewares([
      dedupe({
        /* Options - defaults below */
        skip: (_, opts) => opts.skipDedupe || opts.method !== 'GET',
        key: (url, opts) => opts.method + '@' + url,
        resolver: (response) => response.clone(),
      }),
      throttlingCache({
        /* Options - defaults below */
        throttle: 1000,
        skip: (_, opts) => opts.skipCache || opts.method !== 'GET',
        key: (url, opts) => opts.method + '@' + url,
        clear: () => false,
        invalidate: () => '',
        condition: (response) => response.ok,
        flagResponseOnCacheHit: '__cached',
      }),
      (next: any) => async (url: any, opts: any) => {
        const response = await next(url, opts)
        try {
          Reflect.get(response, 'type', response)
        } catch (error) {
          Object.defineProperty(response, 'type', {
            get: () => 'default',
          })
        }
        return response
      },
    ])
    .resolve((r) =>
      r
        .notFound(() => {
          return 'Not Found'
        })
        .fetchError(() => {
          return 'Fetch Error'
        })
        .forbidden(() => {
          return 'Forbidden'
        })
        .unauthorized(() => {
          return 'Unauthorized'
        })
        .badRequest(() => {
          return 'Bad request'
        })
        .internalError(() => {
          return 'Internal Error'
        })
        .json(),
    )
}

export default BaseService

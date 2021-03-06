const request = require('request-promise')
const errors  = require('request-promise/errors')
const cheerio = require('cheerio')

const logger  = require('./logger')

/**
 *  Load a page by request-promise and wrap into cheerio
 *  @param  {string}  url
 *  @return {Promise}
 */
const loader = (url) => {
  logger.info(`Start url: ${url}`)
  return request
    .get({
      uri:       encodeURI(url),
      transform: (body, res) => {
        logger.info(res.statusCode)
        return cheerio.load(body)
      }
    })
    .then($ => {
      logger.info('Retrieve and process data.')
      return $
    })
    .catch(errors.StatusCodeError, reason => {
      logger.warn(`Status code: ${reason.statusCode}`)
      logger.error(reason)
    })
    .catch(errors.RequestError, reason => {
      logger.error(`Request error.`)
      logger.error(reason)
    })
}

module.exports = loader
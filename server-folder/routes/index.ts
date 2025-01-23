import express from 'express'

import userRoutes from '../controllers/user'
import adminRoutes from '../controllers/admin'
import { errorHandler as defaultErrorHandler, PageNotFoundHandler } from '../middlewares/errorHandler'
import { createResource } from '../routes/resourceHelper'

export default (app: express.Application) => {
  const router = express.Router({ caseSensitive: true, mergeParams: true })
  router.use('/user', createResource(userRoutes))
  router.use('/admin', createResource(adminRoutes))

  // Mount with version
  router.use(PageNotFoundHandler)
  router.use(defaultErrorHandler)

  app.use('/api', router)
}

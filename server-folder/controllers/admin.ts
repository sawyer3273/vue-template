import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import { errorHandler } from '../middlewares/errorHandler';
import { afterSignupAuth, isAdmin, validationMiddleware } from '../middlewares/common';
import { generateUniqueString } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { timewebService } from '~/utils/services/timeweb.service'



export async function uploadFile(req: Request, ress: Response, _next: NextFunction) {
  try {
    if (req.file) {
      let name = generateUniqueString() + '.' + req.file.originalname.split('.')[1]
      let type = req.body.type
      if (process.env.UPLOAD_SANDBOX) {
        type = 'sandbox/' + type
      }
      let upload = await timewebService.uploadFile(req.file, type, name)
      if (req.body.toDelete) {
        await timewebService.removeFile(req.body.toDelete, type)
      }
      return ress.json({
        success: true,
        data: upload
      });
    } else {
      return ress.json({
        success: false,
      });
    }
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, ress)
  }
}




// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/upload', handler: [afterSignupAuth, upload.single('file'), uploadFile] },
   
    
  ],
}

export default routes

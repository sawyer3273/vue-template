import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import { errorHandler } from '../middlewares/errorHandler';
import { afterSignupAuthNext, isAdmin, validationMiddleware } from '../middlewares/common';
import { generateUniqueString } from '../lib/helpers';
import { generateUserTokens } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { gpx } from "@tmcw/togeojson";
import { DOMParser } from 'xmldom'
import prisma from '~/tools/prisma';
import {register} from '~/server-folder/lib/helpers'

export async function parseTrack(req: any, ress: Response, _next: NextFunction) {
  try {
    if (req.files) {
      let data: any = []
      let time = new Date().getTime() 

     console.log('start',req.files.length)
      let allCoords: any = []
      let promises = []
      for (let i = 0; i < req.files.length; i++) {
        promises[i] = new Promise((resolve) => {
          try {
            let dataGPX = new DOMParser().parseFromString(req.files[i].buffer.toString(), 'text/xml')
            const converted: any = gpx(dataGPX);
            resolve(converted);
          } catch (err) {
            resolve([])
          }
        })
      }
      let result: any = await Promise.all(promises)
      
      for (let i = 0; i < result.length; i++) {
        let converted = result[i]
        let allCoordinates = converted.features[0].geometry.coordinates.map((item: any) => [item[1], item[0]])
        let someCoordinates = allCoordinates.filter((item: any, index: number) => index % Math.ceil(allCoordinates.length / 50) == 0)
        let centerMap = [allCoordinates[0][0] + (allCoordinates[allCoordinates.length - 1][0] - allCoordinates[0][0]) / 2, allCoordinates[0][1] + (allCoordinates[allCoordinates.length - 1][1] - allCoordinates[0][1]) / 2]
        let props = converted.features[0].properties
        allCoords = allCoords.concat(someCoordinates)
        data.push({date: props.time, title: props.name, all: allCoordinates, start: allCoordinates[0], end: allCoordinates[allCoordinates.length - 1], some: someCoordinates, center: centerMap})
      }
      
    
    let centerMapGeneral = [42,42]

    let time2 = new Date().getTime() 
    console.log('end',time2- time)
    return ress.json({
        success: true,
        data: data,
        allCoords,
        centerMapGeneral
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

export async function addHike(req: Request, res: Response, _next: NextFunction) {
  try {
    let user: any
    let userID = res?.locals?.auth?.id
    if (userID ) {
      let dataUser = await prisma.user.findFirst({
        where: {
          id: res.locals.auth.id
        },
      })
      user = {
        success: true,
        data: dataUser
      }
    } else {
      user = await register(req.body.name, req.body.password)
    }
    if (!user.success || !user.data) {
      return errorHandler( createError(400, user.message || 'Ошибка при регистрации'), req, res)
    }
    let token = userID ? '': await generateUserTokens(user.data, req, res)
    if (req.body.allCoords && req.body.allCoords.length > 0) {
    

      let post = await prisma.post.findFirst({
        where: {
          user_id: user.data.id
        },
      })
      let track: any = await prisma.track.findFirst({
        where: {
          user_id: user.data.id
        },
      })
      if (!post) {
        post = await prisma.post.create({
          data: {
            title: user.data.username,
            text: req.body.text || '',
            date: req.body.date ? new Date(req.body.date) : new Date(),
            user_id: user.data.id
          },
        });
        track = await prisma.track.create({
          data: {
            post_id: post.id,
            user_id: user.data.id,
            centerLng: 43.5,
            centerLat: 42
          },
        });
      } else {
        await prisma.coordinate.deleteMany ({
          where: {
            user_id: user.data.id
          }
        })
      }
    
    
    
    let promises = []
    for (let i = 0; i < req.body.allCoords.length; i++) {
      promises[i] = new Promise((resolve) => {
        try {
          let qwe =  prisma.coordinate.create({
            data: {
              user_id: user.data.id,
              lng: req.body.allCoords[i][0],
              lat: req.body.allCoords[i][1],
              track_id: track.id
            },
          });
          resolve(qwe);
        } catch (err) {
          resolve(false)
        }
      })
    }
    let test = await Promise.all(promises)

    return res.json({
        success: true,
        token,
        user: user.data
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

export async function getUserCooridates(req: Request, res: Response, _next: NextFunction) {
  try {
    
    let data = await prisma.coordinate.findMany({where: {user_id: res.locals.auth.id}})
    data = data.map((item: any) => [item.lng, item.lat])
    console.log('data',data)
    return res.json({
        success: true,
        data
      });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}
export async function getMaps(req: Request, res: Response, _next: NextFunction) {
  try {
    
    let data = await prisma.post.findMany({where: {}})
   
    return res.json({
        success: !!data,
        data
      });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

export async function getMap(req: Request, res: Response, _next: NextFunction) {
  try {
    
    let data = await prisma.track.findFirst({where: {user_id: parseInt(req.query.id)}, include: {Coordinates: true}})
    if (data) {
      data.Coordinates = data.Coordinates.map((item: any) => [item.lng, item.lat])
    }
    return res.json({
        success: !!data,
        data
      });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}
// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/add', handler: [afterSignupAuthNext, addHike] },
    { method: 'post', path: '/parseTrack', handler: [ upload.array('file[]', 50), parseTrack] },
    { method: 'get', path: '/userCoordinates', handler: [ getUserCooridates] },
    { method: 'get', path: '/maps', handler: [ getMaps] },
    { method: 'get', path: '/map', handler: [ getMap] },
    
   
    
  ],
}

export default routes

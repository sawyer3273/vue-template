import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import { errorHandler } from '../middlewares/errorHandler';
import { afterSignupAuth, isAdmin, validationMiddleware } from '../middlewares/common';
import { generateUniqueString } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { gpx } from "@tmcw/togeojson";
import { DOMParser } from 'xmldom'
import prisma from '~/tools/prisma';


export async function parseTrack(req: any, ress: Response, _next: NextFunction) {
  try {
    if (req.files) {
      let data: any = []
      let time = new Date().getTime() 

     console.log('req',req.files)
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
      console.log('result',result)
      
      for (let i = 0; i < result.length; i++) {
        let converted = result[i]
        let allCoordinates = converted.features[0].geometry.coordinates.map((item: any) => [item[1], item[0]])
        console.log('allCoordinates',allCoordinates)
        console.log('Math.floor(allCoordinates.length / 100)',Math.ceil(allCoordinates.length / 50))
        let someCoordinates = allCoordinates.filter((item: any, index: number) => index % Math.ceil(allCoordinates.length / 50) == 0)
        let centerMap = [allCoordinates[0][0] + (allCoordinates[allCoordinates.length - 1][0] - allCoordinates[0][0]) / 2, allCoordinates[0][1] + (allCoordinates[allCoordinates.length - 1][1] - allCoordinates[0][1]) / 2]
        let props = converted.features[0].properties
        allCoords = allCoords.concat(someCoordinates)
        data.push({date: props.time, title: props.name, all: allCoordinates, start: allCoordinates[0], end: allCoordinates[allCoordinates.length - 1], some: someCoordinates, center: centerMap})
      }
      
    
    let centerMapGeneral = [42,42]

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

    console.log('req.body',req.body)
    if (req.body.allCoords && req.body.allCoords.length > 0) {
    
     console.log('req',req.body.allCoords)

   
    let post = await prisma.post.create({
      data: {
        title: req.body.name,
        text: req.body.text || '',
        date: req.body.date ? new Date(req.body.date) : new Date(),
       // user_id: res.locals.auth.id
      },
    });
    
    let track = await prisma.track.create({
      data: {
        post_id: post.id,
      //  user_id: res.locals.auth.id,
        centerLng: 43.5,
        centerLat: 42
      },
    });
    
    let promises = []
    for (let i = 0; i < req.body.allCoords.length; i++) {
      promises[i] = new Promise((resolve) => {
        try {
          let qwe =  prisma.coordinate.create({
            data: {
              //user_id: res.locals.auth.id,
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
    
    let data = await prisma.track.findFirst({where: {post_id: parseInt(req.query.id)}, include: {Coordinates: true}})
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
    { method: 'post', path: '/add', handler: [addHike] },
    { method: 'post', path: '/parseTrack', handler: [ upload.array('file[]', 50), parseTrack] },
    { method: 'get', path: '/userCoordinates', handler: [ getUserCooridates] },
    { method: 'get', path: '/maps', handler: [ getMaps] },
    { method: 'get', path: '/map', handler: [ getMap] },
    
   
    
  ],
}

export default routes

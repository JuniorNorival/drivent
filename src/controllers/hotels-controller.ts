import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-services";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotels = await hotelsService.getAllHotels(userId);

    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "ForbidenError") {
      return res.status(httpStatus.FORBIDDEN).send(error.message);
    }
    if (error.name === "RequestError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);
  if (!hotelId || isNaN(hotelId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    const rooms = await hotelsService.getHotelRooms(userId, hotelId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === "ForbidenError") {
      return res.status(httpStatus.FORBIDDEN).send(error.message);
    }
    if (error.name === "RequestError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

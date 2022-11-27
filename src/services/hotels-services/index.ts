import { forbiddenError, notFoundError, requestError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";

async function verifyPaymentAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  const payment = await paymentRepository.findPaymentByTicketId(ticket.id);
  if (ticket.status === TicketStatus.RESERVED || !payment) {
    throw requestError(httpStatus.PAYMENT_REQUIRED, "PAYMENT_REQUIRED");
  }
  if (!ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
}

async function getAllHotels(userId: number) {
  await verifyPaymentAndTicket(userId);

  const AllHotels = await hotelRepository.findHotels();
  return AllHotels;
}

async function getHotelRooms(userId: number, hotelId: number) {
  await verifyPaymentAndTicket(userId);

  const hotelRooms = await hotelRepository.findRoomsByHotel(hotelId);
  if (!hotelRooms) {
    throw notFoundError();
  }
}

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};
export default hotelsService;

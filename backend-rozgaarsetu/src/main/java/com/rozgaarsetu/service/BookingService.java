package com.rozgaarsetu.service;

import com.rozgaarsetu.dto.BookingRequest;
import com.rozgaarsetu.dto.BookingResponse;
import com.rozgaarsetu.dto.UserDto;
import com.rozgaarsetu.entity.Booking;
import com.rozgaarsetu.entity.BookingStatus;
import com.rozgaarsetu.entity.User;
import com.rozgaarsetu.exception.BadRequestException;
import com.rozgaarsetu.exception.ResourceNotFoundException;
import com.rozgaarsetu.repository.BookingRepository;
import com.rozgaarsetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(Long clientId, BookingRequest request) {
        User client = getUserById(clientId);
        User worker = getUserById(request.getWorkerId());

        if (client.getId().equals(worker.getId())) {
            throw new BadRequestException("You cannot book yourself.");
        }

        Booking booking = Booking.builder()
                .client(client)
                .worker(worker)
                .location(request.getLocation())
                .amount(request.getAmount())
                .status(BookingStatus.PENDING)
                .isPaid(false)
                .build();

        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse acceptBooking(Long workerId, Long bookingId) {
        Booking booking = getBookingValidatingWorker(bookingId, workerId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be accepted. Current: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse startWork(Long workerId, Long bookingId, String beforePhotoUrl) {
        Booking booking = getBookingValidatingWorker(bookingId, workerId);

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new BadRequestException("Only ACCEPTED bookings can be started. Current: " + booking.getStatus());
        }

        if (beforePhotoUrl == null || beforePhotoUrl.isBlank()) {
            throw new BadRequestException("Before-photo URL must be provided to start work.");
        }

        booking.setStatus(BookingStatus.IN_PROGRESS);
        booking.setBeforePhotoUrl(beforePhotoUrl);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse completeWork(Long workerId, Long bookingId, String afterPhotoUrl) {
        Booking booking = getBookingValidatingWorker(bookingId, workerId);

        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new BadRequestException("Only IN_PROGRESS bookings can be finished. Current: " + booking.getStatus());
        }

        if (afterPhotoUrl == null || afterPhotoUrl.isBlank()) {
            throw new BadRequestException("After-photo URL must be provided to finish work.");
        }

        booking.setStatus(BookingStatus.APPROVAL_PENDING);
        booking.setAfterPhotoUrl(afterPhotoUrl);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse confirmPayment(Long clientId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getClient().getId().equals(clientId)) {
            throw new BadRequestException("You are not authorized to confirm payment for this booking.");
        }

        if (booking.getStatus() != BookingStatus.APPROVAL_PENDING) {
            throw new BadRequestException("Booking must be in APPROVAL_PENDING state. Current: " + booking.getStatus());
        }

        booking.setIsPaid(true);
        booking.setStatus(BookingStatus.COMPLETED);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getClientBookings(Long clientId) {
        return bookingRepository.findByClientIdOrderByBookingDateDesc(clientId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getWorkerBookings(Long workerId) {
        return bookingRepository.findByWorkerIdOrderByBookingDateDesc(workerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    private Booking getBookingValidatingWorker(Long bookingId, Long workerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getWorker().getId().equals(workerId)) {
            throw new BadRequestException("You are not the assigned worker for this booking.");
        }
        return booking;
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .status(booking.getStatus().name())
                .bookingDate(booking.getBookingDate())
                .location(booking.getLocation())
                .beforePhotoUrl(booking.getBeforePhotoUrl())
                .afterPhotoUrl(booking.getAfterPhotoUrl())
                .amount(booking.getAmount())
                .isPaid(booking.getIsPaid())
                .createdAt(booking.getCreatedAt())
                .client(mapToUserDto(booking.getClient()))
                .worker(mapToUserDto(booking.getWorker()))
                .build();
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole().name().replace("ROLE_", ""))
                .category(user.getCategory())
                .averageRating(user.getAverageRating())
                .build();
    }
}

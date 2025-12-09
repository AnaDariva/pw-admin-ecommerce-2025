package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import br.edu.utfpr.pb.pw44s.server.service.MailService;
import org.modelmapper.ModelMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    private final MailService mailService;
    private final AuthService authService;

    public AdminOrderController(OrderRepository orderRepository,
                                ModelMapper modelMapper,
                                MailService mailService,
                                AuthService authService) {
        this.orderRepository = orderRepository;
        this.modelMapper = modelMapper;
        this.mailService = mailService;
        this.authService = authService;
    }

    @GetMapping
    public List<OrderDTO> listOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customer,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {

        List<Order> all = orderRepository.findAll();

        Stream<Order> stream = all.stream();

        if (status != null && !status.isBlank()) {
            try {
                OrderStatus st = OrderStatus.valueOf(status);
                stream = stream.filter(o -> o.getStatus() == st);
            } catch (IllegalArgumentException e) {
                System.err.printf("Status inválido recebido em /admin/orders: %s%n", status);
            }
        }

        if (customer != null && !customer.isBlank()) {
            String term = customer.toLowerCase();
            stream = stream.filter(o -> {
                if (o.getUser() == null) return false;
                String name = o.getUser().getDisplayName() != null
                        ? o.getUser().getDisplayName().toLowerCase()
                        : "";
                String email = o.getUser().getUsername() != null
                        ? o.getUser().getUsername().toLowerCase()
                        : "";
                return name.contains(term) || email.contains(term);
            });
        }

        if (from != null) {
            stream = stream.filter(o ->
                    o.getOrderDate() != null &&
                            !o.getOrderDate().toLocalDate().isBefore(from)
            );
        }

        if (to != null) {
            stream = stream.filter(o ->
                    o.getOrderDate() != null &&
                            !o.getOrderDate().toLocalDate().isAfter(to)
            );
        }

        return stream
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public OrderDTO getOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pedido não encontrado"
                ));
        return modelMapper.map(order, OrderDTO.class);
    }

    public record UpdateStatusRequest(String newStatus) { }

    @PutMapping("/{id}/status")
    public OrderDTO updateStatus(@PathVariable Long id,
                                 @RequestBody UpdateStatusRequest request) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Pedido não encontrado"
                ));

        OrderStatus oldStatus = order.getStatus();

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(request.newStatus());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status inválido: " + request.newStatus()
            );
        }

        if (oldStatus == newStatus) {
            System.out.printf(
                    ">>> Pedido #%d já estava no status %s. Nenhuma alteração realizada.%n",
                    order.getId(), oldStatus
            );
            return modelMapper.map(order, OrderDTO.class);
        }

        order.setStatus(newStatus);
        order = orderRepository.save(order);

        var admin = authService.getAuthenticatedUser();
        String adminUsername = admin != null ? admin.getUsername() : "desconhecido";

        System.out.printf(
                ">>> Pedido #%d: status alterado de %s para %s por %s%n",
                order.getId(), oldStatus, newStatus, adminUsername
        );

        try {
            mailService.sendOrderStatusChangedEmail(order, oldStatus, newStatus);
        } catch (Exception e) {
            System.err.printf(
                    "Falha ao enviar e-mail de atualização do pedido #%d: %s%n",
                    order.getId(), e.getMessage()
            );
        }

        return modelMapper.map(order, OrderDTO.class);
    }

    public record OrderStatsDTO(
            long aguardandoPagamento,
            long pago,
            long emTransporte,
            long concluido,
            long cancelado
    ) { }

    @GetMapping("/stats")
    public OrderStatsDTO getStats() {
        List<Order> all = orderRepository.findAll();

        long aguardando = all.stream().filter(o -> o.getStatus() == OrderStatus.AGUARDANDO_PAGAMENTO).count();
        long pago = all.stream().filter(o -> o.getStatus() == OrderStatus.PAGO).count();
        long emTransporte = all.stream().filter(o -> o.getStatus() == OrderStatus.EM_TRANSPORTE).count();
        long concluido = all.stream().filter(o -> o.getStatus() == OrderStatus.CONCLUIDO).count();
        long cancelado = all.stream().filter(o -> o.getStatus() == OrderStatus.CANCELADO).count();

        return new OrderStatsDTO(aguardando, pago, emTransporte, concluido, cancelado);
    }
}

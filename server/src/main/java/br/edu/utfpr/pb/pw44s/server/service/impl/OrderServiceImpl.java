package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {

    private final OrderRepository orderRepository;
    private final AuthService authService;

    public OrderServiceImpl(OrderRepository orderRepository, AuthService authService) {
        this.orderRepository = orderRepository;
        this.authService = authService;
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return this.orderRepository;
    }

    @Override
    public Order save(Order order) {


        User user = authService.getAuthenticatedUser();
        order.setUser(user);


        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }


        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.AGUARDANDO_PAGAMENTO);
        }


        BigDecimal total = BigDecimal.ZERO;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {

                BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal quantity = BigDecimal.valueOf(item.getQuantity() != null ? item.getQuantity() : 0);

                BigDecimal itemTotal = unitPrice.multiply(quantity);
                total = total.add(itemTotal);

                item.setOrder(order);

                if (item.getProduct() != null) {
                    item.setProductName(item.getProduct().getName());
                    item.setProductImageUrl(item.getProduct().getImageUrl());
                } else {
                    item.setProductName(item.getProductName() != null ? item.getProductName() : "Produto Desconhecido");
                    item.setProductImageUrl(item.getProductImageUrl() != null ? item.getProductImageUrl() : "");
                }
            }
        }
        order.setTotalAmount(total.setScale(2, RoundingMode.HALF_UP));


        if (order.getShippingAddressStreet() == null) order.setShippingAddressStreet("");
        if (order.getShippingAddressNumber() == null) order.setShippingAddressNumber("");
        if (order.getShippingAddressNeighborhood() == null) order.setShippingAddressNeighborhood("");
        if (order.getShippingAddressCity() == null) order.setShippingAddressCity("");
        if (order.getShippingAddressState() == null) order.setShippingAddressState("");
        if (order.getShippingAddressZipCode() == null) order.setShippingAddressZipCode("");
        if (order.getPaymentMethodType() == null) order.setPaymentMethodType("");
        if (order.getPaymentMethodDetails() == null) order.setPaymentMethodDetails("");

        return getRepository().save(order);
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}

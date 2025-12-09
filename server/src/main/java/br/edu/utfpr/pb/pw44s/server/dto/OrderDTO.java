package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private String orderDate;
    private BigDecimal totalAmount;
    private String status;

    private String paymentMethodType;
    private String paymentMethodDetails;

    private String shippingAddressStreet;
    private String shippingAddressNumber;
    private String shippingAddressComplement;
    private String shippingAddressNeighborhood;
    private String shippingAddressCity;
    private String shippingAddressState;
    private String shippingAddressZipCode;
    private List<OrderStatusHistoryDTO> history;
    private Long userId;

    private List<OrderItemDTO> items;
}

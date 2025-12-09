package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tb_order")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDocument> documents;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderStatusHistory> history;

    @Column(nullable = false)
    private String shippingAddressStreet;

    @Column(nullable = false)
    private String shippingAddressNumber;

    private String shippingAddressComplement;

    @Column(nullable = false)
    private String shippingAddressNeighborhood;

    @Column(nullable = false)
    private String shippingAddressCity;

    @Column(nullable = false)
    private String shippingAddressState;

    @Column(nullable = false)
    private String shippingAddressZipCode;

    @Column(nullable = false)
    private String paymentMethodType;

    @Column(nullable = false)
    private String paymentMethodDetails;

    @PrePersist
    protected void onCreate() {
        if (this.orderDate == null) {
            this.orderDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = OrderStatus.AGUARDANDO_PAGAMENTO;
        }
    }
}
